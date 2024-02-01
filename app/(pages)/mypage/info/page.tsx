"use client"

import React, {useEffect, useState} from "react";
import {getUserInfo} from "@/app/(pages)/commonApi";
import axios from "axios";

interface user{
    userId: number,
    userName: string,
    auth:number,
    authName:string,
    dept:string,
}

export default function Info() {
    const [userInfo,setUserInfo] = useState<user|any>()

    useEffect(()=>{
        getUserInfo().then(res => setUserInfo(res));
    },[])
    return (
        <>
            <div className="flex w-full pt-2 content-center justify-between md:w-1/2 md:justify-end">
                {userInfo?.authName}
            </div>
        </>
    );
}


