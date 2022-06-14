import Image from "next/image";
import format from "date-fns/format";
import { AuthorPreviewType, PostPreviewType } from "queries";
import Link from "next/link";

const AuthorPreview = ({
  profileImage,
  name,
  publishedAt,
}: AuthorPreviewType & { publishedAt: string }) => {
  return (
    <div className={"flex items-center space-x-4"}>
      <div
        className={
          "h-10 w-10 rounded-full overflow-hidden relative bg-blue-500 ring-2 ring-blue-600"
        }
      >
        <Image
          loader={() => profileImage}
          src={name}
          layout={"fill"}
          className={"object-cover"}
        />
      </div>
      <div className={"flex-grow-1 flex flex-col space-y-1"}>
        <span className={"text-sm"}>
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

const PostPreview = ({
  slug,
  imageUrl,
  title,
  summary,
  publishedAt,
  author,
}: PostPreviewType) => {
  return (
    <div key={slug} className={"border border-gray-200 rounded-xl"}>
      <div className={"h-48 w-full  rounded-xl overflow-hidden relative"}>
        <Image
          loader={() => imageUrl}
          src={imageUrl}
          layout={"fill"}
          className={"object-cover"}
        />
      </div>
      <section className={"p-4 flex flex-col space-y-4"}>
        <h3 className={"my-1"}>{title}</h3>
        <hr />
        <AuthorPreview {...author} publishedAt={publishedAt} />
        <hr />
        <p>{summary}</p>
        <hr />
        <Link href={`/post/${slug}`}>
          <a
            className={
              "self-end py-2 px-4 rounded-full bg-blue-600 text-white text-sm font-semibold transition-all hover:bg-blue-500"
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
