window.addEventListener('message', async function(event){
    const { imageUrl, language } = event.data;

    const worker = await Tesseract.createWorker(language, 1, {
        workerPath: '../lib/worker.min.js',
        // langPath: '../lib/langs',
        corePath: '../lib/core'
    });
    const { data } = await worker.recognize(imageUrl);

    await worker.terminate();

    top.postMessage({
        action: 'ocr_result',
        result: data.text
    }, '*');
});