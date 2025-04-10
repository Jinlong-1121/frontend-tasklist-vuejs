import {kpiModul} from '@/service/ConstantaService';

const contextPath = kpiModul;



export default class KpiService {
    // Title Template
    async postCreateTemplateName(data) {
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(data)
        };
        try {
            const response = await axios.post(contextPath + 'kpi/v1/template-name', requestOptions.body)
            .then(res => {
                return res.data;
            })
            return response;
        } catch (error) {
            // console.log(error, "errornya");
        }
    }
}