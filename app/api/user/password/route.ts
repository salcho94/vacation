import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import { pool } from "@/app/api/db.config";
import bcrypt from "bcrypt";
import {authenticate} from "@/app/api/jwt.common";

export async function POST(req: NextRequest,res: NextResponse) {
    await loggerMiddleware(req);
    const { bePassword ,newPassword} = await req.json();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword,salt);
    const result = await authenticate(req);
    const uuid = result.decoded.userId;
    let rows: any;

    rows  =  await getUserPass(uuid);
    let isPasswordCorrect = false;

    if(rows){
        isPasswordCorrect = await bcrypt.compare(
            bePassword,
            rows.password
        )
    }else{
        res = NextResponse.json({ success: false, errormessage: "유저 정보 가져올수없음" });
    }
    if(isPasswordCorrect){
        const data = {uuid:uuid,password:hash}
        const result: any = await updatePass(data);
        console.log("resultresultresult"+result?.affectedRows);
        if(result?.affectedRows > 0){
            res =  NextResponse.json({ success: true, message: "비밀번호 변경이 완료되었습니다." });
        }else{
            res =  NextResponse.json({ success: false, errormessage: "비밀번호 변경중 오류" });
        }
    }else{
        res = NextResponse.json({ success: false, errormessage: "기존 비밀번호가 다릅니다." });
    }


    return res;
}


const getUserPass= async (uuid: any) => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `SELECT  password as 'password'
                 FROM user
                 WHERE user_uuid = '${uuid}' 
                 AND user_del_yn = 'N'
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/user/password  getUserPass 요청");
    }finally {
        await conn.release();
    }
    return result[0];
}


const updatePass = async (data: any) => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `
                    UPDATE user
                    SET  password='${data.password}'
                    WHERE user_uuid='${data.uuid}' ;
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/user/updatePass  updatePass 요청");
    }finally {
        await conn.release();
    }
    console.log(result);
    return  result;
}
