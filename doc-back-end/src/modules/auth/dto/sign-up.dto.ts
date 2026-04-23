
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';


export class SignUpDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    @MaxLength(20)
    password: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;
}
