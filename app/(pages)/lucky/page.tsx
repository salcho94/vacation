"use client"

import React, {useEffect, useState} from "react";
import {getUserInfo} from "@/app/(pages)/commonApi";




export default function LuckyPage() {

    const [userInfo,setUserInfo] = useState<any>()

    useEffect(()=>{
      //  getUserInfo().then(res => setUserInfo(res));
        return () => {
            setUserInfo("");
        };
    },[])
    return (
        <>
                test
        </>
        );
}


