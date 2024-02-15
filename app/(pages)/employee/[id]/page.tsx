"use client"

import React, {useEffect, useState} from "react";
import {DELETE, getAuthInfo, getDeptInfo, getUserDetail, UPDATE} from "@/app/(pages)/commonApi";
import {SubmitHandler, useForm} from "react-hook-form";


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
    const [userDetail,setUserDetail] = useState<updateUser>({
        uuid : '',
        authId: 0,
        deptId: 0,
        userDelYn: "",
        userLastIp: "",
        userLastTime: "",
        userName: "",
        userReg: "",
        userVacation: 0,
    });
    const { register, handleSubmit, formState: { errors } }  = useForm<updateUser>();
    const [id, setId] = useState(props.params.id);
    const [userAuth,setUserAuth] = useState<any>([]);
    const [userDept,setUserDept] = useState<any>([]);


    useEffect(() => {
        getDeptInfo().then(deptData =>{
            setUserDept(deptData);
        })
        getAuthInfo().then(authData =>{
            setUserAuth(authData);
        })
        getUserDetail(id).then((data: any) =>{
            if(data.success){
                setUserDetail(data.employee);
            }
        })
    },[id])
    const handleVacationChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        if(Number(e.target.value) > 31){
            alert("연차는 31개를 초과 하실수 없습니다.");
            e.target.value = '';
        }else if(Number(e.target.value) < 0){
            alert("연차는 마이너스 하실수 없습니다.");
            e.target.value = '';
        }else{
            setUserDetail({...userDetail,['userVacation']:Number(e.target.value)});
        }

    }
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>{
            setUserDetail({...userDetail,[e.target.name]:e.target.value});
    }
    const handleUpdate: SubmitHandler<updateUser> = async () => {
        UPDATE('/employee/update',"회원정보를 수정하시겠습니까?",userDetail);
    }
    const handleDelete = async (event: React.MouseEvent<HTMLElement>,uuid: string) => {
        event.preventDefault();
        DELETE('/employee/delete',"회원 삭제를 진행할까요. 회원정보가 소멸됩니다.\r💥 재직상태를 변경하시려면 재직여부를 수정해 주세요",uuid);
    }
    const pageNum = props.searchParams.pageNum;
    const keyWord = props.searchParams.keyWord;
    const delYn = props.searchParams.delYn;

    return (
        <>
            <form onSubmit={handleSubmit(handleUpdate)}>
                <input
                    {...register("uuid")}
                    type="hidden"
                    defaultValue={userDetail?.uuid}
                />
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
                                                    {...register("userName")}
                                                    type="text"
                                                    defaultValue={userDetail?.userName}
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    readOnly={true}
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label htmlFor="address">재직여부</label>
                                                <select
                                                    {...register("userDelYn")}
                                                    id="userDelYn"
                                                    onChange={(e)=>{handleChange(e)}}
                                                    className="w-full text-center  h-10 bg-gray-50 flex border border-gray-200  rounded items-center mt-1"
                                                >
                                                    {
                                                        userDetail?.userDelYn == 'N' &&
                                                      <>
                                                        <option value="N">재직중</option>
                                                        <option value="Y">퇴사</option>
                                                      </>
                                                    }
                                                    {
                                                        userDetail?.userDelYn == 'Y' &&
                                                        <>
                                                          <option value="Y">퇴사</option>
                                                          <option value="N">재직중</option>
                                                        </>
                                                    }

                                                </select>
                                            </div>
                                            <div className="md:col-span-1">
                                                <label htmlFor="userVacation">연차 갯수</label>
                                                <input
                                                    {...register("userVacation")}
                                                    type="number"
                                                    onChange={(e )=>{handleVacationChange(e) }}
                                                    id="userVacation"
                                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                    defaultValue={userDetail?.userVacation}  />
                                            </div>
                                            <div className="md:col-span-1">
                                                <div className="inline-flex items-end">

                                                 </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="password">마지막 접속 IP</label>
                                                {userDetail?.userLastIp  != null?
                                                    <input
                                                        {...register("userLastIp")}
                                                        type="text"
                                                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                        defaultValue={userDetail?.userLastIp}
                                                        readOnly={true}
                                                    /> :
                                                    <input
                                                        type="text"
                                                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                        defaultValue="접속기록이 존재하지 않습니다"
                                                        readOnly={true}
                                                    />
                                                }
                                            </div>
                                            <div className="md:col-span-2">
                                                <label htmlFor="passwordChk">마지막 접속 시간</label>
                                                {userDetail?.userLastTime != null ?
                                                    <input
                                                        {...register("userLastTime")}
                                                        type="text"
                                                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                        defaultValue={userDetail?.userLastTime}
                                                        readOnly={true}
                                                    /> :
                                                    <input
                                                        type="text"
                                                        className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                                        defaultValue="접속기록이 존재하지 않습니다"
                                                        readOnly={true}
                                                    />
                                                }
                                            </div>
                                            <div className="md:col-span-2 ">
                                                <label >직급</label>
                                                <div className="text-gray-600">
                                                    <select
                                                        {...register("authId")}
                                                        onChange={(e)=>{handleChange(e)}}
                                                        id="authId"
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
                                                        {...register("deptId")}
                                                        onChange={(e)=>{handleChange(e)}}
                                                        id="deptId"
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
                                                    {...register("userReg")}
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
                                                    <button type="button" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={(event) => handleDelete(event,userDetail?.uuid)}>삭제</button>
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


