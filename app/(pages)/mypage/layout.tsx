"use client"

import React, {useState} from "react";
import { usePathname} from "next/navigation";
import Link from "next/link";
import {pathInit} from "@/app/(pages)/commonApi";




export default function RegisterLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {

    const pathname = usePathname();
    const splitPath = pathname.split('/');
    const pathStep = splitPath[splitPath.length - 1];
    const pathList = ['info','vacationHistory','workRecode','passChange'];
    const [steps,setSteps] = useState<any[]>(pathInit(pathList,pathStep));

    const handleClick = (stepNum: number) =>{
        let copy = [false,false,false,false];
        copy[stepNum] = true;
        setSteps(copy);
    }

    return (
        <div>
            <ul className="grid grid-flow-col text-center text-gray-500 bg-gray-100 rounded-lg p-1">
                <li>
                    <Link href="/mypage/info" className={`flex justify-center py-4 hover:bg-white rounded-lg shadow text-indigo-900 ${steps[0] && "bg-white rounded-lg shadow text-indigo-900"}`} onClick={event => handleClick(0)}>내 정보</Link>
                </li>
                <li>
                    <Link href="/mypage/vacationHistory" className={`flex justify-center py-4 hover:bg-white rounded-lg shadow text-indigo-900 ${steps[1] && "bg-white rounded-lg shadow text-indigo-900"}`} onClick={event => handleClick(1)}>연차 내역</Link>
                </li>
                <li>
                    <Link href="/mypage/workRecode" className={`flex justify-center py-4 hover:bg-white rounded-lg shadow text-indigo-900 ${steps[2] && "bg-white rounded-lg shadow text-indigo-900"}`} onClick={event => handleClick(2)}>근태 확인</Link>
                </li>
                <li>
                    <Link href="/mypage/passChange" className={`flex justify-center py-4 hover:bg-white rounded-lg shadow text-indigo-900 ${steps[3] && "bg-white rounded-lg shadow text-indigo-900"}`} onClick={event => handleClick(3)}>비밀번호 변경</Link>
                </li>
            </ul>
            {children}
        </div>
    );
}
