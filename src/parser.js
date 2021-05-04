// eslint-disable-next-line import/no-extraneous-dependencies
import * as _ from 'lodash';

const getFeed = (data) => {
  const feeds = data.querySelector('channel');
  if (feeds) {
    const title = feeds.querySelector('title');
    const description = feeds.querySelector('description');
    const link = feeds.querySelector('link');
    return {
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
    };
  }
  return null;
};

const getPosts = (data) => {
  const items = data.querySelectorAll('item');
  if (items.length > 0) {
    const resArray = [...items].map((item) => {
      const title = item.querySelector('title');
      const link = item.querySelector('link');
      return { title: title.textContent, link: link.textContent };
    });
    return _.flatten(resArray);
  }
  return null;
};

export default (data) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data, 'text/xml');
  const feeds = getFeed(document);
  const posts = getPosts(document);
  return { feeds, posts };
};
