/* global toast, openPromptEditorModal, runPromptChain, loadingSpinner, insertTextAtPosition, getSelectionPosition, translate, isOnNewChatPage, debounce, closeMenus */

function promptDropdown() {
  const dropdownWrapper = document.createElement('div');
  dropdownWrapper.id = 'favorite-prompts-dropdown-wrapper';
  dropdownWrapper.style = 'max-height:300px;min-width:200px;max-width:fit-content;bottom:40px; left:0;z-index:200;';
  dropdownWrapper.classList = 'hidden absolute z-10 right-0 overflow-auto rounded-md text-base border border-token-border-light focus:outline-none dark:ring-white/20 dark:last:border-b-0 sm:text-sm -translate-x-1/4 bg-token-main-surface-primary';
  const menuHeader = document.createElement('div');
  menuHeader.classList = 'flex items-center text-token-text-primary font-bold relative cursor-pointer select-none border-b p-2 py-3 last:border-b-0 border-token-border-light bg-token-main-surface-secondary sticky top-0 z-10';
  menuHeader.innerHTML = `<svg class="icon-md mr-2" fill="gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"/></svg> ${translate('Favorite Prompts')} <span class="flex items-center justify-center bg-white rounded-full h-4 w-4 ml-auto"><svg class="icon-xs" fill="#000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 224H480C497.7 224 512 238.3 512 256C512 273.7 497.7 288 480 288H288V480C288 497.7 273.7 512 255.1 512C238.3 512 223.1 497.7 223.1 480V288H32C14.33 288 0 273.7 0 256C0 238.3 14.33 224 32 224H223.1V32C223.1 14.33 238.3 0 255.1 0C273.7 0 288 14.33 288 32V224z"/></svg></span>`;
  menuHeader.addEventListener('click', () => {
    const newPromptChain = {
      title: '',
      steps: [''],
      is_favorite: true,
    };
    openPromptEditorModal(newPromptChain);
  });
  dropdownWrapper.appendChild(menuHeader);

  const dropdown = document.createElement('ul');
  dropdown.id = 'favorite-prompts-dropdown-list';
  dropdown.classList = 'w-full h-full relative';
  dropdown.setAttribute('role', 'menu');
  dropdown.setAttribute('aria-orientation', 'vertical');
  dropdown.setAttribute('aria-labelledby', 'continue-conversation-dropdown-button');
  dropdown.setAttribute('tabindex', '-1');
  dropdownWrapper.appendChild(dropdown);

  document.body.addEventListener('click', (e) => {
    const continueConversationDropdown = document.querySelector('#favorite-prompts-dropdown-wrapper');
    const cl = continueConversationDropdown?.classList;
    if (cl?.contains('block') && !e.target.closest('#continue-conversation-dropdown-button')) {
      continueConversationDropdown.classList.replace('block', 'hidden');
    }
  });
  return dropdownWrapper;
}
function fetchFavoritePrompts(newPageNumber = 1) {
  const favoritePromptList = document.querySelector('#favorite-prompts-dropdown-list');
  if (!favoritePromptList) return;
  if (newPageNumber === 1) {
    favoritePromptList.innerHTML = '';
    favoritePromptList.appendChild(loadingSpinner('favorite-prompts-dropdown-list'));
  } else {
    // remove the load more button
    const loadMoreButton = document.querySelector('#load-more-prompts-button');
    if (loadMoreButton) loadMoreButton.remove();
  }

  chrome.runtime.sendMessage({
    type: 'getPrompts',
    detail: {
      pageNumber: newPageNumber,
      sortBy: 'alphabetical',
      isFavorite: true,
      deepSearch: false,
    },
  }, (data) => {
    const prompts = data.results;
    if (!prompts) return;
    const loadingSpinnerElement = document.querySelector('#loading-spinner-favorite-prompts-dropdown-list');
    if (loadingSpinnerElement) loadingSpinnerElement.remove();
    if (prompts.length === 0 && newPageNumber === 1) {
      const noPrompts = document.createElement('p');
      noPrompts.classList = 'text-token-text-secondary p-4';
      noPrompts.innerText = translate('No prompts found');
      favoritePromptList.appendChild(noPrompts);
    } else {
      prompts.forEach((prompt) => {
        const promptTitle = prompt.title;
        const isDefault = prompt.is_default_favorite;
        const promptText = prompt.steps.map((step, index) => `step ${index + 1}:\n${step}`).join('\n');
        const dropdownItem = document.createElement('li');
        dropdownItem.id = `continue-conversation-dropdown-item-${promptTitle}`;
        dropdownItem.dir = 'auto';
        dropdownItem.classList = 'text-token-text-primary relative cursor-pointer select-none border-b p-2 last:border-b-0 border-token-border-light hover:bg-token-main-surface-secondary';
        const dropdownOption = document.createElement('span');
        dropdownOption.classList = 'flex h-6 items-center justify-between text-token-text-primary';
        const titleElement = document.createElement('span');
        titleElement.style = 'text-transform: capitalize;';
        titleElement.classList = 'truncate';
        titleElement.innerText = promptTitle;
        dropdownOption.appendChild(titleElement);
        const defaultButton = document.createElement('button');
        defaultButton.id = `default-favorite-button-${prompt.id}`;
        defaultButton.classList = `text-xs px-1 ml-1 flex items-center justify-center ${isDefault ? 'bg-white text-black' : 'text-token-text-secondary bg-transparent'} rounded-full border border-token-border-light hover:border-token-border-heavy`;
        defaultButton.innerText = translate('default');
        defaultButton.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          closeMenus();
          chrome.runtime.sendMessage({
            type: 'setDefaultFavoritePrompt',
            detail: {
              promptId: prompt.id,
            },
          }, () => {
            // change the default button styles
            const defaultButtons = document.querySelectorAll('[id^="default-favorite-button-"]');
            defaultButtons.forEach((button) => {
              button.classList.replace('bg-white', 'bg-transparent');
              button.classList.replace('text-black', 'text-token-text-secondary');
            });
            defaultButton.classList.replace('bg-transparent', 'bg-white');
            defaultButton.classList.replace('text-token-text-secondary', 'text-black');
            // change continue button text
            const continueButton = document.querySelector('#continue-conversation-button');
            continueButton.textContent = promptTitle;
          });
        });
        dropdownOption.appendChild(defaultButton);
        dropdownOption.title = `${promptTitle}\n\n${promptText}`;
        dropdownItem.appendChild(dropdownOption);
        dropdownItem.setAttribute('role', 'option');
        dropdownItem.setAttribute('tabindex', '-1');

        // eslint-disable-next-line no-loop-func
        dropdownItem.addEventListener('click', (e) => {
          if (e.shiftKey && prompt.steps.length === 1) {
            insertFavoritePromptIntoTextArea(prompt);
          } else {
            runPromptChain(prompt, 0, false);
          }
        });
        favoritePromptList.appendChild(dropdownItem);
      });
      if (data.next) {
        const loadMorePromptsButton = document.createElement('button');
        loadMorePromptsButton.id = 'load-more-prompts-button';
        loadMorePromptsButton.classList = 'p-2 cursor-pointer flex items-center justify-center h-auto relative';
        loadMorePromptsButton.appendChild(loadingSpinner('load-more-prompts-button'));
        favoritePromptList.appendChild(loadMorePromptsButton);
        // add an observer to click the load more button when it is visible
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              fetchFavoritePrompts(newPageNumber + 1);
            }
          });
        }, { threshold: 0 });
        if (loadMorePromptsButton) {
          observer.observe(loadMorePromptsButton);
        }
      }
    }
  });
}
// eslint-disable-next-line no-unused-vars
const throttleInitializeContinueButton = debounce(() => {
  initializeContinueButton();
}, 100);
async function initializeContinueButton(forceRefresh = false) {
  const { settings } = await chrome.storage.local.get(['settings']);

  const existingContinueButton = document.querySelector('#continue-conversation-button-wrapper');
  if (existingContinueButton) {
    if (isOnNewChatPage()) {
      existingContinueButton.style.top = '-40px';
    } else {
      existingContinueButton.style.top = 'unset';
    }
    if (!forceRefresh) return;
    existingContinueButton?.remove();
  }

  if (settings?.autoClick) {
    chrome.storage.local.set({ settings: { ...settings, autoClick: false } });
  }

  const continueButtonWrapper = document.createElement('div');
  continueButtonWrapper.style = 'z-index:1001;display:flex;width:100%;position:absolute;';
  // wait till cond id is loaded when starting a new chat
  if (isOnNewChatPage()) {
    continueButtonWrapper.style.top = '-40px';
  } else {
    continueButtonWrapper.style.top = 'unset';
  }
  continueButtonWrapper.id = 'continue-conversation-button-wrapper';
  const continueButtonDropdown = document.createElement('button');
  continueButtonDropdown.textContent = '⋮';
  continueButtonDropdown.id = 'continue-conversation-dropdown-button';
  continueButtonDropdown.type = 'button';
  continueButtonDropdown.style = 'width:38px;border-top-right-radius:0;border-bottom-right-radius:0;z-index:2;';
  continueButtonDropdown.classList = 'btn flex justify-center gap-2 btn-secondary border ';
  continueButtonDropdown.addEventListener('click', () => {
    const dropdown = document.querySelector('#favorite-prompts-dropdown-wrapper');
    if (!dropdown) return;
    if (dropdown.classList.contains('block')) {
      dropdown.classList.replace('block', 'hidden');
    } else {
      dropdown.classList.replace('hidden', 'block');
    }
  });

  const continueButton = document.createElement('button');

  chrome.runtime.sendMessage({
    type: 'getDefaultFavoritePrompt',
  }, (defaultFavoritePrompt) => {
    continueButton.title = defaultFavoritePrompt?.title || 'No default selected';
    continueButton.textContent = defaultFavoritePrompt?.title || 'No default selected';
  });
  continueButton.id = 'continue-conversation-button';
  continueButton.type = 'button';
  continueButton.dir = 'auto';
  continueButton.style = 'width:96px;border-radius:0;border-left:0;z-index:1;text-transform: capitalize;';
  continueButton.classList.add('btn', 'block', 'justify-center', 'gap-2', 'btn-secondary', 'border', 'max-w-10', 'truncate');
  continueButton.classList = 'btn block justify-center gap-2 btn-secondary border max-w-10 truncate ';

  continueButton.addEventListener('click', (e) => {
    chrome.runtime.sendMessage({
      type: 'getDefaultFavoritePrompt',
    }, (defaultFavoritePrompt) => {
      if (!defaultFavoritePrompt || !defaultFavoritePrompt.id) {
        toast('No default prompt found', 'error');
        return;
      }
      const textAreaElement = document.querySelector('#prompt-textarea');
      if (!textAreaElement) return;
      if (e.shiftKey && defaultFavoritePrompt.steps.length === 1) {
        insertFavoritePromptIntoTextArea(defaultFavoritePrompt);
      } else {
        runPromptChain(defaultFavoritePrompt, 0, false);
      }
    });
  });

  const autoClickButton = document.createElement('button');
  autoClickButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-width="2" viewBox="0 0 512 512" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="M256 464c114.9 0 208-93.1 208-208s-93.1-208-208-208S48 141.1 48 256c0 5.5 .2 10.9 .6 16.3L1.8 286.1C.6 276.2 0 266.2 0 256C0 114.6 114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256c-10.2 0-20.2-.6-30.1-1.8l13.8-46.9c5.4 .4 10.8 .6 16.3 .6zm-2.4-48l14.3-48.6C324.2 361.4 368 313.8 368 256c0-61.9-50.1-112-112-112c-57.8 0-105.4 43.8-111.4 100.1L96 258.4c0-.8 0-1.6 0-2.4c0-88.4 71.6-160 160-160s160 71.6 160 160s-71.6 160-160 160c-.8 0-1.6 0-2.4 0zM39 308.5l204.8-60.2c12.1-3.6 23.4 7.7 19.9 19.9L203.5 473c-4.1 13.9-23.2 15.6-29.7 2.6l-28.7-57.3c-.7-1.3-1.5-2.6-2.5-3.7l-88 88c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l88-88c-1.1-1-2.3-1.9-3.7-2.5L36.4 338.2c-13-6.5-11.3-25.6 2.6-29.7z"/></svg>';
  autoClickButton.id = 'auto-click-button';
  autoClickButton.type = 'button';
  autoClickButton.style = 'width:38px;border-top-left-radius:0;border-bottom-left-radius:0;border-left:0;z-index:1;padding:0;';
  autoClickButton.title = 'Auto Click is OFF';
  autoClickButton.classList = 'btn flex justify-center gap-2 btn-secondary border ';

  autoClickButton.addEventListener('click', () => {
    chrome.storage.local.get(['settings'], (result) => {
      chrome.storage.local.set({ settings: { ...result.settings, autoClick: !result.settings.autoClick } }, () => {
        const curAutoClickButton = document.querySelector('#auto-click-button');
        if (result.settings.autoClick) {
          curAutoClickButton.classList.replace('btn-primary', 'btn-secondary');
          curAutoClickButton.classList.add('bg-token-sidebar-surface-secondary', 'hover:bg-token-main-surface-tertiary');
          curAutoClickButton.title = 'Auto Click is OFF';
        } else {
          curAutoClickButton.classList.replace('btn-secondary', 'btn-primary');
          curAutoClickButton.classList.remove('bg-token-sidebar-surface-secondary', 'hover:bg-token-main-surface-tertiary');
          curAutoClickButton.title = 'Auto Click is ON';
        }
        toast(`Auto click is ${result.settings.autoClick ? 'Disabled' : 'Enabled (<a style="text-decoration:underline; color:gold;" href="https://www.notion.so/ezi/Superpower-ChatGPT-FAQ-9d43a8a1c31745c893a4080029d2eb24?pvs=4#ed16d04d414941d4abcb59b6d765008d" target="blank">Learn More</a>)'}`, 'success');
      });
    });
  });

  continueButtonWrapper.appendChild(continueButtonDropdown);
  continueButtonWrapper.appendChild(promptDropdown());
  continueButtonWrapper.appendChild(continueButton);
  continueButtonWrapper.appendChild(autoClickButton);
  const inputFormActionWrapper = document.querySelector('main form')?.firstChild.firstChild;
  if (inputFormActionWrapper) {
    inputFormActionWrapper.classList = 'h-full flex flex-wrap w-full mx-auto mb-3 mt-2 gap-2 justify-center items-end empty:my-0';
    inputFormActionWrapper.prepend(continueButtonWrapper);
    fetchFavoritePrompts();
  }
}
function insertFavoritePromptIntoTextArea(prompt, step = 0) {
  const textAreaElement = document.querySelector('#prompt-textarea');
  if (!textAreaElement) return;
  const cursorPos = getSelectionPosition();
  insertTextAtPosition(cursorPos.parentElement, prompt.steps[step], cursorPos.start, cursorPos.end);
}
