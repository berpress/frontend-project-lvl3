import differenceBy from 'lodash/differenceBy';
import parser from './parser';

const TIMEOUT_VALUE = 5000;
const PROXY_URL = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';

export const updateState = (dataRSS, state, link) => {
  if (dataRSS.feed === null) {
    state.form.error = 'notFeed';
    state.form.processState = 'failed';
  } else {
    const id = state.feeds.length;
    state.feeds.push({ id: id + 1, feed: dataRSS.feed, link });

    const posts = dataRSS.posts.map((post) => ({ id: id + 1, ...post }));
    const arr = state.posts;
    state.posts = arr.concat(posts);

    state.form.success = null;
    state.form.processState = 'filling';
  }
};

export const getUrlWithProxy = (url) => `${PROXY_URL}${encodeURIComponent(url)}`;

export const checkForNewPosts = (state, client) => {
  setTimeout(checkForNewPosts, TIMEOUT_VALUE, state, client);
  const { feeds } = state;
  const urls = feeds.map((feed) => feed.link);
  urls.forEach((url) => {
    const corsUrl = getUrlWithProxy(url);
    client
      .get(corsUrl)
      .then((response) => {
        const dataRSS = parser(JSON.parse(response.data).contents);
        const { feed, posts } = dataRSS;
        const { title } = feed;

        const currentFeed = feeds.find((item) => item.feed.title === title);
        const { id } = currentFeed;

        const newPosts = posts.map((post) => ({ ...post, id }));
        const diffPosts = differenceBy(newPosts, state.posts, 'title');
        if (diffPosts.length !== 0) {
          state.posts = [...diffPosts, ...state.posts];
        }
      })
      .catch((err) => {
        throw err;
      });
  });
};

export const findPost = (posts, title) => {
  const post = posts.filter((p) => p.title === title)[0];
  if (findPost.length === 0) {
    throw new Error('Post not found');
  }
  return post;
};

export const togglePostShow = (post) => {
  if (!post.isShow) {
    post.isShow = true;
  }
};

export const getPostDescription = (post) => post.description.replace(/<[^>]*>?/gm, '');
