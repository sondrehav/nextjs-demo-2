module.exports = {
  images: {
    loader: "custom",
    domains: ["cdn.sanity.io"],
  },
  webpack(config) {
    return config;
  },
};
