/* global */
const originalFetch = window.fetch;

// eslint-disable-next-line func-names
window.fetch = async function (...args) {
  const input = args[0];
  let url;

  if (input instanceof Request) {
    url = input.url;
  } else if (input instanceof URL) {
    url = input.href;
  } else {
    url = input;
  }

  let bodyObj = {};
  if (args.length > 1 && args[1]?.body) {
    try {
      bodyObj = JSON.parse(args[1]?.body);
    } catch (e) {
      // do nothing
    }
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);

  // before making the request
  if (url.endsWith('backend-api/conversation') && args[1]?.method === 'POST') {
    if (bodyObj.messages) {
      const selectedModel = window.localStorage.getItem('sp/selectedModel');
      if (selectedModel) {
        bodyObj = {
          ...bodyObj,
          model: selectedModel,
        };
      }
      const temporaryChat = window.localStorage.getItem('sp/temporaryChat') === 'true';
      if (temporaryChat) {
        bodyObj = {
          ...bodyObj,
          history_and_training_disabled: true,
        };
      }
      const lastInstruction = window.localStorage.getItem('sp/lastInstruction');
      if (lastInstruction && lastInstruction !== 'null') {
        // prepend instructions to the first message
        // instructionsCache: {message.id: instructions, message.id: instructions}
        const instructionsCache = JSON.parse(window.localStorage.getItem('sp/instructionsCache') || '{}');
        const firstMessageId = bodyObj.messages[0].id;
        instructionsCache[firstMessageId] = lastInstruction;
        window.localStorage.setItem('sp/instructionsCache', JSON.stringify(instructionsCache));
        window.localStorage.setItem('sp/lastInstruction', null);
        const userMessage = bodyObj.messages.find((message) => message.author.role === 'user' && message.content.content_type === 'text');
        bodyObj.messages.find((message) => message.author.role === 'user' && message.content.content_type === 'text').content.parts[0] = `${lastInstruction}${userMessage?.content?.parts[0] || ''}`;
      }
      args[1].body = JSON.stringify(bodyObj);
      const conversationSubmittedEvent = new CustomEvent('conversationSubmitted', {
        detail: {
          messages: bodyObj.messages,
          instructions: lastInstruction,
        },
      });
      window.dispatchEvent(conversationSubmittedEvent);
    }
  }

  // make the request
  const response = await originalFetch(...args);

  // after making the request
  // if (response && url.includes('backend-api/prompt_library')) {
  //   // do nothing
  //   if (window.localStorage.getItem('sp/autoSync' || 'true') === 'true') {
  //     // wait 10 seconds. this is to prevent the double "Hi, how can I help?" issue
  //     // eslint-disable-next-line no-promise-executor-return
  //     await new Promise((resolve) => setTimeout(resolve, 10000));
  //     return '';
  //   }
  // }
  if (response && url.endsWith('backend-api/me')) {
    let accessToken;
    if (args.length > 1 && args[1]?.headers) {
      accessToken = args[1].headers.Authorization;
    }

    const responseData = await response.clone().json();

    if (accessToken && responseData?.id && !responseData?.id?.startsWith('ua-')) {
      const authReceivedEvent = new CustomEvent('authReceived', {
        detail: { ...responseData, accessToken },
      });
      window.dispatchEvent(authReceivedEvent);
    }
  }

  if (response && url.endsWith('api/auth/signout')) {
    const responseData = await response.clone().json();
    if (responseData?.success) {
      const signoutReceivedEvent = new CustomEvent('signoutReceived', {
        detail: responseData,
      });
      window.dispatchEvent(signoutReceivedEvent);
    }
  }
  // https://chatgpt.com/backend-api/stop_conversation
  if (response && url.endsWith('backend-api/stop_conversation') && args[1]?.method === 'POST') {
    const responseData = await response.clone().json();
    const stopConversationReceivedEvent = new CustomEvent('stopConversationReceived', {
      detail: responseData,
    });
    window.dispatchEvent(stopConversationReceivedEvent);
  }

  if (response && url.includes('backend-api/sentinel/chat-requirements')) {
    window.localStorage.setItem('sp/chatRequirementsPayload', bodyObj.p);
    const responseData = await response.clone().json();

    if (responseData.proofofwork) {
      const chatRequirementsReceivedEvent = new CustomEvent('chatRequirementsReceived', {
        detail: responseData,
      });
      window.dispatchEvent(chatRequirementsReceivedEvent);
    }
  }

  // if (response && url.includes('discovery_anon')) {
  //   return '';
  // }
  if (response && url.includes('backend-api/gizmos/g-')) {
    const responseData = await response.clone().json();
    if (responseData?.detail?.toLowerCase().includes('not found')) {
      const gizmoNotFoundEvent = new CustomEvent('gizmoNotFound', {
        detail: url,
      });
      window.dispatchEvent(gizmoNotFoundEvent);
    }
  }

  if (response && url.includes('backend-api/accounts/check')) {
    // get authorization header from request
    let accessToken;
    if (args.length > 1 && args[1]?.headers) {
      accessToken = args[1].headers.Authorization;
    }
    const responseData = await response.clone().json();
    if (accessToken && responseData.accounts) {
      const accountReceivedEvent = new CustomEvent('accountReceived', {
        detail: {
          responseData,
          accessToken,
        },
      });
      window.dispatchEvent(accountReceivedEvent);
    }
  }

  // old version: https://chatgpt.com/backend-api/files/file-fEqeMhveAvWu1DTbZlJZuXLt/download
  if (response && url.includes('backend-api/files/file-') && url.endsWith('/download') && args[1]?.method === 'GET') {
    const fileId = url.split('/files/')[1].split('/download')[0];
    const responseData = await response.clone().json();
    if (responseData) {
      const fileReceivedEvent = new CustomEvent('fileReceived', {
        detail: {
          data: responseData,
          fileId,
        },
      });
      window.dispatchEvent(fileReceivedEvent);
    }
  }
  // new version: https://chatgpt.com/backend-api/files/download/file-fEqeMhveAvWu1DTbZlJZuXLt
  if (response && url.includes('backend-api/files/download/file-') && args[1]?.method === 'GET') {
    const fileId = url.split('/files/download/')[1];
    const responseData = await response.clone().json();
    if (responseData) {
      const fileReceivedEvent = new CustomEvent('fileReceived', {
        detail: {
          data: responseData,
          fileId,
        },
      });
      window.dispatchEvent(fileReceivedEvent);
    }
  }
  // https://chatgpt.com/backend-api/conversation/67007253-0c2c-800c-a6ac-e3ed7a76f1e9/textdocs
  if (response && url.includes('backend-api/conversation/') && url.endsWith('/textdocs') && args[1]?.method === 'GET') {
    const conversationId = url.split('/conversation/')[1].split('/textdocs')[0];
    const responseData = await response.clone().json();
    if (responseData) {
      const textdocsReceivedEvent = new CustomEvent('textdocsReceived', {
        detail: {
          textdocs: responseData,
          conversationId,
        },
      });
      window.dispatchEvent(textdocsReceivedEvent);
    }
  }
  if (response && url.includes('backend-api/settings/user')) {
    const responseData = await response.clone().json();
    if (responseData) {
      const userSettingsReceivedEvent = new CustomEvent('userSettingsReceived', {
        detail: responseData,
      });
      window.dispatchEvent(userSettingsReceivedEvent);
    }
  }

  // not including is_archived or is_archived=false
  if (response && url.includes('backend-api/conversations?') && parseInt(queryParams.get('limit'), 10) === 28 && parseInt(queryParams.get('offset'), 10) % 28 === 0 && (queryParams.get('is_archived') === 'false' || queryParams.get('is_archived') === null)) {
    const responseData = await response.clone().json();
    const historyLoadedReceivedEvent = new CustomEvent('historyLoadedReceived', {
      detail: responseData,
    });
    const delayMultiple = Math.floor(parseInt(queryParams.get('offset'), 10) / 28);

    setTimeout(() => {
      window.dispatchEvent(historyLoadedReceivedEvent);
    }, 1000 * delayMultiple);
  }

  // graphql support
  if (response && url.includes('graphql?')) {
    const variables = JSON.parse(queryParams.get('variables'));
    if (variables.first === 28 && variables.after === 'aWR4Oi0x' && variables?.isArchived === false) {
      const responseData = await response.clone().json();
      const historyLoadedReceivedEvent = new CustomEvent('historyLoadedReceived', {
        detail: responseData,
      });

      window.dispatchEvent(historyLoadedReceivedEvent);
    }
  }

  if (response && url.includes('backend-api/conversations') && bodyObj.is_archived === true && args[1]?.method === 'PATCH') {
    const responseData = await response.clone().json();
    const archivedAllReceivedEvent = new CustomEvent('archivedAllReceived', {
      detail: responseData,
    });
    window.dispatchEvent(archivedAllReceivedEvent);
  }
  if (response && url.includes('backend-api/conversations') && bodyObj.is_visible === false && args[1]?.method === 'PATCH') {
    const responseData = await response.clone().json();
    const deleteAllReceivedEvent = new CustomEvent('deleteAllReceived', {
      detail: responseData,
    });
    window.dispatchEvent(deleteAllReceivedEvent);
  }

  if (response && url.includes('backend-api/conversation/') && bodyObj.is_archived === false && args[1]?.method === 'PATCH') {
    // const responseData = await response.clone().json();
    const conversationId = url.split('/').pop();
    const conversationUnarchivedReceivedEvent = new CustomEvent('conversationUnarchivedReceived', {
      detail: { conversationId },
    });
    window.dispatchEvent(conversationUnarchivedReceivedEvent);
  }

  if (response && url.includes('backend-api/conversation/') && bodyObj.is_archived === true && args[1]?.method === 'PATCH') {
    // const responseData = await response.clone().json();
    const conversationId = url.split('/').pop();
    const conversationUnarchivedReceivedEvent = new CustomEvent('conversationArchivedReceived', {
      detail: { conversationId },
    });
    window.dispatchEvent(conversationUnarchivedReceivedEvent);
  }

  if (response && url.includes('backend-api/conversation/') && bodyObj.is_visible === false && args[1]?.method === 'PATCH') {
    // const responseData = await response.clone().json();
    const conversationId = url.split('/').pop();
    const conversationDeleteReceivedEvent = new CustomEvent('conversationDeleteReceived', {
      detail: { conversationId },
    });
    window.dispatchEvent(conversationDeleteReceivedEvent);
  }

  if (response && url.includes('backend-api/conversation/') && Object.keys(bodyObj).includes('title') && args[1]?.method === 'PATCH') {
    // const responseData = await response.clone().json();
    const conversationId = url.split('/').pop();
    const conversationRenameReceivedEvent = new CustomEvent('conversationRenameReceived', {
      detail: {
        conversationId,
        title: bodyObj.title,
      },
    });
    window.dispatchEvent(conversationRenameReceivedEvent);
  }

  if (response && url.includes('backend-api/conversation/') && args[1]?.method === 'GET') {
    const convId = url.split('/').pop();
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(convId)) {
      const responseData = await response.clone().json();
      const conversationId = responseData.conversation_id || responseData.id;
      if (conversationId) {
        const conversationReceivedEvent = new CustomEvent('conversationReceived', {
          detail: { conversation: { ...responseData, conversation_id: conversationId } },
        });
        window.dispatchEvent(conversationReceivedEvent);
      }
    }
  }

  // if (response && url.includes('backend-api/conversation') && args[1]?.method === 'POST') {
  //   const convId = url.split('/').pop();
  //   const responseData = await response.clone();
  //   const reader = responseData.body.getReader();
  //   const decoder = new TextDecoder('utf-8');
  //   let result = '';

  //   // Read each chunk from the stream
  //   reader.read().then(function processStream({ done, value }) {
  //     if (done) {
  //       console.warn('Stream complete');
  //       return;
  //     }

  //     // Decode and append chunk to result
  //     result += decoder.decode(value, { stream: true });
  //     console.warn('Received chunk:', result); // Logs the current chunk content

  //     // Continue reading the stream
  //     return reader.read().then(processStream);
  //   });

  //   // const conversationId = responseData.conversation_id || responseData.id;
  //   // if (conversationId) {
  //   //   const conversationReceivedEvent = new CustomEvent('conversationReceived', {
  //   //     detail: { conversation: { ...responseData, conversation_id: conversationId } },
  //   //   });
  //   //   window.dispatchEvent(conversationReceivedEvent);
  //   // }
  // }

  if (response && url.includes('public-api/conversation_limit')) {
    const responseData = await response.clone().json();
    if (responseData.message_cap) {
      const conversationLimitReceivedEvent = new CustomEvent('conversationLimitReceived', {
        detail: responseData,
      });
      window.dispatchEvent(conversationLimitReceivedEvent);
    }
  }
  // if (response && url.includes('backend-api/gizmos/bootstrap')) {
  //   const responseData = await response.clone().json();
  //   const gizmosBootstrapReceivedEvent = new CustomEvent('gizmosBootstrapReceived', {
  //     detail: responseData,
  //   });
  //   window.dispatchEvent(gizmosBootstrapReceivedEvent);
  //   return '';
  // }
  // if (response && url.includes('backend-api/gizmos/discovery')) {
  //   const responseData = await response.clone().json();
  //   const gizmoDiscoveryReceivedEvent = new CustomEvent('gizmoDiscoveryReceived', {
  //     detail: responseData,
  //   });
  //   window.dispatchEvent(gizmoDiscoveryReceivedEvent);
  // }
  if (response && url.includes('backend-api/models')) {
    const responseData = await response.clone().json();
    if (responseData.models) {
      const modelsReceivedEvent = new CustomEvent('modelsReceived', {
        detail: responseData,
      });
      window.dispatchEvent(modelsReceivedEvent);
    }
  }

  // https://ab.chatgpt.com/v1/rgstr
  if (response && url.includes('ab.chatgpt.com/v1/rgstr')) {
    const responseData = await response.clone().json();
    if (responseData?.success) {
      const rgstrEvent = new CustomEvent('rgstrEventReceived', {
        detail: {
          payload: bodyObj,
        },
      });
      window.dispatchEvent(rgstrEvent);
    }
  }

  return response;
};
