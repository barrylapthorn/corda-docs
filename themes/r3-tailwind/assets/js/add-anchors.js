import AnchorJS from 'anchor-js';

export function addAnchors() {
  const anchors = new AnchorJS();

  // https://www.bryanbraun.com/anchorjs/#basic-usage

  // we only want to add anchors to headings inside an <article>
  anchors.add("article h2, article h3, article h4");
}
