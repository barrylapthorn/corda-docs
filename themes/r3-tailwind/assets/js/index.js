import { setTheme, setThemeOnLoad } from 'js/dark';
import { addAnchors } from 'js/add-anchors';

const load = () => {
  setThemeOnLoad();
  document.getElementById('dark-toggle').onclick = setTheme;
  addAnchors();
};

document.addEventListener('DOMContentLoaded', function(event) {
  addAnchors();
});

window.onload = load;
