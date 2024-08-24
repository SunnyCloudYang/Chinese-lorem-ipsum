from flask import Flask, request, jsonify
from flask_cors import CORS
import random

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Load the character frequency data
char_frequency = {}
chars = []
probs = []
commas = '，—、；： '
dots = '。！？'
with open('word_freq.txt', 'r', encoding='utf-8') as f:
    for line in f:
        char, freq = line.strip().split()
        char_frequency[char] = float(freq)
        chars.append(char)
        probs.append(float(freq))

# Text generation functions
def generate_sentence(min_length=5, max_length=20):
    sentence_length = random.randint(min_length, max_length)
    sentence = []
    for _ in range(sentence_length):
        if not sentence:
            first_char = random.choices(chars, weights=probs)[0]
            while first_char == '的':
                first_char = random.choices(chars, weights=probs)[0]
            sentence.append(first_char)
        else:
            next_char = random.choices(chars, weights=probs)[0]
            while next_char == sentence[-1]:
                next_char = random.choices(chars, weights=probs)[0]
            sentence.append(next_char)
    if len(sentence) > 0.2 * max_length and random.random() < len(sentence) / max_length:
        comma = random.choices(
            commas, weights=[0.6, 0.05, 0.1, 0.05, 0.1, 0.1])[0]
        sentence.insert(random.randint(1, len(sentence) - 1), comma)
    dot = random.choices(dots, weights=[0.6, 0.2, 0.2])[0]
    result = ''.join(sentence)
    return result + dot


def generate_paragraph(num_sentences_range=[4, 8], max_sentence_length=20):
    num_sentences = random.randint(*num_sentences_range)
    return ''.join(generate_sentence(max_length=max_sentence_length) for _ in range(num_sentences))


def generate_text(num_paragraphs_range=[3, 5], num_sentences_range=[4, 8], max_sentence_length=20):
    num_paragraphs = random.randint(*num_paragraphs_range)
    return '\n'.join(generate_paragraph(num_sentences_range, max_sentence_length) for _ in range(num_paragraphs))


@app.route('/generate', methods=['POST'])
def generate_text_endpoint():
    data = request.json
    num_paragraphs_range = data.get('num_paragraphs_range', [3, 5])
    num_sentences_range = data.get('num_sentences_range', [4, 8])
    max_sentence_length = data.get('max_sentence_length', 20)

    generated_text = generate_text(
        num_paragraphs_range, num_sentences_range, max_sentence_length)
    return jsonify({'loremText': generated_text})


if __name__ == '__main__':
    app.run(debug=False)
