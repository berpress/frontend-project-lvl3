import axios from 'axios';
import i18n from 'i18next';
import validate from './validate';
import initView from './views';
import parser from './parser';
import { updateState, getUrlWithProxy, checkForNewPosts } from './utils';

const app = () => {
  const client = new axios.Axios({ timeout: 10000 });
  const elements = {
    form: document.querySelector('.rss-form'),
    h1: document.querySelector('h1'),
    submitBtn: document.getElementById('submit'),
    lead: document.querySelector('.lead'),
    input: document.getElementById('input'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };
  const i18nInstance = i18n.createInstance();

  // state
  const state = {
    form: {
      processState: 'filling',
      inputValue: null,
      valid: true,
      error: null,
      success: false,
    },
    feeds: [],
    posts: [],
  };

  const watchedState = initView(state, elements, i18nInstance);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.form.valid = validate(url);
    if (!watchedState.form.valid) {
      watchedState.form.error = 'invalidUrl';
      watchedState.form.processState = 'failed';
    } else {
      watchedState.form.inputValue = url;
      watchedState.form.error = null;
      watchedState.form.processState = 'loading';
      client
        .get(getUrlWithProxy(url))
        .then((response) => {
          const dataRSS = parser(JSON.parse(response.data).contents);
          updateState(dataRSS, watchedState, url);
        })
        .catch((error) => {
          console.log(error);
          alert('Failed, see console');
          watchedState.form.error = 'networkError';
          watchedState.form.processState = 'failed';
        });
    }
    checkForNewPosts(watchedState, client);
  });
};

export default app;
