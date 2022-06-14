import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import client from "utils/sanityClient";
import PostPreview from "components/PostPreview";
import { postPreviewQuery, PostPreviewType } from "queries";
import SearchPost from "components/SearchPosts";
import { useState } from "react";

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
  const [posts, setPosts] = useState(props.posts);
  const [isSearching, setIsSearcing] = useState(false);

  const onSearch = async (search: string) => {
    try {
      setIsSearcing(true);
      const posts = await client.fetch<PostPreviewType[]>(`
        *[_type == "post" && summary match "*${search}*"] { ${postPreviewQuery} }
      `);
      setPosts(posts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearcing(false);
    }
  };

  return (
    <main className={"container mx-auto pt-4 px-2"}>
      <h1>Hello, World!</h1>
      <p>
        Dette er en side for å demonstrere NextJs. Den er bygget med NextJs,
        Typescipt, Sanity og er hostet på Vercel.
      </p>
      <h2>Artikler</h2>

      <h3>Søk etter artikler</h3>
      <SearchPost
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSearch(e.target[0].value);
        }}
        disabled={isSearching}
      />
      <hr className={"my-8"} />

      <ul className={"grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-5"}>
        {posts.length > 0 ? (
          posts.map((post) => <PostPreview key={post.slug} {...post} />)
        ) : (
          <span className={"text-sm my-10 font-semibold"}>
            <i>Fant ingen resultater...</i>
          </span>
        )}
      </ul>
    </main>
  );
}
