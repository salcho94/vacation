"use client"

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {getUserInfo,logOut} from "@/app/pages/util";
interface user{
    userId: number,
    userName: string,
    auth:number,
    authName:string,
    dept:string,
}

export default function Header() {
    const [userInfo,setUserInfo] = useState<user>()

    useEffect(() => {
        getUserInfo().then(res => setUserInfo(res));
    },[])

    return (
        <>
            <header className="bg-gray-800 p-2 mt-0 fixed w-full z-10 top-0">
                <div className="container mx-auto flex flex-wrap items-center">
                    <div className="flex w-full md:w-1/2 justify-center md:justify-start text-white font-extrabold">
                        <Link className="text-white no-underline hover:text-white hover:no-underline" href="/">
                            <span className="text-2xl pl-2"><i className="em em-grinning"></i> JS COMPANY</span>
                        </Link>
                    </div>
                    <div className="flex w-full pt-2 content-center justify-between md:w-1/2 md:justify-end">
                        <ul className="list-reset flex justify-between flex-1 md:flex-none items-center">
                            <li className="mr-3">
                                <a className="inline-block py-2 px-4 text-white no-underline" href="/pages/mypage">내 정보</a>
                            </li>
                            { userInfo?.auth === 1 &&
                            <li className="mr-3">
                                <a className="inline-block py-2 px-4 text-white no-underline" href="#">직원관리</a>
                            </li>
                            }
                            <li className="mr-3">
                                <a className="inline-block py-2 px-4 text-white no-underline cursor-pointer" onClick={(e)=>{logOut()}}>로그아웃</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </>
    );
}


