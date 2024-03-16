from flask import Flask, request, jsonify, send_file
from openai import OpenAI
from flask_cors import CORS  # Import the CORS class
from gradio_client import Client

app = Flask(__name__)
CORS(app)

speech_file_path = "/home/gigagen/speech.mp3"

client = OpenAI(
    api_key = "Enter API Key Here"
)

# Initialize Gradio client
client_gradio = Client("https://elenaryumina-facial-expression-recognition.hf.space/--replicas/t6adx/")

def get_endpoints_info():
    endpoints_info = {
        '/': {
            'methods': ['GET'],
            'description': 'You are here, it will give a description of all available endpoints',
        },
        '/generate_image': {
            'methods': ['POST'],
            'description': 'Generate an image based on a prompt',
            'example_request': {'prompt': 'prompt_here'},
            'example_response': {'image_url': 'you_will_get_generated_image_url_here'}
        },
        '/text_to_speech': {
            'methods': ['POST'],
            'description': 'Convert text to speech',
            'example_request': {'story': 'speech_here'},
            'example_response': 'Audio file'
        },
        '/story_title_generation':{
            'methods': ['POST'],
            'description': 'Generate a title based on a story',
            'example_request': {'story': 'give_story_here'},
            'example_response': {'title': 'you_will_get_title_here'}
        },
        '/website_chatbot':{
            'methods': ['POST'],
            'description': 'Generate a title based on a story',
            'example_request': {'query': 'give_your query_here'},
            'example_response': {'reply': 'you_will_get_answer_here'}
        },
        '/chat':{
            'methods': ['POST'],
            'description':'Chat with Bhagavad Gita Bot',
            'example_request': {'user_input': 'user_input_here'},
            'example_response': {'response': 'bot_response_here'},
        },
        '/health_query':{
            'methods': ['POST'],
            'description':'Respond to health queries',
            'example_request': {'health_query': 'health_query_here'},
            'example_response': {'response': 'bot_response_here'},
        },
        '/suggest_song':{
            'methods': ['POST'],
            'description':'Suggest a song based on user emotion',
            'example_request': {'emotion': 'emotion_here'},
            'example_response': {'response': 'bot_response_here'},
        },
        '/summarize':{
            'methods': ['POST'],
            'description':'Summarize a conversation',
            'example_request': {'user_input': 'conversation_here'},
            'example_response': {'response': 'bot_summary_here'},
        },
        '/emotion_to_story':{
            'methods': ['POST'],
            'description':'Generate a story based on user emotion',
            'example_request': {'emotion': 'emotion_here'},
            'example_response': {'story': 'generated_story_here'},
        },
    }
    return endpoints_info


@app.route('/', methods=['GET'])
def show_endpoints_info():
    return jsonify(get_endpoints_info())

@app.route('/welcome', methods=['GET'])
def welcome():
    return jsonify({'welcome':"Welcome"})

@app.route('/generate_image', methods=['POST'])
def generate_image():
    data = request.get_json()
    prompt = data.get('prompt', '')
    size = data.get('size', '1024x1024')
    quality = data.get('quality', 'standard')
    n = data.get('n', 1)

    response = client.images.generate(
        model="dall-e-2",
        prompt=prompt,
        size=size,
        quality=quality,
        n=n,
    )

    if response:
        image_url = response.data[0].url
        return jsonify({'image_url':image_url})
    else:
        return jsonify({'error': 'Failed to generate image'}), 500

@app.route('/text_to_speech', methods=['POST'])
def text_to_speech():
    data = request.get_json()
    story = data.get('story', '')
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=story
    )
    response.stream_to_file(speech_file_path)
    return send_file(speech_file_path, as_attachment=True)

@app.route('/story_title_generation',methods=['POST'])
def generate_story_title():
    data = request.get_json()
    story = data.get('story','')
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
                    {"role": "system", "content": story},
                    {"role": "user", "content": "Give a suitable title for the story."}
        ]
        )
    title = completion.choices[0].message.content
    return jsonify({'title':title})

#NEW ADDED HackOverflow@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

import openai

# Set your OpenAI API key
openai.api_key = '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'

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('user_input', '')

    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        # {"role": "system", "content": """I have diarrhea from 2 days"""},#Input here
        {"role": "user", "content": f"""
            Bhagavad Gita Bot: {user_input.strip()}

            Instructions:
            1. Respond to user input in the style and tone of the Bhagavad Gita.
            2. Provide spiritual guidance and wisdom based on the teachings of the Bhagavad Gita.
            3. Provide the user a mental relief based on bhagavad git which help  release his stress

            User Input: {user_input.strip()}
            Bot Response:"""}
      ]
    )

    result_query = completion.choices[0].message.content #Output

    # Return generated response
    return jsonify({'response': result_query})

@app.route('/health_query', methods=['POST'])
def health_query():
    data = request.get_json()
    health_query = data.get('health_query', '')

    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": health_query.strip()},#Input here
        {"role": "user", "content": "Address the given problem as a medical professional. Avoid the term medical professional in the response"}
        ]
    )

    result_query = completion.choices[0].message.content #Output

    # Return generated response
    return jsonify({'response': result_query})


@app.route('/suggest_song', methods=['POST'])
def suggest_song():
    data = request.get_json()
    emotion = data.get('emotion', '')

    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": f"I am {emotion}"},#Input here
        {"role": "user", "content": "Can you suggest me one song or one video for my emotion? Just reply with the title of it."}
        ]
    )

    result_query = completion.choices[0].message.content #Output

    # Return generated response
    return jsonify({'response': result_query})


@app.route('/summarize', methods=['POST'])
def get_obj():
    data = request.get_json()
    obj = data.get('user_input','')
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        # {"role": "system", "content": f"This is the conversation between a human and a query bot in json format: {obj}"},#Input here
        {"role": "user", "content": f"Can you summarize this conversation in less than 100 words? Conversation: {obj}"}
        ]
    )
    result_query = completion.choices[0].message.content #Output

    # Return generated response
    return jsonify({'response': result_query})

@app.route('/emotion_to_story', methods = ['POST'])
def emotion_to_story():
    data = request.get_json()
    moral_values = data.get('emotion','')
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
          {"role": "system", "content": moral_values},
          {"role": "user", "content": "Generate a short story set in India like an expert without using the words in the prompt for the above emotion. The story is for a person who is having this emotion. Please keep the story under 200 words. Dont use the same adjectives when generated every time.You can use fantasy but not everytime."}
        ]
    )
    story = completion.choices[0].message.content
    print(story)
    return jsonify({'story': story})

@app.route('/predict', methods=['POST'])
def predict_image():
    print(request)
    image_file = request.files['image']

    temp_image_path = r'D:\Hackathon\HO\temp_image.png'  # Update this path as per your requirement
    image_file.save(temp_image_path)
    
    result = client_gradio.predict(temp_image_path, api_name="/preprocess_image_and_predict")
    
    label = result[2]['label']
    
    return jsonify({'label': label})

if __name__ == '__main__':
    # Run the app on localhost and your IP address, on port 8080
    app.run(debug=True, host='0.0.0.0', port=8080,use_reloader=False)

