import { NextRequest, NextResponse } from 'next/server';
import {authenticate} from "@/app/api/jwt.common";
import {cookies} from "next/headers";


export async function middleware(request: NextRequest) {

    const result = await authenticate(request);
    const pathname = request.nextUrl.pathname;

    if(result) {
        if (result.code === "1" && pathname == '/') {
            return NextResponse.redirect(new URL('/calendar', request.nextUrl.origin));
        }
        if (result.code === "2" && pathname !== '/') {
            return NextResponse.redirect(new URL('/token', request.nextUrl.origin));
        }
        if (result.code === "3" && pathname !== '/') {
            return NextResponse.redirect(new URL('/none', request.nextUrl.origin));
        }
    }else{
        return NextResponse.json("jwt 인증 오류");
    }

    if (result.decoded?.auth != 1 && pathname.startsWith('/employee')) {
        return NextResponse.redirect(
            new URL('/auth', request.nextUrl.origin),
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/','/calendar/:path*','/mypage/:path*','/employee/:path*'],
};