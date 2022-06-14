import { GetStaticPropsContext, InferGetStaticPropsType } from "next";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      test: 342,
    },
    revalidate: 60,
  };
};

export default function HomePage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <main className={"container mx-auto"}>
      <h1>Hello, World!</h1>
      <pre>{JSON.stringify(props, undefined, 4)}</pre>
    </main>
  );
}
