import {cookies} from "next/headers";
import jwt from "jsonwebtoken";
import mariadb from "mariadb";
export const dbconfig= mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

export  function authenticate(req: Request) {
    // code (1/성공)  (2/만료) (3/실패)
    let result = {msg:"",code:"",data:""};
    let token = cookies().get("token"); //cookie의 토큰을 가져온다.
    let decoded = "";

    if(token){
        try{
            decoded = jwt.verify(token.value, process.env.SECRET_KEY);
        }catch (err){
            result.msg = "토큰이 만료되었습니다. 다시 로그인 해주세요";
            result.code = "2";
        }
    }
    if(decoded){
        result.msg = "성공";
        result.code = "1";
        result.data = decoded;
    }else if(!decoded  && result.code != "2"){
        result.msg = "로그인 후 이용해 주세요";
        result.code = "3";
    }

    return  result;
}


