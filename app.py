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

@app.route('/')
def start():
    return render_template('start.html')

@app.route('/consultant_gender')
def consultant_gender():
    return render_template('consultant_gender.html')

@app.route('/scenario')
def scenario():
    return render_template('scenario_btn4.html')

@app.route('/sc_change')
def sc_change():
    return render_template('sc_change.html')

@app.route('/sc_combine')
def sc_combine():
    return render_template('sc_combine.html')

@app.route('/sc_membership')
def sc_membership():
    return render_template('sc_membership.html')

@app.route('/sc_roaming')
def sc_roaming():
    return render_template('sc_roaming.html')

@app.route('/api/stream_message1')
def stream_message():
    messages = [
        "Hello, this is {consultant_name} from KT. How can I help you?",
        "Hello. I would like to change my plan.",
        "Ah, I see. Which plan would you like to change to?",
        "I would like to use a plan that costs around 60,000 KRW(40 EUR)"
    ]
    return jsonify({"messages": messages})

@app.route('/api/stream_message2')
def stream_message2():
    messages = [
        "Hello, this is {consultant_name} from KT. How can I help you?",
        "I would like to combine two family mobile phones. What types of bundles are available?"
    ]
    return jsonify({"messages": messages})  

@app.route('/api/stream_message3')
def stream_message3():
    messages = [
        "Hello, this is {consultant_name} from KT. How can I help you?",
        "I don't know how to use the Membership \"VIP Choice\", so I haven't been able to use it. Can it be used multiple times?"
    ]
    return jsonify({"messages": messages})

@app.route('/api/stream_message4')
def stream_message4():
    messages = [
        "Hello, this is {consultant_name} from KT. How can I help you?",
        "Yes, hello. I would like to apply for roaming.",
        "Oh, I see. What country will you be using roaming in, and what are the dates you need it for?",
        "I plan to go to the Spain and need it from January 15 to January 24, in Korean time. Please recommend suitable roaming services. For your reference, I expect to use a lot of data."
    ]
    return jsonify({"messages": messages})

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
    "answer2_1": """If you want to combine two family mobile phones, 
you can consider the \"Family Wireless Bundle\"\n
**Family Wireless Bundle**: \n
It is designed for individuals, individual business owners, and foreigners, and is available for users of LTE, 3G, 5G plans, and special plans. The eligible family relationships include direct descendants and siblings of the primary account holder and their spouse, with a maximum of five lines that can be combined.
When bundled, monthly discounts will be applied to each line.""",
    "answer2_2": """The discount for the \"Family Wireless Bundle\" ranges from a minimum of 1,100 KRW(1 EUR) to a maximum of 11,000 KRW(7 EUR), 
    depending on the monthly fee of the mobile plan. The discount is applied for 24 months (730 days), 
    and once the verification eligibility is completed within the month of the bundle application, 
    the discount starts from the date of application.\n
    To maintain the bundle group, it is required to have at least two lines if only one line remains, the bundle will be terminated.""",
    "answer3": """The \"VIP Choice\" can be used a total of 6 times per year, allowing for one use each month.\n
To use the VIP Choice, you need to navigate to the KT Membership app and go to More > VIP > VIP Choice menu, or visit the KT.COM website and go to Benefits > Membership Benefits > VIP Membership > VIP Choice menu.\n
When using benefits that require reservations, a button will be activated to go to the reservation page. For benefits that require a coupon, a button will be activated to go to the coupon issuance page. Please note that benefits may not be available at all partner stores, so you should check for eligible stores using the [Find Merchant] option on the KT.COM guide page before visiting.\n
    """,
    "answer4": """For your trip to the Spain, \n
I recommend the \"All-Day Roaming Premium\" and \"All-Day Roaming Plus\" services.\n
1. **All-Day Roaming Premium**\n
   - Usage Period: Based on a one-day period, it is applicable from the application date/time in Korean time for a duration of 24 hours.\n
   - Fee: The daily usage fee is 15,000 KRW, and charges will not be incurred if data is not used.\n
2. **All-Day Roaming Plus**\n
   - Usage Period: Based on a one-day period, it is applicable from the application date/time in Korean time for a duration of 24 hours.\n
   - Fee: The daily usage fee is 13,000 KRW, and charges will not be incurred if data is not used.\n
   - Provided Data: It provides 800MB of data daily, after which usage is available at speeds of 1Mbps or lower.\n
Both of these services are suitable if you expect to use a lot of data while in the United States, and you can choose according to your needs.""" 
}

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
    app.run(debug=True, use_reloader=True, port=5005) 