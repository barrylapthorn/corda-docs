import AnchorJS from 'anchor-js';

export function addAnchors() {
  const anchors = new AnchorJS();

  // https://www.bryanbraun.com/anchorjs/#basic-usage

  // we only want to add anchors to headings inside our content class
  anchors.add(".r3-content h2, .r3-content h3, .r3-content h4");
  console.log("Added anchors")
}
