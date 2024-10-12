import random

# 加载汉字字频表
chars = []
probs = []
commas = '，—、；：'
dots = '。！？'
with open('word_freq.txt', 'r', encoding='utf-8') as f:
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
        elif continue_length > 0.2 * sentence_length and random.random() < continue_length / sentence_length and len(sentence) < sentence_length-3:
            # 生成逗号
            comma = random.choices(
                commas, weights=[0.6, 0.05, 0.1, 0.05, 0.2])[0]
            sentence += comma
            continue_length = 0
        elif len(sentence) < sentence_length:
            # 简单模拟上下文连贯性（可以使用更复杂的规则）
            next_char = random.choices(chars, weights=probs)[0]
            # 避免重复字符
            while next_char[0] == sentence[-1] or len(sentence) + len(next_char) > sentence_length-(not no_dot):
                next_char = random.choices(chars, weights=probs)[0]
            sentence += next_char
            continue_length += len(next_char)
            if len(sentence) >= sentence_length-(not no_dot):
                break
    dot = random.choices(dots, weights=[0.6, 0.2, 0.2])[0]
    return sentence + ('' if no_dot else dot)

# 生成随机段落
def generate_paragraph(num_sentences_range=[4, 8], max_sentence_length=20):
    num_sentences = random.randint(*num_sentences_range)
    return ''.join(generate_sentence(max_length=max_sentence_length) for _ in range(num_sentences))

# 生成随机文本
def generate_text(num_paragraphs_range=[3, 5], num_sentences_range=[4, 8], max_sentence_length=20):
    num_paragraphs = random.randint(*num_paragraphs_range)
    return '\n'.join(generate_paragraph(num_sentences_range, max_sentence_length) for _ in range(num_paragraphs))


# 测试生成文本
if __name__ == '__main__':
    text = generate_sentence(12, 18)
    print(text, len(text))
