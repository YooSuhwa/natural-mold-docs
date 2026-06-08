(function () {
  if (typeof window === "undefined") return;

  var GITHUB_REPOSITORY_URL = "https://github.com/YooSuhwa/natural-mold";

  function normalizedPath() {
    return window.location.pathname.replace(/\/+$/, "") || "/";
  }

  function redirectToPreferredLanguage() {
    var path = normalizedPath();
    var isLanguagePage = /^\/hancom\/moldy\/(en|ko)(\/|$)/.test(path);
    if (isLanguagePage || path !== "/") return;

    var languages = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || "en"];
    var preferred = "en";
    for (var i = 0; i < languages.length; i += 1) {
      var code = String(languages[i] || "").toLowerCase();
      if (code.indexOf("ko") === 0) {
        preferred = "ko";
        break;
      }
      if (code.indexOf("en") === 0) {
        preferred = "en";
        break;
      }
    }

    window.location.replace("/hancom/moldy/" + preferred);
  }

  function chooseSelectorRoot(trigger) {
    var root = trigger;
    var current = trigger.parentElement;

    while (current && current.children.length <= 3) {
      if (current.classList && current.classList.contains("moldy-language-switcher")) break;
      var rect = current.getBoundingClientRect();
      if (rect.width > 260 || rect.height > 80) break;
      root = current;
      current = current.parentElement;
    }

    return root;
  }

  function ensureGithubLink(topbar, beforeElement) {
    var existing = document.querySelector(".moldy-github-link");
    var link = existing || document.createElement("a");

    if (!existing) {
      link.className = "moldy-github-link";
      link.href = GITHUB_REPOSITORY_URL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", "Open Moldy GitHub repository");
      link.setAttribute("title", "GitHub repository");
    }

    if (link.parentElement !== topbar) {
      topbar.insertBefore(link, beforeElement);
    } else if (link.nextElementSibling !== beforeElement) {
      topbar.insertBefore(link, beforeElement);
    }

    return link;
  }

  function moveTopbarControls() {
    var trigger = document.getElementById("localization-select-trigger");
    var topbar = document.querySelector(".topbar-right-container");
    var themeToggle = document.querySelector('[data-component-name="theme-toggle"]');
    if (!trigger || !topbar || !themeToggle) return false;

    var existing = document.querySelector(".moldy-language-switcher");
    var wrapper = existing || document.createElement("div");
    if (!existing) {
      wrapper.className = "moldy-language-switcher";
    }

    var visibleLabel = wrapper.querySelector(".moldy-language-switcher__label");
    if (visibleLabel) visibleLabel.remove();

    var selectorRoot = chooseSelectorRoot(trigger);
    if (!wrapper.contains(selectorRoot)) {
      wrapper.appendChild(selectorRoot);
    }

    if (wrapper.parentElement !== topbar) {
      topbar.insertBefore(wrapper, themeToggle);
    }

    ensureGithubLink(topbar, wrapper);

    trigger.setAttribute("aria-label", "Change language");
    trigger.setAttribute("title", "Change language");
    trigger.classList.add("moldy-language-trigger");
    return true;
  }

  function watchForLanguageSelector() {
    var attempts = 0;
    var maxAttempts = 40;

    function tryMove() {
      attempts += 1;
      var moved = moveTopbarControls();
      if (moved || attempts >= maxAttempts) {
        window.clearInterval(timer);
      }
    }

    var timer = window.setInterval(tryMove, 250);
    tryMove();

    var observer = new MutationObserver(function () {
      window.requestAnimationFrame(moveTopbarControls);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  redirectToPreferredLanguage();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchForLanguageSelector);
  } else {
    watchForLanguageSelector();
  }
})();
