import { CustomException } from "@/exceptions/CustomException";


export class UserNotFoundException extends CustomException {
    constructor(messages: Object = {}) {
        super(
            "User not found", 
            "USER_NOT_FOUND", 
            404,
            messages
        );
    }
}
