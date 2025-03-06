module.exports = {
  name: "emaDivergence",
  script: "npx",
  args: "serve -s build -l 8428",
  cwd: "./.",
  watch: false,
  env: {
    NODE_ENV: "production",
  },
};
