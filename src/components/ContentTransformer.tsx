import { PortableText } from "@portabletext/react";
import { PortableTextReactComponents } from "@portabletext/react/src/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula as theme } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Image from "next/image";
import Link from "next/link";
import { useNextSanityImage } from "next-sanity-image";
import sanityClient from "utils/sanityClient";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { cloneElement } from "react";

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => {
      const imageProps = useNextSanityImage(
        sanityClient,
        value.asset as SanityImageSource
      );
      return (
        <div
          className={
            "mx-auto w-full lg:w-1/2 xl:w-1/3 rounded-xl overflow-hidden relative"
          }
        >
          <Image
            {...imageProps}
            sizes={"(max-width: 1024px) 100vw, 600px"}
            alt={value.imageUrl}
            layout={"responsive"}
            className={"object-cover"}
          />
        </div>
      );
    },
    code: ({ value: { code, language } }) => (
      <SyntaxHighlighter
        showLineNumbers
        language={typeof language === "string" ? language : undefined}
        style={theme}
      >
        {code}
      </SyntaxHighlighter>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className={"text-5xl my-6"}>{children}</h1>,
    h2: ({ children }) => <h2 className={"text-3xl my-5"}>{children}</h2>,
    h3: ({ children }) => (
      <div className={"flex items-center space-x-4"}>
        <span className={"w-10 h-0.5 bg-foreground"} />
        <h3 className={"text-lg my-4 uppercase font-semibold"}>{children}</h3>
      </div>
    ),
    h4: ({ children }) => (
      <h4 className={"text-base my-3 uppercase font-semibold"}>{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className={"text-sm my-2 uppercase font-semibold"}>{children}</h5>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 p-4">
        <i>{children}</i>
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className={"text-xl max-w-prose my-2"}>{children}</p>
    ),
  },

  list: {
    // Ex. 1: customizing common list types
    bullet: ({ children }) => <ul className={"ml-6 list-disc"}>{children}</ul>,
    number: ({ children }) => (
      <ol className={"ml-6 list-decimal"}>{children}</ol>
    ),
  },
  marks: {
    code: ({ children }) => (
      <code className="text-red-900 rounded bg-gray-100">{children}</code>
    ),
    link: ({ children, value }) => {
      return (
        <a
          href={value.href}
          rel={"noreferrer noopener"}
          className={"underline font-semibold text-blue-700"}
        >
          {children}
        </a>
      );
    },
    internalLink: ({ children, value }) => {
      return (
        <Link href={`/posts/${value.slug}`}>
          <a className={"underline font-semibold text-blue-700"}>{children}</a>
        </Link>
      );
    },
    highlight: ({ children, value }) => {
      return <span className={"font-bold text-primary"}>{children}</span>;
    },
    cta: ({ children, value }) => {
      return (
        <Link href={`/${value.slug}`}>
          <a
            className={
              "block font-semibold text-xl px-6 py-3 text-background bg-primary my-8 w-min truncate"
            }
          >
            {children}
          </a>
        </Link>
      );
    },
  },
};

const ContentTransformer = ({ body }: { body: any }) => {
  return (
    <>
      <PortableText value={body} components={myPortableTextComponents} />
    </>
  );
};

export default ContentTransformer;
