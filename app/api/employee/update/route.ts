import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import {pool} from "@/app/api/db.config";

export async function POST(req: NextRequest) {
    await loggerMiddleware(req);

    const {uuid,userDelYn,deptId,authId,userVacation} = await req.json();
    const data = {uuid:uuid,userDelYn:userDelYn,deptId:deptId,authId:authId,userVacation:userVacation}
    const result = await updateUser(data);

    if(result?.affectedRows > 0){
        return NextResponse.json(true);
    }else{
        return NextResponse.json(false);
    }

}


const updateUser = async (data: any) => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `
                    UPDATE user
                    SET  user_del_yn='${data.userDelYn}', user_vacation=${data.userVacation} , user_auth_id=${data.authId} , dept_id=${data.deptId}
                    WHERE user_uuid='${data.uuid}' ;
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/employee/update  update 요청");
    }finally {
        await conn.release();
    }

    return  result;
}
