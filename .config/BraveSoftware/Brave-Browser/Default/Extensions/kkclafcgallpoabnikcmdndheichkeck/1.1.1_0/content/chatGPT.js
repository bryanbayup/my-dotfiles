(async function () {
    chrome.runtime.sendMessage({
        action: 'loaded'
    });

    const data = await waitForMessage('chatgpt_data');

    const promptElem = await waitForElem('#prompt-textarea');

    await wait(1000);

    if(data.image){
        if(!promptElem.nextElementSibling.querySelector('input')){
            chrome.runtime.sendMessage(
                {
                    action: 'send_to_main_tab',
                    message: {
                        action: 'chatgpt_result',
                        error: true
                    }
                },
                () => {
                    chrome.runtime.sendMessage({
                        action: 'close_me'
                    });
                }
            );

            return;
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(dataURLtoFile(data.image, 'image.png'));
        promptElem.nextElementSibling.querySelector('input').files = dataTransfer.files;
        promptElem.nextElementSibling.querySelector('input').dispatchEvent(new Event('change', { bubbles: true }));
    }else{
        promptElem.fill(data.text);
    }

    const sendButton = await waitForElem('#prompt-textarea ~ button:not([disabled])');

    await wait(1000);

    sendButton.click();

    const answerElem = await waitForElem('.markdown');

    await new Promise(resolve => {
        let inter = setInterval(function () {
            if (answerElem.parentElement.parentElement.nextSibling.firstChild.classList.contains('invisible')) {
                return;
            }

            clearInterval(inter);

            resolve();
        }, 500);
    });

    chrome.runtime.sendMessage(
        {
            action: 'send_to_main_tab',
            message: {
                action: 'chatgpt_result',
                result: answerElem.innerText
            }
        },
        () => {
            /* chrome.runtime.sendMessage({
                action: 'close_me'
            }); */
        }
    );
})();