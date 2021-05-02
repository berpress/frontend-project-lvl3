import onChange from 'on-change';
import resources from './locales';

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

  const field = form.error;
  if (field === null) {
    elements.input.classList.remove('is-invalid');
  } else {
    elements.input.classList.add('is-invalid');
    addError(elements, i18nInstance.t('errors.invalidUrl'));
  }
};

const initView = (state, elements, i18nInstance) => {
  const els = elements;
  els.input.focus();
  i18nInstance
    .init({
      lng: 'en',
      debug: true,
      resources,
    })
    .then(() => {
      els.submitBtn.innerHTML = i18nInstance.t('buttons.start');
    })
    .then(() => {
      els.h1.innerHTML = i18nInstance.t('texts.h1');
    })
    .then(() => {
      els.lead.innerHTML = i18nInstance.t('texts.lead');
    });

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.error':
        renderFormErrors(state.form, elements, i18nInstance);
        break;
      default:
        break;
    }
  });

  return watchedState;
};

export default initView;

// const buildErrorElement = (error) => {
//     const el = document.createElement('div');
//     el.classList.add('invalid-feedback');
//     el.textContent = error;
//     return el;
//   };

//   const buildTodoElement = (todo) => {
//     const el = document.createElement('li');
//     el.textContent = todo.name;
//     return el;
//   };

//   const renderTodos = (todos, elements) => {
//     elements.todosBox.textContent = '';
//     const todoNodes = todos.map(buildTodoElement);
//     elements.todosBox.append(...todoNodes);
//   };

//   const renderForm = (form, elements) => {
//     switch (form.status) {
//       case 'filling':
//         elements.submitBtn.removeAttribute('disabled');
//         elements.input.removeAttribute('disabled');
//         elements.input.value = '';
//         break;

//       case 'failed':
//         elements.submitBtn.removeAttribute('disabled');
//         elements.input.removeAttribute('disabled');
//         elements.input.select();
//         break;

//       case 'loading':
//         elements.submitBtn.setAttribute('disabled', true);
//         elements.input.setAttribute('disabled', true);
//         break;

//       default:
//         throw Error(`Unknown form status: ${form.status}`);
//     }
//   };

//   const renderFormErrors = (form, elements) => {
//     const error = elements.input.nextSibling;
//     if (error) {
//       error.remove();
//     }

//     const field = form.fields.name;
//     if (field.valid) {
//       elements.input.classList.remove('is-invalid');
//     } else {
//       elements.input.classList.add('is-invalid');
//       const errorElement = buildErrorElement(field.error);
//       elements.input.after(errorElement);
//     }
//   };

//   const renderAppError = (error, elements) => {
//     if (!error) return;
//     const toastBody = elements.toast.querySelector('.toast-body');
//     toastBody.textContent = error;
//     $('.toast').toast('show');
//   };

//   const initView = (state, elements) => {
//     elements.input.focus();

//     const mapping = {
//       'form.status': () => renderForm(state.form, elements),
//       'form.fields.name': () => renderFormErrors(state.form, elements),
//       'form.submitCount': () => elements.input.focus(),
//       error: () => renderAppError(state.error, elements),
//       todos: () => renderTodos(state.todos, elements),
//     };

//     const watchedState = onChange(state, (path) => {
//       if (mapping[path]) {
//         mapping[path]();
//       }
//     });

//     return watchedState;
//   };
