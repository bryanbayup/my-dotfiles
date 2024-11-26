/* global */

// eslint-disable-next-line no-unused-vars
function startNewChat(forceRefresh = false, tempChat = false) {
  if (isOnNewChatPage() && forceRefresh) {
    refreshPage();
  }
  let newChatButton = document.querySelector('nav a[href="/"]');
  if (newChatButton) {
    newChatButton.click();
    addTempChatView(tempChat);
    return;
  }
  // data-testid="create-new-chat-button"
  newChatButton = document.querySelector('nav button[data-testid="create-new-chat-button"]');
  if (newChatButton) {
    newChatButton.click();
  }
  addTempChatView(tempChat);
}

// eslint-disable-next-line no-unused-vars
function isOnNewChatPage() {
  return window.location.pathname === '/';
}
function refreshPage() {
  window.location.reload();
}
function addTempChatView(tempChat) {
  setTimeout(() => {
    // const nav = document.querySelector('nav');
    const header = document.querySelector('h1');
    // const textAreaElement = document.querySelector('#prompt-textarea');
    if (tempChat) {
      // nav?.lastChild?.classList?.add('opacity-50', 'pointer-events-none');
      header?.classList?.add('hidden');
      // textAreaElement?.parentElement?.parentElement?.parentElement?.parentElement?.classList?.add('!bg-black');
      header?.parentElement?.insertAdjacentHTML('beforeend', '<h1 id="temp-chat-header">Temporary Chat</h1>');
    } else {
      const tempChatHeader = document.querySelector('#temp-chat-header');
      if (tempChatHeader) tempChatHeader.remove();
      // nav?.lastChild?.classList?.remove('opacity-50', 'pointer-events-none');
      // textAreaElement?.parentElement?.parentElement?.parentElement?.parentElement?.classList?.remove('!bg-black');
      header?.classList?.remove('hidden');
    }
  }, 200);
}
