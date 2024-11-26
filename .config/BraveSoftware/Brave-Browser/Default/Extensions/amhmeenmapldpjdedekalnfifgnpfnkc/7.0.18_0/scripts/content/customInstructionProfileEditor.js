/* global createTooltip, showConfirmDialog, setUserSystemMessage, errorUpgradeConfirmation, addOrReplaceProfileCard, translate */
// eslint-disable-next-line no-unused-vars
function createCustomInstructionProfileEditor(profile = {
  name: '', about_model_message: '', about_user_message: '', disabled_tools: [], enabled: true,
}) {
  const {
    name, about_model_message: aboutModelMessage, about_user_message: aboutUserMessage, disabled_tools: disabledTools, enabled,
  } = profile;
  const canSave = name.length > 0 && (aboutModelMessage.length > 0 || aboutUserMessage.length > 0) && aboutModelMessage.length <= 1500 && aboutUserMessage.length <= 1500;
  const editor = `<div id="custom-instruction-editor-wrapper" class="absolute inset-0" style="z-index:100010">
    <div data-state="open" class="fixed inset-0 z-50 bg-black/50 dark:bg-black/80" style="pointer-events: auto;">
      <div class="z-50 h-full w-full overflow-y-auto grid grid-cols-[10px_1fr_10px] grid-rows-[minmax(10px,_1fr)_auto_minmax(10px,_1fr)] md:grid-rows-[minmax(20px,_1fr)_auto_minmax(20px,_1fr)]">
        <div role="dialog" id="custom-instruction-editor" aria-describedby="radix-:raf:" aria-labelledby="radix-:rae:" data-state="open" class="popover relative start-1/2 col-auto col-start-2 row-auto row-start-2 h-full w-full bg-token-main-surface-primary text-start shadow-xl ltr:-translate-x-1/2 rtl:translate-x-1/2 rounded-2xl flex flex-col focus:outline-none max-w-lg xl:max-w-xl" tabindex="-1" style="pointer-events: auto;">
          <div class="px-4 pb-4 pt-5 sm:p-6 flex items-center justify-between border-b border-black/10 dark:border-white/10">
            <div class="flex">
              <div class="flex items-center">
                <div class="flex items-center grow gap-1">
                  <h2 class="text-lg font-semibold leading-6 text-token-text-primary">${translate('Customize ChatGPT')}</h2>
                  <a href="https://help.openai.com/en/articles/8096356-custom-instructions-for-chatgpt" class="text-xs text-token-text-tertiary">
                    <span class="" data-state="closed">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-token-text-tertiary">
                        <path d="M13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V12Z" fill="currentColor"></path>
                        <path d="M12 9.5C12.6904 9.5 13.25 8.94036 13.25 8.25C13.25 7.55964 12.6904 7 12 7C11.3096 7 10.75 7.55964 10.75 8.25C10.75 8.94036 11.3096 9.5 12 9.5Z" fill="currentColor"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="currentColor"></path>
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-grow overflow-y-auto p-4 sm:p-6">
            <div class="max-h-[60vh] overflow-y-auto md:max-h-[calc(100vh-300px)]">
              <p class="text-muted pb-3 pt-2 text-sm text-token-text-primary">${translate('Name')}</p>
              <input id="custom-instruction-editor-name-input" placeholder="Profile Name" class="rounded p-2 mb-3 w-full resize-none rounded bg-token-main-surface-primary placeholder:text-gray-500 border border-token-border-light focus-within:border-token-border-xheavy focus:ring-0 focus-visible:ring-0 outline-none focus-visible:outline-none" value="${name}">
              
              <p class="text-muted pb-3 pt-2 text-sm text-token-text-primary">${translate('about_user_title')}</p>
              <div class="mb-3">
                <textarea id="custom-instruction-editor-about-user-input" class="w-full resize-none rounded bg-token-main-surface-primary p-4 placeholder:text-gray-500 focus-token-border-heavy border-token-border-light" rows="5" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:rak:" data-state="closed">${aboutUserMessage}</textarea>
                <div class="flex items-center justify-between px-1 text-xs tabular-nums text-token-text-tertiary">
                  <div id="custom-instruction-editor-about-user-counter">${aboutUserMessage.length}/1500</div>
                </div>
              </div>

              <p class="text-muted py-3 text-sm text-token-text-primary">${translate('about_model_title')}</p>
              <div>
                <textarea id="custom-instruction-editor-about-model-input" class="w-full resize-none rounded bg-token-main-surface-primary p-4 placeholder:text-gray-500 focus-token-border-heavy border-token-border-light" rows="5" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:rao:" data-state="closed">${aboutModelMessage}</textarea>
                <div class="flex items-center justify-between px-1 text-xs tabular-nums text-token-text-tertiary">
                  <div id="custom-instruction-editor-about-model-counter">${aboutModelMessage.length}/1500</div>
                </div>
              </div>

              <div class="my-3 h-px bg-token-border-light"></div>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-1">
                  <div class="text-sm font-semibold">${translate('GPT-4 Capabilities')}</div>
                </div>
                <div class="mt-2 flex flex-col gap-3 md:flex-row">
                  <span class="block flex-1" data-state="closed">
                    <button class="flex w-full items-center justify-between rounded border border-token-border-medium p-2">
                      <div class="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                          xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-token-text-tertiary">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9851 4.00291C11.9744 4.00615 11.953 4.01416 11.921 4.03356C11.7908 4.11248 11.5742 4.32444 11.325 4.77696C11.0839 5.21453 10.8521 5.8046 10.6514 6.53263C10.3148 7.75315 10.0844 9.29169 10.019 11H13.981C13.9156 9.29169 13.6852 7.75315 13.3486 6.53263C13.1479 5.8046 12.9161 5.21453 12.675 4.77696C12.4258 4.32444 12.2092 4.11248 12.079 4.03356C12.047 4.01416 12.0256 4.00615 12.0149 4.00291C12.0067 4.00046 12.001 4.00006 11.9996 4C11.9982 4.00006 11.9933 4.00046 11.9851 4.00291ZM8.01766 11C8.08396 9.13314 8.33431 7.41167 8.72334 6.00094C8.87366 5.45584 9.04762 4.94639 9.24523 4.48694C6.48462 5.49946 4.43722 7.9901 4.06189 11H8.01766ZM4.06189 13H8.01766C8.09487 15.1737 8.42177 17.1555 8.93 18.6802C9.02641 18.9694 9.13134 19.2483 9.24522 19.5131C6.48461 18.5005 4.43722 16.0099 4.06189 13ZM10.019 13C10.0955 14.9972 10.3973 16.7574 10.8274 18.0477C11.0794 18.8038 11.3575 19.3436 11.6177 19.6737C11.7455 19.8359 11.8494 19.9225 11.9186 19.9649C11.9515 19.9852 11.9736 19.9935 11.9847 19.9969C11.9948 20 11.9999 20 11.9999 20C11.9999 20 12.0049 20.0001 12.0153 19.9969C12.0264 19.9935 12.0485 19.9852 12.0814 19.9649C12.1506 19.9225 12.2545 19.8359 12.3823 19.6737C12.6425 19.3436 12.9206 18.8038 13.1726 18.0477C13.6027 16.7574 13.9045 14.9972 13.981 13H10.019ZM15.9823 13C15.9051 15.1737 15.5782 17.1555 15.07 18.6802C14.9736 18.9694 14.8687 19.2483 14.7548 19.5131C17.5154 18.5005 19.5628 16.0099 19.9381 13H15.9823ZM19.9381 11C19.5628 7.99009 17.5154 5.49946 14.7548 4.48694C14.9524 4.94639 15.1263 5.45584 15.2767 6.00094C15.6657 7.41167 15.916 9.13314 15.9823 11H19.9381Z" fill="currentColor"></path>
                        </svg>
                        <div class="text-sm font-semibold">Browsing</div>
                      </div>
                      <div class="form-check flex items-center gap-2">
                        <input class="form-check-input float-left h-4 w-4 appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none cursor-pointer" type="checkbox" id="browser" ${disabledTools.includes('browser') ? '' : 'checked=""'}>
                      </div>
                    </button>
                  </span>
                  <span class="block flex-1" data-state="closed">
                    <button class="flex w-full items-center justify-between rounded border border-token-border-medium p-2">
                      <div class="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                          xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-token-text-tertiary">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.83333 5C9.09695 5 8.5 5.59695 8.5 6.33333C8.5 7.06971 9.09695 7.66667 9.83333 7.66667C10.5697 7.66667 11.1667 7.06971 11.1667 6.33333C11.1667 5.59695 10.5697 5 9.83333 5ZM6.5 6.33333C6.5 4.49238 7.99238 3 9.83333 3C11.6743 3 13.1667 4.49238 13.1667 6.33333C13.1667 8.17428 11.6743 9.66667 9.83333 9.66667C7.99238 9.66667 6.5 8.17428 6.5 6.33333ZM13.3791 11.4215C14.3768 9.89157 16.625 9.91327 17.5931 11.4622L20.6855 16.41C21.9343 18.4081 20.4978 21 18.1415 21H5.78773C3.23977 21 1.85181 18.0244 3.48916 16.0722L6.21737 12.8193C7.13808 11.7215 8.79121 11.6206 9.83864 12.5982L11.3449 14.0041C11.4585 14.11 11.6401 14.0879 11.7249 13.9579L13.3791 11.4215ZM15.8971 12.5222C15.7035 12.2124 15.2538 12.208 15.0543 12.514L13.4001 15.0504C12.6367 16.221 11.002 16.4197 9.9803 15.4662L8.47401 14.0603C8.26452 13.8648 7.9339 13.885 7.74975 14.1045L5.02154 17.3574C4.47576 18.0081 4.93841 19 5.78773 19H18.1415C18.9269 19 19.4058 18.136 18.9895 17.47L15.8971 12.5222Z" fill="currentColor"></path>
                        </svg>
                        <div class="text-sm font-semibold">DALL·E</div>
                      </div>
                      <div class="form-check flex items-center gap-2">
                        <input class="form-check-input float-left h-4 w-4 appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none cursor-pointer" type="checkbox" id="dalle" ${disabledTools.includes('dalle') ? '' : 'checked=""'}>
                      </div>
                    </button>
                  </span>
                  <span class="block flex-1" data-state="closed">
                    <button class="flex w-full items-center justify-between rounded border border-token-border-medium p-2">
                      <div class="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                          xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-token-text-tertiary">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM6 5C5.44772 5 5 5.44772 5 6V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V6C19 5.44772 18.5523 5 18 5H6ZM7.29289 9.29289C7.68342 8.90237 8.31658 8.90237 8.70711 9.29289L10.7071 11.2929C11.0976 11.6834 11.0976 12.3166 10.7071 12.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L8.58579 12L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289ZM12 14C12 13.4477 12.4477 13 13 13H16C16.5523 13 17 13.4477 17 14C17 14.5523 16.5523 15 16 15H13C12.4477 15 12 14.5523 12 14Z" fill="currentColor"></path>
                        </svg>
                        <div class="text-sm font-semibold">Code</div>
                      </div>
                      <div class="form-check flex items-center gap-2">
                        <input class="form-check-input float-left h-4 w-4 appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none cursor-pointer" type="checkbox" id="python" ${disabledTools.includes('python') ? '' : 'checked=""'}>
                      </div>
                    </button>
                  </span>
                </div>
              </div>
            </div>
            <div class="mt-3">
              <div class="flex flex-grow flex-col items-stretch justify-between gap-0 sm:flex-row sm:items-center sm:gap-3">

                <div class="cursor-pointer text-sm flex items-center justify-start gap-2 mt-4">${translate('Enable for new chats')}<label class="sp-switch"><input id="custom-instruction-editor-status-switch" type="checkbox" ${enabled ? 'checked=""' : ''}><span class="sp-switch-slider round"></span></label></div>

                <div class="flex flex-col gap-3 sm:flex-row-reverse mt-5 sm:mt-4">
                  <button id="custom-instruction-editor-save-button" class="disabled:opacity-50 hover:bg-inherit disabled:cursor-not-allowed btn relative btn-primary" ${canSave ? '' : 'disabled=""'} as="button">
                    <div class="flex items-center justify-center">${translate('Save')}</div>
                  </button>
                  <button id="custom-instruction-editor-cancel-button" class="btn relative btn-secondary" as="button">
                    <div class="flex items-center justify-center">${translate('Cancel')}</div>
                  </button>
                  ${profile.id ? `<button id="custom-instruction-editor-delete-button" class="btn relative btn-danger" as="button">
                    <div class="flex items-center justify-center">${translate('Delete')}</div>
                  </button>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', editor);
  addCustomInstructionProfileEditorEventListeners(profile);
}
function addCustomInstructionProfileEditorEventListeners(profile) {
  const editorWrapper = document.querySelector('#custom-instruction-editor-wrapper');
  const editor = document.querySelector('#custom-instruction-editor');
  const cancelButton = editor.querySelector('#custom-instruction-editor-cancel-button');
  const deleteButton = editor.querySelector('#custom-instruction-editor-delete-button');
  const saveButton = editor.querySelector('#custom-instruction-editor-save-button');
  const statuwSwitch = editor.querySelector('#custom-instruction-editor-status-switch');
  const nameInput = editor.querySelector('#custom-instruction-editor-name-input');
  const aboutUserInput = editor.querySelector('#custom-instruction-editor-about-user-input');
  const aboutModelInput = editor.querySelector('#custom-instruction-editor-about-model-input');
  const aboutUserCounter = editor.querySelector('#custom-instruction-editor-about-user-counter');
  const aboutModelCounter = editor.querySelector('#custom-instruction-editor-about-model-counter');
  const browserCheckbox = editor.querySelector('#browser');
  const dalleCheckbox = editor.querySelector('#dalle');
  const pythonCheckbox = editor.querySelector('#python');
  const checkboxes = [browserCheckbox, dalleCheckbox, pythonCheckbox];

  const updateCounter = (textArea, counter, text) => {
    counter.textContent = `${text.length}/1500`;
    // if (text.length > 1500) { make textbox border and counter red }
    if (text.length > 1500) {
      counter.classList.add('text-red-500');
      textArea.classList.add('border-red-500');
      textArea.classList.add('focus:border-red-500');
      textArea.classList.remove('border-token-border-light');
      textArea.classList.remove('focus:border-token-border-heavy');
      saveButton.setAttribute('disabled', '');
    } else {
      counter.classList.remove('text-red-500');
      textArea.classList.remove('border-red-500');
      textArea.classList.remove('focus:border-red-500');
      textArea.classList.add('border-token-border-light');
      textArea.classList.add('focus:border-token-border-heavy');
      if (nameInput.value.length > 0 && (aboutUserInput.value.length > 0 || aboutModelInput.value.length > 0) && aboutUserInput.value.length <= 1500 && aboutModelInput.value.length <= 1500) {
        saveButton.removeAttribute('disabled');
      } else {
        saveButton.setAttribute('disabled', '');
      }
    }
  };

  createTooltip(aboutUserInput.parentElement, `<div id="#custom-instruction-editor-about-user-tooltip" data-radix-popper-content-wrapper="" style="min-width: max-content; z-index: 50;"><div data-side="right" data-align="start" data-state="open" role="dialog" id="radix-:r6n:" class="popover relative z-50 max-w-[220px] animate-slideLeftAndFade select-none text-sm text-token-text-primary shadow-[0px_4px_14px_rgba(0,0,0,0.06)] xl:max-w-xs" tabindex="-1" style="pointer-events: auto; --radix-popover-content-transform-origin: var(--radix-popper-transform-origin); --radix-popover-content-available-width: var(--radix-popper-available-width); --radix-popover-content-available-height: var(--radix-popper-available-height); --radix-popover-trigger-width: var(--radix-popper-anchor-width); --radix-popover-trigger-height: var(--radix-popper-anchor-height);"><div class="flex flex-col gap-1"><strong>Thought starters</strong><div class="whitespace-pre-line">${translate('about_user_tooltip')}</div></div></div></div>`, 'transform: translate(95%, -110%);');

  createTooltip(aboutModelInput.parentElement, `<div id="#custom-instruction-editor-about-model-tooltip" data-radix-popper-content-wrapper="" style="min-width: max-content; z-index: 50; --radix-popper-available-width: 430.5px;"><div data-side="right" data-align="start" data-state="open" role="dialog" id="radix-:r6n:" class="popover relative z-50 max-w-[220px] animate-slideLeftAndFade select-none text-sm text-token-text-primary shadow-[0px_4px_14px_rgba(0,0,0,0.06)] xl:max-w-xs" tabindex="-1" style="pointer-events: auto; --radix-popover-content-transform-origin: var(--radix-popper-transform-origin); --radix-popover-content-available-width: var(--radix-popper-available-width); --radix-popover-content-available-height: var(--radix-popper-available-height); --radix-popover-trigger-width: var(--radix-popper-anchor-width); --radix-popover-trigger-height: var(--radix-popper-anchor-height);"><div class="flex flex-col gap-1"><strong>Thought starters</strong><div class="whitespace-pre-line">${translate('about_model_tooltip')}</div></div></div></div>`, 'transform: translate(95%, -110%);');

  editorWrapper?.addEventListener('click', (event) => {
    if (!editor.contains(event.target)) {
      editorWrapper.remove();
    }
  });
  nameInput?.addEventListener('input', () => {
    if (nameInput.value.length > 0 && (aboutUserInput.value.length > 0 || aboutModelInput.value.length > 0) && aboutUserInput.value.length <= 1500 && aboutModelInput.value.length <= 1500) {
      saveButton.removeAttribute('disabled');
    } else {
      saveButton.setAttribute('disabled', '');
    }
  });
  aboutUserInput?.addEventListener('input', () => {
    updateCounter(aboutUserInput, aboutUserCounter, aboutUserInput.value);
  });
  aboutModelInput?.addEventListener('input', () => {
    updateCounter(aboutModelInput, aboutModelCounter, aboutModelInput.value);
  });

  cancelButton?.addEventListener('click', () => {
    editorWrapper.remove();
  });

  deleteButton?.addEventListener('click', () => {
    showConfirmDialog('Delete profile', 'Are you sure you want to delete this custom instruction profile?', 'Cancel', 'Delete', null, () => {
      chrome.runtime.sendMessage({
        type: 'deleteCustomInstructionProfile',
        detail: {
          profileId: profile.id,
        },
      }, () => {
        const existingProfileCard = document.querySelector(`#custom-instruction-profile-card-${profile.id}`);
        if (existingProfileCard) existingProfileCard.remove();
        const profileList = document.querySelector('#modal-manager #custom-instruction-profile-manager-profile-list');
        if (profileList && profileList.children.length === 0) {
          const noProfiles = document.createElement('p');
          noProfiles.id = 'no-conversations-found';
          noProfiles.innerText = 'No profiles found';
          profileList.appendChild(noProfiles);
        }
        if (profile.enabled) {
          setUserSystemMessage('', '', false, []);
        }
      });
      editorWrapper.remove();
    });
  });
  saveButton?.addEventListener('click', () => {
    const disabledTools = checkboxes.filter((checkbox) => !checkbox.checked).map((checkbox) => checkbox.id);

    const newProfile = {
      name: nameInput.value,
      about_user_message: aboutUserInput.value,
      about_model_message: aboutModelInput.value,
      enabled: statuwSwitch.checked,
      disabled_tools: disabledTools,
    };
    if (profile.id) {
      newProfile.id = profile.id;
    }
    chrome.runtime.sendMessage({
      type: profile.id ? 'updateCustomInstructionProfile' : 'addCustomInstructionProfile',
      detail: {
        profileId: profile.id,
        profile: newProfile,
      },
    }, (data) => {
      if (data.error && data.error.type === 'limit') {
        errorUpgradeConfirmation(data.error);
        return;
      }
      editorWrapper.remove();
      const noProfilesFound = document.querySelector('#modal-manager #no-profiles-found');
      if (noProfilesFound) noProfilesFound.remove();
      if (data.enabled) {
        const allProfileStatusSwitches = document.querySelectorAll('#modal-manager input[id^="profile-card-status-switch-"]');
        allProfileStatusSwitches.forEach((statusSwitch) => {
          statusSwitch.checked = false;
        });
      }

      const existingProfileCard = document.querySelector(`#custom-instruction-profile-card-${profile.id}`);
      addOrReplaceProfileCard(data, existingProfileCard);
      if (data.enabled) {
        setUserSystemMessage(aboutUserInput.value, aboutModelInput.value, statuwSwitch.checked, disabledTools);
      }
    });
  });
}
