// const contextPath = import.meta.env.BASE_URL;
// import AuthService from '@/service/AuthService';
import {token, suratModul} from '@/service/ConstantaService';
import axios from 'axios';

const contextPath = suratModul;

// const contextPath = "http://192.168.3.249:6064/";
// const contextPath = "http://192.168.10.20:6061/";
// const contextPath = "https://lebihamandisini.id/admin/";
// const authService = new AuthService();

export default class CategoryService {
    // GET 
    async getList(params) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        
        try {
            const response = await axios.get(contextPath + `api/v1/categories?limit=10&page=${params.page}&divisi=${params.divisi}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    // GET 
    async getListCategoryAll(params) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        
        try {
            const response = await axios.get(contextPath + `api/v1/categories/${params.type}?divisi=${params.divisi}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getDetailCategory(params) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await axios.get(contextPath + `api/v1/category/${params.id}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
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
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        try {
            const response = await axios.post(contextPath + 'api/v1/category', requestOptions.body, requestOptions.headers)
            .then(res => {
                return res;
            })
            return response;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async updateListData(params, id) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'PUT',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        try {
            const response = await axios.post(contextPath + 'api/v1/category/'+ id, requestOptions.body, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
}
