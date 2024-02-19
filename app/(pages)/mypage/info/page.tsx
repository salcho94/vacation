"use client"

import React, {useEffect, useState} from "react";
import {getUserInfo} from "@/app/(pages)/commonApi";




export default function Info() {

    const [userInfo,setUserInfo] = useState<any>( {userId: 0,
        userName: "",
        auth:"",
        authName:"",
        dept:"",
        regDate:""})

    useEffect(()=>{
        getUserInfo().then(res => setUserInfo(res));
        return () => {
            setUserInfo("");
        };

    },[])
    return (
        <>
            <form>
                <div className="p-12 bg-gray-100 flex items-center justify-center">
                    <div className="container max-w-screen-lg mx-auto">
                        <div>
                            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                    <div className="text-gray-600">
                                        <p className="font-medium text-lg">My Information</p>
                                        <p>정보 수정은 관리자만 가능합니다.</p>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                            <div className="md:col-span-2">
                                                <label htmlFor="full_name">이름</label>
                                                <strong>
                                                <input
                                                    type="text"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    defaultValue={userInfo.userName && userInfo.userName}
                                                    readOnly={true}
                                                />
                                                </strong>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="full_name">직급</label>
                                                <strong>
                                                <input
                                                    type="text"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    defaultValue={userInfo.authName && userInfo.authName}
                                                    readOnly={true}
                                                />
                                                </strong>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="full_name">부서</label>
                                                <strong>
                                                <input
                                                    type="text"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    defaultValue={userInfo.dept && userInfo.dept}
                                                    readOnly={true}
                                                />
                                                </strong>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="full_name">등록일</label>
                                                <strong>
                                                <input
                                                    type="text"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    defaultValue={userInfo.regDate && userInfo.regDate.substring(0,10)}
                                                    readOnly={true}
                                                />
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
        );
}


