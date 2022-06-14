import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import client from "../utils/sanityClient";
import PostPreview from "components/PostPreview";
import { postPreviewQuery, PostPreviewType } from "../queries";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const posts = await client.fetch<PostPreviewType[]>(
    `*[_type == "post"]{ ${postPreviewQuery} }`
  );

  return {
    props: {
      posts,
    },
    revalidate: 60,
  };
};

export default function HomePage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <main className={"container mx-auto"}>
      <h1>Hello, World!</h1>
      <p>
        Dette er en side for å demonstrere NextJs. Den er bygget med NextJs,
        Typescipt, Sanity og er hostet på Vercel.
      </p>
      <h2>Artikler</h2>
      <ul className={"grid grid-cols-3 gap-5"}>
        {props.posts.map((post) => (
          <PostPreview key={post.slug} {...post} />
        ))}
      </ul>
    </main>
  );
}
