// const contextPath = import.meta.env.BASE_URL;
// import AuthService from '@/service/AuthService';
import {webinarModul} from '@/service/ConstantaService';

const contextPath = webinarModul;

// const contextPathLocal = "http://localhost:5173/";
// const contextPath = "http://192.168.10.20:7070/";
// const contextPath = "https://lebihamandisini.id/admin/";
// const authService = new AuthService();

export default class WebinarService {
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
            const response = await fetch(contextPath + `wb/v1/webinars?limit=10&page=${params.page}`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    

    async getListEventWebinar(params) {
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
            const response = await fetch(contextPath + `wb/v1/webinars?limit=10&page=${params.page}`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getListParticipant(params) {
        // const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // // console.log(params);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `wb/v1/participant/${params.id}?limit=10&page=${params.page}`, requestOptions);
            const result = await response.json();
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async downloadParticipant(params) {
        // const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // // console.log(params);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `wb/v1/webinar/${params.id}`, requestOptions);
            const result = await response.arrayBuffer();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    // async getListCuti(params) {
    //     const token = localStorage.getItem('login');
    //     const myHeaders = new Headers();
    //     myHeaders.append("Authorization", token);
    //     myHeaders.append("Content-Type", "application/json");
    //     // console.log(params);
    //     const requestOptions = {
    //         method: 'GET',
    //         mode: 'cors',
    //         headers: myHeaders
    //     };
    //     try {
    //         const response = await fetch(contextPath + `api/v1/izin-list-cuti?date=${params.month}`, requestOptions);
    //         const result = await response.json();
    //         return result;
    //     } catch (error) {
    //         // console.log(error, "errornya");
    //     }
    // }

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
            const response = await fetch(contextPath + 'wb/v1/webinar', requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
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
    //         const response = await fetch(contextPath + 'api/v1/job/'+ id, requestOptions);
    //         const result = await response.json();
    //         // console.log(result);
    //         return result.data;
    //     } catch (error) {
    //         // console.log(error, "errornya");
    //     }
    // }

    // async runWebinar() {
    //     const myHeaders = new Headers();
    //     // myHeaders.append("Authorization", token);
    //     myHeaders.append("Content-Type", "application/json");

    //     const requestOptions = {
    //         method: 'POST',
    //         mode: 'cors',
    //         headers: myHeaders
    //     };
    //     try {
    //         const response = await fetch(contextPath + 'api/v1/scheduler', requestOptions);
    //         const result = await response.json();
    //         // console.log(result);
    //         return result.data;
    //     } catch (error) {
    //         // console.log(error, "errornya");
    //     }
    // }

    // async sendEmailAbsen(params) {
    //     const token = localStorage.getItem('login');
    //     const myHeaders = new Headers();
    //     myHeaders.append("Authorization", token);
    //     myHeaders.append("Content-Type", "application/json");
    //     // console.log(params);
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
    //         // console.log(error, "errornya");
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
