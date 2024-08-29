/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./node_modules/@vercel/analytics/dist/index.mjs
// package.json
var dist_name = "@vercel/analytics";
var version = "1.3.1";

// src/queue.ts
var initQueue = () => {
  if (window.va)
    return;
  window.va = function a(...params) {
    (window.vaq = window.vaq || []).push(params);
  };
};

// src/utils.ts
function isBrowser() {
  return typeof window !== "undefined";
}
function detectEnvironment() {
  try {
    const env = "production";
    if (env === "development" || env === "test") {
      return "development";
    }
  } catch (e) {
  }
  return "production";
}
function setMode(mode = "auto") {
  if (mode === "auto") {
    window.vam = detectEnvironment();
    return;
  }
  window.vam = mode;
}
function getMode() {
  const mode = isBrowser() ? window.vam : detectEnvironment();
  return mode || "production";
}
function isProduction() {
  return getMode() === "production";
}
function isDevelopment() {
  return getMode() === "development";
}
function removeKey(key, { [key]: _, ...rest }) {
  return rest;
}
function parseProperties(properties, options) {
  if (!properties)
    return void 0;
  let props = properties;
  const errorProperties = [];
  for (const [key, value] of Object.entries(properties)) {
    if (typeof value === "object" && value !== null) {
      if (options.strip) {
        props = removeKey(key, props);
      } else {
        errorProperties.push(key);
      }
    }
  }
  if (errorProperties.length > 0 && !options.strip) {
    throw Error(
      `The following properties are not valid: ${errorProperties.join(
        ", "
      )}. Only strings, numbers, booleans, and null are allowed.`
    );
  }
  return props;
}

// src/generic.ts
var DEV_SCRIPT_URL = "https://va.vercel-scripts.com/v1/script.debug.js";
var PROD_SCRIPT_URL = "/_vercel/insights/script.js";
function inject(props = {
  debug: true
}) {
  var _a;
  if (!isBrowser())
    return;
  setMode(props.mode);
  initQueue();
  if (props.beforeSend) {
    (_a = window.va) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
  }
  const src = props.scriptSrc || (isDevelopment() ? DEV_SCRIPT_URL : PROD_SCRIPT_URL);
  if (document.head.querySelector(`script[src*="${src}"]`))
    return;
  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  script.dataset.sdkn = dist_name + (props.framework ? `/${props.framework}` : "");
  script.dataset.sdkv = version;
  if (props.disableAutoTrack) {
    script.dataset.disableAutoTrack = "1";
  }
  if (props.endpoint) {
    script.dataset.endpoint = props.endpoint;
  }
  if (props.dsn) {
    script.dataset.dsn = props.dsn;
  }
  script.onerror = () => {
    const errorMessage = isDevelopment() ? "Please check if any ad blockers are enabled and try again." : "Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";
    console.log(
      `[Vercel Web Analytics] Failed to load script from ${src}. ${errorMessage}`
    );
  };
  if (isDevelopment() && props.debug === false) {
    script.dataset.debug = "false";
  }
  document.head.appendChild(script);
}
function track(name2, properties, options) {
  var _a, _b;
  if (!isBrowser()) {
    const msg = "[Vercel Web Analytics] Please import `track` from `@vercel/analytics/server` when using this function in a server environment";
    if (isProduction()) {
      console.warn(msg);
    } else {
      throw new Error(msg);
    }
    return;
  }
  if (!properties) {
    (_a = window.va) == null ? void 0 : _a.call(window, "event", { name: name2, options });
    return;
  }
  try {
    const props = parseProperties(properties, {
      strip: isProduction()
    });
    (_b = window.va) == null ? void 0 : _b.call(window, "event", {
      name: name2,
      data: props,
      options
    });
  } catch (err) {
    if (err instanceof Error && isDevelopment()) {
      console.error(err);
    }
  }
}
function pageview({ route, path }) {
  var _a;
  (_a = window.va) == null ? void 0 : _a.call(window, "pageview", {
    route,
    path
  });
}
var generic_default = {
  inject,
  track
};

//# sourceMappingURL=index.mjs.map
;// CONCATENATED MODULE: ./node_modules/@vercel/speed-insights/dist/index.mjs
// package.json
var speed_insights_dist_name = "@vercel/speed-insights";
var dist_version = "1.0.12";

// src/queue.ts
var dist_initQueue = () => {
  if (window.si)
    return;
  window.si = function a(...params) {
    (window.siq = window.siq || []).push(params);
  };
};

// src/utils.ts
function dist_isBrowser() {
  return typeof window !== "undefined";
}
function dist_detectEnvironment() {
  try {
    const env = "production";
    if (env === "development" || env === "test") {
      return "development";
    }
  } catch (e) {
  }
  return "production";
}
function dist_isDevelopment() {
  return dist_detectEnvironment() === "development";
}
function computeRoute(pathname, pathParams) {
  if (!pathname || !pathParams) {
    return pathname;
  }
  let result = pathname;
  try {
    const entries = Object.entries(pathParams);
    for (const [key, value] of entries) {
      if (!Array.isArray(value)) {
        const matcher = turnValueToRegExp(value);
        if (matcher.test(result)) {
          result = result.replace(matcher, `/[${key}]`);
        }
      }
    }
    for (const [key, value] of entries) {
      if (Array.isArray(value)) {
        const matcher = turnValueToRegExp(value.join("/"));
        if (matcher.test(result)) {
          result = result.replace(matcher, `/[...${key}]`);
        }
      }
    }
    return result;
  } catch (e) {
    return pathname;
  }
}
function turnValueToRegExp(value) {
  return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`);
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/generic.ts
var SCRIPT_URL = `https://va.vercel-scripts.com/v1/speed-insights`;
var dist_PROD_SCRIPT_URL = `${SCRIPT_URL}/script.js`;
var dist_DEV_SCRIPT_URL = `${SCRIPT_URL}/script.debug.js`;
var PROXY_SCRIPT_URL = `/_vercel/speed-insights/script.js`;
function injectSpeedInsights(props = {}) {
  var _a;
  if (!dist_isBrowser() || props.route === null)
    return null;
  dist_initQueue();
  const isSelfHosted = Boolean(props.dsn);
  const productionScript = isSelfHosted ? dist_PROD_SCRIPT_URL : PROXY_SCRIPT_URL;
  const src = props.scriptSrc || (dist_isDevelopment() ? dist_DEV_SCRIPT_URL : productionScript);
  if (document.head.querySelector(`script[src*="${src}"]`))
    return null;
  if (props.beforeSend) {
    (_a = window.si) == null ? void 0 : _a.call(window, "beforeSend", props.beforeSend);
  }
  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  script.dataset.sdkn = speed_insights_dist_name + (props.framework ? `/${props.framework}` : "");
  script.dataset.sdkv = dist_version;
  if (props.sampleRate) {
    script.dataset.sampleRate = props.sampleRate.toString();
  }
  if (props.route) {
    script.dataset.route = props.route;
  }
  if (props.endpoint) {
    script.dataset.endpoint = props.endpoint;
  }
  if (props.dsn) {
    script.dataset.dsn = props.dsn;
  }
  if (dist_isDevelopment() && props.debug === false) {
    script.dataset.debug = "false";
  }
  script.onerror = () => {
    console.log(
      `[Vercel Speed Insights] Failed to load script from ${src}. Please check if any content blockers are enabled and try again.`
    );
  };
  document.head.appendChild(script);
  return {
    setRoute: (route) => {
      script.dataset.route = route ?? void 0;
    }
  };
}
var dist_generic_default = {
  injectSpeedInsights,
  computeRoute
};

//# sourceMappingURL=index.mjs.map
;// CONCATENATED MODULE: ./script.js



inject();
injectSpeedInsights();

// Theme toggle logic
const themeToggle = document.querySelector('.theme-toggle');

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
  while (bg_text_element.clientHeight >= bg_text_element.scrollHeight) {
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
  document.getElementById('success_message').classList.remove('show');
  document.getElementById('success_message').classList.remove('success');
  document.getElementById('result').classList.remove('show');
  document.getElementById('copy-button').classList.remove('show');
  document.getElementById('loading_spinner').classList.add('show');
  document.getElementById('generate_btn').classList.add('disabled');
  document.getElementById('generate_btn').disabled = true;

  // Get input values split by any non-digit character
  const num_paragraphs = document.getElementById('num_paragraphs').value.split(/\D+/).map(Number);
  const num_sentences = document.getElementById('num_sentences').value.split(/\D+/).map(Number);
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
/******/ })()
;