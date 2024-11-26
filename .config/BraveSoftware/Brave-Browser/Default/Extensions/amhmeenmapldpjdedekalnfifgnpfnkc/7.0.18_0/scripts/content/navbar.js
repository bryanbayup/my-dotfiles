/* global getConversationIdFromUrl, addInstructionDropdowns, throttle, getConversationsByIds, showConversationManagerCardMenu */

// eslint-disable-next-line no-unused-vars
function initializeNavbar() {
  const existingNavWrapper = document.querySelector('#gptx-nav-wrapper');
  if (existingNavWrapper) return;

  let navRightSection;

  // main button data-testid="model-switcher-dropdown-button" or data-testid="undefined-button" (for gizmo menu)
  const modelSwitcherButton = document.querySelector('main button[data-testid="model-switcher-dropdown-button"], main div[data-testid="undefined-button"]');
  if (modelSwitcherButton) {
    navRightSection = modelSwitcherButton.parentElement.nextElementSibling;
  } else {
    const profileButton = document.querySelector('main button[data-testid="profile-button"]');
    if (profileButton) {
      navRightSection = profileButton.parentElement;
    }
  }
  if (!navRightSection) return;
  const nav = document.querySelector('nav');
  // if nav includes navRightSection, return
  if (nav.contains(navRightSection)) return;

  const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
  const path = window.location.pathname;
  if (!conversationIdFromUrl && path !== '/') return;

  const navWrapper = document.createElement('div');
  navWrapper.id = 'gptx-nav-wrapper';
  navWrapper.classList = 'bg-transparent flex items-center justify-end px-3 gap-2 ';
  // add navwrapper to the beginning of the right section
  navRightSection.prepend(navWrapper);

  addInstructionDropdowns(navWrapper);
}
// eslint-disable-next-line no-unused-vars
const throttleReplaceShareButtonWithConversationMenu = throttle(() => {
  replaceShareButtonWithConversationMenu();
});
function replaceShareButtonWithConversationMenu() {
  const shareButton = document.querySelector('[data-testid="share-chat-button"]');
  if (!shareButton) return;
  if (shareButton.id === 'navbar-conversation-menu-button') return;

  shareButton.id = 'navbar-conversation-menu-button';
  shareButton.querySelector('div').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="icon-md" viewBox="0 0 448 512"><path d="M0 88C0 74.75 10.75 64 24 64H424C437.3 64 448 74.75 448 88C448 101.3 437.3 112 424 112H24C10.75 112 0 101.3 0 88zM0 248C0 234.7 10.75 224 24 224H424C437.3 224 448 234.7 448 248C448 261.3 437.3 272 424 272H24C10.75 272 0 261.3 0 248zM424 432H24C10.75 432 0 421.3 0 408C0 394.7 10.75 384 24 384H424C437.3 384 448 394.7 448 408C448 421.3 437.3 432 424 432z"></path></svg>';
}
// eslint-disable-next-line no-unused-vars
function addConversationMenuButtonEventListener() {
  document.body.addEventListener('click', async (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    if (button.id !== 'navbar-conversation-menu-button') return;
    e.preventDefault();
    e.stopPropagation();
    const conversationId = getConversationIdFromUrl(window.location.href);
    const conversations = await getConversationsByIds([conversationId]);
    showConversationManagerCardMenu(button, conversations[0], true, true);
  });
}
