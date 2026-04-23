import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";


import { AuthProvider } from "./auth.provider";

import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";


@Controller('auth')
export class AuthController {

    constructor(private readonly authProvider: AuthProvider) {}


    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(@Body() signInDto: SignInDto) {
        return this.authProvider.signIn(signInDto);
    }

    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto) {
        return this.authProvider.signUp(signUpDto);
    }

}
