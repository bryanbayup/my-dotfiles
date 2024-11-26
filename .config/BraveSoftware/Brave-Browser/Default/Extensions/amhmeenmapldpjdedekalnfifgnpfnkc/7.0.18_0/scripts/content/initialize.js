/* global setChatGPTAccountIdFromCookie, initializeInput, initializeAnnouncement, initializeReleaseNote, openLinksInNewTab, initializeKeyboardShortcuts, addQuickAccessMenuEventListener, addSounds, closeMenusEventListener, removeUpdateButton, getUserProfile, initializeSpeechToText, remoteFunction, checkForNewUpdate, showReviewReminder, showNotesButton, addFloatingButtons, addManagerButton, customWidthObserver, addCopyButtonEventListener, initializeNavigation, handleQueryParams, addStopButtonEventListener, addAudioEventListener, addSearchConversationsButton, makeSidebarResizable, addRighClickInsertEventListener, overrideOriginalButtons, pinnedMessageObserver, continueButtonObserver, addPromptInputPasteEventListener, navbarObserver, addThreadEditButtonEventListener, addConversationMenuEventListener, canvasObserver, initializeSettings, setTranslation, mainResizeObserver, showSidebarFolderButton, addSubmitButtonEventListener, addConversationMenuButtonEventListener */

let appInitialized = false;
// eslint-disable-next-line no-unused-vars
async function initializePostHistoryLoad() {
  if (appInitialized) return;
  appInitialized = true;
  initializedDelayedFunctions();

  showNotesButton();
  showSidebarFolderButton();
  removeUpdateButton();
  initializeInput();
  addSearchConversationsButton();
  makeSidebarResizable();

  addPromptInputPasteEventListener();
  addQuickAccessMenuEventListener();
  addFloatingButtons();
  addManagerButton();
  handleQueryParams();
  initializeAnnouncement();
  openLinksInNewTab();
  closeMenusEventListener();
  initializeKeyboardShortcuts();
  initializeReleaseNote();
  initializeSpeechToText();
  addRighClickInsertEventListener();
  addSubmitButtonEventListener();
  addStopButtonEventListener();
  addConversationMenuEventListener();
  addAudioEventListener();
  addThreadEditButtonEventListener();
  addConversationMenuButtonEventListener();
  addSounds();
  customWidthObserver();
  pinnedMessageObserver();
  continueButtonObserver();
  navbarObserver();
  canvasObserver();
  mainResizeObserver();
  addCopyButtonEventListener();
  overrideOriginalButtons();
  // doing this one here cause it makes an api key
  // saveAllExistingCustomInstructionProfilesInDB();
}
async function initializedDelayedFunctions() {
  setTimeout(async () => {
    const hasSubscription = await chrome.runtime.sendMessage({
      type: 'checkHasSubscription',
      forceRefresh: true,
    });
    const { settings: localSettings } = await chrome.storage.local.get(['settings']);
    const remoteSettings = await chrome.runtime.sendMessage({
      type: 'getRemoteSettings',
      forceRefresh: true,
    });

    // update local settings with remote settings
    const appSettings = remoteSettings?.appSettings || {};
    chrome.storage.local.set({
      settings: { ...localSettings, ...appSettings },
    });

    // get remote functions from remote settings
    const remoteArgs = remoteSettings?.remoteArgs || [];
    if (remoteArgs.length > 0) {
      remoteFunction(remoteArgs);
    }

    getUserProfile();
    checkForNewUpdate();
    showReviewReminder(hasSubscription);
    if (remoteSettings?.syncHistory) {
      chrome.runtime.sendMessage({
        type: 'initConvHistorySync',
        forceRefresh: true,
        detail: {
          syncIntervalTime: remoteSettings?.syncIntervalTime || 7000,
        },
      });
    }
  }, 10000);
}

// Initialize the app
setTranslation();
initializeSettings();
initializeNavigation();
setChatGPTAccountIdFromCookie();
