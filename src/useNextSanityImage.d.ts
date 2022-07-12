declare module "next-sanity-image" {
  export type {
    ImageUrlBuilder,
    UseNextSanityBlurUpImageBuilder,
    UseNextSanityBlurUpImageBuilderOptions,
    UseNextSanityImageBuilderOptions,
    UseNextSanityImageBuilder,
    UseNextSanityImageDimensions,
    UseNextSanityImageOptions,
    UseNextSanityImageProps,
  } from "next-sanity-image/types";

  import {
    SanityClientLike,
    SanityImageSource,
  } from "@sanity/image-url/lib/types/types";

  import { ImageProps } from "next/image";
  export type UseNextSanityImage = <T extends SanityImageSource | null>(
    sanityClient: SanityClientLike,
    image: T,
    options?: UseNextSanityImageOptions
  ) => T extends SanityImageSource ? ImageProps : null;

  export declare const useNextSanityImage: UseNextSanityImage;
}
