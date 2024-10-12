from flask import Flask, request, jsonify
import random

# Initialize Flask app and enable CORS
app = Flask(__name__)

# Load the character frequency data
char_frequency = {}
chars = []
probs = []
commas = '，—、；：'
dots = '。！？'
with open('./api/word_freq.txt', 'r', encoding='utf-8') as f:
    for line in f:
        char, freq = line.strip().split()
        char_frequency[char] = float(freq)
        chars.append(char)
        probs.append(float(freq))

# Text generation functions
def generate_sentence(min_length=5, max_length=20):
    sentence_length = random.randint(min_length, max_length)
    sentence = ''
    continue_length = 0
    for _ in range(sentence_length):
        if not sentence:
            # 第一个字符不能是“的”
            first_char = random.choices(chars, weights=probs)[0]
            while first_char == '的':
                first_char = random.choices(chars, weights=probs)[0]
            sentence += first_char
            continue_length += len(first_char)
        elif continue_length > 0.2 * sentence_length and random.random() < continue_length / sentence_length and len(sentence) < sentence_length-3:
            # 生成逗号
            comma = random.choices(
                commas, weights=[0.6, 0.05, 0.1, 0.05, 0.2])[0]
            sentence += comma
            continue_length = 0
        else:
            # 简单模拟上下文连贯性（可以使用更复杂的规则）
            next_char = random.choices(chars, weights=probs)[0]
            # 避免重复字符
            while next_char[0] == sentence[-1] or len(sentence) + len(next_char) > sentence_length-1:
                next_char = random.choices(chars, weights=probs)[0]
            sentence += next_char
            continue_length += len(next_char)
            if len(sentence) == sentence_length-1:
                break
    dot = random.choices(dots, weights=[0.6, 0.2, 0.2])[0]
    result = sentence
    return result + dot


def generate_paragraph(num_sentences_range=[4, 8], max_sentence_length=20):
    num_sentences = random.randint(*num_sentences_range)
    return ''.join(generate_sentence(max_length=max_sentence_length) for _ in range(num_sentences))


def generate_text(num_paragraphs_range=[3, 5], num_sentences_range=[4, 8], max_sentence_length=6):
    num_paragraphs = random.randint(*num_paragraphs_range)
    return '\n'.join(generate_paragraph(num_sentences_range, max_sentence_length) for _ in range(num_paragraphs))


@app.route('/api/', methods=['GET'])
def home():
    return 'Lorem Ipsum API'

@app.route('/api/generate/', methods=['GET'])
def generate_default_text_endpoint():
    generated_text = generate_text()
    return jsonify({'loremText': generated_text})

@app.route('/api/generate/<int:length>/', methods=['GET'])
def generate_chars(length):
    length = min(length, 1000)
    length = max(length, 1)
    num_sentences = length // 16
    arr_num_sentences = [random.randint(10, 22) for _ in range(num_sentences-1)]
    if length < sum(arr_num_sentences):
        arr_num_sentences = arr_num_sentences[:-1]
    arr_num_sentences.append(length - sum(arr_num_sentences))
    generated_text = ''.join(generate_sentence(min_length=num_sentence, max_length=num_sentence) for num_sentence in arr_num_sentences)
    return jsonify({'loremText': generated_text})

@app.route('/api/generate/<string:len_type>/', methods=['GET'])
def generate_chars_by_type(len_type):
    if len_type == 'tiny':
        length = random.randint(2, 10)
    elif len_type == 'small':
        length = random.randint(10, 20)
    elif len_type == 'short':
        length = random.randint(20, 100)
    elif len_type == 'medium':
        length = random.randint(100, 500)
    elif len_type == 'long':
        length = random.randint(500, 1000)
    else:
        length = random.randint(10, 500)
    return generate_chars(length)

@app.route('/api/generate/', methods=['POST'])
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
