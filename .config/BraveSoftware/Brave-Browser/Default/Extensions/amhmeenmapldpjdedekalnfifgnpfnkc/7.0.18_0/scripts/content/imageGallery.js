/* global downloadFileFromUrl, openUpgradeModal, hljs, formatDate, toast, debounce, imageGalleryMenu, addImageGalleryMenuEventListener, imageGalleryMenuOptions, highlightSearch, downloadSelectedImages, makeGalleryImagesPublic, deleteGalleryimages, isDarkMode, translate, closeMenus, showConversationPreviewWrapper */
let selectedGalleryImage = null;
const allImageNodes = [];
let selectedImageGalleryImageIds = [];
let imageGalleryCurrentTab = 'dalle'; // dalle or chart or upload or public
let showAll = false;
// eslint-disable-next-line no-unused-vars
function createImageGallery() {
  selectedGalleryImage = null;
  const gallery = document.createElement('div');
  gallery.id = 'image-gallery';
  gallery.dataset.state = 'open';
  gallery.classList = 'h-full w-full flex items-center justify-center backdrop-blur-xl';
  gallery.style = 'pointer-events: auto;';

  gallery.innerHTML = `
<div role="dialog" data-state="open" class="relative flex h-full w-full justify-stretch divide-x divide-white/10 focus:outline-none" tabindex="-1" style="pointer-events: auto;">
  <div id="image-gallery-image-wrapper" class="flex flex-1 transition-[flex-basis]">
    <div class="flex flex-1 flex-col p-2">
      <div id="gallery-header" class="px-0 pb-4">
        <div class="flex items-center justify-between text-token-text-primary">
          <div class="flex items-center">
            <input type="search" id="gallery-search" tabindex="0" placeholder="${translate('Search gallery')}" class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-token-main-surface-secondary mr-2">
            <a href="https://www.youtube.com/watch?v=oU6_wgJLYEM" target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-md pl-0.5 text-token-text-tertiary h-6 w-6">
                <path fill="currentColor" d="M13 12a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0zM12 9.5A1.25 1.25 0 1 0 12 7a1.25 1.25 0 0 0 0 2.5"></path>
                <path fill="currentColor" fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0" clip-rule="evenodd"></path>
              </svg>
            </a>
          </div>
          <div id="gallery-tabs-wrapper" role="radiogroup" aria-required="false" dir="ltr" class="flex w-full overflow-hidden rounded-xl bg-token-main-surface-secondary p-1.5 dark:bg-token-main-surface-tertiary w-max gap-2 flex-shrink-0 self-center" tabindex="0" style="outline: none;">
            <button id="gallery-tab-dalle" type="button" role="radio" data-state="${imageGalleryCurrentTab === 'dalle' ? 'checked' : 'unchecked'}" value="dalle" class="text-md w-1/3 flex-grow rounded-lg border-token-border-light p-1.5 font-medium text-token-text-tertiary transition hover:text-token-text-primary radix-state-checked:border radix-state-checked:bg-token-main-surface-primary radix-state-checked:text-token-text-primary radix-state-checked:shadow-[0_0_2px_rgba(0,0,0,.03)] radix-state-checked:dark:bg-token-main-surface-secondary md:w-1/3" tabindex="0" data-radix-collection-item="">Dall·E</button>
            <button id="gallery-tab-chart" type="button" role="radio" data-state="${imageGalleryCurrentTab === 'chart' ? 'checked' : 'unchecked'}" value="chart" class="text-md w-1/3 flex-grow rounded-lg border-token-border-light p-1.5 font-medium text-token-text-tertiary transition hover:text-token-text-primary radix-state-checked:border radix-state-checked:bg-token-main-surface-primary radix-state-checked:text-token-text-primary radix-state-checked:shadow-[0_0_2px_rgba(0,0,0,.03)] radix-state-checked:dark:bg-token-main-surface-secondary md:w-1/3" tabindex="-1" data-radix-collection-item="">Charts</button>
            <button id="gallery-tab-upload" type="button" role="radio" data-state="${imageGalleryCurrentTab === 'upload' ? 'checked' : 'unchecked'}" value="upload" class="text-md w-1/3 flex-grow rounded-lg border-token-border-light p-1.5 font-medium text-token-text-tertiary transition hover:text-token-text-primary radix-state-checked:border radix-state-checked:bg-token-main-surface-primary radix-state-checked:text-token-text-primary radix-state-checked:shadow-[0_0_2px_rgba(0,0,0,.03)] radix-state-checked:dark:bg-token-main-surface-secondary md:w-1/3" tabindex="-1" data-radix-collection-item="">Uploads</button>
            <button id="gallery-tab-public" type="button" role="radio" data-state="${imageGalleryCurrentTab === 'public' ? 'checked' : 'unchecked'}" value="public" class="text-md w-1/3 flex-grow rounded-lg border-token-border-light p-1.5 font-medium text-token-text-tertiary transition hover:text-token-text-primary radix-state-checked:border radix-state-checked:bg-token-main-surface-primary radix-state-checked:text-token-text-primary radix-state-checked:shadow-[0_0_2px_rgba(0,0,0,.03)] radix-state-checked:dark:bg-token-main-surface-secondary md:w-1/3" tabindex="-1" data-radix-collection-item="">Public</button>
          </div>
          <div class="flex relative">${imageGalleryMenu()}</div>
        </div>
        <div id="gallery-selection-bar" class="hidden flex items-center justify-end py-3 w-full z-10">
          <button id="gallery-selection-cancel-button" class="flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary mr-auto border border-token-border-light">${translate('Cancel')}</button>
          <span id="gallery-selection-count" class="text-token-text-secondary text-xs mr-4">0 selected</span>
          <button id="gallery-selection-delete-button" class="flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary mr-2 border border-token-border-light">${translate('Delete')}</button>
          <button id="gallery-selection-make-public-button" class="flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary mr-2 border border-token-border-light">${translate('Make public')}</button>
          <button id="gallery-selection-download-button" class="flex items-center justify-cnter h-8 rounded-lg px-2 text-token-text-secondary focus-visible:outline-0 bg-token-main-surface-secondary hover:bg-token-main-surface-tertiary focus-visible:bg-token-main-surface-tertiary mr-2 border border-token-border-light ">${translate('Download')}</button>
        </div>
      </div>
      <div id="gallery-image-list" style="display: flex;flex-flow: wrap;justify-content: start;align-items: stretch;overflow-y:auto;"></div>
    </div>
  </div>
  <div id="image-gallery-sidebar" class="flex overflow-y-auto hidden items-start justify-start overflow-hidden bg-token-main-surface-secondary text-token-text-primary transition-[flex-basis] duration-500 md:flex md:basis-[25vw]">
    <div class="w-[25vw]">
      <div class="flex flex-col w-full justify-start items-start gap-2 p-4" draggable="false">
        <img id="gallery-selected-image" style="aspect-ratio:1;background-color: #333;" src="${chrome.runtime.getURL('images/loading.gif')}" class="row-span-4 mx-auto h-full rounded-md object-scale-down">
        <div id="gallery-selected-image-timestamp" class="w-full text-xs text-token-text-secondary">${formatDate(new Date(selectedGalleryImage?.created_at)) || '...'}</div>
      </div>
      <div class="flex flex-col items-start gap-3 p-4">
        <div class="text-sm text-token-text-secondary sm:text-base" id="gallery-selected-image-prompt-title">${imageGalleryCurrentTab === 'chart' ? 'Code' : 'Prompt'}</div>
        <div id="gallery-selected-image-prompt" class="w-full text-sm sm:text-lg !whitespace-pre-wrap">${imageGalleryCurrentTab === 'chart' ? codeWrapper(selectedGalleryImage?.prompt) || '...' : selectedGalleryImage?.prompt || '...'}</div>
        <button id="gallery-selected-image-prompt-copy-button" class="btn relative btn-secondary hidden">
          <div class="flex w-full gap-2 items-center justify-center">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em"
              xmlns="http://www.w3.org/2000/svg">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>${translate('Copy')}
          </div>
        </button>
        <div>
          <div class="flex my-1 ${selectedGalleryImage?.gen_id && ['dalle', 'chart'].includes(imageGalleryCurrentTab) ? 'visible' : 'invisible'}">Gen ID:&nbsp;
            <div class="text-token-text-secondary flex cursor-pointer" id="gallery-selected-image-gen-id-copy-button">
              <span id="gallery-selected-image-gen-id">${selectedGalleryImage?.gen_id}</span>
              <button class="flex ml-1 gap-2 items-center rounded-md p-1 text-xs text-token-text-secondary hover:text-token-text-primary">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              </button>
            </div>
          </div>
          <div class="flex my-1 ${selectedGalleryImage?.seed && ['dalle', 'chart'].includes(imageGalleryCurrentTab) ? 'visible' : 'invisible'}">Seed:&nbsp;
            <div class="text-token-text-secondary flex cursor-pointer" id="gallery-selected-image-seed-copy-button">
              <span id="gallery-selected-image-seed">${selectedGalleryImage?.seed}</span>
              <button class="flex ml-1 gap-2 items-center rounded-md p-1 text-xs text-token-text-secondary hover:text-token-text-primary">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em"
                  xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <button id="gallery-preview-conversation-button" data-conversation-id="${selectedGalleryImage?.conversation_id}" class="${imageGalleryCurrentTab !== 'public' ? 'visible' : 'invisible'} btn relative btn-secondary gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" class="icon-md">
            <path d="M160 256C160 185.3 217.3 128 288 128C358.7 128 416 185.3 416 256C416 326.7 358.7 384 288 384C217.3 384 160 326.7 160 256zM288 336C332.2 336 368 300.2 368 256C368 211.8 332.2 176 288 176C287.3 176 286.7 176 285.1 176C287.3 181.1 288 186.5 288 192C288 227.3 259.3 256 224 256C218.5 256 213.1 255.3 208 253.1C208 254.7 208 255.3 208 255.1C208 300.2 243.8 336 288 336L288 336zM95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6V112.6zM288 80C222.8 80 169.2 109.6 128.1 147.7C89.6 183.5 63.02 225.1 49.44 256C63.02 286 89.6 328.5 128.1 364.3C169.2 402.4 222.8 432 288 432C353.2 432 406.8 402.4 447.9 364.3C486.4 328.5 512.1 286 526.6 256C512.1 225.1 486.4 183.5 447.9 147.7C406.8 109.6 353.2 80 288 80V80z"/>
          </svg>${translate('Preview conversation')}
        </button>
        <div id="more-by" class="${imageGalleryCurrentTab === 'public' ? 'invisible' : 'invisible'} cursor-pointer no-underline hover:underline" style="color:#3c80f5;">More images by this user</div>
      </div>
    </div>
  </div>
</div>`;
  return gallery;
  // remove existing gallery
  // const existingGallery = document.querySelector('#image-gallery');
  // existingGallery?.remove();
  // add gallery to body
  // const body = document.querySelector('body');
  // body.insertAdjacentHTML('beforeend', gallery);
  // addImageGalleryEventListeners();
  // loadImageList();
}
function resetGallerySelection() {
  selectedImageGalleryImageIds = [];
  const galleryImages = document.querySelectorAll('[id^="gallery-image-card-"]');
  galleryImages.forEach((image) => {
    image.classList.remove('opacity-50');
  });
  const curImageGalleryCheckboxes = document.querySelectorAll('[id^="image-gallery-checkbox"]');
  curImageGalleryCheckboxes.forEach((cb) => {
    cb.checked = false;
    cb.classList.add('invisible');
  });
  const selectionBar = document.querySelector('div[id="gallery-selection-bar"]');
  if (selectionBar) selectionBar.classList.add('hidden');

  const selectionCount = document.querySelector('span[id="gallery-selection-count"]');
  if (selectionCount) selectionCount.innerText = '0 selected';
}

function loadImageList(pageNumber = 1, byUserId = '') {
  byUserId = byUserId || document.querySelector('#by-user-id')?.innerText || '';
  const searchTerm = document.querySelector('#gallery-search').value.toLowerCase();
  const galleryImageList = document.querySelector('#gallery-image-list');
  if (pageNumber === 1) galleryImageList.innerHTML = `<div class="flex flex-col w-full justify-start items-start gap-2 p-2" style="min-width:20%;max-width:20%;aspect-ratio:1;"><div id="load-more-images-button" class="relative flex flex-col w-full h-full justify-center items-center gap-2 p-4 text-token-text-primary text-2xl font-bold cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 hover:shadow-xl rounded-xl"><img style="object-fit:none;aspect-ratio:1;background-color: #333;" src="${chrome.runtime.getURL('images/loading.gif')}" class="row-span-4 mx-auto h-full rounded-md object-scale-down"></div></div>`;
  chrome.runtime.sendMessage({
    type: 'checkHasSubscription',
  }, (hasSubscription) => {
    if (searchTerm && !hasSubscription) {
      openUpgradeModal();
      return;
    }
    if (pageNumber === 1) {
      selectedImageGalleryImageIds = [];
      selectedGalleryImage = null;
    }

    // if (!byUserId) {
    //   const existingFilters = document.querySelectorAll('#gallery-filter');
    //   existingFilters.forEach((filter) => filter.remove());
    // }
    chrome.runtime.sendMessage({
      type: 'getGalleryImages',
      detail: {
        showAll,
        pageNumber,
        byUserId,
        category: imageGalleryCurrentTab === 'public' ? 'dalle' : imageGalleryCurrentTab,
        searchTerm,
        isPublic: imageGalleryCurrentTab === 'public',
      },
    }, (galleryImages) => {
      if (pageNumber === 1 && galleryImages.error) {
        galleryImageList.innerHTML = `<div class="flex flex-col w-full justify-start items-start"><div class="relative flex flex-col w-full h-full justify-center items-center gap-2 p-4 text-token-text-primary text-2xl font-bold cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 hover:shadow-xl rounded-xl text-center">${galleryImages.error}</div></div>`;
        return;
      }
      if (pageNumber === 1) allImageNodes.length = 0;
      allImageNodes.push(...galleryImages?.results || []);
      if (pageNumber === 1 && galleryImages?.results?.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        selectedGalleryImage = galleryImages?.results?.[0];
      }
      if (!galleryImageList) return;

      if (imageGalleryCurrentTab === 'public' && hasSubscription) {
        const existingPublicImagesTip = document.querySelector('#public-images-tip');
        if (!existingPublicImagesTip) {
          galleryImageList.insertAdjacentHTML('beforebegin', '<div id="public-images-tip" class="flex flex-col w-full justify-start items-start"><div class="relative flex flex-col w-full h-full justify-center items-center gap-2 p-4 text-token-text-primary text-md font-bold cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 hover:shadow-xl rounded-xl text-center">To see public images, first you need to share some of your images. The more images you share, the more public images you will see.<br/>To share, go to the Dall-E tab, select the images you would like to share, then select Make Public from the menu.</div></div>');
        }
      } else {
        const existingPublicImagesTip = document.querySelector('#public-images-tip');
        existingPublicImagesTip?.remove();
        if (allImageNodes.length === 0) {
          galleryImageList.innerHTML = `<div class="flex flex-col w-full justify-start items-start"><div class="relative flex flex-col w-full h-full justify-center items-center gap-2 p-4 text-token-text-primary text-2xl font-bold cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 hover:shadow-xl rounded-xl text-center">${translate('No images found')}!</div></div> ${hasSubscription ? '' : `<div class="flex w-full gap-2 p-2" style="min-width:20%;max-width:20%;aspect-ratio:1;flex-direction: column;"><div id="upgrade-to-pro-button-gallery" class="relative flex flex-col flex-wrap w-full h-full justify-center items-center gap-2 p-2 text-black cursor-pointer bg-gold hover:bg-gold-dark hover:shadow-xl rounded-xl"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width:48px; height:48px;" stroke="purple" fill="purple"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"></path></svg><div class="w-full text-xl font-bold flex justify-center">${translate('Upgrade to Pro')}</div><div class="text-sm w-full flex justify-center">to see public images</div></div></div>`}`;
          addSubscriptionModalEventListeners();
          return;
        }
      }

      const imageListHtml = `${[...(galleryImages?.results || [])]?.map((imageNode) => `<div class="group/dalle-image relative flex flex-col w-full justify-start items-start gap-2 p-2 cursor-pointer" style="font-size:12px;min-width:20%;max-width: 20%;" draggable="false"><img id="gallery-image-card-${imageNode.image_id}" src="${imageNode.image}" alt="${imageNode.prompt?.replace(/[^a-zA-Z0-9 ]/gi, '') || 'Generated by DALL·E'}" style="aspect-ratio:1;" class="bg-token-main-surface-tertiary w-full row-span-4 mx-auto h-full rounded-md object-scale-down ${selectedGalleryImage?.image_id === imageNode?.image_id ? 'ring-2' : ''} ${isDarkMode() ? 'ring-white ring-offset-black' : 'ring-black ring-offset-white'} ring-offset-4"><div class="invisible absolute left-3 top-3 group-hover/dalle-image:visible"><button id="image-download-button-${imageNode.image_id}" class="flex h-6 w-6 items-center justify-center rounded bg-black/50"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm text-token-text-primary"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 10.2929C7.31658 9.90237 6.68342 9.90237 6.29289 10.2929C5.90237 10.6834 5.90237 11.3166 6.29289 11.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L17.7071 11.7071C18.0976 11.3166 18.0976 10.6834 17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929L13 13.5858L13 4C13 3.44771 12.5523 3 12 3C11.4477 3 11 3.44771 11 4L11 13.5858L7.70711 10.2929ZM5 19C4.44772 19 4 19.4477 4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19L5 19Z" fill="currentColor"></path></svg></button></div>  
    <input type="checkbox" id="image-gallery-checkbox-${imageNode.image_id}" class="${selectedImageGalleryImageIds.length === 0 ? 'invisible' : ''} absolute right-3 top-3 ${imageGalleryCurrentTab !== 'public' ? 'group-hover/dalle-image:visible' : ''}" style="z-index: 11; cursor: pointer; border-radius: 2px;">
    
    </div>`).join('')}${galleryImages?.next && hasSubscription ? '<div class="flex flex-col w-full justify-start items-start gap-2 p-2" style="min-width:20%;max-width:20%;aspect-ratio:1;"><div id="load-more-images-button" class="relative flex flex-col w-full h-full justify-center items-center gap-2 p-4 text-token-text-primary text-2xl font-bold cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900 hover:shadow-xl rounded-xl">Load more...</div></div>' : hasSubscription ? '' : `<div class="flex w-full gap-2 p-2" style="min-width:20%;max-width:20%;aspect-ratio:1;flex-direction: column;"><div id="upgrade-to-pro-button-gallery" class="relative flex flex-col flex-wrap w-full h-full justify-center items-center gap-2 p-2 text-black cursor-pointer bg-gold hover:bg-gold-dark hover:shadow-xl rounded-xl"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width:48px; height:48px;" stroke="purple" fill="purple"><path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z"></path></svg><div class="w-full text-xl font-bold flex justify-center">${translate('Upgrade to Pro')}</div><div class="text-sm w-full flex justify-center">to see ${imageGalleryCurrentTab === 'public' ? 'more' : 'all'} images</div></div></div>`}`;
      if (pageNumber === 1) {
        galleryImageList.innerHTML = imageListHtml || '';
      } else {
        // remove the load more button
        const loadMoreImagesButton = document.querySelector('#load-more-images-button');
        loadMoreImagesButton?.parentElement?.remove();
        galleryImageList.insertAdjacentHTML('beforeend', imageListHtml || '');
      }
      addGalleryImageCardEventListeners(galleryImages?.results);
      addLoadMoreImagesEventListener(pageNumber);
      addSubscriptionModalEventListeners();
      if (pageNumber === 1) {
        // click on first image
        const firstImage = document.querySelector(`#gallery-image-card-${allImageNodes[0]?.image_id}`);
        firstImage?.click();
      }
    });
  });
}

function addLoadMoreImagesEventListener(pageNumber) {
  const loadMoreImagesButton = document.querySelector('#load-more-images-button');
  loadMoreImagesButton?.addEventListener('click', () => {
    loadMoreImagesButton.innerHTML = `<img style="object-fit:none;aspect-ratio:1;background-color: #333;" src="${chrome.runtime.getURL('images/loading.gif')}" class="row-span-4 mx-auto h-full rounded-md object-scale-down">`;
    loadImageList(pageNumber + 1);
  });
  // add an observer to click the load more button when it is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadMoreImagesButton?.click();
      }
    });
  }, { threshold: 0.5 });
  if (loadMoreImagesButton) {
    observer.observe(loadMoreImagesButton);
  }
}
// eslint-disable-next-line no-unused-vars
function addImageGalleryEventListeners() {
  // search
  const gallerySearch = document.querySelector('#gallery-search');
  gallerySearch?.addEventListener('input', debounce(() => {
    resetSidebar();
    loadImageList();
  }));
  // tab switch
  const dalleTab = document.querySelector('#gallery-tab-dalle');
  const chartsTab = document.querySelector('#gallery-tab-chart');
  const uploadTab = document.querySelector('#gallery-tab-upload');
  const publicTab = document.querySelector('#gallery-tab-public');

  dalleTab?.addEventListener('click', () => {
    showAll = false;
    if (imageGalleryCurrentTab === 'dalle') return;
    dalleTab.dataset.state = 'checked';
    chartsTab.dataset.state = 'unchecked';
    uploadTab.dataset.state = 'unchecked';
    publicTab.dataset.state = 'unchecked';
    imageGalleryCurrentTab = 'dalle';
    document.querySelector('#gallery-search').value = '';
    resetSidebar();
    resetGallerySelection();
    removeUserFilter();
    loadImageList();
  });
  chartsTab?.addEventListener('click', () => {
    showAll = false;
    if (imageGalleryCurrentTab === 'chart') return;
    dalleTab.dataset.state = 'unchecked';
    chartsTab.dataset.state = 'checked';
    uploadTab.dataset.state = 'unchecked';
    publicTab.dataset.state = 'unchecked';
    imageGalleryCurrentTab = 'chart';
    document.querySelector('#gallery-search').value = '';
    resetSidebar();
    resetGallerySelection();
    removeUserFilter();
    loadImageList();
  });
  uploadTab?.addEventListener('click', () => {
    showAll = false;
    if (imageGalleryCurrentTab === 'upload') return;
    dalleTab.dataset.state = 'unchecked';
    chartsTab.dataset.state = 'unchecked';
    uploadTab.dataset.state = 'checked';
    publicTab.dataset.state = 'unchecked';
    imageGalleryCurrentTab = 'upload';
    document.querySelector('#gallery-search').value = '';
    resetSidebar();
    resetGallerySelection();
    removeUserFilter();
    loadImageList();
  });
  publicTab?.addEventListener('click', (e) => {
    // check if shift clicked
    showAll = false;
    if (e.shiftKey) {
      showAll = true;
    }
    if (imageGalleryCurrentTab === 'public') return;
    dalleTab.dataset.state = 'unchecked';
    chartsTab.dataset.state = 'unchecked';
    uploadTab.dataset.state = 'unchecked';
    publicTab.dataset.state = 'checked';
    imageGalleryCurrentTab = 'public';
    document.querySelector('#gallery-search').value = '';
    resetSidebar();
    resetGallerySelection();
    removeUserFilter();
    loadImageList();
  });

  // selection bar
  const cancelSelectionButton = document.querySelector('#gallery-selection-cancel-button');
  cancelSelectionButton?.addEventListener('click', () => {
    resetGallerySelection();
  });
  const deleteSelectionButton = document.querySelector('#gallery-selection-delete-button');
  deleteSelectionButton?.addEventListener('click', () => {
    deleteGalleryimages();
  });
  const makePublicSelectionButton = document.querySelector('#gallery-selection-make-public-button');
  makePublicSelectionButton?.addEventListener('click', () => {
    makeGalleryImagesPublic();
  });
  const downloadSelectionButton = document.querySelector('#gallery-selection-download-button');
  downloadSelectionButton?.addEventListener('click', async () => {
    await downloadSelectedImages(downloadSelectionButton, selectedImageGalleryImageIds);
  });
  // copy prompt
  const copyPromptButton = document.querySelector('#gallery-selected-image-prompt-copy-button');
  copyPromptButton?.addEventListener('click', (e) => {
    // if shift clicked
    if (e.shiftKey) {
      if (imageGalleryCurrentTab !== 'public') return;
      if (!selectedGalleryImage?.created_by?.id) return;
      addUserFilter(selectedGalleryImage?.created_by);
      loadImageList(1, selectedGalleryImage?.created_by?.id);
      return;
    }
    copyPromptButton.innerHTML = `<div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${translate('Copied')}!</div>`;
    copyPromptButton.classList = 'opacity-50 hover:bg-inherit cursor-not-allowed btn relative btn-secondary hidden sm:block';
    setTimeout(() => {
      copyPromptButton.innerHTML = `<div class="flex w-full gap-2 items-center justify-center"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>${translate('Copy')}</div>`;
      copyPromptButton.classList = 'btn relative btn-secondary hidden sm:block';
    }, 2000);
    const prompt = document.querySelector('#gallery-selected-image-prompt');
    navigator.clipboard.writeText(prompt.textContent);
  });
  // copy gen id
  const copyGenIdButton = document.querySelector('#gallery-selected-image-gen-id-copy-button');
  copyGenIdButton?.addEventListener('click', () => {
    navigator.clipboard.writeText(copyGenIdButton.innerText);
    toast('Copied Gen ID to clipboard');
  });
  // copy seed
  const copySeedButton = document.querySelector('#gallery-selected-image-seed-copy-button');
  copySeedButton?.addEventListener('click', () => {
    navigator.clipboard.writeText(copySeedButton.innerText);
    toast('Copied Seed to clipboard');
  });
  // preview conversation
  const galleryPreviewConversationButton = document.querySelector('#gallery-preview-conversation-button');
  galleryPreviewConversationButton.addEventListener('click', () => {
    const { conversationId } = galleryPreviewConversationButton.dataset;
    showConversationPreviewWrapper(conversationId, null, false, true);
  });
  // more by
  const moreBy = document.querySelector('#more-by');
  moreBy.addEventListener('click', () => {
    if (!selectedGalleryImage?.created_by?.id) return;
    addUserFilter(selectedGalleryImage?.created_by);
    loadImageList(1, selectedGalleryImage?.created_by?.id);
  });
  // menu button
  const menu = document.querySelector('#image-gallery-menu-wrapper');
  const menuButton = document.querySelector('#image-gallery-menu-button');
  menuButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    closeMenus();
    const optionListDropdown = document.querySelector('#image-gallery-menu-options');
    if (optionListDropdown) {
      optionListDropdown.remove();
    } else {
      const newOptionListDropdown = imageGalleryMenuOptions();
      menu.insertAdjacentHTML('beforeend', newOptionListDropdown);
      addImageGalleryMenuEventListener();
    }
  });
}
function addGalleryImageCardEventListeners(imageNodes) {
  // download center image
  // get last 24 image-download-button-*
  const imageDownloadButtons = [...document.querySelectorAll('[id^="image-download-button-"]')].slice(-24);

  const newImageNodeIds = imageNodes?.map((imageNode) => imageNode.image_id);
  imageDownloadButtons.forEach((imageDownloadButton) => {
    const imageId = imageDownloadButton.id.split('image-download-button-')[1];
    if (!imageId) return;
    if (!newImageNodeIds?.includes(imageId)) return;
    imageDownloadButton?.addEventListener('click', () => {
      const imageElement = document.querySelector(`#gallery-image-card-${imageId}`);
      const url = decodeURIComponent(imageElement.src);
      const format = url.split('.').pop() || 'webp';
      const filename = `${imageId}.${format}`;

      if (imageElement.src) {
        downloadFileFromUrl(imageElement.src, filename);
      }
    });
  });

  // image-gallery-checkbox
  const imageGalleryCheckboxes = document.querySelectorAll('[id^="image-gallery-checkbox"]');
  imageGalleryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', (e) => {
      const imageId = checkbox.id.split('image-gallery-checkbox-')[1];
      if (!imageId) return;
      if (!newImageNodeIds) return;
      if (!newImageNodeIds?.includes(imageId)) return;

      if (checkbox.checked && !selectedImageGalleryImageIds.includes(imageId)) {
        // before adding the first checkbox
        if (selectedImageGalleryImageIds.length === 0) {
          // remove invisible class from all checkboxes
          const curImageGalleryCheckboxes = document.querySelectorAll('[id^="image-gallery-checkbox"]'); curImageGalleryCheckboxes.forEach((cb) => {
            cb.classList.remove('invisible');
          });
          const selectionBar = document.querySelector('div[id="gallery-selection-bar"]');
          if (selectionBar) selectionBar.classList.remove('hidden');
        }
        if (e.shiftKey) {
          if (selectedImageGalleryImageIds.length === 0) return;
          const galleryImages = document.querySelectorAll('[id^="gallery-image-card-"]');
          const selectedImageIndex = allImageNodes.findIndex((imageNode) => imageNode.image_id === selectedGalleryImage?.image_id);
          const curImageIndex = allImageNodes.findIndex((imageNode) => imageNode.image_id === imageId);
          const start = Math.min(selectedImageIndex, curImageIndex);
          const end = Math.max(selectedImageIndex, curImageIndex);
          for (let i = start; i <= end; i += 1) {
            const galleryImage = galleryImages[i];
            if (!galleryImage) return;
            galleryImage.classList.add('opacity-50');
            const curImageId = galleryImage.id.split('gallery-image-card-')[1];
            if (!curImageId) return;
            const curCheckbox = document.querySelector(`#image-gallery-checkbox-${curImageId}`);
            if (curCheckbox) {
              curCheckbox.checked = true;
              if (!selectedImageGalleryImageIds.includes(curImageId)) {
                selectedImageGalleryImageIds.push(curImageId);
              }
            }
          }
        } else {
          if (!selectedImageGalleryImageIds.includes(imageId)) {
            const galleryImage = document.querySelector(`#gallery-image-card-${imageId}`);
            if (!galleryImage) return;
            galleryImage.classList.add('opacity-50');
            selectedImageGalleryImageIds.push(imageId);
          }
        }
        const selectionCount = document.querySelector('span[id="gallery-selection-count"]');
        if (selectionCount) selectionCount.innerText = `${selectedImageGalleryImageIds.length} selected`;
      } else {
        selectedImageGalleryImageIds = selectedImageGalleryImageIds.filter((id) => id !== imageId);
        const selectionCount = document.querySelector('span[id="gallery-selection-count"]');
        if (selectionCount) selectionCount.innerText = `${selectedImageGalleryImageIds.length} selected`;
        const galleryImage = document.querySelector(`#gallery-image-card-${imageId}`);
        if (galleryImage) galleryImage.classList.remove('opacity-50');
        // if no selected checkbox, add invisible class to all checkboxes
        if (selectedImageGalleryImageIds.length === 0) {
          resetGallerySelection();
        }
      }
    });
  });
  // thumbnail image click
  const galleryImages = document.querySelectorAll('[id^="gallery-image-card-"]');
  galleryImages.forEach((image) => {
    const imageId = image.id.split('gallery-image-card-')[1];
    if (!imageId) return;
    if (!newImageNodeIds) return;
    if (!newImageNodeIds?.includes(imageId)) return;
    image.addEventListener('click', () => {
      selectedGalleryImage = imageNodes.find((imageNode) => imageNode.image_id === image.id.split('gallery-image-card-')[1]);
      document.querySelectorAll('[id^="gallery-image-card-"]').forEach((galleryImage) => {
        galleryImage.classList.remove('ring-2');
      });
      image.classList.add('ring-2');
      // open sidebar if closed
      const imageWrapper = document.querySelector('#image-gallery-image-wrapper');
      const sidebar = document.querySelector('#image-gallery-sidebar');
      sidebar.classList.replace('md:basis-0', 'md:basis-[25vw]');
      imageWrapper.classList.remove('md:basis-[75vw]');
      // update image info in sidebar
      const selectedImage = document.querySelector('#gallery-selected-image');
      selectedImage.src = image.src;
      selectedImage.style.aspectRatio = Math.min(1, (selectedGalleryImage?.width || 1) / (selectedGalleryImage?.height || 1));
      const selectedImageTime = document.querySelector('#gallery-selected-image-timestamp');
      selectedImageTime.textContent = formatDate(new Date(selectedGalleryImage.created_at));
      const selectedImagePromptTitle = document.querySelector('#gallery-selected-image-prompt-title');
      selectedImagePromptTitle.textContent = selectedGalleryImage.category === 'chart' ? 'Code' : 'Prompt';
      const prompt = document.querySelector('#gallery-selected-image-prompt');
      prompt.innerHTML = imageGalleryCurrentTab === 'chart' ? codeWrapper(selectedGalleryImage.prompt) : selectedGalleryImage.prompt;
      const copyPromptButton = document.querySelector('#gallery-selected-image-prompt-copy-button');
      if (imageGalleryCurrentTab === 'upload') {
        copyPromptButton.classList.add('hidden');
      } else {
        copyPromptButton.classList.remove('hidden');
      }
      const searchValue = document.querySelector('#gallery-search').value;
      if (searchValue) {
        highlightSearch([prompt], searchValue);
      }
      const genId = document.querySelector('#gallery-selected-image-gen-id');
      const seed = document.querySelector('#gallery-selected-image-seed');
      const galleryPreviewConversationButton = document.querySelector('#gallery-preview-conversation-button');
      galleryPreviewConversationButton.dataset.conversationId = selectedGalleryImage?.conversation_id || '';
      // const moreBy = document.querySelector('#more-by');
      if (['upload', 'public'].includes(imageGalleryCurrentTab)) {
        genId.parentElement.parentElement.classList.add('invisible');
        seed.parentElement.parentElement.classList.add('invisible');
      } else {
        genId.textContent = selectedGalleryImage.gen_id;
        genId.parentElement.parentElement.classList = `flex my-1 ${selectedGalleryImage.gen_id ? 'visible' : 'invisible'}`;
        seed.textContent = selectedGalleryImage.seed;
        seed.parentElement.parentElement.classList = `flex my-1 ${selectedGalleryImage.seed ? 'visible' : 'invisible'}`;
      }

      if (['public'].includes(imageGalleryCurrentTab)) {
        galleryPreviewConversationButton.classList.add('invisible');
        // moreBy.classList.remove('invisible');
      } else {
        galleryPreviewConversationButton.classList.remove('invisible');
        // moreBy.classList.add('invisible');
      }
    });
  });
}
function addUserFilter(user) {
  removeUserFilter();
  const galleryHeader = document.querySelector('#gallery-header');
  const galleryFilter = document.createElement('div');
  galleryFilter.id = 'gallery-filter';
  galleryFilter.classList = 'flex items-center justify-between py-2 text-token-text-primary';
  galleryFilter.innerHTML = `<div class="flex items-center gap-2 py-1 px-3 border border-token-border-heavy rounded-full"><div class="text-xs">Images by user id: <span id="by-user-id">${user?.id}</span></div><button id="remove-filter-button" class="transition text-token-text-secondary hover:text-token-text-primary" aria-label="remove filter" type="button"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-md" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button></div>`;
  // add filter after header
  galleryHeader.insertAdjacentElement('afterend', galleryFilter);
  // add filter event listener
  const removeFilterButton = document.querySelector('#remove-filter-button');
  removeFilterButton?.addEventListener('click', () => {
    removeUserFilter();
    loadImageList();
  });
}
const removeUserFilter = () => {
  const existingFilters = document.querySelectorAll('#gallery-filter');
  existingFilters.forEach((filter) => filter.remove());
};
function resetSidebar() {
  const selectedImage = document.querySelector('#gallery-selected-image');
  selectedImage.src = chrome.runtime.getURL('images/loading.gif');
  selectedImage.style.aspectRatio = 1;
  const selectedImageTime = document.querySelector('#gallery-selected-image-timestamp');
  selectedImageTime.textContent = '...';
  const selectedImagePromptTitle = document.querySelector('#gallery-selected-image-prompt-title');
  selectedImagePromptTitle.textContent = imageGalleryCurrentTab === 'chart' ? 'Code' : 'Prompt';
  const prompt = document.querySelector('#gallery-selected-image-prompt');
  prompt.innerHTML = '...';
  const genId = document.querySelector('#gallery-selected-image-gen-id');
  const seed = document.querySelector('#gallery-selected-image-seed');
  const galleryPreviewConversationButton = document.querySelector('#gallery-preview-conversation-button');
  // const moreBy = document.querySelector('#more-by');
  const menuButton = document.querySelector('#image-gallery-menu-button');
  if (imageGalleryCurrentTab === 'public') {
    menuButton?.classList?.add('invisible');
    genId.parentElement.parentElement.classList.add('invisible');
    seed.parentElement.parentElement.classList.add('invisible');
    galleryPreviewConversationButton.classList.add('invisible');
    // moreBy.classList.remove('invisible');
  } else if (imageGalleryCurrentTab === 'upload') {
    menuButton?.classList?.remove('invisible');
    genId.parentElement.parentElement.classList.add('invisible');
    seed.parentElement.parentElement.classList.add('invisible');
    galleryPreviewConversationButton.classList.remove('invisible');
    // moreBy.classList.remove
  } else {
    menuButton?.classList?.remove('invisible');
    genId.parentElement.parentElement.classList.remove('invisible');
    genId.textContent = '';
    seed.parentElement.parentElement.classList.remove('invisible');
    seed.textContent = '';
    galleryPreviewConversationButton.classList.remove('invisible');
    // moreBy.classList.add('invisible');
  }
}
function codeWrapper(code) {
  if (!code) return '';
  const { language } = hljs.highlightAuto(code);
  return `<div class="overflow-y-auto" style="background: #333; padding: 8px; border-radius: 8px;"><code hljs language-${language} id="message-plugin-request-html-36053455-5209-4236-901d-a179d861f092" class="!whitespace-pre-wrap" style="font-size:12px;">${code}</code></div>`;
}

function addSubscriptionModalEventListeners() {
  // upgrade to pro
  const upgradeToProButton = document.querySelector('#upgrade-to-pro-button-gallery');
  upgradeToProButton?.addEventListener('click', () => {
    openUpgradeModal(false);
  });
}
