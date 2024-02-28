"use client"
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { useEffect, useState } from 'react';
import { getAlert, getUserInfo, getVacation } from '@/app/(pages)/commonApi';
import MainAlertList from '@/app/(pages)/calendar/MainAlertList';
import TodayAlertList from '@/app/(pages)/calendar/TodayAlertList';
import MainPopUp from '@/app/(pages)/calendar/MainPopUp';

interface UserData {
    userUuid: string;
    userName: string;
    authId: number;
    authName: string;
    deptName: string;
    deptId: number;
    userReg: string;
    vacationCnt: number;
}

interface PopupData {
    type: string;
    start: string;
    end: string;
    title: string;
}

function isDateInRange(startDate: string, endDate: string, targetDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const target = new Date(targetDate);

    return target >= start && target <= end;
}

export default function Calendar() {
    const [alerts, setAlerts] = useState<any>([]);
    const [todayAlertData, setTodayAlertData] = useState<any>([]);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [selectDate, setSelectDate] = useState<PopupData>({ type: 'date', start: '', end: '', title: '' });
    const [calendarData, setCalendarData] = useState<any>([]);
    const [userInfo, setUserInfo] = useState<UserData | any>({
        userUuid: '',
        userName: '',
        authId: 0,
        authName: '',
        deptName: '',
        deptId: 0,
        userReg: '',
        vacationCnt: 0,
    });

    useEffect(() => {
        const today = new Date();
        const targetDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
            today.getDate()
        ).padStart(2, '0')}`;
        const fetchData = async () => {
            try {
                const [userInfoRes, alertsRes, vacationRes]: any = await Promise.all([getUserInfo(), getAlert(), getVacation()]);
                setUserInfo(userInfoRes);
                setAlerts(alertsRes);

                const VacationData = vacationRes.map((data: any) => ({
                    title: `${data.userName} (${data.vacationType})`,
                    start: data.start,
                    end: addDaysToCustomFormatDate(data.end),
                    color: data.color,
                    userUuid: data.userUuid,
                    vacationId: data.vacationId,
                }));
                const todayData = vacationRes.filter((today: any) => {
                    if (isDateInRange(String(today.start), String(today.end), targetDate)) {
                        return today;
                    }
                });

                setCalendarData(VacationData);
                setTodayAlertData(todayData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [isPopupOpen]);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    function addDaysToCustomFormatDate(dateString: string) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + 1);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
            2,
            '0'
        )}`;
    }

    function incrementDay(dateString: string): string {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const isDateBeforeToday = (targetDate: string): boolean => {
        const target = new Date(targetDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return target > today;
    };

    const handleDateClick = (e: any) => {
        if (isDateBeforeToday(e.dateStr)) {
            setSelectDate({ type: 'date', start: e.dateStr, end: incrementDay(e.dateStr), title: '' });
            togglePopup();
        } else {
            setSelectDate({ type: 'alert', title: `오늘보다 이전인 날짜는 신청이 불가능합니다.`, start: '', end: '' })
            togglePopup();
        }
    };

    const handleDateSelect = (e: any) => {
        if(incrementDay(e.startStr) !== e.endStr){
            if (isDateBeforeToday(e.startStr)) {
                setSelectDate({ type: 'date', start: e.startStr, end: e.endStr, title: '' });
                togglePopup();
            } else {
                setSelectDate({ type: 'alert', title: `오늘보다 이전인 날짜는 신청이 불가능합니다.`, start: '', end: '' });
                togglePopup();
            }
        }
    };

    const handleShowView = (e: any) => {
        e.jsEvent.preventDefault();
        if (e.event.url) {
            setSelectDate({ type: `${e.event.extendedProps.description.substring(0, 3)}`, title: `${e.event.title} 입니다.`, start: '', end: '' });
            togglePopup();
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 p-3">
                    <div className="text-center pt-3 text-xl">
                        <strong>알림판</strong>
                    </div>
                    <div className="font-bold pt-5">
                        <MainAlertList items={alerts} />
                        <div className="text-center pt-3 pb-3 text-xl">
                            <strong>오늘의 일정</strong>
                        </div>
                        <TodayAlertList todayItems={todayAlertData} />
                    </div>
                </div>
                <div className="md:w-3/5">
                    <div className="font-bold p-3 pt-10 ">
                        <FullCalendar
                            dateClick={(e) => {
                                handleDateClick(e);
                            }}
                            select={(e) => {
                                handleDateSelect(e);
                            }}
                            eventClick={(e) => {
                                handleShowView(e);
                            }}
                            events={calendarData}
                            expandRows={true}
                            dayMaxEventRows={false}
                            plugins={[googleCalendarPlugin, resourceTimelinePlugin, dayGridPlugin, interactionPlugin, timeGridPlugin]}
                            headerToolbar={{
                                left: 'today,dayGridMonth,dayGridDay',
                                center: 'title',
                                end: 'prev,next',
                            }}
                            locale="ko"
                            initialView="dayGridMonth"
                            nowIndicator={true}
                            editable={false}
                            selectable={true}
                            selectMirror={true}
                            googleCalendarApiKey={process.env.NEXT_PUBLIC_API_CALENDAR_KEY}
                            eventSources={[
                                {
                                    googleCalendarId: 'ko.south_korea#holiday@group.v.calendar.google.com',
                                    backgroundColor: 'gold',
                                    textColor: 'black',
                                    editable: false,
                                },
                            ]}
                            schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                        />
                    </div>
                </div>
            </div>
            {isPopupOpen && <MainPopUp selectDate={selectDate} userInfo={userInfo} onClose={togglePopup} />}
        </div>
    );
}
