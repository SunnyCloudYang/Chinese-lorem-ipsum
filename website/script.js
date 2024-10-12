import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from '@vercel/speed-insights';

inject();
injectSpeedInsights();

// Theme toggle logic
const themeToggle = document.querySelector('.theme-toggle');
const generateBtn = document.getElementById('generate_btn');
const copyBtn = document.getElementById('copy-button');
const textArea = document.getElementById('result');
const exact_length = document.getElementById('exact_length');

themeToggle.addEventListener('click', toggleTheme);
generateBtn.addEventListener('click', generateLoremIpsum);
copyBtn.addEventListener('click', copyToClipboard);
textArea.addEventListener('click', makeEditable);
exact_length.addEventListener('input', function () {
  if (exact_length.value) {
    document.getElementById('num_paragraphs').disabled = true;
    document.getElementById('num_sentences').disabled = true;
    document.getElementById('max_sentence_length').disabled = true;
  } else {
    document.getElementById('num_paragraphs').disabled = false;
    document.getElementById('num_sentences').disabled = false;
    document.getElementById('max_sentence_length').disabled = false;
  }
});

function setTheme(theme, notify = true) {
  document.body.className = theme;
  localStorage.setItem('theme', theme);
  notify && showToast(`主题切换为 ${theme === 'light-theme' ? '浅色' : '深色'}`);
}

function toggleTheme() {
  const currentTheme = document.body.className;
  const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
  setTheme(newTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme, false);
  } else {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDarkScheme ? 'dark-theme' : 'light-theme', false);
  }
}

document.addEventListener('DOMContentLoaded', loadTheme);

// Input validation logic
function validateInput(input, range) {
  const [min, max] = range.map(Number);
  if (isNaN(min) || isNaN(max) || min < 1 || max < 1 || min > max) {
    return false;
  }
  return true;
}

const bg_text_element = document.getElementById('text-background');
window.onload = function () {
  try {
    fetch('/api/generate/').then(response => {
      if (response.ok) {
        console.log('Connected to the server');
        response.json().then(data => {
          let bg_text = data.loremText;
          bg_text_element.textContent = bg_text;
          while (bg_text_element.clientHeight >= bg_text_element.scrollHeight) {
            bg_text = bg_text + data.loremText;
            bg_text_element.textContent = bg_text;
          }
          bg_text_element.textContent = '';
          bg_text_element.classList.add('show');
          let typed = new Typed('#text-background', {
            strings: [bg_text],
            loop: false,
            showCursor: false,
          });
        });
      } else {
        console.error('Failed to connect to the server');
      }
    });
  } catch (error) {
    console.error('Failed to connect to the server');
  }
}

window.onresize = function () {
  while (bg_text_element.clientHeight >= bg_text_element.scrollHeight && bg_text_element.textContent) {
    bg_text_element.textContent = bg_text_element.textContent + bg_text_element.textContent;
  }
}

async function generateLoremIpsum() {
  if (document.getElementById('loading_spinner').classList.contains('show')) {
    return;
  }
  // Clear previous messages
  document.getElementById('num_paragraphs_error').classList.remove('show');
  document.getElementById('num_sentences_error').classList.remove('show');
  document.getElementById('max_sentence_length_error').classList.remove('show');
  document.getElementById('exact_length_error').classList.remove('show');
  document.getElementById('success_message').classList.remove('show');
  document.getElementById('success_message').classList.remove('success');
  document.getElementById('result').classList.remove('show');
  document.getElementById('charCount').classList.remove('show');
  document.getElementById('copy-button').classList.remove('show');
  document.getElementById('loading_spinner').classList.add('show');
  document.getElementById('generate_btn').classList.add('disabled');
  document.getElementById('generate_btn').disabled = true;

  // Get input values split by any non-digit character
  const num_paragraphs = document.getElementById('num_paragraphs').value.split(/\D+/).map(Number);
  const num_sentences = document.getElementById('num_sentences').value.split(/\D+/).map(Number);
  const max_sentence_length = document.getElementById('max_sentence_length').value;

  const exact_length = document.getElementById('exact_length').value;

  if (exact_length) {
    if (isNaN(exact_length) || exact_length < 1 || exact_length > 10000) {
      document.getElementById('exact_length_error').textContent = '请输入一个有效的文本长度，范围为 1 到 10000。';
      document.getElementById('exact_length_error').classList.add('show');
      document.getElementById('loading_spinner').classList.remove('show');
      document.getElementById('generate_btn').classList.remove('disabled');
      document.getElementById('generate_btn').disabled = false;
      return;
    }

    try {
      const response = await fetch(`/api/generate/${parseInt(exact_length)}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        document.getElementById('result').textContent = data.loremText;
        document.getElementById('success_message').textContent = '文本生成成功！';
        document.getElementById('success_message').classList.add('success');
        document.getElementById('charCount').textContent = `字数: ${data.loremText.length}`;
      } else {
        document.getElementById('success_message').textContent = '生成文本时出错，请重试。';
      }
    } catch (error) {
      document.getElementById('success_message').textContent = '无法连接到服务器，请检查您的网络连接。';
    } finally {
      document.getElementById('loading_spinner').classList.remove('show');
      document.getElementById('success_message').classList.add('show');
      document.getElementById('generate_btn').classList.remove('disabled');
      document.getElementById('generate_btn').disabled = false;
      if (document.getElementById('result').innerText) {
        document.getElementById('result').classList.add('show');
        document.getElementById('copy-button').classList.add('show');
        document.getElementById('charCount').classList.add('show');
      }
    }
    return;
  }

  // Validate inputs
  let isValid = true;
  if (!validateInput(num_paragraphs, num_paragraphs)) {
    document.getElementById('num_paragraphs_error').textContent = '请输入有效的段落数量范围 (例如: 3,5)';
    document.getElementById('num_paragraphs_error').classList.add('show');
    isValid = false;
  }
  if (!validateInput(num_sentences, num_sentences)) {
    document.getElementById('num_sentences_error').textContent = '请输入有效的句子数量范围 (例如: 4,8)';
    document.getElementById('num_sentences_error').classList.add('show');
    isValid = false;
  }
  if (isNaN(max_sentence_length) || max_sentence_length < 5 || max_sentence_length > 50) {
    document.getElementById('max_sentence_length_error').textContent = '请输入一个有效的句子长度 (最小为 5，不超过 50)';
    document.getElementById('max_sentence_length_error').classList.add('show');
    isValid = false;
  }

  if (!isValid) {
    document.getElementById('loading_spinner').classList.remove('show');
    document.getElementById('generate_btn').classList.remove('disabled');
    return;
  }

  try {
    const response = await fetch('/api/generate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        num_paragraphs_range: num_paragraphs,
        num_sentences_range: num_sentences,
        max_sentence_length: parseInt(max_sentence_length)
      })
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('result').textContent = data.loremText;
      document.getElementById('success_message').textContent = '文本生成成功！';
      document.getElementById('success_message').classList.add('success');
      document.getElementById('charCount').textContent = `字数: ${data.loremText.length}`;
    } else {
      document.getElementById('success_message').textContent = '生成文本时出错，请重试。';
    }
  } catch (error) {
    document.getElementById('success_message').textContent = '无法连接到服务器，请检查您的网络连接。';
  } finally {
    document.getElementById('loading_spinner').classList.remove('show');
    document.getElementById('success_message').classList.add('show');
    document.getElementById('generate_btn').classList.remove('disabled');
    document.getElementById('generate_btn').disabled = false;
    if (document.getElementById('result').innerText) {
      document.getElementById('result').classList.add('show');
      document.getElementById('copy-button').classList.add('show');
      document.getElementById('charCount').classList.add('show');
    }
  }
}

function copyToClipboard() {
  const resultText = document.getElementById('result');
  if (resultText.innerText) {
    navigator.clipboard.writeText(resultText.innerText).then(() => {
      showToast('文本复制成功！');
    });
  }
}

function makeEditable() {
  const resultText = document.getElementById('result');
  resultText.setAttribute('contenteditable', 'true');
  resultText.focus();
  resultText.oninput = function () {
    document.getElementById('charCount').textContent = `字数: ${resultText.innerText.length}`;
  }
}

function showToast(message) {
  const toast = document.querySelector('.toast');
  const toastMessage = document.getElementById('toast-message');
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    hideToast();
  }, 3000); // Hide after 3 seconds
}

function hideToast() {
  const toast = document.querySelector('.toast');
  toast.classList.remove('show');
}