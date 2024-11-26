/* global getConversation,getConversations, formatTime, getSelectedConversations, JSZip, saveAs, replaceCitations, loadingSpinner, translate, toast */
let exportAllCanceled = false;
let exportTimeout;

function fileFormatConverter(fileFormat) {
  switch (fileFormat) {
    case 'json':
      return 'json';
    case 'text':
      return 'txt';
    case 'markdown':
      return 'md';
    case 'html':
      return 'html';
    default:
      return 'txt';
  }
}

function exportSelectedConversations(exportFormat, selectedConversationIds = [], action = 'export') {
  const exportAllModalProgressBarLabel = document.querySelector('#export-all-modal-progress-bar-label');
  const exportAllModalProgressBarFill = document.querySelector('#export-all-modal-progress-bar-fill');
  const exportAllModalProgressBarFilename = document.querySelector('#export-all-modal-progress-bar-filename');
  getSelectedConversations(selectedConversationIds).then((convs) => {
    const zip = new JSZip();
    // fetch every conversation
    const fetchConversation = async (conversationId, exportMode) => {
      if (exportAllCanceled) {
        return;
      }
      await getConversation(conversationId).then((conversation) => {
        const conversationTitle = conversation.title.replace(/[^a-zA-Z0-9]/g, '_');
        let currentNode = conversation.current_node;
        const createDate = new Date(formatTime(conversation.create_time));
        //  folderName = conversation.create_time in local time in the format of YYYY-MM-DD
        const folderName = `${createDate.getFullYear()}-${createDate.getMonth() + 1}-${createDate.getDate()}`;
        // create filePrefix  from conversation.create_time in user local time in the format of HH-MM-SS
        const filePrefix = `${createDate.getHours()}-${createDate.getMinutes()}-${createDate.getSeconds()}`;
        // create zip folder with date as name if it doesn't exist
        zip.folder(folderName);
        let messages = [];
        while (currentNode) {
          const { message, parent } = conversation.mapping[currentNode];
          if (message) messages.push(message);
          currentNode = parent;
        }

        if (exportMode === 'assistant') {
          messages = messages.filter((m) => m.role === 'assistant' || m.author?.role === 'assistant');
        }
        // download as .txt file
        if (exportFormat === 'text') {
          const conversationText = messages.reverse().filter((m) => {
            const role = m?.author?.role || m?.role;
            const recipient = m?.recipient;
            const contentType = m?.content?.content_type;
            return role === 'user' || (recipient === 'all' && role === 'assistant' && contentType === 'text');
          }).map((m) => `${exportMode === 'both' ? `>> ${m.role ? m.role.toUpperCase() : m.author?.role.toUpperCase()}: ` : ''}${replaceCitations((m.content?.parts || [])?.filter((p) => typeof p === 'string')?.join('\n').replace(/^## Instructions[\s\S]*?## End Instructions\n\n/m, ''), m.metadata.citations, 'text')}`)?.join('\n\n');
          zip.file(`${folderName}/${filePrefix}-${conversationTitle}.${fileFormatConverter(exportFormat)}`, conversationText);
          if (action === 'copy') {
            copyToClipboard(conversationText, 'text');
          }
        }
        // download as .json file
        if (exportFormat === 'json') {
          const conversationJson = conversation;
          zip.file(`${folderName}/${filePrefix}-${conversationTitle}.${fileFormatConverter(exportFormat)}`, JSON.stringify(conversationJson));
          if (action === 'copy') {
            copyToClipboard(JSON.stringify(conversationJson), 'JSON');
          }
        }
        // download as .md file
        if (exportFormat === 'markdown') {
          const conversationMarkdown = messages.reverse().filter((m) => {
            const role = m?.author?.role || m?.role;
            const recipient = m?.recipient;
            const contentType = m?.content?.content_type;
            return role === 'user' || (recipient === 'all' && role === 'assistant' && contentType === 'text');
          }).map((m) => `${exportMode === 'both' ? `## ${m.role ? m.role.toUpperCase() : m.author?.role.toUpperCase()}\n` : ''}${replaceCitations((m.content?.parts || [])?.filter((p) => typeof p === 'string')?.join('\n').replace(/^## Instructions[\s\S]*?## End Instructions\n\n/m, ''), m.metadata.citations, 'markdown')}`)?.join('\n\n');
          // replace citations
          zip.file(`${folderName}/${filePrefix}-${conversationTitle}.${fileFormatConverter(exportFormat)}`, conversationMarkdown);
          if (action === 'copy') {
            copyToClipboard(conversationMarkdown, 'Markdown');
          }
        }

        // update exportAllModalProgressBar.style
        const fileCount = Object.values(zip.files).filter((f) => !f.dir).length;
        const percentage = Math.round((fileCount / convs.length) * 100);
        exportAllModalProgressBarLabel.textContent = `${fileCount} / ${convs.length}`;
        exportAllModalProgressBarFill.style.width = `${percentage}%`;
        exportAllModalProgressBarFilename.textContent = `${conversationTitle}.${fileFormatConverter(exportFormat)}`;
      })
        .catch((_err) => { });
    };

    const fetchAllConversationsAsync = async (conversations, exportMode) => {
      for (let i = 0; i < conversations.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await fetchConversation(conversations[i].conversation_id, exportMode, i);
      }
    };
    chrome.storage.local.get('settings', ({ settings }) => {
      const { exportMode } = settings;
      fetchAllConversationsAsync(convs, exportMode).then(() => {
        if (exportAllCanceled) {
          exportAllCanceled = false;
          return;
        }
        clearTimeout(exportTimeout);
        if (action === 'export') {
          zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }).then((content) => {
            saveAs(content, `${new Date().toISOString().slice(0, 10)}-conversations.zip`);
            const exportAllModal = document.querySelector('#export-all-modal');
            setTimeout(() => {
              exportAllModal.remove();
            }, 500);
          });
        } else {
          const copyButton = document.querySelector('#export-all-modal-copy-button');
          copyButton.disabled = false;
          const formatRadioButtons = document.querySelectorAll('input[name="export-all-modal-radio-button"]');
          formatRadioButtons.forEach((radioButton) => {
            radioButton.disabled = false;
          });
        }
      });
    });
  }, () => { });
}
function copyToClipboard(text, format = 'text') {
  navigator.clipboard.writeText(text).then(() => {
    // eslint-disable-next-line no-alert
    toast(`Conversation ${format} copied to clipboard`);
  }, () => {
    // eslint-disable-next-line no-alert
    toast('Failed to copy conversation to clipboard');
  });
}
// eslint-disable-next-line no-unused-vars
function openExportModal(selectedConversationIds = [], exportType = 'all') { // all, folder, selected, dateRange
  clearTimeout(exportTimeout);
  exportAllCanceled = false;
  const exportAllModal = document.createElement('div');
  exportAllModal.style = 'position:fixed;top:0px;left:0px;width:100%;height:100%;z-index:100001;display:flex;align-items:center;justify-content:center;';
  exportAllModal.classList = 'bg-black/50 dark:bg-black/80 text-token-text-primary';
  exportAllModal.id = 'export-all-modal';
  exportAllModal.addEventListener('click', (e) => {
    // export-all-modal-progress-bar-fill
    const exportAllModalProgressBarFill = document.querySelector('#export-all-modal-progress-bar-fill');
    if (e.target.id === 'export-all-modal' && (exportAllModalProgressBarFill.style.width === '0%' || exportAllModalProgressBarFill.style.width === '100%')) {
      exportAllModal.remove();
    }
  });
  const exportAllModalContent = document.createElement('div');
  exportAllModalContent.style = 'width:400px;min-height:300px;';
  exportAllModalContent.classList = 'bg-token-main-surface-primary rounded-md flex flex-col items-start justify-start border border-token-border-light relative p-4 shadow-md';

  exportAllModal.appendChild(exportAllModalContent);
  const exportAllModalTitle = document.createElement('div');
  exportAllModalTitle.style = 'display:flex; align-items:center;font-size:1.25rem;font-weight:500;';

  const title = {
    all: 'Export All Conversations',
    folder: 'Export Folder Conversations',
    selected: 'Export Selected Conversations',
    dateRange: 'Export Conversation in Date Range',
  };
  exportAllModalTitle.innerHTML = `${translate(title[exportType])} <a href="https://youtu.be/r2G5ffdfrd0?si=g8PSUu1oPgfBy4fp" target="_blank" rel="noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="icon-md pl-0.5 text-token-text-tertiary h-5 w-5 ml-2"><path fill="currentColor" d="M13 12a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0zM12 9.5A1.25 1.25 0 1 0 12 7a1.25 1.25 0 0 0 0 2.5"></path><path fill="currentColor" fill-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0" clip-rule="evenodd"></path></svg></a>`;

  exportAllModalContent.appendChild(exportAllModalTitle);
  // const exportAllModalDescription = document.createElement('div');
  // exportAllModalDescription.style = 'font-size:0.875rem;color:#565869;';
  // exportAllModalDescription.textContent = 'This can take a few seconds.';
  // exportAllModalContent.appendChild(exportAllModalDescription);

  // 3 radio buttons in a row for export format: input/label, input/label, input/label
  const exportAllModalFormatTitle = document.createElement('div');
  exportAllModalFormatTitle.style = 'font-size:0.875rem;font-weight:500;margin-top:32px;';
  exportAllModalFormatTitle.textContent = translate('In what format do you want to export?');
  exportAllModalContent.appendChild(exportAllModalFormatTitle);
  const exportAllModalRadioButtonsWrapper = document.createElement('div');
  exportAllModalRadioButtonsWrapper.style = 'display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:8px;';
  exportAllModalContent.appendChild(exportAllModalRadioButtonsWrapper);
  const exportAllModalRadioButtons = [
    {
      id: 'export-all-modal-radio-button-markdown',
      name: 'export-all-modal-radio-button',
      value: 'markdown',
      label: 'Markdown',
    },
    {
      id: 'export-all-modal-radio-button-json',
      name: 'export-all-modal-radio-button',
      value: 'json',
      label: 'Json',
    },
    {
      id: 'export-all-modal-radio-button-text',
      name: 'export-all-modal-radio-button',
      value: 'text',
      label: 'Text',
    },
  ];
  let exportFormat = 'markdown';
  // onchange event listener for radio buttons
  const exportAllModalRadioButtonsOnChange = (e) => {
    const { value } = e.target;
    exportFormat = value;
  };
  exportAllModalRadioButtons.forEach((radioButton) => {
    const exportAllModalRadioButtonWrapper = document.createElement('div');
    exportAllModalRadioButtonWrapper.style = 'display:flex;align-items:center;justify-content:center;';
    exportAllModalRadioButtonsWrapper.appendChild(exportAllModalRadioButtonWrapper);
    const exportAllModalRadioButton = document.createElement('input');
    exportAllModalRadioButton.type = 'radio';
    exportAllModalRadioButton.id = radioButton.id;
    exportAllModalRadioButton.name = radioButton.name;
    exportAllModalRadioButton.value = radioButton.value;
    exportAllModalRadioButton.checked = radioButton.value === 'markdown';
    exportAllModalRadioButton.addEventListener('change', exportAllModalRadioButtonsOnChange);
    exportAllModalRadioButtonWrapper.appendChild(exportAllModalRadioButton);
    const exportAllModalRadioButtonLabel = document.createElement('label');
    exportAllModalRadioButtonLabel.htmlFor = radioButton.id;
    exportAllModalRadioButtonLabel.style = 'font-size:0.875rem;margin-left:8px;';
    exportAllModalRadioButtonLabel.textContent = radioButton.label;

    exportAllModalRadioButtonWrapper.appendChild(exportAllModalRadioButtonLabel);
  });

  // progress bar label
  const exportAllModalProgressBarLabel = document.createElement('div');
  exportAllModalProgressBarLabel.id = 'export-all-modal-progress-bar-label';
  exportAllModalProgressBarLabel.style = 'font-size:0.875rem;margin:32px auto 8px;';
  exportAllModalProgressBarLabel.textContent = `0 / ${selectedConversationIds?.length || '--'} `;

  exportAllModalContent.appendChild(exportAllModalProgressBarLabel);
  // progress bar
  const exportAllModalProgressBar = document.createElement('div');
  exportAllModalProgressBar.id = 'export-all-modal-progress-bar';
  exportAllModalProgressBar.style = 'min-height:12px;';
  exportAllModalProgressBar.classList = 'bg-token-main-surface-tertiary relative w-full h-3 rounded-md overflow-hidden';
  exportAllModalContent.appendChild(exportAllModalProgressBar);

  const exportAllModalProgressBarFill = document.createElement('div');
  exportAllModalProgressBarFill.id = 'export-all-modal-progress-bar-fill';
  exportAllModalProgressBarFill.style = 'position:absolute;top:0px;left:0px;width:0%;height:12px;min-height:12px;background-color:gold;border-radius:4px;';
  exportAllModalProgressBar.appendChild(exportAllModalProgressBarFill);
  // progress bar filename
  const exportAllModalProgressBarFilename = document.createElement('div');
  exportAllModalProgressBarFilename.id = 'export-all-modal-progress-bar-filename';
  exportAllModalProgressBarFilename.style = 'font-size:0.875rem;margin:8px auto 32px;';
  exportAllModalProgressBarFilename.classList = 'truncate w-full text-token-text-secondary';
  exportAllModalProgressBarFilename.textContent = ' ';
  exportAllModalContent.appendChild(exportAllModalProgressBarFilename);

  // modal action wrapper
  const exportAllModalActionWrapper = document.createElement('div');
  exportAllModalActionWrapper.classList = 'mt-auto w-full flex items-center justify-end gap-2';
  exportAllModalContent.appendChild(exportAllModalActionWrapper);

  // cancel button
  const exportAllModalCancelButton = document.createElement('button');
  exportAllModalCancelButton.classList = 'btn relative btn-secondary';
  exportAllModalCancelButton.textContent = translate('Cancel');
  exportAllModalCancelButton.addEventListener('click', () => {
    exportAllCanceled = true;
    // Get a reference to the last interval + 1
    const intervalId = setInterval(() => { }, Number.MAX_SAFE_INTEGER);
    // Clear any timeout/interval up to that id
    for (let i = 1; i < intervalId; i += 1) {
      clearInterval(i);
    }
    clearTimeout(exportTimeout);

    exportAllModal.remove();
  });
  exportAllModalActionWrapper.appendChild(exportAllModalCancelButton);
  // copy button
  if (selectedConversationIds.length === 1) {
    const exportAllModalCopyButton = document.createElement('button');
    exportAllModalCopyButton.id = 'export-all-modal-copy-button';
    exportAllModalCopyButton.classList = 'btn relative btn-primary';
    exportAllModalCopyButton.style.opacity = selectedConversationIds?.length === 0 ? '0.5' : '1';
    exportAllModalCopyButton.textContent = translate('Copy to clipboard');
    exportAllModalCopyButton.disabled = selectedConversationIds?.length === 0;
    exportAllModalCopyButton.addEventListener('click', () => {
      exportAllCanceled = false;
      exportAllModalCopyButton.disabled = true;
      const formatRadioButtons = document.querySelectorAll('input[name="export-all-modal-radio-button"]');
      formatRadioButtons.forEach((radioButton) => {
        radioButton.disabled = true;
      });
      exportSelectedConversations(exportFormat, selectedConversationIds, 'copy');
    });
    exportAllModalActionWrapper.appendChild(exportAllModalCopyButton);
  }
  // export button
  const exportAllModalExportButton = document.createElement('button');
  exportAllModalExportButton.id = 'export-all-modal-export-button';
  exportAllModalExportButton.classList = 'btn relative btn-primary';
  exportAllModalExportButton.style.opacity = selectedConversationIds?.length === 0 ? '0.5' : '1';
  exportAllModalExportButton.textContent = translate('Export');
  exportAllModalExportButton.disabled = selectedConversationIds?.length === 0;
  exportAllModalExportButton.addEventListener('click', () => {
    exportAllCanceled = false;
    exportAllModalExportButton.disabled = true;
    exportAllModalExportButton.innerText = `${translate('Exporting')}...`;
    exportAllModalExportButton.appendChild(loadingSpinner('export-all-modal-export-button'));
    const formatRadioButtons = document.querySelectorAll('input[name="export-all-modal-radio-button"]');
    formatRadioButtons.forEach((radioButton) => {
      radioButton.disabled = true;
    });
    exportSelectedConversations(exportFormat, selectedConversationIds, 'export');
  });
  exportAllModalActionWrapper.appendChild(exportAllModalExportButton);

  if (selectedConversationIds?.length === 0) {
    getConversations(0, 1).then((conversations) => {
      const { total } = conversations;
      chrome.storage.local.set({ totalConversations: total });
      exportAllModalProgressBarLabel.textContent = `0 / ${total} `;
      exportAllModalExportButton.disabled = total === 0;
      exportAllModalExportButton.style.opacity = total === 0 ? '0.5' : '1';
    }, () => {
      exportAllModalProgressBarLabel.textContent = 'You don\'t have any conversations.';
    });
  }

  document.body.appendChild(exportAllModal);
}
