/* global debounce, selectedConversationFolderBreadcrumb:true, createFullSearchButton, getConversationIdFromUrl, translate, closeMenus, addConversationCardEventListeners, closeSidebarNote, loadingSpinner, noConversationFolderElemet, conversationFolderElement, noConversationElement, defaultConversationFoldersList, errorUpgradeConfirmation, generateRandomDarkColor, handleRenameConversationFolderClick, showConversationPreviewWrapper, updateSelectedConvCard, getConversations, syncHistoryResponseToConversationDB, getLastSelectedConversationFolder, sidebarNoteIsOpen, isDefaultConvFolder, generateConvFolderBreadcrumb, getSubFolders */
const sidebarFolderDrawerWidth = 280; // px
function sidebarFolderIsOpen() {
  return window.localStorage.getItem('sp/sidebarFolderIsOpen') === 'true';
}

async function loadSidebarFolders(forceRefresh = false) {
  const { settings } = await chrome.storage.local.get('settings');
  const { selectedConversationsManagerFoldersSortBy = 'alphabetical' } = settings;
  const sidebarFolderContent = document.querySelector('#sidebar-folder-content');
  if (!sidebarFolderContent) return;
  const loadingSpinnerElement = document.querySelector('#sidebar-folder-drawer #loading-spinner-sidebar-folder-content');
  if (!loadingSpinnerElement) {
    sidebarFolderContent.innerHTML = '';
    sidebarFolderContent.appendChild(loadingSpinner('sidebar-folder-content'));
  }
  chrome.runtime.sendMessage({
    type: 'getConversationFolders',
    forceRefresh,
    detail: {
      sortBy: selectedConversationsManagerFoldersSortBy,
    },
  }, (conversationFolders) => {
    if (!conversationFolders) return;
    if (!Array.isArray(conversationFolders)) return;
    const curLoadingSpinnerElement = document.querySelector('#loading-spinner-sidebar-folder-content');
    if (curLoadingSpinnerElement) curLoadingSpinnerElement.remove();

    const sidebarFolderDrawer = document.querySelector('#sidebar-folder-drawer');
    if (!sidebarFolderDrawer) {
      addSidebarFolderDrawer();
    }

    sidebarFolderContent.innerHTML = '';
    sidebarFolderContent.appendChild(defaultConversationFoldersList(true));

    if (conversationFolders.length === 0) {
      selectedConversationFolderBreadcrumb = [];
      chrome.storage.local.set({ selectedConversationFolderBreadcrumb }); sidebarFolderContent.appendChild(noConversationFolderElemet());
    } else {
      conversationFolders.forEach((folder) => {
        sidebarFolderContent.appendChild(conversationFolderElement(folder, true));
      });

      if (selectedConversationFolderBreadcrumb.length > 0) fetchSidebarConversations();
    }
  });
}

async function fetchSidebarConversations(pageNumber = 1, fullSearch = false, forceRefresh = false) {
  const sidebarFolderSearchTerm = document.querySelector('#sidebar-folder-search-input')?.value;
  const lastSelectedConversationFolder = getLastSelectedConversationFolder();

  if (!lastSelectedConversationFolder && !sidebarFolderSearchTerm) return;

  const sidebarFolderContent = document.querySelector('#sidebar-folder-content');
  if (!sidebarFolderContent) return;
  if (pageNumber === 1) {
    sidebarFolderContent.innerHTML = '';
    sidebarFolderContent.appendChild(loadingSpinner('sidebar-folder-content'));
  }
  let conversations = [];
  let hasMore = false;
  const allFavoriteConvIds = [];
  const allNoteConvIds = [];
  const { settings } = await chrome.storage.local.get(['settings']);

  if (sidebarFolderSearchTerm === '' && lastSelectedConversationFolder?.id === 'archived') {
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
      const loadMoreButton = document.querySelector('#sidebar-folder-drawer #load-more-conversations-button');
      if (loadMoreButton) {
        loadMoreButton.innerHTML = '<div class="w-full h-full flex items-center justify-center">Load more...</div>';
        loadMoreButton.onclick = () => fetchSidebarConversations(pageNumber + 1, fullSearch, forceRefresh);
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
        searchTerm: sidebarFolderSearchTerm,
        sortBy: (sidebarFolderSearchTerm || ['all', 'archived'].includes(lastSelectedConversationFolder?.id)) ? 'updated_at' : sortBy,
        fullSearch,
        folderId: (sidebarFolderSearchTerm || typeof lastSelectedConversationFolder?.id === 'string') ? null : lastSelectedConversationFolder?.id,
        isArchived: lastSelectedConversationFolder?.id === 'archived' ? true : null,
        isFavorite: lastSelectedConversationFolder?.id === 'favorites' ? true : null,
        isTemporary: lastSelectedConversationFolder?.id === 'temporary' ? true : null,
        excludeConvInFolders: lastSelectedConversationFolder?.id === 'all' && excludeConvInFolders,
      },
    });
    conversations = response.results;
    hasMore = response.next;
  }
  const loadMoreButton = document.querySelector('#sidebar-folder-drawer #load-more-conversations-button');
  if (loadMoreButton) loadMoreButton.remove();
  const loadingSpinnerElement = document.querySelector('#sidebar-folder-drawer #loading-spinner-sidebar-folder-content');
  if (loadingSpinnerElement) loadingSpinnerElement.remove();
  if (conversations?.length === 0 && pageNumber === 1) {
    if (sidebarFolderSearchTerm && !fullSearch) {
      const fullSearchButton = createFullSearchButton(true);
      sidebarFolderContent.appendChild(fullSearchButton);
      fullSearchButton.click();
    } else {
      sidebarFolderContent.appendChild(noConversationElement());
    }
  } else {
    conversations.forEach((conversation) => {
      const isFavorite = allFavoriteConvIds.includes(conversation.conversation_id) || conversation.is_favorite;
      const hasNote = allNoteConvIds.includes(conversation.conversation_id) || conversation.has_note;
      const conv = { ...conversation, is_favorite: isFavorite, has_note: hasNote };
      const conversationElement = createConversationElement(conv);
      sidebarFolderContent.appendChild(conversationElement);
      addConversationElementEventListeners(conversationElement, conv);
    });
    if (hasMore) {
      const loadMoreConversationsButton = document.createElement('button');
      loadMoreConversationsButton.id = 'load-more-conversations-button';
      loadMoreConversationsButton.classList = 'flex items-center justify-between text-token-text-primary text-sm relative rounded-lg px-2 py-1 cursor-pointer w-full h-10';
      loadMoreConversationsButton.appendChild(loadingSpinner('load-more-conversations-button'));
      sidebarFolderContent.appendChild(loadMoreConversationsButton);
      loadMoreConversationsButton.onclick = () => fetchSidebarConversations(pageNumber + 1, fullSearch, forceRefresh);
      // add an observer to click the load more button when it is visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchSidebarConversations(pageNumber + 1, fullSearch, forceRefresh);
          }
        });
      }, { threshold: 0.5 });
      if (loadMoreConversationsButton) {
        observer.observe(loadMoreConversationsButton);
      }
    } else if (sidebarFolderSearchTerm && !fullSearch) {
      const fullSearchButton = createFullSearchButton(true);
      sidebarFolderContent.appendChild(fullSearchButton);
    }
  }
}
function createConversationElement(conversation) {
  const lastSelectedConversationFolder = getLastSelectedConversationFolder();

  const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
  const isDefaultFolder = isDefaultConvFolder(lastSelectedConversationFolder?.id);
  const sidebarFolderSearchTerm = document.querySelector('#sidebar-folder-search-input')?.value;

  const conversationElement = document.createElement('div');
  conversationElement.id = `conversation-card-${conversation.conversation_id}`;
  conversationElement.dataset.conversationId = conversation.conversation_id;
  conversationElement.classList = `flex items-center justify-between text-token-text-primary text-sm relative rounded-lg ${conversationIdFromUrl === conversation.conversation_id ? 'bg-token-sidebar-surface-tertiary' : ''} hover:bg-token-sidebar-surface-tertiary px-2 py-1 cursor-pointer group`;
  conversationElement.innerHTML = `
    ${(isDefaultFolder || sidebarFolderSearchTerm) ? `<div id="conversation-card-folder-color-indicator-${conversation.conversation_id}" class="absolute w-1 h-full top-0 left-0 rounded-l-md" style="background-color: ${conversation?.folder?.name ? `${conversation?.folder?.color}` : 'transparent'};"></div>` : ''}

    <div id="conversation-title" class="relative grow overflow-hidden whitespace-nowrap">${conversation.title || 'New chat'}</div>

    <div id="conversation-card-settings-menu-${conversation.conversation_id}" class="relative items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md hidden group-hover:flex items-center justify-center h-full"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z" fill="currentColor"></path></svg>
    </div>
  `;
  conversationElement.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    updateSelectedConvCard(conversation.conversation_id);
    const conversationElementInHistory = document.querySelector(`nav li a[href$="${conversation.conversation_id}"]`);
    const curSidebarFolderSearchTerm = document.querySelector('#sidebar-folder-search-input')?.value;
    if (conversationElementInHistory && !curSidebarFolderSearchTerm) {
      conversationElementInHistory.click();
    } else {
      showConversationPreviewWrapper(conversation.conversation_id, null, true);
    }
  });
  conversationElement.addEventListener('mouseenter', () => {
    closeMenus();
  });
  return conversationElement;
}
function addConversationElementEventListeners(conversationElement, conversation) {
  addConversationCardEventListeners(conversationElement, conversation, true);
}
function toggleSidebarFolder() {
  closeSidebarNote();
  const main = document.querySelector('main');
  const presentation = main.querySelector('main div[role=presentation]');
  if (!presentation) return;
  presentation.classList.remove('flex-1');

  const floatingButtonWrapper = document.querySelector('#floating-button-wrapper');

  const sidebarFolderDrawer = document.querySelector('#sidebar-folder-drawer');
  if (!sidebarFolderDrawer) {
    addSidebarFolderDrawer();
  }
  if (sidebarFolderIsOpen()) {
    sidebarFolderDrawer.style.width = '0';
    window.localStorage.setItem('sp/sidebarFolderIsOpen', 'false');
    presentation.style.width = '100%';
    if (floatingButtonWrapper) floatingButtonWrapper.style.right = '3rem';
  } else {
    window.localStorage.setItem('sp/sidebarFolderIsOpen', 'true');
    // sidebarFolderDrawer.style.width = `${sidebarFolderDrawerWidth}px`;
    sidebarFolderDrawer.style.width = `${sidebarFolderDrawerWidth}px`;
    presentation.style.width = `calc(100% - ${sidebarFolderDrawerWidth}px)`;
    if (floatingButtonWrapper) floatingButtonWrapper.style.right = `calc(1rem + ${sidebarFolderDrawerWidth}px)`;
  }
}
// eslint-disable-next-line no-unused-vars
function closeSidebarFolder() {
  const sidebarFolderDrawer = document.querySelector('#sidebar-folder-drawer');
  if (sidebarFolderDrawer) sidebarFolderDrawer.style.width = '0';
  window.localStorage.setItem('sp/sidebarFolderIsOpen', 'false');
}
function addSidebarFolderButton() {
  const existingSidebarFolderButton = document.querySelector('#sidebar-folder-button');
  if (existingSidebarFolderButton) existingSidebarFolderButton.remove();

  const sidebarFolderButton = document.createElement('button');
  sidebarFolderButton.id = 'sidebar-folder-button';
  sidebarFolderButton.innerHTML = translate('Folders');
  sidebarFolderButton.classList = 'absolute flex items-center justify-center border border-token-border-light text-token-text-secondary hover:border-token-border-heavy hover:text-token-text-primary text-xs font-sans cursor-pointer rounded-t-md z-10 bg-token-main-surface-primary opacity-85 hover:opacity-100';
  sidebarFolderButton.style = 'top: 16rem;right: -1rem;width: 4rem;height: 2rem;flex-wrap:wrap;transform: rotate(-90deg);';
  sidebarFolderButton.addEventListener('click', () => {
    toggleSidebarFolder();
  });
  document.body.appendChild(sidebarFolderButton);
}
function addSidebarFolderDrawer() {
  const sidebarFolderDrawer = document.createElement('div');
  sidebarFolderDrawer.id = 'sidebar-folder-drawer';
  sidebarFolderDrawer.classList = 'absolute right-0 w-0 top-0 overflow-hidden transition transition-width z-10 flex flex-col h-full bg-token-sidebar-surface-primary';

  const sidebarFolderHeader = document.createElement('div');
  sidebarFolderHeader.classList = 'w-full p-3 flex justify-between items-center';

  const searchInput = document.createElement('input');
  searchInput.id = 'sidebar-folder-search-input';
  searchInput.type = 'search';
  searchInput.placeholder = translate('Search conversations');
  searchInput.classList = 'w-full p-2 rounded-md border border-token-border-light bg-token-main-surface-secondary text-token-text-secondary';
  const delayedSearch = debounce(() => {
    fetchSidebarConversations();
  });
  searchInput.addEventListener('input', (e) => {
    if (e.target.value.trim().length > 2) {
      delayedSearch(e);
    } else if (e.target.value.length === 0) {
      loadSidebarFolders();
    }
  });
  sidebarFolderHeader.appendChild(searchInput);
  // new folder button
  const newFolderButton = document.createElement('button');
  newFolderButton.id = 'sidebar-new-folder-button';
  newFolderButton.title = 'Add New Folder';
  newFolderButton.classList = 'flex items-center justify-cnter h-full rounded-lg p-2 ml-2 text-token-text-secondary focus-visible:outline-0 hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary';
  newFolderButton.innerHTML = '<svg stroke="currentColor" fill="currentColor" class="icon-lg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 96h-192l-64-64h-160C21.5 32 0 53.5 0 80v352C0 458.5 21.5 480 48 480h416c26.5 0 48-21.5 48-48v-288C512 117.5 490.5 96 464 96zM336 311.1h-56v56C279.1 381.3 269.3 392 256 392c-13.27 0-23.1-10.74-23.1-23.1V311.1H175.1C162.7 311.1 152 301.3 152 288c0-13.26 10.74-23.1 23.1-23.1h56V207.1C232 194.7 242.7 184 256 184s23.1 10.74 23.1 23.1V264h56C349.3 264 360 274.7 360 288S349.3 311.1 336 311.1z"/></svg>';
  chrome.runtime.sendMessage({
    type: 'checkHasSubscription',
  }, (hasSubscription) => {
    newFolderButton.addEventListener('click', () => {
      document.querySelector('#sidebar-folder-drawer #folder-breadcrubmb-root')?.click();
      const userFolders = document.querySelectorAll('#sidebar-folder-drawer #sidebar-folder-content > div[id^="conversation-folder-wrapper-"]');
      if (!hasSubscription && userFolders.length >= 5) {
        const error = { type: 'limit', title: 'You have reached the limit', message: 'You have reached the limits of Conversation Folders with free account. Upgrade to Pro to remove all limits.' };
        errorUpgradeConfirmation(error);
        return;
      }
      const noConversationFolders = document.querySelectorAll('#no-conversation-folders');
      noConversationFolders.forEach((el) => el.remove());
      const lastSelectedConversationFolder = getLastSelectedConversationFolder();
      const newFolder = {
        name: 'New Folder',
        color: generateRandomDarkColor(),
      };
      if (lastSelectedConversationFolder) {
        newFolder.color = lastSelectedConversationFolder.color;
        newFolder.parent_folder = lastSelectedConversationFolder.id;
      }
      chrome.runtime.sendMessage({
        type: 'addConversationFolders',
        detail: {
          folders: [newFolder],
        },
      }, (newConversationFolders) => {
        if (newConversationFolders.error && newConversationFolders.error.type === 'limit') {
          errorUpgradeConfirmation(newConversationFolders.error);
          return;
        }
        if (!newConversationFolders || newConversationFolders.length === 0) return;
        addNewFolderElementToSidebar(newConversationFolders[0]);

        // rename new folder
        handleRenameConversationFolderClick(newConversationFolders[0].id, true);
      });
    });
  });
  sidebarFolderHeader.appendChild(newFolderButton);

  sidebarFolderDrawer.appendChild(sidebarFolderHeader);

  // breadcrumb
  const breadcrumbWrapper = document.createElement('div');
  breadcrumbWrapper.classList = 'flex items-center justify-start p-3 w-full';

  const breadcrumb = document.createElement('div');
  breadcrumb.id = 'sidebar-folder-breadcrumb';
  breadcrumb.classList = 'flex flex-wrap items-center justify-start bg-token-main-surface-secondary p-2 rounded-lg border border-token-border-light w-full';
  breadcrumb.addEventListener('click', (event) => {
    // Check if the clicked element is a breadcrumb item.
    if (event.target && event.target.matches('[data-folder-id]')) {
      const folderId = event.target.getAttribute('data-folder-id');
      if (folderId === 'root') {
        if (selectedConversationFolderBreadcrumb.length === 0) return;
        selectedConversationFolderBreadcrumb = [];
        chrome.storage.local.set({ selectedConversationFolderBreadcrumb });
        generateConvFolderBreadcrumb(breadcrumb, true);
        loadSidebarFolders();
        return;
      }
      // Find the clicked folder in the breadcrumb list.
      const folderIndex = selectedConversationFolderBreadcrumb.findIndex((f) => f.id.toString() === folderId.toString());
      if (folderIndex !== -1 && (folderIndex < selectedConversationFolderBreadcrumb.length - 1 || event.shiftKey)) {
        selectedConversationFolderBreadcrumb = selectedConversationFolderBreadcrumb.slice(0, folderIndex + 1);
        chrome.storage.local.set({ selectedConversationFolderBreadcrumb });
        generateConvFolderBreadcrumb(breadcrumb, true);
        getSubFolders(folderId, event.shiftKey);
        fetchSidebarConversations(1, false, event.shiftKey);
      }
    }
  });
  breadcrumbWrapper.appendChild(breadcrumb);
  sidebarFolderDrawer.appendChild(breadcrumbWrapper);

  // folder content
  const sidebarFolderContent = document.createElement('div');
  sidebarFolderContent.id = 'sidebar-folder-content';
  sidebarFolderContent.classList = 'relative p-3 pb-64 overflow-y-auto min-w-full h-full';
  sidebarFolderContent.appendChild(loadingSpinner('sidebar-folder-content'));
  sidebarFolderDrawer.appendChild(sidebarFolderContent);

  const main = document.querySelector('main');
  if (!main) return;
  const existingSidebarFolderDrawer = main.querySelector('#sidebar-folder-drawer');
  if (existingSidebarFolderDrawer) return;
  main.appendChild(sidebarFolderDrawer);

  const presentation = main.querySelector('main div[role=presentation]');
  if (!presentation) return;
  presentation.classList.remove('flex-1');

  const floatingButtonWrapper = document.querySelector('#floating-button-wrapper');

  if (sidebarFolderIsOpen()) {
    // sidebarFolderDrawer.style.width = `${sidebarFolderDrawerWidth}px`;
    sidebarFolderDrawer.style.width = `${sidebarFolderDrawerWidth}px`;
    presentation.style.width = `calc(100% - ${sidebarFolderDrawerWidth}px)`;
    if (floatingButtonWrapper) floatingButtonWrapper.style.right = `calc(1rem + ${sidebarFolderDrawerWidth}px)`;
  } else if (!sidebarNoteIsOpen) {
    sidebarFolderDrawer.style.width = '0';
    presentation.style.width = '100%';
    if (floatingButtonWrapper) floatingButtonWrapper.style.right = '3rem';
  }
  generateConvFolderBreadcrumb(breadcrumb, true);
}

function addNewFolderElementToSidebar(folder) {
  const defaultConversationFolders = document.querySelector('#sidebar-folder-content #default-conversation-folders');
  // add after default folders
  if (defaultConversationFolders) {
    defaultConversationFolders.after(conversationFolderElement(folder, true));
  } else {
    const sidebarFolderContent = document.querySelector('#sidebar-folder-content');
    sidebarFolderContent.prepend(conversationFolderElement(folder, true));
  }
  // scroll element into view
  const newFolderElement = document.querySelector(`#sidebar-folder-content #conversation-folder-wrapper-${folder.id}`);
  newFolderElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
}
// eslint-disable-next-line no-unused-vars
function addConversationtoSidebarFolder(conversation) {
  const lastSelectedConversationFolder = getLastSelectedConversationFolder();

  // create conversation element and add it to the top of the conversation list if looking at the all conversations folder
  if (lastSelectedConversationFolder?.id !== 'all') return;
  const sidebarFolderContent = document.querySelector('#sidebar-folder-content');
  if (!sidebarFolderContent) return;
  const conversationElement = createConversationElement(conversation);

  sidebarFolderContent.prepend(conversationElement);
}
// eslint-disable-next-line no-unused-vars
function showSidebarFolderButton(url = window.location) {
  // check if on /gpts
  const onGPTs = url.pathname.includes('/gpts');
  const onAdmin = url.pathname.includes('/admin');

  const sidebarFolderButton = document.querySelector('#sidebar-folder-button');
  if (sidebarFolderButton) {
    sidebarFolderButton.classList.remove('hidden');
  } else {
    addSidebarFolderButton();
  }
  const sidebarFolderDrawer = document.querySelector('#sidebar-folder-drawer');
  if (!sidebarFolderDrawer) {
    addSidebarFolderDrawer();
  }
  if (onGPTs || onAdmin) {
    const curSidebarFolderButton = document.querySelector('#sidebar-folder-button');
    curSidebarFolderButton.classList.add('hidden');
    const floatingButtonWrapper = document.querySelector('#floating-button-wrapper');
    if (floatingButtonWrapper) floatingButtonWrapper.style.right = '3rem';
  } else {
    loadSidebarFolders();
  }
}
