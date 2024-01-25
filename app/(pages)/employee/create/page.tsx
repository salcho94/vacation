"use client"

import React, {useEffect, useState} from "react";

import axios from "axios";
import Link from "next/link";

export default function EmployeeCreate() {


    return (
        <>
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
                                            <input type="text" name="full_name" id="full_name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="로그인시 사용됩니다." value="" />
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="password">비밀번호</label>
                                            <input type="password" name="password" id="password" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="비밀번호를 입력해 주세요" value=""  />
                                        </div>
                                        <div className="md:col-span-5">
                                            <label htmlFor="passwordChk">비밀번호 확인</label>
                                            <input type="password" name="passwordChk" id="passwordChk" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="비밀번호 확인" value=""  />
                                        </div>
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
                                        <div className="md:col-span-2 ">
                                            <label >직급</label>
                                            <div className="text-gray-600">
                                                <select className="w-full text-center  h-10 bg-gray-50 flex border border-gray-200  rounded items-center mt-1">
                                                    <option >슈퍼관리자</option>
                                                    <option>팀장</option>
                                                    <option>사원</option>
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
        </>
    );
}


