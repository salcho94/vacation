"use client"

import React, {useEffect, useState} from "react";

import axios from "axios";
import Link from "next/link";
import Pagination from "@/app/util/pagination";

export default function VacationList() {
    return (
        <>
            <div className="p-12 w-full bg-gray-100 flex items-center justify-center">
                <div className="w-full">
                    <div className="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
                        <div className="block text-gray-700 text-lg font-semibold py-2 px-2">
                            연차 사용 이력
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
                            <section className="py-1 bg-blueGray-50">
                                <div className="w-full">
                                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white ">
                                        <div className="block w-full overflow-x-auto">
                                            <table className="items-center w-full border-collapse text-blueGray-700  ">
                                                <thead className="thead-light ">
                                                <tr>
                                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                        이름
                                                    </th>
                                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                        시작일
                                                    </th>
                                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                        종료일
                                                    </th>
                                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                        사용연차
                                                    </th>
                                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                        잔여연차
                                                    </th>
                                                    <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                        사용량
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {[1,2,3,4,5].map(x => {
                                                    return (
                                                        <>
                                                            <tr>
                                                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                                                                    오월이
                                                                </th>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                                                                    2024-01-25
                                                                </td>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                                                                    2024-01-25
                                                                </td>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                                                                    1
                                                                </td>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                                                                    10
                                                                </td>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                    <div className="flex items-center">
                                                                        <span className="mr-2">60%</span>
                                                                        <div className="relative w-full">
                                                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                                                                                <div style={{width:"60%"}} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )
                                                })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>


                            </section>
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


