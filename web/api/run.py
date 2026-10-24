"""Función serverless de Vercel (Python): POST /api/run  {"gates": ["h","h"], "shots": 10, "seed": 3}"""
import json
import os
import sys
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(__file__))
from _qrun import run_circuit  # noqa: E402


class handler(BaseHTTPRequestHandler):
    def _send(self, code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "content-type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send(204, {})

    def do_GET(self):
        self._send(200, run_circuit(["h"], 10, 0) | {"hint": "usa POST con {gates, shots, seed}"})

    def do_POST(self):
        try:
            n = int(self.headers.get("Content-Length", 0))
            data = json.loads(self.rfile.read(n) or b"{}")
            self._send(200, run_circuit(data.get("gates", []), int(data.get("shots", 10)), int(data.get("seed", 0))))
        except (ValueError, TypeError, json.JSONDecodeError) as e:
            self._send(400, {"error": str(e)})
