import * as React from "react";
import { useEffect, useState } from "react";
import css from "./index.module.scss";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import PostsAPI from "../../services/postsAPI";
import CreateComments from "../../components/createComments";
import Comment from "../../components/comment";
import { Link } from "@mui/material";

export default function singlePost({ post }) {
  const [isLoading, setIsLoading] = useState(false);

  const [singlePost, setSinglePost] = useState(post);
  const [date, setDate] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const maDate = new Date(post.data.attributes.publishedAt);
    setDate("Publié le " + maDate.toLocaleDateString("fr"));

    setUser(window.localStorage.getItem("username"));
  });

  async function syncComments() {
    setSinglePost(
      await (
        await fetch(
          `https://my-app-56mpx.ondigitalocean.app/api/posts/${post.data.id}?populate=*`
        )
      ).json()
    );

    setIsLoading(false);
  }

  return (
    <div className={css.container}>
      <div className={css.postInfos}>
        <h2>
          <Link
            href={
              "/profil/" + post.data.attributes.users_permissions_user.data.id
            }
          >
            <a>
              {
                post.data.attributes.users_permissions_user.data.attributes
                  .username
              }
            </a>
          </Link>
        </h2>
        <p>{date}</p>
        <div className={css.content}>
          {post.data.attributes.image.data && (
            <img
              src={
                "https://my-app-56mpx.ondigitalocean.app" +
                post.data.attributes.image.data.attributes.formats.small.url
              }
            />
          )}

          <p>{post.data.attributes.content}</p>
        </div>
      </div>

      <h3 className={css.titleComment}>
        Commentaires : {singlePost.data.attributes.comments.data.length}
      </h3>

      <div className={css.comments}>
        <CreateComments
          id={post.data.id}
          onStart={() => {
            setIsLoading(true);
          }}
          onComplete={syncComments}
        />
        <div className={css.listComments}>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {isLoading ? (
              <div className={css.loader}>
                <CircularProgress />
              </div>
            ) : (
              singlePost.data.attributes.comments.data.map((commentData) => {
                return <Comment data={commentData} />;
              })
            )}
          </List>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const post = await PostsAPI.findOne(params.id);
  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
