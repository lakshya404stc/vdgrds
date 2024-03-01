from flask import Flask, request, jsonify
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
import os
import joblib
import requests
import re
from youtube_transcript_api import YouTubeTranscriptApi
import scrapetube
from langchain.embeddings import OpenAIEmbeddings
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

def get_titles(url,user_id):
    try:
        Text_Total = "Youtube is a platform where, people can create videos for other people to watch. now I am Providing You Titles & Description of Multiple Youtube Videos I have created through which you need to analyse\n"
        count = 1
        response = requests.get(url)
        pattern = r'channelId":"([A-Za-z0-9_-]+)"'
        match = re.search(pattern, response.text)
        if match:
            id = match.group(1)
            videos = scrapetube.get_channel(id)
            for video in videos:
                title  = str(video['title']['runs'][0]['text'])
                try:
                    Text_Total+=f"\n Video: {count} \n Title :{title} \n" 
                    count+=1                  
                except Exception as e:
                    pass
            print(Text_Total)
            return Text_Total
        else:
            return f"hi my name is {user_id}"
        
    except requests.exceptions.RequestException as e:
        return f"hi my name is {user_id}"


def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

def create_vectorstore(text_chunks, id):
    embeddings = OpenAIEmbeddings()
    vector_store_file = f"vectorstore{id}.joblib"
    # Load existing vector store if it exists, else initialize to None
    if os.path.exists(vector_store_file):
        vector_store = joblib.load(vector_store_file)
        print("Vectore store found, Loading")
    else:
        vector_store = None
        print("No previous vectore store found, Creating a new One")
    for i in range(0, len(text_chunks), 10):
        batch = text_chunks[i:i+10] 
        batch_vector_store = FAISS.from_texts(texts=batch, embedding=embeddings)
        print(batch_vector_store)
        if vector_store is None:
            vector_store = batch_vector_store
        else:
            vector_store.merge_from(batch_vector_store)
    vector_store._lock = None
    print(vector_store)
    
    joblib.dump(vector_store, filename=vector_store_file)
    print("...................Vectore .....................Has..............Been .............Completed................")
    return vector_store

def get_conversation_chain(vectorstore):
    if vectorstore is None:
        print("Vector store is not loaded. Cannot create conversation chain.")
        return None
    try:
        llm = ChatOpenAI()
        memory = ConversationBufferMemory(
            memory_key='chat_history', return_messages=True)
        conversation_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=vectorstore.as_retriever(),
            memory=memory
        )
        return conversation_chain
    except Exception as e:
        print(f"Error creating conversation chain: {e}")
        return None


def load_vectorstore(filename):
    try:
        vector_store = joblib.load(filename)
        print(f"Vector store loaded successfully from {filename}")
        return vector_store
    except Exception as e:
        print(f"Error loading vector store from {filename}: {e}")
        return None

@app.route('/process-url', methods=['POST'])
def start_session():
    try:
        user_id = request.json.get('id')
        url = request.json.get('url')
        print(url)
        text = get_titles(url,user_id)

        chunks = get_text_chunks(text)
        create_vectorstore(chunks,user_id)
        return jsonify({'message': 'Session started successfully', 'user_id': user_id})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/ask', methods=['POST'])
def ask_question():
    try:
        user_id = request.json.get('id')
        print(user_id)
        user_question = request.json.get('question')
        print(user_question)
        vectorstore = load_vectorstore(f"vectorstore{user_id}.joblib")
        conversation_chain = get_conversation_chain(vectorstore)
        response = conversation_chain({'question': user_question})
        print(response)
        bot_response = response['answer']
        return jsonify({'response': bot_response})
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(debug=True)
