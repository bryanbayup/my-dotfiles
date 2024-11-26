/* global loadingSpinner, escapeHTML, createCustomInstructionProfileEditor, debounce, dropdown, addDropdownEventListener, profilesSortByList, setUserSystemMessage, errorUpgradeConfirmation, getUserSystemMessage, translate, toast, closeMenus */

// eslint-disable-next-line no-unused-vars
function customInstructionProfileManagerModalContent() {
  const content = document.createElement('div');
  content.id = 'modal-content-custom-instruction-profile-manager';
  content.classList = 'markdown prose-invert relative h-full overflow-hidden';
  content.style.paddingBottom = '59px';

  const filterBar = document.createElement('div');
  filterBar.classList = 'flex items-center justify-between p-2 bg-token-main-surface-primary border-b border-token-border-light sticky top-0 z-10';

  content.appendChild(filterBar);

  const searchInput = document.createElement('input');
  searchInput.id = 'custom-instruction-profile-manager-search-input';
  searchInput.type = 'search';
  searchInput.placeholder = translate('Search profiles');
  searchInput.classList = 'text-token-text-primary bg-token-main-surface-secondary border border-token-border-light text-sm rounded-md w-full h-10';
  searchInput.autocomplete = 'off';

  const delayedSearch = debounce(() => {
    fetchCustomInstructionProfiles();
  });
  searchInput.addEventListener('input', (e) => {
    if (e.target.value.trim().length > 2) {
      delayedSearch(e);
    } else if (e.target.value.length === 0) {
      fetchCustomInstructionProfiles();
    }
  });
  filterBar.appendChild(searchInput);
  chrome.storage.local.get(['settings'], (result) => {
    const { settings } = result;
    const { selectedProfilesManagerSortBy } = settings;
    // add sort button
    const sortBySelectorWrapper = document.createElement('div');
    sortBySelectorWrapper.id = 'custom-instruction-profile-manager-sort-by-wrapper';
    sortBySelectorWrapper.style = 'position:relative;width:150px;z-index:1000;margin-left:8px;';
    sortBySelectorWrapper.innerHTML = dropdown('Profiles-Manager-SortBy', profilesSortByList, selectedProfilesManagerSortBy, 'code', 'right');
    filterBar.appendChild(sortBySelectorWrapper);
    addDropdownEventListener('Profiles-Manager-SortBy', profilesSortByList, 'code', () => fetchCustomInstructionProfiles());
    // add compact view button
    const compactViewButton = profileCardCompactViewButton(settings);
    filterBar.appendChild(compactViewButton);
  });

  const profileList = document.createElement('div');
  profileList.id = 'custom-instruction-profile-manager-profile-list';
  profileList.classList = 'grid grid-cols-4 gap-4 p-4 pb-32 overflow-y-auto h-full content-start';
  content.appendChild(profileList);

  return content;
}
// eslint-disable-next-line no-unused-vars
function customInstructionProfileManagerModalActions() {
  const actions = document.createElement('div');
  actions.classList = 'flex items-center justify-end w-full mt-2';
  const addNewProfileButton = document.createElement('button');
  addNewProfileButton.classList = 'btn btn-primary';
  addNewProfileButton.innerText = translate('Add New Profile');
  addNewProfileButton.addEventListener('click', async (e) => {
    // if shift+click
    if (e.shiftKey) {
      chrome.storage.local.get(['customInstructionProfiles']).then((result) => {
        // copy to clipboard
        const copyText = JSON.stringify(result.customInstructionProfiles);
        const el = document.createElement('textarea');
        el.value = copyText;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        toast('Copied to clipboard');
      });
      return;
    }
    const hasSubscription = await chrome.runtime.sendMessage({
      type: 'checkHasSubscription',
    });
    const profileCards = document.querySelectorAll('#modal-manager div[id^="custom-instruction-profile-card-"]');
    if (!hasSubscription && profileCards.length >= 5) {
      const error = { type: 'limit', title: 'You have reached the limit', message: 'You have reached the limits of Custom Instruction Profiles with free account. Upgrade to Pro to remove all limits.' };
      errorUpgradeConfirmation(error);
      return;
    }
    createCustomInstructionProfileEditor();
  });
  actions.appendChild(addNewProfileButton);
  return actions;
}

function profileCardCompactViewButton(settings) {
  const { selectedProfileView } = settings;

  const compactViewButton = document.createElement('button');
  compactViewButton.classList = 'h-10 aspect-1 flex items-center justify-center rounded-lg px-2 ml-2 text-token-text-secondary focus-visible:outline-0 bg-token-sidebar-surface-primary hover:bg-token-sidebar-surface-secondary focus-visible:bg-token-sidebar-surface-secondary border border-token-border-light';
  compactViewButton.innerHTML = selectedProfileView === 'list' ? '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM206.4 335.1L152 394.9V56.02C152 42.76 141.3 32 128 32S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"/></svg>' : '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM145.6 39.37c-9.062-9.82-26.19-9.82-35.25 0L14.38 143.4c-9 9.758-8.406 24.96 1.344 33.94C20.35 181.7 26.19 183.8 32 183.8c6.469 0 12.91-2.594 17.62-7.719L104 117.1v338.9C104 469.2 114.8 480 128 480s24-10.76 24-24.02V117.1l54.37 58.95C215.3 185.8 230.5 186.5 240.3 177.4C250 168.4 250.6 153.2 241.6 143.4L145.6 39.37z"/></svg>';
  compactViewButton.addEventListener('click', () => {
    chrome.storage.local.get(['settings'], (res) => {
      // switch between aspect-2 to aspect-1.5 for all profileCard
      const profileCards = document.querySelectorAll('#modal-manager div[id^="custom-instruction-profile-card-"]');
      profileCards.forEach((profileCard) => {
        if (res.settings.selectedProfileView === 'list') {
          profileCard.classList.remove('aspect-2');
          profileCard.classList.add('aspect-1.5');
        } else {
          profileCard.classList.remove('aspect-1.5');
          profileCard.classList.add('aspect-2');
        }
      });
      if (res.settings.selectedProfileView === 'list') {
        compactViewButton.innerHTML = '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM145.6 39.37c-9.062-9.82-26.19-9.82-35.25 0L14.38 143.4c-9 9.758-8.406 24.96 1.344 33.94C20.35 181.7 26.19 183.8 32 183.8c6.469 0 12.91-2.594 17.62-7.719L104 117.1v338.9C104 469.2 114.8 480 128 480s24-10.76 24-24.02V117.1l54.37 58.95C215.3 185.8 230.5 186.5 240.3 177.4C250 168.4 250.6 153.2 241.6 143.4L145.6 39.37z"/></svg>';
      } else {
        compactViewButton.innerHTML = '<svg fill="currentColor" class="icon-md" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 192h96c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32h-96c-17.6 0-32 14.4-32 32v96C288 177.6 302.4 192 320 192zM336 80h64v64h-64V80zM480 256h-160c-17.67 0-32 14.33-32 32v160c0 17.67 14.33 32 32 32h160c17.67 0 32-14.33 32-32V288C512 270.3 497.7 256 480 256zM464 432h-128v-128h128V432zM206.4 335.1L152 394.9V56.02C152 42.76 141.3 32 128 32S104 42.76 104 56.02v338.9l-54.37-58.95c-4.719-5.125-11.16-7.719-17.62-7.719c-5.812 0-11.66 2.094-16.28 6.375c-9.75 8.977-10.34 24.18-1.344 33.94l95.1 104.1c9.062 9.82 26.19 9.82 35.25 0l95.1-104.1c9-9.758 8.406-24.96-1.344-33.94C230.5 325.5 215.3 326.2 206.4 335.1z"/></svg>';
      }
      chrome.storage.local.set({
        settings: {
          ...res.settings,
          selectedProfileView: res.settings.selectedProfileView === 'list' ? 'grid' : 'list',
        },
      });
    });
  });
  return compactViewButton;
}

function createCustomInstructionProfileCard(profile, settings) {
  const profileCard = document.createElement('div');
  profileCard.id = `custom-instruction-profile-card-${profile.id}`;
  profileCard.classList = `bg-token-main-surface-secondary p-4 pb-2 rounded-md cursor-pointer hover:bg-token-main-surface-tertiary ${settings.selectedProfileView === 'list' ? 'aspect-2' : 'aspect-1.5'} flex flex-col h-auto`;
  profileCard.style = 'height: max-content;outline-offset: 4px; outline: none;';

  profileCard.innerHTML = `<div class="flex items-center justify-between border-b border-token-border-light pb-1"><div class="text-md text-token-text-primary whitespace-nowrap overflow-hidden text-ellipsis flex items-center w-full">${escapeHTML(profile.name)}</div>
  </div>
  <div class="flex-1 text-token-text-secondary text-sm whitespace-wrap overflow-hidden text-ellipsis  break-all">${escapeHTML(`${profile.about_user_message} ${profile.about_model_message}`.substring(0, 250))}</div>

  <div class="flex overflow-hidden my-1">
    ${['browsing', 'dalle', 'python'].filter((tool) => !profile.disabled_tools.includes(tool)).map((tool) => `<span id="prompt-card-tag-${tool}" class="border border-token-border-light hover:bg-token-main-surface-secondary text-token-text-secondary text-xs px-2 rounded-full mr-1 capitalize whitespace-nowrap overflow-hidden text-ellipsis">${tool}</span>`).join('')}
  </div>
  
  <div class="border-t border-token-border-light flex justify-between items-center pt-1">
   
    <div id="profile-card-action-${profile.id}" class="flex items-center w-full">
      <div class="cursor-pointer text-sm flex items-center justify-between gap-2 mt-1 w-full">${translate('Enable for new chats')}<label class="sp-switch mr-0"><input id="profile-card-status-switch-${profile.id}" type="checkbox" ${profile.enabled ? 'checked=""' : ''}><span class="sp-switch-slider round"></span></label></div>
    </div>
  </div>`;
  profileCard.addEventListener('click', () => {
    createCustomInstructionProfileEditor(profile);
  });
  return profileCard;
}
function addCustomInstructionProfileCardEventListeners(profile) {
  const profileCard = document.querySelector(`#custom-instruction-profile-card-${profile.id}`);
  const profileCardAction = profileCard.querySelector(`#profile-card-action-${profile.id}`);
  const profileCardStatusSwitch = profileCard.querySelector(`#profile-card-status-switch-${profile.id}`);
  profileCardAction.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenus();
  });
  profileCardStatusSwitch.addEventListener('input', (e) => {
    e.stopPropagation();
    closeMenus();
  });
  profileCardStatusSwitch.addEventListener('change', (e) => {
    e.stopPropagation();
    closeMenus();
    // only one profile can be enabled at a time
    if (e.target.checked) {
      const allProfileStatusSwitches = document.querySelectorAll('#modal-manager input[id^="profile-card-status-switch-"]');
      allProfileStatusSwitches.forEach((statusSwitch) => {
        if (statusSwitch.id !== e.target.id) {
          statusSwitch.checked = false;
        }
      });
    }
    chrome.runtime.sendMessage({
      type: 'updateCustomInstructionProfile',
      detail: {
        profileId: profile.id,
        profile: {
          enabled: e.target.checked,
        },
      },
    }, () => {
      setUserSystemMessage(profile.about_user_message, profile.about_model_message, !profile.enabled, profile.disabled_tools);
    });
  });
}

// eslint-disable-next-line no-unused-vars
function addOrReplaceProfileCard(profile, origElement = null) {
  chrome.storage.local.get(['settings'], ({ settings }) => {
    const existingProfileCard = document.querySelector(`#modal-manager #custom-instruction-profile-card-${profile.id}`);
    if (existingProfileCard) {
      const newProfileCard = createCustomInstructionProfileCard(profile, settings);
      existingProfileCard.replaceWith(newProfileCard);
      addCustomInstructionProfileCardEventListeners(profile);
    } else {
      // add the profile card to the beginning of the list
      const profileList = document.querySelector('#modal-manager #custom-instruction-profile-manager-profile-list');
      const noProfilesFound = document.querySelector('#modal-manager #no-profiles-found');
      if (noProfilesFound) noProfilesFound.remove();
      const newProfileCard = createCustomInstructionProfileCard(profile, settings);
      if (origElement) {
        // add the profile card after the origElement
        origElement.after(newProfileCard);
      } else {
        profileList.prepend(newProfileCard);
      }
      addCustomInstructionProfileCardEventListeners(profile);
    }
  });
}
function fetchCustomInstructionProfiles(pageNumber = 1) {
  const profileList = document.querySelector('#modal-manager #custom-instruction-profile-manager-profile-list');
  if (!profileList) return;
  if (pageNumber === 1) {
    profileList.innerHTML = '';
    profileList.appendChild(loadingSpinner('custom-instruction-profile-manager-main-content'));
  }

  chrome.storage.local.get(['settings'], ({ settings }) => {
    const { selectedProfilesManagerSortBy } = settings;
    const profileManagerSearchTerm = document.querySelector('#modal-manager [id=custom-instruction-profile-manager-search-input]')?.value;
    chrome.runtime.sendMessage({
      type: 'getCustomInstructionProfiles',
      detail: {
        pageNumber,
        searchTerm: profileManagerSearchTerm,
        sortBy: selectedProfilesManagerSortBy?.code,
      },
    }, (data) => {
      const profiles = data.results;
      if (!profiles) return;
      if (!Array.isArray(profiles)) return;
      const loadMoreButton = document.querySelector('#modal-manager #load-more-profiles-button');
      if (loadMoreButton) loadMoreButton.remove();
      const loadingSpinnerElement = document.querySelector('#modal-manager #loading-spinner-custom-instruction-profile-manager-main-content');
      if (loadingSpinnerElement) loadingSpinnerElement.remove();
      if (profiles?.length === 0 && pageNumber === 1) {
        const noProfiles = document.createElement('p');
        noProfiles.id = 'no-profiles-found';
        noProfiles.classList = 'absolute text-center text-sm text-token-text-secondary w-full p-4';
        noProfiles.innerText = translate('No profiles found');
        profileList.appendChild(noProfiles);
      } else {
        profiles.forEach((profile) => {
          const profileCard = createCustomInstructionProfileCard(profile, settings);
          profileList.appendChild(profileCard);
          addCustomInstructionProfileCardEventListeners(profile);
        });
        if (data.next) {
          const loadMoreProfilesButton = document.createElement('button');
          loadMoreProfilesButton.id = 'load-more-profiles-button';
          loadMoreProfilesButton.classList = 'bg-token-main-surface-secondary p-4 pb-2 rounded-md cursor-pointer hover:bg-token-main-surface-tertiary aspect-1.5 flex flex-col h-auto relative';
          loadMoreProfilesButton.appendChild(loadingSpinner('load-more-profiles-button'));
          profileList.appendChild(loadMoreProfilesButton);
          // add an observer to click the load more button when it is visible
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                fetchCustomInstructionProfiles(pageNumber + 1);
              }
            });
          }, { threshold: 0.5 });
          if (loadMoreProfilesButton) {
            observer.observe(loadMoreProfilesButton);
          }
        }
      }
    });
  });
}
// eslint-disable-next-line no-unused-vars
function saveAllExistingCustomInstructionProfilesInDB() {
  chrome.storage.local.get(['customInstructionProfiles', 'saveAllExistingCustomInstructionProfilesInDBDone'], (result) => {
    const { customInstructionProfiles, saveAllExistingCustomInstructionProfilesInDBDone } = result;
    if (customInstructionProfiles && !saveAllExistingCustomInstructionProfilesInDBDone) {
      customInstructionProfiles.forEach((profile) => {
        chrome.runtime.sendMessage({
          type: 'addCustomInstructionProfile',
          detail: {
            profile,
          },
        });
      });
      chrome.storage.local.set({ saveAllExistingCustomInstructionProfilesInDBDone: true });
    } else {
      getUserSystemMessage(); // to get active custom instructions profile and update our db in case user has changed it on another device
    }
  });
}
