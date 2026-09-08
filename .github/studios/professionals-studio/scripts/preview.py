"""Local static preview with fresh assets on every request. No AI API proxy."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=9327)
    args = parser.parse_args()
    source = Path(__file__).resolve().parents[1] / "src"
    handler = partial(PreviewHandler, directory=str(source))
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler)
    print(f"Professionals Studio: http://127.0.0.1:{args.port}/index.html", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
