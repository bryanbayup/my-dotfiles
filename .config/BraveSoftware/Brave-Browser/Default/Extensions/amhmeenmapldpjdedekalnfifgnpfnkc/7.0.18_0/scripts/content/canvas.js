/* global throttle, sidebarNoteIsOpen, toggleSidebarNote, sidebarFolderIsOpen, toggleSidebarFolder */

// eslint-disable-next-line no-unused-vars
const throttleInitializeCanvasChanges = throttle(() => {
  initializeCanvasChanges();
}, 100);
// eslint-disable-next-line no-unused-vars
function initializeCanvasChanges() {
  document.body.querySelector('#floating-button-wrapper')?.classList.add('hidden');
  document.body.querySelector('#sidebar-note-button')?.classList.add('hidden');
  document.body.querySelector('#sidebar-folder-button')?.classList.add('hidden');
  document.body.querySelector('#gptx-nav-wrapper')?.classList?.add('hidden');
  if (sidebarNoteIsOpen) {
    toggleSidebarNote();
  }
  if (sidebarFolderIsOpen()) {
    toggleSidebarFolder();
  }
}

// eslint-disable-next-line no-unused-vars
const throttleUndoCanvasChanges = throttle(() => {
  undoCanvasChanges();
}, 100);
// eslint-disable-next-line no-unused-vars
function undoCanvasChanges() {
  const onGPTs = window.location.pathname.includes('/gpts');
  const onAdmin = window.location.pathname.includes('/admin');
  if (!onGPTs && !onAdmin) {
    document.body.querySelector('#sidebar-note-button')?.classList.remove('hidden');
    document.body.querySelector('#sidebar-folder-button')?.classList.remove('hidden');
  }
  document.body.querySelector('#floating-button-wrapper')?.classList.remove('hidden');
  document.body.querySelector('#gptx-nav-wrapper')?.classList?.remove('hidden');
}
