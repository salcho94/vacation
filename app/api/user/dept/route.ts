import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import {authenticate} from '@/app/api/jwt.common';
import {pool} from "@/app/api/db.config";

export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    if (await getDeptInfo()) {
        return NextResponse.json(await getDeptInfo());
    } else {
        return NextResponse.json("부서정보를 불러올수 없음");
    }
}



const getDeptInfo = async () => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `SELECT dept_id as 'deptId'
                ,dept_name as 'deptName' 
                FROM dept_code 
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/user/dept  getDeptInfo 요청");
    }finally {
        await conn.release();
    }

    return result;
}