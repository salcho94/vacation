import React from 'react';
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ListItem {
    alertId: number,
    userName: string,
    cate: string,
    title: string,
    regDate: string,
    link: string
}

interface Props {
    items: ListItem[];
}

const MainAlertList: React.FC<Props> = ({ items }) => {
    return (
        <div className="overflow-y-scroll max-h-96  border-indigo-950 border-2 rounded-1xl">
            <ul className="list-disc pl-4">
                {items.map((item, index) => (
                    <li key={index} className="py-1 list-none pr-3 ">
                        <SyntaxHighlighter language="javascript" style={nord} className="code-editor text-sm" >
                            {index+1 + "." + JSON.stringify(item.title) + "\n" +`(${item.cate}) `  + new Date(item.regDate).toLocaleString()}
                        </SyntaxHighlighter>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MainAlertList;