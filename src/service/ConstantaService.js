// URL dari modul-modul yang digunakan dalam aplikasi
// const userModul = "http://localhost:6063/";
const userModul = "http://192.168.10.23:6063/";
//const userModul = "https://logical-peter-destruction-licence.trycloudflare.com/";
// const suratModul = "http://localhost:6064/";
const suratModul = "http://192.168.10.23:6064/";
// const absenModul = "http://localhost:6060/";s
const absenModul = "http://192.168.10.23:6060/";
// const webinarModul = "http://localhost:7071/";
const webinarModul = "http://192.168.10.23:7070/";
// const schedulerModul = "http://localhost:6061/";
const schedulerModul = "http://192.168.10.23:6061/";


//const TaskList = "http://192.168.10.232:8086/";
const TaskList = "http://localhost:8086/";
const TaskList_KongVer = "http://192.168.10.24:8000/gateway/";
//const TaskList_KongVer = "https://hz-manually-conferencing-pf.trycloudflare.com/gateway/";
const SendingEmail = "http://192.168.10.203:6069/";
//const TaskList = "https://warranty-directories-colleagues-knowledge.trycloudflare.com/";

// Ambil token pengguna dari local storage jika tersedia
const token = JSON.parse(localStorage.getItem('sipam')) !== null ? JSON.parse(localStorage.getItem('sipam')).token : ''

// Ekspor konstanta-konstanta untuk digunakan di tempat lain dalam aplikasi
export {
    userModul,    
    suratModul,
    absenModul,
    webinarModul,
    schedulerModul,
    TaskList,
    token,
    SendingEmail,
    TaskList_KongVer
}