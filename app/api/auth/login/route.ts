import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import jwt from "jsonwebtoken";
import { pool } from "@/app/api/db.config";
import bcrypt from "bcrypt";
import {getNowTime} from "@/app/util/common";
import axios from "axios";

export async function POST(req: NextRequest,res: NextResponse) {
    await loggerMiddleware(req);

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
            await updateLastLogin(rows.id);
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

const updateLastLogin = async (userId : string) => {
    const conn = await pool.getConnection();
    const nowTime = await getNowTime();
    let ip ="";
    await axios.get('https://geolocation-db.com/json/')
        .then((res) => {
            ip =  res.data.IPv4;
        })
    try{
       await conn.query(`UPDATE user SET user_last_time = '${nowTime}',user_last_ip = '${ip}' WHERE user_uuid = '${userId}'`);
    }catch{
        console.log("db 연결 실패 경로 : /api/auth/login  updateLastLogin 요청");
    }finally {
        await conn.release();
    }

}

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

