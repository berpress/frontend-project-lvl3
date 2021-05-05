import axios from 'axios';
import i18n from 'i18next';
import validate from './validate';
import initView from './views';
import parser from './parser';
import {
  updateState,
  getUrlWithProxy,
  checkForNewPosts,
  findDescription,
} from './utils';

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
    modal: document.querySelector('#modal'),
    modalCloseBtn: document.querySelector('#closeModal'),
    modalBody: document.querySelector('.modal-body'),
    modalTitle: document.querySelector('.modal-title'),
    modalViewBtn: document.querySelector('#viewBtn'),
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
    modal: {
      show: false,
      title: '',
      description: '',
      link: '',
    },
  };

  const watchedState = initView(state, elements, i18nInstance);

  const addShowBtnHandler = () => {
    const showButtons = document.querySelectorAll('[data-button=show]');
    [...showButtons].forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const title = e.target.parentElement.querySelector('a');
        watchedState.modal.title = title.innerText;
        watchedState.modal.description = findDescription(
          watchedState.posts,
          title.innerText
        );
        watchedState.modal.link = title;
        watchedState.modal.show = true;
      });
    });
  };
  elements.modalCloseBtn.addEventListener('click', () => {
    watchedState.modal.title = '';
    watchedState.modal.description = '';
    watchedState.modal.show = false;
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.form.error = validate(watchedState.feeds, url);
    console.log(watchedState);
    if (watchedState.form.error !== null) {
      watchedState.form.processState = 'failed';
      watchedState.form.valid = false;
    } else {
      watchedState.form.inputValue = url;
      watchedState.form.error = null;
      watchedState.form.processState = 'loading';
      client
        .get(getUrlWithProxy(url))
        .then((response) => {
          const dataRSS = parser(JSON.parse(response.data).contents);
          updateState(dataRSS, watchedState, url);
          addShowBtnHandler();
        })
        .catch((error) => {
          console.log(error);
          alert('Failed, see console');
          watchedState.form.error = 'networkError';
          watchedState.form.processState = 'failed';
        });
      if (checkForNewPosts(watchedState, client)) {
        addShowBtnHandler();
      }
    }
  });
};

export default app;
