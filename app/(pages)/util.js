import axios from "axios";


export const pathInit = (paths,pathStep) =>{
    const array  = new Array(paths.length);
    for(let i in paths){
        if(paths[i] === pathStep){
            array[i] = true;
        }else{
            array[i] = false;
        }
    }
    return array;
}

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