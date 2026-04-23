import { CustomException } from "@/exceptions/CustomException";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";


@Catch()
export class HandlerExceptions implements ExceptionFilter {

    catch (exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        
        let status = 500;
        let id = 'INTERNAL_SERVER_ERROR';
        let message = 'Internal Server Error';
        let errors = {};

        if (exception instanceof CustomException) {
            id = exception.getId();
            status = exception.getStatusCode();
            errors = exception.getMessages();
            message = exception.getMessage();
        }
         
        else if (exception instanceof HttpException) {
            id = 'HTTP_EXCEPTION';
            status = exception.getStatus();
            message = exception.message;
            errors = {};
        }


        response.status(status).json({
            id,
            statusCode: status,
            message,
            errors,
        });
    }

}
