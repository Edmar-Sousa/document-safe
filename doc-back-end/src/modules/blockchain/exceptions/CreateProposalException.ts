import { CustomException } from "@/exceptions/CustomException";



export class CreateProposalException extends CustomException {
    constructor(messages: Object = {}) {
        super(
            'Error creating proposal', 
            'CREATE_PROPOSAL_EXCEPTION', 
            500, 
            messages
        );
    }
}
