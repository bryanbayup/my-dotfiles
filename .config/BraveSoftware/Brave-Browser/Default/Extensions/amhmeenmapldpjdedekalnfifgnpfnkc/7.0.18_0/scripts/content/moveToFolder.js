/* global isDescendant, toast, closeMenus, generateRandomDarkColor, errorUpgradeConfirmation, translate, updateConversationFolderCount, addNewFolderElementToSidebar, getLastSelectedConversationFolder, resetConversationManagerSelection, isDefaultConvFolder, updateFolderIndicators, fetchSidebarConversations */

/* eslint-disable no-unused-vars */
async function openMoveToFolderModal(conversationIds) {
  const conversationFolders = await chrome.runtime.sendMessage({
    type: 'getConversationFolders',
    detail: {
      sortBy: 'alphabetical',
    },
  });

  const moveToFolderModal = `<div id="move-to-folder-modal" class="absolute inset-0" style="z-index: 10000;"><div data-state="open" class="fixed inset-0 bg-black/50 dark:bg-black/80" style="pointer-events: auto;"><div class="grid-cols-[10px_1fr_10px] grid h-full w-full grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)] overflow-y-auto"><div id="move-to-folder-content" role="dialog" aria-describedby="radix-:r3o:" aria-labelledby="radix-:r3n:" data-state="open" class="relative col-auto col-start-2 row-auto row-start-2 w-full rounded-xl text-left shadow-xl transition-all left-1/2 -translate-x-1/2 bg-token-main-surface-primary max-w-lg" tabindex="-1" style="pointer-events: auto;"><div class="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-token-border-light"><div class="flex"><div class="flex items-center"><div class="flex grow flex-col gap-1"><h2 as="h3" class="text-lg font-medium leading-6 text-token-text-primary">${translate('Select a folder')}</h2></div></div></div><div class="flex items-center"><button id="move-to-folder-new-folder" class="btn flex justify-center gap-2 btn-primary mr-2 border" data-default="true" style="min-width: 72px; height: 34px;">${translate('New Folder')}</button><button id="move-to-folder-close-button" class="text-token-text-secondary hover:text-token-text-primary transition"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div></div><div id="move-to-folder-list" class="p-4 sm:p-6 overflow-y-auto" style="max-height:500px;" >${conversationFolders.length > 0 ? conversationFolders.map((folder) => simpleFolderElement(folder)).join('') : '<div class="text-sm text-token-text-secondary">You currently don\'t have any folders. Try making folders first.</div>'}</div></div></div></div></div>`;
  document.body.insertAdjacentHTML('beforeend', moveToFolderModal);
  addMoveToFolderModalEventListener(conversationIds);
}
function simpleFolderElement(folder) {
  return `<div id="move-to-folder-wrapper-folder-${folder.id}" class="flex w-full mb-2 group" style="flex-wrap: wrap;"><div id="folder-${folder.id}" class="flex py-3 px-3 pr-3 w-full border border-token-border-heavy items-center gap-3 relative rounded-md cursor-pointer break-all hover:pr-10 group" title="${folder.name}" style="background-color: ${folder.color};"><img class="w-6 h-6 object-cover rounded-md" src="${folder.image ? folder.image : chrome.runtime.getURL('icons/folder.png')}" style="filter:drop-shadow(0px 0px 1px black);" data-is-open="false"><div id="title-folder-${folder.id}" class="flex-1 text-ellipsis max-h-5 overflow-hidden whitespace-nowrap break-all relative text-token-text-primary relative" style="bottom: 6px;">${folder.name}</div><div id="folder-actions-wrapper-${folder.id}" class="absolute flex right-1 z-10 text-gray-300"><button id="move-to-folder-button-${folder.id}" class="btn btn-xs btn-primary group-hover:visible invisible" title="Move to folder">Add to this folder</button></div><div id="count-folder-${folder.id}" style="color:white; font-size: 10px; position: absolute; left: 50px; bottom: 2px; display: block;">${folder.conversation_count} chats</div></div></div>`;
}
function addMoveToFolderModalEventListener(conversationIds) {
  const folderWrappers = document.querySelectorAll('[id^=move-to-folder-wrapper-folder-]');
  folderWrappers.forEach((folderWrapper) => {
    folderWrapper.addEventListener('click', () => {
      // openFolder(folderWrapper, conversationIds);
    });
  });
  const moveToFolderButtons = document.querySelectorAll('button[id^=move-to-folder-button-]');
  moveToFolderButtons.forEach((moveToFolderButton) => {
    const toFolderId = moveToFolderButton.id.split('move-to-folder-button-')[1];
    const toFolderName = document.querySelector(`#title-folder-${toFolderId}`).textContent;
    const toFolderColor = document.querySelector(`#folder-${toFolderId}`).style.backgroundColor;
    moveToFolderButton.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      moveToFolder(conversationIds, toFolderId, toFolderName, toFolderColor);
      toast('Conversation moved to folder');
      const moveToFolderModal = document.querySelector('#move-to-folder-modal');
      moveToFolderModal?.remove();
    });
  });

  const newFolderButton = document.querySelector('#move-to-folder-new-folder');
  newFolderButton.addEventListener('click', async () => {
    const hasSubscription = await chrome.runtime.sendMessage({
      type: 'checkHasSubscription',
    });
    const currentFolders = document.querySelectorAll('#conversation-list > [id^=wrapper-folder-]');
    if (!hasSubscription && currentFolders.length >= 5) {
      const error = { type: 'limit', title: 'You have reached the limit', message: 'You have reached the limits of Folders with free account. Upgrade to Pro to remove all limits.' };
      errorUpgradeConfirmation(error);
      return;
    }
    const noConversationFolders = document.querySelectorAll('#no-conversation-folders');
    noConversationFolders.forEach((el) => el.remove());
    const newConversationFolders = await chrome.runtime.sendMessage({
      type: 'addConversationFolders',
      detail: {
        folders: [{
          name: 'New Folder',
          color: generateRandomDarkColor(),
        }],
      },
    });
    if (newConversationFolders.error && newConversationFolders.error.type === 'limit') {
      errorUpgradeConfirmation(newConversationFolders.error);
      return;
    }

    const moveToFolderList = document.querySelector('#move-to-folder-list');
    moveToFolderList.insertAdjacentHTML('afterbegin', simpleFolderElement(newConversationFolders[0]));
    const folderWrapper = document.querySelector(`#move-to-folder-wrapper-folder-${newConversationFolders[0].id}`);
    folderWrapper.addEventListener('click', () => {
      openFolder(folderWrapper, conversationIds);
    });
    const moveToFolderButton = document.querySelector(`#move-to-folder-button-${newConversationFolders[0].id}`);
    moveToFolderButton.addEventListener('click', () => {
      moveToFolder(conversationIds, newConversationFolders[0].id, newConversationFolders[0].name, newConversationFolders[0].color);
      toast('Conversation moved to folder');
      const moveToFolderModal = document.querySelector('#move-to-folder-modal');
      moveToFolderModal?.remove();
    });
    addNewFolderElementToSidebar(newConversationFolders[0]);
  });
  const moveToFolderCloseButton = document.querySelector('#move-to-folder-close-button');
  moveToFolderCloseButton.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    closeMenus();
    const moveToFolderModal = document.querySelector('#move-to-folder-modal');
    moveToFolderModal?.remove();
  });
  // close modal when clicked outside
  document.body.addEventListener('click', (e) => {
    const moveToFolderModal = document.querySelector('#move-to-folder-modal');
    const moveToFolderContent = document.querySelector('#move-to-folder-content');
    if (moveToFolderContent && !isDescendant(moveToFolderContent, e.target)) {
      moveToFolderModal.remove();
    }
  });
}
function openFolder(folderWrapper, conversationIds) {
  // if next elemnt is a subfolder wrapper, then hide it
  const folderId = folderWrapper.id.split('move-to-folder-wrapper-folder-')[1];
  const nextElement = folderWrapper.nextElementSibling;
  if (nextElement && nextElement.id === `subfolder-wrapper-${folderId}`) {
    if (nextElement.classList.contains('hidden')) {
      nextElement.classList.remove('hidden');
    } else {
      nextElement.classList.add('hidden');
    }
    return;
  }
  // if next elemnt is not a subfolder wrapper, then add it and load subfolders
  const subfolderWrapper = document.createElement('div');
  subfolderWrapper.id = `subfolder-wrapper-${folderId}`;
  subfolderWrapper.classList = 'pl-4 border-l border-token-border-heavy';
  folderWrapper.insertAdjacentElement('afterend', subfolderWrapper);
  const subfolderList = document.createElement('div');
  subfolderList.classList = 'flex flex-col mb-4';
  subfolderWrapper.appendChild(subfolderList);
  chrome.runtime.sendMessage({
    type: 'getConversationFolders',
    detail: {
      sortBy: 'alphabetical',
      parentFolderId: folderId,
    },
  }, (conversationFolders) => {
    if (!conversationFolders) return;
    if (!Array.isArray(conversationFolders)) return;
    if (conversationFolders.length > 0) {
      conversationFolders?.forEach((subfolder) => {
        subfolderList.insertAdjacentHTML('beforeend', simpleFolderElement(subfolder));
        const curSubfolderWrapper = document.querySelector(`#move-to-folder-wrapper-folder-${subfolder.id}`);
        curSubfolderWrapper?.addEventListener('click', () => {
          openFolder(curSubfolderWrapper, conversationIds);
        });
        const moveToFolderButton = document.querySelector(`#move-to-folder-button-${subfolder.id}`);
        moveToFolderButton.addEventListener('click', () => {
          moveToFolder(conversationIds, subfolder.id, subfolder.name, subfolder.color);
          toast('Conversation moved to folder');
          const moveToFolderModal = document.querySelector('#move-to-folder-modal');
          moveToFolderModal?.remove();
        });
      });
    } else {
      subfolderList.insertAdjacentHTML('beforeend', '<div class="text-sm text-token-text-secondary">No subfolders</div>');
    }
  });
}
async function moveToFolder(conversationIds, toFolderId, toFolderName, toFolderColor) {
  const lastSelectedConversationFolder = getLastSelectedConversationFolder();
  updateConversationFolderCount(lastSelectedConversationFolder?.id, toFolderId, conversationIds.length);

  if (lastSelectedConversationFolder?.id !== toFolderId && lastSelectedConversationFolder?.id !== 'all') {
    conversationIds.forEach((conversationId) => {
      const conversationElement = document.querySelector(`#conversation-card-${conversationId}`);
      if (conversationElement) {
        conversationElement.remove();
      }
    });
  } else {
    // update sidebar conv indicator
    conversationIds.forEach((conversationId) => {
      const conversationCardFolderColorIndicator = document.querySelector(`#sidebar-conversation-list #conversation-card-folder-color-indicator-${conversationId}`);
      if (conversationCardFolderColorIndicator) {
        conversationCardFolderColorIndicator.style.backgroundColor = toFolderColor;
      }
    });
  }
  // conversation manager changes
  // remove the conversations from the list
  if (document.querySelector('#modal-manager')) {
    const curLastSelectedConversationFolder = getLastSelectedConversationFolder();
    conversationIds.forEach((conversationId) => {
      const conversationCard = document.querySelector(`#modal-manager [data-conversation-id="${conversationId}"]`);
      if (!conversationCard) return;
      conversationCard.dataset.folderId = toFolderId;
      if (!isDefaultConvFolder(curLastSelectedConversationFolder?.id?.toString())) {
        if (conversationCard) conversationCard.remove();
      } else {
        // uncheck the conversation
        const conversationCheckbox = document.querySelector(`#modal-manager #conversation-checkbox-${conversationId}`);
        if (conversationCheckbox) conversationCheckbox.checked = false;
      }
    });
    resetConversationManagerSelection();
    if (curLastSelectedConversationFolder?.id === 'all') {
      updateFolderIndicators(toFolderId, { name: toFolderName, color: toFolderColor });
    }
  }
  chrome.runtime.sendMessage({
    type: 'moveConversationIdsToFolder',
    detail: {
      folderId: parseInt(toFolderId, 10),
      conversationIds,
    },
  }, () => {
    fetchSidebarConversations(1, false, false);
  });
}
