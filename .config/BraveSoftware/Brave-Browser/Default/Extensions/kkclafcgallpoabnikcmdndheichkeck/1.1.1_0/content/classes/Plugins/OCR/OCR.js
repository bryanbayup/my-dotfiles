class OCR{
    service;

    constructor(service){
        this.service = service;
    }

    async read(imageUrl, language){
        return await this.service.read(imageUrl, language);
    }
}