import { PortableTextBlock } from "@portabletext/types";

export type Maybe<T> = T | null;

export const authorPreviewQuery = `
  "profileImage": image.asset->url,
  name
`;

export type AuthorPreviewType = {
  name: Maybe<string>;
  profileImage: Maybe<string>;
};

export const postPreviewQuery = ` 
  publishedAt, 
  title, 
  summary,
  ...slug { "slug": current }, 
  "imageUrl": mainImage.asset->url,
  author->{
    ${authorPreviewQuery}
  }
`;

export type PostPreviewType = {
  publishedAt: Maybe<string>;
  title: Maybe<string>;
  summary: Maybe<string>;
  slug: Maybe<string>;
  imageUrl: Maybe<string>;
  author: Maybe<AuthorPreviewType>;
  profileImage: Maybe<string>;
  name: Maybe<string>;
};

export const postBodyQuery = `
  body []{
    ...,
    "imageUrl": asset->url
  }
`;

export type PostType = PostPreviewType & { body: PortableTextBlock };
