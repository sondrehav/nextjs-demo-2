import { AuthorPreviewType, PostType } from "queries";
import Image from "next/image";
import format from "date-fns/format";
import ContentTransformer from "./ContentTransformer";
import { useNextSanityImage } from "next-sanity-image";
import sanityClient from "../utils/sanityClient";

const Author = ({
  profileImage,
  name,
  publishedAt,
}: AuthorPreviewType & { publishedAt: string }) => {
  const imageProps = useNextSanityImage(sanityClient, profileImage);

  return (
    <div className={"flex items-center space-x-4"}>
      <div
        className={
          "h-12 w-12 rounded-full overflow-hidden relative bg-blue-500 ring-2 ring-blue-600"
        }
      >
        <Image
          {...imageProps}
          layout={"fill"}
          className={"object-cover"}
          sizes={"48px"}
        />
      </div>
      <div className={"flex-grow-1 flex flex-col space-y-1"}>
        <span>
          <i>
            Av <b>{name}</b>
          </i>
        </span>
        <span className={"text-sm text-gray-400"}>
          <i>
            Publisert <b>{format(new Date(publishedAt), "dd/M-yy")}</b>
          </i>
        </span>
      </div>
    </div>
  );
};

const Post = ({ title, imageUrl, publishedAt, author, body }: PostType) => {
  const imageProps = useNextSanityImage(sanityClient, imageUrl);

  return (
    <div className={"flex flex-col space-y-8 my-4"}>
      <div className={"h-96 w-full rounded-xl overflow-hidden relative"}>
        <Image
          {...imageProps}
          layout={"fill"}
          className={"object-cover"}
          sizes={"100vw"}
        />
      </div>
      <h1>{title}</h1>
      <Author
        publishedAt={publishedAt}
        name={author.name}
        profileImage={author.profileImage}
      />
      <hr />
      <ContentTransformer body={body} />
    </div>
  );
};

export default Post;
