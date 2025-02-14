from flask import Flask, render_template, jsonify, url_for, send_from_directory, request
import time
import os
import webbrowser

app = Flask(__name__, 
    static_url_path='/static',
    static_folder='static'
)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # 캐시 비활성화

@app.context_processor
def utility_processor():
    return dict(url_for=url_for)

# LLM 응답을 시뮬레이션하기 위한 샘플 답변
llm_responses = {
    "answer1": """The 5G plans in the range of 60,000 KRW(40 EUR) are as follows:\n
1. **5G Slim**\n
   - Monthly Fee: 55,000 KRW(37 EUR)\n
   - Unlimited voice calls and texts\n
   - 300 minutes for video calls and additional calls\n
   - Basic Data: 14GB (after consumption, speed is limited to a maximum of 1Mbps)\n
2. **5G Simple**\n
   - Monthly Fee: 61,000 KRW(41 EUR)\n
   - Unlimited voice calls and texts\n
   - 300 minutes for video calls and additional calls\n
   - Basic Data: 30GB (after consumption, speed is limited to a maximum of 1Mbps)\n
In addition, there are various options for 5G plans, so you can choose according to your needs.""",
    "answer2": "Another option would be our promotional plans that offer special discounts for new subscribers. Would you like to hear about those as well?"
}

@app.route('/')
def start():
    return render_template('start.html')

@app.route('/consultant_gender')
def consultant_gender():
    return render_template('consultant_gender.html')

@app.route('/scenario')
def scenario():
    return render_template('scenario_btn4.html')

@app.route('/main')
def main():
    return render_template('main.html')

@app.route('/api/stream_message')
def stream_message():
    messages = [
        "Hello, this is {consultant_name} from KT. How can I help you?",
        "Hello. I would like to change my plan.",
        "Ah, I see. Which plan would you like to change to?",
        "I would like to use a plan that costs around 60,000 KRW(40 EUR)",
        "Yes, please change my plan to the \"5G Slim\" plan.",
        "Understood. The change to the \"5G Slim\" plan at 55,000 KRW (37 EUR) has been completed. Is there anything else I can assist you with?",
        "No, there isn't anything else.",
        "Yes, thank you. This was {consultant_name} from KT. Have a great day!"
    ]
    return jsonify({"messages": messages})


@app.route('/api/get_answers')
def get_answers():
    return jsonify(llm_responses)

# knwlgFile 디렉토리의 파일을 제공하기 위한 라우트 추가
@app.route('/knwlgFile/<path:filename>')
def serve_knowledge_file(filename):
    # knwlgFile 디렉토리의 절대 경로를 얻습니다
    knowledge_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'knwlgFile')
    # 파일의 디렉토리 경로를 얻습니다
    directory = os.path.dirname(os.path.join(knowledge_dir, filename))
    # 파일 이름만 추출합니다
    file_name = os.path.basename(filename)
    try:
        return send_from_directory(directory, file_name)
    except Exception as e:
        app.logger.error(f"Error serving file {filename}: {str(e)}")
        return f"File not found: {filename}", 404

@app.route('/static/audio/<path:filename>')
def serve_audio(filename):
    return send_from_directory('static/audio', filename)

if __name__ == '__main__':
    webbrowser.open('http://localhost:5005')
    app.run(debug=False, use_reloader=True, port=5005) 