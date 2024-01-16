import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";





export async function GET(req: NextRequest) {
    let token = cookies().get("token"); //cookie의 토큰을 가져온다.
    if(token){
        cookies().delete('token');
    }
    return NextResponse.json(true);
}



