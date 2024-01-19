import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from '../../../../loggerMiddleware';
import jwt from "jsonwebtoken";
import { pool } from "@/app/api/db.config";




export async function POST(req: NextRequest) {
    await loggerMiddleware(req);

    let res = new NextResponse();
    let rows: any   =  await getUserInfo(await req.json());
    console.log(rows)
    if (rows) {
        try {
            const accessToken = await new Promise((resolve, reject) => {
                jwt.sign({
                    userId: rows.id,
                    userName: rows.name,
                    auth:rows.auth,
                    authName:rows.authName,
                    dept:rows.dept
                },  process.env.SECRET_KEY as string, {
                    expiresIn: "10m", //토큰 유효 시간
                }, (err, token)=>{
                    err ? reject(err) : resolve(token)
                })

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
            `SELECT u.user_id as 'id' 
                   , u.user_name as 'name'
                   , u.user_auth_id as 'auth' 
                   , d.dept_name as 'dept'
                   , a.user_auth_name as 'authName'
                 FROM user u INNER JOIN dept_code d 
                 ON u.dept_id = d.dept_id 
                 INNER JOIN auth_code a
                 ON u.user_auth_id = a.user_auth_id 
                 WHERE user_name = '${body.userName}' 
                 AND password = '${body.password}'
                 AND u.user_del_yn = 'N'
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/auth/login  getUserInfo 요청");
    }finally {
        await conn.release();
    }
    return result[0];
}

