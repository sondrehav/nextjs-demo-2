import Image from "next/image";
import format from "date-fns/format";
import { AuthorPreviewType, PostPreviewType } from "queries";
import Link from "next/link";
import { useNextSanityImage } from "next-sanity-image";
import sanityClient from "utils/sanityClient";

const AuthorPreview = ({
  profileImage,
  name,
  publishedAt,
}: AuthorPreviewType & { publishedAt: string }) => {
  const imageProps = useNextSanityImage(sanityClient, profileImage);

  return (
    <div className={"flex items-center space-x-4"}>
      <div
        className={
          "h-10 w-10 rounded-full overflow-hidden relative bg-blue-500 ring-2 ring-blue-600"
        }
      >
        <Image
          {...imageProps}
          layout={"fill"}
          className={"object-cover"}
          sizes={"40px"}
        />
      </div>
      <div className={"flex-grow-1 flex flex-col space-y-1"}>
        <span className={"text-sm"}>
          <i>
            Av <b>{name}</b>
          </i>
        </span>
        <span className={"text-xs text-gray-400"}>
          <i>
            Publisert <b>{format(new Date(publishedAt), "dd/M-yy")}</b>
          </i>
        </span>
      </div>
    </div>
  );
};

const PostPreview = ({
  slug,
  imageUrl,
  title,
  summary,
  publishedAt,
  author,
}: PostPreviewType) => {
  const imageProps = useNextSanityImage(sanityClient, imageUrl);

  return (
    <div key={slug} className={"border border-gray-200 rounded-xl"}>
      <div className={"h-48 w-full  rounded-xl overflow-hidden relative"}>
        <Image
          {...imageProps}
          layout={"fill"}
          className={"object-cover"}
          sizes={"(max-width: 640px) 100vw, 33vw"}
        />
      </div>
      <section className={"p-4 flex flex-col space-y-4"}>
        <h3 className={"my-1 font-semibold"}>{title}</h3>
        <hr />
        <AuthorPreview {...author} publishedAt={publishedAt} />
        <hr />
        <p>{summary}</p>
        <hr />
        <Link href={`/posts/${slug}`}>
          <a
            className={
              "self-end py-3 px-5 rounded-full bg-blue-600 text-white text-sm font-semibold transition-all hover:bg-blue-500"
            }
          >
            Åpne
          </a>
        </Link>
      </section>
    </div>
  );
};

export default PostPreview;
