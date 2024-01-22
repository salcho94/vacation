import Form from "@/app/Form";
import Link from "next/link";


export default function None() {
    return (
        <>
            <div className="w-full md:w-1/3 mx-auto mt-40">
                <div className="flex flex-col p-5 rounded-lg shadow bg-white">
                    <div className="flex flex-col items-center text-center">
                        <div className="inline-block p-4 bg-yellow-50 rounded-full">
                            <svg className="w-12 h-12 fill-current text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/></svg>
                        </div>
                        <h2 className="mt-2 font-semibold text-gray-800">로그인 후 이용가능합니다.</h2>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">사용자 정보가 존재하지 않습니다. 로그인 후 이용해 주세요</p>
                    </div>
                    <div className="flex items-center mt-3">
                        <Link className="flex-1 text-center px-4 py-2 ml-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-md" href="/" >
                            <button>
                                로그인 하러가기
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
