const service = new Service(
    new OCR(
        new TesseractService()
    )
);

service.index();