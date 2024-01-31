"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter  } from "next/navigation";
import axios from "axios";
import {Cookies} from "react-cookie";

const cookies = new Cookies();
interface loginData {
    userName: string;
    password: string;
}
export default function Form(){
    const router = useRouter ();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<loginData>();

    const onSubmitHandler: SubmitHandler<loginData> = (data) => {
        axios
            .post("/api/auth/login", data)
            .then((response) => {
                const { accessToken ,success,errormessage} = response.data;
                if(success){
                    cookies.set("token", accessToken, {
                        path: "/",
                        secure: false,
                        sameSite: "lax",
                    });
                    router.replace("/calendar");
                }else{
                    alert(errormessage);
                }
            })
            .catch((error) => {
                alert("비밀번호가 올바르지 않습니다");
            });
    };



    return(
        <>
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                    <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
                        <h3 className="text-xl font-semibold">로그인</h3>
                        <p className="text-sm text-red-950 ">
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