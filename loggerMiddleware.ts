import { NextRequest, NextResponse } from 'next/server';

export async function loggerMiddleware(req: NextRequest) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    return NextResponse.next();
}