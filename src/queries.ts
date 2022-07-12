import { PortableTextBlock } from "@portabletext/types";

export type Maybe<T> = null | T;

export const authorPreviewQuery = `
  "profileImage": image,
  name
`;

export type AuthorPreviewType = {
  name: Maybe<string>;
  profileImage: Maybe<{
    _ref: string;
  }>;
};

export const postPreviewQuery = ` 
  publishedAt, 
  title, 
  summary,
  ...slug { "slug": current }, 
  "imageUrl": mainImage,
  author->{
    ${authorPreviewQuery}
  }
`;

export type PostPreviewType = {
  publishedAt: Maybe<string>;
  title: Maybe<string>;
  summary: Maybe<string>;
  slug: Maybe<string>;
  imageUrl: Maybe<{
    _ref: string;
  }>;
  author: Maybe<AuthorPreviewType>;
  profileImage: Maybe<string>;
  name: Maybe<string>;
};

export const postBodyQuery = `
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
`;

export type PostType = PostPreviewType & { body: PortableTextBlock };

export const colorSchemaQuery = `{
  "primaryColor": primaryColor.hex,
  "secondaryColor": secondaryColor.hex,
  "accentColor": accentColor.hex,
  "foregroundColor": foregroundColor.hex,
  "backgroundColor": backgroundColor.hex
}`;
export type ColorSchemaType = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  foregroundColor: string;
  backgroundColor: string;
};
