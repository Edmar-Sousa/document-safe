import { CustomException } from "@/exceptions/CustomException";


export class UserPasswordException extends CustomException {
    constructor(messages: Object = {}) {
        super(
            "User password is incorrect", 
            "USER_PASSWORD_INCORRECT", 
            400,
            messages
        );
    }
}