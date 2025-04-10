import axios from 'axios';

// const contextPath = suratModul;

const contextPath = "http://localhost:6069/";

export const AccountService = {
    // 1 asset 
    // 2 kewajiban 
    // 3 equitas 
    // 4 pendapatan 
    // 5 beban 
    async getList() {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        
        try {
            const response = await axios.get(contextPath + `api/v1/account/all`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    },
    async createAccount(data) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            // mode: 'cors',
            headers: myHeaders,
            // body: JSON.stringify(data)
            body: data
        };
        
        try {
            const response = await axios.post(contextPath + `api/v1/account/create`, requestOptions.body, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    },
    getData() {
        return [
            {
                "account_no": "110.00.000",
                "level": 1,
                "account_type": 1,
                "description": "Asset",
                "general_detail": 1,
                "account_cost": 0,
                "cost_center": 0,
                "status": 1,
                "created_by": 1,
                "updated_by": 1,
                "created_date": "2024-01-04T17:21:43+07:00",
                "updated_date": "2024-01-04T17:21:43+07:00"
            }
            
        ];
    },

    getCustomersSmall() {
        return Promise.resolve(this.getData().slice(0, 10));
    },

    getCustomersMedium() {
        return Promise.resolve(this.getData().slice(0, 50));
    },

    getCustomersLarge() {
        return Promise.resolve(this.getData().slice(0, 200));
    },

    getCustomersXLarge() {
        return Promise.resolve(this.getData());
    },

    getCustomers(params) {
        const queryParams = params
            ? Object.keys(params)
                  .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                  .join('&')
            : '';

        return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
    }
};
