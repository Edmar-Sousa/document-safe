import md5 from "md5";

import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";

import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";

import { UserNotFoundException } from "./exceptions/UserNotFoundException";
import { UserPasswordException } from "./exceptions/UserPasswordException";
import { CreateUserException } from "./exceptions/CreateUserException";

import { UserEntity } from "@/entities/user.entity";

@Injectable()
export class AuthProvider {

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
    ) {}


    async signUp(signUpDto: SignUpDto) {
        try {
            const user = this.userRepository.create({
                name: signUpDto.name,
                email: signUpDto.email,
                password: md5(signUpDto.password),
            });

            return await this.userRepository.save(user);
        }
        catch (error) {
            throw new CreateUserException({
                message: 'Erro ao criar usuário no banco de dados',
            });
        }

    }

    async signIn(signInDto: SignInDto) {
        const user = await this.userRepository.findOne({
            where: {
                email: signInDto.email
            },
        });

        if (!user) {
            throw new UserNotFoundException({
                email: 'Usuario com o email informado não encontrado',
            });
        }

        if (user.password !== md5(signInDto.password)) {
            throw new UserPasswordException({
                password: 'Senha informada é inválida',
            });
        }

        const payload = {
            email: user.email,
            sub: user.id,
        }

        return {
            message: 'Login realizado com sucesso',
            data: {
                accessToken: this.jwtService.sign(payload),
            }
        };
    }
}
