import random

# 加载汉字字频表
chars = []
probs = []
commas = ['，', '——', '、', '；', '：']
dots = '。！？'
data_dir = 'data'
data_file = 'word_freq.txt'
with open(f'{data_dir}/{data_file}', 'r', encoding='utf-8') as f:
    for line in f:
        char, freq = line.strip().split()
        chars.append(char)
        probs.append(float(freq))

# 基于真实汉字字频表生成随机文本
def generate_sentence(min_length=5, max_length=20):
    sentence_length = random.randint(min_length, max_length)
    no_dot = sentence_length < 4
    sentence = ''
    continue_length = 0
    for _ in range(sentence_length):
        if not sentence:
            # 第一个字符不能是“的”
            first_char = random.choices(chars, weights=probs)[0]
            while first_char == '的' or len(first_char) > sentence_length:
                first_char = random.choices(chars, weights=probs)[0]
            sentence += first_char
            continue_length += len(first_char)
        elif continue_length > 5 and random.random() < continue_length / 24 and len(sentence) < sentence_length-3:
            # 生成逗号
            comma = random.choices(
                commas, weights=[0.6, 0.05, 0.1, 0.05, 0.2])[0]
            sentence += comma
            continue_length = 0
        elif len(sentence) < sentence_length:
            next_char = random.choices(chars, weights=probs)[0]
            while next_char[0] == sentence[-1] or len(sentence) + len(next_char) > sentence_length-(not no_dot):
                next_char = random.choices(chars, weights=probs)[0]
            sentence += next_char
            continue_length += len(next_char)
            if len(sentence) >= sentence_length-(not no_dot):
                break
    dot = random.choices(dots, weights=[0.6, 0.2, 0.2])[0]
    return sentence + ('' if no_dot else dot)

# 生成一个随机段落
def generate_paragraph(num_sentences_range=[4, 8], max_sentence_length=20):
    num_sentences = random.randint(*num_sentences_range)
    return ''.join(generate_sentence(max_length=max_sentence_length) for _ in range(num_sentences))

# 生成一篇随机文本
def generate_text(num_paragraphs_range=[3, 5], num_sentences_range=[4, 8], max_sentence_length=20):
    num_paragraphs = random.randint(*num_paragraphs_range)
    return '\n'.join(generate_paragraph(num_sentences_range, max_sentence_length) for _ in range(num_paragraphs))

# 生成指定长度文本
def generatte_text_by_length(length):
    num_sentences = length // 16
    arr_num_sentences = [random.randint(10, 22) for _ in range(num_sentences-1)]
    if length < sum(arr_num_sentences):
        arr_num_sentences = arr_num_sentences[:-1]
    arr_num_sentences.append(length - sum(arr_num_sentences))
    generated_text = ''.join(generate_sentence(min_length=num_sentence, max_length=num_sentence) for num_sentence in arr_num_sentences)
    return generated_text


if __name__ == '__main__':
    text = generate_text()
    print(text, len(text))
