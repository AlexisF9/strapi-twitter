// FIND ALL POSTS
function findAll() {
  return fetch(
    `https://my-app-56mpx.ondigitalocean.app/api/posts?sort[0]=id%3Adesc&populate=*`,
    {
      method: "GET",
      headers: {
        Accept: "Application/json",
      },
    }
  ).then((res) => res.json());
}

// FIND ONE POST
function findOne(id) {
  return fetch(
    `https://my-app-56mpx.ondigitalocean.app/api/posts/${id}?populate=*`,
    {
      method: "GET",
      headers: {
        Accept: "Application/json",
      },
    }
  ).then((res) => res.json());
}

export default {
  findAll,
  findOne,
};
