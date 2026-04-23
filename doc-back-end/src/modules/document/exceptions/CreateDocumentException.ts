import { CustomException } from "@/exceptions/CustomException";


export class CreateDocumentException extends CustomException {

    constructor(messages: Object = {}) {
        super(
            'Error creating document', 
            'CREATE_DOCUMENT_EXCEPTION', 
            500, 
            messages
        );
    }

}
