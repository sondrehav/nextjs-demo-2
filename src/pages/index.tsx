import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import IndexPage, { getStaticProps as getPagesStaticProps } from "pages/[slug]";
import client from "../utils/sanityClient";
import { Maybe } from "../queries";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { slug } = await client.fetch<{ slug: Maybe<string> }>(`
      *[_type == "siteSettings" && _id == "siteSettings"][0] {
        "slug": indexPage->slug.current
      }
  `);

  if (!slug) {
    return {
      notFound: true,
      revalidate: 60,
    } as never;
  }

  return await getPagesStaticProps({
    params: {
      slug,
    },
  });
};

export default function HomePage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return <IndexPage {...props} />;
}
