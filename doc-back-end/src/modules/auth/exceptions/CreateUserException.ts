import { CustomException } from "@/exceptions/CustomException";

export class CreateUserException extends CustomException {
    constructor(message: Object = {}) {
        super('Error creating user', 'CREATE_USER_EXCEPTION', 500, message);
    }
}
