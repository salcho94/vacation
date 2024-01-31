import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';

import {pool} from "@/app/api/db.config";

export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    const name = req.nextUrl.searchParams.get("userName");
    if(name){
       let result = await duplicationCheck(name);
       if(result.length > 0){
           return NextResponse.json(false);
       }else{
           return NextResponse.json(true);
       }
    }else{
        return NextResponse.json("이름이 없음");
    }

}



const duplicationCheck = async (userName: string | null) => {
    const conn = await pool.getConnection();
    let result = [];
    try{
        result = await conn.query(
            `SELECT user_name
                 FROM user 
                 WHERE user_del_yn = 'N' and user_name = '${userName}'
            `);
    }catch{
        console.log("db 연결 실패 경로 : /api/user/duplicate  duplicationCheck 요청");
    }finally {
        await conn.release();
    }

    return result;
}