/* eslint-disable no-restricted-globals */
/* global toast, isWindows, dropdown, addDropdownEventListener, showConversationPreviewWrapper, showConfirmDialog, loadingSpinner, debounce, conversationsSortByList, showConversationManagerFolderMenu, handleRenameConversationFolderClick, closeMenus, showConversationManagerCardMenu, errorUpgradeConfirmation, showConversationManagerSidebarSettingsMenu, escapeHTML, getConversationsByIds, formatTime, deleteConversation, getConversations, archiveConversation, unarchiveConversation, formatDate, openExportModal, startNewChat, generateRandomDarkColor, removeConversationElements, translate, elementResizeObserver, fetchSidebarConversations, isDarkMode, openMoveToFolderModal */

let selectedConversationFolderBreadcrumb = [];
let lastSelectedConversationCardId = '';
let lastSelectedConversationCheckboxId = '';
function getLastSelectedConversationFolder() {
  if (selectedConversationFolderBreadcrumb.length === 0) return null;
  return selectedConversationFolderBreadcrumb[selectedConversationFolderBreadcrumb.length - 1];
}
function generateConvFolderBreadcrumb(breadcrumbElement, sidebarFolder = false) {
  breadcrumbElement.innerHTML = '';
  if (!sidebarFolder) {
    const isDefaultFolder = isDefaultConvFolder(selectedConversationFolderBreadcrumb[0]?.id);
    if (isDefaultFolder) {
      breadcrumbElement.classList.replace('flex', 'hidden');
    } else {
      breadcrumbElement.classList.replace('hidden', 'flex');
    }
  }
  const breadcrubmbList = sidebarFolder
    ? [{ id: 'root', name: 'Root' }, ...selectedConversationFolderBreadcrumb]
    : selectedConversationFolderBreadcrumb;
  breadcrubmbList.forEach((folder, i) => {
    const breadcrubmbItem = document.createElement('span');
    breadcrubmbItem.classList = 'flex items-center text-token-text-secondary text-sm';

    const breadcrubmbFolderName = document.createElement('span');
    breadcrubmbFolderName.id = `folder-breadcrubmb-${folder.id}`;
    breadcrubmbFolderName.classList = `hover:underline cursor-pointer ${i === breadcrubmbList.length - 1 ? 'text-token-text-primary' : 'text-token-text-secondary'}`;
    breadcrubmbFolderName.innerText = isDefaultConvFolder(folder.id) ? folder.displayName : folder.name;
    breadcrubmbFolderName.setAttribute('data-folder-id', folder.id);

    breadcrubmbItem.appendChild(breadcrubmbFolderName);
    if (i < breadcrubmbList.length - 1) {
      const separator = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md-heavy mx-2"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L14.5858 12L9.29289 6.70711C8.90237 6.31658 8.90237 5.68342 9.29289 5.29289C9.68342 4.90237 10.3166 4.90237 10.7071 5.29289L16.7071 11.2929C16.8946 11.4804 17 11.7348 17 12C17 12.2652 16.8946 12.5196 16.7071 12.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071Z" fill="currentColor"></path></svg>';
      breadcrubmbItem.innerHTML += separator;
    }
    breadcrumbElement.appendChild(breadcrubmbItem);
  });
}

chrome.storage.local.get(['selectedConversationFolderBreadcrumb'], (result) => {
  selectedConversationFolderBreadcrumb = result.selectedConversationFolderBreadcrumb || [];
});
const defaultConversationFolders = [
  {
    id: 'all',
    name: '<div class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="icon-sm mr-2" viewBox="0 0 512 512" fill="currentColor"><path d="M360 144h-208C138.8 144 128 154.8 128 168S138.8 192 152 192h208C373.3 192 384 181.3 384 168S373.3 144 360 144zM264 240h-112C138.8 240 128 250.8 128 264S138.8 288 152 288h112C277.3 288 288 277.3 288 264S277.3 240 264 240zM447.1 0h-384c-35.25 0-64 28.75-64 63.1v287.1c0 35.25 28.75 63.1 64 63.1h96v83.1c0 9.836 11.02 15.55 19.12 9.7l124.9-93.7h144c35.25 0 64-28.75 64-63.1V63.1C511.1 28.75 483.2 0 447.1 0zM464 352c0 8.75-7.25 16-16 16h-160l-80 60v-60H64c-8.75 0-16-7.25-16-16V64c0-8.75 7.25-16 16-16h384c8.75 0 16 7.25 16 16V352z"/></svg> All conversations</div>',
    code: 'all-conversations',
    displayName: 'All Conversations',
  },
  {
    id: 'favorites',
    name: '<div class="flex items-center"><svg class="icon-sm mr-2" fill="gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/></svg> Favorites</div>',
    code: 'favorites',
    displayName: 'Favorites',
  },
  {
    id: 'archived',
    name: '<div class="flex items-center"><svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm mr-2"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.62188 3.07918C3.87597 2.571 4.39537 2.25 4.96353 2.25H13.0365C13.6046 2.25 14.124 2.571 14.3781 3.07918L15.75 5.82295V13.5C15.75 14.7426 14.7426 15.75 13.5 15.75H4.5C3.25736 15.75 2.25 14.7426 2.25 13.5V5.82295L3.62188 3.07918ZM13.0365 3.75H4.96353L4.21353 5.25H13.7865L13.0365 3.75ZM14.25 6.75H3.75V13.5C3.75 13.9142 4.08579 14.25 4.5 14.25H13.5C13.9142 14.25 14.25 13.9142 14.25 13.5V6.75ZM6.75 9C6.75 8.58579 7.08579 8.25 7.5 8.25H10.5C10.9142 8.25 11.25 8.58579 11.25 9C11.25 9.41421 10.9142 9.75 10.5 9.75H7.5C7.08579 9.75 6.75 9.41421 6.75 9Z" fill="currentColor"></path></svg> Archived</div>',
    code: 'archived',
    displayName: 'Archived',
  },
];
function isDefaultConvFolder(folderId) {
  if (!folderId) return false;
  return defaultConversationFolders.map((f) => f.id).includes(folderId.toString());
}
// eslint-disable-next-line no-unused-vars
function conversationManagerModalContent() {
  resetConversationManagerParams();
  const content = document.createElement('div');
  content.id = 'modal-content-conversation-manager';
  content.style = 'overflow-y: hidden;position: relative;height:100%; width:100%';
  content.classList = 'markdown prose-invert flex';

  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    const { managerSidebarWidth = 220 } = settings;

    // sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'conversation-manager-sidebar';
    sidebar.style = `width:${managerSidebarWidth}px;min-width:220px;resize:horizontal;overflow:hidden;`;
    sidebar.classList = 'bg-token-main-surface-primary border-r border-token-border-light relative h-full';
    sidebar.appendChild(conversationManagerSidebarContent());
    elementResizeObserver(sidebar, 'managerSidebarWidth');
    content.appendChild(sidebar);

    // main content
    const mainContent = document.createElement('div');
    mainContent.id = 'conversation-manager-main-content';
    mainContent.style = `width:calc(100% - ${managerSidebarWidth}px)`;
    mainContent.classList = 'overflow-y-auto h-full';
    mainContent.appendChild(conversationManagerMainContent());
    content.appendChild(mainContent);
  });
  return content;
}
// eslint-disable-next-line no-unused-vars
function conversationManagerModalActions() {
  const actions = document.createElement('div');
  actions.classList = 'flex items-center justify-end w-full mt-2';
  const startNewChatButton = document.createElement('button');
  startNewChatButton.classList = 'btn btn-primary';
  startNewChatButton.innerText = translate('Start a New Chat');
  startNewChatButton.addEventListener('click', () => {
    closeMenus();
    // close modal
    const modalCloseButton = document.querySelector('#modal-manager #modal-close-button-manager');
    if (modalCloseButton) modalCloseButton.click();
    startNewChat();
  });
  actions.appendChild(startNewChatButton);
  return actions;
}

function conversationManagerSidebarContent() {
  const content = document.createElement('div');
  content.classList = 'relative h-full';
  const title = document.createElement('div');
  title.classList = 'text-lg p-4';
  title.innerText = translate('Folders');
  content.appendChild(title);
  const sidebarFolderList = document.createElement('div');
  sidebarFolderList.id = 'conversation-manager-sidebar-folders';
  sidebarFolderList.classList = 'px-2 pb-64 overflow-y-auto h-full';
  sidebarFolderList.addEventListener('scroll', () => {
    const conversationFolderMenu = document.querySelector('#modal-manager #conversation-manager-folder-menu');
    if (conversationFolderMenu) conversationFolderMenu.remove();
  });
  content.appendChild(sidebarFolderList);

  sidebarFolderList.appendChild(defaultConversationFoldersList());

  sidebarFolderList.appendChild(loadingSpinner('conversation-manager-sidebar'));
  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    const { selectedConversationsManagerFoldersSortBy = 'alphabetical' } = settings;
    chrome.runtime.sendMessage({
      type: 'getConversationFolders',
      detail: {
        sortBy: selectedConversationsManagerFoldersSortBy,
      },
    }, (conversationFolders) => {
      if (!conversationFolders) return;
      if (!Array.isArray(conversationFolders)) return;
      const loadingSpinnerElement = document.querySelector('#modal-manager #loading-spinner-conversation-manager-sidebar');
      if (loadingSpinnerElement) loadingSpinnerElement.remove();

      let lastSelectedConversationFolder = getLastSelectedConversationFolder();
      if (conversationFolders.length === 0) {
        sidebarFolderList.appendChild(noConversationFolderElemet());
        if (!lastSelectedConversationFolder || !isDefaultConvFolder(lastSelectedConversationFolder?.id?.toString())) {
          selectedConversationFolderBreadcrumb = [defaultConversationFolders[0]];
        }
      } else {
        if (!lastSelectedConversationFolder || ![...defaultConversationFolders, ...conversationFolders].map((f) => f.id.toString()).includes(selectedConversationFolderBreadcrumb?.[0]?.id?.toString())) {
          selectedConversationFolderBreadcrumb = [conversationFolders[0]];
        }
        conversationFolders.forEach((folder) => {
          sidebarFolderList.appendChild(conversationFolderElement(folder));
        });
      }
      lastSelectedConversationFolder = getLastSelectedConversationFolder();
      chrome.storage.local.set({ selectedConversationFolderBreadcrumb });
      // update breadcrumb element
      const managerBreadcrumbElement = document.querySelector('#modal-manager #conversation-manager-breadcrumb');
      if (managerBreadcrumbElement) {
        generateConvFolderBreadcrumb(managerBreadcrumbElement);
      }
      const sidebarBreadcrumbElement = document.querySelector('#sidebar-folder-drawer #sidebar-folder-breadcrumb');
      if (sidebarBreadcrumbElement) {
        generateConvFolderBreadcrumb(sidebarBreadcrumbElement, true);
      }

      getSubFolders(lastSelectedConversationFolder?.id);
      fetchConversations();
    });
  });
  const sidebarActions = document.createElement('div');
  sidebarActions.classList = 'flex items-center justify-between absolute left-0 bottom-0 w-full bg-token-main-surface-secondary border-t border-token-border-light px-2 h-10 z-10';
  content.appendChild(sidebarActions);

  const sidebarSettingsButton = document.createElement('button');
  sidebarSettingsButton.id = 'conversation-manager-sidebar-settings-button';
  sidebarSettingsButton.classList = 'flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary';
  sidebarSettingsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="icon-md" fill="currentColor" viewBox="0 0 448 512"><path d="M0 88C0 74.75 10.75 64 24 64H424C437.3 64 448 74.75 448 88C448 101.3 437.3 112 424 112H24C10.75 112 0 101.3 0 88zM0 248C0 234.7 10.75 224 24 224H424C437.3 224 448 234.7 448 248C448 261.3 437.3 272 424 272H24C10.75 272 0 261.3 0 248zM424 432H24C10.75 432 0 421.3 0 408C0 394.7 10.75 384 24 384H424C437.3 384 448 394.7 448 408C448 421.3 437.3 432 424 432z"/></svg>';
  sidebarSettingsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    closeMenus();
    showConversationManagerSidebarSettingsMenu(sidebarSettingsButton);
  });
  sidebarActions.appendChild(sidebarSettingsButton);

  const addConversationFolderButton = document.createElement('button');
  addConversationFolderButton.id = 'add-conversation-folder-button';
  addConversationFolderButton.title = 'Add New Category';
  addConversationFolderButton.classList = 'flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary';
  addConversationFolderButton.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="2" viewBox="0 0 448 512" stroke-linecap="round" stroke-linejoin="round" class="icon-md" xmlns="http://www.w3.org/2000/svg"> <path d="M432 256C432 269.3 421.3 280 408 280h-160v160c0 13.25-10.75 24.01-24 24.01S200 453.3 200 440v-160h-160c-13.25 0-24-10.74-24-23.99C16 242.8 26.75 232 40 232h160v-160c0-13.25 10.75-23.99 24-23.99S248 58.75 248 72v160h160C421.3 232 432 242.8 432 256z"> </path> </svg>';
  chrome.runtime.sendMessage({
    type: 'checkHasSubscription',
  }, (hasSubscription) => {
    addConversationFolderButton.addEventListener('click', () => {
      const noConversationFolders = document.querySelectorAll('#no-conversation-folders');
      noConversationFolders.forEach((el) => el.remove());
      const userFolders = document.querySelectorAll('#modal-manager #conversation-manager-sidebar-folders > div[id^="conversation-folder-wrapper-"]');
      if (!hasSubscription && userFolders.length >= 5) {
        const error = { type: 'limit', title: 'You have reached the limit', message: 'You have reached the limits of Conversation Folders with free account. Upgrade to Pro to remove all limits.' };
        errorUpgradeConfirmation(error);
        return;
      }
      chrome.runtime.sendMessage({
        type: 'addConversationFolders',
        detail: {
          folders: [{
            name: 'New Folder',
            color: generateRandomDarkColor(),
          }],
        },
      }, (newConversationFolders) => {
        if (newConversationFolders.error && newConversationFolders.error.type === 'limit') {
          errorUpgradeConfirmation(newConversationFolders.error);
          return;
        }
        if (!newConversationFolders || newConversationFolders.length === 0) return;
        const curManagerSidebarFolderList = document.querySelector('#modal-manager #conversation-manager-sidebar-folders');
        const curSidebarFolderContent = document.querySelector('#sidebar-folder-drawer #sidebar-folder-content');

        curManagerSidebarFolderList.append(conversationFolderElement(newConversationFolders[0]));
        curSidebarFolderContent.append(conversationFolderElement(newConversationFolders[0], true));
        // scroll to bottom
        curManagerSidebarFolderList.scrollTop = curManagerSidebarFolderList.scrollHeight;
        curSidebarFolderContent.scrollTop = curSidebarFolderContent.scrollHeight;
        // click the new folder
        const newFolderElement = document.querySelector(`#modal-manager #conversation-folder-wrapper-${newConversationFolders[0].id}`);
        newFolderElement.click();
        handleRenameConversationFolderClick(newConversationFolders[0].id);
      });
    });
  });
  sidebarActions.appendChild(addConversationFolderButton);

  return content;
}
function defaultConversationFoldersList(sidebarFolder = false) {
  const content = document.createElement('div');
  content.id = 'default-conversation-folders';
  content.classList = 'pb-2 mb-4 border-b border-token-border-light';

  defaultConversationFolders.forEach((folder) => {
    content.appendChild(conversationFolderElement(folder, sidebarFolder));
  });

  return content;
}
function conversationFolderElement(folder, sidebarFolder = false) {
  const isDefaultFolder = isDefaultConvFolder(folder.id);
  const folderElement = document.createElement('div');
  folderElement.id = `conversation-folder-wrapper-${folder.id}`;
  folderElement.classList = `relative flex items-center justify-between p-2 ${isDefaultFolder ? '' : 'py-1'} cursor-pointer border bg-token-main-surface-secondary border-token-border-light rounded-md mb-2 group`;
  folderElement.style.minHeight = '42px';
  if (folder.color) {
    folderElement.style.backgroundColor = folder.color;
  }
  // add indicator if the folder is inside the conversation manager
  if (!sidebarFolder) {
    const folderIndicator = document.createElement('div');
    folderIndicator.id = `conversation-folder-indicator-${folder.id}`;
    folderIndicator.classList = `w-1 h-10 rounded-l-md absolute ${selectedConversationFolderBreadcrumb[0]?.id?.toString() === folder.id.toString() ? 'bg-black dark:bg-white' : ''}`;
    folderIndicator.style.right = '-9px';
    folderElement.appendChild(folderIndicator);
  }

  folderElement.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenus();
    const curLastSelectedConversationFolder = getLastSelectedConversationFolder();
    if (!sidebarFolder && !e.shiftKey && curLastSelectedConversationFolder?.id?.toString() === folder.id.toString()) return;
    // clear sidebar search
    const sidebarFolderSearchInput = document.querySelector('#sidebar-folder-search-input');
    if (sidebarFolderSearchInput) sidebarFolderSearchInput.value = '';
    // if folder has a parent and parent is the last selected folder
    if (folder.parent_folder && folder.parent_folder === curLastSelectedConversationFolder?.id) {
      selectedConversationFolderBreadcrumb.push(folder);
    } else {
      selectedConversationFolderBreadcrumb = [folder];
    }
    // update breadcrumb element
    const managerBreadcrumbElement = document.querySelector('#modal-manager #conversation-manager-breadcrumb');
    if (managerBreadcrumbElement) {
      generateConvFolderBreadcrumb(managerBreadcrumbElement);
    }
    const sidebarBreadcrumbElement = document.querySelector('#sidebar-folder-drawer #sidebar-folder-breadcrumb');
    if (sidebarBreadcrumbElement) {
      generateConvFolderBreadcrumb(sidebarBreadcrumbElement, true);
    }

    chrome.storage.local.set({ selectedConversationFolderBreadcrumb });

    const folders = document.querySelectorAll('#modal-manager div[id^="conversation-folder-wrapper-"]');
    folders?.forEach((f) => {
      f.querySelector('div[id^="conversation-folder-indicator-"]')?.classList.remove('bg-black', 'dark:bg-white');
    });
    const curFolderElement = document.querySelector(`#modal-manager #conversation-folder-wrapper-${selectedConversationFolderBreadcrumb[0]?.id}`);
    curFolderElement?.querySelector('div[id^="conversation-folder-indicator-"]')?.classList?.add('bg-black', 'dark:bg-white');

    resetConversationManagerSelection();
    getSubFolders(folder.id, e.shiftKey);
    if (sidebarFolder) {
      fetchSidebarConversations(1, false, e.shiftKey);
    } else {
      fetchConversations(1, false, e.shiftKey);
      fetchSidebarConversations(1, false, false);
    }
  });

  folderElement.addEventListener('dblclick', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDefaultFolder) {
      handleRenameConversationFolderClick(folder.id);
    }
  });
  folderElement.addEventListener('mouseenter', () => {
    closeMenus();
    const folderSettingsButtons = document.querySelectorAll('div[id^="conversation-folder-settings-"]');
    folderSettingsButtons.forEach((btn) => {
      btn.classList.replace('flex', 'hidden');
    });
  });
  const folderLeft = document.createElement('div');
  folderLeft.classList = 'flex items-center justify-start w-full h-full';

  // folder image
  const folderImage = document.createElement('img');
  folderImage.id = `conversation-folder-image-${folder.id}`;
  folderImage.src = folder.image;
  folderImage.classList = `w-6 h-6 rounded-md mr-2 object-cover ${folder.image ? '' : 'hidden'}`;
  folderLeft.appendChild(folderImage);
  // folder name count wrapper
  const folderNameCountWrapper = document.createElement('div');
  folderNameCountWrapper.classList = 'flex items-center justify-between w-full flex-wrap';
  folderLeft.appendChild(folderNameCountWrapper);
  // folder name
  const folderName = document.createElement('span');
  folderName.id = `conversation-folder-name-${folder.id}`;
  folderName.classList = `w-full overflow-hidden text-ellipsis whitespace-nowrap max-h-5 break-all relative text-sm ${isDefaultFolder ? 'text-token-text-primary' : 'text-white'}`;
  folderName.innerHTML = folder.name;
  folderNameCountWrapper.appendChild(folderName);

  if (!isDefaultFolder) {
    // folder count
    const folderCount = document.createElement('span');
    folderCount.id = `conversation-folder-count-${folder.id}`;
    folderCount.classList = 'w-full';
    folderCount.style = 'color: rgba(255, 255, 255, 0.6); font-size: 0.7rem;';
    folderCount.innerText = `${folder.conversation_count || 0} chats`;
    folderNameCountWrapper.appendChild(folderCount);
  }

  folderElement.appendChild(folderLeft);

  const folderSettingsButton = document.createElement('div');
  folderSettingsButton.id = `conversation-folder-settings-${folder.id}`;
  folderSettingsButton.classList = 'items-center justify-cnter h-6 rounded-lg px-2 text-white focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary hidden group-hover:flex';
  folderSettingsButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg>';
  folderSettingsButton.addEventListener('click', async (e) => {
    e.stopPropagation();
    e.preventDefault();
    closeMenus();
    folderSettingsButton.classList.replace('hidden', 'flex');
    showConversationManagerFolderMenu(folderSettingsButton, folder.id, sidebarFolder);
  });
  if (folder.id !== 'archived') {
    folderElement.appendChild(folderSettingsButton);
  }
  return folderElement;
}
function updateConversationFolderCount(fromFolderId, toFolderId, diff) {
  const fromIsDefaultFolder = isDefaultConvFolder(fromFolderId);
  if (!fromIsDefaultFolder) {
    const fromFolderCounts = document.querySelectorAll(`#conversation-folder-count-${fromFolderId}`);
    fromFolderCounts.forEach((fromFolderCount) => {
      const count = parseInt(fromFolderCount.innerText.split(' ')[0], 10) - diff;
      fromFolderCount.innerText = `${count} chats`;
    });
  }
  const toIsDefaultFolder = isDefaultConvFolder(toFolderId);
  if (!toIsDefaultFolder) {
    const toFolderCounts = document.querySelectorAll(`#conversation-folder-count-${toFolderId}`);
    toFolderCounts.forEach((toFolderCount) => {
      const count = parseInt(toFolderCount.innerText.split(' ')[0], 10) + diff;
      toFolderCount.innerText = `${count} chats`;
    });
  }
}
// eslint-disable-next-line no-unused-vars
function resetConversationCounts() {
  const folderCounts = document.querySelectorAll('span[id^="conversation-folder-count-"]');
  folderCounts.forEach((folderCount) => {
    folderCount.innerText = '0 chats';
  });
}
async function getSubFolders(folderId, forceRefresh = false) {
  return;
  if (!folderId) return;

  const managerSubfolderList = document.querySelector('#modal-manager #conversation-manager-subfolder-list');
  if (managerSubfolderList) {
    managerSubfolderList.innerHTML = '';
  }
  const sidebarFolderContent = document.querySelector('#sidebar-folder-drawer #sidebar-folder-content');
  if (sidebarFolderContent) {
    sidebarFolderContent.innerHTML = '';
  }
  const isDefaultFolder = isDefaultConvFolder(folderId);
  if (isDefaultFolder) return;

  const { settings } = await chrome.storage.local.get(['settings']);
  const { selectedConversationsManagerFoldersSortBy = 'alphabetical' } = settings;
  chrome.runtime.sendMessage({
    type: 'getConversationFolders',
    forceRefresh,
    detail: {
      sortBy: selectedConversationsManagerFoldersSortBy,
      parentFolderId: folderId,
    },
  }, (conversationFolders) => {
    if (!conversationFolders) return;
    if (!Array.isArray(conversationFolders)) return;
    if (conversationFolders.length > 0) {
      conversationFolders.forEach((folder) => {
        managerSubfolderList?.appendChild(conversationFolderElement(folder));
        sidebarFolderContent?.prepend(conversationFolderElement(folder, true));
      });
    }
  });
}
function conversationCardCompactViewButton(settings) {
  const { selectedConversationView } = settings;

  const conversationViewModeButton = document.createElement('button');
  conversationViewModeButton.classList = 'h-10 aspect-1 flex items-center justify-center rounded-lg px-2 ml-2 text-token-text-secondary focus-visible:outline-0 bg-token-sidebar-surface-primary hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary border border-token-border-light';
  conversationViewModeButton.innerHTML = selectedConversationView === 'list' ? '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon-md" viewBox="0 0 448 512"><path d="M88 32C110.1 32 128 49.91 128 72V120C128 142.1 110.1 160 88 160H40C17.91 160 0 142.1 0 120V72C0 49.91 17.91 32 40 32H88zM88 64H40C35.58 64 32 67.58 32 72V120C32 124.4 35.58 128 40 128H88C92.42 128 96 124.4 96 120V72C96 67.58 92.42 64 88 64zM88 192C110.1 192 128 209.9 128 232V280C128 302.1 110.1 320 88 320H40C17.91 320 0 302.1 0 280V232C0 209.9 17.91 192 40 192H88zM88 224H40C35.58 224 32 227.6 32 232V280C32 284.4 35.58 288 40 288H88C92.42 288 96 284.4 96 280V232C96 227.6 92.42 224 88 224zM0 392C0 369.9 17.91 352 40 352H88C110.1 352 128 369.9 128 392V440C128 462.1 110.1 480 88 480H40C17.91 480 0 462.1 0 440V392zM32 392V440C32 444.4 35.58 448 40 448H88C92.42 448 96 444.4 96 440V392C96 387.6 92.42 384 88 384H40C35.58 384 32 387.6 32 392zM248 32C270.1 32 288 49.91 288 72V120C288 142.1 270.1 160 248 160H200C177.9 160 160 142.1 160 120V72C160 49.91 177.9 32 200 32H248zM248 64H200C195.6 64 192 67.58 192 72V120C192 124.4 195.6 128 200 128H248C252.4 128 256 124.4 256 120V72C256 67.58 252.4 64 248 64zM160 232C160 209.9 177.9 192 200 192H248C270.1 192 288 209.9 288 232V280C288 302.1 270.1 320 248 320H200C177.9 320 160 302.1 160 280V232zM192 232V280C192 284.4 195.6 288 200 288H248C252.4 288 256 284.4 256 280V232C256 227.6 252.4 224 248 224H200C195.6 224 192 227.6 192 232zM248 352C270.1 352 288 369.9 288 392V440C288 462.1 270.1 480 248 480H200C177.9 480 160 462.1 160 440V392C160 369.9 177.9 352 200 352H248zM248 384H200C195.6 384 192 387.6 192 392V440C192 444.4 195.6 448 200 448H248C252.4 448 256 444.4 256 440V392C256 387.6 252.4 384 248 384zM320 72C320 49.91 337.9 32 360 32H408C430.1 32 448 49.91 448 72V120C448 142.1 430.1 160 408 160H360C337.9 160 320 142.1 320 120V72zM352 72V120C352 124.4 355.6 128 360 128H408C412.4 128 416 124.4 416 120V72C416 67.58 412.4 64 408 64H360C355.6 64 352 67.58 352 72zM408 192C430.1 192 448 209.9 448 232V280C448 302.1 430.1 320 408 320H360C337.9 320 320 302.1 320 280V232C320 209.9 337.9 192 360 192H408zM408 224H360C355.6 224 352 227.6 352 232V280C352 284.4 355.6 288 360 288H408C412.4 288 416 284.4 416 280V232C416 227.6 412.4 224 408 224zM320 392C320 369.9 337.9 352 360 352H408C430.1 352 448 369.9 448 392V440C448 462.1 430.1 480 408 480H360C337.9 480 320 462.1 320 440V392zM352 392V440C352 444.4 355.6 448 360 448H408C412.4 448 416 444.4 416 440V392C416 387.6 412.4 384 408 384H360C355.6 384 352 387.6 352 392z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon-md" viewBox="0 0 512 512"><path d="M16 72C16 58.75 26.75 48 40 48H88C101.3 48 112 58.75 112 72V120C112 133.3 101.3 144 88 144H40C26.75 144 16 133.3 16 120V72zM80 112V80H48V112H80zM496 80C504.8 80 512 87.16 512 96C512 104.8 504.8 112 496 112H176C167.2 112 160 104.8 160 96C160 87.16 167.2 80 176 80H496zM496 240C504.8 240 512 247.2 512 256C512 264.8 504.8 272 496 272H176C167.2 272 160 264.8 160 256C160 247.2 167.2 240 176 240H496zM496 400C504.8 400 512 407.2 512 416C512 424.8 504.8 432 496 432H176C167.2 432 160 424.8 160 416C160 407.2 167.2 400 176 400H496zM88 208C101.3 208 112 218.7 112 232V280C112 293.3 101.3 304 88 304H40C26.75 304 16 293.3 16 280V232C16 218.7 26.75 208 40 208H88zM48 240V272H80V240H48zM16 392C16 378.7 26.75 368 40 368H88C101.3 368 112 378.7 112 392V440C112 453.3 101.3 464 88 464H40C26.75 464 16 453.3 16 440V392zM80 432V400H48V432H80z"/></svg>';
  conversationViewModeButton.addEventListener('click', () => {
    chrome.storage.local.get(['settings'], (res) => {
      const conversationList = document.querySelector('#modal-manager #conversation-manager-conversation-list');
      conversationList.classList = `grid ${res.settings.selectedConversationView !== 'list' ? 'grid-cols-1 gap-3' : 'grid-cols-4 gap-4'} w-full content-start`;

      if (res.settings.selectedConversationView === 'list') {
        conversationViewModeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon-md" viewBox="0 0 512 512"><path d="M16 72C16 58.75 26.75 48 40 48H88C101.3 48 112 58.75 112 72V120C112 133.3 101.3 144 88 144H40C26.75 144 16 133.3 16 120V72zM80 112V80H48V112H80zM496 80C504.8 80 512 87.16 512 96C512 104.8 504.8 112 496 112H176C167.2 112 160 104.8 160 96C160 87.16 167.2 80 176 80H496zM496 240C504.8 240 512 247.2 512 256C512 264.8 504.8 272 496 272H176C167.2 272 160 264.8 160 256C160 247.2 167.2 240 176 240H496zM496 400C504.8 400 512 407.2 512 416C512 424.8 504.8 432 496 432H176C167.2 432 160 424.8 160 416C160 407.2 167.2 400 176 400H496zM88 208C101.3 208 112 218.7 112 232V280C112 293.3 101.3 304 88 304H40C26.75 304 16 293.3 16 280V232C16 218.7 26.75 208 40 208H88zM48 240V272H80V240H48zM16 392C16 378.7 26.75 368 40 368H88C101.3 368 112 378.7 112 392V440C112 453.3 101.3 464 88 464H40C26.75 464 16 453.3 16 440V392zM80 432V400H48V432H80z"/></svg>';
      } else {
        conversationViewModeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon-md" viewBox="0 0 448 512"><path d="M88 32C110.1 32 128 49.91 128 72V120C128 142.1 110.1 160 88 160H40C17.91 160 0 142.1 0 120V72C0 49.91 17.91 32 40 32H88zM88 64H40C35.58 64 32 67.58 32 72V120C32 124.4 35.58 128 40 128H88C92.42 128 96 124.4 96 120V72C96 67.58 92.42 64 88 64zM88 192C110.1 192 128 209.9 128 232V280C128 302.1 110.1 320 88 320H40C17.91 320 0 302.1 0 280V232C0 209.9 17.91 192 40 192H88zM88 224H40C35.58 224 32 227.6 32 232V280C32 284.4 35.58 288 40 288H88C92.42 288 96 284.4 96 280V232C96 227.6 92.42 224 88 224zM0 392C0 369.9 17.91 352 40 352H88C110.1 352 128 369.9 128 392V440C128 462.1 110.1 480 88 480H40C17.91 480 0 462.1 0 440V392zM32 392V440C32 444.4 35.58 448 40 448H88C92.42 448 96 444.4 96 440V392C96 387.6 92.42 384 88 384H40C35.58 384 32 387.6 32 392zM248 32C270.1 32 288 49.91 288 72V120C288 142.1 270.1 160 248 160H200C177.9 160 160 142.1 160 120V72C160 49.91 177.9 32 200 32H248zM248 64H200C195.6 64 192 67.58 192 72V120C192 124.4 195.6 128 200 128H248C252.4 128 256 124.4 256 120V72C256 67.58 252.4 64 248 64zM160 232C160 209.9 177.9 192 200 192H248C270.1 192 288 209.9 288 232V280C288 302.1 270.1 320 248 320H200C177.9 320 160 302.1 160 280V232zM192 232V280C192 284.4 195.6 288 200 288H248C252.4 288 256 284.4 256 280V232C256 227.6 252.4 224 248 224H200C195.6 224 192 227.6 192 232zM248 352C270.1 352 288 369.9 288 392V440C288 462.1 270.1 480 248 480H200C177.9 480 160 462.1 160 440V392C160 369.9 177.9 352 200 352H248zM248 384H200C195.6 384 192 387.6 192 392V440C192 444.4 195.6 448 200 448H248C252.4 448 256 444.4 256 440V392C256 387.6 252.4 384 248 384zM320 72C320 49.91 337.9 32 360 32H408C430.1 32 448 49.91 448 72V120C448 142.1 430.1 160 408 160H360C337.9 160 320 142.1 320 120V72zM352 72V120C352 124.4 355.6 128 360 128H408C412.4 128 416 124.4 416 120V72C416 67.58 412.4 64 408 64H360C355.6 64 352 67.58 352 72zM408 192C430.1 192 448 209.9 448 232V280C448 302.1 430.1 320 408 320H360C337.9 320 320 302.1 320 280V232C320 209.9 337.9 192 360 192H408zM408 224H360C355.6 224 352 227.6 352 232V280C352 284.4 355.6 288 360 288H408C412.4 288 416 284.4 416 280V232C416 227.6 412.4 224 408 224zM320 392C320 369.9 337.9 352 360 352H408C430.1 352 448 369.9 448 392V440C448 462.1 430.1 480 408 480H360C337.9 480 320 462.1 320 440V392zM352 392V440C352 444.4 355.6 448 360 448H408C412.4 448 416 444.4 416 440V392C416 387.6 412.4 384 408 384H360C355.6 384 352 387.6 352 392z"/></svg>';
      }
      chrome.storage.local.set({
        settings: {
          ...res.settings,
          selectedConversationView: res.settings.selectedConversationView === 'list' ? 'grid' : 'list',
        },
      }, () => {
        fetchConversations();
      });
    });
  });
  return conversationViewModeButton;
}
function conversationManagerMainContent() {
  const lastSelectedConversationFolder = getLastSelectedConversationFolder();
  const isDefaultFolder = isDefaultConvFolder(selectedConversationFolderBreadcrumb[0]?.id);
  const content = document.createElement('div');
  content.id = 'conversation-manager-content-wrapper';
  content.classList = 'relative h-full overflow-hidden';
  content.style.paddingBottom = '59px';
  const filterBar = document.createElement('div');
  filterBar.classList = 'flex items-center justify-between p-2 bg-token-main-surface-primary border-b border-token-border-light sticky top-0 z-10';
  content.appendChild(filterBar);

  const searchInput = document.createElement('input');
  searchInput.id = 'conversation-manager-search-input';
  searchInput.type = 'search';
  searchInput.placeholder = translate('Search conversations');
  searchInput.classList = 'w-full p-2 rounded-md border border-token-border-light bg-token-main-surface-secondary text-token-text-secondary';
  const delayedSearch = debounce(() => {
    fetchConversations();
  });
  searchInput.addEventListener('input', (e) => {
    if (e.target.value.trim().length > 2) {
      delayedSearch(e);
    } else if (e.target.value.length === 0) {
      fetchConversations();
    }
  });
  filterBar.appendChild(searchInput);
  const rightSection = document.createElement('div');
  rightSection.id = 'conversation-manager-filters-right-section';
  rightSection.classList = `flex items-center ${lastSelectedConversationFolder?.id === 'all' || lastSelectedConversationFolder?.id === 'archived' ? 'hidden' : ''}`;
  filterBar.appendChild(rightSection);
  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    const { selectedConversationsManagerSortBy } = settings;
    // add sort button
    const sortBySelectorWrapper = document.createElement('div');
    sortBySelectorWrapper.id = 'conversation-manager-sort-by-wrapper';
    sortBySelectorWrapper.style = 'position:relative;width:150px;z-index:1000;margin-left:8px;';
    sortBySelectorWrapper.innerHTML = dropdown('Conversations-Manager-SortBy', conversationsSortByList, selectedConversationsManagerSortBy, 'code', 'right');
    rightSection.appendChild(sortBySelectorWrapper);
    addDropdownEventListener('Conversations-Manager-SortBy', conversationsSortByList, 'code', () => fetchConversations());
    // add compact view button
    const compactViewButton = conversationCardCompactViewButton(settings);
    filterBar.appendChild(compactViewButton);
  });

  const selectionBar = document.createElement('div');
  selectionBar.id = 'conversation-manager-selection-bar';
  selectionBar.classList = 'flex items-center justify-end px-2 py-3 hidden sticky top-0 bg-token-main-surface-primary z-10';
  content.appendChild(selectionBar);

  const cancelButton = document.createElement('button');
  cancelButton.id = 'conversation-manager-selection-cancel-button';
  cancelButton.classList = 'flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary ml-2 mr-auto border border-token-border-light';
  cancelButton.innerText = translate('Cancel');
  cancelButton.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#modal-manager input[id^="conversation-checkbox-"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    resetConversationManagerSelection();
  });
  selectionBar.appendChild(cancelButton);

  const selectionCount = document.createElement('span');
  selectionCount.id = 'conversation-manager-selection-count';
  selectionCount.classList = 'text-token-text-secondary text-xs mr-4';
  selectionCount.innerText = '0 selected';
  selectionBar.appendChild(selectionCount);

  const deleteButton = document.createElement('button');
  deleteButton.classList = 'flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary mr-2 border border-token-border-light';
  deleteButton.innerText = translate('Delete');
  deleteButton.addEventListener('click', () => {
    const selectedConversations = Array.from(document.querySelectorAll('#modal-manager input[id^="conversation-checkbox-"]:checked'));
    if (selectedConversations.length === 0) return;
    showConfirmDialog('Delete conversation', 'Are you sure you want to delete the selected conversations?', 'Cancel', 'Delete', null, async () => {
      resetConversationManagerSelection();
      // remove the conversations from the list
      const conversationIds = selectedConversations.map((c) => c.dataset.conversationId);
      conversationIds.forEach((conversationId) => {
        // remove the conversation from sidebar
        const conversationElement = document.querySelector(`nav li a[href$="${conversationId}"]`);
        if (conversationElement) conversationElement.remove();
        // remove the card from the list
        const conversationCard = document.querySelector(`#modal-manager [data-conversation-id="${conversationId}"]`);
        if (conversationCard) conversationCard.remove();
      });
      const conversationList = document.querySelector('#modal-manager #conversation-manager-conversation-list');
      if (conversationList && conversationList.children.length === 0) {
        conversationList.appendChild(noConversationElement());
      }
      const curLastSelectedConversationFolder = getLastSelectedConversationFolder();
      updateConversationFolderCount(curLastSelectedConversationFolder.id, null, conversationIds.length);
      // delete the conversations
      chrome.runtime.sendMessage({
        type: 'deleteConversations',
        detail: {
          conversationIds,
        },
      });
      for (let i = 0; i < conversationIds.length; i += 1) {
        const conversationId = conversationIds[i];
        try {
          // eslint-disable-next-line no-await-in-loop
          await deleteConversation(conversationId);
          removeConversationElements(conversationId);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    });
  });
  selectionBar.appendChild(deleteButton);

  const removeButton = document.createElement('button');
  removeButton.id = 'conversation-manager-remove-button';
  removeButton.classList = `flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary mr-2 border border-token-border-light ${isDefaultFolder ? 'hidden' : ''}`;
  removeButton.innerText = translate('Remove from folder');
  removeButton.addEventListener('click', () => {
    handleClickRemoveConversationsButton();
  });
  selectionBar.appendChild(removeButton);

  const moveButton = document.createElement('button');
  moveButton.id = 'conversation-manager-move-button';
  moveButton.classList = `flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary mr-2 border border-token-border-light ${isDefaultFolder ? 'hidden' : ''}`;
  moveButton.innerText = translate('Move');
  moveButton.addEventListener('click', () => {
    handleClickMoveConversationsButton();
  });
  selectionBar.appendChild(moveButton);

  const addToFolderButton = document.createElement('button');
  addToFolderButton.id = 'conversation-manager-add-to-folder-button';
  addToFolderButton.classList = `flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary mr-2 border border-token-border-light ${['all', 'temporary'].includes(lastSelectedConversationFolder?.id) ? '' : 'hidden'}`;
  addToFolderButton.innerText = translate('Add to folder');
  addToFolderButton.addEventListener('click', () => {
    handleClickMoveConversationsButton();
  });
  selectionBar.appendChild(addToFolderButton);

  const archiveButton = document.createElement('button');
  archiveButton.id = 'conversation-manager-archive-button';
  archiveButton.classList = `flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary mr-2 border border-token-border-light ${['archived', 'temporary'].includes(lastSelectedConversationFolder?.id) ? 'hidden' : ''}`;
  archiveButton.innerText = translate('Archive');
  archiveButton.addEventListener('click', () => {
    handleClickArchiveConversationsButton();
  });
  selectionBar.appendChild(archiveButton);

  const unarchiveButton = document.createElement('button');
  unarchiveButton.id = 'conversation-manager-unarchive-button';
  unarchiveButton.classList = `flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary mr-2 border border-token-border-light ${lastSelectedConversationFolder?.id === 'archived' ? '' : 'hidden'}`;
  unarchiveButton.innerText = translate('Unarchive');
  unarchiveButton.addEventListener('click', () => {
    handleClickUnarchiveConversationsButton();
  });
  selectionBar.appendChild(unarchiveButton);

  const exportButton = document.createElement('button');
  exportButton.id = 'conversation-manager-export-button';
  exportButton.classList = 'flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary mr-2 border border-token-border-light';
  exportButton.innerText = translate('Export');
  exportButton.addEventListener('click', () => {
    handleClickExportConversationsButton();
  });
  selectionBar.appendChild(exportButton);
  const folderContentWrapper = document.createElement('div');
  folderContentWrapper.id = 'conversation-manager-folder-content-wrapper';
  folderContentWrapper.classList = 'flex flex-wrap h-full overflow-y-auto p-4 pb-32 content-start';
  content.appendChild(folderContentWrapper);
  // breadcrumb
  const breadcrumb = document.createElement('div');
  breadcrumb.id = 'conversation-manager-breadcrumb';
  breadcrumb.classList = `${isDefaultFolder ? 'hidden' : 'flex'} items-center justify-start mb-4 bg-token-main-surface-secondary p-2 rounded-lg border border-token-border-light`;
  breadcrumb.addEventListener('click', (event) => {
    // Check if the clicked element is a breadcrumb item.
    if (event.target && event.target.matches('[data-folder-id]')) {
      const folderId = event.target.getAttribute('data-folder-id');

      // Find the clicked folder in the breadcrumb list.
      const folderIndex = selectedConversationFolderBreadcrumb.findIndex((f) => f.id.toString() === folderId.toString());
      if (folderIndex !== -1 && (folderIndex < selectedConversationFolderBreadcrumb.length - 1 || event.shiftKey)) {
        resetConversationManagerSelection();
        selectedConversationFolderBreadcrumb = selectedConversationFolderBreadcrumb.slice(0, folderIndex + 1);
        chrome.storage.local.set({ selectedConversationFolderBreadcrumb });
        generateConvFolderBreadcrumb(breadcrumb);
        getSubFolders(folderId, event.shiftKey);
        fetchConversations(1, false, event.shiftKey);
      }
    }
  });
  folderContentWrapper.appendChild(breadcrumb);
  // subfolder list
  const subfolderList = document.createElement('div');
  subfolderList.id = 'conversation-manager-subfolder-list';
  folderContentWrapper.appendChild(subfolderList);
  // conversation list
  const conversationList = document.createElement('div');
  conversationList.id = 'conversation-manager-conversation-list';
  folderContentWrapper.appendChild(conversationList);

  chrome.storage.local.get(['settings'], ({ settings }) => {
    subfolderList.classList = `grid ${settings.selectedConversationView === 'list' ? 'grid-cols-1 gap-3' : 'grid-cols-4 gap-4'} content-start w-full mb-2`;
    conversationList.classList = `grid ${settings.selectedConversationView === 'list' ? 'grid-cols-1 gap-3' : 'grid-cols-4 gap-4'} content-start w-full`;
  });
  return content;
}
function handleClickMoveConversationsButton() {
  // const lastSelectedConversationFolder = getLastSelectedConversationFolder();
  const selectedConversations = Array.from(document.querySelectorAll('#modal-manager input[id^="conversation-checkbox-"]:checked'));
  if (selectedConversations.length === 0) return;
  const conversationIds = selectedConversations.map((c) => c.dataset.conversationId);
  openMoveToFolderModal(conversationIds);
}
function handleClickRemoveConversationsButton() {
  const lastSelectedConversationFolder = getLastSelectedConversationFolder();
  const conversationIds = Array.from(document.querySelectorAll('#modal-manager input[id^="conversation-checkbox-"]:checked')).map((c) => c.dataset.conversationId);
  if (conversationIds.length === 0) return;
  resetConversationManagerSelection();
  // remove the conversations from the list
  conversationIds.forEach((conversationId) => {
    const conversationCard = document.querySelector(`#modal-manager [data-conversation-id="${conversationId}"]`);
    if (conversationCard) conversationCard.remove();
  });
  updateConversationFolderCount(lastSelectedConversationFolder?.id, null, conversationIds.length);
  chrome.runtime.sendMessage({
    type: 'removeConversationsFromFolder',
    detail: {
      conversationIds,
    },
  }, () => {
    toast('Conversations moved successfully');
    fetchSidebarConversations(1, false, false);
  });
}
async function handleClickArchiveConversationsButton() {
  const lastSelectedConversationFolder = getLastSelectedConversationFolder();
  const conversationIds = Array.from(document.querySelectorAll('#modal-manager input[id^="conversation-checkbox-"]:checked')).map((c) => c.dataset.conversationId);
  if (conversationIds.length === 0) return;
  resetConversationManagerSelection();
  // remove the conversations from the list
  conversationIds.forEach((conversationId) => {
    const conversationCard = document.querySelector(`#modal-manager [data-conversation-id="${conversationId}"]`);
    if (conversationCard) conversationCard.remove();
  });

  updateConversationFolderCount(lastSelectedConversationFolder?.id, null, conversationIds.length);
  for (let i = 0; i < conversationIds.length; i += 1) {
    const conversationId = conversationIds[i];
    chrome.runtime.sendMessage({
      type: 'archiveConversations',
      detail: {
        conversationIds: [conversationId],
      },
    });
    // eslint-disable-next-line no-await-in-loop
    await archiveConversation(conversationId);
  }
}
async function handleClickUnarchiveConversationsButton() {
  const conversationIds = Array.from(document.querySelectorAll('#modal-manager input[id^="conversation-checkbox-"]:checked')).map((c) => c.dataset.conversationId);
  if (conversationIds.length === 0) return;
  resetConversationManagerSelection();
  // remove the conversations from the list
  conversationIds.forEach((conversationId) => {
    const conversationCard = document.querySelector(`#modal-manager [data-conversation-id="${conversationId}"]`);
    if (conversationCard) conversationCard.remove();
  });

  for (let i = 0; i < conversationIds.length; i += 1) {
    const conversationId = conversationIds[i];
    chrome.runtime.sendMessage({
      type: 'unarchiveConversations',
      detail: {
        conversationIds: [conversationId],
      },
    });
    // eslint-disable-next-line no-await-in-loop
    await unarchiveConversation(conversationId);
  }
}
async function handleClickExportConversationsButton() {
  const conversationIds = Array.from(document.querySelectorAll('#modal-manager input[id^="conversation-checkbox-"]:checked')).map((c) => c.dataset.conversationId);
  if (conversationIds.length === 0) return;
  openExportModal(conversationIds, 'selected');
}
function resetConversationManagerParams() {
  lastSelectedConversationCardId = '';
  lastSelectedConversationCheckboxId = '';
}
function resetConversationManagerSelection() {
  const lastSelectedConversationFolder = getLastSelectedConversationFolder();
  const conversationManager = document.querySelector('#modal-manager #modal-content-conversation-manager');
  if (!conversationManager) return;
  lastSelectedConversationCheckboxId = '';
  const searchInput = document.querySelector('#modal-manager input[id="conversation-manager-search-input"]');
  if (searchInput) searchInput.value = '';
  const rightSection = document.querySelector('#modal-manager #conversation-manager-filters-right-section');
  if (rightSection) {
    if (lastSelectedConversationFolder?.id === 'all' || lastSelectedConversationFolder?.id === 'archived') {
      rightSection.classList.add('hidden');
    } else {
      rightSection.classList.remove('hidden');
    }
  }
  const conversationCardMenu = document.querySelector('#modal-manager #conversation-card-menu');
  if (conversationCardMenu) conversationCardMenu.remove();
  const selectionBar = document.querySelector('#modal-manager div[id="conversation-manager-selection-bar"]');
  if (selectionBar) selectionBar.classList.add('hidden');
  const contentWrapper = document.querySelector('#modal-manager div[id="conversation-manager-content-wrapper"]');
  if (contentWrapper) {
    contentWrapper.style.paddingBottom = '59px';
  }
  const moveButton = document.querySelector('#modal-manager button[id="conversation-manager-move-button"]');
  if (moveButton) {
    if (isDefaultConvFolder(lastSelectedConversationFolder?.id)) {
      moveButton.classList.add('hidden');
    } else {
      moveButton.classList.remove('hidden');
    }
  }
  const removeButton = document.querySelector('#modal-manager button[id="conversation-manager-remove-button"]');
  if (removeButton) {
    if (isDefaultConvFolder(lastSelectedConversationFolder?.id)) {
      removeButton.classList.add('hidden');
    } else {
      removeButton.classList.remove('hidden');
    }
  }
  const addToFolderButton = document.querySelector('#modal-manager button[id="conversation-manager-add-to-folder-button"]');
  if (addToFolderButton) {
    if (['all', 'temporary'].includes(lastSelectedConversationFolder?.id)) {
      addToFolderButton.classList.remove('hidden');
    } else {
      addToFolderButton.classList.add('hidden');
    }
  }
  const archiveButton = document.querySelector('#modal-manager button[id="conversation-manager-archive-button"]');
  if (archiveButton) {
    if (['archived', 'temporary'].includes(lastSelectedConversationFolder?.id)) {
      archiveButton.classList.add('hidden');
    } else {
      archiveButton.classList.remove('hidden');
    }
  }
  const unarchiveButton = document.querySelector('#modal-manager button[id="conversation-manager-unarchive-button"]');
  if (unarchiveButton) {
    if (lastSelectedConversationFolder?.id === 'archived') {
      unarchiveButton.classList.remove('hidden');
    } else {
      unarchiveButton.classList.add('hidden');
    }
  }

  const selectionCount = document.querySelector('#modal-manager span[id="conversation-manager-selection-count"]');
  if (selectionCount) selectionCount.innerText = '0 selected';
}
function syncHistoryResponseToConversationDB(response, isArchived) {
  const conversations = response.items.map((item) => ({
    ...item,
    conversation_id: item.id,
    create_time: new Date(item.create_time).getTime() / 1000,
    update_time: new Date(item.update_time).getTime() / 1000,
  }));
  chrome.runtime.sendMessage({
    type: isArchived ? 'getTotalArchivedConversationsCount' : 'getTotalConversationsCount',
    forceRefresh: true,
  }, (convCount) => {
    if (convCount < event?.detail?.total) {
      chrome.runtime.sendMessage({
        type: 'addConversations',
        detail: {
          conversations,
        },
      }, () => {
        chrome.runtime.sendMessage({ type: 'initializeConversationSync', forceRefresh: true });
      });
    }
  });
  return conversations;
}
async function fetchConversations(pageNumber = 1, fullSearch = false, forceRefresh = false) {
  const lastSelectedConversationFolder = getLastSelectedConversationFolder();
  if (!lastSelectedConversationFolder) return;
  const conversationList = document.querySelector('#modal-manager #conversation-manager-conversation-list');
  if (!conversationList) return;
  if (pageNumber === 1) {
    conversationList.innerHTML = '';
    conversationList.appendChild(loadingSpinner('conversation-manager-main-content'));
  }

  let conversations = [];
  let hasMore = false;
  let allFavoriteConvIds = [];
  let allNoteConvIds = [];
  const { settings } = await chrome.storage.local.get(['settings']);
  const conversationManagerSearchTerm = document.querySelector('#modal-manager input[id=conversation-manager-search-input]')?.value;
  if (conversationManagerSearchTerm === '' && lastSelectedConversationFolder?.id === 'archived') {
    if (pageNumber === 1) {
      allFavoriteConvIds = await chrome.runtime.sendMessage({ type: 'getAllFavoriteConversationIds' });
      allNoteConvIds = await chrome.runtime.sendMessage({ type: 'getAllNoteConversationIds' });
    }
    const convPerPage = 100;
    const offset = (pageNumber - 1) * convPerPage;
    const limit = convPerPage;
    const isArchived = lastSelectedConversationFolder?.id === 'archived';
    try {
      const response = await getConversations(offset, limit, 'updated', isArchived, forceRefresh);
      // sync new chats to the database
      conversations = syncHistoryResponseToConversationDB(response, isArchived);
      hasMore = response.total > offset + limit;
    } catch (error) {
      // set load more button to show "load more" and on click fetchConversations(pageNumber + 1) again
      const loadMoreButton = document.querySelector('#modal-manager #load-more-conversations-button');
      if (loadMoreButton) {
        loadMoreButton.innerHTML = '<div class="w-full h-full flex items-center justify-center">Load more...</div>';
        loadMoreButton.onclick = () => fetchConversations(pageNumber + 1, fullSearch, forceRefresh);
        return;
      }
    }
  } else {
    const { selectedConversationsManagerSortBy, excludeConvInFolders } = settings;
    const sortBy = selectedConversationsManagerSortBy?.code;
    const response = await chrome.runtime.sendMessage({
      type: 'getConversations',
      forceRefresh,
      detail: {
        pageNumber,
        searchTerm: conversationManagerSearchTerm,
        sortBy: ['all', 'archived'].includes(lastSelectedConversationFolder?.id) ? 'updated_at' : sortBy,
        fullSearch,
        folderId: typeof lastSelectedConversationFolder?.id === 'string' ? null : lastSelectedConversationFolder?.id,
        isArchived: lastSelectedConversationFolder?.id === 'archived' ? true : null,
        isFavorite: lastSelectedConversationFolder?.id === 'favorites' ? true : null,
        isTemporary: lastSelectedConversationFolder?.id === 'temporary' ? true : null,
        excludeConvInFolders: lastSelectedConversationFolder?.id === 'all' && excludeConvInFolders,
      },
    });
    conversations = response.results;
    hasMore = response.next;
  }
  const loadMoreButton = document.querySelector('#modal-manager #load-more-conversations-button');
  if (loadMoreButton) loadMoreButton.remove();
  const loadingSpinnerElement = document.querySelector('#modal-manager #loading-spinner-conversation-manager-main-content');
  if (loadingSpinnerElement) loadingSpinnerElement.remove();
  if (conversations?.length === 0 && pageNumber === 1) {
    if (conversationManagerSearchTerm && !fullSearch) {
      const fullSearchButton = createFullSearchButton();
      conversationList.appendChild(fullSearchButton);
      fullSearchButton.click();
    } else {
      conversationList.appendChild(noConversationElement());
    }
  } else {
    conversations.forEach((conversation) => {
      const isFavorite = allFavoriteConvIds.includes(conversation.conversation_id) || conversation.is_favorite;
      const hasNote = allNoteConvIds.includes(conversation.conversation_id) || conversation.has_note;
      const conv = { ...conversation, is_favorite: isFavorite, has_note: hasNote };
      const conversationCard = createConversationCard(conv, settings);
      conversationList.appendChild(conversationCard);
      addConversationCardEventListeners(conversationCard, conv);
    });
    if (hasMore) {
      const loadMoreConversationsButton = document.createElement('button');
      loadMoreConversationsButton.id = 'load-more-conversations-button';
      loadMoreConversationsButton.classList = `bg-token-main-surface-secondary p-4 pb-2 rounded-md cursor-pointer hover:bg-token-main-surface-tertiary ${settings.selectedConversationView === 'list' ? 'h-14' : 'h-auto aspect-1.5'} flex flex-col relative`;
      loadMoreConversationsButton.appendChild(loadingSpinner('load-more-conversations-button'));
      conversationList.appendChild(loadMoreConversationsButton);
      loadMoreConversationsButton.onclick = () => fetchConversations(pageNumber + 1, fullSearch, forceRefresh);
      // add an observer to click the load more button when it is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchConversations(pageNumber + 1, fullSearch, forceRefresh);
          }
        });
      }, { threshold: 0.5 });
      if (loadMoreConversationsButton) {
        observer.observe(loadMoreConversationsButton);
      }
    } else if (conversationManagerSearchTerm && !fullSearch) {
      const fullSearchButton = createFullSearchButton();
      conversationList.appendChild(fullSearchButton);
    }
  }
}
function createFullSearchButton(sidebarFolder = false) {
  const fullSearchButton = document.createElement('button');
  fullSearchButton.id = 'full-search-button';
  fullSearchButton.classList = `flex items-center justify-center text-2xl bg-token-main-surface-secondary p-4 rounded-md cursor-pointer hover:bg-token-main-surface-tertiary ${sidebarFolder ? 'w-full mt-2' : 'aspect-1.5'} h-auto relative`;
  fullSearchButton.innerHTML = `<div class="flex items-center justify-center">
      <div class="w-full text-sm">Load more</div>
      </div>`;
  fullSearchButton.addEventListener('click', (e) => {
    if (sidebarFolder) {
      fetchSidebarConversations(1, true, e.shiftKey);
    } else {
      fetchConversations(1, true, e.shiftKey);
    }
  });
  return fullSearchButton;
}
function conversationListView(conversation) {
  if (!conversation) return '';
  return `<div class="flex items-center">
      <input id="conversation-checkbox-${conversation.conversation_id}" data-conversation-id="${conversation.conversation_id}" type="checkbox" id="checkbox" class="manager-modal border border-token-border-medium mr-2" style="cursor: pointer; border-radius: 2px;">
      
    </div>
    
  <div id="conversation-title" class="flex flex-1 items-center text-sm whitespace-wrap overflow-hidden text-ellipsis break-all">
    ${escapeHTML(conversation.title || 'New chat')}
    
    <div class="flex items-center justify-between">
      <div class="whitespace-nowrap text-xs text-token-text-secondary overflow-hidden text-ellipsis flex items-center w-full">
        <div id="conversation-card-folder-tag-${conversation.conversation_id}" class="flex items-center py-1 px-2 ml-2 rounded-md text-white ${conversation?.folder?.name ? '' : 'hidden'}" style="background-color: ${conversation?.folder?.name ? `${conversation?.folder?.color}` : 'transparent'};">
          <div class="flex items-center rounded-md px-1 text-xs font-normal overflow-hidden">
            <svg stroke="currentColor" fill="currentColor" class="icon-xs mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M147.8 192H480V144C480 117.5 458.5 96 432 96h-160l-64-64h-160C21.49 32 0 53.49 0 80v328.4l90.54-181.1C101.4 205.6 123.4 192 147.8 192zM543.1 224H147.8C135.7 224 124.6 230.8 119.2 241.7L0 480h447.1c12.12 0 23.2-6.852 28.62-17.69l96-192C583.2 249 567.7 224 543.1 224z"/></svg>
            <span id="conversation-card-folder-name-${conversation.conversation_id}">
              ${conversation?.folder?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>


  <div class="flex justify-between items-center pt-1">
    <span class="text-xs text-token-text-secondary mr-2">${formatDate(new Date(formatTime(conversation.update_time, 10)))}</span>
    
    ${conversation.is_archived ? '<span title="Archived"><svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md mr-2 text-token-text-secondary"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.62188 3.07918C3.87597 2.571 4.39537 2.25 4.96353 2.25H13.0365C13.6046 2.25 14.124 2.571 14.3781 3.07918L15.75 5.82295V13.5C15.75 14.7426 14.7426 15.75 13.5 15.75H4.5C3.25736 15.75 2.25 14.7426 2.25 13.5V5.82295L3.62188 3.07918ZM13.0365 3.75H4.96353L4.21353 5.25H13.7865L13.0365 3.75ZM14.25 6.75H3.75V13.5C3.75 13.9142 4.08579 14.25 4.5 14.25H13.5C13.9142 14.25 14.25 13.9142 14.25 13.5V6.75ZM6.75 9C6.75 8.58579 7.08579 8.25 7.5 8.25H10.5C10.9142 8.25 11.25 8.58579 11.25 9C11.25 9.41421 10.9142 9.75 10.5 9.75H7.5C7.08579 9.75 6.75 9.41421 6.75 9Z" fill="currentColor"></path></svg></span>' : ''}

    <div title="This conversations has notes"><svg id="conversation-note-indicator-${conversation.conversation_id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#19c37d" class="mr-2 icon-sm ${conversation.has_note ? '' : 'hidden'}"><path d="M320 480l128-128h-128V480zM400 31.1h-352c-26.51 0-48 21.49-48 48v352C0 458.5 21.49 480 48 480H288l.0039-128c0-17.67 14.33-32 32-32H448v-240C448 53.49 426.5 31.1 400 31.1z"/></svg></div>

    <div id="conversation-card-favorite" title="favorite conversation" class="mr-1">
      ${conversation.is_favorite ? '<svg class="icon-md" fill="gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/></svg>' : '<svg class="icon-md" fill="#b4b4b4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z"/></svg>'}
    </div>

    <div id="conversation-card-action-right-${conversation.conversation_id}" class="flex items-center">
      <div id="conversation-card-settings-menu-${conversation.conversation_id}" class="relative flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg>
      </div>
    </div>
  </div>`;
}
function conversationGridView(conversation) {
  if (!conversation) return '';
  const lastSelectedConversationFolder = getLastSelectedConversationFolder();
  return `<div class="flex items-center justify-between border-b border-token-border-light pb-1"><div class="whitespace-nowrap text-xs text-token-text-secondary overflow-hidden text-ellipsis flex items-center w-full"><div id="conversation-card-folder-wrapper-${conversation.conversation_id}" class="flex items-center ${conversation?.folder?.name && typeof lastSelectedConversationFolder?.id !== 'number' ? '' : 'hidden'}"><div class="flex items-center border border-token-border-medium rounded-md px-1 text-xs font-normal overflow-hidden hover:w-fit w-auto min-w-5 max-w-5"><svg stroke="currentColor" fill="currentColor" class="icon-xs mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M147.8 192H480V144C480 117.5 458.5 96 432 96h-160l-64-64h-160C21.49 32 0 53.49 0 80v328.4l90.54-181.1C101.4 205.6 123.4 192 147.8 192zM543.1 224H147.8C135.7 224 124.6 230.8 119.2 241.7L0 480h447.1c12.12 0 23.2-6.852 28.62-17.69l96-192C583.2 249 567.7 224 543.1 224z"/></svg><span id="conversation-card-folder-name-${conversation.conversation_id}">${conversation?.folder?.name}</span></div> <svg aria-hidden="true" fill="none" focusable="false" height="1em" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" style="min-width:16px" viewBox="0 0 24 24" width="1em"><path d="m9 18 6-6-6-6"></path></svg></div>${formatDate(new Date(formatTime(conversation.update_time, 10)))}</div>
  <div id="conversation-card-favorite" title="favorite conversation" class="pl-1">
    ${conversation.is_favorite ? '<svg class="icon-md" fill="gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/></svg>' : '<svg class="icon-md" fill="#b4b4b4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z"/></svg>'}
  </div>
  </div>
  <div id="conversation-title" class="flex-1 text-sm whitespace-wrap overflow-hidden text-ellipsis break-all">${escapeHTML(conversation.title || 'New chat')}</div>
  <div class="border-t border-token-border-light flex justify-between items-center pt-1">
    <div class="flex items-center">
      <input id="conversation-checkbox-${conversation.conversation_id}" data-conversation-id="${conversation.conversation_id}" type="checkbox" id="checkbox" class="manager-modal border border-token-border-medium mr-2" style="cursor: pointer; border-radius: 2px;">
      <span title="This conversations has notes"><svg id="conversation-note-indicator-${conversation.conversation_id}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#19c37d" class="ml-1 icon-sm ${conversation.has_note ? '' : 'hidden'}"><path d="M320 480l128-128h-128V480zM400 31.1h-352c-26.51 0-48 21.49-48 48v352C0 458.5 21.49 480 48 480H288l.0039-128c0-17.67 14.33-32 32-32H448v-240C448 53.49 426.5 31.1 400 31.1z"/></svg></span>
    </div>
    <div id="conversation-card-action-right-${conversation.conversation_id}" class="flex items-center">
      ${conversation.is_archived ? '<span title="Archived"><svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md mr-2 text-token-text-secondary"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.62188 3.07918C3.87597 2.571 4.39537 2.25 4.96353 2.25H13.0365C13.6046 2.25 14.124 2.571 14.3781 3.07918L15.75 5.82295V13.5C15.75 14.7426 14.7426 15.75 13.5 15.75H4.5C3.25736 15.75 2.25 14.7426 2.25 13.5V5.82295L3.62188 3.07918ZM13.0365 3.75H4.96353L4.21353 5.25H13.7865L13.0365 3.75ZM14.25 6.75H3.75V13.5C3.75 13.9142 4.08579 14.25 4.5 14.25H13.5C13.9142 14.25 14.25 13.9142 14.25 13.5V6.75ZM6.75 9C6.75 8.58579 7.08579 8.25 7.5 8.25H10.5C10.9142 8.25 11.25 8.58579 11.25 9C11.25 9.41421 10.9142 9.75 10.5 9.75H7.5C7.08579 9.75 6.75 9.41421 6.75 9Z" fill="currentColor"></path></svg></span>' : ''}
      <div id="conversation-card-settings-menu-${conversation.conversation_id}" class="relative flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg>
      </div>
    </div>
    <div id="conversation-card-folder-color-indicator-${conversation.conversation_id}" class="absolute w-full h-2 bottom-0 left-0 rounded-b-md" style="background-color: ${conversation?.folder?.name ? `${conversation?.folder?.color}` : 'transparent'};">
    </div>
  </div>`;
}
function createConversationCard(conversation, settings) {
  const conversationCard = document.createElement('div');
  conversationCard.id = `conversation-card-${conversation.conversation_id}`;
  conversationCard.dataset.conversationId = conversation.conversation_id;
  conversationCard.classList = `relative flex bg-token-main-surface-secondary rounded-md cursor-pointer hover:bg-token-main-surface-tertiary ${settings.selectedConversationView === 'list' ? 'w-full p-2 flex-row h-10' : 'aspect-1.5 p-4 pb-2 flex-col h-auto'}`;
  if (conversation.folder) {
    conversationCard.dataset.folderId = conversation.folder.id;
  }
  conversationCard.style = 'height: max-content;outline-offset: 4px; outline: none;';
  conversationCard.innerHTML = settings.selectedConversationView === 'list' ? conversationListView(conversation) : conversationGridView(conversation);
  conversationCard.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    updateSelectedConvCard(conversation.conversation_id);
    if (e.metaKey || (isWindows() && e.ctrlKey)) {
      window.open(`/c/${conversation.conversation_id}`, '_blank');
    } else {
      showConversationPreviewWrapper(conversation.conversation_id);
    }
  });
  conversationCard.addEventListener('mouseenter', () => {
    closeMenus();
  });
  return conversationCard;
}
function updateSelectedConvCard(conversationId) {
  if (lastSelectedConversationCardId) {
    const prevSelectedCards = document.querySelectorAll(`#conversation-card-${lastSelectedConversationCardId}`);
    prevSelectedCards.forEach((prevSelectedCard) => {
      prevSelectedCard.style.outline = 'none';
    });
  }
  if (!conversationId) return;
  const conversationCards = document.querySelectorAll(`#conversation-card-${conversationId}`);
  lastSelectedConversationCardId = conversationId;
  conversationCards.forEach((conversationCard) => {
    conversationCard.style.outline = `2px solid ${isDarkMode() ? '#fff' : '#000'}`;
  });
}
// eslint-disable-next-line no-unused-vars
function addOrReplaceConversationCard(conversation, origElement = null) {
  const lastSelectedConversationFolder = getLastSelectedConversationFolder();
  if (lastSelectedConversationFolder
    && lastSelectedConversationFolder?.id?.toString() === conversation.folder?.id?.toString()
  ) {
    const existingConversationCard = document.querySelector(`#modal-manager [data-conversation-id="${conversation.conversation_id}"]`);
    chrome.storage.local.get(['settings'], ({ settings }) => {
      if (existingConversationCard) {
        const newConversationCard = createConversationCard(conversation, settings);
        existingConversationCard.replaceWith(newConversationCard);
        addConversationCardEventListeners(newConversationCard, conversation);
      } else {
        // add the conversation card to the beginning of the list
        const conversationList = document.querySelector('#modal-manager #conversation-manager-conversation-list');
        const noConversationsFound = document.querySelector('#modal-manager #no-conversations-found');
        if (noConversationsFound) noConversationsFound.remove();
        const newConversationCard = createConversationCard(conversation, settings);
        if (origElement) {
          // add the conversation card after the origElement
          origElement.after(newConversationCard);
        } else {
          conversationList.prepend(newConversationCard);
        }
        addConversationCardEventListeners(newConversationCard, conversation);
      }
    });
  }
}
function addConversationCardEventListeners(conversationCard, conversation, sidebarFolder = false) {
  const checkbox = conversationCard.querySelector(`#modal-manager #conversation-checkbox-${conversation.conversation_id}`);
  checkbox?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    const selectedConversations = Array.from(document.querySelectorAll('#modal-manager input[id^="conversation-checkbox-"]:checked'));

    if (selectedConversations.length > 0) {
      if (e.shiftKey && selectedConversations.filter((selectedConversation) => selectedConversation.id !== `conversation-checkbox-${conversation.id}`).length > 0) {
        const conversationId = conversation.conversation_id;
        const conversationCards = document.querySelectorAll('#modal-manager div[id^="conversation-card-"]');
        let startAdding = false;
        let endAdding = false;
        conversationCards.forEach((conversationCardElement) => {
          const currentConversationId = conversationCardElement.id.split('conversation-card-')[1];
          if (currentConversationId === lastSelectedConversationCheckboxId || currentConversationId === conversationId) {
            if (startAdding) {
              endAdding = true;
            } else {
              startAdding = true;
            }
          }
          if (startAdding && !endAdding) {
            const currentConversationCheckbox = document.querySelector(`#modal-manager #conversation-checkbox-${currentConversationId}`);
            if (currentConversationCheckbox) {
              currentConversationCheckbox.checked = true;
            }
          }
        });
      }
      lastSelectedConversationCheckboxId = conversation.conversation_id;
      const selectionCountElement = document.querySelector('#modal-manager span[id="conversation-manager-selection-count"]');
      const curSelectedConversations = Array.from(document.querySelectorAll('#modal-manager input[id^="conversation-checkbox-"]:checked'));
      selectionCountElement.innerText = `${curSelectedConversations.length} selected`;
      const selectionBar = document.querySelector('#modal-manager div[id="conversation-manager-selection-bar"]');
      selectionBar.classList.remove('hidden');
      const contentWrapper = document.querySelector('#modal-manager div[id="conversation-manager-content-wrapper"]');
      if (contentWrapper) {
        contentWrapper.style.paddingBottom = 'calc(59px + 56px)';
      }
    } else {
      resetConversationManagerSelection();
    }
  });
  const favoriteButton = conversationCard.querySelector('#modal-manager #conversation-card-favorite');
  favoriteButton?.addEventListener('click', async (e) => {
    e.stopPropagation();
    const lastSelectedConversationFolder = getLastSelectedConversationFolder();
    if (lastSelectedConversationFolder?.id === 'favorites') {
      // remove card from the list
      conversationCard.remove();
    }
    const conversations = await getConversationsByIds([conversation.conversation_id]);
    const response = await chrome.runtime.sendMessage({
      type: 'toggleConversationFavorite',
      forceRefresh: true,
      detail: {
        conversation: conversations[0],
      },
    });

    if (lastSelectedConversationFolder?.id === 'favorites') return;
    if (response.is_favorite) {
      favoriteButton.innerHTML = '<svg class="icon-md" fill="gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/></svg>';
    } else {
      favoriteButton.innerHTML = '<svg class="icon-md" fill="#b4b4b4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M287.9 0C297.1 0 305.5 5.25 309.5 13.52L378.1 154.8L531.4 177.5C540.4 178.8 547.8 185.1 550.7 193.7C553.5 202.4 551.2 211.9 544.8 218.2L433.6 328.4L459.9 483.9C461.4 492.9 457.7 502.1 450.2 507.4C442.8 512.7 432.1 513.4 424.9 509.1L287.9 435.9L150.1 509.1C142.9 513.4 133.1 512.7 125.6 507.4C118.2 502.1 114.5 492.9 115.1 483.9L142.2 328.4L31.11 218.2C24.65 211.9 22.36 202.4 25.2 193.7C28.03 185.1 35.5 178.8 44.49 177.5L197.7 154.8L266.3 13.52C270.4 5.249 278.7 0 287.9 0L287.9 0zM287.9 78.95L235.4 187.2C231.9 194.3 225.1 199.3 217.3 200.5L98.98 217.9L184.9 303C190.4 308.5 192.9 316.4 191.6 324.1L171.4 443.7L276.6 387.5C283.7 383.7 292.2 383.7 299.2 387.5L404.4 443.7L384.2 324.1C382.9 316.4 385.5 308.5 391 303L476.9 217.9L358.6 200.5C350.7 199.3 343.9 194.3 340.5 187.2L287.9 78.95z"/></svg>';
    }
  });

  const settingsButton = conversationCard.querySelector(`#conversation-card-settings-menu-${conversation.conversation_id}`);
  settingsButton?.addEventListener('click', async (e) => {
    e.stopPropagation();
    closeMenus();
    const conversationList = document.querySelector('#modal-manager #conversation-manager-conversation-list');
    // check if card in a 4n child of conversationList
    const index = conversationList ? Array.from(conversationList.children).indexOf(conversationCard) : -1;

    const is4n = (index + 1) % 4 === 0;
    const { settings } = await chrome.storage.local.get(['settings']);
    const leftMenu = is4n || settings.selectedConversationView === 'list';
    showConversationManagerCardMenu(settingsButton, conversation, leftMenu, sidebarFolder);
  });
}
function noConversationElement() {
  const noConversations = document.createElement('p');
  noConversations.classList = 'absolute text-center text-sm text-token-text-secondary w-full p-4';
  noConversations.id = 'no-conversations-found';
  noConversations.innerText = translate('No conversations found');
  return noConversations;
}
function noConversationFolderElemet() {
  const noFolders = document.createElement('p');
  noFolders.id = 'no-conversation-folders';
  noFolders.classList = 'text-token-text-secondary text-center text-sm py-4';
  noFolders.innerText = translate('new_folder_hint');
  return noFolders;
}
// eslint-disable-next-line no-unused-vars
function saveAllExistingConversationFoldersInDB() {
  chrome.storage.local.get(['savedAllExistingFoldersInDBDone', 'conversationsOrder'], async ({
    savedAllExistingFoldersInDBDone, conversationsOrder = [],
  }) => {
    if (conversationsOrder.length === 0) return;
    if (savedAllExistingFoldersInDBDone) return;

    const existingFolders = conversationsOrder.filter((folder) => typeof folder === 'object');
    if (existingFolders.length === 0) {
      chrome.storage.local.set({ savedAllExistingFoldersInDBDone: true });
      return;
    }
    const allConversations = [];
    for (let i = 0; i < existingFolders.length; i += 1) {
      const folder = existingFolders[i];
      const { conversationIds } = folder;
      if (conversationIds.length === 0) continue;
      // eslint-disable-next-line no-await-in-loop
      const FolderConvs = await getConversationsByIds(conversationIds);
      allConversations.push(...FolderConvs.map((conv) => ({ ...conv, conversation_id: conv.conversation_id || conv.id, folder: folder.name })));
    }

    chrome.runtime.sendMessage({
      type: 'addConversationFolders',
      detail: {
        folders: existingFolders.map((folder) => ({
          name: folder.name,
          color: folder.color,
        })),
      },
    }, (newFolders) => {
      if (newFolders.error || !Array.isArray(newFolders) || newFolders.length === 0) {
        chrome.storage.local.set({ savedAllExistingFoldersInDBDone: true });
      }
      // update existingFolder IDs with the new folder IDs that match the names
      conversationsOrder.filter((folder) => typeof folder === 'object').forEach((folder) => {
        const newFolder = newFolders.find((f) => f.name === folder.name);
        if (!newFolder) return;
        folder.id = newFolder.id;
      });
      chrome.storage.local.set({ conversationsOrder });

      if (allConversations.length === 0) {
        chrome.storage.local.set({ savedAllExistingFoldersInDBDone: true });
      }
      allConversations.forEach((conversation) => {
        const folder = newFolders.find((f) => f.name === conversation.folder);
        if (!folder) return;
        conversation.folder = folder.id;
      });
      chrome.runtime.sendMessage({
        type: 'addConversations',
        detail: {
          conversations: allConversations,
          initialSync: true,
        },
      }, (res) => {
        if (res.error) {
          if (res.error === 'Initial sync already done') {
            chrome.storage.local.set({ savedAllExistingFoldersInDBDone: true });
          }
          return;
        }
        chrome.storage.local.set({ savedAllExistingFoldersInDBDone: true });
      });
    });
  });
}
