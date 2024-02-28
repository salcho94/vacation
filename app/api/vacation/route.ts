import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import { v4 as uuid_v4 } from "uuid";
import {pool} from "@/app/api/db.config";

import bcrypt from "bcrypt";
import {insertAlert} from "@/app/api/alert.common";

export async function POST(req: NextRequest) {
    await loggerMiddleware(req);
    let vacationData = await req.json();

    let result:any  = await insertVacation(vacationData);

    if(result.affectedRows > 0){
        let title = '';
        if(vacationData.vacationType == 'getter'){
            title = `${vacationData.userName} 님의 외근(출장) 신청이 완료 되었습니다.`;
        }else if(vacationData.vacationType == 'meeting'){
            title = `${vacationData.userName} 님의 미팅일정이 생성 되었습니다.`;
        }else{
            await updateVacation(vacationData)
            title =  `${vacationData.userName} 님의 ${vacationData.halfType? vacationData.halfType +'반차' : '연차'} 신청이 완료되었습니다.`
        }

        let data : any = {
             name:vacationData.userName
            ,category:vacationData.vacationType
            ,title:`${title}`
            ,link:``
            ,dept: `${vacationData.deptId}` }
        await insertAlert(data)
        return NextResponse.json(true);
    }else{
        return NextResponse.json(false);
    }

}


const insertVacation = async (data: any) => {
    console.log(data);
    const conn = await pool.getConnection();
    let result = "";

    try{
        result = await conn.query(
            `
                    INSERT INTO user_vacation(
                     user_uuid
                     , vacation_start
                     , vacation_end
                     , use_vacation
                     , use_reason
                     , use_yn
                     , upper_user
                     , vacation_type
                     , half_type
                     , reg_date
                     )VALUES(
                    '${data.userUuid}'
                    ,'${data.start}'
                    ,'${data.end}'
                    ,'${Number(data.useVacation)}'
                    ,'${data.useReason}'
                    ,'N'
                    ,'${data.upperUser}'
                    ,'${data.vacationType}'
                    ,'${data.halfType}'
                    , now()
                    );
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/vacation  insertVacation 요청");
    }finally {
        await conn.release();
    }

    return  result;
}


const updateVacation = async (data: any) => {
    const conn = await pool.getConnection();
    let result = "";

    try{
        result = await conn.query(
            `
               UPDATE user
                SET user_vacation = (user_vacation - ${data.useVacation})
                WHERE user_uuid='${data.userUuid}' AND user_del_yn='N'`)
    }catch{
        console.log("db 연결 실패 경로 : /api/user/create  insertUser 요청");
    }finally {
        await conn.release();
    }

    return  result;
}
