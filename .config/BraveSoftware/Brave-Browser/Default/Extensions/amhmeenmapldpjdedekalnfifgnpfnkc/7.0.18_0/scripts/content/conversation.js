/* global initializePinNav, showConfirmDialog, deleteConversation, startNewChat, getConversationIdFromUrl, sidebarNoteIsOpen, sidebarFolderIsOpen, noConversationElement, sidebarNoteInputWrapperWidth, sidebarFolderDrawerWidth, throttle */
// eslint-disable-next-line no-unused-vars
function addThreadEditButtonEventListener() {
  document.body.addEventListener('click', (e) => {
    // check if the clicked element is a button or a child of a button
    const button = e.target.closest('button');
    if (!button) return;
    // check if the button is a child of an article
    const article = button.closest('article');
    if (!article) return;
    // check if button includes <svg> element
    const left = button.querySelector('svg path[d="M14.7071 5.29289C15.0976 5.68342 15.0976 6.31658 14.7071 6.70711L9.41421 12L14.7071 17.2929C15.0976 17.6834 15.0976 18.3166 14.7071 18.7071C14.3166 19.0976 13.6834 19.0976 13.2929 18.7071L7.29289 12.7071C7.10536 12.5196 7 12.2652 7 12C7 11.7348 7.10536 11.4804 7.29289 11.2929L13.2929 5.29289C13.6834 4.90237 14.3166 4.90237 14.7071 5.29289Z"]');
    const right = button.querySelector('svg path[d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C16.8946 11.4804 17 11.7348 17 12C17 12.2652 16.8946 12.5196 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z"]');
    const submitButton = button?.classList?.contains('btn-primary') && button.innerText;
    if (left || right || submitButton) {
      setTimeout(() => {
        initializePinNav(true);
      }, submitButton ? 500 : 100);
    }
  });
}

// eslint-disable-next-line no-unused-vars
function handleDeleteConversation(conversationId) {
  if (!conversationId) return;
  showConfirmDialog('Delete conversation', 'Are you sure you want to delete this conversation?', 'Cancel', 'Delete', null, () => {
    // remove the conversation from sidebar
    const conversationList = document.querySelector('#modal-manager #conversation-manager-conversation-list');
    if (conversationList && conversationList.children.length === 0) {
      conversationList.appendChild(noConversationElement());
    }
    chrome.runtime.sendMessage({
      type: 'deleteConversations',
      detail: {
        conversationIds: [conversationId],
      },
    }, () => {
      deleteConversation(conversationId);
      removeConversationElements(conversationId);
    });
  });
}

function removeConversationElements(conversationId) {
  const conversationElement = document.querySelector(`nav li a[href$="${conversationId}"]`);
  if (conversationElement) conversationElement.remove();
  // remove the card from the list
  const conversationCard = document.querySelector(`#modal-manager [data-conversation-id="${conversationId}"]`);
  if (conversationCard) {
    conversationCard.remove();
  }
  const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
  if (conversationIdFromUrl === conversationId) {
    startNewChat();
  }
}
// eslint-disable-next-line no-unused-vars
function renameConversationElements(conversationId, newName) {
  const conversationElementTitleWrapper = document.querySelector(`nav li a[href$="${conversationId}"] div`);
  if (conversationElementTitleWrapper) {
    conversationElementTitleWrapper.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = newName;
      }
    });
  }
}

// eslint-disable-next-line no-unused-vars
const throttleSetPresentationsWidth = throttle(() => {
  setPresentationsWidth();
}, 1000);
function setPresentationsWidth() {
  const main = document.querySelector('main');
  if (!main) return;
  const presentation = main.querySelector('main div[role=presentation]');
  presentation.classList.remove('flex-1');
  if (presentation && sidebarNoteIsOpen) {
    presentation.style.width = `${100 - sidebarNoteInputWrapperWidth}%`;
  } else if (presentation && sidebarFolderIsOpen()) {
    presentation.style.width = `calc(100% - ${sidebarFolderDrawerWidth}px)`;
  }
}
