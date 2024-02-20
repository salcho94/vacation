import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';

import {pool} from "@/app/api/db.config";


export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    let result = await selectAlert();
    if(result){
        return NextResponse.json(result);
    }else{
        return NextResponse.json("");
    }
}

const selectAlert = async () => {
    const conn = await pool.getConnection();
    let result = "";

    try{
        result = await conn.query(
            `
               SELECT alert_id as 'alertId', user_name as 'userName', cate as 'cate', title as 'title', reg_date as 'regDate', link as 'link'
               FROM alert;
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/alert/selectAlert  selectAlert 요청");
    }finally {
        await conn.release();
    }

    return  result;
}