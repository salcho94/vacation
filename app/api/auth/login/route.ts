import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import jwt from "jsonwebtoken";
import { pool } from "@/app/api/db.config";
import bcrypt from "bcrypt";
import {getNowTime} from "@/app/util/common";
import axios from "axios";
import { headers } from "next/headers";

export async function POST(req: NextRequest,res: NextResponse) {
    await loggerMiddleware(req);


    const headersList = headers();
    const ip = String(headersList.get("x-forwarded-for")).replace(/^::ffff:/, '')

    console.log(ip);
    const loginData = await req.json();
    let isPasswordCorrect = false;
    let rows: any   =  await getUserInfo(loginData);

    if(rows){
        isPasswordCorrect = await bcrypt.compare(
            loginData.password,
            rows.password
        )
    }else{
        res = NextResponse.json({ success: false, errormessage: "아이디가 존재하지 않습니다." });
    }

    if (isPasswordCorrect) {
        try {
            const accessToken = await new Promise((resolve, reject) => {
                jwt.sign({
                    userId: rows.id,
                    userName: rows.name,
                    auth:rows.auth,
                    authName:rows.authName,
                    dept:rows.dept
                },  process.env.SECRET_KEY as string, {
                    expiresIn: `${process.env.LOGIN_LATER_TIME}m`, //토큰 유효 시간
                }, (err, token)=>{
                    err ? reject(err) : resolve(token)
                })

            });
            await updateLastLogin(rows.id,ip);
            if(await getUserVacation(rows.id)){
                await updateUserVacation(rows.id)
            }
            res = NextResponse.json({ success: true, accessToken });
        } catch (err) {
            console.log("토큰 생성 실패",err);
            res = NextResponse.json({ success: false, errormessage: "토큰 서명에 실패했습니다." });
        }
    }

    return res;
}

const updateUserVacation = async (userId : string) =>{
    const conn = await pool.getConnection();
    try{
        await conn.query(`update user  SET user_vacation  = user_vacation + 1
                            , last_vac_month  = MONTH(now()) 
                            WHERE user_uuid = '${userId}'`);
    }catch{
        console.log("db 연결 실패 경로 : /api/auth/login  updateUserVacation 요청");
    }finally {
        await conn.release();
    }
}

const getUserVacation = async (userId : string) =>{
    const conn = await pool.getConnection();
    let result = false;
    try{
        let row = await conn.query(`select user_name 
        FROM user
        where (DATE_ADD(user_reg  , INTERVAL 1 MONTH) <= now()) 
                AND last_vac_month != MONTH(now()) 
                AND user_uuid = '${userId}'`);
        result = row.length > 0 ? true : false;
    }catch{
        console.log("db 연결 실패 경로 : /api/auth/login  getUserVacation 요청");
    }finally {
        await conn.release();
    }

    return result;
}

const updateLastLogin = async (userId: string,ip: string) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const nowTime = await getNowTime();
        // 매개변수화된 쿼리를 사용하여 사용자의 마지막 로그인 시간과 IP 주소 업데이트
        await conn.query(
            'UPDATE user SET user_last_time = ?, user_last_ip = ? WHERE user_uuid = ?',
            [nowTime, ip, userId]
        );
    } catch (error) {
        console.log("마지막 로그인 업데이트 중 오류 발생:", error);
    } finally {
        if (conn) {
            conn.release();
        }
    }
};

const getUserInfo = async (body: any) => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `SELECT u.user_uuid as 'id' 
                   , u.user_name as 'name'
                   , u.user_auth_id as 'auth' 
                   , d.dept_name as 'dept'
                   , a.user_auth_name as 'authName'
                   , u.password as 'password'
                 FROM user u INNER JOIN dept_code d 
                 ON u.dept_id = d.dept_id 
                 INNER JOIN auth_code a
                 ON u.user_auth_id = a.user_auth_id 
                 WHERE user_name = '${body.userName}' 
                 AND u.user_del_yn = 'N'
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/auth/login  getUserInfo 요청");
    }finally {
        await conn.release();
    }
    return result[0];
}

