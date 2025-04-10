// const contextPath = import.meta.env.BASE_URL;
import axios from 'axios';
import { absenModul } from '@/service/ConstantaService';

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
            // console.log(error, "errornya");
        }
    }

    async getEmployeeLeaveToday() {
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
            const response = await axios.get(contextPath + `absensi/v1/employee-leave-today`, requestOptions.headers)
                .then(res => {
                    return res.data;
                })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getDetail(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // console.log(params);
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
            // console.log(error, "errornya");
        }
    }

    async getDetailCuti(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // console.log(params);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/leave-balance/detail-year?pin=${params.pin}&year=${params.year}&type=${params.type}`, requestOptions);
            const result = await response.json();
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getListCuti(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // console.log(params);
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
            // console.log(error, "errornya");
        }
    }

    async sendEmailCuti(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // console.log(params);
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
            // console.log(error, "errornya");
        }
    }

    // SERVICE IZIN
    async getListIzin(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // console.log(params);
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
            // console.log(error, "errornya");
        }
    }
    async approvedIzin(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        const pin = JSON.parse(localStorage.getItem('sipam')).pin;  
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // console.log(params);
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/izin-user/${params.id}` + `?pin=${pin}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async sendUserIzin(params) {
        const token = localStorage.getItem('login');
        const pin = JSON.parse(localStorage.getItem('sipam')).pin;  
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/izin-user?pin=${pin}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
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
            // console.log(error, "errornya");
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
            // console.log(error, "errornya");
        }
    }
    // END SERVICE IZIN

    async sendEmailAbsen(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // console.log(params);
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
            // console.log(error, "errornya");
        }
    }

    // GET TOTAL CUTI
    async getSisaTotalCuti(data) {
        const token = JSON.parse(localStorage.getItem('sipam')).token;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // console.log(data);
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
            // console.log(error, "errornya");
        }
    }

    async getSisaTotalCutiNew(data) {
        const token = JSON.parse(localStorage.getItem('sipam')).token;
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // console.log(data);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders,
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/total-cuti-user/${data}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getCountTotalCuti(data) {
        const token = JSON.parse(localStorage.getItem('sipam')).token;
        const pin = JSON.parse(localStorage.getItem('sipam')).pin;      
        

        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // console.log(data);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders,
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/total-balance-user/${pin}/${data}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getCountTotalCutiByUser(params) {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        // Log params instead of data
        // console.log(params);
        
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders,
        };
        
        try {
            const response = await fetch(contextPath + `absensi/v1/total-balance-user/${params.pin}/${params.type}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
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
            // console.log(error, "errornya");
        }
    }
    // END GET TOTAL CUTI

    // Function Get List Type Izin
    async getTypeIzin() {
        const pin = JSON.parse(localStorage.getItem('sipam')).pin;      
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/izin/type-izin?pin=${pin}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // EN
    // End Function Get List Type Izin

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

    async getLeaveAdjustmentDetailCount(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };

        try {
            const response = await fetch(contextPath + `absensi/v1/leave-adjustment-detail?limit=10&page=${params.page}&year=${params.month}`, requestOptions);
            const result = await response.json();
            // console.log("API Result:", result);  // Log the result to check its structure
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getListDefaultBalanceType() {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/lefault-balance/list`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async sendLeaveAdjustment(params) {
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
            const response = await fetch(contextPath + `absensi/v1/leave-adjustment`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async sendLeaveAdjustmentHR(params) {
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
            const response = await fetch(contextPath + `absensi/v1/leave-adjustment-hr`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getLeaveBalance(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        // Construct the query string from the params object
        const queryString = new URLSearchParams(params).toString();
        const url = `${contextPath}absensi/v1/leave-leave-balances?${queryString}`;

        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };

        try {
            const response = await fetch(url, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // getListCuti
    async PostRestart(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/post-restart?number_officer=${params.numberOfficer}&year=${params.year}&type=${params.type}&pin=${params.pin}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async GetAttendanceAbsent() {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/attendance-absent`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }


    async PostAttendanceAbsent(params) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/batch-monthly-current-attendance?year=${params.year}&month=${params.month}&pin=${params.pin}`, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async saveDateCutiUser(params, id) {
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
            const response = await fetch(contextPath + `absensi/v1/add-izin-user/` + id, requestOptions);
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

    async GetWorkToday() {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/work-today`, requestOptions);
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

    async notifApproval(id) {
        const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + `absensi/v1/notif-approval/` + id, requestOptions);
            const result = await response.json();
            return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
}
