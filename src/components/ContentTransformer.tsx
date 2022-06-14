import { PortableText } from "@portabletext/react";
import { PortableTextReactComponents } from "@portabletext/react/src/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula as theme } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Image from "next/image";
import Link from "next/link";

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => (
      <div className={"h-96 w-full rounded-xl overflow-hidden relative"}>
        <Image
          loader={() => value.imageUrl}
          src={value.imageUrl}
          alt={value.imageUrl}
          layout={"fill"}
          className={"object-cover"}
        />
      </div>
    ),
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
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      if (!rel) {
        return (
          <Link href={value.href}>
            <a className={"underline font-semibold text-blue-700"}>
              {children}
            </a>
          </Link>
        );
      }
      return (
        <a
          href={value.href}
          rel={rel}
          className={"underline font-semibold text-blue-700"}
        >
          {children}
        </a>
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
