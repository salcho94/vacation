import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import {authenticate} from '@/app/api/jwt.common';
import {pool} from "@/app/api/db.config";

export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    const authId = req.nextUrl.searchParams.get("authId");
    const deptId = req.nextUrl.searchParams.get("deptId");
    if (await getDeptUser(Number(deptId),Number(authId))) {
        return NextResponse.json(await getDeptUser(Number(deptId),Number(authId)));
    } else {
        return NextResponse.json("부서정보를 불러올수 없음");
    }
}



const getDeptUser = async (deptId:number,authId:number) => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `
                SELECT u.user_uuid as 'userUuid'
                   , u.user_name as 'userName'
                   , d.dept_name  as 'deptName'
                   , a.user_auth_name as 'authName'
                 FROM user u INNER JOIN dept_code d 
                 ON u.dept_id = d.dept_id 
                 INNER JOIN auth_code a
                 ON u.user_auth_id = a.user_auth_id
                 where u.user_del_yn = 'N' and u.dept_id = ${deptId} and a.user_auth_id < ${authId};
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/auth/dept  getDeptUser 요청");
    }finally {
        await conn.release();
    }

    return result;
}