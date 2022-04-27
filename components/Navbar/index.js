import { useEffect, useState } from "react";
import css from "./index.module.scss";
import Container from "@mui/material/Container";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(window.localStorage.getItem("username"));
  });

  return (
    <nav className={css.header}>
      <Container className={css.content}>
        <Link href="/" passHref>
          <a>
            <h1>Strapi Twitter</h1>
          </a>
        </Link>

        <div className={css.menu}></div>
      </Container>
    </nav>
  );
}
