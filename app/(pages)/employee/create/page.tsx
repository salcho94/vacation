"use client"

import React, {useEffect, useState} from "react";
import {set, SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {getAuthInfo, getDeptInfo} from "@/app/(pages)/commonApi";

interface createUser {
    userName: string;
    password: string;
    passwordChk: string;
    userAuth: number;
    userDept: number;
}


export default function EmployeeCreate() {
    const { register
        , handleSubmit
        , watch
        , formState: { errors } } = useForm<createUser>();
    const [userAuth,setUserAuth] = useState<any>([]);
    const [userDept,setUserDept] = useState<any>([]);

    useEffect(() => {
        const init = async ():Promise<void> => {
            let dept = await getDeptInfo();
            let auth = await getAuthInfo();
            setUserAuth(auth);
            setUserDept(dept);
        }
        init();

    },[])

    const duplicationCheck = async (userName: string) =>{
        let result = false;
        await axios.get("/api/user/duplicate",{
            params: {
                userName: userName
            }
        })
        .then((response) => {
            if(response.data){
                result = true
            }
        })
        .catch((error) => {
            console.log(error);
        });
        return result;
    }

    const handleCreateUser: SubmitHandler<createUser> = async (data) => {
        if (!data.userAuth) {
            data.userAuth = 1;
        } else {
            data.userAuth = Number(data.userAuth);
        }
        if (!data.userDept) {
            data.userDept = 1;
        } else {
            data.userDept = Number(data.userDept);
        }
        const duplicate = await duplicationCheck(data.userName);

        if(duplicate){
            if(data.password !== data.passwordChk){
                alert("비밀번호와 비밀번호 확인이 같지 않습니다.");
            }else{
                axios
                    .post("/api/user/create", data)
                    .then((response) => {
                        if(response.data){
                            alert("직원 추가가 완료되었습니다.");
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        alert(error);
                    });
            }
        }else{
            alert("이미 사용중인 이름입니다 (동명이인) ex)뒤에 생년월일을 추가하던지 알아서 하세요");
        }

    }


    return (
        <>
            <form onSubmit={handleSubmit(handleCreateUser)}>
                <div className="p-12 bg-gray-100 flex items-center justify-center">
                    <div className="container max-w-screen-lg mx-auto">
                        <div>
                            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                    <div className="text-gray-600">
                                        <p className="font-medium text-lg">신규 직원 등록</p>
                                        <p>여기서 직원을 신규로 추가할 수 있습니다.</p>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                            <div className="md:col-span-5">
                                                <label htmlFor="full_name">이름</label>
                                                <input
                                                    {...register("userName")}
                                                    type="text"
                                                    name="userName"
                                                    id="userName"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    placeholder="로그인시 사용됩니다."
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-5">
                                                <label htmlFor="password">비밀번호</label>
                                                <input
                                                    {...register("password")}
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    autoComplete="off"
                                                    placeholder="비밀번호를 입력해 주세요"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-5">
                                                <label htmlFor="passwordChk">비밀번호 확인</label>
                                                <input
                                                    {...register("passwordChk")}
                                                    type="password"
                                                    name="passwordChk"
                                                    id="passwordChk"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    placeholder="비밀번호를 확인해 주세요"
                                                    autoComplete="off"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2 ">
                                                <label >직급</label>
                                                <div className="text-gray-600">
                                                    <select
                                                        {...register("userAuth")}
                                                        className="w-full text-center  h-10 bg-gray-50 flex border border-gray-200  rounded items-center mt-1"
                                                    >
                                                        {
                                                            userAuth?.map((data:any,index:number) => {
                                                                return(
                                                                    <option key={index}  value={`${data.authId}`}>{data.authName}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 ">
                                                <label >부서</label>
                                                <div className="text-gray-600">
                                                    <select
                                                        {...register("userDept")}
                                                        className="w-full text-center  h-10 bg-gray-50 flex border border-gray-200  rounded items-center mt-1"
                                                    >
                                                        {
                                                            userDept?.map((data:any,index:number) => {
                                                                return(
                                                                    <option key={index}  value={`${data.deptId}`}>{data.deptName}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
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

{/*
                                        <div className="md:col-span-3">
                                            <label htmlFor="address">주소</label>
                                            <input type="text" name="address" id="address" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="city">상세주소</label>
                                            <input type="text" name="city" id="city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" value="" placeholder="" />
                                        </div>
*/}
