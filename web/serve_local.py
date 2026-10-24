"""Servidor local del juego (para probar con amigos en la misma red Wi-Fi).
Sirve web/public/ y responde POST /api/run con Qiskit real (igual que en Vercel).
Uso:  python web/serve_local.py [puerto]      -> http://<tu-IP>:8765
"""
import json
import mimetypes
import os
import socket
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "api"))
from _qrun import run_circuit  # noqa: E402

mimetypes.add_type("application/manifest+json", ".webmanifest")
mimetypes.add_type("text/javascript", ".js")


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=os.path.join(HERE, "public"), **k)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def _json(self, code, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path.split("?")[0] != "/api/run":
            return self._json(404, {"error": "no existe"})
        try:
            n = int(self.headers.get("Content-Length", 0))
            d = json.loads(self.rfile.read(n) or b"{}")
            self._json(200, run_circuit(d.get("gates", []), int(d.get("shots", 10)), int(d.get("seed", 0))))
        except (ValueError, TypeError, json.JSONDecodeError) as e:
            self._json(400, {"error": str(e)})

    def log_message(self, *args):
        pass


def lan_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))
        return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        s.close()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    print(f"Local:  http://localhost:{port}\nRed:    http://{lan_ip()}:{port}   (mismo Wi-Fi)\nCtrl+C para detener", flush=True)
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()

