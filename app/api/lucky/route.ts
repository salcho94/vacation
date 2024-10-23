import { NextResponse } from 'next/server';
import nodeHtmlToImage from 'node-html-to-image';
import {pool} from "@/app/api/db.config";

export async function GET() {
    const luckyOne = await getLucky();

    if (!luckyOne || luckyOne.length === 0) {
        return NextResponse.json({ error: '운세를 가져오는 데 실패했습니다.' });
    }
    console.log(luckyOne);
    try {
        // 현재 날짜와 시간 가져오기
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        // 파일 이름 형식 생성
        const filename = `${year}년${month}월${day}일 ${hours}시${minutes}분`;

        console.log(String(luckyOne[0]?.lucky))
        const imageBuffer = await nodeHtmlToImage({
            html: `<html>
                    <head>
                        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
                    </head>
                    <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; height:100vh; background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);">
                      <div style="
                        width: 600px; 
                        height: 400px; 
                        padding: 20px; 
                        background: rgba(255, 255, 255, 0.95); 
                        border: none;
                        border-radius: 30px;
                        box-shadow: 
                          0 20px 60px rgba(0, 0, 0, 0.1),
                          0 0 40px rgba(253, 160, 133, 0.2) inset;
                        text-align: center;
                        position: relative;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                      ">
                        <!-- 장식용 원형 요소들 -->
                        <div style="
                          position: absolute;
                          width: 200px;
                          height: 200px;
                          border-radius: 50%;
                          background: linear-gradient(45deg, #ffd700, #ffa500);
                          opacity: 0.1;
                          top: -100px;
                          right: -100px;
                          animation: float 6s ease-in-out infinite;
                        "></div>
                        <div style="
                          position: absolute;
                          width: 150px;
                          height: 150px;
                          border-radius: 50%;
                          background: linear-gradient(45deg, #ff6b6b, #ffd700);
                          opacity: 0.1;
                          bottom: -75px;
                          left: -75px;
                          animation: float 8s ease-in-out infinite reverse;
                        "></div>
                        
                        <!-- 메인 콘텐츠 -->
                        <div style="
                          font-family: 'Noto Sans KR', sans-serif;
                          position: relative;
                          z-index: 2;
                          padding: 20px;
                        ">
                          <h2 style="
                            font-size: 24px;
                            color: #ff6b6b;
                            margin-bottom: 20px;
                            font-weight: 700;
                            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                            animation: slideDown 1s ease-out;
                          ">
                            미래를 확인한 시간 <br/> ${filename}
                          </h2>
                          <h2 style="
                            font-size: 24px;
                            color: #ff6b6b;
                            margin-bottom: 20px;
                            font-weight: 700;
                            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                            animation: slideDown 1s ease-out;
                          ">
                            오늘의 운세
                          </h2>
                          <h1 style="
                            font-size: 36px;
                            background: linear-gradient(45deg, #ff6b6b, #ffd700);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            font-weight: bold;
                            margin: 0;
                            line-height: 1.4;
                            animation: fadeIn 1.5s ease-out;
                          ">
                            ${String(luckyOne[0]?.lucky)}
                          </h1>
                          <div style="
                            margin-top: 30px;
                            font-size: 16px;
                            color: #666;
                            line-height: 1.6;
                            animation: fadeIn 2s ease-out;
                          ">
                            ${String(luckyOne[0]?.lucky_detail)}
                          </div>
                        </div>
                      </div>
                    </body>
                    <style>
                      @keyframes fadeIn {
                        0% { opacity: 0; transform: translateY(20px); }
                        100% { opacity: 1; transform: translateY(0); }
                      }
                      @keyframes slideDown {
                        0% { opacity: 0; transform: translateY(-20px); }
                        100% { opacity: 1; transform: translateY(0); }
                      }
                      @keyframes float {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(10deg); }
                      }
                    </style>
                  </html>`,
            type: 'png',
        });

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Content-Disposition': `attachment; filename="lucky.png"`, // 파일 이름 적용
            },
        });
    } catch (error) {
        console.error('이미지 생성 실패:', error);
        return NextResponse.json({ error: '이미지 생성 실패' });
    }
}



const getLucky = async () => {
    const conn = await pool.getConnection();
    let result = "";
    let query = "";
    query =  `SELECT * FROM luckys
              ORDER BY RAND()
              LIMIT 1`
    try{
        result = await conn.query(query);
    }catch{
        console.log("db 연결 실패 경로 : /api/employee  getEmployeeList 요청");
    }finally {
        await conn.release();
    }

    return result;
}