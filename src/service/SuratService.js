import { token, suratModul} from '@/service/ConstantaService';
import axios from 'axios';

const contextPath = suratModul;
// const contextPathLocal = import.meta.env.BASE_URL;
// const urlSurat = "http://192.168.4.250/suratcore/api/";

export default class SuratService {

    // Function Get Total Surat
    async getSuratCount(params) {
        // let arry = ['17', '20', '42', '11']
        // return arry;
        const divisiAccount = JSON.parse(localStorage.getItem('sipam')).divisi
        const dargetAccount = JSON.parse(localStorage.getItem('sipam')).target
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await axios.get(contextPath + `api/v1/documents/total?target=${dargetAccount}&type=${params.type}&divisi=${divisiAccount}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
            // const response = await fetch(contextPathInternal + `api/v1/documents/total?target=${dargetAccount}&type=${params.type}&divisi=${divisiAccount}`, requestOptions);
            // const result = await response.json();
            // return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Function Get Total Surat

    // Function Post Surat
    async postSurat(data) {
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
            const response = await axios.post(contextPath + 'api/v1/document', requestOptions.body, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response;
            // const response = await fetch(contextPath + 'api/v1/document', requestOptions);
            // const result = await response.json();
            // // console.log(result);
            // return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async postAttachment(data) {
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders
            body: data
        };
        try {
            const response = await axios.post(contextPath + 'api/v1/attachment', requestOptions.body)
            .then(res => {
                return res.data;
            })
            // const resultAttachment = response;
            // const responseAttachment = await fetch(contextPath + 'api/v1/attachment', requestOptions);
            // const resultAttachment = await responseAttachment.json();
            // // console.log(resultAttachment);
            // return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async postSign(data) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders,
            body: JSON.stringify(data)
        };
        try {
            const response = await axios.post(contextPath + 'api/v1/document/sign', requestOptions.body)
            .then(res => {
                return res.data;
            })
            return response;
            // const response = await fetch(contextPath + 'api/v1/document/sign', requestOptions);
            // const result = await response.json();
            // // console.log(result);
            // return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Function Post Surat
    async postSignValidasi(data) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders,
            body: JSON.stringify(data)
        };
        try {
            const response = await axios.post(contextPath + 'api/v1/document/validasi/vida', requestOptions.body)
            .then(res => {
                return res.data;
            })
            return response;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Function Post Validasi Surat

    async postSignVida(data) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders,
            body: JSON.stringify(data)
        };
        try {
            const response = await axios.post(contextPath + 'api/v1/document/complete-vida', requestOptions.body)
            .then(res => {
                return res.data;
            })
            return response;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async postSignVidaPin(data) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders,
            body: JSON.stringify(data)
        };
        try {
            const response = await axios.post(contextPath + 'api/v1/document/complete-vida/pin', requestOptions.body)
            .then(res => {
                return res.data;
            })
            return response;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async postSignNew(data) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders,
            body: JSON.stringify(data)
        };
        try {
            const response = await axios.post(contextPath + 'api/v1/document/complete', requestOptions.body)
            .then(res => {
                return res.data;
            })
            return response;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async postRejectCuti(data) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders,
            body: JSON.stringify(data)
        };
        try {
            const response = await axios.post(contextPath + 'api/v1/document/reject', requestOptions.body)
            .then(res => {
                return res.data;
            })
            return response;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Function Post Sign

    // Function Put Surat
    async putSurat(data) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Access-Control-Allow-Origin", "*");

        // console.log(myHeaders, "HHH");
        const requestOptions = {
            method: 'PUT',
            // mode: 'no-cors',
            // headers: {
            //     "Authorization": token,
            //     "Content-Type": "application/json",
            //     "Access-Control-Allow-Origin": "*"
            // },
            headers: myHeaders,
            // body: data
            body: JSON.stringify(data)
        };
        // console.log(requestOptions.headers, "LLL");
        try {
            const response = await axios.post(contextPath + `api/v1/document/${data.id}`, requestOptions.body, { headers : requestOptions.headers })
            .then(res => {
                return res.data;
            })
            return response;
            // const response = await fetch(contextPath + `api/v1/document/${data.id}`, requestOptions);
            // const result = await response.json();
            // // console.log(result);
            // return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Function Put Surat

    // Function Get List and Detail Surat
    async getList(params) {
        const divisiAccount = JSON.parse(localStorage.getItem('sipam')).divisi
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await axios.get(contextPath + `api/v1/documents?limit=10&page=${params.page}&target=${params.target}&status=${params.status}&type=${params.type}&divisi=${divisiAccount}&keyword=${params.keyword}&date=${params.year}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async getListInternal(params) {
        const divisiAccount = JSON.parse(localStorage.getItem('sipam')).divisi
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'GET',
            // mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await axios.get(contextPath + `api/v1/documents?limit=10&page=${params.page}&target=${params.target}&status=${params.status}&type=${params.type}&divisi=${divisiAccount}&keyword=${params.keyword}&date=${params.year}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async getDetail(params) {
        // const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // // console.log(params);
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: myHeaders
        };
        try {
            const response = await axios.get(contextPath + `api/v1/document/${params.id}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
            // const response = await fetch(contextPath + `api/v1/document/${params.id}`, requestOptions);
            // const result = await response.json();
            // return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
        // return fetch(contextPath + 'demo/data/_detail.json')
        //     .then((res) => res.json())
        //     .then((d) => d.data);
    }
    // End Function Get List and Detail Surat

    // Function Delete Surat
    async deleteSurat(data) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Access-Control-Allow-Origin", "*");

        // console.log(myHeaders, "HHH");
        const requestOptions = {
            method: 'DELETE',
            // mode: 'no-cors',
            // headers: {
            //     "Authorization": token,
            //     "Content-Type": "application/json",
            //     "Access-Control-Allow-Origin": "*"
            // },
            headers: myHeaders,
            // body: data
            body: JSON.stringify(data)
        };
        // console.log(requestOptions.headers, "LLL");
        try {
            const response = await axios.post(contextPath + `api/v1/document/${data.id}`, requestOptions.body, { headers : requestOptions.headers })
            .then(res => {
                return res.data;
            })
            return response;
            // const response = await fetch(contextPath + `api/v1/document/${data.id}`, requestOptions);
            // const result = await response.json();
            // // console.log(result);
            // return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Function Delete Surat

    async getListTembusan() {
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
            const response = await axios.get(contextPath + `api/v1/externals/tembusan`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    // Function Get and Add Tujuan
    async addTujuan(data) {
        // const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", "Bearer 12345qwerty");
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            // mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(data)
        };
        try {
            const response = await axios.post(contextPath + `api/v1/external`, requestOptions.body, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async getListTujuan() {
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
            const response = await axios.get(contextPath + `api/v1/externals/receiver`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Function Get and Add Tujuan

    // Function Remove Surat
    async removeSuratEdit(data) {
        // const token = localStorage.getItem('login');
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", "Bearer 12345qwerty");
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            // mode: 'cors',
            headers: myHeaders,
            body: JSON.stringify(data)
        };
        try {
            const response = await axios.post(contextPath + `api/v1/attachment/delete`, requestOptions.body, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Function Remove Surat

    getListCategory() {
        return fetch(contextPath + 'demo/data/_category.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }

    getListTemplate(id) {
        return fetch(contextPath + 'demo/data/_template.json')
            .then((res) => res.json())
            .then((d) => d.data.filter(item => item.category === id));
    }

    getInputForm(id) {
        return fetch(contextPath + 'demo/data/_form.json')
            .then((res) => res.json())
            .then((d) => d.data.filter(item => item.template === id));
    }

    // Function Generate PDF
    async generatePDF(params) {
        // const token = localStorage.getItem('login');
        // const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        // myHeaders.append("Content-Type", "application/json");
        // // console.log(params);
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders
            body: params
        };
        try {
            const response = await fetch(contextPath + `api/v1/document/makepdf`, requestOptions);
            // if (!response.ok) {
            //     // console.log(response);
            //     authService.authLogout();
            //     // throw new Error(`Error! status: ${response.status}`);
            // }
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async generatePreviewPDF(params) {
        // const token = localStorage.getItem('login');
        // const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        // myHeaders.append("Content-Type", "application/json");
        // // console.log(params);
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders
            body: params
        };
        try {
            const response = await fetch(contextPath + `api/v1/document/previewpdf`, requestOptions);
            // if (!response.ok) {
            //     // console.log(response);
            //     authService.authLogout();
            //     // throw new Error(`Error! status: ${response.status}`);
            // }
            const result = await response.json();
            // console.log(result);
            return result.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Function Generate PDF

    // Function Uploaded
    async uploadFileTTDBasah(params) {
        // const token = localStorage.getItem('login');
        // const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        // myHeaders.append("Content-Type", "application/json");
        // // console.log(params);
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders
            body: params
        };
        try {
            const response = await fetch(contextPath + `api/v1/document/upload`, requestOptions);
            // if (!response.ok) {
            //     // console.log(response);
            //     authService.authLogout();
            //     // throw new Error(`Error! status: ${response.status}`);
            // }
            const result = await response.json();
            // console.log("result", result);
            return result;
        } catch (error) {
            // console.log(error, "errornya");
            // return error;
        }
    }
    async uploadFileOptionalComplete(params) {
        // const token = localStorage.getItem('login');
        // const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        // myHeaders.append("Content-Type", "application/json");
        // // console.log(params);
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders
            body: params
        };
        try {
            const response = await axios.post(contextPath + `api/v1/upload/external`, requestOptions.body)
            .then(res => {
                return res.data;
            })
            return response;
        } catch (error) {
            // console.log(error, "errornya");
            // return error;
        }
    }

    async uploadFileNoteCancel(params) {
        // const token = localStorage.getItem('login');
        // const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        // myHeaders.append("Content-Type", "application/json");
        // // console.log(params);
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            // headers: myHeaders
            body: params
        };
        try {
            const response = await axios.post(contextPath + `api/v1/upload/note-cancel`, requestOptions.body)
            .then(res => {
                return res.data;
            })
            return response;
        } catch (error) {
            // console.log(error, "errornya");
            // return error;
        }
    }
    // End Function Uploaded

    // Function Blotter
    async postBlotter(data) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            // mode: 'cors',
            headers: myHeaders,
            body: data
        };
        try {
            const response = await axios.post(contextPath + 'api/v2/blotter/radsoft-api/api/getoms', requestOptions.body, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response;
            // const response = await fetch(contextPath + 'api/v1/document', requestOptions);
            // const result = await response.json();
            // // console.log(result);
            // return result;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    // End Function Blotter
    // Function Get and Add Tujuan
    async uploadSuratMasuk(data) {
        try {
            const response = await axios.post(contextPath + `api/v1/upload/surat-masuk`, data)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async createActionAccess(data) {
        try {
            const response = await axios.post(contextPath + `api/v1/document/create`, JSON.stringify(data))
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async updateActionAccess(data) {
        try {
            const response = await axios.post(contextPath + `api/v1/document/update`, JSON.stringify(data))
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async editActionAccess(data, type) {
        try {
            const response = await axios.post(contextPath + `api/v1/document/edit?type=${type}`, JSON.stringify(data))
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
    async postActionAccess(data, type) {
        try {
            const response = await axios.post(contextPath + `api/v1/document/post?type=${type}`, JSON.stringify(data))
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }

    async getDocumentNatures(status) {
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
            const response = await axios.get(contextPath + `api/v1/document_nature/${status}`, requestOptions.headers)
            .then(res => {
                return res.data;
            })
            return response.data;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
}
