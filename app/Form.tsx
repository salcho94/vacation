"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter  } from "next/navigation";
import axios from "axios";
import {Cookies} from "react-cookie";
import Link from "next/link";
//쿠키사용을위해 선언
const cookies = new Cookies();
interface FormData {
    userName: string;
    password: string;
}
export default function Form(){
    const router = useRouter ();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

    const onSubmitHandler: SubmitHandler<FormData> = (data) => {
        const userName = data.userName;
        const base64Pw = btoa(data.password);
        const newFormData = {
            userName: userName,
            password: base64Pw,
        };
        /**
         * axios를 사용하여 로그인 정보를 담아 POST 한다.
         * 이 후 응답 받은 accessToken을 cookie에 저장한다.
         * 그리고 comment 컴포넌트를 출력할 수 있도록 replace 한다.
         */
        axios
            .post("/api/auth/login", newFormData)
            .then((response) => {
                const { accessToken ,success,errormessage} = response.data;
                if(success){
                    cookies.set("token", accessToken, {
                        path: "/",
                        secure: true,
                        sameSite: "none",
                    });
                    console.log(success)
                    router.replace("/pages/calendar");
                }else{
                    alert(errormessage);
                }
            })
            .catch((error) => {
                alert("아이디 또는 비밀번호를 확인해주세요.");
            });
    };



    return(
        <>
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                    <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
                        <h3 className="text-xl font-semibold">로그인</h3>
                        <p className="text-sm text-gray-500">
                            js company 근태관리 솔루션
                        </p>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmitHandler)}
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
                                {...register("userName")}
                                id="userName"
                                name="userName"
                                type="text"
                                placeholder="아이디를 입력해주세요."
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
                                {...register("password")}
                                id="password"
                                name="password"
                                type="password"
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