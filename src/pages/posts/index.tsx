import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import client from "utils/sanityClient";
import PostPreview from "components/PostPreview";
import { postPreviewQuery, PostPreviewType } from "queries";
import Link from "next/link";
import SearchPost from "components/SearchPosts";
import { useState } from "react";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const query = context.query;
  const searchString: string =
    typeof query.search === "string" ? query.search : "";

  const result = await client.fetch<PostPreviewType[]>(`
    *[_type == "post" && summary match "*${searchString}*"] { ${postPreviewQuery} }
  `);

  return {
    props: {
      result,
      searchString,
    },
  };
};

export default function SearchPostPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [posts, setPosts] = useState(props.result);

  return (
    <main className={"container mx-auto py-4 px-2"}>
      <Link href={`/`}>
        <a
          className={
            "self-end py-3 px-5 rounded-full bg-gray-100 text-sm font-semibold transition-all hover:bg-blue-500 my-8 block max-w-min hover:text-white"
          }
        >
          Tilbake
        </a>
      </Link>
      <h1>Søk etter artikler</h1>
      <SearchPost
        initialValue={props.searchString}
        onSearchResults={setPosts}
      />
      <hr className={"mt-8"} />
      <h2>Resultat</h2>
      {posts.length > 0 ? (
        <ul className={"grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-5"}>
          {posts.map((post) => (
            <PostPreview key={post.slug} {...post} />
          ))}
        </ul>
      ) : (
        <span className={"text-sm my-10 font-semibold"}>
          <i>Fant ingen resultater...</i>
        </span>
      )}
    </main>
  );
}
