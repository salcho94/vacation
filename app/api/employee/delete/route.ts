import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import {pool} from "@/app/api/db.config";

export async function POST(req: NextRequest) {
    await loggerMiddleware(req);
    const {uuid} = await req.json();
    const result = await deleteUser(uuid);

    if(result?.affectedRows > 0){
        return NextResponse.json(true);
    }else{
        return NextResponse.json(false);
    }
}


const deleteUser = async (uuid: string | null) => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `
                   delete from user
                   WHERE user_uuid = '${uuid}'
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/employee/delete  deleteUser 요청");
    }finally {
        await conn.release();
    }

    return  result;
}
