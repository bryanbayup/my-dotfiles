function waitForElem(selector){
    return new Promise(resolve => {
        let inter = setInterval(function(){
            const elem = document.querySelector(selector);
            if(!elem){
                return;
            }
    
            clearInterval(inter);
    
            resolve(elem);
        }, 500);
    });
}

function wait(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForMessage(action){
    return new Promise(resolve => {
        const listener = function(request){
            if(request.action !== action){
                return;
            }
    
            chrome.runtime.onMessage.removeListener(listener);
    
            resolve(request);
        };
    
        chrome.runtime.onMessage.addListener(listener);
    });
}

if(typeof document !== 'undefined'){
    HTMLInputElement.prototype.fill = HTMLTextAreaElement.prototype.fill = function(value){
        this.value = value;
        this.dispatchEvent(
            new Event('input', { bubbles: true, cancelable: true })
        );
    }
}

function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}