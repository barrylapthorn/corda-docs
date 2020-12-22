import { setTheme, setThemeOnLoad } from "js/dark";
import { addAnchors } from "js/add-anchors";
import { activateListeners } from "js/toggle-hidden-menu";
import { activateTabs } from "js/activate-tabs";

document.addEventListener("DOMContentLoaded", function (event) {
    setThemeOnLoad();
    const e = document.getElementById("dark-toggle");

    if (e) e.onclick = setTheme;

    addAnchors();
    activateListeners();
    activateTabs();
    console.log("LOADED");
});
