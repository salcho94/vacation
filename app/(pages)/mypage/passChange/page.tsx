"use client"

import React, {useEffect, useState} from "react";

import axios from "axios";
import Link from "next/link";
import {SubmitHandler, useForm} from "react-hook-form";
import {getAuthInfo, getDeptInfo} from "@/app/(pages)/commonApi";


interface password {
    bePassword: string;
    newPassword:string;
    newPasswordChk: string;
}
export default function PassChange() {
    const { register
        , handleSubmit
        , watch
        , formState: { errors } } = useForm<password>();




    const handlePassChange: SubmitHandler<password> = async (data) => {
        if(true){
            if(data.newPassword !== data.newPasswordChk){
                alert("신규 비밀번호와 신규 비밀번호 확인이 같지 않습니다.");
            }else{
                axios
                    .post("/api/user/password", data)
                    .then((response) => {
                        console.log(response)
                        if(response.data.success){
                            alert(response.data.message)
                            window.location.reload();
                        }else{
                            alert(response.data.errormessage)
                        }
                    })
                    .catch((error) => {
                        alert(error);
                    });
            }
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit(handlePassChange)}>
                <div className="p-12 bg-gray-100 flex items-center justify-center">
                    <div className="container max-w-screen-lg mx-auto">
                        <div>
                            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                    <div className="text-gray-600">
                                        <p className="font-medium text-lg">비밀번호 변경</p>
                                        <p>여기서 비밀번호를 변경하실 수 있습니다.</p>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                            <div className="md:col-span-5">
                                                <label htmlFor="bePassword">기존 비밀번호</label>
                                                <input
                                                    {...register("bePassword")}
                                                    type="password"
                                                    id="bePassword"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    autoComplete="off"
                                                    placeholder="기존 비밀번호를 입력해 주세요"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-5">
                                                <label htmlFor="newPassword">신규 비밀번호</label>
                                                <input
                                                    {...register("newPassword")}
                                                    type="password"
                                                    id="newPassword"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    autoComplete="off"
                                                    placeholder="변경할 비밀번호를 입력해 주세요"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-5">
                                                <label htmlFor="newPasswordChk">신규 비밀번호 확인</label>
                                                <input
                                                    {...register("newPasswordChk")}
                                                    type="password"
                                                    id="newPasswordChk"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    autoComplete="off"
                                                    placeholder="변경할 비밀번호를 입력해 주세요"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-5 text-right">
                                                <div className="inline-flex items-end">
                                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">등록</button>
                                                </div>
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


