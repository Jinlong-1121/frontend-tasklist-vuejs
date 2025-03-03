// const contextPath = import.meta.env.BASE_URL;
import axios from 'axios';
import {absenModul} from '@/service/ConstantaService';

const contextPath = absenModul;
// const contextPath = "http://localhost:6060/";
// const contextPathInternal = "http://192.168.3.249:6060/";
// const contextPath = "https://lebihamandisini.id/admin/";
// const authService = new AuthService();

export default class AbsenService {
    // GET 
    async getList(params) {
        // const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer 12345qwerty");
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        
        try {
            const response = await axios.get(contextPath + `absensi/v1/attendance?limit=10&page=${params.page}&year=${params.year}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    async getDetail(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        console.log(params);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/attendance/detail?pin=${params.pin}&month=${params.month}`, requestOptions);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    async getListCuti(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        console.log(params);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/izin-list-cuti?date=${params.month}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    async sendEmailCuti(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        console.log(params);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/izin-summary-cuti?date=${params.month}&email=${params.email}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    // SERVICE IZIN
    async getListIzin(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        console.log(params);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/izin-users?limit=10&page=${params.page}&year=${params.month}&status=${params.statusIzin}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error, "errornya");
        }
    }
    async approvedIzin(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        console.log(params);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/izin-user/${params.id}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error, "errornya");
        }
    }
    async sendUserIzin(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/izin-user`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error, "errornya");
        }
    }
    async getListUserAbsen() {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/users/list`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error, "errornya");
        }
    }
    async getListIzinType() {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/izins/list`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error, "errornya");
        }
    }
    // END SERVICE IZIN

    async sendEmailAbsen(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        console.log(params);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/attendance/report?date=${params.month}&email=${params.email}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    // GET TOTAL CUTI
    async getSisaTotalCuti(data) {
        const token = JSON.parse(localStorage.getItem('sipam')).token;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        console.log(data);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders,
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/izin-user-cuti/${data}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            console.log(error, "errornya");
        }
    }
    async postSuratSisaCuti(data) {
        const token = JSON.parse(localStorage.getItem('sipam')).token;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(data)
        };
        try {
            const response = await axios.post(contextPath + 'absensi/v1/izin-user', requestOptions.body, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response;
        } catch (error) {
            console.log(error, "errornya");
        }
    }
    // END GET TOTAL CUTI

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
