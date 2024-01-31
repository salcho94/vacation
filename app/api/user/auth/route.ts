import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import {authenticate} from '@/app/api/jwt.common';
import {pool} from "@/app/api/db.config";

export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    if (await getAuthInfo()) {
        return NextResponse.json(await getAuthInfo());
    } else {
        return NextResponse.json("직급정보를 불러올수 없음");
    }
}



const getAuthInfo = async () => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `SELECT user_auth_id as 'authId'
                ,user_auth_name as 'authName' 
                FROM auth_code 
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/user/auth  getAuthInfo 요청");
    }finally {
        await conn.release();
    }

    return result;
}