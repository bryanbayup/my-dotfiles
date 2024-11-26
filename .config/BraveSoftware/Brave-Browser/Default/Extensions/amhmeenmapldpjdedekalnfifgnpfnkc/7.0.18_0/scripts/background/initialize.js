// eslint-disable-next-line prefer-const
// initialize environment to be production
/* global addCustomPromptContextMenu */
let API_URL = 'https://api.wfh.team';
let STRIPE_PAYMENT_LINK_ID = '8wM5nW6oq7y287ufZ8';
let STRIPE_PORTAL_LINK_ID = '00g0237Sr78wcM03cc';
chrome.storage.local.set({ API_URL, STRIPE_PAYMENT_LINK_ID, STRIPE_PORTAL_LINK_ID });
const defaultGPTXHeaders = {};
chrome.management.getSelf(
  (extensionInfo) => {
    if (extensionInfo.installType === 'development') {
      API_URL = 'https://dev.wfh.team:8000';
      STRIPE_PAYMENT_LINK_ID = 'test_8wM9DsccF8XT9nWeUW';
      STRIPE_PORTAL_LINK_ID = 'test_28o17Id1S70U6ZOfYY';
    }
    chrome.storage.local.set({ API_URL, STRIPE_PAYMENT_LINK_ID, STRIPE_PORTAL_LINK_ID });
  },
);
function initializeStorageOnInstall() {
  chrome.storage.local.set({
    account: {},
    conversationLimit: {
      message_cap: 40,
      message_cap_window: 180,
      message_disclaimer: {
        'model-switcher': "You've reached the GPT-4 cap, which gives all ChatGPT Plus users a chance to try the model.\n\nPlease check back soon.",
        textarea: 'GPT-4 currently has a cap of 40 messages every 3 hours.',
      },
    },
    lastSelectedConversation: null,
    customInstructionProfiles: [],
    gizmoDiscovery: {},
    models: [],
    selecteModel: null,
    readNewsletterIds: [],
    userInputValueHistory: [],
    settings: {
      animateFavicon: false,
      dontShowPromptManagerMoveHelper: false,
      promptHistoryUpDownKey: true,
      copyMode: false,
      autoResetTopNav: false,
      showFavoritePromptsButton: true,
      hideNewsletter: true,
      hideReleaseNote: true,
      hideUpdateNotification: false,
      chatEndedSound: false,
      customConversationWidth: false,
      conversationWidth: 50,
      submitPromptOnEnter: true,
      promptTemplate: true,
      autoClick: false,
      showPinNav: true,
      showLanguageSelector: false,
      showToneSelector: false,
      showWritingStyleSelector: false,
      selectedLanguage: { code: 'default', name: 'Default' },
      selectedTone: { code: 'default', name: 'Default', description: 'No specific tone instruction' },
      selectedWritingStyle: { code: 'default', name: 'Default', description: 'No specific writing style instruction' },
      selectedNotesSortBy: { name: 'Update date', code: 'updated_at' },
      selectedNotesView: 'grid', // list, grid
      selectedConversationsManagerSortBy: { name: 'Update date', code: 'updated_at' },
      selectedPromptsManagerSortBy: { name: 'Update date', code: 'updated_at' },
      selectedPromptsManagerTag: { name: 'All', code: 'all' },
      selectedPromptsManagerLanguage: { name: 'All', code: 'all' },
      selectedPromptEditorLanguage: { name: 'Select', code: 'select' },
      autoContinueWhenPossible: true,
      autoSpeak: false,
      // speech to text
      speechToTextLanguage: { name: 'English (United Kingdom)', code: 'en-GB' },
      speechToTextInterimResults: true,
      autoSubmitWhenReleaseAlt: false,
      managerSidebarWidth: 220,
      excludeConvInFolders: false,
      temporaryChat: false,
      exportMode: 'both',

      autoSummarize: false,
      autoSplit: false,
      autoSplitLimit: 24000,
      autoSplitInitialPrompt: `Act like a document/text loader until you load and remember the content of the next text/s or document/s.
There might be multiple files, each file is marked by name in the format ### DOCUMENT NAME.
I will send them to you in chunks. Each chunk starts will be noted as [START CHUNK x/TOTAL], and the end of this chunk will be noted as [END CHUNK x/TOTAL], where x is the number of current chunks, and TOTAL is the number of all chunks I will send you.
I will split the message in chunks, and send them to you one by one. For each message follow the instructions at the end of the message.
Let's begin:

`,
      autoSplitChunkPrompt: `Reply with OK: [CHUNK x/TOTAL]
Don't reply with anything else!`,
    },
  });
}
chrome.runtime.onInstalled.addListener((detail) => {
  chrome.management.getSelf(
    (extensionInfo) => {
      chrome.storage.local.get({ installDate: null }, (result) => {
        if (!result.installDate) {
          chrome.storage.local.set({ installDate: Date.now() });
        }
      });
      // remove lastusersync to trigger register user on next refresh
      if (detail.reason === 'update') {
        chrome.storage.sync.remove('lastUserSync');
      }
      if (detail.reason === 'install') {
        initializeStorageOnInstall();
      }
      if (extensionInfo.installType !== 'development') {
        if (detail.reason === 'install') {
          chrome.tabs.query({ url: 'https://chatgpt.com/*', active: false }, (tabs) => {
            tabs.forEach((tab) => {
              chrome.tabs.remove(tab.id);
            });
          });
          // chrome.tabs.create({ url: 'https://ezi.notion.site/Superpower-ChatGPT-FAQ-9d43a8a1c31745c893a4080029d2eb24', active: false });
          // chrome.tabs.create({ url: 'https://superpowerdaily.com', active: false });
          // chrome.tabs.create({ url: 'https://www.youtube.com/@spchatgpt', active: false });
          chrome.tabs.create({ url: 'https://chatgpt.com/#manager/conversations', active: true });
          // } else if (detail.reason === 'update') {
          //   chrome.tabs.query({ url: 'https://www.superpowerdaily.com/', active: false }, (tabs) => {
          //     tabs.forEach((tab) => {
          //       chrome.tabs.remove(tab.id);
          //     });
          //   });

          //   checkHasSubscription(true).then((hasSubscription) => {
          //     if (!hasSubscription) {
          //       chrome.tabs.create({ url: 'https://superpowerdaily.com', active: false, pinned: true }, (tab) => {
          //         const closeTabe = () => {
          //           chrome.tabs.remove(tab.id);
          //         };
          //         setTimeout(closeTabe, 300000);
          //       });
          //     }
          //   });
        }
      }
    },
  );
});
// chrome.action.onClicked.addListener((tab) => {
//   if (!tab.url) {
//     chrome.tabs.update(tab.id, { url: 'https://chatgpt.com' });
//   } else {
//     chrome.tabs.create({ url: 'https://chatgpt.com', active: true });
//   }
// });
//-----------------------------------
async function createHash(token) {
  const msgBuffer = new TextEncoder().encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
//-----------------------------------
function registerUser(meData) {
  chrome.storage.sync.get(['name', 'url'], (syncResult) => {
    chrome.storage.local.get(['account', 'totalConversations', 'chatgptAccountId', 'settings'], (r) => {
      const settings = r.settings || {};
      const isPaid = r?.account?.accounts?.[r.chatgptAccountId || 'default']?.entitlement?.has_active_subscription || false;
      if (!isPaid && typeof settings.overrideModelSwitcher === 'undefined') {
        settings.overrideModelSwitcher = true;
        chrome.storage.local.set({ settings });
      }
      const { version } = chrome.runtime.getManifest();
      chrome.management.getSelf(
        (extensionInfo) => {
          if (extensionInfo.installType !== 'development') {
            chrome.runtime.setUninstallURL(`${API_URL}/gptx/uninstall?p=${meData?.id?.split('-')[1]}`);
          }
        },
      );
      // get navigator language
      const navigatorInfo = {
        appCodeName: navigator.appCodeName,
        connectionDownlink: navigator?.connection?.downlink,
        connectionEffectiveType: navigator?.connection?.effectiveType,
        deviceMemory: navigator.deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
        language: navigator.language,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
      };

      // create hash of access token
      createHash(meData?.accessToken?.split('Bearer ')[1]).then((hashAcessToken) => {
        defaultGPTXHeaders['Hat-Token'] = hashAcessToken;
        const body = {
          openai_id: meData.id,
          email: meData.email,
          phone_number: meData.phone_number,
          avatar: meData.picture,
          name: syncResult.name ? syncResult.name : meData.name?.trim() || meData.email,
          plus: isPaid,
          hash_access_token: hashAcessToken,
          version,
          navigator: navigatorInfo,
          total_conversations: r.totalConversations,
          multiple_accounts: r.account?.account_ordering?.length > 1 || false,
          use_websocket: r.account?.accounts?.[r.chatgptAccountId || 'default']?.features?.includes('shared_websocket') || false,
          account: r.account || null,
        };
        if (syncResult.url) body.url = syncResult.url;

        chrome.storage.sync.set({
          openai_id: meData.id,
          accessToken: meData.accessToken,
          mfa: meData.mfa_flag_enabled ? meData.mfa_flag_enabled : false,
          hashAcessToken,
        }, () => {
          // register user to the server
          fetch(`${API_URL}/gptx/register/`, {
            method: 'POST',
            headers: {
              ...defaultGPTXHeaders,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }).then((res) => res.json())
            .then((newData) => {
              if (newData.is_banned) {
                chrome.storage.local.clear(() => {
                  chrome.storage.sync.set({ isBanned: true });
                });
              }
              chrome.storage.sync.set({
                user_id: newData.id,
                name: newData.name,
                email: newData.email,
                avatar: newData.avatar,
                url: newData.url,
                version: newData.version,
                lastUserSync: typeof r.totalConversations === 'undefined' ? null : Date.now(),
              });
            }).catch((error) => {
              console.warn('error', error);
            });
        });
      });
    });
  });
}
chrome.runtime.onMessage.addListener(
  // eslint-disable-next-line no-unused-vars
  (request, sender, sendResponse) => {
    const requestType = request.type;
    if (requestType === 'authReceived') {
      const meData = request.detail;
      chrome.storage.sync.get(['user_id', 'openai_id', 'version', 'avatar', 'lastUserSync', 'accessToken', 'hashAcessToken'], (result) => {
        defaultGPTXHeaders['Hat-Token'] = result.hashAcessToken;

        const { version } = chrome.runtime.getManifest();

        const shouldRegister = !result.lastUserSync
          || result.lastUserSync < Date.now() - 1000 * 60 * 30
          || !result.avatar
          || !result.user_id
          || !result.openai_id
          || !result.accessToken
          || !result.hashAcessToken
          || result.accessToken !== meData.accessToken
          || result.version !== version;

        if (meData.id && result.openai_id !== meData.id) {
          // remove any key from localstorage except the following keys: API_URL, settings, customInstructionProfiles, readNewsletterIds, userInputValueHistory
          chrome.storage.local.get(['settings', 'customInstructionProfiles', 'readNewsletterIds', 'userInputValueHistory', 'installDate'], (res) => {
            const {
              settings, customInstructionProfiles, readNewsletterIds, userInputValueHistory, installDate,
            } = res;
            chrome.storage.local.clear(() => {
              chrome.storage.local.set({
                API_URL,
                settings,
                customInstructionProfiles,
                readNewsletterIds,
                userInputValueHistory,
                installDate,
              });
            });
          });
          // remove any key from syncstorage except the following keys: lastSeenAnnouncementId, lastSeenReleaseNoteVersion
          chrome.storage.sync.get(['lastSeenAnnouncementId', 'lastSeenReleaseNoteVersion'], (res) => {
            const {
              lastSeenAnnouncementId, lastSeenReleaseNoteVersion,
            } = res;
            chrome.storage.sync.clear(() => {
              chrome.storage.sync.set({
                lastSeenAnnouncementId,
                lastSeenReleaseNoteVersion,
              }, () => registerUser(meData));
            });
          });
        } else if (shouldRegister) {
          registerUser(meData);
        }
      });
    } else if (requestType === 'signoutReceived') {
      chrome.storage.sync.remove(['accessToken', 'hashAcessToken']);
    }
  },
);
//-----------------------------------
function checkHasSubscription(forceRefresh = false) {
  return chrome.storage.local.get(['hasSubscription', 'lastSubscriptionCheck', 'settings']).then((localRes) => {
    // if last check has subscription check once every 30 minutes
    if (!forceRefresh && localRes.hasSubscription && localRes.lastSubscriptionCheck && localRes.lastSubscriptionCheck > Date.now() - 1000 * 60 * 30) {
      return Promise.resolve(true);
    }
    // if last check not has subscription check once a minute
    if (!forceRefresh && typeof localRes.hasSubscription !== 'undefined' && !localRes.hasSubscription && localRes.lastSubscriptionCheck && localRes.lastSubscriptionCheck > Date.now() - 1000 * 60) {
      return Promise.resolve(false);
    }
    return fetch(`${API_URL}/gptx/check-has-subscription/`, {
      method: 'GET',
      headers: {
        ...defaultGPTXHeaders,
        'content-type': 'application/json',
      },
    }).then((res) => res.json()).then((res) => {
      if (res.success) {
        const newSettings = localRes?.settings;
        // set new values
        const newValues = {};
        newValues.hasSubscription = true;
        newValues.lastSubscriptionCheck = Date.now();
        if (newSettings) { // sometimes settings is not available
          newValues.settings = newSettings;
        }
        chrome.storage.local.set(newValues);
        return true;
      }
      const newSettings = localRes?.settings;
      // set new values
      const newValues = {};
      newValues.hasSubscription = false;
      newValues.lastSubscriptionCheck = Date.now();
      if (newSettings) { // sometimes settings is not available
        newValues.settings = newSettings;
      }
      chrome.storage.local.set(newValues);
      return false;
    }).catch((error) => {
      console.warn('error', error);
      return false;
    });
  });
}
function addPrompts(prompts, initialSync = false) {
  const body = {
    initial_sync: initialSync,
    prompts: prompts.map(({
      steps, title, tags = [], language, model_slug: modelSlug, steps_delay: stepsDelay = 2000, is_public: isPublic = false, is_favorite: isFavorite = false, folder = null,
    }) => ({
      steps,
      steps_delay: stepsDelay,
      title: title.trim(),
      is_public: isPublic,
      is_favorite: isFavorite,
      model_slug: modelSlug,
      tags: tags?.map((tag) => parseInt(tag, 10)),
      language: language && language !== 'select' ? language : 'en',
      folder,
    })),
  };

  return fetch(`${API_URL}/gptx/add-prompts/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => {
    chrome.contextMenus.removeAll(() => {
      addCustomPromptContextMenu();
    });
    return res.json();
  });
}

function deletePrompts(promptIds) {
  return fetch(`${API_URL}/gptx/delete-prompts/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      prompt_ids: promptIds,
    }),
  }).then((res) => {
    chrome.contextMenus.removeAll(() => {
      addCustomPromptContextMenu();
    });
    return res.json();
  });
}
function movePrompts(folderId, promptIds) {
  return fetch(`${API_URL}/gptx/move-prompts/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      folder_id: parseInt(folderId, 10),
      prompt_ids: promptIds,
    }),
  }).then((res) => res.json());
}
function togglePromptPublic(promptId) {
  return fetch(`${API_URL}/gptx/toggle-prompt-public/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      prompt_id: promptId,
    }),
  }).then((res) => res.json());
}
function toggleFavoritePrompt(promptId) {
  return fetch(`${API_URL}/gptx/toggle-favorite-prompt/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      prompt_id: promptId,
    }),
  }).then((res) => {
    chrome.contextMenus.removeAll(() => {
      addCustomPromptContextMenu();
    });
    return res.json();
  });
}
function resetAllFavoritePrompts() {
  return fetch(`${API_URL}/gptx/reset-all-favorite-prompts/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function setDefaultFavoritePrompt(promptId) {
  return fetch(`${API_URL}/gptx/set-default-favorite-prompt/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      prompt_id: promptId,
    }),
  }).then((res) => res.json());
}
function getDefaultFavoritePrompt() {
  return fetch(`${API_URL}/gptx/get-default-favorite-prompt/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}

function updateNote(conversationId, conversationName, text) {
  const body = {
    conversation_id: conversationId,
    conversation_name: conversationName,
    text,
  };

  return fetch(`${API_URL}/gptx/update-note/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}
function updateNoteName(conversationId, conversationName) {
  return fetch(`${API_URL}/gptx/update-note-name/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      conversation_name: conversationName,
    }),
  }).then((res) => res.json());
}

function getNote(conversationId) {
  return fetch(`${API_URL}/gptx/get-note/?conversation_id=${conversationId}`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getNoteForIds(conversationIds) {
  return fetch(`${API_URL}/gptx/get-note-for-ids/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ conversation_ids: conversationIds }),
  }).then((res) => res.json());
}
function getNotes(page, searchTerm = '', sortBy = 'created_at') {
  let url = `${API_URL}/gptx/get-notes/?page=${page}&order_by=${sortBy}`;
  if (searchTerm && searchTerm.trim().length > 0) {
    url += `&search=${searchTerm.trim()}`;
  }
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getNewsletters(page) {
  return fetch(`${API_URL}/gptx/newsletters-paginated/?page=${page}`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function openPromoLink(link) {
  chrome.tabs.create({ url: link, active: false });
}
function getNewsletter(id) {
  return fetch(`${API_URL}/gptx/${id}/newsletter/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getLatestNewsletter() {
  return fetch(`${API_URL}/gptx/latest-newsletter/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getLatestAnnouncement() {
  return fetch(`${API_URL}/gptx/announcements/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getReleaseNote(version) {
  return fetch(`${API_URL}/gptx/release-notes/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ version }),
  }).then((res) => res.json());
}
function getLatestVersion() {
  return fetch(`${API_URL}/gptx/latest-version/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json()).then((res) => {
    const currentVersion = chrome.runtime.getManifest().version;
    const latestVersion = res?.latest_version;
    if (latestVersion && currentVersion !== latestVersion) {
      return chrome.runtime.requestUpdateCheck().then((updateCheck) => {
        if (updateCheck.status === 'update_available' && updateCheck.version === latestVersion) {
          return updateCheck;
        }
        return {
          status: 'no_update',
          version: '',
        };
      });
    }
    return {
      status: 'no_update',
      version: '',
    };
  });
}
function reloadExtension() {
  return chrome.runtime.reload().then(() => true);
}
function submitSuperpowerGizmos(gizmos, category = '') {
  const body = {
    gizmos,
    category,
  };
  return fetch(`${API_URL}/gptx/add-gizmos/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}
function updateGizmoMetrics(gizmoId, metricName, direction) {
  const body = {
    gizmo_id: gizmoId,
    metric_name: metricName,
    direction,
  };
  return fetch(`${API_URL}/gptx/update-gizmo-metrics/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}
function deleteSuperpowerGizmo(gizmoId) {
  const body = {
    gizmo_id: gizmoId,
  };
  return fetch(`${API_URL}/gptx/delete-gizmo/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
}
function getSuperpowerGizmos(pageNumber, searchTerm, sortBy = 'recent', category = 'all') {
  // get user id from sync storage
  let url = `${API_URL}/gptx/get-gizmos/?order_by=${sortBy}`;
  if (pageNumber) url += `&page=${pageNumber}`;
  if (category !== 'all') url += `&category=${category}`;
  if (searchTerm && searchTerm.trim().length > 0) url += `&search=${searchTerm.trim()}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json()).then((res) => {
    // set id to gizmo_id
    res.results = res?.results?.map((gizmo) => ({
      ...gizmo,
      id: gizmo.gizmo_id,
      vanity_metrics: {
        num_conversations_str: gizmo.num_conversations_str,
        created_ago_str: gizmo.created_ago_str,
        review_stats: gizmo.review_stats,
      },
    }));
    return res;
  });
}
function getRandomGizmo() {
  const url = `${API_URL}/gptx/get-random-gizmo/`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json()).then((res) => ({ gizmo: { ...res[0], id: res[0].gizmo_id } }));
}
function getRedirectUrl(url) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(url, { headers: { Authorization: result.accessToken } }).then((response) => {
    if (response.redirected) {
      return response.url;
    }
    return url;
  }));
}
async function addGalleryImages(images) {
  // check if image, if download_url starts with api/content, get the redirect url
  const newImages = await Promise.all(images.map(async (image) => {
    if (image.download_url.startsWith('/api/content')) {
      const redirectUrl = await getRedirectUrl(`https://chatgpt.com${image.download_url}`);
      return { ...image, download_url: redirectUrl };
    }
    return image;
  }));
  return fetch(`${API_URL}/gptx/add-gallery-images/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ gallery_images: newImages }),
  }).then((res) => res.json());
}
function getGalleryImages(showAll = false, pageNumber = 1, searchTerm = '', byUserId = '', sortBy = 'created_at', category = 'dalle', isPublic = false) {
  let url = `${API_URL}/gptx/get-gallery-images/?order_by=${sortBy}&category=${category}`;
  if (showAll) url += '&show_all=true';
  if (searchTerm && searchTerm.trim().length > 0) url += `&search=${searchTerm}`;
  if (pageNumber) url += `&page=${pageNumber}`;
  if (byUserId) url += `&by_user_id=${byUserId}`;
  if (isPublic) url += `&is_public=${isPublic}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      return { results: [], count: 0, error: 'Something went wrong! Please try again later.' };
    }
    return response.json();
  });
}
function getSelectedGalleryImages(category = 'dalle', imageIds = [], conversationId = null) {
  const url = `${API_URL}/gptx/get-selected-gallery-images/`;
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ image_ids: imageIds, category, conversation_id: conversationId }),
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
function getGalleryImagesByDateRange(startDate, endDate, category = 'dalle') {
  return fetch(`${API_URL}/gptx/get-gallery-images-by-date-range/?start_date=${startDate}&end_date=${endDate}&category=${category}`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
function deleteGalleryImages(imageIds = [], category = 'dalle') {
  return fetch(`${API_URL}/gptx/delete-gallery-images/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ image_ids: imageIds, category }),
  }).then((res) => res.json());
}
function shareGalleryImages(imageIds = [], category = 'dalle') {
  return fetch(`${API_URL}/gptx/share-gallery-images/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ image_ids: imageIds, category }),
  }).then((res) => res.json());
}
function getPromptTags() {
  return fetch(`${API_URL}/gptx/get-prompt-tags/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
function getPromptFolders(parentFolderId = null, sortBy = 'created_at') {
  let url = `${API_URL}/gptx/get-prompt-folders/?order_by=${sortBy}`;
  if (parentFolderId) url += `&parent_folder_id=${parentFolderId}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
function addPromptFolders(folders) {
  return fetch(`${API_URL}/gptx/add-prompt-folders/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ folders }),
  }).then((response) => response.json());
}
function deletePromptFolder(folderId) {
  return fetch(`${API_URL}/gptx/delete-prompt-folder/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ folder_id: parseInt(folderId, 10) }),
  }).then((response) => {
    chrome.contextMenus.removeAll(() => {
      addCustomPromptContextMenu();
    });
    return response.json();
  });
}
function updatePromptFolder(folderId, newData) {
  if (newData.image) {
    const byteString = atob(newData.image.base64);
    const arrayBuffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }
    // Create a Blob from the ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: newData.image.type });
    // Create a File object from the Blob
    const file = new File([blob], newData.image.name, { type: newData.image.type });
    newData.image = file;
    // Now you have a file object reconstructed and you can use it as required.
  }

  const data = new FormData();
  data.append('folder_id', parseInt(folderId, 10));
  Object.keys(newData).forEach((key) => {
    data.append(key, newData[key]);
  });
  return fetch(`${API_URL}/gptx/update-prompt-folder/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      // 'content-type': 'application/json',
    },
    body: data,
  }).then((response) => response.json());
}
function duplicatePrompt(promptId) {
  return fetch(`${API_URL}/gptx/duplicate-prompt/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ prompt_id: promptId }),
  }).then((response) => {
    chrome.contextMenus.removeAll(() => {
      addCustomPromptContextMenu();
    });
    return response.json();
  });
}
function updatePrompt(promptData) {
  const {
    id: promptId, steps, steps_delay: stepsDelay, title, is_public: isPublic = false, model_slug: modelSlug, tags = [], language, folder, is_favorite: isFavorite = false,
  } = promptData;
  // post
  const body = {
    prompt_id: promptId,
    steps,
    steps_delay: stepsDelay,
    title: title.trim(),
    is_public: isPublic,
    is_favorite: isFavorite,
    model_slug: modelSlug,
    tags: tags.map((tag) => parseInt(tag, 10)),
    language: language && language !== 'select' ? language : 'en',
    folder,
  };
  return fetch(`${API_URL}/gptx/update-prompt/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((response) => {
    if (typeof promptData.isFavorite !== 'undefined') {
      chrome.contextMenus.removeAll(() => {
        addCustomPromptContextMenu();
      });
    }
    return response.json();
  });
}
function getPrompts(pageNumber, searchTerm, sortBy = 'created_at', language = 'all', tag = 'all', folderId = null, isFavorite = null, isPublic = null, deepSearch = false) {
  // get user id from sync storage
  let url = `${API_URL}/gptx/?order_by=${sortBy}`;
  if (sortBy === 'mine') url = `${API_URL}/gptx/?order_by=${sortBy}`;
  if (folderId) url += `&folder_id=${folderId}`;
  if (isFavorite !== null) url += `&is_favorite=${isFavorite}`;
  if (isPublic !== null) url += `&is_public=${isPublic}`;
  if (pageNumber) url += `&page=${pageNumber}`;
  if (language !== 'all') url += `&language=${language}`;
  if (tag !== 'all') url += `&tag=${tag}`;
  if (searchTerm && searchTerm.trim().length > 0) url += `&search=${searchTerm}`;
  if (deepSearch) url += '&deep_search=true';

  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return { results: [], count: 0, error: 'Something went wrong! Please try again later.' };
  });
}
function getAllPrompts(folderId = null) {
  return fetch(`${API_URL}/gptx/all-prompts/${folderId ? `?folder_id=${folderId}` : ''}`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
// backupHeaders for when calling from contextmenu
function getPrompt(promptId, backupHeaders = {}) {
  const url = `${API_URL}/gptx/${promptId}/`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      ...backupHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
function getPromptsCount() {
  return fetch(`${API_URL}/gptx/prompts-count/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
// backupHeaders for when calling from contextmenu
function getAllFavoritePrompts(backupHeaders = {}) {
  return fetch(`${API_URL}/gptx/get-all-favorite-prompts/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      ...backupHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
function getPromptByTitle(promptTitle) {
  const url = `${API_URL}/gptx/prompt-by-title/?title=${promptTitle}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
}
function incrementPromptUseCount(promptId) {
  // increment use count
  const url = `${API_URL}/gptx/${promptId}/use-count/`;
  return fetch(url, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  }).then((response) => response.json());
}

function votePrompt(promptId, voteType) {
  // update vote count
  const url = `${API_URL}/gptx/${promptId}/vote/`;
  return fetch(url, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vote_type: voteType }),
  }).then((response) => response.json());
}

function reportPrompt(promptId) {
  // increment report count
  const url = `${API_URL}/gptx/${promptId}/report/`;
  return fetch(url, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  }).then((response) => response.json());
}

function incrementOpenRate(announcementId) {
  const url = `${API_URL}/gptx/increment-open-rate/`;
  return fetch(url, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ announcement_id: announcementId }),
  }).then((response) => response.json());
}

function incrementClickRate(announcementId) {
  const url = `${API_URL}/gptx/increment-click-rate/`;
  return fetch(url, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ announcement_id: announcementId }),
  }).then((response) => response.json());
}

function incrementPromoLinkClickRate(announcementId, promoLink) {
  const url = `${API_URL}/gptx/increment-promo-link-click-rate/`;
  return fetch(url, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ announcement_id: announcementId, promo_link: promoLink }),
  }).then((response) => response.json());
}

function getRemoteSettings() {
  // convert
  // created_at: "2024-02-25T20:36:19.473406-08:00"id: 1, key: "syncOldImages", value: false
  // to
  // {
  //   "syncOldImages": false
  // }
  return fetch(`${API_URL}/gptx/remote-settings/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then(
    (res) => res.json(),
  ).then((remoteSettings) => {
    const settings = {};
    remoteSettings.forEach((setting) => {
      settings[setting.key] = setting.value;
    });
    return settings;
  });
}
function addTextdocs(conversationId, textdocs) {
  return fetch(`${API_URL}/gptx/add-textdocs/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ conversation_id: conversationId, textdocs }),
  }).then((res) => res.json());
}
function getCustomInstructionProfile(id) {
  return fetch(`${API_URL}/gptx/get-custom-instruction-profile/?profile_id=${id}`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getCustomInstructionProfiles(pageNumber, searchTerm = '', sortBy = 'created_at') {
  let url = `${API_URL}/gptx/get-custom-instruction-profiles/?order_by=${sortBy}`;
  if (pageNumber) url += `&page=${pageNumber}`;
  if (searchTerm && searchTerm.trim().length > 0) url += `&search=${searchTerm}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function addCustomInstructionProfile(profile) {
  return fetch(`${API_URL}/gptx/add-custom-instruction-profile/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ profile }),
  }).then((res) => res.json());
}
function deleteCustomInstructionProfile(profileId) {
  return fetch(`${API_URL}/gptx/delete-custom-instruction-profile/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ profile_id: profileId }),
  }).then((res) => res.json());
}
function getPinnedMessages(pageNumber, conversationId = null, searchTerm = '') {
  let url = `${API_URL}/gptx/get-pinned-messages/`;
  if (pageNumber) url += `?page=${pageNumber}`;
  if (conversationId) url += `&conversation_id=${conversationId}`;
  if (searchTerm && searchTerm.trim().length > 0) url += `&search=${searchTerm}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getAllPinnedMessagesByConversationId(conversationId) {
  return fetch(`${API_URL}/gptx/get-all-pinned-messages-by-conversation-id/?conversation_id=${conversationId}`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function addPinnedMessages(pinnedMessages) {
  return fetch(`${API_URL}/gptx/add-pinned-messages/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ pinned_messages: pinnedMessages }),
  }).then((res) => res.json());
}
function addPinnedMessage(conversationId, messageId, message) {
  return fetch(`${API_URL}/gptx/add-pinned-message/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ conversation_id: conversationId, message_id: messageId, message }),
  }).then((res) => res.json());
}
function deletePinnedMessage(messageId) {
  return fetch(`${API_URL}/gptx/delete-pinned-message/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ message_id: messageId }),
  }).then((res) => res.json());
}

function updateCustomInstructionProfile(profileId, profile) {
  return fetch(`${API_URL}/gptx/update-custom-instruction-profile/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ profile_id: parseInt(profileId, 10), profile }),
  }).then((res) => res.json());
}
function updateCustomInstructionProfileByData(profile) {
  return fetch(`${API_URL}/gptx/update-custom-instruction-profile-by-data/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      about_model_message: profile.aboutModelMessage, about_user_message: profile.aboutUserMessage, enabled: profile.enabled, disabled_tools: profile.disabledTools,
    }),
  }).then((res) => res.json());
}
function getConversationFolders(parentFolderId = null, sortBy = 'created_at') {
  let url = `${API_URL}/gptx/get-conversation-folders/?order_by=${sortBy}`;
  if (parentFolderId) url += `&parent_folder_id=${parentFolderId}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}

function addConversationFolders(folders) {
  return fetch(`${API_URL}/gptx/add-conversation-folders/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ folders }),
  }).then((res) => res.json());
}
function deleteConversationFolders(folderIds) {
  return fetch(`${API_URL}/gptx/delete-conversation-folders/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ folder_ids: folderIds }),
  }).then((res) => res.json());
}
function updateConversationFolder(folderId, newData) {
  if (newData.image) {
    const byteString = atob(newData.image.base64);
    const arrayBuffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }
    // Create a Blob from the ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: newData.image.type });
    // Create a File object from the Blob
    const file = new File([blob], newData.image.name, { type: newData.image.type });
    newData.image = file;
    // Now you have a file object reconstructed and you can use it as required.
  }

  const data = new FormData();
  data.append('folder_id', parseInt(folderId, 10));
  Object.keys(newData).forEach((key) => {
    data.append(key, newData[key]);
  });
  return fetch(`${API_URL}/gptx/update-conversation-folder/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      // 'content-type': 'application/json',
    },
    body: data,
  }).then((res) => res.json());
}
function removeConversationFolderImage(folderId) {
  return fetch(`${API_URL}/gptx/remove-conversation-folder-image/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ folder_id: parseInt(folderId, 10) }),
  }).then((res) => res.json());
}
function moveConversationsToFolder(folderId, conversations) {
  return fetch(`${API_URL}/gptx/move-conversations-to-folder/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ folder_id: parseInt(folderId, 10), conversations }),
  }).then((res) => res.json());
}
function removeConversationsFromFolder(conversationIds) {
  return fetch(`${API_URL}/gptx/remove-conversations-from-folder/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ conversation_ids: conversationIds }),
  }).then((res) => res.json());
}
function moveConversationIdsToFolder(folderId, conversationIds) {
  return fetch(`${API_URL}/gptx/move-conversation-ids-to-folder/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ folder_id: parseInt(folderId, 10), conversation_ids: conversationIds }),
  }).then((res) => res.json());
}
function getConversations(folderId, sortBy = 'updated_at', pageNumber = 1, fullSearch = false, searchTerm = '', isFavorite = null, isArchived = null, isTemporary = null, excludeConvInFolders = false) {
  let url = `${API_URL}/gptx/get-conversations/?order_by=${sortBy}`;
  if (folderId) url += `&folder_id=${folderId}`;
  if (pageNumber) url += `&page=${pageNumber}`;
  if (searchTerm && searchTerm.trim().length > 0) url += `&search=${searchTerm}`;
  if (fullSearch) url += '&full_search=true';
  if (isFavorite !== null) url += `&is_favorite=${isFavorite}`;
  if (isArchived !== null) url += `&is_archived=${isArchived}`;
  if (isTemporary !== null) url += `&is_temporary=${isTemporary}`;
  if (excludeConvInFolders) url += '&exclude_conv_in_folders=true';
  return fetch(url, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getNonSyncedConversationIds() {
  return fetch(`${API_URL}/gptx/get-non-synced-conversation-ids/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getNonSyncedConversationCount() {
  return fetch(`${API_URL}/gptx/get-non-synced-conversation-count/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getSyncedConversationCount() {
  return fetch(`${API_URL}/gptx/get-synced-conversation-count/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getConversation(conversationId) {
  return fetch(`${API_URL}/gptx/get-conversation/?conversation_id=${conversationId}`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getTotalConversationsCount() {
  return fetch(`${API_URL}/gptx/get-total-conversations-count/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getTotalArchivedConversationsCount() {
  return fetch(`${API_URL}/gptx/get-total-archived-conversations-count/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getAllFavoriteConversationIds() {
  return fetch(`${API_URL}/gptx/get-all-favorite-conversation-ids/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getAllFolderConversationIds(folderId) {
  return fetch(`${API_URL}/gptx/get-all-folder-conversation-ids/?folder_id=${folderId}`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function getAllNoteConversationIds() {
  return fetch(`${API_URL}/gptx/get-all-note-conversation-ids/`, {
    method: 'GET',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function addConversations(conversations, initialSync = false) {
  return fetch(`${API_URL}/gptx/add-conversations/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ conversations, initial_sync: initialSync }),
  }).then((res) => res.json());
}
function addConversation(conversation) {
  return fetch(`${API_URL}/gptx/add-conversation/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ conversation }),
  }).then((res) => res.json());
}
function renameConversation(conversationId, title) {
  return fetch(`${API_URL}/gptx/rename-conversation/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ conversation_id: conversationId, title }),
  }).then((res) => res.json());
}
function toggleConversationFavorite(conversation) {
  return fetch(`${API_URL}/gptx/toggle-conversation-favorite/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ conversation }),
  }).then((res) => res.json());
}
function resetAllFavoriteConversations() {
  return fetch(`${API_URL}/gptx/reset-all-favorite-conversations/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function deleteConversations(conversationIds) {
  return fetch(`${API_URL}/gptx/delete-conversations/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ conversation_ids: conversationIds }),
  }).then((res) => res.json());
}
function deleteAllConversations() {
  return fetch(`${API_URL}/gptx/delete-all-conversations/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function deleteAllArchivedConversations() {
  return fetch(`${API_URL}/gptx/delete-all-archived-conversations/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
function archiveConversations(conversationIds) {
  return fetch(`${API_URL}/gptx/archive-conversations/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ conversation_ids: conversationIds }),
  }).then((res) => res.json());
}
function unarchiveConversations(conversationIds) {
  return fetch(`${API_URL}/gptx/unarchive-conversations/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ conversation_ids: conversationIds }),
  }).then((res) => res.json());
}
function archiveAllConversations() {
  return fetch(`${API_URL}/gptx/archive-all-conversations/`, {
    method: 'POST',
    headers: {
      ...defaultGPTXHeaders,
      'content-type': 'application/json',
    },
  }).then((res) => res.json());
}
//-----------------------------------
async function initConvHistorySync(tabId, syncIntervalTime = 7000) {
  let syncedHistoryCount = await getTotalConversationsCount();
  const firstConv = await apiGetConversations(0, 1);
  const { total } = firstConv;
  const limit = 100;
  if (syncedHistoryCount - 50 >= total) {
    initializeConversationSync(tabId, syncIntervalTime);
    return;
  }
  for (let offset = 0; offset < total; offset += limit) {
    // eslint-disable-next-line no-await-in-loop
    const response = await apiGetConversations(offset, limit);
    const conversations = response.items.map((item) => ({
      ...item,
      conversation_id: item.id,
      create_time: new Date(item.create_time).getTime() / 1000,
      update_time: new Date(item.update_time).getTime() / 1000,
    }));
    // eslint-disable-next-line no-await-in-loop
    await addConversations(conversations);
    clearCache('getConversations');
    clearCache('getConversation');
    // eslint-disable-next-line no-await-in-loop
    syncedHistoryCount = await getTotalConversationsCount();
    if (syncedHistoryCount >= total) {
      initializeConversationSync(tabId, syncIntervalTime);
      break;
    }
  }
}

let activeTabId = null;
let convSyncInterval = null;
function initializeConversationSync(tabId, syncIntervalTime = 7000) {
  // Check if the function is already running in another tab
  chrome.storage.local.get(['isRunningConvSync'], (result) => {
    if (result.isRunningConvSync) {
      // console.log('Sync is already running in this tab or another tab');
      return; // Exit if the function is running in another tab
    }

    // Set the flag to indicate that the function is running
    chrome.storage.local.set({ isRunningConvSync: true }, () => {
      activeTabId = tabId;
      // console.log('Sync started running in tab:', tabId);

      // Your function logic here
      runConversationSync(tabId, syncIntervalTime);
    });
  });
}
// Handle tab closure or refresh
chrome.tabs.onRemoved.addListener((tabId, _removeInfo) => {
  if (tabId === activeTabId) {
    // Tab where the function was running is closed, reset the isRunningConvSync flag
    // console.log(`Tab ${tabId} closed. Resetting function state.`);
    chrome.storage.local.set({ isRunningConvSync: false });
    activeTabId = null;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, _tab) => {
  if (tabId === activeTabId && changeInfo.status === 'loading') {
    // Tab where the function was running is being refreshed, reset the isRunningConvSync flag
    // console.log(`Tab ${tabId} refreshed. Resetting function state.`);
    chrome.storage.local.set({ isRunningConvSync: false });
    activeTabId = null;
  }
});

function runConversationSync(tabId, syncIntervalTime) {
  chrome.storage.local.set({ lastConvSyncActivity: Date.now() });

  getNonSyncedConversationIds().then((nonSyncedConvIds) => {
    // if not array
    if (!Array.isArray(nonSyncedConvIds)) return;
    if (nonSyncedConvIds.length === 0) return;
    // every 5 seconds, get one conversation and sync it
    let i = 0;
    clearInterval(convSyncInterval);
    convSyncInterval = setInterval(async () => {
      if (i >= nonSyncedConvIds.length) {
        clearInterval(convSyncInterval);
        // Once done, reset the flag
        chrome.storage.local.set({ isRunningConvSync: false, lastConvSyncActivity: null }, () => {
          activeTabId = null; // Reset active tab ID
          // console.log('Sync finished running.');
        });
        return;
      }
      const conversationId = nonSyncedConvIds[i];
      try {
        chrome.storage.local.set({ lastConvSyncActivity: Date.now() });
        // eslint-disable-next-line no-await-in-loop
        const conversation = await apiGetConversation(conversationId);
        if (conversation) {
          await addConversations([conversation]);
          clearCache('getConversations');
          clearCache('getConversation');
          await syncConversationImages(conversation);
        }
      } catch (error) {
        // console.error('Failed to sync conversation', error);
      }
      i += 1;
    }, syncIntervalTime);
  });
}
async function syncConversationImages(conversation) {
  const allSyncImages = [];
  const mapping = conversation?.mapping;
  const messages = Object.values(mapping);
  for (let j = 0; j < messages.length; j += 1) {
    const { message } = messages[j];
    const shouldAddMessage = message?.author?.name === 'dalle.text2im' || message?.content?.text?.includes('<<ImageDisplayed>>');
    if (!shouldAddMessage) continue;

    const dalleImages = (message?.content?.parts || [])?.filter((part) => part?.content_type === 'image_asset_pointer').map((part) => ({ category: 'dalle', ...part })) || [];
    const chartImages = message?.metadata?.aggregate_result?.messages?.filter((msg) => msg?.message_type === 'image').map((msg) => ({ category: 'chart', ...msg })) || [];
    const allImages = [...dalleImages, ...chartImages];
    for (let k = 0; k < allImages.length; k += 1) {
      const image = allImages[k];
      const imageId = image.category === 'dalle'
        ? image?.asset_pointer?.split('file-service://')[1]
        : image?.image_url?.split('file-service://')[1];
      if (!imageId) return;
      const { width, height } = image;
      const prompt = image.category === 'dalle' ? image?.metadata?.dalle?.prompt : message?.metadata?.aggregate_result?.code;

      const genId = image?.metadata?.dalle?.gen_id;
      const seed = image?.metadata?.dalle?.seed;
      const imageNode = {
        conversation_id: conversation.conversation_id,
        image_id: imageId,
        width,
        height,
        prompt,
        gen_id: genId,
        seed,
        category: image.category,
        is_public: false,
      };

      // eslint-disable-next-line no-await-in-loop
      const response = await apiGetDownloadUrlFromFileId(imageId);
      imageNode.download_url = response.download_url;
      if (response.creation_time) {
        imageNode.created_at = new Date(response.creation_time);
      } else {
        imageNode.created_at = new Date(formatTime(message?.create_time));
      }
      allSyncImages.push(imageNode);
    }
  }
  if (allSyncImages.length > 0) {
    await addGalleryImages(allSyncImages);
    clearCache('getGalleryImages');
    clearCache('getGalleryImagesByDateRange');
  }
}
function apiGetDownloadUrlFromFileId(fileId) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chatgpt.com/backend-api/files/download/${fileId}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Oai-Language': 'en-US',
      Authorization: result.accessToken,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  }).then((data) => data));
}
function apiGetConversation(conversationId) {
  return chrome.storage.sync.get(['accessToken']).then((result) => fetch(`https://chatgpt.com/backend-api/conversation/${conversationId}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Oai-Language': 'en-US',
      Authorization: result.accessToken,
    },
    signal: AbortSignal.timeout(10000),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }

    if (response?.status && response?.status?.toString()?.startsWith('5')) {
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  }).catch((err) => {
    // console.error('API call failed or was rejected', err);
    chrome.storage.local.set({ lastConvSyncActivity: Date.now() });
    Promise.reject(err);
  }));
}
// needed to move this to client due to cf cookie
async function apiGetConversations(offset = 0, limit = 100, order = 'updated', isArchived = false) {
  const chatGPTTabs = await chrome.tabs.query({ url: 'https://chatgpt.com/*' });

  const chatGPTTab = chatGPTTabs.find((tab) => tab.active) || chatGPTTabs[0];
  if (chatGPTTab) {
    const conversations = await chrome.tabs.sendMessage(chatGPTTab.id, {
      type: 'getConversations',
      detail: {
        offset, limit, order, isArchived,
      },
    });
    return conversations;
  }
  return null;
}
function formatTime(time) {
  if (!time) return time;
  // if time in format "2023-11-11T21:37:10.479788+00:00"
  if (time.toString().indexOf('T') !== -1) {
    return new Date(time).getTime();
  }
  // if time in format 1699691863.236379 (10 digits before dot)
  if (time.toString().indexOf('.') !== -1 && time.toString().split('.')[0].length === 10) {
    return new Date(time * 1000).getTime();
  }
  // if time in format 1699691863236.379 (13 digits before dot)
  if (time.toString().indexOf('.') !== -1 && time.toString().split('.')[0].length === 13) {
    return new Date(time).getTime();
  }
  // if time in format 1699691863242 (13 digits)
  if (time.toString().length === 13) {
    return new Date(time).getTime();
  }
  // if time is 10 digit
  if (time.toString().length === 10) {
    return new Date(time * 1000).getTime();
  }

  return time;
}
// Periodic health check to ensure sync is still progressing
function monitorSyncHealth() {
  const checkInterval = 30 * 1000; // Check every 30 seconds
  const inactivityThreshold = 60 * 1000; // 1 minute

  setInterval(() => {
    chrome.storage.local.get(['isRunningConvSync', 'lastConvSyncActivity'], (result) => {
      if (!result.isRunningConvSync) return; // Sync is not running, nothing to do

      const lastActivity = result.lastConvSyncActivity || 0;
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastActivity;

      // If no activity for 1 minutes, reset the sync process
      if (elapsedTime > inactivityThreshold) {
        // console.log('Sync has been inactive for too long. Resetting state.');
        chrome.storage.local.set({ isRunningConvSync: false, lastConvSyncActivity: null });
      }
    });
  }, checkInterval); // Run every 30 seconds
}
// Call the health check monitor when the extension is loaded
monitorSyncHealth();
//-----------------------------------
let spCache = {};

const CACHE_EXPIRATION_TIME = 6 * 60 * 60 * 1000; // Cache expiration time in milliseconds (e.g., 6 hours)
function setCache(key, value) {
  spCache[key] = {
    value,
    expiry: Date.now() + CACHE_EXPIRATION_TIME,
  };
}
function getCache(key) {
  const cachedItem = spCache[key];
  if (cachedItem && cachedItem.expiry > Date.now()) {
    return cachedItem.value;
  }
  delete spCache[key];
  return null;
}
function clearCache(targetKey) {
  Object.keys(spCache).forEach((key) => {
    if (key.includes(targetKey)) {
      delete spCache[key];
    }
  });
}
function clearCaches(targetKeys) {
  targetKeys.forEach((targetKey) => {
    clearCache(targetKey);
  });
}
function clearAllCache() {
  spCache = {};
}
async function makeCacheKey(requestType, data) {
  const hashedData = await createHash(JSON.stringify({ data }));
  return `${requestType}-${hashedData}`;
}
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    (async () => {
      chrome.storage.sync.get(['hashAcessToken'], async (result) => {
        if (!result.hashAcessToken || result.hashAcessToken === undefined) {
          sendResponse({ error: 'No access token found' });
          return;
        }
        defaultGPTXHeaders['Hat-Token'] = result.hashAcessToken;

        const requestType = request.type;
        const forceRefresh = request.forceRefresh || false;
        const data = request.detail;

        const cacheKey = await makeCacheKey(requestType, data);

        // Check if the response is cached
        const cachedResponse = getCache(cacheKey);
        if (cachedResponse && !forceRefresh) {
          sendResponse(cachedResponse);
          return;
        }
        if (requestType === 'checkHasSubscription') {
          checkHasSubscription().then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getConversationFolders') {
          getConversationFolders(data.parentFolderId, data.sortBy).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'addConversationFolders') {
          addConversationFolders(data.folders).then((res) => {
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'deleteConversationFolders') {
          deleteConversationFolders(data.folderIds).then((res) => {
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'updateConversationFolder') {
          updateConversationFolder(data.folderId, data.newData).then((res) => {
            clearCache('getConversationFolders');
            clearCache('getConversations');
            sendResponse(res);
          });
        } else if (requestType === 'removeConversationFolderImage') {
          removeConversationFolderImage(data.folderId).then((res) => {
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'moveConversationsToFolder') {
          moveConversationsToFolder(data.folderId, data.conversations).then((res) => {
            clearCache('getConversations');
            clearCache('getAllFolderConversationIds');
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'removeConversationsFromFolder') {
          removeConversationsFromFolder(data.conversationIds).then((res) => {
            clearCache('getConversations');
            clearCache('getAllFolderConversationIds');
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'moveConversationIdsToFolder') {
          moveConversationIdsToFolder(data.folderId, data.conversationIds).then((res) => {
            clearCache('getConversations');
            clearCache('getAllFolderConversationIds');
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'getConversations') {
          getConversations(data.folderId, data.sortBy, data.pageNumber, data.fullSearch, data.searchTerm, data.isFavorite, data.isArchived, data.isTemporary, data.excludeConvInFolders).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getNonSyncedConversationIds') {
          getNonSyncedConversationIds().then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'getNonSyncedConversationCount') {
          getNonSyncedConversationCount().then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'getSyncedConversationCount') {
          getSyncedConversationCount().then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'initializeConversationSync' && sender.tab) {
          initializeConversationSync(sender.tab.id);
        } else if (requestType === 'initConvHistorySync' && sender.tab) {
          initConvHistorySync(sender.tab.id, data.syncIntervalTime);
        } else if (requestType === 'getConversation') {
          getConversation(data.conversationId).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getTotalConversationsCount') {
          getTotalConversationsCount().then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'getTotalArchivedConversationsCount') {
          getTotalArchivedConversationsCount().then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'getAllFavoriteConversationIds') {
          getAllFavoriteConversationIds().then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getAllFolderConversationIds') {
          getAllFolderConversationIds(data.folderId).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getAllNoteConversationIds') {
          getAllNoteConversationIds().then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'addConversations') {
          addConversations(data.conversations, data.initialSync).then((res) => {
            clearCache('getConversations');
            clearCache('getConversation');
            sendResponse(res);
          });
        } else if (requestType === 'addConversation') {
          addConversation(data.conversation).then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'renameConversation') {
          renameConversation(data.conversationId, data.title).then((res) => {
            clearCache('getConversations');
            clearCache('getConversation');
            sendResponse(res);
          });
        } else if (requestType === 'toggleConversationFavorite') {
          toggleConversationFavorite(data.conversation).then((res) => {
            clearCache('getConversations');
            clearCache('getConversation');
            clearCache('getAllFavoriteConversationIds');
            sendResponse(res);
          });
        } else if (requestType === 'resetAllFavoriteConversations') {
          resetAllFavoriteConversations().then((res) => {
            clearCache('getConversations');
            clearCache('getConversation');
            clearCache('getAllFavoriteConversationIds');
            sendResponse(res);
          });
        } else if (requestType === 'deleteConversations') {
          deleteConversations(data.conversationIds).then((res) => {
            clearCache('getConversations');
            clearCache('getConversation');
            clearCache('getAllFavoriteConversationIds');
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'deleteAllConversations') {
          deleteAllConversations().then((res) => {
            clearCache('getConversations');
            clearCache('getConversation');
            clearCache('getAllFavoriteConversationIds');
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'deleteAllArchivedConversations') {
          deleteAllArchivedConversations().then((res) => {
            clearCache('getConversations');
            clearCache('getConversation');
            clearCache('getAllFavoriteConversationIds');
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'archiveConversations') {
          archiveConversations(data.conversationIds).then((res) => {
            clearCache('getConversations');
            clearCache('getConversation');
            clearCache('getAllFavoriteConversationIds');
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'unarchiveConversations') {
          unarchiveConversations(data.conversationIds).then((res) => {
            clearCache('getConversations');
            clearCache('getConversation');
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'archiveAllConversations') {
          archiveAllConversations().then((res) => {
            clearCache('getConversations');
            clearCache('getConversation');
            clearCache('getAllFavoriteConversationIds');
            clearCache('getConversationFolders');
            sendResponse(res);
          });
        } else if (requestType === 'addTextdocs') {
          addTextdocs(data.conversationId, data.textdocs).then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'getCustomInstructionProfile') {
          getCustomInstructionProfile(data.profileId).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getCustomInstructionProfiles') {
          getCustomInstructionProfiles(data.pageNumber, data.searchTerm, data.sortBy).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'addCustomInstructionProfile') {
          addCustomInstructionProfile(data.profile).then((res) => {
            clearCache('getCustomInstructionProfiles');
            sendResponse(res);
          });
        } else if (requestType === 'updateCustomInstructionProfile') {
          updateCustomInstructionProfile(data.profileId, data.profile).then((res) => {
            clearCache('getCustomInstructionProfiles');
            clearCache('getCustomInstructionProfile');
            sendResponse(res);
          });
        } else if (requestType === 'updateCustomInstructionProfileByData') {
          updateCustomInstructionProfileByData(data.profile).then((res) => {
            clearCache('getCustomInstructionProfiles');
            clearCache('getCustomInstructionProfile');
            sendResponse(res);
          });
        } else if (requestType === 'deleteCustomInstructionProfile') {
          deleteCustomInstructionProfile(data.profileId).then((res) => {
            clearCache('getCustomInstructionProfiles');
            clearCache('getCustomInstructionProfile');
            sendResponse(res);
          });
        } else if (requestType === 'getPinnedMessages') {
          getPinnedMessages(data.pageNumber, data.conversationId, data.searchTerm).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getAllPinnedMessagesByConversationId') {
          getAllPinnedMessagesByConversationId(data.conversationId).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'addPinnedMessages') {
          addPinnedMessages(data.pinnedMessages).then((res) => {
            clearCache('getPinnedMessages');
            clearCache('getAllPinnedMessagesByConversationId');
            sendResponse(res);
          });
        } else if (requestType === 'addPinnedMessage') {
          addPinnedMessage(data.conversationId, data.messageId, data.message).then((res) => {
            clearCache('getPinnedMessages');
            clearCache('getAllPinnedMessagesByConversationId');
            sendResponse(res);
          });
        } else if (requestType === 'deletePinnedMessage') {
          deletePinnedMessage(data.messageId).then((res) => {
            clearCache('getPinnedMessages');
            clearCache('getAllPinnedMessagesByConversationId');
            sendResponse(res);
          });
        } else if (requestType === 'addPrompts') {
          addPrompts(data.prompts, data.initialSync).then((res) => {
            clearCache('getPrompts');
            clearCache('getPrompt');
            clearCache('getPromptFolders');
            clearCache('getAllFavoritePrompts');
            sendResponse(res);
          });
        } else if (requestType === 'updatePrompt') {
          updatePrompt(data.promptData).then((res) => {
            clearCache('getPrompts');
            clearCache('getPrompt');
            clearCache('getAllFavoritePrompts');
            sendResponse(res);
          });
        } else if (requestType === 'getPrompt') {
          getPrompt(data.promptId).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getPromptsCount') {
          getPromptsCount().then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'getPrompts') {
          getPrompts(data.pageNumber, data.searchTerm, data.sortBy, data.language, data.tag, data.folderId, data.isFavorite, data.isPublic).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getAllPrompts') {
          getAllPrompts(data.folderId).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getPromptByTitle') {
          getPromptByTitle(data.title).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getAllFavoritePrompts') {
          getAllFavoritePrompts().then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'deletePrompts') {
          deletePrompts(data.promptIds).then((res) => {
            clearCache('getPrompts');
            clearCache('getPrompt');
            clearCache('getPromptFolders');
            clearCache('getAllFavoritePrompts');
            sendResponse(res);
          });
        } else if (requestType === 'movePrompts') {
          movePrompts(data.folderId, data.promptIds).then((res) => {
            clearCache('getPrompts');
            clearCache('getPrompt');
            clearCache('getPromptFolders');
            sendResponse(res);
          });
        } else if (requestType === 'togglePromptPublic') {
          togglePromptPublic(data.promptId).then((res) => {
            clearCache('getPrompts');
            clearCache('getPrompt');
            sendResponse(res);
          });
        } else if (requestType === 'toggleFavoritePrompt') {
          toggleFavoritePrompt(data.promptId).then((res) => {
            clearCache('getPrompts');
            clearCache('getPrompt');
            clearCache('getAllFavoritePrompts');
            sendResponse(res);
          });
        } else if (requestType === 'resetAllFavoritePrompts') {
          resetAllFavoritePrompts().then((res) => {
            clearCache('getPrompts');
            clearCache('getPrompt');
            clearCache('getAllFavoritePrompts');
            sendResponse(res);
          });
        } else if (requestType === 'setDefaultFavoritePrompt') {
          setDefaultFavoritePrompt(data.promptId).then((res) => {
            clearCache('getPrompts');
            clearCache('getPrompt');
            clearCache('getAllFavoritePrompts');
            clearCache('getDefaultFavoritePrompt');
            sendResponse(res);
          });
        } else if (requestType === 'getDefaultFavoritePrompt') {
          getDefaultFavoritePrompt().then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'duplicatePrompt') {
          duplicatePrompt(data.promptId).then((res) => {
            clearCache('getPrompts');
            clearCache('getPrompt');
            clearCache('getPromptFolders');
            clearCache('getAllFavoritePrompts');
            clearCache('getDefaultFavoritePrompt');
            sendResponse(res);
          });
        } else if (requestType === 'incrementPromptUseCount') {
          incrementPromptUseCount(data.promptId).then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'votePrompt') {
          votePrompt(data.promptId, data.voteType).then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'reportPrompt') {
          reportPrompt(data.promptId).then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'getPromptTags') {
          getPromptTags().then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getPromptFolders') {
          getPromptFolders(data.parentFolderId, data.sortBy).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'addPromptFolders') {
          addPromptFolders(data.folders).then((res) => {
            clearCache('getPromptFolders');
            sendResponse(res);
          });
        } else if (requestType === 'deletePromptFolder') {
          deletePromptFolder(data.folderId).then((res) => {
            clearCache('getPromptFolders');
            sendResponse(res);
          });
        } else if (requestType === 'updatePromptFolder') {
          updatePromptFolder(data.folderId, data.newData).then((res) => {
            clearCache('getPromptFolders');
            sendResponse(res);
          });
        } else if (requestType === 'updateNote') {
          updateNote(data.conversationId, data.conversationName, data.text).then((res) => {
            clearCache('getNote');
            clearCache('getNotes');
            clearCache('getAllNoteConversationIds');
            sendResponse(res);
          });
        } else if (requestType === 'updateNoteName') {
          updateNoteName(data.conversationId, data.conversationName).then((res) => {
            clearCache('getNote');
            clearCache('getNotes');
            sendResponse(res);
          });
        } else if (requestType === 'getNote') {
          getNote(data.conversationId).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getNoteForIds') {
          getNoteForIds(data.conversationIds).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getNotes') {
          getNotes(data.page, data.searchTerm, data.sortBy).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getNewsletters') {
          getNewsletters(data.page).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getNewsletter') {
          getNewsletter(data.id).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getLatestNewsletter') {
          getLatestNewsletter().then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'openPromoLink') {
          openPromoLink(data.link).then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'getReleaseNote') {
          getReleaseNote(data.version).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getLatestVersion') {
          getLatestVersion().then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'reloadExtension') {
          reloadExtension().then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'getLatestAnnouncement') {
          getLatestAnnouncement().then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getRandomGizmo') {
          getRandomGizmo().then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'getSuperpowerGizmos') {
          getSuperpowerGizmos(data.pageNumber, data.searchTerm, data.sortBy, data.category).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'submitSuperpowerGizmos') {
          submitSuperpowerGizmos(data.gizmos, data.category).then((res) => {
            clearCache('getSuperpowerGizmos');
            sendResponse(res);
          });
        } else if (requestType === 'updateGizmoMetrics') {
          updateGizmoMetrics(data.gizmoId, data.metricName, data.direction).then((res) => {
            clearCache('getSuperpowerGizmos');
            sendResponse(res);
          });
        } else if (requestType === 'deleteSuperpowerGizmo') {
          deleteSuperpowerGizmo(data.gizmoId).then((res) => {
            clearCache('getSuperpowerGizmos');
            sendResponse(res);
          });
        } else if (requestType === 'addGalleryImages') {
          addGalleryImages(data.images).then((res) => {
            clearCache('getGalleryImages');
            clearCache('getGalleryImagesByDateRange');
            sendResponse(res);
          });
          // } else if (requestType === 'updateGlleryImage') {
          //   updateGlleryImage(data.openAiId, data.imageId, data.imageData).then((res) => {
          //     sendResponse(res);
          //   });
        } else if (requestType === 'getGalleryImages') {
          getGalleryImages(data.showAll, data.pageNumber, data.searchTerm, data.byUserId, data.sortBy, data.category, data.isPublic).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getSelectedGalleryImages') {
          getSelectedGalleryImages(data.category, data.imageIds, data.conversationId).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'getGalleryImagesByDateRange') {
          getGalleryImagesByDateRange(data.startDate, data.endDate, data.category).then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'deleteGalleryImages') {
          deleteGalleryImages(data.imageIds, data.category).then((res) => {
            clearCache('getGalleryImages');
            clearCache('getGalleryImagesByDateRange');
            clearCache('getSelectedGalleryImages');
            sendResponse(res);
          });
        } else if (requestType === 'shareGalleryImages') {
          shareGalleryImages(data.imageIds, data.category).then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'incrementOpenRate') {
          incrementOpenRate(data.announcementId).then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'incrementClickRate') {
          incrementClickRate(data.announcementId).then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'incrementPromoLinkClickRate') {
          incrementPromoLinkClickRate(data.announcementId, data.promoLink).then((res) => {
            sendResponse(res);
          });
        } else if (requestType === 'getRemoteSettings') {
          getRemoteSettings().then((res) => {
            setCache(cacheKey, res);
            sendResponse(res);
          });
        } else if (requestType === 'clearCaches') {
          clearCaches(data.targetKeys);
        } else if (requestType === 'clearAllCache') {
          clearAllCache();
        }
      });
    })();
    return true;
  },
);
