# Chinese Lorem Ipsum Generator

[![Website chinese-lorem-ipsum.vercel.app](https://img.shields.io/website-up-down-green-red/https/naereen.github.io.svg)](https://chinese-lorem-ipsum.vercel.app/) [![GitHub license](https://badgen.net/github/license/Naereen/Strapdown.js)](https://github.com/SunnyCloudYang/Chinese-lorem-ipsum/blob/main/LICENSE) [![API](https://img.shields.io/badge/API-Free-darkgreen)](https://github.com/SunnyCloudYang/Chinese-lorem-ipsum/blob/main/website/api/apidoc.md)

## Description

This project generates random text(lorem ipsum) based on **real world frequency** of Chinese characters. It reads character frequencies from a file and uses them to generate random sentences.

By default, it generates a random text with 3\~5 paragraphs, 4\~8 sentences per paragraph, and no more than 20 characters per sentence, which is about 300 characters.

But you can easily customize the number of paragraphs, sentences per paragraph, and characters per sentence by passing a different parameter. Besides, it's also available to generate a random text with a specific number of characters.

## Website

[Chinese Lorem Ipsum Generator](https://chinese-lorem-ipsum.vercel.app/)

## API

[API Documentation](https://github.com/SunnyCloudYang/Chinese-lorem-ipsum/blob/main/website/api/apidoc.md)

## Project Structure

```plaintext
Chinese-lorem-ipsum/
├── website/                  # Website
│   ├── api/                  # Backend API
│   │   ├── apidoc.md         # API Documentation
│   │   └── app.py            # flask app
│   ├── index.html            # Homepage
│   └── ...                   # Other website files
├── data/                     # Data source
│   ├── word_freq.txt         # Word frequency (generated during preprocessing)
│   ├── char_freq.txt         # Character frequency (generated during preprocessing)
│   ├── 现代汉语语料库词频表    # Word frequency
│   └── 现代汉语语料库字频表    # Character frequency
├── train/                    # Test version using Markov model
│   ├── clean_corpus.py       # Script to clean the corpus
│   └── model.py              # Markov model
├── model/                    # Markov model file
│   └── model.json            # Markov model
├── lorem_ipsum.py            # Script to generate random text
├── preprocess.py             # Script to preprocess the frequency table
└── ...                       # Other files
```

## Installation

### Local Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/SunnyCloudYang/Chinese-lorem-ipsum.git
    ```

2. Navigate to the project directory:

    ```sh
    cd Chinese-lorem-ipsum
    ```

3. Set up a virtual environment:

    ```sh
    python -m venv venv
    ```

4. Activate the virtual environment:
    - On Windows:

        ```sh
        venv\Scripts\activate
        ```

    - On macOS/Linux:

        ```sh
        source venv/bin/activate
        ```

5. Install the required dependencies:

    ```sh
    pip install -r requirements.txt
    ```

### Website Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/SunnyCloudYang/Chinese-lorem-ipsum.git
    ```

2. Navigate to the project directory:

    ```sh
    cd Chinese-lorem-ipsum/website
    ```

3. Install the required dependencies:

    ```sh
    npm install
    ```

## Usage

### Interactive

1. Navigate to the website directory:

    ```sh
    cd Chinese-lorem-ipsum/website
    ```

2. Run the Vercel development server:

    ```sh
    vercel dev
    ```

3. Open your browser and navigate to `http://localhost:3000`.
4. Click the "Generate" button to generate a random text.

### Script

1. Ensure you have the `word_freq.txt` file in the project directory.
2. Run the script to generate a random text with 3\~5 paragraphs and 4\~8 sentences per paragraph:

    ```sh
    python lorem_ipsum.py
    ```

## Contributing

1. Fork the repository.
2. Create a new branch:

    ```sh
    git checkout -b feature/your-feature
    ```

3. Make your changes and commit them:

    ```sh
    git commit -m "Add your message"
    ```

4. Push to the branch:

    ```sh
    git push origin feature/your-feature
    ```

5. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

[sunnycloudyang@outlook.com](mailto:sunnycloudyang@outlook.com)
