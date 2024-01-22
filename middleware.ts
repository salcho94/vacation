import { NextRequest, NextResponse } from 'next/server';
import {authenticate} from "@/app/api/jwt.common";
import {cookies} from "next/headers";


export async function middleware(request: NextRequest) {

    let result = await authenticate(request);

    if(result) {
        if (result.code === "1" && request.nextUrl.pathname == '/') {
            return NextResponse.redirect(new URL('/calendar', request.nextUrl.origin));
        }
        if (result.code === "2" && request.nextUrl.pathname !== '/') {
            return NextResponse.redirect(new URL('/token', request.nextUrl.origin));
        }
        if (result.code === "3" && request.nextUrl.pathname !== '/') {
            return NextResponse.redirect(new URL('/none', request.nextUrl.origin));
        }
    }else{
        return NextResponse.json("jwt 인증 오류");
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/','/calendar','/mypage'],
};