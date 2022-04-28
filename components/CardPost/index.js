import css from "./index.module.scss";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardContent, Link } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import { useEffect, useState } from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

export default function CardPost({ post }) {
  const [date, setDate] = useState();
  const [user, setUser] = useState();
  const [userToken, setUserToken] = useState();

  useEffect(() => {
    setUser(window.localStorage.getItem("username"));
    setUserToken(window.localStorage.getItem("authToken"));

    const maDate = new Date(post.attributes.publishedAt);
    setDate("Publié le " + maDate.toLocaleString("fr"));
  });

  const handleDelete = async (event) => {
    event.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + userToken);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      if (
        window.confirm("Êtes-vous sur de vouloir supprimer cette publication ?")
      ) {
        const rep = await fetch(
          `http://localhost:1337/api/posts/${post.id}`,
          requestOptions
        );
        const response = await rep.json();
        window.location = "/";
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className={css.cards}>
      {post.attributes.image.data ? (
        <Link href={`/singlePost/${post.id}`}>
          <a>
            <Card sx={{ maxWidth: 500 }} className={css.cardPost}>
              {user ===
                post.attributes.users_permissions_user.data.attributes
                  .username && (
                <DeleteOutlinedIcon
                  onClick={handleDelete}
                  className={css.deletePostBtn}
                />
              )}
              <CardHeader
                title={
                  <Link
                    href={
                      "/profil/" +
                      post.attributes.users_permissions_user.data.id
                    }
                  >
                    <a>
                      {
                        post.attributes.users_permissions_user.data.attributes
                          .username
                      }
                    </a>
                  </Link>
                }
                subheader={date}
              />
              {post.attributes.image.data && (
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    "http://localhost:1337" +
                    post.attributes.image.data.attributes.formats.small.url
                  }
                  alt={post.attributes.title}
                />
              )}
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  {post.attributes.content.substring(0, 200) + "..."}
                </Typography>
                <div className={css.listHashtags}>
                  {post.attributes.hashtags.data.map((hashtags, index) => {
                    return (
                      <Link href={`/hashtags/${hashtags.id}`}>
                        <a>
                          <Typography
                            key={index}
                            variant="body2"
                            color="darkslateblue"
                          >
                            #{hashtags.attributes.title}
                          </Typography>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </a>
        </Link>
      ) : (
        <Link href={`/singlePost/${post.id}`}>
          <a>
            <Card sx={{ maxWidth: 500 }} className={css.cardPost}>
              {user ===
                post.attributes.users_permissions_user.data.attributes
                  .username && (
                <DeleteOutlinedIcon
                  onClick={handleDelete}
                  className={css.deletePostBtn}
                />
              )}
              <CardHeader
                title={
                  <Link
                    href={
                      "/profil/" +
                      post.attributes.users_permissions_user.data.id
                    }
                  >
                    <a>
                      {
                        post.attributes.users_permissions_user.data.attributes
                          .username
                      }
                    </a>
                  </Link>
                }
                subheader={date}
              />
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  {post.attributes.content.substring(0, 200) + "..."}
                </Typography>
                <div className={css.listHashtags}>
                  {post.attributes.hashtags.data.map((hashtags, index) => {
                    return (
                      <Link href={`/hashtags/${hashtags.id}`}>
                        <a>
                          <Typography
                            key={index}
                            variant="body2"
                            color="darkslateblue"
                          >
                            #{hashtags.attributes.title}
                          </Typography>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </a>
        </Link>
      )}
    </div>
  );
}
