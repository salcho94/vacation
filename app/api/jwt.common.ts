import {cookies} from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';


export async function verify(token: string, secret: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload;
}

export async function authenticate(req: Request) {
    // code (1/성공)  (2/만료) (3/실패)
    let result = {msg:"",code:""};
    let token = cookies().get("token"); //cookie의 토큰을 가져온다.
    let decoded ;
    if(token){
        try{
            decoded = await verify(token.value, process.env.SECRET_KEY as string);
        }catch (err){
            console.log("토큰 발급 실패",err);
            result.msg = "토큰이 만료되었습니다. 다시 로그인 해주세요";
            result.code = "2";
        }
    }
    if(decoded){
        result.msg = "성공";
        result.code = "1";
    }else if(!decoded  && result.code != "2"){
        result.msg = "로그인 후 이용해 주세요";
        result.code = "3";
    }

    return  {decoded:decoded,code:result.code};
}

