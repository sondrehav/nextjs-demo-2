import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { ParsedUrlQuery } from "querystring";
import client from "../utils/sanityClient";
import { postBodyQuery, postPreviewQuery, PostType } from "../queries";

interface StaticPathType extends ParsedUrlQuery {
  slug: string;
}
type StaticPropsType = {};

export const getStaticPaths = async (
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult<StaticPathType>> => {
  const pages = await client.fetch<{ pages: { slug: string }[] }>(
    `*[_type == "siteSettings"][0] {
            pages[]->{
              ...slug { "slug": current }, 
            }
          }`
  );
  return {
    paths: pages.pages.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<StaticPathType>
): Promise<GetStaticPropsResult<StaticPropsType>> => {
  const page = await client.fetch<any>(
    `*[_type == "page" && slug.current == "${context.params.slug}"][0]`
  );

  return {
    props: {
      page,
    },
    revalidate: 60,
  };
};

export default function Pages(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return <pre>{JSON.stringify(props, undefined, 4)}</pre>;
}
