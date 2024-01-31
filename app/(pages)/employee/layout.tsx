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

    const pathList = ['create','list','vacationList'];
    const [steps,setSteps] = useState<any[]>(pathInit(pathList,pathStep));
    const handleClick = (stepNum: number) =>{
        let copy = [false,false,false];
        copy[stepNum] = true;
        setSteps(copy);
    }

  return (
      <div >
          <ul className={`grid grid-flow-col text-center text-gray-500 bg-gray-100 rounded-lg p-1`}>
              <li>
                  <Link href="/employee/create" className={`flex justify-center py-4 hover:bg-white rounded-lg shadow text-indigo-900 ${steps[0] && "bg-white rounded-lg shadow text-indigo-900"}`} onClick={event => handleClick(0)}>직원 등록</Link>
              </li>
              <li>
                  <Link href="/employee/list" className={`flex justify-center py-4 hover:bg-white rounded-lg shadow text-indigo-900 ${steps[1] && "bg-white rounded-lg shadow text-indigo-900"}`} onClick={event => handleClick(1)}>직원 목록</Link>
              </li>
              <li>
                  <Link href="/employee/vacationList" className={`flex justify-center py-4 hover:bg-white rounded-lg shadow text-indigo-900 ${steps[2] && "bg-white rounded-lg shadow text-indigo-900"}`} onClick={event => handleClick(2)}>연차 사용 내역</Link>
              </li>
          </ul>
          <div>
            {children}
          </div>
      </div>
  );
}
