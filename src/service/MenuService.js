// const contextPath = import.meta.env.BASE_URL;
// import AuthService from '@/service/AuthService';
import {userModul} from '@/service/ConstantaService';

const contextPath = userModul;
// const contextPath = "http://192.168.3.249:6063/";
// const contextPath = "http://192.168.3.249:6063/";
// const contextPath = "http://192.168.10.20:6061/";
// const contextPath = "https://lebihamandisini.id/admin/";
// const authService = new AuthService();

export default class MenuService {
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
            const response = await fetch(contextPath + `api/v1/menus?limit=10&page=${params.page}`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    // GET 
    async getListMenuDivisi(params) {
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
            const response = await fetch(contextPath + `api/v1/menus/divisi?divisi=${params.divisi}`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    // async getDetail(params) {
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
    //         const response = await fetch(contextPath + `api/v1/job/detail?pin=${params.pin}&month=${params.month}`, requestOptions);
    //         const result = await response.json();
    //         return result.data;
    //     } catch (error) {
    //         // console.log(error, "errornya");
    //     }
    // }

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
            const response = await fetch(contextPath + 'api/v1/menu', requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async updateListData(params, id) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'PUT',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        try {
            const response = await fetch(contextPath + 'api/v1/menu/'+ id, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    // async runMenu() {
    //     const myHeaders = new Headers();
    //     // myHeaders.append("Authorization", token);
    //     myHeaders.append("Content-Type", "application/json");

    //     const requestOptions = {
    //         method: 'POST',
    //         mode: 'cors',
    //         headers: myHeaders
    //     };
    //     try {
    //         const response = await fetch(contextPath + 'api/v1/menu', requestOptions);
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
