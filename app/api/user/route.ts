import {NextResponse} from "next/server";
import { loggerMiddleware } from '../../../loggerMiddleware';
import {authenticate} from '@/app/api/jwt.common'





export async function GET(req: Request) {
    await loggerMiddleware(req);
    let result =  await authenticate(req);
    return NextResponse.json(result);
}



