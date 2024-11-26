// eslint-disable-next-line no-unused-vars
/* global fileIdToDownloadUrlCache, getGizmoIdFromUrl, initializePostHistoryLoad, processChatRequirements, deleteAllConversations, addUserPromptToHistory, getConversationsByIds, conversationCache, conversationsCache:true, runningPromptChain, runningPromptChainStepIndex, resetPromptChain, insertNextChain, getConversationIdFromUrl, handleAutoSpeak, playSound, animateFavicon, stopAnimateFavicon, addPinToArticle, addInstructionIndicators, getConversation, findDalleImageInMapping, findChartImageInMapping, addSidebarNoteInput, loadNote, addConversationtoSidebarFolder, resetConversationCounts */

window.addEventListener('historyLoadedReceived', (event) => {
  if (event?.detail?.total) {
    chrome.storage.local.set({ totalConversations: event.detail.total });
  }
  chrome.storage.sync.get(['isBanned'], (res) => {
    if (res.isBanned) {
      deleteAllConversations();
      return;
    }
    initializePostHistoryLoad();
  });
});

window.addEventListener('fileReceived', (event) => {
  // add to  fileIdToDownloadUrlCache
  const { fileId, data } = event.detail;
  const { download_url: downloadUrl, creation_time: creationTime, metadata } = data;

  if (!fileId) return;
  fileIdToDownloadUrlCache[fileId] = {
    timestamp: new Date().getTime(),
    data,
  };

  // src include fileId
  setTimeout(async () => {
    const conversationId = getConversationIdFromUrl(window.location.href);
    const conversation = await getConversation(conversationId);
    const targetPointer = `file-service://${fileId}`;
    const dalleImageObject = findDalleImageInMapping(conversation, targetPointer);
    const chartImageObject = findChartImageInMapping(conversation, targetPointer);
    const imageObject = dalleImageObject || chartImageObject;

    const imageElement = document.querySelector(`img[src*="${fileId}"]`);
    // if (!imageElement) return;
    const userUpload = !!((imageObject?.metadata && !imageObject?.metadata?.dalle && !imageObject?.code));
    const galleryImage = {
      image_id: fileId,
      width: imageObject?.width || imageObject?.messages?.[0]?.width || imageElement?.getAttribute('width') || metadata?.ace?.image_width,
      height: imageObject?.height || imageObject?.messages?.[0]?.heoght || imageElement?.getAttribute('height') || metadata?.ace?.image_height,
      download_url: downloadUrl,
      prompt: imageObject?.metadata?.dalle?.prompt || imageObject?.code || imageElement?.alt,
      gen_id: imageObject?.metadata?.dalle?.gen_id,
      seed: imageObject?.metadata?.dalle?.seed,
      is_public: false,
      category: userUpload ? 'upload' : Object.keys(metadata).includes('ace') ? 'chart' : 'dalle',
      conversation_id: conversationId,
      created_at: new Date(creationTime),
    };
    chrome.runtime.sendMessage({
      type: 'addGalleryImages',
      detail: {
        images: [galleryImage],
      },
    });
  }, 5000);
});
window.addEventListener('textdocsReceived', (event) => {
  const { conversationId, textdocs } = event.detail;
  if (!textdocs.length) return;
  chrome.runtime.sendMessage({
    type: 'addTextdocs',
    detail: {
      conversationId,
      textdocs,
    },
  });
});
window.addEventListener('authReceived', (event) => {
  chrome.runtime.sendMessage({ type: 'authReceived', detail: event.detail });
});
window.addEventListener('signoutReceived', (event) => {
  chrome.runtime.sendMessage({ type: 'signoutReceived', detail: event.detail });
});
window.addEventListener('chatRequirementsReceived', async (event) => {
  const data = event.detail;
  await processChatRequirements(data);
});
window.addEventListener('accountReceived', (event) => {
  const account = event.detail.responseData;
  chrome.storage.local.set({ account });
  if (event.detail.accessToken) {
    chrome.storage.sync.set({ accessToken: event.detail.accessToken });
  }
});

window.addEventListener('gizmoNotFound', (event) => {
  const gizmoId = getGizmoIdFromUrl(event.detail.url);
  chrome.runtime.sendMessage({ type: 'deleteSuperpowerGizmo', detail: { gizmoId } });
});

window.addEventListener('gizmosBootstrapReceived', (event) => {
  chrome.storage.local.set({ gizmosBootstrap: event.detail }, () => {
    // setTimeout(() => {
    //   renderGPTList();
    // }, 2000);
  });
});

// rename
window.addEventListener('conversationRenameReceived', (event) => {
  conversationsCache = {};
  chrome.runtime.sendMessage({
    type: 'renameConversation',
    detail: {
      conversationId: event.detail.conversationId,
      title: event.detail.title,
    },
  });
  // update sidebar folder
  const conversationTitle = document.querySelector(`#sidebar-conversation-list #conversation-card-${event.detail.conversationId} #conversation-title`);
  if (conversationTitle) {
    conversationTitle.innerText = event.detail.title;
  }
});
// delete
window.addEventListener('deleteAllReceived', () => {
  conversationsCache = {};
  resetConversationCounts();
  chrome.runtime.sendMessage({
    type: 'deleteAllConversations',
  });
  document.querySelector('#sidebar-folder-drawer #folder-breadcrubmb-root')?.click();
});
window.addEventListener('conversationDeleteReceived', (event) => {
  conversationsCache = {};
  chrome.runtime.sendMessage({
    type: 'deleteConversations',
    detail: {
      conversationIds: [event.detail.conversationId],
    },
  });
  // update sidebar folder
  document.querySelector(`#sidebar-conversation-list #conversation-card-${event.detail.conversationId}`)?.remove();
});
// archive
window.addEventListener('archivedAllReceived', () => {
  // remove all child but first one
  document.querySelector('#conversation-list')?.querySelectorAll('[id^=conversation-button]')?.forEach((item) => {
    item.remove();
  });
  conversationsCache = {};
  resetConversationCounts();
  chrome.runtime.sendMessage({
    type: 'archiveAllConversations',
  });
  // click back to folders
  document.querySelector('#sidebar-folder-drawer #folder-breadcrubmb-root')?.click();
});
window.addEventListener('conversationArchivedReceived', (event) => {
  conversationsCache = {};
  chrome.runtime.sendMessage({
    type: 'archiveConversations',
    detail: {
      conversationIds: [event.detail.conversationId],
    },
  });
  document.querySelector(`#sidebar-conversation-list #conversation-card-${event.detail.conversationId}`)?.remove();
});
window.addEventListener('conversationUnarchivedReceived', (event) => {
  conversationsCache = {};
  chrome.runtime.sendMessage({
    type: 'unarchiveConversations',
    detail: {
      conversationIds: [event.detail.conversationId],
    },
  });
});

window.addEventListener('userSettingsReceived', (event) => {
  chrome.storage.local.set({ openAIUserSettings: event.detail });
});

// window.addEventListener('gizmoDiscoveryReceived', (event) => {
//   chrome.storage.local.set({ gizmoDiscovery: event.detail });
// });

window.addEventListener('conversationLimitReceived', (event) => {
  chrome.storage.local.set({
    conversationLimit: event.detail,
  });
});

window.addEventListener('modelsReceived', (event) => {
  const data = event.detail;
  chrome.storage.local.get(['selectedModel', 'settings', 'models'], (res) => {
    const { settings, selectedModel } = res;
    chrome.storage.local.set({
      models: data.models,
      selectedModel: selectedModel || settings?.selectedModel || data.models?.[0],
    });
  });
});

// conversationSubmitted
let faviconTimeout;
window.addEventListener('conversationSubmitted', async (event) => {
  const { messages, instructions } = event.detail;
  const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
  const userMessage = messages.find((message) => message.author.role === 'user');
  if (userMessage) {
    const userMessageText = userMessage?.content?.parts?.filter((part) => typeof part === 'string')?.join(' ');
    addUserPromptToHistory(userMessageText);
    // add instructions indecator to the last message if it has instructions
    if (instructions) {
      setTimeout(() => {
        const messageId = userMessage.id;
        const userMessageElement = document.querySelector(`main article div[data-message-id="${messageId}"]`);
        addInstructionIndicators(userMessageElement, instructions);
      }, conversationIdFromUrl ? 0 : 1000);
    }
  }
  if (conversationIdFromUrl) {
    delete conversationCache[conversationIdFromUrl];
  }
  conversationsCache = {};
  // chrome.runtime.sendMessage({
  //   type: 'clearCaches',
  //   forceRefresh: true,
  //   detail: {
  //     targetKeys: ['getConversations'],
  //   },
  // });

  const { settings } = await chrome.storage.local.get(['settings']);
  faviconTimeout = settings.animateFavicon ? animateFavicon() : undefined;
});
// stopConversationReceived
window.addEventListener('stopConversationReceived', () => {
  setTimeout(() => {
    stopAnimateFavicon(faviconTimeout);
    resetPromptChain();
    const lastArticle = Array.from(document.querySelectorAll('main article'))?.pop();
    const messageId = lastArticle?.querySelector('div[data-message-id]')?.getAttribute('data-message-id');
    const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
    addPinToArticle(lastArticle, messageId, conversationIdFromUrl, false);
  }, 100);
});
// conversationReceived
window.addEventListener('conversationReceived', (event) => {
  // chrome.runtime.sendMessage({
  //   type: 'addConversations',
  //   detail: {
  //     conversations: [event.detail.conversation],
  //   },
  // });
  // backup initialize
  chrome.storage.sync.get(['isBanned'], (res) => {
    if (res.isBanned) {
      deleteAllConversations();
      return;
    }
    initializePostHistoryLoad();
  });
  const sidebarNoteInput = document.querySelector('#sidebar-note-input');
  if (!sidebarNoteInput) {
    addSidebarNoteInput();
    loadNote();
  }
});
// rgstrEventReceived
window.addEventListener('rgstrEventReceived', async (e) => {
  const { payload } = e.detail;
  const { events } = payload;
  if (!events) return;
  if (!Array.isArray(events)) return;
  const { settings } = await chrome.storage.local.get(['settings']);
  // eslint-disable-next-line no-restricted-syntax
  for (const event of events) {
    const { eventName, statsigMetadata, metadata } = event;
    if (eventName === 'chatgpt_conversation_turn_turn_exchange_complete' && metadata?.result === 'success') {
      if (settings?.autoSpeak) {
        handleAutoSpeak();
      }
      stopAnimateFavicon(faviconTimeout);
      const lastArticle = Array.from(document.querySelectorAll('main article'))?.pop();
      const messageId = lastArticle?.querySelector('div[data-message-id]')?.getAttribute('data-message-id');
      const conversationIdFromUrl = getConversationIdFromUrl(statsigMetadata?.currentPage);
      if (conversationIdFromUrl) {
        addPinToArticle(lastArticle, messageId, conversationIdFromUrl, false);
        const continueGeneratingButton = document.querySelector('main form button svg path[d="M4.47189 2.5C5.02418 2.5 5.47189 2.94772 5.47189 3.5V5.07196C7.17062 3.47759 9.45672 2.5 11.9719 2.5C17.2186 2.5 21.4719 6.75329 21.4719 12C21.4719 17.2467 17.2186 21.5 11.9719 21.5C7.10259 21.5 3.09017 17.8375 2.53689 13.1164C2.47261 12.5679 2.86517 12.0711 3.4137 12.0068C3.96223 11.9425 4.45901 12.3351 4.5233 12.8836C4.95988 16.6089 8.12898 19.5 11.9719 19.5C16.114 19.5 19.4719 16.1421 19.4719 12C19.4719 7.85786 16.114 4.5 11.9719 4.5C9.7515 4.5 7.75549 5.46469 6.38143 7H9C9.55228 7 10 7.44772 10 8C10 8.55228 9.55228 9 9 9H4.47189C3.93253 9 3.4929 8.57299 3.47262 8.03859C3.47172 8.01771 3.47147 7.99677 3.47189 7.9758V3.5C3.47189 2.94772 3.91961 2.5 4.47189 2.5Z"]');
        const continueButton = document.querySelector('#continue-conversation-button');
        if (settings.autoContinueWhenPossible && continueGeneratingButton) {
          continueGeneratingButton.parentElement.parentElement.parentElement.click();
        } else if (settings.autoClick && continueButton) {
          continueButton.click();
        } else if (runningPromptChain && runningPromptChain.steps.length > 1 && runningPromptChainStepIndex < runningPromptChain.steps.length - 1) {
          // run next prompt chain
          setTimeout(() => {
            insertNextChain(runningPromptChain, runningPromptChainStepIndex + 1);
          }, runningPromptChain.steps_delay || 2000);
        } else {
          resetPromptChain();
          if (settings?.chatEndedSound) {
            playSound('beep');
          }
          // eslint-disable-next-line no-await-in-loop
          const conversations = await getConversationsByIds([conversationIdFromUrl]);
          if (conversations?.length) {
            chrome.runtime.sendMessage({
              type: 'addConversations',
              detail: {
                conversations,
              },
            }, (res) => {
              if (res.is_new) {
                addConversationtoSidebarFolder(conversations[0]);
              }
            });
          }
        }
      }
    }
  }
});
