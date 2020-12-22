import { setTheme, setThemeOnLoad } from 'js/dark';
import { addAnchors } from 'js/add-anchors';

const load = () => {
  setThemeOnLoad();
  const e = document.getElementById('dark-toggle');

  if (e) e.onclick = setTheme;
  addAnchors();

  console.log("LOADED");
};

document.addEventListener('DOMContentLoaded', function(event) {
  addAnchors();
});

window.onload = load;
