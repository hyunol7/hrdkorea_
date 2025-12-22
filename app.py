from flask import Flask, render_template, request, jsonify
from datetime import datetime
import os
from supabase import create_client, Client

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.jinja_env.auto_reload = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['SECRET_KEY'] = 'pocketedu-secret-key-2025'

# Supabase 클라이언트 초기화
SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except:
        pass

@app.route('/')
def index():
    """메인 페이지"""
    return render_template('index.html')

@app.route('/consultation', methods=['POST'])
def consultation():
    """상담 문의 저장"""
    try:
        data = request.get_json()
        
        company_name = data.get('company_name', '').strip()
        contact_number = data.get('contact_number', '').strip()
        manager_name = data.get('manager_name', '').strip()
        inquiry_content = data.get('inquiry_content', '').strip()
        
        # 필수 필드 검증
        if not company_name or not contact_number or not manager_name:
            return jsonify({
                'status': 'error',
                'message': '기업명, 연락처, 담당자 성함은 필수 입력 항목입니다.'
            }), 400
        
        # Supabase에 저장
        if supabase:
            consultation_data = {
                'company_name': company_name,
                'contact_number': contact_number,
                'manager_name': manager_name,
                'inquiry_content': inquiry_content,
                'created_at': datetime.utcnow().isoformat()
            }
            
            result = supabase.table('pocketedu_consultations').insert(consultation_data).execute()
            
            return jsonify({
                'status': 'success',
                'message': '상담 문의가 성공적으로 접수되었습니다!',
                'data': result.data[0] if result.data else {}
            })
        else:
            return jsonify({
                'status': 'success',
                'message': '상담 문의가 접수되었습니다. (개발 모드)'
            })
    
    except Exception as e:
        print(f"오류: {e}")
        return jsonify({
            'status': 'error',
            'message': '문의 전송 중 오류가 발생했습니다.'
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
