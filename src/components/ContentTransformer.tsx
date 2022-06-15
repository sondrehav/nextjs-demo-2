import { PortableText } from "@portabletext/react";
import { PortableTextReactComponents } from "@portabletext/react/src/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula as theme } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Image from "next/image";
import Link from "next/link";
import { useNextSanityImage } from "next-sanity-image";
import sanityClient from "utils/sanityClient";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

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
    h1: ({ children }) => <h2>{children}</h2>,
    h2: ({ children }) => <h3>{children}</h3>,
    h3: ({ children }) => <h4>{children}</h4>,
    h4: ({ children }) => <h5>{children}</h5>,
    h5: ({ children }) => <h6>{children}</h6>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 p-4">
        <i>{children}</i>
      </blockquote>
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
