import { ComponentProps } from "react";

const SearchPost = ({
  initialValue,
  onSubmit,
  disabled,
}: Pick<ComponentProps<"form">, "onSubmit"> & {
  initialValue?: string;
  disabled?: boolean;
}) => {
  return (
    <form className={"space-y-1"} action={"/posts"} onSubmit={onSubmit}>
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
          disabled={disabled}
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
