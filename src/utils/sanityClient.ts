import { createClient } from "next-sanity";

const client = createClient({
  projectId: "pz3xxu1k",
  dataset: "production",
  apiVersion: "2022-06-14",
  useCdn: false,
});
export default client;
