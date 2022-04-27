import css from "./index.module.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";

export default function Likes(props) {
  const [user, setUser] = useState();
  const [userToken, setUserToken] = useState();
  const [like, seLike] = useState(false);

  useEffect(() => {
    setUser(window.localStorage.getItem("idUser"));
    setUserToken(window.localStorage.getItem("authToken"));
  }, []);

  const addLike = async (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + userToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      data: {
        post: {
          id: props.postData,
        },
        users_permissions_user: {
          id: user,
        },
      },
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const rep = await fetch(
        "https://my-app-56mpx.ondigitalocean.app/api/likes?populate=*",
        requestOptions
      );
      const response = await rep.json();
      props.onComplete(props.postData);
      seLike(true);
    } catch (e) {
      console.log("error", e);
    }
  };

  const removeLike = async (event) => {
    event.preventDefault();
  };

  return (
    <div className={css.likes}>
      {like ? (
        <div onClick={removeLike}>
          <FavoriteIcon />
        </div>
      ) : (
        <div onClick={addLike}>
          <FavoriteBorderIcon />
        </div>
      )}
    </div>
  );
}
