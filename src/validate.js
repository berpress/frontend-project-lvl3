import * as yup from 'yup';

const validateUrl = (url) => {
  const schema = yup.string().url();
  return schema.isValidSync(url);
};

const checkDoubleUrl = (feeds, url) => {
  const links = feeds.map((feed) => feed.link);
  return links.includes(url);
};

export default (feeds, link) => {
  if (!validateUrl(link)) {
    return 'invalidLink';
  }
  if (checkDoubleUrl(feeds, link)) {
    return 'rssIsAdd';
  }
  if (link === '') {
    return 'emptyLink';
  }
  return null;
};
