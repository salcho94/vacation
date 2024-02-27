import axios from "axios";


export  const  getDeptInfo = async  () => {
    return new Promise(function(resolve, reject) {
        axios.get('/api/user/dept')
            .then(function (response) {
              resolve(response.data);
            })
    });
}

export  const  getDeptUser = async  (deptId:number,authId:number) => {
    return new Promise(function(resolve, reject) {
        axios.get('/api/auth/dept',{
            params:
                {
                     deptId:deptId
                    ,authId:authId
                }
        })
            .then(function (response) {
                resolve(response.data);
            })
    });
}

export  const getAuthInfo = async () => {
    return new Promise(function(resolve, reject) {
        axios.get('/api/user/auth')
            .then(function (response) {
                return  resolve(response.data);
            })
    });
}
export const pathInit = (paths:string[],pathStep:string) =>{
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

export const getUserInfo = async () =>{
    return new Promise(function(resolve, reject) {
        axios.get('/api/user')
            .then(function (response) {
                resolve(response.data);
            })
    });
}

export const getUserDetail = async (uuid:string) =>{
    return new Promise(function(resolve, reject) {
        axios.get('/api/employee/view',{
            params:{ "uuid": uuid}
        })
            .then(function (response) {
                resolve(response.data);
            })
    });
}


export const getAlert = async () =>{
    return new Promise(function(resolve, reject) {
        axios.get('/api/alert')
            .then(function (response) {
                resolve(response.data);
            })
    });
}

export const getVacation = async () => {
    return new Promise(function(resolve, reject) {
        axios.get('/api/calendar')
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


export const DELETE = (url:string,msg:string,uuid:string) => {
    if(window.confirm(msg)){
        axios.post(`/api/${url}`,{uuid : uuid})
            .then(function (response) {
                // 성공 핸들링
                if(response.data){
                    alert('삭제가 완료되었습니다.');
                    window.location.href = "/employee/list";
                }else{
                    console.log('삭제 실패')
                }
            })
            .catch(function (error) {
                // 에러 핸들링
                console.log("직원 삭제 실패함"+error);
            })

    }

}

export const UPDATE = (url:string,msg:string,body:any) => {
    if (window.confirm(msg)) {
        axios.post(`/api/${url}`, body)
            .then(function (response) {
                // 성공 핸들링
                if (response.data) {
                    alert('수정이 완료되었습니다.');
                    window.location.reload();
                } else {
                    console.log('수정 실패')
                }
            })
            .catch(function (error) {
                // 에러 핸들링
                console.log("직원 수정 실패함" + error);
            })
    }
}