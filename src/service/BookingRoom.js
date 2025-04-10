// const contextPath = import.meta.env.BASE_URL;
// import AuthService from '@/service/AuthService';
import {webinarModul} from '@/service/ConstantaService';

const contextPath = webinarModul;

// const contextPathLocal = "http://localhost:5173/";
// const contextPath = "http://192.168.10.20:7070/";
// const contextPath = "https://lebihamandisini.id/admin/";
// const authService = new AuthService();

export default class BookingRoom {
    // GET 
    async getCalender() {
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
            const response = await fetch(contextPath + `wb/v1/booking-rooms`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

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
            const response = await fetch(contextPath + `wb/v1/booking-room/${params.user_id}`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    

    async saveBookingRoom(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
    
        const requestOptions = {
            method: 'POST',
            // headers: myHeaders,
            body: JSON.stringify(params)
        };
    
        try {
            const requestUrl = contextPath + `wb/v1/booking-room`;
            // console.log('Request URL:', requestUrl);
            // console.log('Request Headers:', myHeaders);
            // console.log('Request Body:', JSON.stringify(params));
    
            const response = await fetch(requestUrl, requestOptions);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
    
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }
    
    
    async updateBookingRoom(params, id) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'PUT',
            // headers: myHeaders,
            body: JSON.stringify(params)
        };
        try {
            const response = await fetch(contextPath + `wb/v1/booking-room/` + id, requestOptions);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error updating Meeting Room');
            }
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
            throw error; // Tambahkan throw untuk menangkap di pemanggilan fungsi
        }
    }

    async deleteBookingRoom(id) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'DELETE',
            // headers: myHeaders,
        };
        try {
            const response = await fetch(contextPath + `wb/v1/booking-room/` + id, requestOptions);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error updating Meeting Room');
            }
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
            throw error; // Tambahkan throw untuk menangkap di pemanggilan fungsi
        }
    }

    async getTimes() {
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
            const response = await fetch(contextPath + `wb/v1/times`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getHours() {
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
            const response = await fetch(contextPath + `wb/v1/hours`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    
    
}
