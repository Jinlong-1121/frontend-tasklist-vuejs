// const contextPath = import.meta.env.BASE_URL;
// import AuthService from '@/service/AuthService';
import {userModul} from '@/service/ConstantaService';
import axios from 'axios';

const contextPath = userModul;
// const contextPathLocal = "http://localhost:5173/";
// const contextPathInternal = "http://192.168.3.249:6063/";
// const contextPath = "http://192.168.3.249:6063/";
// const contextPath = "http://192.168.3.249:6063/";
// const contextPath = "https://lebihamandisini.id/admin/";
// const authService = new AuthService();

export default class UserService {
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
            const response = await fetch(contextPath + `api/v1/users?limit=10&page=${params.page}`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getUserPin(params) {
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
            const response = await fetch(contextPath + `api/v1/user/pin/${params.pin}`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    // Function Get List Tujuan All
    async getListTujuanAll(params) {
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
            const response = await fetch(contextPath + `api/v1/users/receiver`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Funtion Get List Tujuan All

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
            const response = await fetch(contextPath + 'api/v1/user', requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getListData(id) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders,
        };
        try {
            const response = await fetch(contextPath + 'api/v1/user/'+ id, requestOptions);
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
            const response = await fetch(contextPath + 'api/v1/user/'+ id, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async UploadSign(params, id) {
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
            const response = await fetch(contextPath + 'api/v1/user/sign/'+ id, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async UploadPhoto(params, id) {
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
            const response = await fetch(contextPath + 'api/v1/user/photo/'+ id, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async updateListPinAccess(id) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'PUT',
            mode: 'cors',
            headers: myHeaders,
        };
        try {
            const response = await fetch(contextPath + 'api/v1/user/pin-access/'+ id, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async updatePassword(params) {
        const id = JSON.parse(localStorage.getItem('sipam')).target;
    
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        const requestOptions = {
            method: 'PUT',
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(params)
        };
    
        try {
            const response = await fetch(contextPath + 'api/v1/user/password/' + id, requestOptions);
    
            // Check if the response is ok (status in the range 200-299)
            if (!response.ok) {
                // If not ok, throw an error with response data
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update password');
            }
    
            // If response is ok, parse and return the result
            const result = await response.json();
            // console.log(result);
            return result; // Return the entire result, not just result.data
        } catch (error) {
            console.error(error, "errornya");
            // It's a good practice to throw the error again so it can be caught in the calling function
            throw error;
        }
    }
    
    // async runUser() {
    //     const myHeaders = new Headers();
    //     // myHeaders.append("Authorization", token);
    //     myHeaders.append("Content-Type", "application/json");

    //     const requestOptions = {
    //         method: 'POST',
    //         mode: 'cors',
    //         headers: myHeaders
    //     };
    //     try {
    //         const response = await fetch(contextPath + 'api/v1/user', requestOptions);
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

    // Functions Get List Verif
    async getListVerif(params) {
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
            const response = await fetch(contextPath + `api/v1/users/verificator`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Functions Get List Verif

    // Functions Get List Verif divisi
    async getListVerifDivisi(params) {
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
            const response = await fetch(contextPath + `api/v1/users/verificator-divisi?divisi=${params}`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Functions Get List Verif

    // Function Get List Signer
    async getListSigner(params) {
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
            const response = await fetch(contextPath + `api/v1/users/signer`, requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Function Get List Signer

    // Function Get and Add Signer External
    async addSignerExternal(data) {
        // const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", "Bearer 12345qwerty");
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            // mode: 'cors',
            headers: myHeaders,
            body: data
        };
        try {
            const response = await axios.post(contextPath + `api/v1/external`, requestOptions.body)
            .then(res => {
                return res.data;
            })
            return response.data;
            // const response = await fetch(contextPath + `api/v1/external`, requestOptions);
            // const result = await response.json();
            // return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async getSignerExternal(params) {
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
            const response = await axios.get(contextPath + `api/v1/externals?limit=10&page=${params.page}`)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
        // return fetch(contextPathLocal + 'demo/data/_signerexternaloptions.json')
        // .then((res) => res.json())
        // .then((d) => d.data);
    }
    async getListSignerExternal(params) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer 12345qwerty");
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        
        try {
            const response = await axios.get(contextPath + `api/v1/externals/all`)
            .then(res => {
                // console.log(res, "DATA RES");
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
        // return fetch(contextPathLocal + 'demo/data/_signerexternaloptions.json')
        // .then((res) => res.json())
        // .then((d) => d.data);
    }
    // End Function Get and Add Signer External

    // VIDA
    async postProsesViva(data) {
        try {
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
    
          const payload = {
            user_id: data.id, // Mengambil user_id dari slotProps.data.id
            email: data.email,
            phone: data.phone
          };
    
          const requestOptions = {
            method: "POST",
            mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(payload),
          };
    
          const response = await fetch(
            contextPath + "api/v1/vida/user",
            requestOptions
          );
    
          return response;
        } catch (error) {
          console.error("Error Permintaan Proses:", error);
          return null;
        }
    }

    async runStatus() {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await fetch(contextPath + 'api/v1/vida/update-status', requestOptions);
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getSpeciment(pin) {
        

        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
        };
        
        try {
            const response = await axios.get(contextPath + `api/v1/speciment/${pin}`, requestOptions)
            .then(res => {
                // console.log(res, "DATA RES");
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
        // return fetch(contextPathLocal + 'demo/data/_signerexternaloptions.json')
        // .then((res) => res.json())
        // .then((d) => d.data);
    }
}
