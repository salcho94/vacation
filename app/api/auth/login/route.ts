import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";

import { authenticate ,dbconfig } from "@/app/api/jwt.common"


const pool = dbconfig;
/*
export async function GET(req: Request) {
    let res =  authenticate(req);

    console.log(res.data);
    console.log(res.msg);

    return NextResponse.json(res.msg);
}
*/

export async function POST(req: Request) {
    const body = await req.json()
    let res = new NextResponse();
    let rows  =  await getUserInfo(body);
    console.log(rows);
    if (rows) {
        try {
            const accessToken = await new Promise((resolve, reject) => {
                jwt.sign(
                    {
                        userId: rows.id,
                        userName: rows.name,
                        auth:rows.auth,
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: "5m", //토큰 유효 시간
                    },
                    (err: string, token: string) => {
                        if (err) {
                            reject(err); // 실패시
                        } else {
                            resolve(token); // 성공시
                        }
                    }
                );
            });
            res = NextResponse.json({ success: true, accessToken });
        } catch (err) {
            console.log("토큰 생성 실패",err);
            res = NextResponse.json({ success: false, errormessage: "토큰 서명에 실패했습니다." });
        }
    } else {
        res = NextResponse.json({ success: false, errormessage: "아이디와 비밀번호가 일치하지 않습니다." });
    }

    return res;
}


const getUserInfo = async (body: any) => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `SELECT user_id as 'id' 
                   , user_name as 'name'
                   , user_auth as 'auth' 
                 FROM user 
                 WHERE user_name = '${body.userName}' and password = '${body.password}'
                 `);
    }catch{
        console.log("db 연결 실패 경로 : /api/auth/login  getUserInfo 요청");
    }finally {
        await conn.release();
    }
    return result[0];
}

