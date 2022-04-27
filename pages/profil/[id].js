import { useEffect, useState } from "react";
import UpdateUser from "../../components/updateUser";
import css from "./index.module.scss";
import CardPost from "../../components/CardPost";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

export default function Profil({ userInfos, userPosts }) {
  const [user, setUser] = useState();
  const [dateInscription, setDateInscription] = useState();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setUser(window.localStorage.getItem("username"));

    const maDate = new Date(userInfos.createdAt);
    setDateInscription(maDate.toLocaleDateString("fr"));
  }, []);

  console.log(userInfos.description);

  return (
    <div className={css.profil}>
      <div>
        {user === userInfos.username ? (
          <h2>Bienvenue sur ton profil {userInfos.username} !</h2>
        ) : (
          <h2>Profil de {userInfos.username}</h2>
        )}
        <div className={css.descriptionUser}>
          <h3>Description :</h3>
          {userInfos.description === undefined ? (
            <p>Aucune description</p>
          ) : (
            <p>{userInfos.description}</p>
          )}
        </div>
        <p>Membre depuis le {dateInscription}</p>
        {user === userInfos.username && <p>Email : {userInfos.email}</p>}

        {user === userInfos.username && (
          <Button
            className={css.buttonModal}
            variant="contained"
            onClick={handleOpen}
          >
            Modifier votre profil
          </Button>
        )}

        <Modal open={open} onClose={handleClose}>
          <Box className={css.modal}>
            <Typography sx={{ mt: 2 }}>
              {user === userInfos.username && <UpdateUser data={userInfos} />}
            </Typography>
          </Box>
        </Modal>
      </div>

      <div className={css.listPosts}>
        {userPosts.data.length > 0 ? (
          userPosts.data.map((userPost) => {
            return <CardPost className={css.card} post={userPost} />;
          })
        ) : (
          <p>Aucune publication</p>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const user = await fetch(
    `https://my-app-56mpx.ondigitalocean.app/api/users/${params.id}?populate=*`
  );
  const userInfos = await user.json();

  const userPost = await fetch(
    `https://my-app-56mpx.ondigitalocean.app/api/posts?sort[0]=id%3Adesc&filters[users_permissions_user][id][$eq]=${params.id}&populate=*`
  );
  const userPosts = await userPost.json();

  return {
    props: {
      userInfos,
      userPosts,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
