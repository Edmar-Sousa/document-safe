import { CustomException } from "@/exceptions/CustomException";


export class DocumentNotFoundException extends CustomException {

    constructor(messages: Object = {}) {
        super(
            'Document not found', 
            'DOCUMENT_NOT_FOUND', 
            404, 
            messages
        );
    }

}
