import onChange from 'on-change';
import resources from './locales';

const removeError = (elements) => {
  const error = elements.form.querySelector('.feedback');
  if (error) {
    error.remove();
  }
  elements.input.classList.remove('is-invalid');
};

const addError = (elements, text) => {
  const error = document.createElement('div');
  error.classList.add('feedback', 'text-danger');
  error.innerHTML = text;
  elements.form.append(error);
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
        addError(elements, i18nInstance.t('errors.networkError'));
        break;
      case 'invalidUrl':
        addError(elements, i18nInstance.t('errors.invalidUrl'));
        break;
      case 'notFeed':
        addError(elements, i18nInstance.t('errors.notFeed'));
        break;
      case null:
        alert('Done!');
        addError(elements, i18nInstance.t('sucess.done'));
        break;
      default:
        throw Error(`Unknown error ${fieldError}`);
    }
  }
};

const createHead = (text) => {
  const head = document.createElement('h2');
  head.innerText = text;
  return head;
};

const renderData = (state, elements, i18nInstance) => {
  const { feeds, posts } = state;
  if (feeds.length === 0) {
    return;
  }
  elements.feeds.innerHTML = '';
  elements.feeds.appendChild(createHead(i18nInstance.t('texts.h2Feed')));
  const ulFeed = document.createElement('ul');
  ulFeed.classList.add('list-group', 'mb-5');
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'mb-5');
    const h3 = document.createElement('h3');
    h3.innerText = feed.feeds.title;
    const p = document.createElement('p');
    p.innerText = feed.feeds.description;
    li.appendChild(h3);
    li.appendChild(p);
    ulFeed.appendChild(li);
  });
  elements.feeds.appendChild(ulFeed);

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
      'align-items-start'
    );
    const h5 = document.createElement('h5');
    h5.innerText = post.post.title;
    li.appendChild(h5);
    ulPost.appendChild(li);
  });
  elements.posts.appendChild(ulPost);
};

const renderForm = (state, elements, i18nInstance) => {
  switch (state.form.processState) {
    case 'filling':
      elements.submitBtn.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      elements.input.value = '';
      renderData(state, elements, i18nInstance);
      break;

    case 'failed':
      elements.submitBtn.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      elements.input.select();
      break;

    case 'loading':
      elements.submitBtn.setAttribute('disabled', true);
      elements.input.setAttribute('disabled', true);
      removeError(elements);
      break;

    default:
      throw Error(`Unknown form status: ${state.form.processState}`);
  }
};

const initView = (state, elements, i18nInstance) => {
  elements.input.focus();
  const defaultLanguage = 'en';
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
      elements.posts.innerText = '';
    });

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.error':
        renderFormErrors(state.form, elements, i18nInstance);
        break;
      case 'form.processState':
        renderForm(state, elements, i18nInstance);
        break;
      default:
        break;
    }
  });

  return watchedState;
};

export default initView;
