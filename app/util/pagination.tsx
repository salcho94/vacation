"use client"


import * as process from "process";
interface PagenationType {
    totalPage: number;
    curPage: number;
    setCurPage: React.Dispatch<React.SetStateAction<number>>;
}
const Pagination: React.FunctionComponent<PagenationType> = ({ totalPage , curPage,setCurPage }) => {
    const total = Math.ceil(totalPage / Number(process.env.NEXT_PUBLIC_EMPLOYEE_COUNT));
    const noActive = "bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 leading-tight py-2 px-3 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
    const active = "bg-blue-50 border border-gray-300 text-blue-600 hover:bg-blue-100 hover:text-blue-700  py-2 px-3 dark:border-gray-700 dark:bg-gray-700 dark:text-white";
    const handleClick = (pageNum : number) =>{
        setCurPage(pageNum);
    }
    const moveClick = (e: React.MouseEvent<HTMLElement>,pageNum : number) =>{
        if(pageNum >= 0){
            if(total < pageNum){
                setCurPage(total);
            }else{
                setCurPage(pageNum == 0 ? 1 : pageNum);
            }
        }else{
            setCurPage(1);
            e.preventDefault();
        }

    }
    return (
        <>
            <div className="max-w-2xl mx-auto">
                <nav aria-label="Page navigation example">
                    <ul className="inline-flex -space-x-px">
                        <li>
                            <a className={noActive} onClick={(e)=>{moveClick(e,curPage - 4)}}>◀</a>
                        </li>
                        {total ?
                            [...Array(total)].map((x,index) =>{
                            let pageNum = index + 1;
                                return(
                                    ((curPage) > 3 && (pageNum > curPage - 3) && (pageNum < curPage + 3)) ?
                                    <li key={index} onClick={(e)=>{handleClick(pageNum)}}>
                                        <a className={curPage === (pageNum) ? active : noActive}>{pageNum}</a>
                                    </li> : ((pageNum <= 5) && (curPage <= 3)) &&
                                    <li key={index} onClick={(e)=>{handleClick(pageNum)}}>
                                        <a className={curPage === (pageNum) ? active : noActive}>{pageNum}</a>
                                    </li>
                                )
                            }) :
                            <li >
                                <a className={noActive}>1</a>
                            </li>
                        }
                        <li>
                            <a   className={noActive} onClick={(e)=>{moveClick(e,curPage + 5)}}>▶</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    )
}

export default Pagination;