import axios from 'axios';
import i18n from 'i18next';
import validate from './validate';
import initView from './views';
import parser from './parser';
import {
  updateState,
  getUrlWithProxy,
  checkForNewPosts,
  getPostDescription,
  findPost,
  togglePostShow,
} from './utils';

const getElements = () => ({
  form: document.querySelector('.rss-form'),
  h1: document.querySelector('h1'),
  submitBtn: document.getElementById('submit'),
  lead: document.querySelector('.lead'),
  input: document.getElementById('input'),
  posts: document.querySelector('.posts'),
  feeds: document.querySelector('.feeds'),
  modal: document.querySelector('#modal'),
  modalCloseBtns: document.querySelectorAll('[data-close="closeModal"]'),
  modalBody: document.querySelector('.modal-body'),
  modalTitle: document.querySelector('.modal-title'),
  modalViewBtn: document.querySelector('#viewBtn'),
});

const showBtnHandler = (state) => (event) => {
  if (event.target.type === 'submit') {
    const title = event.target.parentElement.querySelector('a');
    state.modal.title = title.textContent;
    const post = findPost(state.posts, title.textContent);
    state.modal.description = getPostDescription(post, title.textContent);
    togglePostShow(post);
    const a = event.target.parentElement.querySelector('a');
    state.modal.idPost = a.dataset.id;
    state.modal.link = title;
    state.modal.show = true;
  }
};

const app = () => {
  const client = new axios.Axios({ timeout: 10000 });
  const elements = getElements();
  const i18nInstance = i18n.createInstance();

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
      idPost: null,
    },
  };

  const watchedState = initView(state, elements, i18nInstance);

  elements.posts.addEventListener('click', showBtnHandler(watchedState));

  [...elements.modalCloseBtns].forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
      watchedState.modal.title = '';
      watchedState.modal.description = '';
      watchedState.modal.show = false;
    });
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.form.error = validate(watchedState.feeds, url);
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
        })
        .catch(() => {
          watchedState.form.error = 'networkError';
          watchedState.form.processState = 'failed';
        });
      checkForNewPosts(watchedState, client);
    }
  });
};

export default app;
