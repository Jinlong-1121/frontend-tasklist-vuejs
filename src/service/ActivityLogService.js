// const contextPath = import.meta.env.BASE_URL;
// import AuthService from '@/service/AuthService';
import {activityLogModul} from '@/service/ConstantaService';

const contextPath = activityLogModul;

// const contextPath = "http://localhost:6060/";
// const contextPath = "http://192.168.10.20:6061/";
// const contextPath = "https://lebihamandisini.id/admin/";
// const authService = new AuthService();

export default class SchedulerService {
    async postActivityLog(params) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        
        try {
            const response = await fetch(contextPath + `api/v1/activity-log`, requestOptions);
            // if (!response.ok) {
            //     // console.log(response);
            //     authService.authLogout();
            //     // throw new Error(`Error! status: ${response.status}`);
            // }
            const result = await response.json();
            // console.log(result);
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async postActivityLogLogin(params) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        
        try {
            const response = await fetch(contextPath + `api/v1/activity-log-login`, requestOptions);
            // if (!response.ok) {
            //     // console.log(response);
            //     authService.authLogout();
            //     // throw new Error(`Error! status: ${response.status}`);
            // }
            const result = await response.json();
            // console.log(result);
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getActivityLogLogin(id) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders,
        };
        
        try {
            const response = await fetch(contextPath + `api/v1/activity-log-login/` + id, requestOptions);
            // if (!response.ok) {
            //     // console.log(response);
            //     authService.authLogout();
            //     // throw new Error(`Error! status: ${response.status}`);
            // }
            const result = await response.json();
            // console.log(result);
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
}
