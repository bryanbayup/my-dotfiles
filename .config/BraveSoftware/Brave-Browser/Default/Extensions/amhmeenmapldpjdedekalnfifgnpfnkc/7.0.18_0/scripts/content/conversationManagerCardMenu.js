/* global handleDeleteConversation, shareConversation, buttonGenerator, errorUpgradeConfirmation, downloadSelectedImages, openNotePreviewModal, openExportModal, showConversationPreviewWrapper, translate, handleClickMoveConversationsButton, closeMenus, renameConversation, renameConversationElements, openMoveToFolderModal */
// eslint-disable-next-line no-unused-vars
function showConversationManagerCardMenu(conversationSettingsElement, conversation, leftMenu, sidebarFolder = false) {
  const conversationId = conversation.conversation_id;
  const navbarMenu = conversationSettingsElement.id === 'navbar-conversation-menu-button';
  const menu = `<div data-radix-popper-content-wrapper="" id="conversation-card-menu" dir="ltr" style="z-index:10;${leftMenu ? 'transform: translate(calc(-100% - 36px), 0px);' : ''} position:absolute;left:100%;top:0;min-width:max-content;--radix-popper-anchor-width:18px;--radix-popper-anchor-height:18px;--radix-popper-available-width:1167px;--radix-popper-available-height:604px;--radix-popper-transform-origin:0% 0px"><div data-side="bottom" data-align="start" role="menu" aria-orientation="vertical" data-state="open" data-radix-menu-content="" dir="ltr" aria-labelledby="radix-:r6g:" class="max-w-xs rounded-lg border text-token-text-primary border-token-border-light bg-token-main-surface-primary shadow-lg" tabindex="-1" data-orientation="vertical" style="min-width:200px; outline:0;--radix-dropdown-menu-content-transform-origin:var(--radix-popper-transform-origin);--radix-dropdown-menu-content-available-width:var(--radix-popper-available-width);--radix-dropdown-menu-content-available-height:var(--radix-popper-available-height);--radix-dropdown-menu-trigger-width:var(--radix-popper-anchor-width);--radix-dropdown-menu-trigger-height:var(--radix-popper-anchor-height);pointer-events:auto">
  ${navbarMenu ? ''
    : `<div role="menuitem" id="preview-conversation-card-button-${conversationId}" title="SHIFT + Click on the card" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" class="icon-md"><path d="M160 256C160 185.3 217.3 128 288 128C358.7 128 416 185.3 416 256C416 326.7 358.7 384 288 384C217.3 384 160 326.7 160 256zM288 336C332.2 336 368 300.2 368 256C368 211.8 332.2 176 288 176C287.3 176 286.7 176 285.1 176C287.3 181.1 288 186.5 288 192C288 227.3 259.3 256 224 256C218.5 256 213.1 255.3 208 253.1C208 254.7 208 255.3 208 255.1C208 300.2 243.8 336 288 336L288 336zM95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6V112.6zM288 80C222.8 80 169.2 109.6 128.1 147.7C89.6 183.5 63.02 225.1 49.44 256C63.02 286 89.6 328.5 128.1 364.3C169.2 402.4 222.8 432 288 432C353.2 432 406.8 402.4 447.9 364.3C486.4 328.5 512.1 286 526.6 256C512.1 225.1 486.4 183.5 447.9 147.7C406.8 109.6 353.2 80 288 80V80z"/></svg>${translate('Preview')}</div>
    
    <div role="menuitem" id="open-conversation-card-button-${conversationId}" title="CMD/CTRL + Click on the card" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="icon-md"><path d="M488 0h-135.3c-13.25 0-25.09 7.906-30.19 20.16c-5.062 12.28-2.281 26.25 7.094 35.63l40.69 40.69L177.4 289.4c-12.5 12.5-12.5 32.75 0 45.25C183.6 340.9 191.8 344 200 344s16.38-3.125 22.62-9.375l192.9-192.9l40.69 40.69C462.5 188.7 470.8 192 479.3 192c4.219 0 8.469-.8125 12.56-2.5C504.1 184.4 512 172.6 512 159.3V24C512 10.75 501.3 0 488 0zM392 320c-13.25 0-24 10.75-24 24v112c0 4.406-3.594 8-8 8h-304c-4.406 0-8-3.594-8-8v-304c0-4.406 3.594-8 8-8h112C181.3 144 192 133.3 192 120S181.3 96 168 96h-112C25.13 96 0 121.1 0 152v304C0 486.9 25.13 512 56 512h304c30.88 0 56-25.12 56-56v-112C416 330.8 405.3 320 392 320z"/></svg>${translate('Open')}<span class='ml-auto'>${buttonGenerator(['⌘', 'Click'], 'xs')}</span></div>
    
    <div role="menuitem" id="rename-conversation-card-button-${conversationId}" class="flex items-center justify-between gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><div class="flex gap-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4783 6.06414 21.4783 8.93588 19.7071 10.7071L18.7073 11.7069L11.1603 19.2539C10.7182 19.696 10.1489 19.989 9.53219 20.0918L4.1644 20.9864C3.84584 21.0395 3.52125 20.9355 3.29289 20.7071C3.06453 20.4788 2.96051 20.1542 3.0136 19.8356L3.90824 14.4678C4.01103 13.8511 4.30396 13.2818 4.7461 12.8397L13.2929 4.29291ZM13 7.41422L6.16031 14.2539C6.01293 14.4013 5.91529 14.591 5.88102 14.7966L5.21655 18.7835L9.20339 18.119C9.40898 18.0847 9.59872 17.9871 9.7461 17.8397L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693 18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z" fill="currentColor"></path></svg>${translate('Rename')}</div> </div>
  `}


  <div role="menuitem" id="share-conversation-card-button-${conversationId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" xmlns="http://www.w3.org/2000/svg"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>${translate('Share')}</div>

  <div role="menuitem" id="move-conversation-card-button-${conversationId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" class="icon-md" stroke-width="2" viewBox="0 0 512 512"><path d="M448 96h-172.1L226.7 50.75C214.7 38.74 198.5 32 181.5 32H64C28.66 32 0 60.66 0 96v320c0 35.34 28.66 64 64 64h384c35.34 0 64-28.66 64-64V160C512 124.7 483.3 96 448 96zM464 416c0 8.824-7.18 16-16 16H64c-8.82 0-16-7.176-16-16V96c0-8.824 7.18-16 16-16h117.5c4.273 0 8.289 1.664 11.31 4.688L256 144h192c8.82 0 16 7.176 16 16V416zM336 264h-56V207.1C279.1 194.7 269.3 184 256 184S232 194.7 232 207.1V264H175.1C162.7 264 152 274.7 152 288c0 13.26 10.73 23.1 23.1 23.1h56v56C232 381.3 242.7 392 256 392c13.26 0 23.1-10.74 23.1-23.1V311.1h56C349.3 311.1 360 301.3 360 288S349.3 264 336 264z"/></svg>${translate('Move')}</div>

  <div role="menuitem" id="export-conversation-card-button-${conversationId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round" class="icon-md"><path d="M568.1 303l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 296H216C202.8 296 192 306.8 192 320s10.75 24 24 24h278.1l-39.03 39.03C450.3 387.7 448 393.8 448 400s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 327.6 578.3 312.4 568.1 303zM360 384c-13.25 0-24 10.74-24 24V448c0 8.836-7.164 16-16 16H64.02c-8.836 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1v72c0 13.25 10.74 24 23.1 24S384 245.3 384 232V138.6c0-16.98-6.742-33.26-18.75-45.26l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H63.1C28.65 0-.002 28.66 0 64l.0065 384c.002 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64v-40C384 394.7 373.3 384 360 384z"/></svg>${translate('Export')}</div>

  <div role="menuitem" id="edit-note-conversation-card-button-${conversationId}" class="flex items-center justify-between gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><div class="flex gap-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.2929 4.29291C15.0641 2.52167 17.9359 2.52167 19.7071 4.2929C21.4783 6.06414 21.4783 8.93588 19.7071 10.7071L18.7073 11.7069L11.1603 19.2539C10.7182 19.696 10.1489 19.989 9.53219 20.0918L4.1644 20.9864C3.84584 21.0395 3.52125 20.9355 3.29289 20.7071C3.06453 20.4788 2.96051 20.1542 3.0136 19.8356L3.90824 14.4678C4.01103 13.8511 4.30396 13.2818 4.7461 12.8397L13.2929 4.29291ZM13 7.41422L6.16031 14.2539C6.01293 14.4013 5.91529 14.591 5.88102 14.7966L5.21655 18.7835L9.20339 18.119C9.40898 18.0847 9.59872 17.9871 9.7461 17.8397L16.5858 11L13 7.41422ZM18 9.5858L14.4142 6.00001L14.7071 5.70712C15.6973 4.71693 17.3027 4.71693 18.2929 5.70712C19.2831 6.69731 19.2831 8.30272 18.2929 9.29291L18 9.5858Z" fill="currentColor"></path></svg>${translate('Edit note')}</div> <span class="text-white rounded-md bg-green-500 px-2 text-sm">Pro</span></div>
  
  <div role="menuitem" id="download-images-conversation-card-button-${conversationId}" class="flex items-center justify-between gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><div class="flex gap-2"><svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 10.2929C7.31658 9.90237 6.68342 9.90237 6.29289 10.2929C5.90237 10.6834 5.90237 11.3166 6.29289 11.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L17.7071 11.7071C18.0976 11.3166 18.0976 10.6834 17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929L13 13.5858L13 4C13 3.44771 12.5523 3 12 3C11.4477 3 11 3.44771 11 4L11 13.5858L7.70711 10.2929ZM5 19C4.44772 19 4 19.4477 4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19L5 19Z" fill="currentColor"></path></svg>${translate('Download images')}</div> <span class="text-white rounded-md bg-green-500 px-2 text-sm">Pro</span></div>

  <div role="menuitem" id="delete-conversation-card-button-${conversationId}" class="flex gap-2 m-1.5 rounded p-2.5 text-sm cursor-pointer focus:ring-0 hover:bg-token-main-surface-secondary radix-disabled:pointer-events-none radix-disabled:opacity-50 group text-red-500" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-md"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5555 4C10.099 4 9.70052 4.30906 9.58693 4.75114L9.29382 5.8919H14.715L14.4219 4.75114C14.3083 4.30906 13.9098 4 13.4533 4H10.5555ZM16.7799 5.8919L16.3589 4.25342C16.0182 2.92719 14.8226 2 13.4533 2H10.5555C9.18616 2 7.99062 2.92719 7.64985 4.25342L7.22886 5.8919H4C3.44772 5.8919 3 6.33961 3 6.8919C3 7.44418 3.44772 7.8919 4 7.8919H4.10069L5.31544 19.3172C5.47763 20.8427 6.76455 22 8.29863 22H15.7014C17.2354 22 18.5224 20.8427 18.6846 19.3172L19.8993 7.8919H20C20.5523 7.8919 21 7.44418 21 6.8919C21 6.33961 20.5523 5.8919 20 5.8919H16.7799ZM17.888 7.8919H6.11196L7.30423 19.1057C7.3583 19.6142 7.78727 20 8.29863 20H15.7014C16.2127 20 16.6417 19.6142 16.6958 19.1057L17.888 7.8919ZM10 10C10.5523 10 11 10.4477 11 11V16C11 16.5523 10.5523 17 10 17C9.44772 17 9 16.5523 9 16V11C9 10.4477 9.44772 10 10 10ZM14 10C14.5523 10 15 10.4477 15 11V16C15 16.5523 14.5523 17 14 17C13.4477 17 13 16.5523 13 16V11C13 10.4477 13.4477 10 14 10Z" fill="currentColor"></path></svg>${translate('Delete')}</div></div></div>`;
  conversationSettingsElement.insertAdjacentHTML('beforeend', menu);
  addConversationManagerCardMenuEventListeners(conversation, sidebarFolder);
}
function addConversationManagerCardMenuEventListeners(conversation, sidebarFolder = false) {
  const conversationId = conversation.conversation_id;
  const previewConversationCardButton = document.querySelector(`#preview-conversation-card-button-${conversationId}`);
  const openConversationCardButton = document.querySelector(`#open-conversation-card-button-${conversationId}`);
  const renameConversationCardButton = document.querySelector(`#rename-conversation-card-button-${conversationId}`);
  const shareConversationCardButton = document.querySelector(`#share-conversation-card-button-${conversationId}`);
  const moveConversationCardButton = document.querySelector(`#move-conversation-card-button-${conversationId}`);
  const exportConversationCardButton = document.querySelector(`#export-conversation-card-button-${conversationId}`);
  const editNoteConversationCardButton = document.querySelector(`#edit-note-conversation-card-button-${conversationId}`);
  const downloadImagesConversationCardButton = document.querySelector(`#download-images-conversation-card-button-${conversationId}`);
  const deleteConversationCardButton = document.querySelector(`#delete-conversation-card-button-${conversationId}`);

  previewConversationCardButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    showConversationPreviewWrapper(conversation.conversation_id);
  });
  openConversationCardButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    window.open(`/c/${conversationId}`, '_blank');
  });
  renameConversationCardButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    handleRenameConversationClick(conversation.conversation_id, sidebarFolder);
  });
  shareConversationCardButton?.addEventListener('click', async (e) => {
    e.stopPropagation();
    closeMenus();
    shareConversation(conversationId);
  });
  moveConversationCardButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    if (sidebarFolder) {
      openMoveToFolderModal([conversationId]);
    } else {
      // click on card checkbox
      const conversationCardCheckbox = document.querySelector(`#conversation-checkbox-${conversationId}`);
      if (conversationCardCheckbox && !conversationCardCheckbox.checked) {
        conversationCardCheckbox.click();
      }
      setTimeout(() => handleClickMoveConversationsButton(), 100);
    }
  });
  exportConversationCardButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    openExportModal([conversation.conversation_id], 'selected');
  });

  editNoteConversationCardButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    chrome.runtime.sendMessage({
      type: 'checkHasSubscription',
    }, (hasSubscription) => {
      if (!hasSubscription) {
        const error = { title: 'This is a Pro feature', message: 'Adding note to conversations requires a Pro subscription. Upgrade to Pro to remove all limits.' };
        errorUpgradeConfirmation(error);
      }
      chrome.runtime.sendMessage({
        type: 'getNote',
        detail: {
          conversationId,
        },
      }, (data) => {
        const conversationTitle = document.querySelector(`#conversation-card-${conversationId} #conversation-title`)?.innerText;
        openNotePreviewModal({ ...data, conversation_id: conversationId, conversation_name: conversationTitle });
      });
    });
  });
  downloadImagesConversationCardButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    chrome.runtime.sendMessage({
      type: 'checkHasSubscription',
    }, (hasSubscription) => {
      if (!hasSubscription) {
        const error = { title: 'This is a Pro feature', message: 'Downloading conversation images requires a Pro subscription. Upgrade to Pro to remove all limits.' };
        errorUpgradeConfirmation(error);
      }
      const menuButton = document.querySelector(`#conversation-card-settings-menu-${conversationId}`);
      downloadSelectedImages(menuButton, [], conversationId);
    });
  });

  deleteConversationCardButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
    handleDeleteConversation(conversationId);
  });
}

function handleRenameConversationClick(conversationId, sidebarFolder = false) {
  let skipBlur = false;
  closeMenus();

  const textInput = document.createElement('input');
  const conversationNameElement = document.querySelector(`${sidebarFolder ? '#sidebar-folder-drawer' : '#modal-manager'} #conversation-card-${conversationId} #conversation-title`);
  const oldConversationName = conversationNameElement.innerText;
  textInput.id = `conversation-rename-${conversationId}`;
  textInput.classList = 'border-0 bg-transparent p-0 focus:ring-0 focus-visible:ring-0 w-full';
  textInput.value = oldConversationName;
  conversationNameElement?.parentElement?.replaceChild(textInput, conversationNameElement);
  textInput.focus();
  setTimeout(() => {
    textInput.select();
  }, 50);
  textInput?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenus();
    textInput.focus();
  });
  // click out of input or press enter will save the new title
  textInput?.addEventListener('blur', () => {
    if (skipBlur) return;
    const newConversationName = textInput.value;
    if (newConversationName !== oldConversationName) {
      updateConversationNameElement(conversationNameElement, conversationId, newConversationName);
    }
    textInput.parentElement?.replaceChild(conversationNameElement, textInput);
  });
  textInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.which === 13) {
      skipBlur = true;
      const newConversationName = textInput.value;
      if (newConversationName !== oldConversationName) {
        updateConversationNameElement(conversationNameElement, conversationId, newConversationName);
      }
      textInput.parentElement?.replaceChild(conversationNameElement, textInput);
    }
    // esc key cancels the rename
    if (e.key === 'Escape') {
      skipBlur = true;
      conversationNameElement.innerText = oldConversationName;
      textInput.parentElement?.replaceChild(conversationNameElement, textInput);
    }
  });
}
function updateConversationNameElement(conversationNameElement, conversationId, newName) {
  if (!newName.trim()) return;
  conversationNameElement.innerText = newName;
  document.querySelectorAll(`#conversation-card-${conversationId} #conversation-title`).forEach((el) => {
    el.innerText = newName;
  });
  // update folder name
  renameConversation(conversationId, newName);
  renameConversationElements(conversationId, newName);
  chrome.runtime.sendMessage({
    type: 'renameConversation',
    detail: {
      conversationId,
      title: newName,
    },
  });
}
