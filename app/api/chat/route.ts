import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import { v4 as uuid_v4 } from "uuid";
import {pool} from "@/app/api/db.config";

import bcrypt from "bcrypt";
import {insertAlert} from "@/app/api/alert.common";
import {authenticate} from "@/app/api/jwt.common";

export async function POST(req: NextRequest) {
    await loggerMiddleware(req);
    let createData = await req.json();
    if(createData.chatType === 'admin'){
        await updateChat(createData.chatId);
    }
    let result:any = await insertChat(createData);
    return NextResponse.json(result.affectedRows);
}
export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    const chatId = req.nextUrl.searchParams.get("chatId");
    const mode = req.nextUrl.searchParams.get("mode");
    const chatData =  mode == 'admin' ? await getWaitChatData() : await getChatData(chatId);
    return NextResponse.json(chatData);
}




const getWaitChatData = async () => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `SELECT 
                 chat_id as 'chatId' 
                , message as 'message'
                , chat_type as 'chatType'
                , send_time as 'sendTime'
                , send_date as 'sendDate'
                from chat 
                where first_yn = 'Y' and chat.answer_yn ='N'
                group by chat_id 
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/auth/login  getUserInfo 요청");
    }finally {
        await conn.release();
    }
    return result;
}


const getChatData = async (chatId: string|null) => {
    const conn = await pool.getConnection();
    let result = "";
    try{
        result = await conn.query(
            `SELECT  chat_id as 'chatId'
                        , message as 'message'
                        , location as 'location'
                        , location_ip as 'locationIp'
                        , send_time as 'sendTime'
                        , send_date as 'sendDate'
                        , first_yn as 'firstYn'
                        , answer_yn as 'answerYn'
                        , chat_type as 'chatType'
                        
                  FROM chat
                  WHERE chat_id = '${chatId}'
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/auth/login  getUserInfo 요청");
    }finally {
        await conn.release();
    }
    return result;
}

const updateChat = async (chatId: string)=>{
    const conn = await pool.getConnection();
    let result = "";

    try{
        result = await conn.query(
            `UPDATE chat
                 SET  answer_yn='Y'
                 WHERE chat_id='${chatId}';
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/chat  insertChat 요청");
    }finally {
        await conn.release();
    }

    return  result;

}

const insertChat = async (data: any) => {
    const conn = await pool.getConnection();
    let result = "";

    try{
        result = await conn.query(
            ` INSERT INTO chat(
                    chat_id
                    , message
                    , location
                    , location_ip
                    , send_time
                    , send_date
                    , first_yn
                    , answer_yn
                    , chat_type
                    )VALUES(
                    '${data.chatId}'
                    ,'${data.message}'
                    ,'${data.location}'
                    ,'${data.locationIp}'
                    ,'${data.sendTime}'
                    ,'${data.sendDate}'
                    ,'${data.firstYn}'
                    ,'${data.answerYn}'
                    ,'${data.chatType}'
                    )
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/chat  insertChat 요청");
    }finally {
        await conn.release();
    }

    return  result;
}
