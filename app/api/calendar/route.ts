import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';

import {pool} from "@/app/api/db.config";



export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    const result = await getCalendar();
    return NextResponse.json(result);
}




const getCalendar = async () => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `SELECT v.vacation_id as 'vacationId'
                , u.user_name as 'userName'
                , u.user_uuid as 'userUuid'
                , v.vacation_start as 'start'
                , v.vacation_end as 'end'
                , (CASE
                    WHEN v.vacation_type = 'vacation'
                    THEN '연차'
                    WHEN v.vacation_type = 'getter'
                    THEN '외근'
                    WHEN v.vacation_type = 'meeting'
                    THEN '미팅'
                    ELSE '정보없음'
                    END
                   ) as vacationType
               , (CASE
                WHEN v.vacation_type = 'vacation'
                THEN 'red'
                WHEN v.vacation_type = 'getter'
                THEN 'blue'
                WHEN v.vacation_type = 'meeting'
                THEN 'green'
                ELSE '정보없음'
                END
               ) as color
                FROM user_vacation v inner join user u 
                on v.user_uuid = u.user_uuid 
                where v.use_yn = 'Y'
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/calendar getCalendar 요청");
    }finally {
        await conn.release();
    }
    return result;
}
