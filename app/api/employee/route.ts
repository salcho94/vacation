import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from 'loggerMiddleware';
import {authenticate} from '@/app/api/jwt.common';
import {pool} from "@/app/api/db.config";


export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    const delYn = req.nextUrl.searchParams.get("delYn");
    const endPage = req.nextUrl.searchParams.get("endPage");

    const employeeList = await getEmployeeList(delYn,endPage);
    const totalCount = await getEmployeeTotal(delYn);

    if (employeeList && totalCount) {
        return NextResponse.json({employeeList:employeeList, totalCount:totalCount});
    } else {
        return NextResponse.json("직원 목록을 불러올수 없음");
    }
}


const getEmployeeTotal =  async (delYn :string|null) => {
    const conn = await pool.getConnection();
    let query = "";
    query = `   SELECT  COUNT( * ) as 'count'
                 FROM user u INNER JOIN dept_code d 
                 ON u.dept_id = d.dept_id 
                 INNER JOIN auth_code a
                 ON u.user_auth_id = a.user_auth_id
               `
    if(delYn){
        query +=  `WHERE u.user_del_yn = '${delYn}'`
    }

    let result = [];

    try{
        result = await conn.query(query);

    }catch{
        console.log("db 연결 실패 경로 : /api/employee  total 요청");
    }finally {
        await conn.release();
    }
    return Number(result[0].count);
}

const getEmployeeList = async (delYn :string|null,endPage :string|null) => {
    const conn = await pool.getConnection();
    let query = "";
    query = `SELECT u.user_uuid as 'userUuid'
                   , u.user_name as 'userName'
                   , u.user_del_yn as 'userDelYn'
                   , d.dept_name as 'deptName'
                   , a.user_auth_name as 'authName'
                 FROM user u INNER JOIN dept_code d 
                 ON u.dept_id = d.dept_id 
                 INNER JOIN auth_code a
                 ON u.user_auth_id = a.user_auth_id
               `
    if(delYn){
        query +=  `WHERE u.user_del_yn = '${delYn}'`
    }
    if(endPage){
        query +=  `LIMIT ${endPage}, ${process.env.NEXT_PUBLIC_EMPLOYEE_COUNT}`
    }
    console.log(query);
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