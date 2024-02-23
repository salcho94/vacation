"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import {EventClickArg} from "@fullcalendar/core";
import MainAlertList from "@/app/(pages)/calendar/MainAlertList";
import {useEffect, useState} from "react";
import {getAlert, getUserInfo} from "@/app/(pages)/commonApi";
import MainPopUp from "@/app/(pages)/calendar/MainPopUp";

export default function Calendar() {
    const [alerts , setAlerts] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectDate, setSelectDate] = useState({type:"date",start:"",end:"",title:""});
    const [userInfo,setUserInfo] = useState<any>( {userId: 0,
        userName: "",
        auth:"",
        authName:"",
        dept:"",
        regDate:""})

    useEffect(() => {
        getUserInfo().then(res => {setUserInfo(res)});
        getAlert().then((res:any)=> {
            setAlerts(res);
        });
    },[])

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };


    function isDateBeforeToday(targetDate: string): boolean {
        const target = new Date(targetDate);
        // 오늘 날짜를 구합니다.
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00 으로 설정합니다.
        // targetDate가 오늘 날짜보다 이전인지 확인합니다.
        return target > today;
    }
    const handleDateClick = (e: any) => {
        if(isDateBeforeToday(e.startStr)){
            setSelectDate({type:"date",start:e.startStr,end:e.endStr,title:""});
            togglePopup();
        }else{
            setSelectDate({type:"alert",title:`오늘보다 이전인 날짜는 신청이 불가능합니다.`,start:"",end:""});
            togglePopup();
        }


    }

    const handleShowView = (e: EventClickArg) => {
        e.jsEvent.preventDefault();
        if (e.event.url) {
            setSelectDate({type:`${e.event.extendedProps.description.substring(0,3)}`,title: `${e.event.title} 입니다.`,start:"",end:""});
            togglePopup();
        }

    }

    return (
        <>
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 p-3 ">
                        <div className="text-center pt-10 text-xl "><strong>알림판</strong></div>
                        <div className="font-bold pt-10">
                            <MainAlertList items={alerts}/>
                        </div>
                    </div>
                    <div className="md:w-3/5">
                        <div className="font-bold p-3 pt-10">
                            <FullCalendar
                                plugins={[
                                    googleCalendarPlugin,
                                    resourceTimelinePlugin,
                                    dayGridPlugin,
                                    interactionPlugin,
                                    timeGridPlugin,
                                ]}
                                select={(e: any) => { handleDateClick(e)}}
                                eventClick={(e: EventClickArg) => { handleShowView(e) }}
                                headerToolbar={{
                                    left: 'today,dayGridMonth,dayGridDay',
                                    center: 'title',
                                    right: 'prev,next'
                                }}
                                locale='ko'
                                initialView='dayGridMonth'
                                nowIndicator={true}
                                editable={false}
                                selectable={true}
                                selectMirror={true}
                                googleCalendarApiKey={process.env.NEXT_PUBLIC_API_CALENDAR_KEY}
                                eventSources={[
                                    {
                                        googleCalendarId: 'ko.south_korea#holiday@group.v.calendar.google.com',
                                        backgroundColor: 'red',
                                        editable: false,
                                    },
                                ]}
                                events={[
                                    { title: 'event 1', start: '2024-01-16', end: '2024-01-18' },
                                ]}
                                schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isPopupOpen && <MainPopUp selectDate={selectDate} userInfo={userInfo} onClose={togglePopup} />}
        </>
    );
}


