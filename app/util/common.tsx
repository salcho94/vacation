
export  const getNowTime = async () => {
    const today: Date = new Date();
    const year: number = today.getFullYear();
    const month: number = today.getMonth() + 1;
    const date: number = today.getDate();
    return  `${year}년${month.toString().padStart(2, '0')}월${date.toString().padStart(2, '0')}일${today.getHours()}시${today.getMinutes()}분`
}
