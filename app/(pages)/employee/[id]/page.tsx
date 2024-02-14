"use client"

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {DELETE, getAuthInfo, getDeptInfo, getUserDetail, getUserInfo} from "@/app/(pages)/commonApi";
import {SubmitHandler, useForm} from "react-hook-form";

import axios from "axios";
import {x} from "@fullcalendar/resource/internal-common";
interface updateUser {
    uuid : string
    authId : number
    deptId : number
    userDelYn : string
    userLastIp :string
    userLastTime : string
    userName : string
    userReg : string
    userVacation :number
}


export default function EmployeeView(props: any) {
    const [userDetail,setUserDetail] = useState<updateUser | null>();
    const [userAuth,setUserAuth] = useState<any>([]);
    const [userDept,setUserDept] = useState<any>([]);


    useEffect(() => {
        const init = async ():Promise<void> => {
            const result = await getUserDetail(props.params.id);
            if(result.success == 'Y'){
                setUserDetail(result.employee);
            }
            let dept = await getDeptInfo();
            let auth = await getAuthInfo();

            setUserAuth(auth);
            setUserDept(dept);
        }
        return () => {
            init();
        }
    },[])
    const handleUpdate: SubmitHandler<updateUser> = async (data) => {

    }
    const handleDelete: SubmitHandler<updateUser> = async () => {
        DELETE('/employee/delete',"회원 삭제를 진행할까요. 회원정보가 소멸됩니다.\r💥 재직상태를 변경하시려면 재직여부를 수정해 주세요",userDetail?.uuid);
    }
    const pageNum = props.searchParams.pageNum;
    const keyWord = props.searchParams.keyWord;
    const delYn = props.searchParams.delYn;

    return (
        <>
            <form >
                <div className="p-12 bg-gray-100 flex items-center justify-center">
                    <div className="container max-w-screen-lg mx-auto">
                        <div>
                            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                                    <div className="text-gray-600">
                                        <p className="font-medium text-lg">직원 정보</p>
                                        <p>여기서 직원을 (수정/삭제) 하실 수 있습니다.</p>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                            <div className="md:col-span-2">
                                                <label htmlFor="full_name">이름</label>
                                                <input
                                                    type="text"
                                                    defaultValue={userDetail?.userName}
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    readOnly={true}
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label htmlFor="address">재직여부</label>
                                                <select
                                                    className="w-full text-center  h-10 bg-gray-50 flex border border-gray-200  rounded items-center mt-1"
                                                >
                                                    <option>{userDetail?.userDelYn == 'N' ? '재직중' : '퇴사'}</option>
                                                    <option>{userDetail?.userDelYn != 'N' ? '재직중' : '퇴사'}</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-1">
                                                <label htmlFor="vacationCnt">연차 갯수</label>
                                                <input type="number" name="vacationCnt" id="vacationCnt" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" defaultValue={userDetail?.userVacation}  />
                                            </div>
                                            <div className="md:col-span-1">
                                                <div className="inline-flex items-end">

                                                 </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="password">마지막 접속 IP</label>
                                                <input
                                                    type="text"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    defaultValue={userDetail?.userLastIp}
                                                    readOnly={true}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="passwordChk">마지막 접속 시간</label>
                                                <input
                                                    type="text"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    defaultValue={userDetail?.userLastTime}
                                                    readOnly={true}
                                                />
                                            </div>
                                            <div className="md:col-span-2 ">
                                                <label >직급</label>
                                                <div className="text-gray-600">
                                                    <select
                                                        className="w-full text-center  h-10 bg-gray-50 flex border border-gray-200  rounded items-center mt-1"
                                                    >
                                                        {
                                                            userAuth?.map((data:any,index:number) => {
                                                                if(data.authId == userDetail?.authId) {
                                                                    return (
                                                                        <option key={index}
                                                                                value={`${data.authId}`}>{data.authName}</option>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                        {
                                                            userAuth?.map((data:any,index:number) => {
                                                                if(data.authId != userDetail?.authId) {
                                                                    return (
                                                                        <option key={index}
                                                                                value={`${data.authId}`}>{data.authName}</option>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 ">
                                                <label >부서</label>
                                                <div className="text-gray-600">
                                                    <select
                                                        className="w-full text-center  h-10 bg-gray-50 flex border border-gray-200  rounded items-center mt-1"
                                                    >
                                                        {
                                                            userDept?.map((data:any,index:number) => {
                                                                if(data.deptId == userDetail?.deptId){
                                                                    return(
                                                                        <option key={index}  value={`${data.deptId}`} >{data.deptName}</option>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                        {
                                                            userDept?.map((data:any,index:number) => {
                                                                if(data.deptId != userDetail?.deptId){
                                                                    return(
                                                                        <option key={index}  value={`${data.deptId}`} >{data.deptName}</option>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="passwordChk">등록일</label>
                                                <input
                                                    type="text"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    defaultValue={userDetail?.userReg}
                                                    readOnly={true}
                                                />
                                            </div>
                                            <div className="md:col-span-5 text-right">
                                                <div className="inline-flex items-end mr-1">
                                                    <a  className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href={`/employee/list?pageNum=${pageNum}&keyWord=${keyWord}&delYn=${delYn}`}>
                                                        목록
                                                    </a>
                                                </div>
                                                <div className="inline-flex items-end">
                                                    <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete()}>삭제</button>
                                                </div>
                                                <div className="inline-flex items-end ml-1">
                                                    <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">수정</button>
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


