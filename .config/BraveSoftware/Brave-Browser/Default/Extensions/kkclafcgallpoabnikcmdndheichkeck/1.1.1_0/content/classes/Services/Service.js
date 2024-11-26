class Service{
    ocr;

    constructor(ocr){
        this.ocr = ocr;
    }

    async index(){
        const snippingTool = new SnippingTool();

        snippingTool.register();

        snippingTool.onSnip(async (imageUrl, language) => {
            chrome.runtime.sendMessage({
                action: 'popup',
                url: `https://chat.openai.com/?model=gpt-4&auto=1`,
                scripts: ['functions.js', 'chatGPT.js'],
                message: {
                    action: 'chatgpt_data',
                    image: imageUrl
                }
            });

            const request = await waitForMessage('chatgpt_result');

            if(!request.error){
                /* Dialog.show('Result', request.result, [
                    {
                        text: 'Copy',
                        onClick: () => {
                            navigator.clipboard.writeText(request.result)
                        }
                    }
                ]); */

                return;
            }

            const text = await this.ocr.read(imageUrl, language);

            chrome.runtime.sendMessage({
                action: 'popup',
                url: `https://chat.openai.com/?model=gpt-4&auto=1`,
                scripts: ['functions.js', 'chatGPT.js'],
                message: {
                    action: 'chatgpt_data',
                    text
                }
            });

            const finalRequest = await waitForMessage('chatgpt_result');

            /* Dialog.show('Result', finalRequest.result, [
                {
                    text: 'Copy',
                    onClick: () => {
                        navigator.clipboard.writeText(finalRequest.result)
                    }
                }
            ]); */
        });
    }
}