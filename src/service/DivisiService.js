// const contextPath = import.meta.env.BASE_URL;
// import AuthService from '@/service/AuthService';
import {token, userModul} from '@/service/ConstantaService';
import axios from 'axios';

const contextPath = userModul;

// const contextPath = "http://192.168.3.249:6063/";
// const contextPath = "http://192.168.3.249:6063/";
// const contextPath = "http://192.168.10.20:6061/";
// const contextPath = "https://lebihamandisini.id/admin/";
// const authService = new AuthService();

export default class DivisiService {
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
            const response = await axios.get(contextPath + `api/v1/divisies?limit=10&page=${params.page}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }
    // GET 
    async getListAll() {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        
        try {
            const response = await axios.get(contextPath + `api/v1/divisies/all`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

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
            const response = await axios.post(contextPath + 'api/v1/divisi', requestOptions.body, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
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
            const response = await axios.put(contextPath + 'api/v1/divisi/'+ id, requestOptions.body, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }
}
