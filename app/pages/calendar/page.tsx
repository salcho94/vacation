"use client"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'

import {useEffect, useState} from "react";
export default function Page() {

    const [isSaveModal,setIsSaveModal] = useState(false);
    const [isViewModal,setIsViewModal] = useState(false);
    const [viewData,setViewData] = useState({
        start:"",
        end:"",
        title:"",
        id:""
    });
    const [saveDate,setSaveDate] = useState("");
    const [data,setData] =useState([]);


    useEffect(() => {
        if(JSON.parse(localStorage.getItem("dates")|| '[]')){
            setData(JSON.parse(localStorage.getItem("dates")|| '[]'));
        }
    }, []);
    const handleDateClick = (e: any) => {
        setSaveDate(e.dateStr);
        console.log(e.dateStr);
        setIsSaveModal(true);
    }

    const handleShowView = (e:any) => {
        let startYear = e.event.start.getFullYear();
        let startMonth = Number(e.event.start.getMonth()) + 1
        let startDay = Number(e.event.start.getDate())
        let endYear = 0;
        let endMonth = 0;
        let endDay = 0;
        if(e.event.end){
            endYear =  e.event.end.getFullYear() ;
            endMonth = Number(e.event.end.getMonth()) + 1
            endDay = Number(e.event.end.getDate()) - 1
        }else{
            endYear = e.event.start.getFullYear()
            endMonth = Number(e.event.start.getMonth()) + 1
            endDay = Number(e.event.start.getDate())
        }
        viewData.start = startYear+'-'+ (startMonth < 10 ? '0'+startMonth : startMonth) +'-'+(startDay < 10 ? '0'+startDay : startDay);
        viewData.end = endYear+'-'+(endMonth < 10 ? '0'+endMonth : endMonth)+'-'+(endDay < 10 ? '0'+endDay : endDay);
        viewData.id = e.event.id;
        viewData.title = e.event.title;
        setViewData(viewData);
        setIsViewModal(true);
    }
    const handleDateSet = (e:any) =>{
        let startYear = e.event.start.getFullYear()
        let startMonth = Number(e.event.start.getMonth()) + 1
        let startDay = Number(e.event.start.getDate())
        let endYear = 0;
        let endMonth = 0;
        let endDay = 0;
        if(e.event.end){
            endYear =  e.event.end.getFullYear() ;
            endMonth = Number(e.event.end.getMonth()) + 1
            endDay = Number(e.event.end.getDate())
        }else{
            endYear = e.event.start.getFullYear()
            endMonth = Number(e.event.start.getMonth()) + 1
            endDay = Number(e.event.start.getDate())
        }
        let copy = JSON.parse(localStorage.getItem("dates") || '[]');

        copy.filter((findData:any) =>{
            if(findData.title == e.event.title && findData.id == e.event.id){
                findData.start = startYear+'-'+ (startMonth < 10 ? '0'+startMonth : startMonth) +'-'+(startDay < 10 ? '0'+startDay : startDay);
                findData.end = endYear+'-'+(endMonth < 10 ? '0'+endMonth : endMonth)+'-'+(endDay < 10 ? '0'+endDay : endDay);
            }
            return findData
        })

        localStorage.setItem("dates", JSON.stringify(copy))

    }
    return (
        <>
            <div className="w-auto">
                <FullCalendar
                    plugins={[
                        resourceTimelinePlugin,
                        dayGridPlugin,
                        interactionPlugin,
                        timeGridPlugin
                    ]}
                    dateClick={(e)=>{handleDateClick(e)}}
                    eventResize={(e)=>{handleDateSet(e)}}
                    eventDrop={(e)=>{handleDateSet(e)}}
                    eventClick={(e)=>{handleShowView(e)}}
                    eventLongPressDelay={1000}
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
                    events={[
                        { title: 'event 1', date: '2024-01-16' },
                        { title: 'event 2', date: '2024-01-16' }
                    ]}
                    schedulerLicenseKey='GPL-My-Project-Is-Open-Source'
                    //events={data}
                />

            </div>
        </>
    );
}


