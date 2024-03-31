from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
from langchain.callbacks import get_openai_callback
from transformers import pipeline
import requests
import fitz 
import json

app = Flask(__name__)
CORS(app)

# Global variables to store uploaded PDF and its text
uploaded_pdf = None
pdf_text = None

def process_pdf(pdf_file):
    global uploaded_pdf, pdf_text
    uploaded_pdf = pdf_file
    text = ""
    pdf_reader = PdfReader(uploaded_pdf)
    for page in pdf_reader.pages:
        text += page.extract_text()
    pdf_text = text
    # print(pdf_text)

@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    pdf_file = request.files['file']
    if pdf_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    process_pdf(pdf_file)
    return jsonify({'message': 'PDF uploaded successfully'})

@app.route('/view', methods=['POST'])
def extract_text_from_pdf():
    return pdf_text

@app.route('/ask-question', methods=['POST'])
def ask_question():
    if 'question' not in request.json:
        return jsonify({'error': 'Question not found in request'}), 400
    
    user_question = request.json['question']
    
    if uploaded_pdf is None or pdf_text is None:
        return jsonify({'error': 'PDF not uploaded yet'}), 400
    
    # Generate response based on PDF and user question
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(pdf_text)
    embeddings = OpenAIEmbeddings()
    knowledge_base = FAISS.from_texts(chunks, embeddings)
    docs = knowledge_base.similarity_search(user_question)
    llm = OpenAI()
    chain = load_qa_chain(llm, chain_type="stuff")
    with get_openai_callback() as cb:
        response = chain.run(input_documents=docs, question=user_question)
    # response = 'success!'
    print(response)
    return jsonify({'response': response})


SUMMARIZATION_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
TRANSLATION_API_URL = "https://api-inference.huggingface.co/models/facebook/mbart-large-50-one-to-many-mmt"


<<<<<<< HEAD
# Hugging Face API token
API_TOKEN = ""
=======
# Put your Hugging Face API token
API_TOKEN = "XXXXXXXXXXXXX"
>>>>>>> 127acde4a9b54be3471c6ee55a0b28d92085e86f

def query_api(api_url, payload):
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    response = requests.post(api_url, headers=headers, json=payload)
    return response.json()

@app.route('/summarize', methods=['POST'])
def summarize_text():
    global pdf_text
    if pdf_text is None:
        return jsonify({'error': 'PDF not uploaded yet'}), 400
    
    try:
        max_length = 500
        # Use the text extracted from the PDF for summarization
        response = query_api(SUMMARIZATION_API_URL, {"inputs": pdf_text, "max_length": max_length})
        
        # Check if the response is a list
        if isinstance(response, list):
            summary = response[0]['summary_text']  # Access the first element of the list
        # Check if the response is a dictionary
        elif isinstance(response, dict):
            summary = response.get('summary_text', 'Summary not found')  # Get the 'summary_text' key from the dictionary
        else:
            return jsonify({'error': 'Invalid response format'}), 500
        
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
