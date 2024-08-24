// Theme toggle logic
const themeToggle = document.querySelector('.theme-toggle');

function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem('theme', theme);
  showToast(`主题切换为 ${theme === 'light-theme' ? '浅色' : '深色'}`);
}

function toggleTheme() {
  const currentTheme = document.body.className;
  const newTheme = currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
  setTheme(newTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDarkScheme ? 'dark-theme' : 'light-theme');
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

window.onload = function () {
  try {
    fetch('/api/').then(response => {
      if (response.ok) {
        console.log('Connected to the server');
      } else {
        console.error('Failed to connect to the server');
      }
    });
  } catch (error) {
    console.error('Failed to connect to the server');
  }
}

async function generateLoremIpsum() {
  // Clear previous messages
  document.getElementById('num_paragraphs_error').classList.remove('show');
  document.getElementById('num_sentences_error').classList.remove('show');
  document.getElementById('max_sentence_length_error').classList.remove('show');
  document.getElementById('success_message').classList.remove('show');
  document.getElementById('result').classList.remove('show');
  document.getElementById('copy-button').classList.remove('show');
  document.getElementById('loading_spinner').classList.add('show');

  // Get input values
  const num_paragraphs = document.getElementById('num_paragraphs').value.split(',').map(Number);
  const num_sentences = document.getElementById('num_sentences').value.split(',').map(Number);
  const max_sentence_length = document.getElementById('max_sentence_length').value;

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
  if (isNaN(max_sentence_length) || max_sentence_length < 5) {
    document.getElementById('max_sentence_length_error').textContent = '请输入一个有效的句子长度 (最小为 5)';
    document.getElementById('max_sentence_length_error').classList.add('show');
    isValid = false;
  }

  if (!isValid) {
    document.getElementById('loading_spinner').classList.remove('show');
    return;
  }

  try {
    const response = await fetch('/api/generate', {
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
    } else {
      document.getElementById('success_message').textContent = '生成文本时出错，请重试。';
    }
  } catch (error) {
    document.getElementById('success_message').textContent = '无法连接到服务器，请检查您的网络连接。';
  } finally {
    document.getElementById('loading_spinner').classList.remove('show');
    document.getElementById('success_message').classList.add('show');
    if (document.getElementById('result').innerText) {
      document.getElementById('result').classList.add('show');
      document.getElementById('copy-button').classList.add('show');
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