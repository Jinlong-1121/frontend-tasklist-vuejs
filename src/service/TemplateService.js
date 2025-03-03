import {token, suratModul} from '@/service/ConstantaService';
import axios from 'axios';

const contextPath = suratModul;
// const contextPath = "http://192.168.3.249:6064/";
// const contextPath = "http://192.168.10.20:6061/";
// const contextPath = "https://lebihamandisini.id/admin/";
// const authService = new AuthService();

export default class TemplateService {
    // GET 
    async getList(params) {
        // const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        
        try {
            const response = await axios.get(contextPath + `api/v1/templates?limit=10&page=${params.page}&divisi=${params.divisi}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    // GET 
    async getListTemplateAll(params) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        
        try {
            const response = await axios.get(contextPath + `api/v1/templates/${params.type}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    // GET 
    async getListParameters(params) {
        // const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        
        try {
            const response = await axios.get(contextPath + `api/v1/parameters/${params.id}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    async getDetailTemplate(params) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        // console.log(params);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await axios.get(contextPath + `api/v1/template/${params.id}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    async saveTemplateData(params) {
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
            const response = await axios.post(contextPath + 'api/v1/template',  requestOptions.body, requestOptions.headers)
            .then(res => {
                return res.data
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
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
            const response = await axios.post(contextPath + 'api/v1/template/'+ id,  requestOptions.body, requestOptions.headers)
            .then(res => {
                return res.data
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    async deleteListData(id) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'DELETE',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + 'api/v1/template/'+ id,  requestOptions)
            .then(res => {
                return res.data
            })
            return response.data;
        } catch (error) {
            console.log(error, "errornya");
        }
    }

    // async runScheduler() {
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
}
