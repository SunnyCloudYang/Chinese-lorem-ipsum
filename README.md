# Chinese Lorem Ipsum Generator

[![Website chinese-lorem-ipsum.vercel.app](https://img.shields.io/website-up-down-green-red/https/naereen.github.io.svg)](https://chinese-lorem-ipsum.vercel.app/) [![GitHub license](https://badgen.net/github/license/Naereen/Strapdown.js)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)

## Description

This project generates random text based on real world frequency table of Chinese characters. It reads character frequencies from a file and uses them to generate random sentences.

## Installation

### Local Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/SunnyCloudYang/ChineseLoremIpsum.git
    ```

2. Navigate to the project directory:

    ```sh
    cd ChineseLoremIpsum
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
    git clone https://github.com/SunnyCloudYang/ChineseLoremIpsum.git
    ```

2. Navigate to the project directory:

    ```sh
    cd ChineseLoremIpsum/website
    ```

3. Install the required dependencies:

    ```sh
    npm install
    ```

## Usage

### Website

1. Navigate to the website directory:

    ```sh
    cd ChineseLoremIpsum/website
    ```

2. Run the Vercel development server:

    ```sh
    vercel dev
    ```

3. Open your browser and navigate to `http://localhost:3000`.
4. Click the "Generate" button to generate a random text.

### Locally

1. Ensure you have the `word_freq.txt` file in the project directory.
2. Run the script to generate a random text with 3~5 paragraphs and 4~8 sentences per paragraph:

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

[SunnyCloudYang@outlook.com](mailto:SunnyCloudYang@outlook.com)
