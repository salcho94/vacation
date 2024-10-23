import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from '../../../loggerMiddleware';

export async function GET(req: NextRequest) {
    await loggerMiddleware(req);
    const lat = req.nextUrl.searchParams.get("lat");
    const lon = req.nextUrl.searchParams.get("lon");
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}&lang=kr`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Weather API 요청 실패:', error);
        return NextResponse.json({error: '날씨 정보 로드 실패'});
    }
}
