"use client";

import {ChangeEvent, FormEvent, useState} from "react";
import axios from "axios";

interface FormData {
    userId: string;
    password: string;
}
export default function Form(){
    const [formData, setFormData] = useState<FormData>({
        userId: '',
        password: '',
    });
    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        console.log(formData.userId, formData.password);
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login',formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('서버 응답:', response.data);
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };

    return(
        <>
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                    <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
                        <h3 className="text-xl font-semibold">로그인</h3>
                        <p className="text-sm text-gray-500">
                            js company 휴가 관리 솔루션
                        </p>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
                    >
                        <div>
                            <label
                                htmlFor="userId"
                                className="block text-xs text-gray-600 uppercase"
                            >
                                아이디
                            </label>
                            <input
                                id="userId"
                                name="userId"
                                type="text"
                                placeholder="아이디를 입력해주세요."
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs text-gray-600 uppercase"
                            >
                                비밀번호
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
                        >
                            로그인
                            <span aria-live="polite" className="sr-only" role="status">
                    </span>
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}