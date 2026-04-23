

export class CustomException extends Error {
    private id: string;
    private statusCode: number;
    private messages: Object;

    constructor(message: string, id: string, statusCode: number, messages: Object = {}) {
        super(message);
        this.id = id;
        this.statusCode = statusCode;
        this.messages = messages;
    }

    getId(): string {
        return this.id;
    }
    
    getStatusCode(): number {
        return this.statusCode;
    }

    getMessages(): Object {
        return this.messages;
    }

    getMessage(): string {  
        return this.message;
    }
}
