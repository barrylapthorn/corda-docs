export function activateListeners() {
  let mobileMenuButton = document.querySelector("#r3-mobile-menu-button");
  let mobileMenu = document.querySelector("#r3-mobile-menu");

//   let navTransparent = document.querySelector(".r3-o-wrapper-nav");
//   let tocToggle = document.querySelector(".r3-o-sidebar__toc-toggle");
//   let tocDrop = document.querySelector(".r3-o-sidebar__nav-content");

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener(
      "click",
      () => {
        mobileMenu.classList.toggle("hidden");
      },
      true
    );
  }
//   if (navTransparent) {
//     navTransparent.addEventListener("click", (e) => {
//       if (e.target === navTransparent) {
//         nav.classList.toggle("show-nav");
//         navTransparent.classList.remove("show-nav");
//       }
//     });
//   }
//   if (tocDrop) {
//     tocDrop.addEventListener("click", (e) => {
//       if (e.target.hash) {
//         setTimeout(() => tocToggle.click(), 500);
//       }
//     });
//   }
}
