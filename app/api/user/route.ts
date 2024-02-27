import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import {authenticate} from '@/app/api/jwt.common';
import {pool} from "@/app/api/db.config";



export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    let result:any = await authenticate(req);
    let userInfo;
    if(result){
        userInfo =   await getUserInfo(result.decoded.userId);
    }
    return NextResponse.json(userInfo);
}




const getUserInfo = async (uuid: string) => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `SELECT u.user_vacation as 'vacationCnt',
                        u.user_name as 'userName',
                        u.user_uuid as 'userUuid',
                        a.user_auth_id as 'authId',
                        a.user_auth_name  as 'authName',
                        d.dept_id  as 'deptId',
                        d.dept_name  as 'deptName',
                        u.user_reg as 'regDate'
                FROM user u INNER JOIN auth_code a
                    ON u.user_auth_id = a.user_auth_id
                    INNER JOIN dept_code d 
                    ON u.dept_id = d.dept_id
                    where u.user_uuid = '${uuid}'
                    AND u.user_del_yn = 'N'
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/auth/login  getUserInfo 요청");
    }finally {
        await conn.release();
    }
    return result[0];
}
