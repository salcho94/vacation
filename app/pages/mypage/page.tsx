"use client"

import React, {useEffect, useState} from "react";
import axios from "axios";

interface user{
    userId: number,
    userName: string,
    auth:number,
    authName:string,
    dept:string,
}

export default function Page() {
    const [userInfo,setUserInfo] = useState<user>()


    useEffect(()=>{
        async function getUser() {
            try {
                const response = await axios.get('/api/user');
                console.log(response.data.data);
                setUserInfo(response.data.data)
            } catch (error) {
                console.error(error);
            }
        }
        getUser();
    },[])
    return (
        <>
            <div className="flex w-full pt-2 content-center justify-between md:w-1/2 md:justify-end">
                {userInfo?.authName}
            </div>
        </>
    );
}


