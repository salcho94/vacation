import {NextResponse,NextRequest} from "next/server";
import { loggerMiddleware } from '../../../loggerMiddleware';
import nodemailer from 'nodemailer';


interface EmailData {
    chatId: string,
    message:  string,
    location:   string | null,
    locationIp:  string | null,
    sendTime:  string,
    sendDate:  string,
    firstYn: string,
    answerYn:  string,
    chatType:  string
};

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    // 아래 secure 옵션을 사용하려면 465 포트를 사용해야함
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.NODE_EMAIL_ID,
        pass: process.env.NODE_EMAIL_PASS,
    },
});




const  sendEmail = ({message,location,locationIp,sendDate,sendTime,chatId}: EmailData) => {
        const mailData = {
                to: process.env.NODE_EMAIL_ID,
                subject: `JS COMPANY 문의사항 입니다.`,
                from: 'admin',
                //	html 옵션 또는 text 옵션 둘중 하나만 사용해야함
                html: `
                <h1>${message}</h1>
                <div>지역 : ${location}</div>
                <div>IP : ${locationIp}</div>
                <div>보낸 시간 : ${sendDate +" "+sendTime}</div>
                </br>
                <p>브라우저 ID : ${chatId}</p>
                `,
                //	attachments 옵션으로 첨부파일도 전송 가능함
                //	attachments : [첨부파일]
        };
    return transporter.sendMail(mailData);
}

export async function POST(req: NextRequest) {
    await loggerMiddleware(req);

    const body: EmailData = await req.json();

    // 전송받은 데이터 유효성 검사
    if (!body) {
        return NextResponse.json({ message: '메일바디정보없음' });
    }

    // Nodemailer 이메일 전송 로직
    return sendEmail(body)
        .then(
            () => {
                return NextResponse.json({ message: '성공' })
            })
        .catch((error: Error) => {
            console.error(error);
            return  NextResponse.json({ message: '전송실패' });
        });

}

