import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {    
    // 유효성 조건을 줄 수 있다.
    @IsString() // IsString 무조건 스트링으로 와야한다.
    @MinLength(4) // MinLength(4) 최소 4개 이상으로만,
    @MaxLength(20) // MaxLength(20) 최대 20개 이하로만,
    username: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number'
    }) // 영어랑 숫자만 가능한 유효성 체크
    password: string;
}