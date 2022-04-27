import "../styles/globals.scss";
import Container from "@mui/material/Container";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Strapi Twitter</title>
        <meta name="description" content="Blog Strapi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <Container>
        <Component {...pageProps} />
      </Container>
    </>
  );
}

export default MyApp;
