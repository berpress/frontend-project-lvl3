import i18n from 'i18next';
import validate from './validate';
import initView from './view';

const app = () => {
  // elements
  const elements = {
    form: document.querySelector('.rss-form'),
    h1: document.querySelector('h1'),
    submitBtn: document.getElementById('submit'),
    lead: document.querySelector('.lead'),
    input: document.getElementById('input'),
  };
  const i18nInstance = i18n.createInstance();
  // init text interface

  // state
  const state = {
    form: {
      processState: 'filling',
      processError: null,
      inputValue: null,
      valid: true,
      error: null,
    },
    feeds: [],
    posts: [],
  };

  const watchedState = initView(state, elements, i18nInstance);

  elements.form.addEventListener('submit', (e) => {
    // reset
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');
    watchedState.form.inputValue = value;
    validate(watchedState);
  });
};

export default app;
