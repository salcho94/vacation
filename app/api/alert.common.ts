
import {pool} from "@/app/api/db.config";


export const insertAlert = async (data: any) => {
    const conn = await pool.getConnection();
    let result = "";

    try{
        result = await conn.query(
            `
               INSERT INTO alert
                ( user_name, cate, title, link, dept)
                VALUES( '${data.name}', '${data.category}', '${data.title}',  '${data.link}',  '${data.dept}');
                `);
    }catch{
        console.log("db 연결 실패 경로 : /api/alert/create  insertAlert 요청");
    }finally {
        await conn.release();
    }

    return  result;
}
