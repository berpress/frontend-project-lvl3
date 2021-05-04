import axios from 'axios';
import i18n from 'i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import validate from './validate';
import initView from './views';
import parser from './parser';

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
    } else {
      watchedState.form.inputValue = url;
      watchedState.form.error = null;
      watchedState.form.processState = 'loading';
      client
        .get(url)
        .then((response) => {
          const dataRSS = parser(response.data);
          if (dataRSS.feeds === null && response.status < 400) {
            watchedState.form.error = 'notFeed';
            watchedState.form.processState = 'filling';
          } else {
            const id = watchedState.feeds.length;
            watchedState.feeds.push({ id: id + 1, feeds: dataRSS.feeds });
            const posts = dataRSS.posts.map((post) => ({ id: id + 1, post }));
            const arr1 = watchedState.posts;
            const concatRes = arr1.concat(posts);
            watchedState.posts = concatRes;
            watchedState.form.error = null;
            watchedState.form.processState = 'filling';
          }
        })
        .catch(() => {
          //   console.log(error);
          //   alert('Failed, see console');
          watchedState.form.error = 'networkError';
          watchedState.form.processState = 'failed';
        });
    }
  });
};

export default app;
