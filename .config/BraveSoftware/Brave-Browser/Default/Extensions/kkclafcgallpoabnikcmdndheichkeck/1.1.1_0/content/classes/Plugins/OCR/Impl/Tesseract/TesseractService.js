class TesseractService{
    read(imageUrl, language){
        return new Promise(resolve => {
            const listener = function(event){
                if(event.data.action !== 'ocr_result'){
                    return;
                }

                window.removeEventListener('message', listener);

                iframe.remove();

                resolve(event.data.result);
            };

            window.addEventListener('message', listener);

            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.left = '-5000px';
            iframe.style.top = 0;

            iframe.onload = function(){
                iframe.contentWindow.postMessage({
                    imageUrl,
                    language
                }, '*');
            };

            iframe.src = `${chrome.runtime.getURL('content/classes/Plugins/OCR/Impl/Tesseract/iframe/index.html')}`;
            document.body.appendChild(iframe);
        });
    }
}