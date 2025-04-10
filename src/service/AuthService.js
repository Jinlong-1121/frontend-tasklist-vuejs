// import { useRouter } from 'vue-router'
import router from '@/router';
import {userModul} from '@/service/ConstantaService';

const contextPath = userModul;

const contextPathInternal = "http://192.168.3.249:6063/";
// const contextPath = import.meta.env.BASE_URL;
// const contextPath = "https://lebihamandisini.id/auth/";
// const router = useRouter();

export default class AuthService {
    async authLogin(params) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        
        try {
            const response = await fetch(contextPath + `login`, requestOptions);
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

    async forgotPassword(params) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        
        try {
            const response = await fetch(contextPath + `forgot-password`, requestOptions);
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

    async cekForgotPassword(params) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        
        try {
            const response = await fetch(contextPath + `review-forgot-password`, requestOptions);
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

    async updatePassword(params) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'PUT',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        
        try {
            const response = await fetch(contextPath + `update-password`, requestOptions);
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

    authLogout() {
        // console.log(router);
        router.push('/auth/login');
    }

    // getProducts() {
    //     return fetch(contextPath + 'demo/data/products.json')
    //         .then((res) => res.json())
    //         .then((d) => d.data);
    // }

    // getProductsWithOrdersSmall() {
    //     return fetch(contextPath + 'demo/data/products-orders-small.json')
    //         .then((res) => res.json())
    //         .then((d) => d.data);
    // }
}
