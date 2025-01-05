import markovify
import jieba
import os

# 读取语料文件
CORPUS_FILE = "./corpus/jxl.txt"
EXCLUDE_FILES = []

def load_corpus(corpus_file=CORPUS_FILE):
    """读取语料并进行中文分词"""
    if not os.path.exists(corpus_file):
        raise FileNotFoundError(f"语料文件 {corpus_file} 不存在，请提供有效语料")
    
    with open(corpus_file, "r", encoding="utf-8") as f:
        text = f.read()
    
    # 预处理：分词 + 保留换行
    sentences = text.split("\n")  # 按行分割
    processed_sentences = [" ".join(jieba.cut(sentence)) for sentence in sentences if sentence]
    return "\n".join(processed_sentences)
    # return text

def train_markov_model(corpus_file, state_size=3):
    """训练 Markov 模型"""
    text = load_corpus(corpus_file)
    return markovify.NewlineText(text, state_size=state_size, well_formed=False)

# 加载模型（避免每次请求重新训练）
def load_markov_model(model_file="model.json"):
    with open(model_file, "r", encoding="utf-8") as f:
        model_json = f.read()
    
    return markovify.NewlineText.from_json(model_json)

def train(combined=False):
    if not combined:
        model = train_markov_model(CORPUS_FILE)
        model_json = model.to_json()
        with open("model.json", "w", encoding="utf-8") as f:
            f.write(model_json)
        return model
    
    combined_model = None
    for (dirpath, dirnames, filenames) in os.walk("corpus"):
        for filename in filenames:
            if filename.endswith(".txt") and filename not in EXCLUDE_FILES:
                try:
                    model = train_markov_model(os.path.join(dirpath, filename))
                    if combined_model:
                        combined_model = markovify.combine([combined_model, model])
                    else:
                        combined_model = model
                    print(f"已加载 {filename}")
                except Exception as e:
                    print(f"加载 {filename} 时出现错误：{e}")

    model_json = combined_model.to_json()
    with open("model.json", "w", encoding="utf-8") as f:
        f.write(model_json)

    return combined_model

def generate_text(sentence_count=5, min_length=40, max_length=100, max_chars=500):
    """生成指定数量的随机文本"""
    results = []
    total_chars = 0
    markov_model = load_markov_model('model.json')
    
    while len(results) < sentence_count and total_chars < max_chars:
        sentence = markov_model.make_sentence()
        if sentence:
            sentence = sentence.replace(" ", "")  # 去掉分词中的空格
            sentence = sentence.replace(",", "，")  # 替换逗号
            sentence = sentence.replace("?", "？")
            sentence = sentence.replace("!", "！")
            sentence = sentence.replace(";", "；")
            sentence = sentence.replace(":", "：")
            sentence = sentence.replace("(", "（")
            sentence = sentence.replace(")", "）")
            sentence = sentence.replace("[", "【")
            sentence = sentence.replace("]", "】")
            sentence = sentence.replace("{", "「")
            sentence = sentence.replace("}", "」")
            sentence = sentence.replace("...", "……")
            if min_length <= len(sentence) <= max_length:
                results.append(sentence)
                total_chars += len(sentence)

    return "\n".join(results)

if __name__ == "__main__":
    train(combined=True)
    print(generate_text())
