import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from '../../../loggerMiddleware';



export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    try {
        const response = await fetch(`https://ipinfo.io/json?token=${process.env.IPINFO_API_KEY}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('IP 정보 요청 실패:', error);
        return NextResponse.json({error: '위치 정보 로드 실패'});
    }
}

