import { userModul } from '@/service/ConstantaService';
//import jwt from 'jsonwebtoken';
import axios from 'axios';
import { TaskList,SendingEmail,TaskList_KongVer } from './ConstantaService';  // Assuming localhost is the base URL
import { SignJWT } from 'jose';

const dataLocal = localStorage.getItem("sipam");

const contextPath = TaskList;
const contextPath_Kong = TaskList_KongVer;
const SendingEmailApi = SendingEmail;

export default class Api_Generate {

  async createJWT() {
    const JWT_SECRET =  new TextEncoder().encode("titit_badja");
    const ISS_CODE = "dqP56R8TzRBPyGfJHvb2y4yCOEkTSNoj";

    const data = JSON.parse(dataLocal);
    const tokenValue = data.token || "";
    const pinValue = data.pin || "";

    const payload = {
        iss: ISS_CODE,
        sub: `${tokenValue}-pam-${pinValue}`,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 100,
    };

    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .sign(JWT_SECRET);


    console.log("Generated JWT:", JWT_SECRET);
    return token;
}
  async CreatingJWT(){
    try {
      const data = JSON.parse(dataLocal);
    const tokenValue = data.token || "";
    const pinValue = data.pin || "";
      const Value = {
        "Userstampt":tokenValue+pinValue
      }
      // Send GET request with axios
      const response = await axios.post("http://192.168.10.24:8000/jwt-gateway" + "/JwtCreator/TaskListJwt", Value, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      //console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      return null; 
    }
  }
  async GetMethode_Old(ApiPath) {
    try {
      // Send GET request with axios
      const response = await axios.get(contextPath + ApiPath, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      //console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      return null; 
    }
  }
  async GetMethode(ApiPath) {
    try {
      const token = await this.CreatingJWT();
      const response = await axios.get(contextPath_Kong + ApiPath, {
        headers: {
          //'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        },
        //withCredentials: true
      });
      //console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      return null; 
    }
  }
  async GetMethode_ApiHafiz(ApiPath) {
    try {
      // Send GET request with axios
      const response = await axios.get(`http://192.168.10.23:6063/` + ApiPath, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      //console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in GET request:', error);
      return null; 
    }
  }

  async postStringMethod(ApiPath, data) {
    try {
      const token = await this.CreatingJWT();
      const response = await axios.post(contextPath_Kong + ApiPath, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        }
      });
      //console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      return null;
    }
  }
  async SendingEmail(ApiPath, data) {
    try {
      const response = await axios.post(SendingEmailApi + ApiPath, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      //console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      return null;
    }
  }

  async postMultiPartFromDataMethod(ApiPath, formData) {
    try {
      // Send POST request with axios
      const token = await this.CreatingJWT();
      const response = await axios.post(contextPath_Kong + ApiPath, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization':`Bearer ${token}`
        }
      });
      //console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error in POST request:', error);
      return null;
    }
  }
}



// How to Use The PostString Method

// const contextPath = 'https://example.com/api';
// const apiPath = '/users';
// const data = { name: 'John Doe', email: 'john.doe@example.com' };

// postStringMethod(apiPath, data)
//   .then((responseData) => //console.log(responseData))
//   .catch((error) => console.error(error));


// How to Use The PostMultiPartFromData  Method

// const contextPath = 'https://example.com/api';
// const apiPath = '/upload';
// const formData = new FormData();
// formData.append('file', fileInputElement.files[0]); // Assuming `fileInputElement` is a file input in your HTML
// formData.append('description', 'File upload example');

// postMultiPartFromDataMethod(apiPath, formData)
//   .then((responseData) => //console.log(responseData))
//   .catch((error) => console.error(error));