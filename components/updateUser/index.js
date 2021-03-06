//import css from "./index.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createRef, useEffect, useState } from "react";
import css from "./index.module.scss";
import Alert from "@mui/material/Alert";
import Cookies from "js-cookie";

export default function UpdateUser(props) {
  const [user, setUser] = useState("");
  const [userToken, setUserToken] = useState();

  const [username, setUsername] = useState(props.data.username);
  const [email, setEmail] = useState(props.data.email);
  const [description, setDescription] = useState(props.data.description);

  const erreurPseudo = createRef();
  const erreurEmail = createRef();

  useEffect(() => {
    setUser(Cookies.get("idUser"));
    setUserToken(Cookies.get("authToken"));
  }, [username, email, description]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + userToken);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username: username,
      email: email,
      description: description,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const rep = await fetch(
        `http://localhost:1337/api/users/${user}`,
        requestOptions
      );
      const response = await rep.json();
      if (response.data === null) {
        if (response.error.message === "Username already taken") {
          erreurPseudo.current.classList.add(css.errorActive);
        } else {
          erreurEmail.current.classList.add(css.errorActive);
        }
      } else {
        Cookies.set("username", username, { expires: 5 });
        window.location.href = "/profil/" + user;
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={css.infoUser}>
      <h3>Modifier mes informations personnelles :</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="username"
            label="Pseudo"
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.currentTarget.value);
            }}
          />
        </div>
        <div className={css.error} ref={erreurPseudo}>
          <Alert className={css.erreurPseudo} severity="error">
            Ce pseudo est d??ja utilis??
          </Alert>
        </div>
        <div>
          <TextField
            id="email"
            type="email"
            label="Email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
          />
        </div>
        <div className={css.error} ref={erreurEmail}>
          <Alert className={css.erreurEmail} severity="error">
            Cet email est d??ja utilis??
          </Alert>
        </div>
        <div>
          <TextField
            id="description"
            label="Description"
            multiline
            rows={4}
            name="description"
            value={description}
            onChange={(e) => {
              setDescription(e.currentTarget.value);
            }}
          />
        </div>
        <div>
          <Button variant="contained" type="submit">
            Modifier
          </Button>
        </div>
      </form>
    </div>
  );
}
