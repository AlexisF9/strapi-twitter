import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { deepPurple } from "@mui/material/colors";
import { Link } from "@mui/material";
import css from "./index.module.scss";

export default function comment(props) {
  const [user, setUser] = useState();
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [date, setDate] = useState("");

  useEffect(() => {
    syncComments();
    setUser(window.localStorage.getItem("username"));
  }, []);

  async function syncComments() {
    const com = await fetch(
      `https://my-app-56mpx.ondigitalocean.app/api/comments/${props.data.id}?populate=*`
    );
    const rep = await com.json();

    setComment(rep.data);

    const maDate = new Date(rep.data.attributes.publishedAt);
    setDate("Le " + maDate.toLocaleString("fr"));

    setIsLoading(false);
  }

  return (
    <>
      {isLoading === false && (
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            {comment.attributes.users_permissions_user.data.attributes
              .username === user ? (
              <Avatar
                sx={{ bgcolor: deepPurple[500] }}
                alt={
                  comment.attributes.users_permissions_user.data.attributes
                    .username
                }
                src="/static/images/avatar/1.jpg"
              />
            ) : (
              <Avatar
                alt={
                  comment.attributes.users_permissions_user.data.attributes
                    .username
                }
                src="/static/images/avatar/1.jpg"
              />
            )}
          </ListItemAvatar>
          <ListItemText
            primary={
              <Link
                href={
                  "/profil/" + comment.attributes.users_permissions_user.data.id
                }
              >
                <a className={css.linkCommentAuthor}>
                  {
                    comment.attributes.users_permissions_user.data.attributes
                      .username
                  }
                </a>
              </Link>
            }
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {date}
                </Typography>
                {" - " + comment.attributes.content}
              </React.Fragment>
            }
          />
        </ListItem>
      )}
    </>
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
