/* global initializeInput, removeUpdateButton, showNotesButton, setConversationWidth, addSearchConversationsButton, makeSidebarResizable, initializePinNav, throttleInitializeContinueButton, throttleReplaceAllInstructionsInConversation, getConversationIdFromUrl, initializeNavbar, throttleInitializeCanvasChanges, throttleUndoCanvasChanges, setPresentationsWidth, debounce, overrideModelSwitcher, showSidebarFolderButton, sidebarNoteIsOpen, sidebarNoteInputWrapperWidth, throttleReplaceShareButtonWithConversationMenu, throttleSetPresentationsWidth */

// navigation event listener
// eslint-disable-next-line no-unused-vars
let globalCustomWidthObserver;

// eslint-disable-next-line no-unused-vars
function generalObserver(event) {
  const observer = new MutationObserver((mutations, observerInstance) => {
    const nextUrl = new URL(event.destination.url);

    showNotesButton(nextUrl);
    showSidebarFolderButton(nextUrl);
    initializeInput();
    setPresentationsWidth();
    addSearchConversationsButton();
    makeSidebarResizable();
    observerInstance.disconnect(); // Stop observing after render is complete
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// eslint-disable-next-line no-unused-vars
function customWidthObserver() {
  const observer = new MutationObserver((mutations, observerInstance) => {
    chrome.storage.local.get(['settings'], (result) => {
      // Logic to determine when rendering is complete
      const { settings } = result;
      globalCustomWidthObserver = observerInstance;
      if (settings.customConversationWidth) {
        setConversationWidth(settings.conversationWidth);
      } else {
        observerInstance.disconnect();
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// eslint-disable-next-line no-unused-vars
function pinnedMessageObserver() {
  chrome.storage.local.get(['settings'], (result) => {
    const observer = new MutationObserver((mutations, observerInstance) => {
      // Logic to determine when rendering is complete
      const { settings } = result;
      if (settings.showPinNav) {
        initializePinNav();
      } else {
        observerInstance.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

// eslint-disable-next-line no-unused-vars
function continueButtonObserver() {
  const observer = new MutationObserver((mutations, observerInstance) => {
    chrome.storage.local.get(['settings'], (result) => {
      // Logic to determine when rendering is complete
      const { settings } = result;
      if (settings.showFavoritePromptsButton) {
        throttleInitializeContinueButton();
      } else {
        observerInstance.disconnect();
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// eslint-disable-next-line no-unused-vars
function canvasObserver() {
  const observer = new MutationObserver((_mutations, _observerInstance) => {
    // Logic to determine when rendering is complete
    const mains = document.querySelectorAll('main');
    const header = document.querySelector('header');
    // canvas has a div with style width: calc(-400px + 100vw);
    const canvasDiv = document.querySelector('div[style*="width: calc(-400px + 100vw)"]');
    // const codeMirrors = document.querySelectorAll('#codemirror');
    const isInOpenCanvas = mains.length >= 2 && header && header.parentElement.tagName === 'SECTION';

    const brush = document.querySelector('button svg path[d="M11.5047 10C12.8828 10 14 11.1172 14 12.4953C14 15.2919 10.9404 14.9905 9.00947 14.9905C9.00947 13.0596 8.70813 10 11.5047 10Z"]');
    const chart = document.querySelector('div[style*="width: 450px"]');
    if (isInOpenCanvas || brush || chart || canvasDiv) {
      throttleInitializeCanvasChanges();
    } else {
      throttleUndoCanvasChanges();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// eslint-disable-next-line no-unused-vars
async function navbarObserver() {
  const { settings } = await chrome.storage.local.get(['settings', 'models', 'selectedModel']);
  const observer = new MutationObserver(async (mutationsList, _observerInstance) => {
    removeUpdateButton();
    throttleSetPresentationsWidth();
    if (!settings?.overrideModelSwitcher) {
      window.localStorage.removeItem('sp/selectedModel');
      window.localStorage.removeItem('sp/temporaryChat');
    } else {
      overrideModelSwitcher();
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const mutation of mutationsList) {
      const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
      // Check added nodes in the mutation
      const main = document.querySelector('main');
      if (!main) continue;
      const articles = main.querySelectorAll('article');
      if (conversationIdFromUrl && articles.length === 0) continue;
      if (conversationIdFromUrl) {
        throttleReplaceShareButtonWithConversationMenu();
      }
      const userMessages = main.querySelectorAll('article div[data-message-author-role="user"]');
      if (conversationIdFromUrl && userMessages.length === 0) continue;
      if (!conversationIdFromUrl && articles.length === 0) {
        initializeNavbar();
        return;
      }

      // check if last user messages have innertext
      if (userMessages.length > 0 && !userMessages[userMessages.length - 1]?.querySelector('div.whitespace-pre-wrap')?.innerText) continue;

      if (mutation.target.nodeType === Node.ELEMENT_NODE && isArticleorSubArticle(mutation.target)) {
        throttleReplaceAllInstructionsInConversation();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
const debouncedResizeObserverCallback = debounce((width, settingKey) => {
  resizeObserverCallback(width, settingKey);
}, 200);

function resizeObserverCallback(width, settingKey) {
  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    settings[settingKey] = width;
    chrome.storage.local.set({ settings });
  });
}
// eslint-disable-next-line no-unused-vars
function elementResizeObserver(element, settingKey) {
  const resizeObserver = new ResizeObserver((entries) => {
    const { width } = entries[0].contentRect;
    // when element is removed from the DOM, the width is 0. In this case, we don't want to save the width
    if (width === 0) return;
    debouncedResizeObserverCallback(width, settingKey);
  });
  resizeObserver.observe(element);
}

// eslint-disable-next-line no-unused-vars
function mainResizeObserver() {
  const resizeObserver = new ResizeObserver(() => {
    const sidebarNoteInputWrapper = document.querySelector('#sidebar-note-input-wrapper');
    const onGPTs = window.location.pathname.includes('/gpts');
    const onAdmin = window.location.pathname.includes('/admin');

    const floatingButtonWrapper = document.querySelector('#floating-button-wrapper');
    if (sidebarNoteInputWrapper && sidebarNoteIsOpen && !onGPTs && !onAdmin) {
      if (floatingButtonWrapper) floatingButtonWrapper.style.right = `calc(1rem + ${main.offsetWidth * (sidebarNoteInputWrapperWidth / 100)}px)`;
    }
  });
  const main = document.querySelector('main');
  resizeObserver.observe(main);
}
function isArticleorSubArticle(element) {
  while (element) {
    if (element.tagName === 'ARTICLE') { // } && element.querySelector('[data-message-author-role="user"]')) {
      return true;
    }
    element = element.parentElement;
  }
  return false;
}
