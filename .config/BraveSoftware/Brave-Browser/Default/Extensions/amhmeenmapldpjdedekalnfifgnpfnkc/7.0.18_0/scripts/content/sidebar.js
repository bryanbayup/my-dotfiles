// eslint-disable-next-line no-unused-vars
/* global selectedConversationFolderBreadcrumb:true, createManager, createTooltip, openMoveToFolderModal, openExportModal, downloadSelectedImages, translate, defaultConversationFolders */

// eslint-disable-next-line no-unused-vars
function makeSidebarResizable() {
  const limitWidth = document.querySelector('div[class*="w-[260px]"]');
  if (!limitWidth) return;
  limitWidth.style = 'width: 100%;';
  limitWidth.parentElement.classList.add('resize-x');
}
// eslint-disable-next-line no-unused-vars
function removeUpdateButton() {
  const navs = document.querySelectorAll('nav');
  if (navs.length === 0) return;
  for (let i = 0; i < navs.length; i += 1) {
    const nav = navs[i];
    nav.parentElement.parentElement.style.zIndex = 100000;
    // remove update button
    const updateButton = nav.querySelector('div a svg path[d="M12.5001 3.44338C12.1907 3.26474 11.8095 3.26474 11.5001 3.44338L4.83984 7.28868C4.53044 7.46731 4.33984 7.79744 4.33984 8.1547V15.8453C4.33984 16.2026 4.53044 16.5327 4.83984 16.7113L11.5001 20.5566C11.8095 20.7353 12.1907 20.7353 12.5001 20.5566L19.1604 16.7113C19.4698 16.5327 19.6604 16.2026 19.6604 15.8453V8.1547C19.6604 7.79744 19.4698 7.46731 19.1604 7.28868L12.5001 3.44338ZM10.5001 1.71133C11.4283 1.17543 12.5719 1.17543 13.5001 1.71133L20.1604 5.55663C21.0886 6.09252 21.6604 7.0829 21.6604 8.1547V15.8453C21.6604 16.9171 21.0886 17.9075 20.1604 18.4434L13.5001 22.2887C12.5719 22.8246 11.4283 22.8246 10.5001 22.2887L3.83984 18.4434C2.91164 17.9075 2.33984 16.9171 2.33984 15.8453V8.1547C2.33984 7.0829 2.91164 6.09252 3.83984 5.55663L10.5001 1.71133Z"]');
    if (updateButton) {
      updateButton.closest('a').parentElement.remove();
    }
  }
}
// eslint-disable-next-line no-unused-vars
function addSearchConversationsButton() {
  const chatgptSearchButton = document.querySelector('button svg path[d="M10.75 4.25C7.16015 4.25 4.25 7.16015 4.25 10.75C4.25 14.3399 7.16015 17.25 10.75 17.25C14.3399 17.25 17.25 14.3399 17.25 10.75C17.25 7.16015 14.3399 4.25 10.75 4.25ZM2.25 10.75C2.25 6.05558 6.05558 2.25 10.75 2.25C15.4444 2.25 19.25 6.05558 19.25 10.75C19.25 12.7369 18.5683 14.5645 17.426 16.0118L21.4571 20.0429C21.8476 20.4334 21.8476 21.0666 21.4571 21.4571C21.0666 21.8476 20.4334 21.8476 20.0429 21.4571L16.0118 17.426C14.5645 18.5683 12.7369 19.25 10.75 19.25C6.05558 19.25 2.25 15.4444 2.25 10.75Z"]');
  if (chatgptSearchButton) return;
  const existingSearchConversationsButton = document.querySelector('#search-conversations-button');
  if (existingSearchConversationsButton) return;
  // data-testid="close-sidebar-button"
  const closeSidebarButton = document.querySelector('button[data-testid="close-sidebar-button"]');
  if (!closeSidebarButton) return;
  // clone the close sidebar button
  const searchConversationsButton = closeSidebarButton.cloneNode(true);
  searchConversationsButton.id = 'search-conversations-button';
  searchConversationsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="currentColor" class="icon-lg-heavy max-md:hidden"><path d="M504.1 471l-134-134C399.1 301.5 415.1 256.8 415.1 208c0-114.9-93.13-208-208-208S-.0002 93.13-.0002 208S93.12 416 207.1 416c48.79 0 93.55-16.91 129-45.04l134 134C475.7 509.7 481.9 512 488 512s12.28-2.344 16.97-7.031C514.3 495.6 514.3 480.4 504.1 471zM48 208c0-88.22 71.78-160 160-160s160 71.78 160 160s-71.78 160-160 160S48 296.2 48 208z"/></svg>';
  searchConversationsButton.addEventListener('click', () => {
    selectedConversationFolderBreadcrumb = [defaultConversationFolders.find((folder) => folder.id === 'all')];
    createManager('conversations');
    setTimeout(() => {
      const searchInput = document.querySelector('input[id="conversation-manager-search-input"]');
      searchInput.focus();
    }, 100);
  });
  // show tooltip on hover right below the button. center align
  createTooltip(searchConversationsButton, translate('Search conversations'), 'transform: translate(-40%, 50%);');

  // add search conversation button after close sidebar button parent.parentElement
  closeSidebarButton.parentElement.insertAdjacentElement('afterend', searchConversationsButton);
  // add search conversation button to all date headers
  // const dateHeaders = document.querySelectorAll('nav h3');
  // dateHeaders.forEach((dateHeader) => {
  //   dateHeader.parentElement.classList.add('mb-2');
  //   dateHeader.parentElement.appendChild(searchConversationsButton.cloneNode(true));
  // });
}
// eslint-disable-next-line no-unused-vars
function addConversationMenuEventListener() {
  document.body.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    const li = button.closest('li');
    if (!li) return;
    const nav = li.closest('nav');
    if (!nav) return;
    const conversationLink = li.querySelector('a[href*="/c/"]');
    if (!conversationLink) return;

    const conversationId = conversationLink.href.split('/').pop();
    // setTimeout(() => {
    addExtraConversationMenuItems(conversationId);
    // }, 1000);
  });
}
function addExtraConversationMenuItems(conversationId) {
  const menu = document.body.querySelector('div[role="menu"]');

  if (!menu) return;
  const menuItems = menu.querySelectorAll('div[role="menuitem"]');
  if (!menuItems) return;
  const newMenuItems = [
    {
      text: 'Export',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round" width="24" height="24" class="h-4 w-4 shrink-0" height="1em" width="1em"><path d="M568.1 303l-80-80c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94L494.1 296H216C202.8 296 192 306.8 192 320s10.75 24 24 24h278.1l-39.03 39.03C450.3 387.7 448 393.8 448 400s2.344 12.28 7.031 16.97c9.375 9.375 24.56 9.375 33.94 0l80-80C578.3 327.6 578.3 312.4 568.1 303zM360 384c-13.25 0-24 10.74-24 24V448c0 8.836-7.164 16-16 16H64.02c-8.836 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1v72c0 13.25 10.74 24 23.1 24S384 245.3 384 232V138.6c0-16.98-6.742-33.26-18.75-45.26l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H63.1C28.65 0-.002 28.66 0 64l.0065 384c.002 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64v-40C384 394.7 373.3 384 360 384z"/></svg>',
      click: (args) => {
        openExportModal([args.convId], 'selected');
      },
    },
    {
      text: 'Move',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" class="h-4 w-4 shrink-0" stroke-width="2" viewBox="0 0 512 512"><path d="M448 96h-172.1L226.7 50.75C214.7 38.74 198.5 32 181.5 32H64C28.66 32 0 60.66 0 96v320c0 35.34 28.66 64 64 64h384c35.34 0 64-28.66 64-64V160C512 124.7 483.3 96 448 96zM464 416c0 8.824-7.18 16-16 16H64c-8.82 0-16-7.176-16-16V96c0-8.824 7.18-16 16-16h117.5c4.273 0 8.289 1.664 11.31 4.688L256 144h192c8.82 0 16 7.176 16 16V416zM336 264h-56V207.1C279.1 194.7 269.3 184 256 184S232 194.7 232 207.1V264H175.1C162.7 264 152 274.7 152 288c0 13.26 10.73 23.1 23.1 23.1h56v56C232 381.3 242.7 392 256 392c13.26 0 23.1-10.74 23.1-23.1V311.1h56C349.3 311.1 360 301.3 360 288S349.3 264 336 264z"/></svg>',
      click: (args) => {
        openMoveToFolderModal([args.convId]);
      },
    },
    {
      text: 'Download images',
      icon: '<svg stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="h-4 w-4 shrink-0"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.70711 10.2929C7.31658 9.90237 6.68342 9.90237 6.29289 10.2929C5.90237 10.6834 5.90237 11.3166 6.29289 11.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L17.7071 11.7071C18.0976 11.3166 18.0976 10.6834 17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929L13 13.5858L13 4C13 3.44771 12.5523 3 12 3C11.4477 3 11 3.44771 11 4L11 13.5858L7.70711 10.2929ZM5 19C4.44772 19 4 19.4477 4 20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20C20 19.4477 19.5523 19 19 19L5 19Z" fill="currentColor"></path></svg>',
      click: (args) => {
        downloadSelectedImages(args.menuButton, [], args.convId);
      },
    },
  ];
  const firstMenuItem = menuItems[0];
  const lastMenuItem = menuItems[menuItems.length - 1];
  newMenuItems.forEach((newMenuItem) => {
    // clone the first menu item
    const menuItem = firstMenuItem.cloneNode(true);
    // add new menu before the last menu item
    lastMenuItem.parentElement.insertBefore(menuItem, lastMenuItem);
    menuItem.innerHTML = `<div class="flex items-center justify-center text-token-text-secondary h-5 w-5">${newMenuItem.icon}</div>${translate(newMenuItem.text)}`;
    menuItem.addEventListener('click', () => {
      newMenuItem.click({ menuButton: menuItem, convId: conversationId });
    });
  });
}
