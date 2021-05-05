// eslint-disable-next-line import/no-extraneous-dependencies
import * as _ from 'lodash';

const getFeed = (data) => {
  const feed = data.querySelector('channel');
  if (feed) {
    const title = feed.querySelector('title');
    const description = feed.querySelector('description');
    return {
      title: title.textContent,
      description: description.textContent,
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
      const description = item.querySelector('description');
      return {
        title: title.textContent,
        link: link.textContent,
        description: description.textContent,
        isShow: false,
      };
    });
    return _.flatten(resArray);
  }
  return null;
};

export default (data) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data, 'text/xml');
  const feed = getFeed(document);
  const posts = getPosts(document);
  return { feed, posts };
};
