import React, {useEffect, useState} from 'react';
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import {SubmitHandler, useForm} from "react-hook-form";
import {getAuthInfo, getDeptInfo, getDeptUser} from "@/app/(pages)/commonApi";


interface selectDate{
    type:string,
    start:string,
    end:string,
    title:string
}
interface userInfo{
    userId: number,
    userName: string,
    auth:number,
    authName:string,
    dept:string,
    deptId:number,
    vacation:number,
    regDate:string
}
interface MainPopUpProps {
    onClose: () => void;
    userInfo:userInfo;
    selectDate:selectDate;
}

interface vacationData {
    start: string;
    end: string;
    userUuid:string;
    upperUser:string;
    vacationType:string;
    useReason:string;
    useVacation:number;
    halfType:string;
}

interface userDept {
    authName:string
    deptName:string
    userName:string
    userUuid:string
}

const replaceViewDate =(differenceInDays:number, end: Date,selectDate:selectDate) =>{
    const year = end.getFullYear();
    const month = String(end.getMonth() + 1).padStart(2, '0');
    const day = String(end.getDate()).padStart(2, '0');
    return differenceInDays > 0 ? `${selectDate.start} ~ ${year}-${month}-${day} `: selectDate.start
}

const replaceDate =(end: Date) =>{
    const year = end.getFullYear();
    const month = String(end.getMonth() + 1).padStart(2, '0');
    const day = String(end.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
}
const MainPopUp: React.FC<MainPopUpProps> = ({ selectDate,userInfo,onClose }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<vacationData>();
    const cate = [
        {title:'연차 신청',value:'vacation',subTitle:'연차 사유'}
        ,{title:'미팅 일정',value:'meeting',subTitle:'미팅 내용'}
        ,{title:'출장 신청',value:'getter',subTitle:'출장지 정보'}
    ];
    const [useHalf , setUseHalf] = useState(false);
    const [cateGory, setCateGory] = useState(cate);
    const [cateGoryStep, setCateGoryStep] = useState(0);
    const [userDept,setUserDept] = useState<userDept[]>([{
        authName:"",
        deptName:"",
        userName:"",
        userUuid:""
    }]);
    const start : any = new Date(selectDate.start);
    const end: any = new Date(selectDate.end);
    end.setDate(end.getDate() - 1);
    const differenceInMilliseconds = Math.abs(start - end);
    const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    const useCount = (differenceInDays + 1)

    const viewDate = replaceViewDate(differenceInDays,end,selectDate);
    useEffect(() => {
        getDeptUser(userInfo.deptId,userInfo.auth).then((data :any) => {
            setUserDept(data);
        })
        // 상태 초기화 로직
        return () => {
            setUserDept([{
                authName:"",
                deptName:"",
                userName:"",
                userUuid:""
            }]);
        };
    },[userInfo.deptId,userInfo.auth])
    const onSubmitHandler: SubmitHandler<vacationData> = (data) => {
        if(!useHalf){
            data.halfType = "";
            data.useVacation = useCount;
        }else{
            data.useVacation = 0.5;
        }
        if(Number(data.useVacation) > userInfo.vacation){
            alert("연차일수가 부족합니다.");
            return false;
        }
        console.log(data);
    };

    const handleChange = (e : React.ChangeEvent<HTMLSelectElement>) =>{
        setUseHalf(false);
        if(e.target.value == 'meeting'){
            setCateGoryStep(1);
        }else if(e.target.value == 'getter'){
            setCateGoryStep(2);
        }else{
            setCateGoryStep(0);
        }
    }

    return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                {selectDate.type == 'date' ?
                <div className="bg-white rounded shadow-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-8 text-center">{cateGory[cateGoryStep].title}</h2>
                <SyntaxHighlighter language="javascript" style={nord} className="code-editor text-sm" >
                    {
                        `--${cateGory[cateGoryStep].title} 정보--`+

                        "\n"+"이름 : "+  userInfo.userName +
                        "\n"+"직급 : "+ JSON.stringify(userInfo.authName) +
                        "\n"+"부서 : "+ JSON.stringify(userInfo.dept) +
                        (cateGoryStep === 0 ? "\n"+ "나의연차일수 : " + userInfo.vacation + "\n"+"사용일수 : "+ (useHalf == true? 0.5 : useCount) : "") +
                        "\n"+"신청일 : "+ viewDate
                    }
                </SyntaxHighlighter>
                    <form  onSubmit={handleSubmit(onSubmitHandler)}>

                        <input  {...register("start")} type="hidden" defaultValue={selectDate.start}/>
                        <input  {...register("end")} type="hidden" defaultValue={replaceDate(end)}/>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="full_name" className="text-sm font-medium">결재자 {userInfo.auth === 1 && <span className="text-red-600 float-right">(슈퍼관리자는 본인이 결재 가능)</span>} </label>
                                {
                                    userInfo.auth === 1 ?
                                        <input
                                            {...register("upperUser")}
                                            type="text"
                                            className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                            defaultValue={userInfo.userName}
                                            readOnly={true}
                                        />
                                        :
                                    (userDept && userDept.length > 0) &&
                                        <select
                                            {...register("upperUser")}
                                            className="w-full text-center text-sm font-semibold h-10 bg-gray-50 flex border border-gray-200  rounded items-center mt-1"
                                        >
                                            <option>결재자를 선택해 주세요(같은부서의 상위권한.)</option>
                                            {
                                                userDept?.map((data:any,index:number) => {
                                                    return(
                                                        <option key={index}  value={`${data.userName}`} >{`${data.userName}`}
                                                            <span>
                                                                {` (${data.deptName})[${data.authName}]`}
                                                            </span>
                                                        </option>
                                                    )
                                                })
                                            }
                                        </select>

                                }
                            </div>
                            {(selectDate.start === replaceDate(end) && cateGoryStep === 0) && (
                                <div className="flex items-center text-sm font-medium">
                                    <label htmlFor="halfDay" className="mr-2">반차</label>
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 border rounded mr-2 bg-gray-50"
                                        onChange={e => {setUseHalf(!useHalf)}}
                                    />
                                    {
                                        useHalf &&
                                        <select
                                            className="w-80 h-7 bg-gray-50 border border-gray-200 rounded px-2 "
                                            {...register("halfType")}
                                        >
                                            <option>오전</option>
                                            <option>오후</option>
                                        </select>
                                    }
                                </div>
                            )}
                            <div>
                                <label htmlFor="position" className="text-sm font-medium">분류</label>
                                <select
                                    {...register("vacationType")}
                                    className="w-full text-center  h-10 bg-gray-50 flex border border-gray-200  rounded items-center mt-1"
                                    onChange={(e)=>{handleChange(e)}}
                                >
                                {
                                    cateGory?.map((data:any,index:number) => {
                                        return(
                                            <option key={index}  value={`${data.value}`}>{data.title}</option>
                                        )
                                    })

                                }
                                </select>
                            </div>
                            <div>
                                <label htmlFor="department" className="text-sm font-medium">{cateGory[cateGoryStep].subTitle}</label>
                                <input
                                    {...register("useReason")}
                                    required
                                    type="text"
                                    className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                                />
                            </div>
                        </div>
                        <div className="flex justify-between mt-4 ">
                            <button
                                onClick={onClose}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-1/4 focus:outline-none"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/4"
                            >
                                신청
                            </button>
                        </div>
                    </form>
                </div>
                :
                <>
                <div className="bg-white rounded shadow-lg p-8 max-w-md w-full">
                    <SyntaxHighlighter language="javascript" style={nord} className="code-editor text-sm" >
                        {(selectDate.type == 'alert' ? "불가능" : selectDate.type) +"\n"+ JSON.stringify(selectDate.title) }
                    </SyntaxHighlighter>
                    <button
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-700 text-center text-white font-bold py-2 px-4  w-1/4  float-right rounded focus:outline-none"
                    >
                        닫기
                    </button>
                </div>
                </>
                }
            </div>
    );
};

export default MainPopUp;
