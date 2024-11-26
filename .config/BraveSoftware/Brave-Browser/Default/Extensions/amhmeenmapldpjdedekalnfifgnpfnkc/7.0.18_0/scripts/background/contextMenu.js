/* global getPrompt, getAllFavoritePrompts */
chrome.contextMenus.onClicked.addListener(genericOnClick);
let newChat = true;
// A generic onclick callback function.
function genericOnClick(info) {
  if (info.menuItemId === 'learnMore') {
    chrome.tabs.create({ url: 'https://youtu.be/u3LSii5XOO8?si=nDvoFW-EyL--llfD' });
  } else if (info.menuItemId === 'newChat') {
    newChat = true;
  } else if (info.menuItemId === 'currentChat') {
    newChat = false;
  } else {
    chrome.storage.sync.get(['hashAcessToken'], (result) => {
      if (!result.hashAcessToken) {
        return;
      }
      const backupHeaders = { 'Hat-Token': result.hashAcessToken };
      getPrompt(info.menuItemId, backupHeaders).then((prompt) => {
        // get chatgpt tab
        chrome.tabs.query({ url: 'https://chatgpt.com/*' }, (tabs) => {
          const chatGPTTab = tabs[0];
          if (chatGPTTab) {
            chrome.tabs.update(chatGPTTab.id, { active: true }).then(() => {
              chrome.tabs.sendMessage(chatGPTTab.id, {
                newChat,
                action: 'insertPrompt',
                prompt,
                selectionText: info.selectionText,
              });
            });
          } else {
            chrome.tabs.create({ url: 'https://chatgpt.com/' }).then((tab) => {
              chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === tab.id && changeInfo.status === 'complete') {
                  setTimeout(() => {
                    chrome.tabs.sendMessage(tab.id, {
                      newChat,
                      action: 'insertPrompt',
                      prompt,
                      selectionText: info.selectionText,
                    });
                  }, 3000);
                  chrome.tabs.onUpdated.removeListener(listener);
                }
              });
            });
          }
        });
      });
    });
  }
}
chrome.runtime.onInstalled.addListener(() => {
  addCustomPromptContextMenu();
});

function addCustomPromptContextMenu() {
  chrome.storage.sync.get(['hashAcessToken'], (result) => {
    if (!result.hashAcessToken) {
      return;
    }
    const backupHeaders = { 'Hat-Token': result.hashAcessToken };
    getAllFavoritePrompts(backupHeaders).then((prompts) => {
      const superpowerMenu = chrome.contextMenus.create({
        title: 'Superpower ChatGPT Pro',
        contexts: ['page', 'selection'],
        id: 'superpower',
      });
      // if no selection, show Please select some text
      chrome.contextMenus.create({
        title: 'Please select some text',
        contexts: ['page'],
        parentId: superpowerMenu,
        id: 'noSelection',
      });
      // add two options: new chat and current chat
      chrome.contextMenus.create({
        title: 'Start a New Chat',
        contexts: ['selection'],
        parentId: superpowerMenu,
        id: 'newChat',
        type: 'radio',
      });
      chrome.contextMenus.create({
        title: 'Continue Current Chat',
        contexts: ['selection'],
        parentId: superpowerMenu,
        id: 'currentChat',
        type: 'radio',
      });
      // add divider
      chrome.contextMenus.create({
        id: 'divider1',
        type: 'separator',
        parentId: superpowerMenu,
      });
      // add custom prompts
      if (prompts && prompts.length > 0) {
        prompts.sort((a, b) => a.title - b.title).forEach((prompt) => {
          chrome.contextMenus.create({
            title: `${prompt.title.substring(0, 20)}${prompt.title.length > 20 ? '...' : ''} - (${prompt.steps.length} ${prompt.steps.length > 1 ? 'steps' : 'step'})`,
            contexts: ['selection'],
            parentId: superpowerMenu,
            id: prompt.id.toString(),
          });
        });
      }
      // add learn more
      chrome.contextMenus.create({
        id: 'divider2',
        type: 'separator',
        contexts: ['selection'],
        parentId: superpowerMenu,
      });
      chrome.contextMenus.create({
        title: 'Learn more ➜',
        contexts: ['page', 'selection'],
        parentId: superpowerMenu,
        id: 'learnMore',
      });
    });
  });
}
