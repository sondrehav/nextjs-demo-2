import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { ParsedUrlQuery } from "querystring";
import client from "utils/sanityClient";
import { postBodyQuery, postPreviewQuery, PostType } from "queries";
import Post from "components/Post";
import Link from "next/link";

interface StaticPathType extends ParsedUrlQuery {
  slug: string;
}
export const getStaticPaths = async (
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult<StaticPathType>> => {
  const posts = await client.fetch<{ slug: string }[]>(
    `*[_type == "post"]{ ...slug { "slug": current } }`
  );

  return {
    paths: posts.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<StaticPathType>
) => {
  if (!context.params?.slug) throw new Error("No slug in the URL parameters.");

  const post = await client.fetch<PostType>(
    `*[_type == "post" && slug.current == "${context.params.slug}"][0]{ ${postPreviewQuery}, ${postBodyQuery} }`
  );

  return {
    props: { post },
    revalidate: 60,
  };
};

export default function PostPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
      <Post {...post} />
    </main>
  );
}
