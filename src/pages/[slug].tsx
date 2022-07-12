import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { ParsedUrlQuery } from "querystring";
import client from "../utils/sanityClient";
import { PortableTextBlock } from "@portabletext/types";
import { colorSchemaQuery, ColorSchemaType, Maybe } from "../queries";
import { Fragment, PropsWithChildren } from "react";
import ContentTransformer from "../components/ContentTransformer";
import Head from "next/head";
import { useNextSanityImage } from "next-sanity-image";
import sanityClient from "../utils/sanityClient";
import Image from "next/image";
import Link, { LinkProps } from "next/link";
import classNames from "classnames";

interface StaticPathType extends ParsedUrlQuery {
  slug: string;
}

type SectionType = {
  body: Maybe<PortableTextBlock>;
  header: Maybe<string>;
  colorSchema: Maybe<ColorSchemaType>;
  sectionImage: Maybe<string>;
  _key: string;
};

type StaticPropsType = {
  pageProps: {
    title: string;
    metaDescription: string;
    imageRef: string;
    sections: Maybe<SectionType[]>;
    colorSchema: ColorSchemaType;
  };
  pageLinks: {
    indexPage: {
      title: Maybe<string>;
      slug: Maybe<string>;
    };
    pages: {
      title: Maybe<string>;
      slug: Maybe<string>;
    }[];
  };
};

export const getStaticPaths = async (
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult<StaticPathType>> => {
  const pages = await client.fetch<{ pages: { slug: string }[] }>(
    `*[_type=="siteSettings" && _id=="siteSettings"][0] {
      "pages": pages[]->{
        "slug": slug.current
      }
    }`
  );
  return {
    paths: pages.pages.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<StaticPathType>
) => {
  if (!context.params?.slug) throw new Error("No slug in the URL parameters.");

  const staticProps = await client.fetch<StaticPropsType>(
    `
    {
      "pageProps": *[_type=="page" && slug.current=="${context.params.slug}"][0] {
        title,
        metaDescription,
        colorSchema->${colorSchemaQuery},
        sections[] {
          header,
          _key,
          "sectionImage": sectionImage.asset._ref,
          colorSchema->${colorSchemaQuery},
          body[] {
            ...,
            markDefs[]{
              ...,
              _type == "internalLink" => {
                _key,
                "slug": @.reference->slug.current
              }
            }
          }
        }
      },
      "pageLinks": *[_type == "siteSettings" && _id == "siteSettings"][0] {
        indexPage->{
          "slug": slug.current,
          title
        },
        pages[]->{
          "slug": slug.current,
          title
        }
      }
    }`
  );

  return {
    props: { staticProps, slug: context.params.slug },
    revalidate: 60,
  };
};

const SectionImage = ({
  imageKey,
  className,
}: {
  imageKey: string;
  className?: string;
}) => {
  const imageProps = useNextSanityImage(sanityClient, imageKey);
  return (
    <div className={className}>
      <Image
        {...imageProps}
        layout={"fill"}
        sizes={"100vw"}
        className={"object-cover"}
      />
    </div>
  );
};

const NavLink = ({
  isCurrent,
  children,
  ...props
}: PropsWithChildren<LinkProps & { isCurrent?: boolean }>) => {
  return (
    <Link {...props}>
      <a
        className={classNames(
          "uppercase font-semibold text-sm hover:text-primary transition-all",
          { "text-primary": isCurrent }
        )}
      >
        {children}
      </a>
    </Link>
  );
};

export default function Pages({
  staticProps: { pageProps, pageLinks },
  slug,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [firstSection, ...sections] = pageProps.sections ?? [];

  return (
    <Fragment>
      <Head>
        <title>{pageProps.title}</title>
        <meta name={"description"} content={pageProps.metaDescription} />
        <style>{`
          :root {
            --color-primary: ${pageProps.colorSchema.primaryColor};
            --color-secondary: ${pageProps.colorSchema.secondaryColor};
            --color-accent: ${pageProps.colorSchema.accentColor};
            --color-foreground: ${pageProps.colorSchema.foregroundColor};
            --color-background: ${pageProps.colorSchema.backgroundColor};
          }
        `}</style>
      </Head>
      <nav className={"absolute w-full z-10"}>
        <div
          className={
            "container mx-auto flex items-center space-x-12 h-24 justify-between"
          }
        >
          <NavLink href={"/"} isCurrent={pageLinks.indexPage.slug === slug}>
            {pageLinks.indexPage.title}
          </NavLink>
          <div className={"flex space-x-12"}>
            {pageLinks.pages
              .filter(
                (value): value is NonNullable<typeof pageLinks.pages[0]> =>
                  typeof value.slug === "string" &&
                  typeof value.title === "string"
              )
              .map(({ slug: pageSlug, title }) => (
                <NavLink href={`/${slug}`} isCurrent={pageSlug === slug}>
                  {title}
                </NavLink>
              ))}
          </div>
        </div>
      </nav>
      <main className={"bg-background text-foreground relative z-0"}>
        {firstSection && (
          <section className={"relative pb-10 pt-24"}>
            {firstSection.sectionImage && (
              <SectionImage
                className={"h-full w-full absolute top-0 z-5"}
                imageKey={firstSection.sectionImage}
              />
            )}
            <div className={"container mx-auto my-8 relative z-10"}>
              {firstSection.header && <h1>{firstSection.header}</h1>}
              {firstSection.body && (
                <ContentTransformer body={firstSection.body} />
              )}
            </div>
          </section>
        )}

        {/*{props.props.sections?.map((section) => (
          <Fragment key={section._key}></Fragment>
        ))}*/}
        <pre>{JSON.stringify(pageProps, undefined, 4)}</pre>
      </main>
    </Fragment>
  );
}
