/* global isWindows, createModal, settingsModalActions, stopAllAudios, handleCopyHtml, handleCopyMarkdown, openMoveToFolderModal, openExportModal, createSettingsModal, createManager, selectedGalleryImage, allImageNodes, addPromptInputKeyUpEventListeners, addPromptInputKeyDownEventListeners, getConversationIdFromUrl, handleDeleteConversation, toast, getConversationsByIds */

// eslint-disable-next-line no-unused-vars
function createKeyboardShortcutsModal(version) {
  const bodyContent = keyboardShortcutsModalContent(version);
  const actionsBarContent = keyboardShortcutsModalActions();
  createModal('Keyboard Shortcuts', 'Some shortkeys only work when Auto-Sync is ON. Having issues? see our <a href="https://ezi.notion.site/Superpower-ChatGPT-FAQ-9d43a8a1c31745c893a4080029d2eb24" target="_blank" rel="noopener noreferrer" style="color:gold;">FAQ</a>', bodyContent, actionsBarContent, false);
}
function buttonGenerator(buttonTexts, size = 'md') {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const newButtonTexts = buttonTexts.map((buttonText) => {
    if (!isMac && buttonText.includes('⌘')) {
      buttonText = buttonText.replace('⌘', 'CTRL');
    }
    if (!isMac && buttonText.includes('⌥')) {
      buttonText = buttonText.replace('⌥', 'Alt');
    }
    return buttonText;
  });
  return `<div class="flex flex-row gap-2">
  ${newButtonTexts.map((buttonText) => `<div class="${size === 'xs' ? 'h-5 px-1 text-xs text-token-text-secondary' : 'my-2 h-8 text-sm px-2 text-token-text-primary'} flex items-center justify-center rounded-md border border-token-border-light capitalize">${buttonText}</div>`).join('')}
  </div>`;
}
function keyboardShortcutsModalContent() {
  // create newsletterList modal content
  const content = document.createElement('div');
  content.id = 'modal-content-keyboard-shortcuts-list';
  content.style = 'overflow-y: hidden;position: relative;height:100%; width:100%';
  content.classList = 'markdown prose-invert';
  const logoWatermark = document.createElement('img');
  logoWatermark.src = chrome.runtime.getURL('icons/logo.png');
  logoWatermark.style = 'position: fixed; top: 50%; right: 50%; width: 400px; height: 400px; opacity: 0.07; transform: translate(50%, -50%);box-shadow:none !important;';
  content.appendChild(logoWatermark);
  const keyboardShortcutsText = document.createElement('div');
  keyboardShortcutsText.style = 'display: flex; flex-direction: column; justify-content: start; align-items: start;overflow-y: auto; height: 100%; width: 100%; white-space: break-spaces; overflow-wrap: break-word;padding: 16px;position: relative;z-index:10;';
  const refreshButton = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="gold" d="M468.9 32.11c13.87 0 27.18 10.77 27.18 27.04v145.9c0 10.59-8.584 19.17-19.17 19.17h-145.7c-16.28 0-27.06-13.32-27.06-27.2c0-6.634 2.461-13.4 7.96-18.9l45.12-45.14c-28.22-23.14-63.85-36.64-101.3-36.64c-88.09 0-159.8 71.69-159.8 159.8S167.8 415.9 255.9 415.9c73.14 0 89.44-38.31 115.1-38.31c18.48 0 31.97 15.04 31.97 31.96c0 35.04-81.59 70.41-147 70.41c-123.4 0-223.9-100.5-223.9-223.9S132.6 32.44 256 32.44c54.6 0 106.2 20.39 146.4 55.26l47.6-47.63C455.5 34.57 462.3 32.11 468.9 32.11z"/></svg>';

  keyboardShortcutsText.innerHTML = `
  <table style="width:100%;">
    <tr>
      <th class="text-token-text-secondary">Shortcut</th>
      <th class="text-token-text-secondary">Action</th>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'K'])}</td>
      <td>Open Keyboard Shortcut Modal</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', '.'])}</td>
      <td>Open Settings</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'O'])}</td>
      <td>Open New Chat</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'X'])}</td>
      <td>Open Conversation Manager</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'P'])}</td>
      <td>Open Prompt Manager</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'Y'])}</td>
      <td>Open Gallery</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'F'])}</td>
      <td>Open Enhanced GPT Store</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'E'])}</td>
      <td>Open Note Manager</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'I'])}</td>
      <td>Open Custom Instruction Pofiles</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'M'])}</td>
      <td>Open Pinned Chats</td>
    </tr>

    <!--tr>
      <td>${buttonGenerator(['⌘', 'Shift', ','])}</td>
      <td>Open Analytics</td>
    </tr -->

    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'L'])}</td>
      <td>Open Newsletter Archive</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'S'])}</td>
      <td>Toggle Sidebar</td>
    </tr>
    
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', 'C'])}</td>
      <td>Copy last response</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', '⌫'])}</td>
      <td>Delete Current Conversation</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', '⌥', 'M'])}</td>
      <td>Move Current Conversation to Folder</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', '⌥', 'E'])}</td>
      <td>Export Current Conversation</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', '⌥', 'F'])}</td>
      <td>Toggle Current Conversation Favorite</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', '⌥', 'C'])}</td>
      <td>Copy last response (HTML)</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', '⌥', 'D'])}</td>
      <td>Copy last response (Markdown)</td>
    </tr>


    <tr>
      <td>${buttonGenerator(['Home'])}</td>
      <td>Scroll to top</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['End'])}</td>
      <td>Scroll to Bottom</td> 
    </tr>
    <tr>
      <td>${buttonGenerator(['Esc'])}</td>
      <td>Close Modals/Stop Generating</td>
    </tr>
    <!-- tr>
      <td>${buttonGenerator(['⌘', 'Shift', `<span class="text-sm flex items-center justify-center" style="min-width:100px;">Click on <span style="display:inline-block;margin-left:8px;"><img class="w-4 h-4" src="${chrome.runtime.getURL('icons/new-folder.png')}"></span></span>`])}</td>
      <td>Reset the order of chats from newest to oldest (removes all folders)</td>
    </tr>
    <tr>
      <td>${buttonGenerator(['⌘', 'Shift', `<span class="text-sm flex items-center justify-center" style="min-width:100px;">Click on <span style="display: inline-block;width:12px;height:12px;margin-left:8px;">${refreshButton}</span></span>`])}</td>
      <td>Reset Auto Sync</td>
    </tr -->
  </table>
  `;
  content.appendChild(keyboardShortcutsText);
  return content;
}

function keyboardShortcutsModalActions() {
  return settingsModalActions();
}

async function registerShortkeys() {
  const { settings } = await chrome.storage.local.get(['settings']);

  document.addEventListener('keydown', async (e) => {
    // cmd/ctrl + shift + .
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && !e.altKey && e.keyCode === 190 && !e.repeat) {
      if (!document.querySelector('#modal-settings')) {
        e.preventDefault();
        e.stopPropagation();
        createSettingsModal();
      }
      return;
    }
    // cmd/ctrl + shift + l
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && !e.altKey && e.keyCode === 76 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      createManager('newsletters');
      return;
    }
    // cmnd + shift + y
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && !e.altKey && e.keyCode === 89 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      createManager('gallery', true);
      return;
    }

    // cmnd + shift + k
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && !e.altKey && e.keyCode === 75 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      const keyboardShortcutsModal = document.querySelector('#modal-keyboard-shortcuts');
      if (!keyboardShortcutsModal) {
        createKeyboardShortcutsModal();
      }
      return;
    }
    // cmnd + shift + P
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && !e.altKey && e.keyCode === 80 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      createManager('prompts');
      return;
    }
    // cmnd + shift + X
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && !e.altKey && e.keyCode === 88 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      createManager('conversations');
      return;
    }
    // cmd/ctrl + shift + F
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && !e.altKey && e.keyCode === 70 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      createManager('gpts');
      return;
    }
    // // cmnd + shift + I
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && !e.altKey && e.keyCode === 73 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      createManager('custom-instruction-profiles');
      return;
    }
    // cmnd + shift + M
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && !e.altKey && e.keyCode === 77 && !e.repeat) {
      e.preventDefault();
      createManager('pinned-messages');
      return;
    }
    // cmnd + shift + E
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && !e.altKey && e.keyCode === 69 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      createManager('notes');
      return;
    }

    // cmnd + shift + ⌫
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && !e.altKey && e.keyCode === 8 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
      handleDeleteConversation(conversationIdFromUrl);
      return;
    }
    // cmnd + shift + alt + M
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.altKey && e.keyCode === 77 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
      if (conversationIdFromUrl) {
        openMoveToFolderModal([conversationIdFromUrl]);
      }
      return;
    }
    // cmnd + shift + alt + E
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.altKey && e.keyCode === 69 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
      if (conversationIdFromUrl) {
        openExportModal([conversationIdFromUrl], 'selected');
      }
      return;
    }
    // cmnd + shift + alt + F
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.altKey && e.keyCode === 70 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
      if (conversationIdFromUrl) {
        const conversations = await getConversationsByIds([conversationIdFromUrl]);
        const response = await chrome.runtime.sendMessage({
          type: 'toggleConversationFavorite',
          forceRefresh: true,
          detail: {
            conversation: conversations[0],
          },
        });
        if (response.is_favorite) {
          toast('Conversation marked as favorite');
        } else {
          toast('Conversation removed from favorites');
        }
      }
      return;
    }

    // cmnd + shift + alt + c
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.altKey && e.keyCode === 67 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();

      const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
      if (conversationIdFromUrl) {
        const lastMessage = Array.from(document.querySelectorAll('div[data-message-id]')).pop();
        if (!lastMessage) return;
        const { messageId } = lastMessage.dataset;
        if (messageId) {
          handleCopyHtml(messageId, conversationIdFromUrl);
        }
      }
      return;
    }
    // cmnd + shift + alt + d
    if ((e.metaKey || (isWindows() && e.ctrlKey)) && e.shiftKey && e.altKey && e.keyCode === 68 && !e.repeat) {
      e.preventDefault();
      e.stopPropagation();
      const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
      if (conversationIdFromUrl) {
        const lastMessage = Array.from(document.querySelectorAll('div[data-message-id]')).pop();
        if (!lastMessage) return;
        const { messageId } = lastMessage.dataset;
        if (messageId) {
          handleCopyMarkdown(messageId, conversationIdFromUrl);
        }
      }
      return;
    }

    // esc
    if (e.keyCode === 27 && !e.repeat) {
      // stop speaking
      stopAllAudios();
      // close modals
      if (document.querySelectorAll('[id*=cancel-button]').length > 0) {
        document.querySelectorAll('[id*=cancel-button]')[document.querySelectorAll('[id*=cancel-button]').length - 1].click();
      } else if (document.querySelectorAll('[id*=close-button]').length > 0) {
        //  click on the last close button
        document.querySelectorAll('[id*=close-button]')[document.querySelectorAll('[id*=close-button]').length - 1].click();
      } else if (document.querySelector('#quick-access-menu-wrapper')) {
        document.querySelector('#quick-access-menu-wrapper').remove();
        document.querySelector('#prompt-textarea').focus();
      } else {
        const stopButton = document.querySelector('[data-testid*="stop-button"]');
        if (stopButton) {
          e.preventDefault();
          stopButton.click();
        }
      }
      return;
    }
    // home key
    if (e.keyCode === 36 && !e.repeat) {
      // if active element is not the textarea, and is not a child or textAreaElement scroll to top
      const textAreaElement = document.querySelector('#prompt-textarea');
      if (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT' && !textAreaElement.contains(document.activeElement)) {
        e.preventDefault();
        document.querySelector('#scroll-up-button').click();
      }
      return;
    }
    // end key
    if (e.keyCode === 35 && !e.repeat) {
      const textAreaElement = document.querySelector('#prompt-textarea');
      if (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT' && !textAreaElement.contains(document.activeElement)) {
        e.preventDefault();
        document.querySelector('#scroll-down-button').click();
      }
      return;
    }
    addPromptInputKeyDownEventListeners(settings, e);
  }, { capture: true });

  // image gallery move to previous image
  document.addEventListener('keyup', (e) => {
    // ARROW KEYS
    if (e.key === 'ArrowLeft') {
      // check if active element is not a textarea or input
      if (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
        // check if conversation preview is open
        const conversationPreview = document.querySelector('#conversation-preview-wrapper');
        if (conversationPreview) {
          const curPreviousButton = document.querySelector('#preview-conversation-previous-button');
          if (curPreviousButton) {
            curPreviousButton.click();
          }
        }

        // check if image gallery is open
        const imageGallery = document.querySelector('#image-gallery-image-wrapper');
        if (imageGallery) {
          const galleryImages = document.querySelectorAll('[id^="gallery-image-card-"]');
          if (!galleryImages) return;
          const selectedImageIndex = allImageNodes.findIndex((imageNode) => imageNode.image_id === selectedGalleryImage?.image_id);
          if (selectedImageIndex === 0) return;
          const prevImage = galleryImages[selectedImageIndex - 1];
          prevImage?.click();
          // scroll image into view middle
          prevImage?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }
    // image gallery move to next image
    if (e.key === 'ArrowRight') {
      // check if active element is not a textarea or input
      if (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
        // check if conversation preview is open
        const conversationPreview = document.querySelector('#conversation-preview-wrapper');
        if (conversationPreview) {
          const curNextButton = document.querySelector('#preview-conversation-next-button');
          if (curNextButton) {
            curNextButton.click();
          }
        }

        // check if image gallery is open
        const imageGallery = document.querySelector('#image-gallery-image-wrapper');
        if (imageGallery) {
          const galleryImages = document.querySelectorAll('[id^="gallery-image-card-"]');
          if (!galleryImages) return;
          const selectedImageIndex = allImageNodes.findIndex((imageNode) => imageNode.image_id === selectedGalleryImage?.image_id);
          if (selectedImageIndex === allImageNodes.length - 1) return;
          const nextImage = galleryImages[selectedImageIndex + 1];
          nextImage?.click();
          // scroll image into view middle
          nextImage?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    // text area element event listeners
    addPromptInputKeyUpEventListeners(e);
  }, { capture: true });
}
// eslint-disable-next-line no-unused-vars
function overrideOriginalButtons() {
  document.body.addEventListener('click', (event) => {
    const keyboardShortcutsButton = document.querySelector('div[role=menuitem] div svg path[d="M5.5 4.91421L4.29289 6.12132C4.10536 6.30886 4 6.56321 4 6.82843V16.9472L5.5 14.6972V4.91421ZM7.03518 16L5.03518 19H18.9648L16.9648 16H7.03518ZM18.5 14.6972L20 16.9472V6.43675C20 6.13997 19.8682 5.85852 19.6402 5.66853L18.5 4.71838V14.6972ZM16.5 14V4H7.5V14H16.5ZM4.70711 2.87868C5.26972 2.31607 6.03278 2 6.82843 2H17.2759C17.9777 2 18.6573 2.24605 19.1965 2.69534L20.9206 4.13209C21.6045 4.70207 22 5.54641 22 6.43675V18C22 19.6569 20.6569 21 19 21H5C3.34315 21 2 19.6569 2 18V6.82843C2 6.03278 2.31607 5.26972 2.87868 4.70711L4.70711 2.87868Z"]')?.parentElement.parentElement.parentElement;
    const customInstrucionButton = document.querySelector('div[role=menuitem] div svg path[d="M10.663 6.3872C10.8152 6.29068 11 6.40984 11 6.59007V8C11 8.55229 11.4477 9 12 9C12.5523 9 13 8.55229 13 8V6.59007C13 6.40984 13.1848 6.29068 13.337 6.3872C14.036 6.83047 14.5 7.61105 14.5 8.5C14.5 9.53284 13.8737 10.4194 12.9801 10.8006C12.9932 10.865 13 10.9317 13 11V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V11C11 10.9317 11.0068 10.865 11.0199 10.8006C10.1263 10.4194 9.5 9.53284 9.5 8.5C9.5 7.61105 9.96397 6.83047 10.663 6.3872Z"]')?.parentElement.parentElement.parentElement;

    // if clicked on keyboard shortcuts button
    if (keyboardShortcutsButton && keyboardShortcutsButton.contains(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      const keyboardShortcutsModal = document.querySelector('#modal-keyboard-shortcuts');
      if (!keyboardShortcutsModal) {
        createKeyboardShortcutsModal();
      }
    }
    // if clicked on custom instruction button
    if (customInstrucionButton && customInstrucionButton.contains(event.target)) {
      event.preventDefault();
      event.stopPropagation();
      createManager('custom-instruction-profiles');
    }
  }, { capture: true });
}

// eslint-disable-next-line no-unused-vars
function initializeKeyboardShortcuts() {
  registerShortkeys();
}
