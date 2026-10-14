from rest_framework.authentication import SessionAuthentication


class CsrfSessionAuthentication(SessionAuthentication):
    """Session auth that enforces CSRF for every unsafe request, anonymous ones included."""

    def authenticate(self, request):
        user = getattr(request._request, 'user', None)
        self.enforce_csrf(request)
        if not user or not user.is_active:
            return None
        return (user, None)
