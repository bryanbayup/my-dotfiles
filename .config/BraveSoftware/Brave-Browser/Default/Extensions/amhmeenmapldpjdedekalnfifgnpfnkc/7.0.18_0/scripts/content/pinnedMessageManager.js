/* global loadingSpinner, escapeHTML, debounce, formatDate, showConversationPreviewWrapper, showConfirmDialog, getConversationIdFromUrl, errorUpgradeConfirmation, translate, closeMenus, isDarkMode */
let lastSelectedPinnedMessageCardId = '';
// eslint-disable-next-line no-unused-vars
function pinnedMessageManagerModalContent() {
  lastSelectedPinnedMessageCardId = '';

  const content = document.createElement('div');
  content.id = 'modal-content-pinned-message-manager';
  content.classList = 'markdown prose-invert relative h-full overflow-hidden';
  content.style.paddingBottom = '59px';

  const filterBar = document.createElement('div');
  filterBar.classList = 'flex items-center justify-between p-2 bg-token-main-surface-primary border-b border-token-border-light sticky top-0 z-10';
  content.appendChild(filterBar);

  const searchInput = document.createElement('input');
  searchInput.id = 'pinned-message-manager-search-input';
  searchInput.type = 'search';
  searchInput.placeholder = translate('Search pinned messages');
  searchInput.classList = 'text-token-text-primary bg-token-main-surface-secondary border border-token-border-light text-sm rounded-md w-full h-10';
  const delayedSearch = debounce(() => {
    fetchPinnedMessages();
  });
  searchInput.addEventListener('input', (e) => {
    if (e.target.value.trim().length > 2) {
      delayedSearch(e);
    } else if (e.target.value.length === 0) {
      fetchPinnedMessages();
    }
  });
  filterBar.appendChild(searchInput);
  const rightSection = document.createElement('div');
  rightSection.id = 'pinned-message-manager-filters-right-section';
  rightSection.classList = 'flex items-center';
  filterBar.appendChild(rightSection);
  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    const compactViewButton = pinnedMessageCardCompactViewButton(settings);
    filterBar.appendChild(compactViewButton);
  });

  const pinnedMessageList = document.createElement('div');
  pinnedMessageList.id = 'pinned-message-manager-pinned-message-list';
  pinnedMessageList.classList = 'grid grid-cols-4 gap-4 p-4 pb-32 overflow-y-auto h-full content-start';
  content.appendChild(pinnedMessageList);

  return content;
}

function pinnedMessageCardCompactViewButton(settings) {
  const { selectedPinnedMessageView } = settings;

  const compactViewButton = document.createElement('button');
  compactViewButton.classList = 'h-10 aspect-1 flex items-center justify-center rounded-lg px-2 ml-2 text-token-text-secondary focus-visible:outline-0 bg-token-sidebar-surface-primary hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary border border-token-border-light';
  compactViewButton.innerHTML = selectedPinnedMessageView === 'list' ? '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM206.4 335.1L152 394.9V56.02C152 42.76 141.3 32 128 32S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"/></svg>' : '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM145.6 39.37c-9.062-9.82-26.19-9.82-35.25 0L14.38 143.4c-9 9.758-8.406 24.96 1.344 33.94C20.35 181.7 26.19 183.8 32 183.8c6.469 0 12.91-2.594 17.62-7.719L104 117.1v338.9C104 469.2 114.8 480 128 480s24-10.76 24-24.02V117.1l54.37 58.95C215.3 185.8 230.5 186.5 240.3 177.4C250 168.4 250.6 153.2 241.6 143.4L145.6 39.37z"/></svg>';
  compactViewButton.addEventListener('click', () => {
    chrome.storage.local.get(['settings'], (res) => {
      // switch between aspect-2 to aspect-1.5 for all pinnedMessageCard
      const pinnedMessageCards = document.querySelectorAll('#modal-manager div[id^="pinned-message-card-"]');
      pinnedMessageCards.forEach((pinnedMessageCard) => {
        if (res.settings.selectedPinnedMessageView === 'list') {
          pinnedMessageCard.classList.remove('aspect-2');
          pinnedMessageCard.classList.add('aspect-1.5');
        } else {
          pinnedMessageCard.classList.remove('aspect-1.5');
          pinnedMessageCard.classList.add('aspect-2');
        }
      });
      if (res.settings.selectedPinnedMessageView === 'list') {
        compactViewButton.innerHTML = '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM145.6 39.37c-9.062-9.82-26.19-9.82-35.25 0L14.38 143.4c-9 9.758-8.406 24.96 1.344 33.94C20.35 181.7 26.19 183.8 32 183.8c6.469 0 12.91-2.594 17.62-7.719L104 117.1v338.9C104 469.2 114.8 480 128 480s24-10.76 24-24.02V117.1l54.37 58.95C215.3 185.8 230.5 186.5 240.3 177.4C250 168.4 250.6 153.2 241.6 143.4L145.6 39.37z"/></svg>';
      } else {
        compactViewButton.innerHTML = '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM206.4 335.1L152 394.9V56.02C152 42.76 141.3 32 128 32S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"/></svg>';
      }
      chrome.storage.local.set({
        settings: {
          ...res.settings,
          selectedPinnedMessageView: res.settings.selectedPinnedMessageView === 'list' ? 'grid' : 'list',
        },
      });
    });
  });
  return compactViewButton;
}

function createPinnedMessageCard(pinnedMessage, settings) {
  const pinnedMessageCard = document.createElement('div');
  pinnedMessageCard.id = `pinned-message-card-${pinnedMessage.message_id}`;
  pinnedMessageCard.dataset.conversationId = pinnedMessage.conversation.conversation_id;
  pinnedMessageCard.dataset.messageId = pinnedMessage.message_id;

  pinnedMessageCard.classList = `bg-token-main-surface-secondary p-4 pb-2 rounded-md cursor-pointer hover:bg-token-main-surface-tertiary ${settings.selectedPinnedMessageView === 'list' ? 'aspect-2' : 'aspect-1.5'} flex flex-col h-auto`;
  pinnedMessageCard.style = 'height: max-content;outline-offset: 4px; outline: none;';

  pinnedMessageCard.innerHTML = `<div class="flex items-center justify-between border-b border-token-border-light pb-1"><div class="text-sm text-token-text-secondary whitespace-nowrap overflow-hidden text-ellipsis flex items-center w-full">${formatDate(new Date(pinnedMessage.created_at))}</div>
  </div>
  <div class="flex-1 text-token-text-primary text-sm whitespace-wrap overflow-hidden text-ellipsis  break-all">${escapeHTML(pinnedMessage.message.substring(0, 250))}</div>

  
  <div class="border-t border-token-border-light flex justify-between items-center pt-1">
   
    <div class="flex items-center justify-between w-full">
      <a id="pinned-messaged-link-button-${pinnedMessage.id}" href="/c/${pinnedMessage.conversation.conversation_id}?mid=${pinnedMessage.message_id}" target="_blank" class="flex text-xs rounded-md bg-token-main-surface-secondary text-token-link focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary no-underline" style="width: max-content;text-decoration-line: none !important; padding: 8px 4px !important;">${translate('open in new tab')} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="icon-xs ml-1"><path d="M488 0h-135.3c-13.25 0-25.09 7.906-30.19 20.16c-5.062 12.28-2.281 26.25 7.094 35.63l40.69 40.69L177.4 289.4c-12.5 12.5-12.5 32.75 0 45.25C183.6 340.9 191.8 344 200 344s16.38-3.125 22.62-9.375l192.9-192.9l40.69 40.69C462.5 188.7 470.8 192 479.3 192c4.219 0 8.469-.8125 12.56-2.5C504.1 184.4 512 172.6 512 159.3V24C512 10.75 501.3 0 488 0zM392 320c-13.25 0-24 10.75-24 24v112c0 4.406-3.594 8-8 8h-304c-4.406 0-8-3.594-8-8v-304c0-4.406 3.594-8 8-8h112C181.3 144 192 133.3 192 120S181.3 96 168 96h-112C25.13 96 0 121.1 0 152v304C0 486.9 25.13 512 56 512h304c30.88 0 56-25.12 56-56v-112C416 330.8 405.3 320 392 320z"></path></svg></a>

      <div id="pinned-messaged-delete-button-${pinnedMessage.id}" class="relative flex items-center justify-cnter h-8 rounded-lg px-2 text-token-red focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md "><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5555 4C10.099 4 9.70052 4.30906 9.58693 4.75114L9.29382 5.8919H14.715L14.4219 4.75114C14.3083 4.30906 13.9098 4 13.4533 4H10.5555ZM16.7799 5.8919L16.3589 4.25342C16.0182 2.92719 14.8226 2 13.4533 2H10.5555C9.18616 2 7.99062 2.92719 7.64985 4.25342L7.22886 5.8919H4C3.44772 5.8919 3 6.33961 3 6.8919C3 7.44418 3.44772 7.8919 4 7.8919H4.10069L5.31544 19.3172C5.47763 20.8427 6.76455 22 8.29863 22H15.7014C17.2354 22 18.5224 20.8427 18.6846 19.3172L19.8993 7.8919H20C20.5523 7.8919 21 7.44418 21 6.8919C21 6.33961 20.5523 5.8919 20 5.8919H16.7799ZM17.888 7.8919H6.11196L7.30423 19.1057C7.3583 19.6142 7.78727 20 8.29863 20H15.7014C16.2127 20 16.6417 19.6142 16.6958 19.1057L17.888 7.8919ZM10 10C10.5523 10 11 10.4477 11 11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V16C15 16.5523 14.5523 17 14 17C13.4477 17 13 16.5523 13 16V11C13 10.4477 13.4477 10 14 10Z" fill="currentColor"></path></svg>
      </div>

    </div>
  </div>`;
  pinnedMessageCard?.addEventListener('click', () => {
    updateSelectedPinnedMessageCard(pinnedMessage.message_id);
    showConversationPreviewWrapper(pinnedMessage.conversation.conversation_id, pinnedMessage.message_id);
  });
  return pinnedMessageCard;
}
function updateSelectedPinnedMessageCard(messageId) {
  if (lastSelectedPinnedMessageCardId) {
    const prevSelectedCard = document.querySelector(`#modal-manager #pinned-message-card-${lastSelectedPinnedMessageCardId}`);
    if (prevSelectedCard) prevSelectedCard.style.outline = 'none';
  }
  if (!messageId) return;
  const pinnedMessageCard = document.querySelector(`#modal-manager #pinned-message-card-${messageId}`);
  lastSelectedPinnedMessageCardId = messageId;
  pinnedMessageCard.style.outline = `2px solid ${isDarkMode() ? '#fff' : '#000'}`;
}
function addPinnedMessageCardEventListeners(pinnedMessage) {
  const linkButton = document.querySelector(`#pinned-messaged-link-button-${pinnedMessage.id}`);
  const deleteButton = document.querySelector(`#pinned-messaged-delete-button-${pinnedMessage.id}`);

  linkButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
  });

  deleteButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    showConfirmDialog('Delete pinned message', 'Are you sure you want to delete the selected pinned message?', 'Cancel', 'Delete', null, async () => {
      chrome.runtime.sendMessage({
        type: 'deletePinnedMessage',
        detail: {
          messageId: pinnedMessage.message_id,
        },
      }, () => {
        const pinnedMessageCard = document.querySelector(`#pinned-message-card-${pinnedMessage.message_id}`);
        pinnedMessageCard?.remove();
        // if no pinned messages left, show no pinned messages found
        const pinnedMessageList = document.querySelector('#modal-manager #pinned-message-manager-pinned-message-list');
        if (pinnedMessageList?.children.length === 0) {
          const noPinnedMessages = document.createElement('p');
          noPinnedMessages.id = 'no-pinned-messages-found';
          noPinnedMessages.classList = 'absolute text-center text-sm text-token-text-secondary w-full p-4';
          noPinnedMessages.innerText = translate('No pinned messages found');
          pinnedMessageList.appendChild(noPinnedMessages);
        }
      });
    });
  });
}

function fetchPinnedMessages(pageNumber = 1) {
  const pinnedMessageList = document.querySelector('#modal-manager #pinned-message-manager-pinned-message-list');
  if (!pinnedMessageList) return;
  if (pageNumber === 1) {
    pinnedMessageList.innerHTML = '';
    pinnedMessageList.appendChild(loadingSpinner('pinned-message-manager-main-content'));
  }
  chrome.storage.local.get(['settings'], ({ settings }) => {
    const pinnedMessageManagerSearchTerm = document.querySelector('#modal-manager [id=pinned-message-manager-search-input]')?.value;
    chrome.runtime.sendMessage({
      type: 'getPinnedMessages',
      detail: {
        pageNumber,
        searchTerm: pinnedMessageManagerSearchTerm,
      },
    }, (data) => {
      const pinnedMessages = data.results;
      if (!pinnedMessages) return;
      if (!Array.isArray(pinnedMessages)) return;
      const loadMoreButton = document.querySelector('#modal-manager #load-more-pinned-messages-button');
      if (loadMoreButton) loadMoreButton.remove();
      const loadingSpinnerElement = document.querySelector('#modal-manager #loading-spinner-pinned-message-manager-main-content');
      if (loadingSpinnerElement) loadingSpinnerElement.remove();
      if (pinnedMessages?.length === 0 && pageNumber === 1) {
        const noPinnedMessages = document.createElement('p');
        noPinnedMessages.id = 'no-pinned-messages-found';
        noPinnedMessages.innerText = translate('No pinned messages found');
        pinnedMessageList.appendChild(noPinnedMessages);
      } else {
        pinnedMessages.forEach((pinnedMessage) => {
          const pinnedMessageCard = createPinnedMessageCard(pinnedMessage, settings);
          pinnedMessageList.appendChild(pinnedMessageCard);
          addPinnedMessageCardEventListeners(pinnedMessage);
        });
        if (data.next) {
          const loadMorePinnedMessagesButton = document.createElement('button');
          loadMorePinnedMessagesButton.id = 'load-more-pinned-messages-button';
          loadMorePinnedMessagesButton.classList = 'bg-token-main-surface-secondary p-4 pb-2 rounded-md cursor-pointer hover:bg-token-main-surface-tertiary aspect-1.5 flex flex-col h-auto relative';
          loadMorePinnedMessagesButton.appendChild(loadingSpinner('load-more-pinned-messages-button'));
          pinnedMessageList.appendChild(loadMorePinnedMessagesButton);
          // add an observer to click the load more button when it is visible
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                fetchPinnedMessages(pageNumber + 1);
              }
            });
          }, { threshold: 0.5 });
          if (loadMorePinnedMessagesButton) {
            observer.observe(loadMorePinnedMessagesButton);
          }
        }
      }
    });
  });
}
// eslint-disable-next-line no-unused-vars
async function initializePinNav(forceRefresh = false) {
  const existingPinNav = document.querySelector('#pin-nav');
  if (existingPinNav) {
    if (forceRefresh) {
      existingPinNav.remove();
      const articles = document.querySelectorAll('main article');
      articles?.forEach((article) => {
        article.classList.remove('border-l-pinned', 'bg-pinned', 'dark:bg-pinned');
        article.classList.add('bg-token-main-surface-primary');
      });
    } else {
      return;
    }
  }

  const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
  if (!conversationIdFromUrl) return;
  const articles = document.querySelectorAll('main article');
  if (articles.length === 0) return;
  const pinNav = document.createElement('div');
  pinNav.classList = 'flex flex-col items-center py-4 absolute right-0 top-0 justify-center overflow-y-auto';
  pinNav.style = 'height:calc(100vh - 90px); margin:45px 8px 0 45px;z-index: 1000;';
  pinNav.id = 'pin-nav';

  const presentation = document.querySelector('main div[role=presentation]');
  if (!presentation) return;
  presentation.classList.remove('flex-1');

  presentation.appendChild(pinNav);

  const pinnedMessages = await chrome.runtime.sendMessage({
    type: 'getAllPinnedMessagesByConversationId',
    detail: {
      conversationId: conversationIdFromUrl,
    },
  });
  if (!pinnedMessages) return;
  // if not array, return
  if (!Array.isArray(pinnedMessages)) return;
  articles?.forEach((article) => {
    article.classList.add('scroll-margin-top-60');
    const messageWrapper = article.querySelector('[data-message-id]');
    if (!messageWrapper) return;
    const { messageId } = messageWrapper.dataset;
    const pinnedMessage = pinnedMessages?.find((pin) => pin.message_id === messageId);
    addPinToArticle(article, messageId, conversationIdFromUrl, pinnedMessage);

    if (!pinnedMessage) return;
    addPinToPinNav(messageId);
  });
}
function addPinToArticle(article, messageId, conversationIdFromUrl, isPinned = false) {
  if (!article) return;
  const copyButton = article.querySelector('button[data-testid="copy-turn-action-button"]');
  if (!copyButton) return;
  const existingPinButton = article.querySelector('button[data-testid="pin-message-turn-action-button"]');
  if (existingPinButton) existingPinButton.remove();
  // add pin button to message
  const pinButton = `<span class="" data-state="closed"><button class="rounded-lg text-token-text-secondary hover:bg-token-main-surface-secondary" aria-label="Pin message" data-testid="pin-message-turn-action-button" data-message-id="${messageId}"><span class="flex h-[30px] w-[30px] items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="none" class="icon-sm"><path fill="${isPinned ? 'gold' : 'currentColor'}" d="M336 0h-288C21.49 0 0 21.49 0 48v431.9c0 24.7 26.79 40.08 48.12 27.64L192 423.6l143.9 83.93C357.2 519.1 384 504.6 384 479.9V48C384 21.49 362.5 0 336 0zM336 452L192 368l-144 84V54C48 50.63 50.63 48 53.1 48h276C333.4 48 336 50.63 336 54V452z"></path></svg></span></button></span>`;
  if (isPinned) {
    article.classList.add('border-l-pinned', 'bg-pinned', 'dark:bg-pinned');
    article.classList.remove('bg-token-main-surface-primary');
  } else {
    article.classList.add('bg-token-main-surface-primary');
    article.classList.remove('border-l-pinned', 'bg-pinned', 'dark:bg-pinned');
  }
  // add pin button before copy button parent
  copyButton.parentElement.insertAdjacentHTML('beforebegin', pinButton);
  const messagePinButton = article.querySelector('button[data-testid="pin-message-turn-action-button"]');

  addArticlePinButtonEventListener(article, messagePinButton, messageId, conversationIdFromUrl);
  observePinButton(messagePinButton);
}
function addArticlePinButtonEventListener(article, messagePinButton, messageId, conversationIdFromUrl) {
  messagePinButton?.addEventListener('click', () => {
    const curMessagePinButton = article.querySelector('button[data-testid="pin-message-turn-action-button"]');
    const isPinned = curMessagePinButton.querySelector('svg path').getAttribute('fill') === 'gold';
    if (isPinned) {
      chrome.runtime.sendMessage({
        type: 'deletePinnedMessage',
        detail: {
          messageId,
        },
      });
      curMessagePinButton.querySelector('svg path').setAttribute('fill', 'currentColor');
      article.classList.remove('border-l-pinned', 'bg-pinned', 'dark:bg-pinned');
      article.classList.add('bg-token-main-surface-primary');
      removeFromPinNav(messageId);
    } else {
      const curMessageWrapper = document.querySelector(`main article [data-message-id="${messageId}"]`);
      chrome.runtime.sendMessage({
        type: 'addPinnedMessage',
        detail: {
          messageId,
          conversationId: conversationIdFromUrl,
          message: curMessageWrapper.innerText,
        },
      }, (newPinnedMessage) => {
        if (newPinnedMessage.error && newPinnedMessage.error.type === 'limit') {
          errorUpgradeConfirmation(newPinnedMessage.error);
          return;
        }
        curMessagePinButton.querySelector('svg path').setAttribute('fill', 'gold');
        article.classList.remove('bg-token-main-surface-primary');
        article.classList.add('border-l-pinned', 'bg-pinned', 'dark:bg-pinned');
        addPinToPinNav(messageId);
      });
    }
  });
}
function removeFromPinNav(messageId) {
  const pinNav = document.querySelector('#pin-nav');
  if (!pinNav) return;
  pinNav?.removeChild(pinNav?.querySelector(`#pin-nav-item-${messageId}`));
}
function addPinToPinNav(messageId) {
  const pinNav = document.querySelector('#pin-nav');
  if (!pinNav) return;

  const pin = document.createElement('button');
  pin.style = 'background-color: transparent; border: none; cursor: pointer;width:100%;width: 18px; margin-bottom:4px;transition: width 0.2s ease-in-out;';
  pin.id = `pin-nav-item-${messageId}`;
  pin.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="gold" d="M48 0H336C362.5 0 384 21.49 384 48V487.7C384 501.1 373.1 512 359.7 512C354.7 512 349.8 510.5 345.7 507.6L192 400L38.28 507.6C34.19 510.5 29.32 512 24.33 512C10.89 512 0 501.1 0 487.7V48C0 21.49 21.49 0 48 0z"/></svg>';
  pin.addEventListener('click', () => {
    const curMessageWrapper = document.querySelector(`main article [data-message-id="${messageId}"]`);
    const article = curMessageWrapper?.closest('article');
    // if article.height > window.height block: start else block: nearest
    const block = article.offsetHeight > window.innerHeight ? 'start' : 'nearest';
    article.scrollIntoView({
      behavior: 'smooth',
      block,
    });
  });

  const curMessageWrapper = document.querySelector(`main article [data-message-id="${messageId}"]`);
  // find prev pin and add new pin after the prev
  const pins = pinNav.querySelectorAll('button[id^="pin-nav-item-"]');
  if (pins.length === 0) {
    pinNav.appendChild(pin);
    return;
  }
  for (let i = 0; i < pins.length; i += 1) {
    const navPinMessageId = pins[i].id.split('pin-nav-item-')[1];
    const messageWrapper = document.querySelector(`main article [data-message-id="${navPinMessageId}"]`);
    // compareDocumentPosition
    if (curMessageWrapper.compareDocumentPosition(messageWrapper) === 4) {
      pinNav.insertBefore(pin, pins[i]);
      return;
    } if (i === pins.length - 1) {
      pinNav.appendChild(pin);
    }
  }
}
function observePinButton(button) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const messageId = button.getAttribute('data-message-id');
      const pinNav = document.querySelector('#pin-nav');
      const pin = pinNav?.querySelector(`#pin-nav-item-${messageId}`);
      if (!pin) return;
      if (entry.isIntersecting) {
        pin.style.width = '18px';
      } else {
        pin.style.width = '12px';
      }
    });
  });
  if (!button) return;
  observer.observe(button.closest('article'));
}
