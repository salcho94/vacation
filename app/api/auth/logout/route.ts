import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {loggerMiddleware} from "../../../../loggerMiddleware";





export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    let token = cookies().get("token");
    if(token){
        cookies().delete('token');
    }
    return NextResponse.json(true);
}



