// FIND ALL POSTS
function findAll() {
  return fetch(`http://localhost:1337/api/posts?sort[0]=id%3Adesc&populate=*`, {
    method: "GET",
    headers: {
      Accept: "Application/json",
    },
  }).then((res) => res.json());
}

// FIND ONE POST
function findOne(id) {
  return fetch(`http://localhost:1337/api/posts/${id}?populate=*`, {
    method: "GET",
    headers: {
      Accept: "Application/json",
    },
  }).then((res) => res.json());
}

export default {
  findAll,
  findOne,
};
