/* global navigation, resetPromptChain, getConversationIdFromUrl, resetInstructions, generalObserver, stopAnimateFavicon, faviconTimeout, setSelectionAtEnd */

// eslint-disable-next-line no-unused-vars
function initializeNavigation() {
  if ('navigation' in window) {
    let inputValue = '';
    // Listen for navigation events
    navigation.addEventListener('navigate', (event) => {
      const currentUrl = window.location.href;
      const nextUrl = event.destination.url;
      // if nextUrl is not a chatgpt.com url, return
      if (new URL(nextUrl).hostname !== 'chatgpt.com') return;

      resetInstructions();
      inputValue = document.querySelector('#prompt-textarea')?.innerHTML;
      if (conversationIdHasChanged(currentUrl, nextUrl)) {
        stopAnimateFavicon(faviconTimeout);
        resetPromptChain();
      }

      if (pathHasChanged(currentUrl, nextUrl)) {
        // Use transitionWhile to wait until the navigation transition completes
        // Use a loop to wait for the URL to change
        const checkUrlChange = () => {
          if (window.location.href === nextUrl) {
            generalObserver(event);
            setTimeout(() => {
              updateTextArea(inputValue);
            }, 500);
          } else {
            requestAnimationFrame(checkUrlChange);
          }
        };
        requestAnimationFrame(checkUrlChange);
      }
    });
  } else {
    // eslint-disable-next-line no-console
    console.log('Navigation API is not supported in this browser.');
  }
}

function updateTextArea(inputValue) {
  if (!inputValue) return;

  const textAreaElement = document.querySelector('#prompt-textarea');
  if (textAreaElement) {
    textAreaElement.innerHTML = inputValue;
    setSelectionAtEnd(textAreaElement);
    return;
  }

  const observer = new MutationObserver((mutations, obs) => {
    const curTextAreaElement = document.querySelector('#prompt-textarea');
    if (curTextAreaElement) {
      curTextAreaElement.innerHTML = inputValue;
      setSelectionAtEnd(textAreaElement);
      obs.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
function conversationIdHasChanged(curUrl, nextUrl) {
  const curConversationIdFromUrl = getConversationIdFromUrl(curUrl);
  const nextConversationIdFromUrl = getConversationIdFromUrl(nextUrl);
  if (!curConversationIdFromUrl || !nextConversationIdFromUrl) return false;
  return curConversationIdFromUrl !== nextConversationIdFromUrl;
}
function pathHasChanged(curUrl, nextUrl) {
  const curPath = new URL(curUrl).pathname;
  const nextPath = new URL(nextUrl).pathname;
  return curPath !== nextPath;
}
