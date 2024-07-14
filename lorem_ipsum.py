import random

# 加载汉字字频表char_freq.txt，以字符-频率键值对的方式存储
char_frequency = {}
with open('char_freq.txt', 'r', encoding='utf-8') as f:
    for line in f:
        char, freq = line.strip().split()
        char_frequency[char] = float(freq)

# 按照字频创建一个加权随机选择列表
weighted_chars = []
for char, freq in char_frequency.items():
    weighted_chars.extend([char] * int(freq * 10000))

# 基于马尔可夫链的生成模型
def generate_sentence(max_length=20):
    sentence_length = random.randint(5, max_length)
    sentence = []
    for _ in range(sentence_length):
        if not sentence:
            sentence.append(random.choice(weighted_chars))
        else:
            # 简单模拟上下文连贯性（可以使用更复杂的规则）
            next_char = random.choice(weighted_chars)
            while next_char == sentence[-1]:  # 避免重复字符
                next_char = random.choice('，—、；：')
            sentence.append(next_char)
    punctuation = random.choice('。！？')
    return ''.join(sentence) + punctuation

# 生成随机段落
def generate_paragraph(num_sentences=5, max_sentence_length=20):
    return ''.join(generate_sentence(max_sentence_length) for _ in range(num_sentences))

# 生成随机文本
def generate_text(num_paragraphs=3, num_sentences_per_paragraph=5, max_sentence_length=20):
    return '\n'.join(generate_paragraph(num_sentences_per_paragraph, max_sentence_length) for _ in range(num_paragraphs))

# 测试生成文本
text = generate_text(num_paragraphs=5, num_sentences_per_paragraph=20, max_sentence_length=22)
print(text)
