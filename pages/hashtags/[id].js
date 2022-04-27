import css from "./index.module.scss";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardContent, Link } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardPost from "../../components/CardPost";

export default function Hashtags({ hashtag, hashtagInfos }) {
  return (
    <div className={css.hashtag}>
      <h2>#{hashtagInfos.data.attributes.title} </h2>
      <p>
        {hashtagInfos.data.attributes.posts.data.length}{" "}
        {hashtagInfos.data.attributes.posts.data.length <= 1
          ? "publication"
          : "publications"}
      </p>

      {hashtag.data.map((cardInfos, index) => {
        return <CardPost post={cardInfos} key={index} />;
      })}
    </div>
  );
}

export async function getStaticProps({ params }) {
  const hashInfos = await fetch(
    `https://my-app-56mpx.ondigitalocean.app/api/hashtags/${params.id}?populate=*`
  );
  const hashtagInfos = await hashInfos.json();

  const hash = await fetch(
    `https://my-app-56mpx.ondigitalocean.app/api/posts?sort[0]=id%3Adesc&filters[hashtags][id][$eq]=${params.id}&populate=*`
  );
  const hashtag = await hash.json();

  return {
    props: {
      hashtag,
      hashtagInfos,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
