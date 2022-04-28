import css from "./index.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

export default function CreateComments(props) {
  const [user, setUser] = useState("");
  const [content, setContent] = useState("");
  const [userToken, setUserToken] = useState();

  useEffect(() => {
    setUser(window.localStorage.getItem("idUser"));
    setUserToken(window.localStorage.getItem("authToken"));
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    props.onStart();

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + userToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      data: {
        content: content,
        users_permissions_user: {
          id: user,
        },
        post: {
          id: props.id,
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
        `http://localhost:1337/api/comments`,
        requestOptions
      );
      const response = await rep.json();
      props.onComplete();
      setPseudo("");
      setContent("");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <form className={css.formComment} onSubmit={handleSubmit}>
      <div>
        <TextField
          id="outlined-multiline-static"
          label="Content"
          multiline
          rows={4}
          name="content"
          value={content}
          onChange={(e) => {
            setContent(e.currentTarget.value);
          }}
        />
      </div>
      <div>
        <Button variant="contained" type="submit">
          Envoyer
        </Button>
      </div>
    </form>
  );
}
