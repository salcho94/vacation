"use client"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {DateClickArg, EventResizeDoneArg} from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import {EventClickArg} from "@fullcalendar/core";

export default function Calendar() {

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
            <div className="w-auto font-bold">
                <FullCalendar
                    plugins={[
                        googleCalendarPlugin,
                        resourceTimelinePlugin,
                        dayGridPlugin,
                        interactionPlugin,
                        timeGridPlugin,
                    ]}
                    dateClick={(e:DateClickArg)=>{handleDateClick(e)}}
                    eventResize={(e:EventResizeDoneArg)=>{handleDateSet(e)}}
                    //eventDrop={(e:EventDropArg)=>{handleDateSet(e)}}
                    eventClick={(e:EventClickArg)=>{handleShowView(e)}}
                    headerToolbar={{
                        left: 'today,dayGridMonth,dayGridDay',
                        center: 'title',
                        right: 'prev,next'
                    }}
                    locale= 'ko'
                    initialView='dayGridMonth'

                    nowIndicator={true}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    googleCalendarApiKey={ process.env.NEXT_PUBLIC_API_CALENDAR_KEY }
                    eventSources={[
                        {
                            googleCalendarId:'ko.south_korea#holiday@group.v.calendar.google.com',
                            backgroundColor:'red',
                            editable:false,
                        },
                    ]}
                    events={[
                        { title: 'event 1', start: '2024-01-16' ,end:'2024-01-18'},
                    ]}
                    schedulerLicenseKey='GPL-My-Project-Is-Open-Source'

                />
            </div>

    );
}


