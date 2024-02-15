"use client"

import React, { useEffect, useState,useCallback} from "react";
import Pagination from "@/app/util/pagination";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import process from "process";
import Link from "next/link";


export default function EmployeeList() {

    const router = useSearchParams();

    const [params,setParams] = useState({pageNum : Number(router.get("pageNum")),
        keyword : router.get("keyWord"),
        delYn : router.get("delYn")})
    const [employeeList,setEmployeeList] = useState([])
    const [delYn,setDelYn] = useState<string>(!params.delYn ? "" : params.delYn )
    const [total,setTotal] = useState<number>(0)
    const [curPage,setCurPage] = useState<number>(!params.pageNum ? 1 : params.pageNum );
    const [keyWord,setKeyWord] = useState<string>(!params.keyword ? "" : params.keyword );
    const getList = useCallback(() => {
        axios.get('/api/employee',{
            params:{ "delYn" : delYn  ,"endPage": (curPage - 1) * Number(process.env.NEXT_PUBLIC_EMPLOYEE_COUNT),"keyWord":keyWord}
        })
            .then(function (response) {
                setEmployeeList(response.data.employeeList);
                setTotal(response.data.totalCount);
            })
    },[delYn, curPage, keyWord]);

    useEffect(() => {
        getList();
    }, [delYn,curPage,getList]);

    const handleChange =(e: React.ChangeEvent<HTMLSelectElement>) =>{
        setDelYn(e.target.value);
        setCurPage(1);
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            getList();
            setCurPage(1);
        }
    }

    const handleSearch = () =>{
        getList();
    }


    return (
        <>
            <div className="p-12 w-full bg-gray-100 flex items-center justify-center">
                <div className="w-full">
                    <div className="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
                        <div className="block text-gray-700 text-lg font-semibold py-2 px-2">
                            직원 목록
                            <div className="pl-2 inline-flex justify-start cursor-pointer">
                                (
                                <span className="bg-green-400 h-2 w-2 m-2 rounded-full"/>재직중/
                                <span className="bg-gray-400 h-2 w-2 m-2 rounded-full"/>퇴사
                                )
                            </div>
                            (직원 수:{total?total:0})
                            <div className="pl-2 inline-flex justify-start cursor-pointer float-right">
                                <select value={delYn} onChange={(e)=>{handleChange(e)}} >
                                    <option value="">전체</option>
                                    <option value="N">재직중</option>
                                    <option value="Y">퇴사</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-full flex items-center bg-gray-200 rounded-md">
                            <div className="pl-2">
                                <svg className="fill-current text-gray-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 24 24">
                                    <path className="heroicon-ui"
                                          d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                                </svg>
                            </div>
                            <div className="w-full">
                                <input
                                    className="w-11/12 float-left rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2"
                                    id="search" type="text" defaultValue={keyWord} onChange={e=>{setKeyWord(e.target.value)}} onKeyDown={handleKeyDown} placeholder="직원 이름을 입력해 주세요"/>
                                <button className="float-right  text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>{handleSearch();}}>
                                    검색
                                </button>
                            </div>
                        </div>
                        <div className="py-3 text-sm">
                            {employeeList ?
                                employeeList.map((data: any,index:number) => {
                                    return(
                                        <Link href={`/employee/${data.userUuid}?pageNum=${curPage}&keyWord=${keyWord}&delYn=${delYn}`} key={index}>
                                            <div  className="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                                                <span className={`${data.userDelYn == 'Y'? "bg-gray-400" :  "bg-green-400"} h-2 w-2 m-2 rounded-full`}></span>
                                                <div className="flex-grow font-medium px-2">{data.userName}</div>
                                                <div className="text-sm font-normal text-gray-500 tracking-wide">{data.authName}</div>
                                            </div>
                                        </Link>
                                    )
                                }) :
                                <div  className="flex justify-center cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                                  <strong>{delYn == 'N' ? '재직중인' : '퇴사한' } {keyWord} 직원은 존재하지 않습니다.</strong>
                                </div>
                            }
                            <div className="text-center">
                                <Pagination totalPage={total} curPage={curPage} setCurPage={setCurPage}/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}


