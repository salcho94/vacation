import React, { useEffect, useState } from 'react';
import { v4 as uuid_v4 } from "uuid";
import { Cookies } from "react-cookie";
import axios from "axios";

interface ChatProps {
    setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isChatOpen: boolean;
}

const Chat: React.FC<ChatProps> = ({ setIsChatOpen, isChatOpen }) => {
    const handleClose = () => {
        setIsChatOpen(false);
    };

    const cookies = new Cookies();
    const chatId = cookies.get('chatId');
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [adminAnswerId, setAdminAnswerId] = useState("");

    useEffect(() => {
        if (chatId && !isAdminMode) {
            const interval = setInterval(async () => {
                await getMessages(chatId,'user');
            }, 2000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [chatId, isAdminMode]);

    const getMessages = async (chatId: string,mode:string) => {
        try {
            const response = await axios.get("/api/chat", {
                params: { "chatId": chatId,"mode":mode }
            });
            if(mode === 'user'){
                setMessages(response.data);
            }else{
                setMessages(response.data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            alert("Error fetching messages");
        }
    };

    const getCurrentDateTime = (mode: string) => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const date = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        const nowTime = `${hours}시${minutes}분`;
        const nowDay = `${year}-${month}-${date}`;
        return mode === 'time' ? nowTime : nowDay;
    };

    const getLocation = async (mode: string) => {
        try {
            const res = await axios.get('https://geolocation-db.com/json/');
            if (mode === 'location') {
                const city = res.data.city ? res.data.city : '';
                return res.data.country_name + city;
            } else {
                return res.data.IPv4;
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            return null;
        }
    };

    async function createChatData(chatId: string, message: string, firstYn: string, answerYn: string, chatType: string) {
        const location = await getLocation('location');
        const locationIp = await getLocation('ip');
        const sendTime = getCurrentDateTime('time');
        const sendDate = getCurrentDateTime('date');

        const chatData = {
            chatId: String(chatId),
            message: String(message),
            location: String(location),
            locationIp: String(locationIp),
            sendTime: String(sendTime),
            sendDate: String(sendDate),
            firstYn: String(firstYn),
            answerYn: String(answerYn),
            chatType: String(chatType)
        };
        return chatData;
    }

    const insertMessage = async (data: any) => {
        try {
            const response = await axios.post("/api/chat", data);
            if (response.data < 1) {
                alert("메시지 전송에 실패하였습니다.");
            }
        } catch (error) {
            console.error("Error inserting message:", error);
            alert("Error inserting message");
        }
    };

    const handleMessageSend = async () => {
        setIsLoading(true);
        if (!message) {
            alert('메시지를 입력해주세요');
            setIsLoading(false);
            return false;
        }
        if (message === '김지섭관리자') {
            setIsAdminMode(true);
            setIsLoading(false);
            setMessages([]);
            setMessage('');
            await getMessages(chatId,'admin');
            return false;
        }
        if (!isAdminMode) {
            if (!chatId) {
                try {
                    const uuid: string = uuid_v4();
                    cookies.set("chatId", uuid, {
                        path: "/",
                        secure: false,
                        sameSite: "lax",
                    });
                    if (uuid) {
                        const chatData = await createChatData(uuid, message, 'Y', 'N', 'user');
                        await insertMessage(chatData);
                        await getMessages(uuid,'user');
                    }
                } catch (e) {
                    console.error(e + 'chatId 생성 오류');
                    setIsLoading(false);
                }
            } else {
                try {
                    const chatData = await createChatData(chatId, message, 'Y', 'N', 'user');
                    await insertMessage(chatData);
                    await getMessages(chatId,'user');
                } catch (e) {
                    console.error(e + '추가 대화 생성 오류');
                    setIsLoading(false);
                }
            }
        } else {
            if(adminAnswerId){
                const chatData = await createChatData(adminAnswerId, message, 'N', 'Y', 'admin');
                await insertMessage(chatData);
                await getMessages(adminAnswerId,'user');
            }else{
                alert('답변하실 항목을 먼저 선택해 주세요');
                setIsLoading(false);
                return false;
            }
        }

        setIsLoading(false);
        setMessage('');
    };

    const handleKeyPress = async (event: any) => {
        if (event.key === 'Enter') {
            await handleMessageSend();
        }
    };
    const answerChat = async (chatId: string) => {
        setAdminAnswerId(chatId);
        await getMessages(chatId,'user');
    }
    return (
        <div className="fixed bottom-0 right-0 w-full md:w-1/3 max-w-md bg-white border-l border-r border-b rounded-t-xl">
            <div className="flex justify-between items-center bg-gray-100 rounded-t-xl p-2">
                <span className="font-bold text-lg">문의하기</span>
                <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M6.707 6.293a1 1 0 011.414 0L10 8.586l2.879-2.88a1 1 0 111.415 1.415L11.414 10l2.88 2.879a1 1 0 11-1.415 1.415L10 11.414l-2.879 2.88a1 1 0 01-1.414-1.415L8.586 10 5.707 7.121a1 1 0 010-1.414z"/>
                    </svg>
                </button>
            </div>
            <div className="p-4 h-64 overflow-y-auto">
                <div className="flex flex-col mb-4">
                    <div className="flex items-center mb-2">
                        <div className="w-15 h-10 leading-10 rounded-full bg-gray-300 mr-3 pl-1 pr-1 text-xs font-bold">관리자</div>
                        <div className="bg-gray-200 rounded-lg p-2 text-sm ">
                            {!isAdminMode ? '궁금한점이 있으시면 문의를 남겨주세요.' : '답변을 기다리는 유저 목록입니다.'}
                        </div>
                    </div>
                    { isAdminMode &&
                    <div className="flex justify-center">
                        <div className="text-center w-3/4 rounded-full bg-red-500 text-white">
                           답변할 문항을 선택해 주세요
                        </div>
                    </div>
                    }

                    {(messages.length > 0 && !isLoading) ? messages.map((msg: any, index: number) => {
                        const nowDay = msg.sendDate;
                        const previousDay = index > 0 ? messages[index - 1].sendDate : null;
                        const showDate = previousDay !== nowDay;

                        return (
                            <div key={index}>
                                <div className="w-full">
                                    {
                                        ((showDate || index === 0) && !isAdminMode) && (
                                        <div className="flex justify-center">
                                            <div className="text-center w-2/4 rounded-full bg-red-500 text-white">
                                                {nowDay}
                                            </div>
                                        </div>
                                    )
                                    }
                                </div>
                                <div>
                                    { (msg.chatType === 'admin' && !isAdminMode) &&
                                        <div className="flex items-center mb-2">
                                            <div className="w-15 h-10 leading-10 rounded-full bg-gray-300 mr-3 pl-1 pr-1 text-xs font-bold">관리자</div>
                                            <div className="bg-gray-200 rounded-lg p-2 text-sm ">
                                                {msg.message}
                                            </div>
                                        </div>
                                    }
                                    {
                                        (msg.chatType === 'user' && !isAdminMode)  &&
                                            <div className="flex items-center justify-end mb-2">
                                                <div className="text-xs bg-gray-200 rounded-lg mr-1">
                                                    {msg.sendTime}
                                                </div>
                                                <div className="bg-blue-500 rounded-lg text-sm p-2 text-white">
                                                    {msg.message}
                                                </div>
                                            </div>
                                    }
                                    { (msg.chatType === 'admin' && isAdminMode) &&
                                        <div className="flex items-center mb-2">
                                            <div className="w-15 h-10 leading-10 rounded-full bg-gray-300 mr-3 pl-1 pr-1 text-xs font-bold">관리자</div>
                                            <div className="bg-gray-200 rounded-lg p-2 text-sm ">
                                                {msg.message}
                                            </div>
                                        </div>
                                    }
                                    {
                                        (msg.chatType === 'user' && isAdminMode)  &&
                                        <div className="flex items-center justify-end mb-2">
                                            <div className="text-xs bg-gray-200 rounded-lg mr-1">
                                                {msg.sendDate +" "+  msg.sendTime}
                                            </div>
                                            <div className="bg-blue-500 rounded-lg text-sm p-2 text-white cursor-pointer"  onClick={(e)=>{answerChat(msg.chatId)}}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    }):
                        <div>
                            <strong>{messages.length > 0 ? "loading..." : "대화를 시작해 주세요"}</strong>
                        </div>
                    }
                </div>
            </div>
            <div className="p-2 border-t flex">
                <input type="text" value={message} onKeyDown={(e: any) => { handleKeyPress(e) }} onChange={(e) => setMessage(e.target.value)} placeholder="메시지 입력" className="w-80 border rounded-md p-2 focus:outline-none" />
                <button onClick={handleMessageSend} className="bg-fuchsia-500 w-20 text-white px-4 py-2 rounded-md ml-2 hover:bg-fuchsia-600">전송</button>
            </div>
        </div>
    );
};

const Page: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            {!isChatOpen &&
                <div className="fixed bottom-4 right-4 z-10">
                    <button onClick={toggleChat} className="bg-fuchsia-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-fuchsia-600">
                        문의하기
                    </button>
                </div>
            }

            {isChatOpen && <Chat isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />}
        </>
    );
};

export default Page;
