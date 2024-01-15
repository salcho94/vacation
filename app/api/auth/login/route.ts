import mariadb from 'mariadb';
import {NextApiResponse,NextApiRequest} from "next";
import {NextResponse} from "next/server";
interface FormData {
    userId: string;
    password: string;
}
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
export async function GET(req:any,res:any){
    return NextResponse.json("get");
}

export async function POST(req:NextApiRequest,res:NextApiResponse){
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    console.log('받은 데이터:', valueToJson.userId);

    const conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${valueToJson.userId}`);
    conn.release();

    return NextResponse.json(rows);
}
