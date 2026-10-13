from functools import wraps
from django.core.cache import cache
from django.http import HttpResponse


def ratelimit(key, limit, window=60, methods=('POST',)):
    """Per-IP fixed-window limit using the default cache.
    ponytail: default cache is per-process LocMem; use a shared cache (Redis) if running several workers."""
    def deco(view):
        @wraps(view)
        def wrapper(request, *args, **kwargs):
            if request.method in methods:
                ip = request.META.get('REMOTE_ADDR', '')
                k = f'rl:{key}:{ip}'
                cache.add(k, 0, window)
                try:
                    n = cache.incr(k)
                except ValueError:
                    n = 1
                if n > limit:
                    return HttpResponse('Too many requests. Please try again shortly.', status=429)
            return view(request, *args, **kwargs)
        return wrapper
    return deco
