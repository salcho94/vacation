"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'
import googleCalendarPlugin from '@fullcalendar/google-calendar';

import {disableCursor} from "@fullcalendar/core/internal";
import {Simulate} from "react-dom/test-utils";
import click = Simulate.click;

export default function Page() {




    const handleDateClick = (e: any) => {

    }

    const handleShowView = (e:any) => {
        e.jsEvent.preventDefault();
        if (e.event.url) {
            console.log(e)
            alert(`${e.event.title} 입니다!`)
            return false;
        }

    }
    const handleDateSet = (e:any) =>{


    }
    return (
            <div className="w-auto font-bold">
                <FullCalendar
                    plugins={[
                        googleCalendarPlugin,
                        resourceTimelinePlugin,
                        dayGridPlugin,
                        interactionPlugin,
                        timeGridPlugin,
                    ]}
                    dateClick={(e)=>{handleDateClick(e)}}
                    eventResize={(e)=>{handleDateSet(e)}}
                    eventDrop={(e)=>{handleDateSet(e)}}
                    eventClick={(e)=>{handleShowView(e)}}
                    headerToolbar={{
                        left: 'today,dayGridMonth,dayGridDay',
                        center: 'title',
                        right: 'prev,next'
                    }}
                    locale= 'ko'
                    initialView='dayGridMonth'

                    nowIndicator={true}
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    googleCalendarApiKey={ process.env.NEXT_PUBLIC_API_CALENDAR_KEY }
                    eventSources={[
                        {
                            googleCalendarId:'ko.south_korea#holiday@group.v.calendar.google.com',
                            backgroundColor:'red',
                        },
                    ]}
                    events={[
                        { title: 'event 1', date: '2024-01-16' },
                    ]}
                    schedulerLicenseKey='GPL-My-Project-Is-Open-Source'

                />
            </div>

    );
}


