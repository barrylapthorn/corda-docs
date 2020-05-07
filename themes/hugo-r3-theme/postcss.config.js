const path = require("path");
const glob = require("glob");

const PATHS = {
  root: __dirname,
  src: path.join(__dirname, "src")
};

// Add path to the Hugo theme files,
// and the path to our source files (css, and javascript)
// that we'll build for the final site.
const filesThatUseCss = glob
  .sync(`${PATHS.root}/layouts/**/*.html`, { nodir: true })
  .concat(glob.sync(`${PATHS.src}/**/*.js`, { nodir: true }));

// Purge all unused css selectors
const purgecss = require("@fullhuman/postcss-purgecss")({
  // Specify the paths to all of the template files in your project
  content: filesThatUseCss,

  // Include any special characters you're using in this regular expression.
  // purgecss just gathers up classes (words...) it matches in any file of any type
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

// Remove all comments, and one-line the css.
const cssnano = require("cssnano")({ preset: "default" });

// Finally, export these for use in postcss
module.exports = {
  plugins: [
    require("autoprefixer"),
    purgecss,
    cssnano
    //...(process.env.NODE_ENV === "production" ? [purgecss, cssnano] : [])
  ]
};
