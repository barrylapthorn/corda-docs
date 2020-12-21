const removeNewlines = (string) => string.replace(/\n$/g, "");

// See https://gohugo.io/hugo-pipes/postprocess/#css-purging-with-postcss
const purgecss = require("@fullhuman/postcss-purgecss")({
  content: [
    "./hugo_stats.json",
    "../../hugo_stats.json",
    "./exampleSite/hugo_stats.json",
  ],
  defaultExtractor: (content) => {
    let els = JSON.parse(content).htmlElements;
    return els.tags.concat(els.classes, els.ids).map(removeNewlines);
  },
});

// See https://tailwindcss.com/docs/configuration#using-a-different-file-name
const tailwindcss = require("tailwindcss")({});

module.exports = {
  plugins: [
    require("postcss-import"),
    tailwindcss,
    require("autoprefixer"),
    ...(process.env.HUGO_ENVIRONMENT === "production" || process.env.NODE_ENV === "production"? [purgecss] : []),
  ],
};
