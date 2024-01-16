import axios from "axios";
import {redirect} from "next/navigation";


export const getUserInfo = () =>{
    return new Promise(function(resolve, reject) {
        axios.get('/api/user')
            .then(function (response) {
                resolve(response.data);
            })
    });
}

export const logOut = () =>{
    axios.get('/api/auth/logout')
        .then(function (response) {
            // 성공 핸들링
            console.log(response);
            if(response){
                window.location.href ="/";
            }
        })
        .catch(function (error) {
            // 에러 핸들링
            console.log(error);
        })
        .finally(function () {
            // 항상 실행되는 영역
        });
}