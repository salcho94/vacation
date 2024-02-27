import React from 'react';
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism';


interface TodayList {
    color:string;
    end:string;
    start:string;
    userName:string;
    vacationId:number;
    vacationType:string;
}

interface Props {
    todayItems: TodayList[];
}

const TodayAlertList: React.FC<Props> = ({ todayItems }) => { // 수정된 부분: 매개변수명 변경
    return (
        <div className="overflow-y-scroll max-h-96  border-indigo-950 border-2 rounded-1xl">
            {todayItems.map((today, index) => (
                <div key={index}>
                    <SyntaxHighlighter language="javascript" style={nord} className="code-editor text-sm" >
                        {
                            "기간 : "+ (today.start == today.end ? today.start : today.start + " ~ " +today.end)  + "\n"
                            + `오늘은 (${today.userName})님의 ${today.vacationType} 일정이 존재합니다.`
                        }
                    </SyntaxHighlighter>
                </div>
            ))}
        </div>
    );
};

export default TodayAlertList;
