import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt"
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import * as config from 'config'


@Injectable() // 다른 곳에서도 사용할 수 있게 하기 위해서 인젝터블 데코레이션을 사용함.
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepositoty: UserRepository
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload) {
        const {username} = payload;
        const user: User = await this.userRepositoty.findOne({ username });

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}