from flask import Flask, render_template, jsonify, url_for
import time

app = Flask(__name__, 
    static_url_path='/static',
    static_folder='static'
)

@app.context_processor
def utility_processor():
    return dict(url_for=url_for)

# LLM 응답을 시뮬레이션하기 위한 샘플 답변
llm_responses = {
    "answer1": "고객님의 데이터 사용량을 고려했을 때, '5G 슬림' 요금제를 추천드립니다. 월 3만원대로 매월 5GB의 데이터를 제공하며, 소진 후에도 1Mbps 속도로 무제한 사용이 가능합니다. 현재 요금제 대비 약 30% 정도 절감 효과를 보실 수 있습니다.",
    "answer2": "또는 '5G 라이트' 요금제도 고려해보실 수 있습니다. 월 2만원대로 매월 2GB의 데이터를 제공하며, 추가 데이터가 필요한 경우 데이터 온디맨드 서비스를 통해 필요한 만큼만 구매하실 수 있습니다."
}

@app.route('/')
def start():
    return render_template('start.html')

@app.route('/scenario')
def scenario():
    return render_template('scenario_btn4.html')

@app.route('/main')
def main():
    return render_template('main.html')

@app.route('/api/stream_message')
def stream_message():
    messages = [
        "안녕하세요, AI 지니입니다. 무엇을 도와드릴까요?",
        "안녕하세요. 요금제 문의 좀 드릴려구요. 제가 지금 3기가 정도 사용중인데, 비싼것 같아서 더 저렴한 요금제는 없을까요?"
    ]
    return jsonify({"messages": messages})

@app.route('/api/get_answers')
def get_answers():
    return jsonify(llm_responses)

if __name__ == '__main__':
    app.run(debug=True) 