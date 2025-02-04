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

@app.route('/scenario')
def scenario():
    return render_template('scenario_btn4.html')

@app.route('/main')
def main():
    return render_template('main.html')

@app.route('/api/stream_message')
def stream_message():
    messages = [
        "Hello, this is AI GENIE from KT. How can I help you?",
        "Hello. I would like to change my plan.",
        "Ah, I see. Which plan would you like to change to?",
        "I would like to use a plan that costs around 60,000 KRW(40 EUR)",
        "Yes, please change my plan to the \"5G Slim\" plan.",
        "Understood. The change to the \"5G Slim\" plan at 55,000 KRW (37 EUR) has been completed. Is there anything else I can assist you with?",
        "No, there isn't anything else.",
        "Yes, thank you. This was AI GENIE from KT. Have a great day!"
    ]
    return jsonify({"messages": messages})

@app.route('/api/get_answers')
def get_answers():
    return jsonify(llm_responses)

if __name__ == '__main__':
    app.run(debug=True) 