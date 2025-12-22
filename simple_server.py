import http.server
import socketserver
import os

PORT = 5000

os.chdir(r'c:\workspace\star_track_python\pocketedu')

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"서버가 실행 중입니다!")
    print(f"브라우저에서 http://localhost:{PORT}/templates/index.html 로 접속하세요")
    print("종료하려면 Ctrl+C를 누르세요")
    httpd.serve_forever()










