// const contextPath = import.meta.env.BASE_URL;
// import AuthService from '@/service/AuthService';
import {userModul} from '@/service/ConstantaService';

const contextPath = userModul;
// const contextPath = "http://192.168.3.249:6063/";
// const contextPath = "http://192.168.3.249:6063/";
// const contextPath = "http://192.168.10.20:6061/";
// const contextPath = "https://lebihamandisini.id/admin/";
// const authService = new AuthService();

export default class PrivilegeService {
    // GET 
    async getList(params) {
        // const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", "Bearer 12345qwerty");
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        
        try {
            const response = await fetch(contextPath + `api/v1/privileges?limit=10&page=${params.page}&divisi=${params.divisi}`, requestOptions);
            const result = await response.json();
            console.log(result);
            return result.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    async saveListData(params) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        try {
            const response = await fetch(contextPath + 'api/v1/privilege', requestOptions);
            const result = await response.json();
            console.log(result);
            return result.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    // async updateListData(params, id) {
    //     const myHeaders = new Headers();
    //     // myHeaders.append("Authorization", token);
    //     myHeaders.append("Content-Type", "application/json");

    //     const requestOptions = {
    //         method: 'PUT',
    //         mode: 'cors',
    //         headers: myHeaders,
    //         body: JSON.stringify(params)
    //     };
    //     try {
    //         const response = await fetch(contextPath + 'api/v1/privilege/'+ id, requestOptions);
    //         const result = await response.json();
    //         console.log(result);
    //         return result.data;
    //     } catch (error) {
    //         console.log(error, "errornya");
    //     }
    // }

    // async runPrivilege() {
    //     const myHeaders = new Headers();
    //     // myHeaders.append("Authorization", token);
    //     myHeaders.append("Content-Type", "application/json");

    //     const requestOptions = {
    //         method: 'POST',
    //         mode: 'cors',
    //         headers: myHeaders
    //     };
    //     try {
    //         const response = await fetch(contextPath + 'api/v1/privilege', requestOptions);
    //         const result = await response.json();
    //         console.log(result);
    //         return result.data;
    //     } catch (error) {
    //         console.log(error, "errornya");
    //     }
    // }

    // async sendEmailAbsen(params) {
    //     const token = localStorage.getItem('login');
    //     const myHeaders = new Headers();
    //     myHeaders.append("Authorization", token);
    //     myHeaders.append("Content-Type", "application/json");
    //     console.log(params);
    //     const requestOptions = {
    //         method: 'GET',
    //         mode: 'cors',
    //         headers: myHeaders
    //     };
    //     try {
    //         const response = await fetch(contextPath + `api/v1/attendance/report?date=${params.month}&email=${params.email}`, requestOptions);
    //         const result = await response.json();
    //         return result;
    //     } catch (error) {
    //         console.log(error, "errornya");
    //     }
    // }

    // getList() {
    //     return fetch(contextPath + 'demo/data/absen.json')
    //         .then((res) => res.json())
    //         .then((d) => d.value);
    // }

    // getProductsWithOrdersSmall() {
    //     return fetch(contextPath + 'demo/data/products-orders-small.json')
    //         .then((res) => res.json())
    //         .then((d) => d.data);
    // }
}
