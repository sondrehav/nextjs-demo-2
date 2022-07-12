import { ComponentProps, useState } from "react";
import client from "../utils/sanityClient";
import { postPreviewQuery, PostPreviewType } from "../queries";

const SearchPost = ({
  onSearchResults,
  initialValue,
}: {
  initialValue?: string;
  onSearchResults: (posts: PostPreviewType[]) => void;
}) => {
  const [isSearching, setIsSearching] = useState(false);

  const onSearch = async (search: string) => {
    try {
      setIsSearching(true);
      const posts = await client.fetch<PostPreviewType[]>(`
        *[_type == "post" && summary match "*${search}*"] { ${postPreviewQuery} }
      `);
      onSearchResults(posts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form
      className={"space-y-1"}
      action={"/posts"}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const value = e.currentTarget.value;
        if (typeof value === "string") {
          onSearch(value);
        }
      }}
    >
      <label htmlFor={"input-field"}>Søketekst</label>
      <div className={"flex items-center space-x-2"}>
        <input
          type={"text"}
          name={"search"}
          id={"input-field"}
          className={"rounded-lg border border-gray-300 px-4 py-2 w-96"}
          defaultValue={initialValue}
        />
        <button
          disabled={isSearching}
          type="submit"
          className={
            "py-2 px-4 rounded-full ring-2 ring-blue-600 text-sm font-semibold transition-all hover:bg-blue-500 " +
            "hover:text-white disabled:bg-gray-300 disabled:text-black disabled:ring-0"
          }
        >
          Søk
        </button>
      </div>
    </form>
  );
};

export default SearchPost;
