import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';

import {pool} from "@/app/api/db.config";


export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    const id = req.nextUrl.searchParams.get("uuid");
    const employeeDetail = await getEmployeeDetail(id);
    if(employeeDetail.length > 0){
        return NextResponse.json({"employee":employeeDetail[0] , "success" : true});
    }else{
        return NextResponse.json({"msg":"직원 정보를 불러올수 없습니다.(UUID 오류)" , "success" : false});
    }
}


const getEmployeeDetail = async (id :string|null) => {
    const conn = await pool.getConnection();
    let query = "";
    query =  `SELECT u.user_uuid as 'uuid'
                    ,u.user_name as 'userName'
                   , u.user_del_yn as 'userDelYn'
                   ,u.user_last_ip as 'userLastIp'
                   ,u.user_last_time  as 'userLastTime'
                   ,u.user_vacation as 'userVacation'
                   ,date_format(u.user_reg,'%Y-%m-%d')   as 'userReg'
                   ,d.dept_id  as 'deptId'
                   ,a.user_auth_id as 'authId'
             FROM user u INNER JOIN dept_code d 
             ON u.dept_id = d.dept_id 
             INNER JOIN auth_code a
             ON u.user_auth_id = a.user_auth_id
             WHERE U.user_uuid ='${id}'
             `

    let result = "";
    try{
        result = await conn.query(query);
    }catch{
        console.log("db 연결 실패 경로 : /api/employee  getEmployeeList 요청");
    }finally {
        await conn.release();
    }

    return result;
}