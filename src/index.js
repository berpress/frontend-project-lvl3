// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';

// eslint-disable-next-line no-unused-vars
function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}
