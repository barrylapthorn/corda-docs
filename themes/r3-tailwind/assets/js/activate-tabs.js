//  JQuery should load last so that the DOM is available etc.

import $ from "jquery";

const DEFAULT_TAB_NAME = "java";

function activateTabSet(e) {
  let id = "#" + e.id;
  var defaultTabId = id + "-" + DEFAULT_TAB_NAME;
  console.log("Default = " + defaultTabId);
  console.log("id " + e.id);

  var $tabSet = $(id);
  console.log($tabSet);

  var $tabs = $(id + " ul li");

  // Hide all code panes - we unhide one of them later
  var $pane = $tabSet.find(".tab-pane");

  $pane.each(function (index) {
    $(this).addClass("hidden");
  });

  $tabs.each(function (index) {
    var $tabLink = $(this).find("a");
    var tabName = $tabLink.html();
    var tabPaneId = id + "-" + tabName;

    // add on click handler
    $tabLink.on("click", function (event) {
      // we don't want the browser to scroll
      event.preventDefault();
      // ensure all panes are hidden
      $tabSet.find(".tab-content .tab-pane").each(function (index) {
        $(this).addClass("hidden");
      });
      // except us when we're clicked.
      $(tabPaneId).removeClass("hidden");
    });

    // unhide the tab pane.
    if ($tabs.length === 1 || tabName === DEFAULT_TAB_NAME) {
      $tabLink.addClass("text-bold underline");
      $(tabPaneId).removeClass("hidden");
    }
  });
}

export function activateTabs() {
  var elements = document.getElementsByClassName("r3-o-tabs");
  for (var i = 0; i < elements.length; i++) {
    activateTabSet(elements[i]);
  }
}
