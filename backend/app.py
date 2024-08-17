from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import random
from bs4 import BeautifulSoup


app = Flask(__name__)
CORS(app, resources={r"/": {"origins": "http://localhost:5173"}})


@app.route("/", methods=["POST"])
def index():
    data = request.json
    url = data.get("url")
    teste = requests.get(url)
    soup = BeautifulSoup(teste.text, "html.parser")
    text_elements = soup.find_all(
        [
            "h1",
            "h2",
            "h3",
            "p",
        ]
    )
    words = list()

    def string_words(word: str):
        return len(word.split(" "))

    for element in text_elements:
        text: str = element.get_text()
        teste = string_words(text)
        if len(text) > 3:
            if teste > 1:
                for word in text.split(" "):
                    if ("/" or "") not in word and len(word) > 3:
                        words.append(
                            word.replace("!", "")
                            .replace("?", "")
                            .replace(",", "")
                            .replace(".", "")
                        )
            else:
                words.append(text.replace("!", "").replace("?", "").replace(",", ""))

    result = random.choice(words)
    return {"word": result}


app.run(debug=True)
