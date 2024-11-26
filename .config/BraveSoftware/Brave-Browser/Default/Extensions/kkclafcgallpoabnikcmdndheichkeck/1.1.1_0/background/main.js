let tabId;

chrome.runtime.onMessage.addListener(async function (request, sender) {
    if(request.action === 'snip'){
        tabId = sender.tab.id;

        const x = Math.round(request.x);
        const y = Math.round(request.y);
        const width = Math.round(request.width);
        const height = Math.round(request.height);

        const imageUri = await chrome.tabs.captureVisibleTab(null, { format: 'png' });

        const response = await fetch(imageUri);
        const blob_ = await response.blob();
        const imageBitmap = await createImageBitmap(blob_);

        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(imageBitmap, x, y, width, height, 0, 0, width, height);

        const blob = await canvas.convertToBlob({ type: 'image/png' });

        const reader = new FileReader();

        reader.onload = function(event){
            chrome.tabs.sendMessage(sender.tab.id, {
                action: 'snipping_result',
                imageUrl: event.target.result
            });
        };

        reader.readAsDataURL(blob);
    }else if(request.action === 'popup'){
        const window = await chrome.windows.create({
            type: 'popup',
            // state: 'minimized',
            url: request.url,
            width: 520,
            height: 570
        });

        if(request.message){
            const listener = function({ action }, sender){
                if(action !== 'loaded' || sender.tab.id !== window.tabs[0].id){
                    return;
                }

                chrome.runtime.onMessage.removeListener(listener);

                chrome.tabs.sendMessage(sender.tab.id, request.message);
            }

            chrome.runtime.onMessage.addListener(listener);
        }
    }else if(request.action === 'close_me'){ 
        chrome.tabs.remove(sender.tab.id);
    }else if(request.action === 'send_to_main_tab'){
        tabId && chrome.tabs.sendMessage(tabId, request.message);
    }
});