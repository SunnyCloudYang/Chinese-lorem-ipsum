import re
import json
from tqdm import tqdm
from bs4 import BeautifulSoup

# 全角转半角
def fullwidth_to_halfwidth(text):
    """将全角字符转换为半角字符"""
    result = []
    for char in text:
        code = ord(char)
        if 0xFF01 <= code <= 0xFF5E:  # 全角字符范围
            result.append(chr(code - 0xFEE0))
        elif code == 0x3000:  # 全角空格
            result.append(' ')
        else:
            result.append(char)
    return ''.join(result)

# 过滤 HTML / Markdown
def remove_html_markdown(text):
    """去除 HTML 标签和 Markdown 语法"""
    text = BeautifulSoup(text, "html.parser").get_text()  # 移除 HTML
    text = re.sub(r'\[.*?\]\(.*?\)', '', text)  # 移除 Markdown 链接
    text = re.sub(r'`{1,3}.*?`{1,3}', '', text)  # 移除行内代码
    return text

# 过滤特殊字符
def remove_special_chars(text):
    """去除特殊符号（保留必要标点）"""
    text = re.sub(r'[■◆◇※◉▶▌▍▎▏●★☆]', '', text)  # 移除特殊符号
    text = re.sub(r'[\r\t]', ' ', text)  # 替换制表符和回车
    text = re.sub(r'\s+', ' ', text)  # 多个空格合并
    return text.strip()

# 句子清理
def clean_sentences(text):
    """拆分文本为句子，去除过短或无意义的句子"""
    sentences = re.split(r'[。！？?!]', text)  # 按标点拆分
    cleaned_sentences = [s.strip() for s in sentences if len(s.strip()) > 40]  # 过滤过短句子
    return '\n\n'.join(cleaned_sentences)

# 解析 JSON 文件
def extract_text_from_json(json_file):
    """从 JSON 语料文件中提取正文文本"""
    texts = []
    with open(json_file, "r", encoding="utf-8") as f:
        for line in f:
            try:
                data = json.loads(line)  # 逐行解析 JSON
                if "text" in data:
                    texts.append(data["text"].strip())  # 提取正文内容
            except json.JSONDecodeError:
                continue  # 跳过解析错误的行
    return "\n".join(texts)

# 移除短句
def remove_short_lines(text, min_length=10):
    """移除长度小于 min_length 的句子"""
    lines = text.split("\n")
    return "\n".join([line for line in lines if len(line) >= min_length])

# 语料清理主函数
def clean_corpus(input_file, output_file):
    if not input_file.endswith(".txt"):
        raw_text = extract_text_from_json(input_file)  # 提取正文
    else:
        with open(input_file, "r", encoding="utf-8") as f:
            raw_text = f.read()
    raw_text = remove_short_lines(raw_text, 40)  # 移除短句
    raw_text = fullwidth_to_halfwidth(raw_text)  # 转换全角字符
    raw_text = remove_html_markdown(raw_text)  # 移除 HTML/Markdown
    raw_text = remove_special_chars(raw_text)  # 清除特殊字符
    raw_text = clean_sentences(raw_text)  # 句子处理

    # 进行分词处理
    # processed_lines = [" ".join(jieba.cut(line)) for line in raw_text.split("\n") if line]
    # processed_lines = [line for line in raw_text.split("\n") if line]

    # 保存清洗后的语料
    with open(output_file, "w", encoding="utf-8") as f:
        # f.write("\n".join(processed_lines))
        f.write(raw_text)

    # print(f"✅ 语料清洗完成，已保存至 {output_file}")

# 运行示例
if __name__ == "__main__":
    # for i in tqdm(range(0, 100)):
    #     # wiki_00 ~ wiki_99
    #     input_file = f"corpus/wiki_{i:02d}"
    #     output_file = f"corpus/cleaned_wiki_{i:02d}.txt"
    #     clean_corpus(input_file, output_file)
    filename = "wiki_91"
    clean_corpus(filename, f"corpus/{filename}.txt")
