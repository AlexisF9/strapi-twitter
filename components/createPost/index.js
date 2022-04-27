import css from "./index.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createRef, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";

export default function createPost(props) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState("");
  const [user, setUser] = useState();
  const [userToken, setUserToken] = useState();

  const _image = createRef();
  //let file = null;

  useEffect(() => {
    setUser(window.localStorage.getItem("idUser"));
    setUserToken(window.localStorage.getItem("authToken"));
  }, [content]);

  const onFileChange = () => {
    setFile(_image.current.querySelector("input").files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    let formdata;

    myHeaders.append("Authorization", "Bearer " + userToken); // on envoi le token pour prouver que la personne est authentifié
    //console.log(_image.current);
    // Si il y a une image
    if (file) {
      formdata = new FormData();
      formdata.append("files.image", file);

      formdata.append(
        "data",
        JSON.stringify({
          content: content,
          users_permissions_user: {
            id: user,
          },
          hashtags: [
            {
              id: tags,
            },
          ],
        })
      );
    } else {
      // Si il y a que du texte

      myHeaders.append("Content-Type", "application/json");

      formdata = JSON.stringify({
        data: {
          content: content,
          users_permissions_user: {
            id: user,
          },
          hashtags: [
            {
              id: tags,
            },
          ],
        },
      });
    }

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    try {
      const rep = await fetch(
        "https://my-app-56mpx.ondigitalocean.app/api/posts?populate=*",
        requestOptions
      );
      const response = await rep.json();
      props.onComplete(); // envoi le signal de l'ajout d'un post à la home
      setContent("");
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={css.formCreatePosts}>
      <div>
        <TextField
          required
          id="content"
          label="Content"
          multiline
          name="content"
          rows={4}
          value={content}
          onChange={(e) => {
            setContent(e.currentTarget.value);
          }}
        />
      </div>
      <div>
        <TextField
          id="content"
          type="file"
          name="content"
          ref={_image}
          onChange={onFileChange}
        />
      </div>
      <TextField
        id="hashtags"
        select
        label="Ajoutez un hashtag"
        value={tags}
        onChange={(e) => {
          setTags(e.currentTarget.value);
        }}
        SelectProps={{
          native: true,
        }}
      >
        <option></option>
        {props.hashtag.data.map((option, index) => (
          <option key={index} value={option.id}>
            #{option.attributes.title}
          </option>
        ))}
      </TextField>
      <div>
        <Button variant="contained" type="submit">
          Envoyer
        </Button>
      </div>
    </form>
  );
}
