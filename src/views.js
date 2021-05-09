import _ from 'lodash';
import onChange from 'on-change';
import resources from './locales';

const renderOpenPost = (id) => {
  const postElement = document.querySelector(`[data-id="${id}"]`);
  postElement.classList.remove('font-weight-bold');
  postElement.classList.add('font-weight-normal');
};

const showModal = (state, elements) => {
  if (state.modal.show) {
    elements.modal.classList.add('show');
    elements.modal.setAttribute('role', 'dialog');
    elements.modal.setAttribute('style', 'display: block;');
    elements.modalTitle.textContent = state.modal.title;
    elements.modalBody.textContent = state.modal.description;
    elements.modalViewBtn.setAttribute('href', state.modal.link);
    const id = state.modal.idPost;
    renderOpenPost(id);
  } else {
    elements.modal.classList.remove('show');
    elements.modal.setAttribute('style', 'display: none;');
    elements.modalTitle.textContent = '';
    elements.modalBody.textContent = '';
  }
};

const removeError = (elements) => {
  const error = elements.form.querySelector('.feedback');
  if (error) {
    error.remove();
  }
  elements.input.classList.remove('is-invalid');
};

const addFeedback = (elements, text, type = 'error') => {
  const feedback = document.createElement('div');
  switch (type) {
    case 'error':
      feedback.classList.add('feedback', 'text-danger');
      break;
    case 'add':
      feedback.classList.add('feedback', 'text-success');
      break;
    default:
      throw Error(`Unknown type ${type}`);
  }
  feedback.innerHTML = text;
  elements.form.append(feedback);
};

const renderFormErrors = (form, elements, i18nInstance) => {
  const error = elements.form.querySelector('.feedback');
  if (error) {
    error.remove();
  }
  const fieldError = form.error;
  if (fieldError === null) {
    elements.input.classList.remove('is-invalid');
  } else {
    elements.input.classList.add('is-invalid');
    switch (fieldError) {
      case 'networkError':
        addFeedback(elements, i18nInstance.t('errors.networkError'));
        break;
      case 'invalidLink':
        addFeedback(elements, i18nInstance.t('errors.invalidUrl'));
        break;
      case 'notFeed':
        addFeedback(elements, i18nInstance.t('errors.notFeed'));
        break;
      case 'rssIsAdd':
        addFeedback(elements, i18nInstance.t('errors.doubleUrl'));
        break;
      default:
        throw Error(`Unknown error ${fieldError}`);
    }
  }
};

const createHead = (text) => {
  const head = document.createElement('h2');
  head.textContent = text;
  return head;
};

const renderPosts = (state, elements, i18nInstance) => {
  const { posts } = state;
  elements.posts.innerHTML = '';
  elements.posts.appendChild(createHead(i18nInstance.t('texts.h2Posts')));
  const ulPost = document.createElement('ul');
  ulPost.classList.add('list-group', 'mb-5');
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
    );
    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.textContent = post.title;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    if (post.isShow) {
      a.classList.remove('font-weight-bold');
      a.classList.add('font-weight-normal');
    } else {
      a.classList.add('font-weight-bold');
    }
    a.setAttribute('data-id', _.uniqueId());
    const button = document.createElement('button');
    button.textContent = i18nInstance.t('buttons.showPost');
    button.classList.add('btn', 'btn-primary', 'btn-sm');
    button.setAttribute('data-button', 'show');
    li.appendChild(a);
    li.appendChild(button);
    ulPost.appendChild(li);
  });
  elements.posts.appendChild(ulPost);
};

const renderFeeds = (state, elements, i18nInstance) => {
  const { feeds } = state;
  elements.feeds.innerHTML = '';
  elements.feeds.appendChild(createHead(i18nInstance.t('texts.h2Feed')));
  const ulFeed = document.createElement('ul');
  ulFeed.classList.add('list-group', 'mb-5');
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const h3 = document.createElement('h3');
    h3.textContent = feed.feed.title;
    const p = document.createElement('p');
    p.textContent = feed.feed.description;
    li.appendChild(h3);
    li.appendChild(p);
    ulFeed.appendChild(li);
  });
  elements.feeds.appendChild(ulFeed);
};

const renderData = (state, elements, i18nInstance) => {
  removeError(elements);
  addFeedback(elements, i18nInstance.t('sucess.done'), 'add');
  const { feeds } = state;
  if (feeds.length === 0) {
    return;
  }
  renderFeeds(state, elements, i18nInstance);
  renderPosts(state, elements, i18nInstance);
};

const renderForm = (state, elements, i18nInstance) => {
  switch (state.form.processState) {
    case 'filling':
      elements.submitBtn.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      elements.input.value = '';
      elements.input.removeAttribute('readonly');
      break;

    case 'failed':
      elements.submitBtn.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      elements.input.removeAttribute('readonly');
      elements.input.select();
      renderFormErrors(state.form, elements, i18nInstance);
      break;

    case 'loading':
      elements.submitBtn.setAttribute('disabled', true);
      elements.input.setAttribute('readonly', true);
      removeError(elements);
      break;

    default:
      throw Error(`Unknown form status: ${state.form.processState}`);
  }
};
const initView = (state, elements, i18nInstance) => {
  elements.input.focus();
  const defaultLanguage = 'ru';
  i18nInstance
    .init({
      lng: defaultLanguage,
      debug: true,
      resources,
    })
    .then(() => {
      elements.submitBtn.innerHTML = i18nInstance.t('buttons.start');
    })
    .then(() => {
      elements.h1.innerHTML = i18nInstance.t('texts.h1');
    })
    .then(() => {
      elements.lead.innerHTML = i18nInstance.t('texts.lead');
    })
    .then(() => {
      elements.feeds.innerHTML = i18nInstance.t('texts.feed');
    })
    .then(() => {
      elements.posts.textContent = '';
    });

  return onChange(state, (path) => {
    switch (path) {
      case 'form.error':
        renderForm(state, elements, i18nInstance);
        break;
      case 'modal.show':
        showModal(state, elements);
        break;
      case 'posts':
        renderData(state, elements, i18nInstance);
        break;
      case 'form.processState':
        renderForm(state, elements, i18nInstance);
        break;
      default:
        break;
    }
  });
};

export default initView;
