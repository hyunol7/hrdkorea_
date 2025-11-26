from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    """메인 페이지"""
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    """문의 폼 처리"""
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        company = request.form.get('company', '')
        message = request.form.get('message')
        
        # 콘솔에 문의 내용 출력 (실제로는 DB 저장이나 이메일 발송)
        print("=" * 50)
        print("새로운 문의가 접수되었습니다!")
        print(f"이름: {name}")
        print(f"이메일: {email}")
        print(f"회사: {company}")
        print(f"문의내용: {message}")
        print("=" * 50)
        
        return jsonify({
            'status': 'success',
            'message': '문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다!'
        })
    
    except Exception as e:
        print(f"오류 발생: {e}")
        return jsonify({
            'status': 'error',
            'message': '문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.'
        }), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    print("포켓에듀 랜딩페이지 서버를 시작합니다...")
    print(f"브라우저에서 http://localhost:{port} 으로 접속하세요!")
    app.run(debug=False, host='0.0.0.0', port=port)
