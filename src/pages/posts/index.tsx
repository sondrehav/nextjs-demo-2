import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import client from "../../utils/sanityClient";
import PostPreview from "../../components/PostPreview";
import { postPreviewQuery, PostPreviewType } from "../../queries";
import Link from "next/link";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const query = context.query;
  const searchString: string =
    typeof query.search === "string" ? query.search : "";

  const result = await client.fetch<PostPreviewType[]>(`
    *[_type == "post" && summary match "*${searchString}*"] { ${postPreviewQuery} }
  `);

  return {
    props: {
      result,
      searchString,
    },
  };
};

const SearchInput = () => {
  return (
    <form
      className={
        "border-gray-300 rounded-xl border p-8 w-96 flex flex-col space-y-4 items-start"
      }
    >
      <h3>Søk etter artikler</h3>
      <label htmlFor={"input-field"}>Søketekst</label>
      <input
        type={"text"}
        name={"search"}
        id={"input-field"}
        className={"rounded-lg border border-gray-300 p-4 w-full"}
      />
      <button
        type="submit"
        className={
          "py-3 px-5 rounded-full bg-blue-600 text-white text-sm font-semibold transition-all hover:bg-blue-500"
        }
      >
        Søk
      </button>
    </form>
  );
};

export default function (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <main className={"container mx-auto pt-4"}>
      <Link href={`/`}>
        <a
          className={
            "self-end py-3 px-5 rounded-full bg-gray-100 text-sm font-semibold transition-all hover:bg-blue-500 my-8 block max-w-min hover:text-white"
          }
        >
          Tilbake
        </a>
      </Link>
      <h1>Søkeresultat</h1>
      <SearchInput />
      <h2>Resultat</h2>
      <ul className={"grid grid-cols-3 gap-5"}>
        {props.result.map((post) => (
          <PostPreview key={post.slug} {...post} />
        ))}
      </ul>
    </main>
  );
}
