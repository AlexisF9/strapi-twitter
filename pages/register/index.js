import css from "./index.module.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createRef, useState } from "react";
import { Link } from "@mui/material";
import Alert from "@mui/material/Alert";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifPassword, setVerifPassword] = useState("");

  const erreurMDP = createRef();
  const erreurPseudo = createRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      username: username,
      email: email,
      password: password,
      role: "Authenticated",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    if (password === verifPassword) {
      try {
        const rep = await fetch(
          `http://localhost:1337/api/auth/local/register`,
          requestOptions
        );

        const response = await rep.json();

        Cookies.set("authToken", response.jwt, { expires: 5 });
        Cookies.set("username", response.user.username, { expires: 5 });
        Cookies.set("idUser", response.user.id, { expires: 5 });

        setUsername("");
        setEmail("");
        setPassword("");
        setVerifPassword("");
        window.location.href = "/";
      } catch (e) {
        erreurPseudo.current.classList.add(css.errorPSEUDO);
      }
    } else {
      erreurMDP.current.classList.add(css.errorMDP);
    }
  };
  return (
    <div className={css.formRegister}>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit} action={handleSubmit}>
        <div>
          <TextField
            required
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
            Ce pseudo existe déjà
          </Alert>
        </div>
        <div>
          <TextField
            required
            id="email"
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
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
        <div>
          <TextField
            required
            id="verif_password"
            label="Verification mot de passe"
            type="password"
            name="verif_password"
            value={verifPassword}
            onChange={(e) => {
              setVerifPassword(e.currentTarget.value);
            }}
          />
        </div>
        <div className={css.error} ref={erreurMDP}>
          <Alert className={css.alertMDP} severity="error">
            Les mots de passes doivent être identique
          </Alert>
        </div>
        <div className={css.inscriptionBtn}>
          <Button variant="contained" type="submit">
            S'inscrire
          </Button>
          <Link href="/">
            <a className={css.linkConnexion}>Déja inscrit ? Se connecter</a>
          </Link>
        </div>
      </form>
    </div>
  );
}
