#!/usr/bin/env python3
"""
루이 13세 폐하 공식 웹사이트 로컬 서버
실행: python3 server.py
"""

import http.server
import socketserver
import os
import sys

DEFAULT_PORT = 8080

class RoyalHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # UTF-8 및 캐시 방지 헤더 (개발 편의)
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server(port=DEFAULT_PORT):
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)

    for p in [port, 8000, 8888, 5000]:
        try:
            handler = RoyalHandler
            with socketserver.TCPServer(("", p), handler) as httpd:
                print("=" * 60)
                print(f"👑 루이 13세 폐하의 궁전 웹 서버가 가동되었습니다!")
                print(f"🐾 접속 주소: http://localhost:{p}")
                print(f"🐾 로컬 네트워크: http://127.0.0.1:{p}")
                print("=" * 60)
                print("종료하려면 Ctrl + C 를 누르세요.\n")
                httpd.serve_forever()
                return
        except OSError:
            print(f"포트 {p} 사용 중, 다음 포트로 시도합니다...")
            continue
    print("사용 가능한 포트를 찾지 못했습니다.")

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    try:
        run_server(port)
    except KeyboardInterrupt:
        print("\n👑 루이 13세 궁전 서버를 안전하게 종료합니다. 안녕히 가소서!")
