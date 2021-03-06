import css from "./index.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createRef, useState } from "react";
import { Link } from "@mui/material";
import Alert from "@mui/material/Alert";
import Cookies from "js-cookie";

export default function Login(props) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const error = createRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      identifier: identifier,
      password: password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const rep = await fetch(
        `http://localhost:1337/api/auth/local`,
        requestOptions
      );

      const response = await rep.json();
      Cookies.set("authToken", response.jwt, { expires: 5 });
      Cookies.set("username", response.user.username, { expires: 5 });
      Cookies.set("idUser", response.user.id, { expires: 5 });
      setIdentifier("");
      setPassword("");
      window.location.href = "/";
    } catch (e) {
      error.current.classList.add(css.alertError);
    }
  };

  return (
    <form onSubmit={handleSubmit} action={handleSubmit} className={css.form}>
      <div>
        <TextField
          required
          id="identifier"
          label="Email"
          type="email"
          name="identifier"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.currentTarget.value);
          }}
        />
      </div>
      <div>
        <TextField
          required
          id="password"
          label="Mot de passe"
          type="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
        />
      </div>
      <div className={css.error} ref={error}>
        <Alert className={css.alert} severity="error">
          Email ou mot de passe incorrect
        </Alert>
      </div>
      <div className={css.connexionBtn}>
        <Button variant="contained" type="submit">
          Se connecter
        </Button>
        <Link href={props.linkRegister}>
          <a className={css.linkRegister}>Toujours pas inscrit ?</a>
        </Link>
      </div>
    </form>
  );
}
