import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import { v4 as uuid_v4 } from "uuid";
import {pool} from "@/app/api/db.config";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    await loggerMiddleware(req);
    let createData = await req.json();
    const uuid: string = uuid_v4();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(createData.password,salt);
    createData.uuid = uuid;
    createData.password = hash;

    let result = await insertUser(createData);

    if(result){
        return NextResponse.json(true);
    }else{
        return NextResponse.json(false);
    }

}


const insertUser = async (data: any) => {
    const conn = await pool.getConnection();
    let result = "";

    try{
        result = await conn.query(
            `
                INSERT INTO user(
                    user_uuid
                    , user_auth_id
                    , dept_id
                    , user_name
                    , password
                    , user_reg
                    )VALUES(
                    '${data.uuid}'
                    ,'${data.userAuth}'
                    ,'${data.userDept}'
                    ,'${data.userName}'
                    ,'${data.password}'
                    , now());
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/user/create  insertUser 요청");
    }finally {
        await conn.release();
    }

    return  result;
}
