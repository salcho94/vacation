"use client"

import React, {useEffect, useState} from "react";
import Pagination from "@/app/util/pagination";
import axios from "axios";
import Link from "next/link";

export default function EmployeeList() {


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
                                        className="float-left rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2"
                                        id="search" type="text" placeholder="직원 이름을 입력해 주세요"/>
                                    <button className="float-right  text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        검색
                                    </button>
                                </div>
                            </div>
                            <div className="py-3 text-sm">
                                <div className="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                                    <span className="bg-gray-400 h-2 w-2 m-2 rounded-full"></span>
                                    <div className="flex-grow font-medium px-2">김지섭</div>
                                    <div className="text-sm font-normal text-gray-500 tracking-wide">슈퍼관리자</div>
                                </div>
                                <div className="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                                    <span className="bg-green-400 h-2 w-2 m-2 rounded-full"></span>
                                    <div className="flex-grow font-medium px-2">오월이</div>
                                    <div className="text-sm font-normal text-gray-500 tracking-wide">팀장</div>
                                </div>
                                <div className="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                                    <span className="bg-green-400 h-2 w-2 m-2 rounded-full"></span>
                                    <div className="flex-grow font-medium px-2">오월이</div>
                                    <div className="text-sm font-normal text-gray-500 tracking-wide">팀장</div>
                                </div>
                                <div className="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                                    <span className="bg-green-400 h-2 w-2 m-2 rounded-full"></span>
                                    <div className="flex-grow font-medium px-2">오월이</div>
                                    <div className="text-sm font-normal text-gray-500 tracking-wide">팀장</div>
                                </div>
                                <div className="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                                    <span className="bg-green-400 h-2 w-2 m-2 rounded-full"></span>
                                    <div className="flex-grow font-medium px-2">오월이</div>
                                    <div className="text-sm font-normal text-gray-500 tracking-wide">팀장</div>
                                </div>
                                <div className="text-center">
                                    <Pagination/>
                                </div>
                            </div>

                        </div>
                    </div>
            </div>
        </>
    );
}


