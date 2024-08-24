import pandas as pd

def clean_char_freq(src_file):
    df = pd.read_excel(src_file)
    df.drop([0, 1, 2, 3, 4, 5], inplace=True)
    df.columns = ['id', '汉字', '出现次数', '频率（%）', '累积频率（%）']
    df.reset_index(drop=True)
    df['汉字'] = df['汉字'].str.strip()
    # df['出现次数'] = df['出现次数'].astype(int)
    df['频率（%）'] = df['频率（%）'].astype(float)
    # df['累积频率（%）'] = df['累积频率（%）'].astype(float)
    
    char_freq = {row['汉字']: row['频率（%）']/100 for _, row in df.iterrows()}
    
    return char_freq

def write_char_freq(char_freq, dst_file):
    with open(dst_file, 'w', encoding='utf-8') as f:
        for char, freq in char_freq.items():
            f.write(f'{char} {freq}\n')

if __name__ == '__main__':
    src_file = '现代汉语语料库字频表.xls'
    dst_file = 'char_freq.txt'

    char_freq = clean_char_freq(src_file)
    write_char_freq(char_freq, dst_file)
