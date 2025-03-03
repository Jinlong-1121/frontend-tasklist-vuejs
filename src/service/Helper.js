import CryptoJS from 'crypto-js'
import {userModul} from '@/service/ConstantaService';
import axios from 'axios';
import { TaskList } from './ConstantaService';

const contextPath = localhost;
const key = 'mySecretKey'
export const HelperFunc = {
    encryption(inputText) {
        if (inputText.trim() === '') {
            alert('Please enter text to encrypt!')
            return
          }
        return CryptoJS.AES.encrypt(inputText, key).toString()
    },

    decryption(outputText) {
        if (outputText.trim() === '') {
          alert('Nothing to decrypt!')
          return
        }
        console.log(outputText, "HHH");
        try {
          const decryptedText = CryptoJS.AES.decrypt(outputText, key).toString(CryptoJS.enc.Utf8)
          return decryptedText
        } catch (error) {
          alert('Error decrypting text!')
          return
        }
      },


}
