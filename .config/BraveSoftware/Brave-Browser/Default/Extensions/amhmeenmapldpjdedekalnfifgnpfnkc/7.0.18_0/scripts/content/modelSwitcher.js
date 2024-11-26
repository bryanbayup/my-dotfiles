/* eslint-disable no-unused-vars */
/* global addUploadFileButton, arkoseTrigger, addGpt4Counter, addRateLimitBanner, curImageAssets:true, curFileAttachments:true, registerWebsocket, showNewChatPage, checkout, debounce, startNewChat, getConversationIdFromUrl */
// eslint-disable-next-line no-unused-vars
window.localStorage.removeItem('sp/selectedModel');
window.localStorage.removeItem('sp/temporaryChat');
const modelSwitcherMap = {
  'text-davinci-002-render-sha': {
    title: 'GPT-3.5',
    description: 'Great for everyday tasks',
  },
  'gpt-4': {
    title: 'GPT-4',
    description: 'Legacy model',
  },
  'gpt-4o': {
    title: 'GPT-4o',
    description: 'Best for complex tasks',
  },
  'gpt-4o-mini': {
    title: 'GPT-4o mini',
    description: 'Faster for everyday tasks',
  },
  'o1-mini': {
    title: 'o1-mini',
    description: 'Faster at reasoning',
  },
  'o1-preview': {
    title: 'o1-preview',
    description: 'Uses advanced reasoning',
  },
  'gpt-4o-canmore': {
    title: 'GPT-4o Canvas',
    description: 'Collaborate on writing and code',
  },
  auto: {
    title: 'Dynamic',
    description: 'Use the right model from my requests',
  },
};
async function overrideModelSwitcher() {
  const originalModelSwitcherButton = document.querySelector('main button[data-testid="model-switcher-dropdown-button"]');
  if (!originalModelSwitcherButton) return;
  if (originalModelSwitcherButton?.classList?.contains('hidden')) return;
  originalModelSwitcherButton?.classList?.add('hidden');

  const { settings, models, selectedModel } = await chrome.storage.local.get(['settings', 'models', 'selectedModel']);
  if (!settings.overrideModelSwitcher) {
    window.localStorage.removeItem('sp/selectedModel');
    window.localStorage.removeItem('sp/temporaryChat');
    originalModelSwitcherButton?.classList?.remove('hidden');
    return;
  }

  // replace model switcher with custom model switcher
  if (originalModelSwitcherButton.parentElement) {
    const conversationIdFromUrl = getConversationIdFromUrl(window.location.href);
    const modelSwitcherElement = modelSwitcher(selectedModel, models, conversationIdFromUrl ? false : settings.temporaryChat);
    originalModelSwitcherButton.parentElement.parentElement.style.zIndex = '10000';
    originalModelSwitcherButton.parentElement.classList = 'flex flex-row-reverse';
    originalModelSwitcherButton.parentElement.insertAdjacentHTML('afterbegin', modelSwitcherElement);
    addModelSwitcherEventListener();
    window.localStorage.setItem('sp/selectedModel', selectedModel.slug);
    if (conversationIdFromUrl) {
      resetTempChat();
    } else {
      window.localStorage.setItem('sp/temporaryChat', settings.temporaryChat);
    }
  }
}
function modelSwitcher(selectedModel, models = [], temporaryChat = false) {
  if (!selectedModel) return '';
  return `<div><button id="model-switcher-button" class="relative w-full cursor-pointer rounded-md border border-token-border-light bg-token-main-surface-primary pl-3 pr-10 text-left focus:outline-none  sm:text-sm" type="button">
  <label class="relative text-xs text-token-text-tertiary" style="top:-2px;">Model</label>
  <span class="inline-flex w-full truncate font-semibold text-token-text-primary">
    <span class="flex h-5 items-center gap-1 truncate relative" style="top:-2px;"><span id="selected-model-title">${modelSwitcherMap[selectedModel.slug]?.title || selectedModel.title}</span>
    </span>
  </span>
  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </span>
</button>

<ul id="model-list-dropdown" style="width:300px;max-height:400px" class="hidden absolute z-10 mt-1 overflow-auto rounded-md text-base border border-token-border-light focus:outline-none bg-token-main-surface-secondary sm:text-sm -translate-x-1/4" role="menu" aria-orientation="vertical" aria-labelledby="model-switcher-button" tabindex="-1">

  <div class="flex items-center justify-between pb-0 mx-2 pl-4 pr-4 pt-4 juice:mb-1 juice:px-5 juice:pt-2"><span class="text-sm text-token-text-tertiary">Model</span><a href="https://help.openai.com/en/articles/7102672-how-can-i-access-gpt-4" target="_blank" rel="noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-md pl-0.5 text-token-text-tertiary h-5 w-5"><path fill="currentColor" d="M13 12a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0zM12 9.5A1.25 1.25 0 1 0 12 7a1.25 1.25 0 0 0 0 2.5"></path><path fill="currentColor" fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0" clip-rule="evenodd"></path></svg></a></div>

  ${createModelListDropDown(models, selectedModel, temporaryChat)}
  <div role="separator" aria-orientation="horizontal" style="bottom:44px;" class="sticky h-[1px] bg-token-border-light"></div>
  <li id="temporary-chat-switch" role="menuitem" class="sticky bottom-0 bg-token-main-surface-secondary  text-token-text-primary flex items-center m-1.5 p-2.5 text-sm cursor-pointer focus-visible:outline-0 group relative focus-visible:bg-[#f5f5f5] dark:hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary rounded-md my-0 px-3 mx-2 py-3 gap-3 !pr-3" tabindex="-1" data-orientation="vertical" data-radix-collection-item=""><div class="flex items-center justify-center text-token-text-secondary h-5 w-7"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="h-5 w-5 shrink-0"><path fill="currentColor" fill-rule="evenodd" d="M10.974 3.252a1 1 0 0 1-.746 1.201 7.74 7.74 0 0 0-3.876 2.24 1 1 0 1 1-1.458-1.37 9.74 9.74 0 0 1 4.878-2.817 1 1 0 0 1 1.202.746m2.052 0a1 1 0 0 1 1.202-.746 9.74 9.74 0 0 1 4.878 2.818 1 1 0 1 1-1.458 1.37 7.74 7.74 0 0 0-3.876-2.24 1 1 0 0 1-.746-1.202M3.91 8.514a1 1 0 0 1 .67 1.246A7.8 7.8 0 0 0 4.25 12c0 .774.113 1.53.325 2.25a1 1 0 0 1-1.92.564A10 10 0 0 1 2.25 12c0-.978.144-1.924.413-2.817a1 1 0 0 1 1.246-.669m16.182 0a1 1 0 0 1 1.246.67c.269.892.413 1.838.413 2.816a10 10 0 0 1-.406 2.813 1 1 0 0 1-1.919-.564A8 8 0 0 0 19.75 12a7.8 7.8 0 0 0-.328-2.24 1 1 0 0 1 .669-1.246m-.982 8.768a1 1 0 0 1 .086 1.412c-1.293 1.462-3.006 2.551-4.955 3.033a1 1 0 1 1-.48-1.941c1.53-.379 2.895-1.24 3.938-2.418a1 1 0 0 1 1.411-.086m-12.937-.008a1 1 0 0 1 .293 1.384L5.593 20H10a1 1 0 1 1 0 2H3.75a1 1 0 0 1-.838-1.545l1.876-2.887a1 1 0 0 1 1.384-.294" clip-rule="evenodd"></path></svg></div><div class="flex grow items-center justify-between gap-2"><div class="flex flex-1 items-center gap-3">Temporary chat</div><button type="button" role="switch" aria-checked="${temporaryChat ? 'true' : 'false'}" data-state="${temporaryChat ? 'checked' : 'unchecked'}" value="on" aria-label="Temporary" class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token-text-secondary focus-visible:ring-offset-2 focus-visible:radix-state-checked:ring-black focus-visible:dark:ring-token-main-surface-primary focus-visible:dark:radix-state-checked:ring-green-600 cursor-pointer bg-gray-200 radix-state-checked:bg-black dark:border dark:border-token-border-medium dark:bg-transparent relative shrink-0 rounded-full dark:radix-state-checked:border-green-600 dark:radix-state-checked:bg-green-600 h-[20px] w-[32px]"><span data-state="${temporaryChat ? 'checked' : 'unchecked'}" class="flex items-center justify-center rounded-full transition-transform duration-100 will-change-transform ltr:translate-x-0.5 rtl:-translate-x-0.5 bg-white h-[16px] w-[16px] ltr:radix-state-checked:translate-x-[14px] rtl:radix-state-checked:translate-x-[-14px]"></span></button></div></li>
</ul></div>`;
}
function createModelListDropDown(models, selectedModel, temporaryChat = false) {
  return `${models.filter((m) => !m.slug.includes('plugins')).map((model) => `<li class="group relative cursor-pointer select-none mx-2 py-2 pl-4 pr-12 rounded-md hover:bg-token-main-surface-tertiary" id="model-switcher-option-${model.slug}" role="option" tabindex="-1">
 <div class="flex flex-col">
   <span class="font-semibold flex h-6 items-center gap-1 truncate text-token-text-primary">${modelSwitcherMap[model.slug]?.title || model.title}</span>
   <span class="text-token-text-tertiary text-xs">${modelSwitcherMap[model.slug]?.description || model.description}</span>
 </div>
 ${model.slug === selectedModel.slug ? `<span id="model-switcher-checkmark" style="right:36px;" class="absolute inset-y-0 flex items-center text-token-text-primary">
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-md"><path fill="currentColor" fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m14.076-4.068a1 1 0 0 1 .242 1.393l-4.75 6.75a1 1 0 0 1-1.558.098l-2.5-2.75a1 1 0 0 1 1.48-1.346l1.66 1.827 4.032-5.73a1 1 0 0 1 1.394-.242" clip-rule="evenodd"></path></svg>
 </span>` : ''}
</li>`).join('')}`;
}

function addModelSwitcherEventListener() {
  const modelSwitcherButton = document.querySelector('main #model-switcher-button');
  modelSwitcherButton?.addEventListener('click', () => {
    const modelListDropdown = document.querySelector('main #model-list-dropdown');
    const cl = modelListDropdown.classList;
    if (cl.contains('block')) {
      modelListDropdown.classList.replace('block', 'hidden');
    } else {
      modelListDropdown.classList.replace('hidden', 'block');
    }
  });
  // close modelListDropdown when clicked outside
  document.addEventListener('click', (e) => {
    const modelListDropdown = document.querySelector('main #model-list-dropdown');
    const cl = modelListDropdown?.classList;
    if (cl && cl.contains('block') && !e.target.closest('#model-switcher-button')) {
      modelListDropdown.classList.replace('block', 'hidden');
    }
  });

  const modelSwitcherOptions = document.querySelectorAll('main [id^=model-switcher-option-]');

  modelSwitcherOptions.forEach((option) => {
    option.addEventListener('click', () => {
      chrome.storage.local.get(['settings', 'models'], ({
        settings, models,
      }) => {
        const allModels = models || [];
        const modelSlug = option.id.split('model-switcher-option-')[1];
        const selectedModel = allModels.find((m) => m.slug === modelSlug);
        if (!selectedModel) return;
        window.localStorage.setItem('sp/selectedModel', selectedModel.slug);

        chrome.storage.local.set({ selectedModel }, () => {
          const textInput = document.querySelector('main #prompt-textarea');
          if (textInput) {
            textInput.focus();
          }
        });
      });
    });
  });
  const tempChatSwitch = document.querySelector('main #temporary-chat-switch');
  if (tempChatSwitch) {
    tempChatSwitch.addEventListener('click', () => {
      chrome.storage.local.get(['settings'], ({ settings }) => {
        settings.temporaryChat = !settings.temporaryChat;
        chrome.storage.local.set({ settings }, () => {
          window.localStorage.setItem('sp/temporaryChat', settings.temporaryChat);
          tempChatSwitch.querySelector('button').setAttribute('data-state', settings.temporaryChat ? 'checked' : 'unchecked');
          tempChatSwitch.querySelector('button > span').setAttribute('data-state', settings.temporaryChat ? 'checked' : 'unchecked');
          startNewChat(false, settings.temporaryChat);
        });
      });
    });
  }
  chrome.storage.onChanged.addListener((e) => {
    if (e.selectedModel && e.selectedModel?.newValue?.slug !== e.selectedModel?.oldValue?.slug) {
      const modelListDropdown = document.querySelector('main #model-list-dropdown');
      if (!modelListDropdown) return;
      modelListDropdown.classList.replace('block', 'hidden');
      const modelSwitcherCheckmark = document.querySelector('main #model-switcher-checkmark');
      if (modelSwitcherCheckmark) modelSwitcherCheckmark.remove();
      const selectedModelTitle = document.querySelector('main #selected-model-title');
      selectedModelTitle.innerHTML = `${modelSwitcherMap[e.selectedModel.newValue?.slug]?.title || e.selectedModel.newValue?.title}`;
      const selectedModelOption = document.querySelector(`main #model-switcher-option-${e.selectedModel?.newValue?.slug?.replaceAll('.', '\\.')}`);
      if (!selectedModelOption) return;
      if (!modelSwitcherCheckmark) return;
      selectedModelOption.appendChild(modelSwitcherCheckmark);
    }
  });
}
function resetTempChat() {
  chrome.storage.local.get(['settings'], ({ settings }) => {
    settings.temporaryChat = false;
    chrome.storage.local.set({ settings }, () => {
      window.localStorage.setItem('sp/temporaryChat', settings.temporaryChat);
    });
  });
}
