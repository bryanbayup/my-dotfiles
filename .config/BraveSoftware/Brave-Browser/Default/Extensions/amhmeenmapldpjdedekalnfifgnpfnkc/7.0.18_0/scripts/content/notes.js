/* global addUpgradeOverlay, createModal, debounce, dropdown, addDropdownEventListener, notesSortByList, getConversationName, createManager, getConversationIdFromUrl, translate, closeMenus, closeSidebarFolder, createHighlightOverlay, isDarkMode, sidebarFolderIsOpen */
const sidebarNoteInputWrapperWidth = 30; // percentage

let sidebarNoteIsOpen = false;
let noteListPageNumber = 1;
let noteListSearchTerm = '';
let lastSelectedNoteCardId = null;
// eslint-disable-next-line no-unused-vars
function loadNote() {
  const sidebarNoteButton = document.querySelector('#sidebar-note-button');
  if (sidebarNoteButton?.querySelector('#ping')) sidebarNoteButton?.querySelector('#ping')?.remove();

  chrome.runtime.sendMessage({
    type: 'checkHasSubscription',
  }, (hasSubscription) => {
    const sidebarNoteInput = document.querySelector('#sidebar-note-input');
    if (!sidebarNoteInput) {
      addSidebarNoteInput();
    }
    if (hasSubscription) {
      const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
      if (!conversationIdFromUrl) {
        sidebarNoteInput.value = '';
        sidebarNoteInput.disabled = true;
        addStartChatOverlay();
        return;
      }
      hideStartChatOverlay();

      let noteIsLoading = true;
      if (sidebarNoteIsOpen) {
        setTimeout(() => {
          if (noteIsLoading) {
            sidebarNoteInput.value = '';
            sidebarNoteInput.disabled = true;
            addLoadingOverlay();
          }
        }, 500);
      }
      chrome.runtime.sendMessage({
        type: 'getNote',
        detail: {
          conversationId: conversationIdFromUrl,
        },
      }, (note) => {
        sidebarNoteInput.disabled = false;
        noteIsLoading = false;
        removeLoadingOverlay();
        if (note) {
          const curConversationIdFromUrl = getConversationIdFromUrl(window.location.href);

          if (!sidebarNoteInput) {
            addSidebarNoteInput();
          }
          if (conversationIdFromUrl === curConversationIdFromUrl) {
            sidebarNoteInput.value = note.text;
          }
        }
        toggleNoteIndicator(conversationIdFromUrl, note.text);
      });
    } else {
      sidebarNoteInput.value = '';
      sidebarNoteInput.disabled = true;
      const sidebarNoteInputWrapper = document.querySelector('#sidebar-note-input-wrapper');
      addUpgradeOverlay(sidebarNoteInputWrapper, hasSubscription);
    }
  });
}
// eslint-disable-next-line no-unused-vars
function loadNoteIndicators(settings) {
  chrome.runtime.sendMessage({
    type: 'checkHasSubscription',
  }, (hasSubscription) => {
    if (hasSubscription) {
      if (settings.showNoteIndicator) {
        const conversationIds = Array.from(document.querySelectorAll('[id^=conversation-note-indicator-]')).map((el) => el.id.replace('conversation-note-indicator-', ''));
        chrome.runtime.sendMessage({
          type: 'getNoteForIds',
          detail: {
            conversationIds,
          },
        }, (conversationIdsWithNote) => {
          conversationIdsWithNote.forEach((conversationId) => {
            const noteIndicator = document.querySelector(`#conversation-note-indicator-${conversationId}`);
            if (noteIndicator) {
              noteIndicator.classList.remove('hidden');
            }
          });
        });
      } else {
        const noteIndicators = document.querySelectorAll('[id^=conversation-note-indicator-]');
        noteIndicators.forEach((noteIndicator) => {
          noteIndicator.classList.add('hidden');
        });
      }
    }
  });
}
// eslint-disable-next-line no-unused-vars
function hideStartChatOverlay() {
  const startChatWrapper = document.querySelector('#start-chat-overlay');
  if (startChatWrapper) startChatWrapper.remove();
}
// eslint-disable-next-line no-unused-vars
function addStartChatOverlay() {
  const sidebarNoteInputWrapper = document.querySelector('#sidebar-note-input-wrapper');
  if (!sidebarNoteInputWrapper) return;
  const existingStartChatOverlay = sidebarNoteInputWrapper.querySelector('#start-chat-overlay');
  if (existingStartChatOverlay) return;
  const startChatWrapper = document.createElement('div');
  startChatWrapper.id = 'start-chat-overlay';
  startChatWrapper.classList = 'w-full absolute top-0 bg-black/50 dark:bg-black/80 rounded-bl-md flex justify-center items-center';
  startChatWrapper.style = 'top: 56px; height: calc(100% - 56px);';
  sidebarNoteInputWrapper.appendChild(startChatWrapper);

  const startChatText = document.createElement('div');
  startChatText.classList = 'flex flex-wrap p-3 items-center rounded-md bg-token-main-surface-primary text-token-text-primary text-sm';
  startChatText.innerHTML = 'Start the chat to enable notes';
  startChatWrapper.appendChild(startChatText);
}
function addLoadingOverlay() {
  const sidebarNoteInputWrapper = document.querySelector('#sidebar-note-input-wrapper');
  const loadingWrapper = document.createElement('div');
  loadingWrapper.id = 'note-loading-wrapper';
  loadingWrapper.classList = 'w-full absolute top-0 bg-black/50 dark:bg-black/80 rounded-bl-md flex justify-center items-center';
  loadingWrapper.style = 'top: 56px; height: calc(100% - 56px);';
  loadingWrapper.innerHTML = '<svg x="0" y="0" viewbox="0 0 40 40" class="spinner icon-xl"><circle fill="transparent" stroke="#ffffff50" stroke-width="2" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg>';
  sidebarNoteInputWrapper.appendChild(loadingWrapper);
}
function removeLoadingOverlay() {
  const loadingWrapper = document.querySelector('#note-loading-wrapper');
  if (loadingWrapper) loadingWrapper.remove();
}
function toggleSidebarNote() {
  closeSidebarFolder();
  const sidebarNoteInputWrapper = document.querySelector('#sidebar-note-input-wrapper');
  if (!sidebarNoteInputWrapper) {
    addSidebarNoteInput();
  }
  const main = document.querySelector('main');
  const presentation = main.querySelector('main div[role=presentation]');
  if (!presentation) return;
  presentation.classList.remove('flex-1');

  const floatingButtonWrapper = document.querySelector('#floating-button-wrapper');
  if (sidebarNoteIsOpen) {
    sidebarNoteIsOpen = false;
    sidebarNoteInputWrapper.style.width = '0';
    presentation.style.width = '100%';
    if (floatingButtonWrapper) floatingButtonWrapper.style.right = '3rem';
  } else {
    sidebarNoteIsOpen = true;
    // sidebarNoteInputWrapper.style.width = `${main.offsetWidth * (sidebarNoteInputWrapperWidth/100)}px`;
    sidebarNoteInputWrapper.style.width = `${sidebarNoteInputWrapperWidth}%`;
    presentation.style.width = `${100 - sidebarNoteInputWrapperWidth}%`;
    if (floatingButtonWrapper) floatingButtonWrapper.style.right = `calc(1rem + ${main.offsetWidth * (sidebarNoteInputWrapperWidth / 100)}px)`;
  }
}
// eslint-disable-next-line no-unused-vars
function closeSidebarNote() {
  const sidebarNoteInputWrapper = document.querySelector('#sidebar-note-input-wrapper');
  if (sidebarNoteInputWrapper) sidebarNoteInputWrapper.style.width = '0';
  sidebarNoteIsOpen = false;
}

function addSidebarNoteButton() {
  const existingSidebarNoteButton = document.querySelector('#sidebar-note-button');
  if (existingSidebarNoteButton) existingSidebarNoteButton.remove();

  const sidebarNoteButton = document.createElement('button');
  sidebarNoteButton.id = 'sidebar-note-button';
  sidebarNoteButton.innerHTML = translate('Notes');
  sidebarNoteButton.classList = 'absolute flex items-center justify-center border border-token-border-light text-token-text-secondary hover:border-token-border-heavy hover:text-token-text-primary text-xs font-sans cursor-pointer rounded-t-md z-10 bg-token-main-surface-primary opacity-85 hover:opacity-100';
  sidebarNoteButton.style = 'top: 12rem;right: -1rem;width: 4rem;height: 2rem;flex-wrap:wrap;transform: rotate(-90deg);';
  sidebarNoteButton.addEventListener('click', () => {
    toggleSidebarNote();
    if (sidebarNoteButton.querySelector('#ping')) sidebarNoteButton.querySelector('#ping').remove();
  });
  document.body.appendChild(sidebarNoteButton);
}
function resetNoteManagerParams() {
  noteListPageNumber = 1;
  noteListSearchTerm = '';
  lastSelectedNoteCardId = null;
}
// eslint-disable-next-line no-unused-vars
function noteListModalContent() {
  resetNoteManagerParams();
  const content = document.createElement('div');
  content.id = 'modal-content-note-list';
  content.style = 'display: flex; flex-direction: column; justify-content: start; align-items: center;overflow-y: hidden;height:100%;';
  chrome.runtime.sendMessage({
    type: 'checkHasSubscription',
  }, (hasSubscription) => {
    // note filter
    const noteListFilterBar = document.createElement('div');
    noteListFilterBar.style = 'display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start; width: 100%; padding: 6px 12px; z-index: 100; position: sticky; top: 0;';
    noteListFilterBar.classList = 'bg-token-main-surface-secondary';

    // add note search box
    const noteListSearchInput = document.createElement('input');
    noteListSearchInput.type = 'search';
    noteListSearchInput.classList = 'text-token-text-primary bg-token-main-surface-secondary border border-token-border-light text-sm rounded-md w-full h-full';
    noteListSearchInput.placeholder = translate('Search notes');
    noteListSearchInput.id = 'note-manager-search-input';
    noteListSearchInput.autocomplete = 'off';

    const delayedSearch = debounce((e) => {
      const { value } = e.target;
      noteListSearchTerm = value;
      noteListPageNumber = 1;
      fetchNotes(noteListPageNumber);
    });
    noteListSearchInput.addEventListener('input', (e) => {
      if (!hasSubscription) return;
      if (e.target.value.trim().length > 2) {
        delayedSearch(e);
      } else if (e.target.value.length === 0) {
        noteListSearchTerm = '';
        noteListPageNumber = 1;
        fetchNotes(noteListPageNumber);
      }
    });
    noteListFilterBar.appendChild(noteListSearchInput);

    chrome.storage.local.get(['settings'], (result) => {
      const { settings } = result;
      const { selectedNotesSortBy, selectedNotesView } = settings;
      // add sort button
      const sortBySelectorWrapper = document.createElement('div');
      sortBySelectorWrapper.style = 'position:relative;width:150px;z-index:1000;margin-left:8px;';
      sortBySelectorWrapper.innerHTML = dropdown('Notes-SortBy', notesSortByList, selectedNotesSortBy, 'code', 'right');
      noteListFilterBar.appendChild(sortBySelectorWrapper);
      addDropdownEventListener('Notes-SortBy', notesSortByList, 'code', () => fetchNotes(1));
      // add compact view button
      const compactViewButton = document.createElement('button');
      compactViewButton.classList = 'h-full aspect-1 flex items-center justify-center rounded-lg px-2 ml-2 text-token-text-secondary focus-visible:outline-0 bg-token-sidebar-surface-primary hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary border border-token-border-light';
      compactViewButton.innerHTML = selectedNotesView === 'list' ? '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM206.4 335.1L152 394.9V56.02C152 42.76 141.3 32 128 32S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"/></svg>' : '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM145.6 39.37c-9.062-9.82-26.19-9.82-35.25 0L14.38 143.4c-9 9.758-8.406 24.96 1.344 33.94C20.35 181.7 26.19 183.8 32 183.8c6.469 0 12.91-2.594 17.62-7.719L104 117.1v338.9C104 469.2 114.8 480 128 480s24-10.76 24-24.02V117.1l54.37 58.95C215.3 185.8 230.5 186.5 240.3 177.4C250 168.4 250.6 153.2 241.6 143.4L145.6 39.37z"/></svg>';
      compactViewButton.addEventListener('click', () => {
        chrome.storage.local.get(['settings'], (res) => {
          // switch between aspect-1 to aspect-2 for all noteItem
          const noteItems = document.querySelectorAll('[id^=note-item-]');
          noteItems.forEach((noteItem) => {
            if (res.settings.selectedNotesView === 'list') {
              noteItem.classList.remove('aspect-2');
              noteItem.classList.add('aspect-1');
            } else {
              noteItem.classList.remove('aspect-1');
              noteItem.classList.add('aspect-2');
            }
          });
          if (res.settings.selectedNotesView === 'list') {
            compactViewButton.innerHTML = '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM145.6 39.37c-9.062-9.82-26.19-9.82-35.25 0L14.38 143.4c-9 9.758-8.406 24.96 1.344 33.94C20.35 181.7 26.19 183.8 32 183.8c6.469 0 12.91-2.594 17.62-7.719L104 117.1v338.9C104 469.2 114.8 480 128 480s24-10.76 24-24.02V117.1l54.37 58.95C215.3 185.8 230.5 186.5 240.3 177.4C250 168.4 250.6 153.2 241.6 143.4L145.6 39.37z"/></svg>';
          } else {
            compactViewButton.innerHTML = '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM206.4 335.1L152 394.9V56.02C152 42.76 141.3 32 128 32S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"/></svg>';
          }
          chrome.storage.local.set({
            settings: {
              ...res.settings,
              selectedNotesView: res.settings.selectedNotesView === 'list' ? 'grid' : 'list',
            },
          });
        });
      });
      noteListFilterBar.appendChild(compactViewButton);
    });
    content.appendChild(noteListFilterBar);
    if (hasSubscription) {
      const noteList = noteListComponent();
      content.appendChild(noteList);
    } else {
      addUpgradeOverlay(content, hasSubscription);
    }
  });
  return content;
}
function fetchNotes(newPageNumber = 1) {
  chrome.storage.local.get(['settings'], ({ settings }) => {
    const { selectedNotesSortBy } = settings;

    noteListPageNumber = newPageNumber;
    chrome.runtime.sendMessage({
      type: 'getNotes',
      detail: {
        page: noteListPageNumber,
        sortBy: selectedNotesSortBy.code,
        searchTerm: noteListSearchTerm,
      },
    }, (data) => {
      renderNoteCards(data, settings);
      if (newPageNumber === 1) {
        const noteList = document.querySelector('#note-list');
        noteList?.scrollTo(0, 0);
      }
    });
  });
}
function noteListComponent() {
  const noteList = document.createElement('div');
  noteList.id = 'note-list';
  noteList.classList = 'w-full grid grid-cols-4 gap-4 overflow-y-auto p-4 pb-32 h-full content-start';

  // show loading spinner
  const noResult = document.createElement('div');
  noResult.style = 'position:absolute;display: flex; justify-content: center; align-items: center; height: 340px; width: 100%;';
  noResult.innerHTML = '<svg x="0" y="0" viewbox="0 0 40 40" class="spinner icon-xl"><circle fill="transparent" stroke="#ffffff50" stroke-width="2" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg>';
  noteList.appendChild(noResult);
  return noteList;
}
function renderNoteCards(data, settings) {
  const noteList = document.querySelector('#note-list');
  if (!noteList) return;
  const existingLoadMoreButton = noteList.querySelector('#load-more-notes-button');
  if (existingLoadMoreButton) existingLoadMoreButton.remove();
  if (noteListPageNumber === 1) noteList.innerHTML = '';
  if (data.results.length === 0) {
    const noResult = document.createElement('div');
    noResult.style = 'position:absolute;display: flex; justify-content: center; align-items: center; height: 340px; width: 100%;';
    noResult.textContent = translate('No notes found');
    noteList.appendChild(noResult);
    return;
  }
  data.results.forEach((note) => {
    const noteItem = document.createElement('div');
    noteItem.id = `note-item-${note.id}`;
    noteItem.classList = `group flex flex-col w-full ${settings.selectedNotesView === 'list' ? 'aspect-2' : 'aspect-1'} p-3 pb-2 h-auto cursor-pointer border bg-token-main-surface-primary border-token-border-light rounded-md overflow-hidden`;
    noteItem.style = 'height:max-content;outline-offset: 4px; outline: none;';
    noteItem.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenus();
      updateSelectedNoteCard(note.id);
      openNotePreviewModal(note);
    });
    const noteItemHeader = document.createElement('div');
    noteItemHeader.classList = 'flex justify-between items-center border-b border-token-border-light pb-1';
    const noteItemTitle = document.createElement('div');
    noteItemTitle.classList = 'text-token-text-primary text-md whitespace-nowrap overflow-hidden text-ellipsis';
    noteItemTitle.textContent = note.conversation_name;
    noteItemTitle.title = note.conversation_name;
    noteItemHeader.appendChild(noteItemTitle);

    const notItemBody = document.createElement('div');
    notItemBody.id = `note-item-body-${note.conversation_id}`;
    notItemBody.classList = 'flex flex-1 text-token-text-secondary text-sm py-1 whitespace-wrap overflow-hidden text-ellipsis break-all border-b border-token-border-light ';
    notItemBody.textContent = note.text;
    notItemBody.title = note.text;

    const noteItemActions = document.createElement('div');
    noteItemActions.classList = 'flex justify-between items-center pt-2';

    const noteDate = document.createElement('div');
    noteDate.id = `note-date-${note.id}`;
    noteDate.classList = 'text-token-text-tertiary text-xs';
    if (settings.selectedNotesSortBy.code === 'created_at') {
      noteDate.textContent = new Date(note.created_at).toLocaleString();
      noteDate.title = `Created: ${new Date(note.created_at).toLocaleString()}`;
    } else {
      noteDate.textContent = new Date(note.updated_at).toLocaleString();
      noteDate.title = `Last updated: ${new Date(note.updated_at).toLocaleString()}`;
    }
    noteItemActions.appendChild(noteDate);

    const noteItemPreviewButton = document.createElement('button');
    noteItemPreviewButton.classList = 'btn btn-small btn-secondary ml-auto';
    noteItemPreviewButton.textContent = translate('View Note');

    noteItemActions.appendChild(noteItemPreviewButton);

    noteItem.appendChild(noteItemHeader);
    noteItem.appendChild(notItemBody);
    noteItem.appendChild(noteItemActions);
    noteList.appendChild(noteItem);
  });
  // add loading spinner
  if (data.next) {
    const loadMoreButton = document.createElement('button');
    loadMoreButton.id = 'load-more-notes-button';
    loadMoreButton.classList = 'w-full h-full flex justify-center items-center';
    loadMoreButton.innerHTML = '<svg x="0" y="0" viewbox="0 0 40 40" class="spinner icon-xl"><circle fill="transparent" stroke="#ffffff50" stroke-width="2" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg>';
    loadMoreButton.addEventListener('click', () => {
      fetchNotes(noteListPageNumber + 1);
    });
    noteList.appendChild(loadMoreButton);
    // add intersection observer to load more notes automatically
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadMoreButton?.click();
        }
      });
    }, { threshold: 0.5 });
    if (loadMoreButton) {
      observer.observe(loadMoreButton);
    }
  }
}
function updateSelectedNoteCard(noteId) {
  if (lastSelectedNoteCardId) {
    const prevSelectedCard = document.querySelector(`#modal-manager #note-item-${lastSelectedNoteCardId}`);
    if (prevSelectedCard) prevSelectedCard.style.outline = 'none';
  }
  if (!noteId) return;
  const noteCard = document.querySelector(`#modal-manager #note-item-${noteId}`);
  lastSelectedNoteCardId = noteId;
  noteCard.style.outline = `2px solid ${isDarkMode() ? '#fff' : '#000'}`;
}
function openNotePreviewModal(note) {
  const bodyContent = notePreviewModalContent(note);
  const actionsBarContent = notePreviewModalActions(note);
  createModal(note.conversation_name, '', bodyContent, actionsBarContent, false, 'small');
}
function notePreviewModalContent(note) {
  // get note from server everytime you open in case it was edited once and closed
  const content = document.createElement('div');
  content.id = 'modal-content-note-preview';
  content.classList = 'w-full h-full flex justify-center items-center overflow-hidden';
  const notePreview = document.createElement('div');
  notePreview.classList = 'w-full rounded-md flex justify-center items-center relative';
  notePreview.style = 'height: 100%;';
  notePreview.innerHTML = '<svg x="0" y="0" viewbox="0 0 40 40" class="spinner icon-xl"><circle fill="transparent" stroke="#ffffff50" stroke-width="2" stroke-linecap="round" stroke-dasharray="125.6" cx="20" cy="20" r="18"></circle></svg>';

  const notePreviewText = document.createElement('textarea');
  notePreviewText.id = 'note-preview-text';
  notePreviewText.classList = 'w-full h-full bg-token-main-surface-primary border border-token-border-light text-token-text-primary p-3 rounded-md placeholder:text-gray-500 text-lg resize-none';
  notePreviewText.placeholder = 'Add notes here...\n- Each conversation has its own note\n- Notes are synced accross devices';

  chrome.runtime.sendMessage({
    type: 'getNote',
    detail: {
      conversationId: note.conversation_id,
    },
  }, (data) => {
    notePreview.innerHTML = '';
    notePreviewText.value = data.text;
    const conversationId = data.conversation_id || note.conversation_id;
    const conversationName = data.conversation_name || note.conversation_name;
    notePreviewText.addEventListener('blur', () => {
      chrome.runtime.sendMessage({
        type: 'updateNote',
        detail: {
          conversationId,
          conversationName,
          text: notePreviewText.value,
        },
      });
      const noteItemBody = document.querySelector(`#note-item-body-${conversationId}`);
      if (noteItemBody) {
        noteItemBody.textContent = notePreviewText.value;
      }
      const noteItemDate = document.querySelector(`#note-date-${data.id}`);
      if (noteItemDate) {
        if (noteItemDate?.title?.includes('updated')) {
          noteItemDate.textContent = new Date().toLocaleString();
          noteItemDate.title = `Last updated: ${new Date().toLocaleString()}`;
        }
      }
      toggleNoteIndicator(conversationId, notePreviewText.value);
      const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
      if (conversationIdFromUrl && conversationIdFromUrl === conversationId) {
        const sidebarNoteInput = document.querySelector('#sidebar-note-input');
        if (sidebarNoteInput) {
          sidebarNoteInput.value = notePreviewText.value;
        }
      }
    });

    const searchValue = document.querySelector('#modal-manager input[id$="-manager-search-input"]')?.value;
    if (searchValue) {
      const overlayElemet = createHighlightOverlay(notePreviewText, searchValue);
      notePreview.appendChild(overlayElemet);
    }
    notePreview.appendChild(notePreviewText);
  });
  content.appendChild(notePreview);
  return content;
}
function notePreviewModalActions(note) {
  const actionsBar = document.createElement('div');
  actionsBar.classList = 'flex w-full justify-end items-center pt-2';
  const openConversationButton = document.createElement('button');
  openConversationButton.classList = 'btn btn-small btn-primary';
  openConversationButton.textContent = `${translate('Open Conversation in New Tab')} ➜`;
  openConversationButton.addEventListener('click', () => {
    window.open(`https://chatgpt.com/c/${note.conversation_id}`, '_blank');
  });
  actionsBar.appendChild(openConversationButton);
  return actionsBar;
}
function addSidebarNoteInput() {
  const sidebarNoteInputWrapper = document.createElement('div');
  sidebarNoteInputWrapper.id = 'sidebar-note-input-wrapper';
  sidebarNoteInputWrapper.classList = 'absolute right-0 w-0 top-0 overflow-hidden transition transition-width z-10 flex flex-col h-full';
  // note title
  const sidebarNoteHeader = document.createElement('div');
  sidebarNoteHeader.classList = 'w-full bg-token-main-surface-secondary border border-token-border-light p-3 h-14 rounded-tl-md flex justify-between items-center';

  const sidebarNoteTitle = document.createElement('div');
  sidebarNoteTitle.innerHTML = `${translate('Notes')} <a href="https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4" target="_blank" rel="noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-md pl-0.5 text-token-text-tertiary h-5 w-5"><path fill="currentColor" d="M13 12a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0zM12 9.5A1.25 1.25 0 1 0 12 7a1.25 1.25 0 0 0 0 2.5"></path><path fill="currentColor" fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0" clip-rule="evenodd"></path></svg></a>`;
  sidebarNoteTitle.classList = 'w-1/2 text-token-text-primary h-14 flex items-center justify-start gap-2';
  sidebarNoteHeader.appendChild(sidebarNoteTitle);

  const seeAllNotesButton = document.createElement('button');
  seeAllNotesButton.textContent = translate('See All Notes');
  seeAllNotesButton.classList = 'btn flex justify-center gap-2 btn-secondary border';
  seeAllNotesButton.addEventListener('click', () => {
    createManager('notes');
  });
  sidebarNoteHeader.appendChild(seeAllNotesButton);
  sidebarNoteInputWrapper.appendChild(sidebarNoteHeader);

  const sidebarNoteInput = document.createElement('textarea');
  sidebarNoteInput.id = 'sidebar-note-input';
  sidebarNoteInput.placeholder = 'Add notes here...\n- Each conversation has its own note\n- Notes are synced accross devices\n- To see all notes and search them, click on "See All Notes" button';
  sidebarNoteInput.classList = 'w-full bg-token-main-surface-secondary border border-token-border-light text-token-text-primary p-3 rounded-bl-md flex-grow placeholder:text-gray-500';
  sidebarNoteInput.style = 'border-top:none;';
  sidebarNoteInputWrapper.appendChild(sidebarNoteInput);
  sidebarNoteInput.addEventListener('blur', () => {
    const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
    if (conversationIdFromUrl) {
      const conversationName = getConversationName(conversationIdFromUrl);
      const text = document.querySelector('#sidebar-note-input').value;
      chrome.runtime.sendMessage({
        type: 'updateNote',
        detail: {
          conversationId: conversationIdFromUrl,
          conversationName,
          text,
        },
      });
      toggleNoteIndicator(conversationIdFromUrl, text);
    }
  });
  const main = document.querySelector('main');
  if (!main) return;
  const existingSidebarNoteInputWrapper = main.querySelector('#sidebar-note-input-wrapper');
  if (existingSidebarNoteInputWrapper) return;
  main.appendChild(sidebarNoteInputWrapper);
  const presentation = main.querySelector('main div[role=presentation]');
  if (!presentation) return;
  presentation.classList.remove('flex-1');
  const floatingButtonWrapper = document.querySelector('#floating-button-wrapper');
  if (sidebarNoteIsOpen) {
    // sidebarNoteInputWrapper.style.width = `${main.offsetWidth * (sidebarNoteInputWrapperWidth/100)}px`;
    sidebarNoteInputWrapper.style.width = `${sidebarNoteInputWrapperWidth}%`;
    presentation.style.width = `${100 - sidebarNoteInputWrapperWidth}%`;
    if (floatingButtonWrapper) floatingButtonWrapper.style.right = `calc(1rem + ${main.offsetWidth * (sidebarNoteInputWrapperWidth / 100)}px)`;
  } else if (!sidebarFolderIsOpen()) {
    sidebarNoteInputWrapper.style.width = '0';
    presentation.style.width = '100%';
    if (floatingButtonWrapper) floatingButtonWrapper.style.right = '3rem';
  }
}
function toggleNoteIndicator(conversationId, text) {
  const noteIndicators = document.querySelectorAll(`#conversation-note-indicator-${conversationId}`);
  if (noteIndicators.length === 0) return;
  for (let i = 0; i < noteIndicators.length; i += 1) {
    const noteIndicator = noteIndicators[i];
    if (text.length > 0) {
      noteIndicator.classList.remove('hidden');
    } else {
      noteIndicator.classList.add('hidden');
    }
  }
}

// eslint-disable-next-line no-unused-vars
function hideNotesButton() {
  const sidebarNoteButton = document.querySelector('#sidebar-note-button');
  if (sidebarNoteButton) {
    sidebarNoteButton.classList.add('hidden');
  }
  if (sidebarNoteIsOpen) {
    toggleSidebarNote();
  }
}
// eslint-disable-next-line no-unused-vars
function showNotesButton(url = window.location) {
  // check if on /gpts
  const onGPTs = url.pathname.includes('/gpts');
  const onAdmin = url.pathname.includes('/admin');

  const sidebarNoteButton = document.querySelector('#sidebar-note-button');
  if (sidebarNoteButton) {
    sidebarNoteButton.classList.remove('hidden');
  } else {
    addSidebarNoteButton();
  }
  const sidebarNoteInputWrapper = document.querySelector('#sidebar-note-input-wrapper');
  if (!sidebarNoteInputWrapper) {
    addSidebarNoteInput();
  }

  if (onGPTs || onAdmin) {
    const curSidebarNoteButton = document.querySelector('#sidebar-note-button');
    curSidebarNoteButton.classList.add('hidden');
    const floatingButtonWrapper = document.querySelector('#floating-button-wrapper');
    if (floatingButtonWrapper) floatingButtonWrapper.style.right = '3rem';
  } else {
    loadNote();
  }
}
