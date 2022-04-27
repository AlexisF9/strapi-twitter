import { Link } from "@mui/material";
import { useEffect, useState } from "react";
import CardPost from "../components/CardPost";
import CreatePost from "../components/createPost";
import Login from "../components/login";
import postsAPI from "../services/postsAPI";
import CircularProgress from "@mui/material/CircularProgress";
import css from "../styles/Home.module.scss";

export default function Home({ hashtag }) {
  const [user, setUser] = useState();
  const [userID, setUserID] = useState();
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function logout() {
    localStorage.clear();
    window.location.href = "/";
  }

  useEffect(() => {
    fetchAllPosts(); // appel de la fonction au chargement de la page

    setUser(window.localStorage.getItem("username"));
    setUserID(window.localStorage.getItem("idUser"));
  }, []);

  // FETCH ALL POSTS AU CHERGEMENT DE LA PAGE
  const fetchAllPosts = async () => {
    const data = await postsAPI.findAll();
    setPosts(data);
    setIsLoading(false);
  };

  // AJOUT POST APRES CREATION SANS RECHERGEMENT DE PAGE
  async function syncPosts() {
    setPosts(
      await (
        await fetch(
          `https://my-app-56mpx.ondigitalocean.app/api/posts?sort[0]=id%3Adesc&populate=*`
        )
      ).json()
    );

    setIsLoading(false);
  }

  return (
    <div className={css.container}>
      <div className={css.menuInfos}>
        {user ? (
          <div>
            <h2>
              Bienvenue{" "}
              <Link href={"/profil/" + userID}>
                <a>{user}</a>
              </Link>
            </h2>
            <a className={css.btnLogout} onClick={logout}>
              Se déconnecter
            </a>
            <p className={css.titleNewPosts}>Nouvelle publication :</p>
            <CreatePost
              hashtag={hashtag}
              onComplete={
                syncPosts
              } /* quand on post, envoi le signal onCOMPLETE et lance la fonction */
            />
          </div>
        ) : (
          <div>
            <h2>Bienvenue !</h2>
            <p>Connectez-vous pour voir les publications</p>
            <Login linkRegister="/register" />
          </div>
        )}
      </div>

      {user && (
        <div className={css.listPosts}>
          {isLoading ? (
            <div className={css.loader}>
              <CircularProgress />
            </div>
          ) : (
            posts.data.map((datas, index) => {
              return <CardPost post={datas} key={index} />;
            })
          )}
        </div>
      )}

      {user && (
        <div className={css.listHashtags}>
          <h3>Hashtags :</h3>
          <div>
            {hashtag.data.map((hash, index) => {
              return (
                <Link key={index} href={`hashtags/${hash.id}`}>
                  <a>#{hash.attributes.title}</a>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const hash = await fetch(
    `https://my-app-56mpx.ondigitalocean.app/api/hashtags?populate=*`
  );
  const hashtag = await hash.json();

  return {
    props: {
      hashtag,
    },
  };
}
