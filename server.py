import http.server
import socketserver
import threading
import os
import sys

# Ensure current working directory is the site root
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class CacheFreeHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server(port):
    try:
        socketserver.ThreadingTCPServer.allow_reuse_address = True
        socketserver.ThreadingTCPServer.daemon_threads = True
        with socketserver.ThreadingTCPServer(("", port), CacheFreeHandler) as httpd:
            print(f"[ACTIVE] Serving HOMLine website at http://localhost:{port}/")
            httpd.serve_forever()
    except Exception as e:
        print(f"[PORT {port}]: {e}")

if __name__ == '__main__':
    # Listen on port 8000 in background thread
    t8000 = threading.Thread(target=run_server, args=(8000,), daemon=True)
    t8000.start()

    # Listen on port 8080 on main thread
    run_server(8080)
