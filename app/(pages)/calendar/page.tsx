"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {DateClickArg, EventResizeDoneArg} from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import {EventClickArg} from "@fullcalendar/core";
import MainAlertList from "@/app/(pages)/calendar/MainAlertList";
import {useEffect, useState} from "react";
import {getAlert} from "@/app/(pages)/commonApi";

export default function Calendar() {
    const [alerts , setAlerts] = useState([]);

    useEffect(()=>{
       getAlert().then((res:any)=> {
           setAlerts(res);
       });
    },[])
    const handleDateClick = (e: DateClickArg) => {
        console.log(e.dateStr);
    }

    const handleShowView = (e: EventClickArg) => {
        e.jsEvent.preventDefault();
        if (e.event.url) {
            console.log(e)
            alert(`${e.event.title} 입니다!`)
            return false;
        }

    }
    const handleDateSet = (e:EventResizeDoneArg) =>{
        console.log(e);

    }
    return (
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
                            dateClick={(e: DateClickArg) => { handleDateClick(e) }}
                            eventResize={(e: EventResizeDoneArg) => { handleDateSet(e) }}
                            eventClick={(e: EventClickArg) => { handleShowView(e) }}
                            headerToolbar={{
                                left: 'today,dayGridMonth,dayGridDay',
                                center: 'title',
                                right: 'prev,next'
                            }}
                            locale='ko'
                            initialView='dayGridMonth'
                            nowIndicator={true}
                            editable={true}
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
    );
}


