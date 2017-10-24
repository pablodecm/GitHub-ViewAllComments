// ==UserScript==
// @name        GitHub View All Comments
// @version     0.0.1
// @description A userscript that that loads all Pull Request and Issue comments at once
// @license     MIT
// @author      Pablo de Castro
// @namespace   https://github.com/pablodecm
// @include     https://github.com/*
// @run-at      document-idle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @icon        https://github.com/fluidicon.png
// @updateURL   https://raw.githubusercontent.com/pablodecm/GitHub-ViewAllComments/master/github-view-all-comments.user.js
// @downloadURL https://raw.githubusercontent.com/pablodecm/GitHub-ViewAllComments/master/github-view-all-comments.user.js
// ==/UserScript==
(function() {
  "use strict";

  // Configurable flag to show all by default or after first single click
  let viewAllDefault = GM_getValue("view-all-comments-default", false);

  // Finds and clicks on disclosure buttons in the page
  let buttonClassName = 'btn-link timeline-progressive-disclosure-button js-timeline-progressive-disclosure-button';
  function clickViewMore() {
    var clickButtons = document.getElementsByClassName(buttonClassName);
    if (clickButtons.length > 0) {
      clickButtons[0].click();
    }
  }

  let debounce;
  // Observe progressively loaded comments. MutationObserver idea taken from
  // https://github.com/Mottie/GitHub-userscripts/wiki/How-to#progressive-containers
  Array.from(document.querySelectorAll(".js-discussion")).forEach(target => {
    new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // preform checks before adding code wrap to minimize function calls
        if (mutation.target === target) {
          clearTimeout(debounce);
          debounce = setTimeout(() => {
            clickViewMore();
          }, 500);
        }
      });
    }).observe(target, {
      childList: true
    });
  });

  // click changes the boolean flag
  GM_registerMenuCommand("View All Comments by Default", () => {
    if (viewAllDefault) {
     GM_setValue("view-all-comments-default", false);
    } else {
     GM_setValue("view-all-comments-default", true);
     clickViewMore();
    }
  });

  if (viewAllDefault) {
      clickViewMore();
  }

})();
