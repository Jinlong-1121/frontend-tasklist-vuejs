<script setup>
import { inject, ref, reactive, onMounted, onUpdated } from "vue";
import { useRoute } from "vue-router";
import SuratService from '@/service/SuratService';
import DivisiService from '@/service/DivisiService';
import TemplateService from "@/service/TemplateService";
import UserService from "@/service/UserService";
import AbsenService from '@/service/AbsenService';
import Editor from "@/components/editor";

const editor = Editor;

import { useToast } from "primevue/usetoast";
const toast = useToast();
const swal = inject('$swal')

const props = defineProps({ formData: Object, draftStore: Object });
const emit = defineEmits(['next-page', 'prev-page']);
const route = useRoute();
const paramId = route.params.id;

const suratService = new SuratService();
const divisiService = new DivisiService();
const templateService = new TemplateService();
const userService = new UserService();

const submitted = ref(false);

const absenService = new AbsenService();

// SELECTION OPTIONS
const selectedDivisi = ref();
const selectedTujuan = ref()
const selectSigner = ref([])
const selectVerificator = ref({})
const selectedSifatSurat = ref({});
const selectTembusan = ref([])
const selectedTypeIzin = ref();

// END SELECTION OPTIONS

const dataForm = ref([]);
const dataBlotter = ref({})

// OPTIONS DROPDOWN
const optionDivisi = ref([]);
const optionTujuan = ref([]);
const optionSigner = ref([]);
const optionTypeIzin = ref([]);
const optionVerif = ref([]);
const optionSifatSurat = ref([]);
const optionTembusan = ref([])
const optionTujuanTemp = ref([]);
const optionInstrumentType = ref([
    { name: "Equity Reguler", type: 1 },
    { name: "Government Bond", type: 2 },
    { name: "Corporate Bond", type: 3 },
    { name: "Deposito Money Market", type: 4 }
]);
const optionFundType = ref([
    { name: "RDCPD", type: 1 },
    { name: "RDPLP", type: 2 },
    { name: "RDPSB", type: 3 }
]);
// END OPTIONS DROPDOWN

const inputForm = reactive({
    document_no: "",
    perihal: "",
    up: "",
    divisi: [],
    receiver: [],
    signer: [],
    verificator: {},
    type_cuti: {},
    tembusan: [],
    attachment: [],
    attachment_avail: [],
    lampiran: 0,
    status: '1',
    document_nature: "",
    is_reply: "1",
    need_attach: "0",
    // need_sign: "0"
});

// BLOTTER
const inputBlotter = reactive({
    ins_type: null,
    fund_type: null,
    date: "",
});
const tempInputDateBlotter = reactive({
    date: null
})
const tempInputBlotterFund = reactive({
    fund_type: null,
});
const tempInputBlotterIns = reactive({
    ins_type: null,
});
const minDate = ref(new Date());
// BLOTTER

const inputFormTujuan = reactive({
    name: "",
    alamat: ""
});

const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
}

const onSelectFile = (event) => {
    inputForm.attachment = event.files;
    inputForm.lampiran = event.files.length === 0 ? "-" : event.files.length;
}

onMounted(() => {
    inputForm.attachment_avail = props.formData.attachment;
    setData();
});

onUpdated(() => {
    setData();
    // initEditor();
});

const setData = () => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    getListTujuan();
    getListDivisi();
    getListSigner();
    getListVerif();
    getDocumentNatures();
    getListTembusan();
    getTypeIzin();

    let currentTime = new Date();
    inputForm.document_no = `{no}/INT.${props.formData.category.alias}/${dataLocalStorage.divisi_alias}/${romanize(currentTime.getMonth() + 1)}/${currentTime.getFullYear()}`

    props.formData.receiver.map(item => {
        delete item.document_id
        delete item.id
    })
    props.formData.signer.map(item => {
        delete item.document_id
        delete item.id
    })
    // props.formData.tembusan.map(item => {
    //     delete item.document_id
    //     delete item.id
    // })

    delete props.formData.verificator.id;
    delete props.formData.verificator.document_id;

    inputForm.perihal = props.formData.perihal;
    selectedDivisi.value = props.formData.divisi;
    // // console.log(props.formData.divisi);
    selectedTujuan.value = props.formData.receiver;
    selectSigner.value = props.formData.signer;
    selectVerificator.value = props.formData.verificator;
    selectTembusan.value = props.formData.tembusan;
    // // console.log(selectTembusan.value, optionTembusan.value, "ZZZZ");
    inputForm.lampiran = props.formData.lampiran;
    var documentNature = props.formData.draftStore;
    selectedSifatSurat.value = JSON.parse(documentNature.value.document_nature);
    
    props.formData.template.parameter.map((item) => {
        if (item.type === "2") {
            item.value = item.value === '' ? '' : setFormatDateDisplayInput(item.value)
        }
    });
    inputForm.receiver = selectedTujuan.value
    inputForm.signer = selectSigner.value
    inputForm.verificator = selectVerificator.value
    dataForm.value = props.formData.template.parameter
}

// SETGET OPTIONS LIST TUJUAN
const getListDivisi = () => {
    divisiService.getListAll().then((data) => {
        optionDivisi.value = data;
        // // console.log(props.formData.template.content, "HIHIHI");
    });
}
const setDivisi = (event) => {
    inputForm.receiver = []
    selectedTujuan.value = []
    inputForm.divisi = event.value
    selectedDivisi.value = event.value
    const thirdArray = optionTujuanTemp.value.filter((elem) => {
        return selectedDivisi.value.some((ele) => {
            return elem.up == ele.id;
        });
    });
    optionTujuan.value = thirdArray
};
// SETGEN GET OPTIONS LIST TUJUAN

// const setOptionTembusan = (data) => {
//     let optionTembusanData = data.map((item) => {
//         const container = {};
//         container.user_name = item.name;
//         container.user_id = item.id;
//         container.user_type = "1";

//         return container;
//     })
// }

// SETGET OPTIONS LIST TUJUAN
const getListTujuan = () => {
    userService.getListTujuanAll().then((data) => {
        // // console.log(data, "DATANYA");
        optionTujuanTemp.value = data
        const thirdArray = data.filter((elem) => {
            return selectedDivisi.value.some((ele) => {
                return elem.up == ele.id;
            });
        });
        optionTujuan.value = thirdArray
    });
}
const setTujuan = (event) => {
    // inputForm.receiver = event.value
    selectedTujuan.value = event.value
};
// SETGEN GET OPTIONS LIST TUJUAN

function romanize(num) {
    if (!+num)
        return false;
    var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

const getInputForm = (id) => {
    const params = {
        id: id
    }
    templateService.getListParameters(params).then((data) => (dataForm.value = data));
}

const getListSigner = () => {
    userService.getListSigner().then((data) => (optionSigner.value = data));
}

const getListVerif = () => {
    userService.getListVerif().then((data) => (optionVerif.value = data));
}

const getDocumentNatures = () => {
    suratService.getDocumentNatures(2).then((data) => (optionSifatSurat.value = data));
}

const getListTembusan = () => {
    divisiService.getListAll().then((data) => {
        optionDivisi.value = data;
        optionTembusan.value = data.map((item) => {
            const container = {};
            container.user_name = item.name;
            container.user_id = item.id;
            container.user_type = "1";
            // console.log("container", container)
            return container;
        })
        // // console.log(props.formData.template.content, "HIHIHI");
    });
}

const getTypeIzin = async () => {
    const data = await absenService.getTypeIzin();

    const finalOptionTypeIzin = data.data.filter(option => {
        // If total_cuti <= 0, remove option with type '1'
        if (props.formData.template.name === 'Permohonan Cuti Panjang') {
            return option.type != 1 && option.multi == 0;
        } else if (props.formData.template.name === 'Permohonan Cuti') {
            return option.multi == 1;
        }
    });
    // Assign the final filtered data to optionTypeIzin
    optionTypeIzin.value = finalOptionTypeIzin;
};

const setTypeIzin = (event) => {
    inputForm.type_cuti = event.value
    selectedTypeIzin.type_cuti = event.value
};

const setTypeIzinNew = (event) => {
    const filteredData = dataForm.value.filter(item => item.type === '9');
    const typeCutis = filteredData.map(item => item.value.type);

    inputForm.type_cuti = event.value
    selectedTypeIzin.type_cuti = event.value

    absenService.getCountTotalCuti(event.value.type).then((data) => {
        if (typeCutis[0] === 10 && totalSisaCuti.value <= 4) {
            totalSisaCuti.value = 100 - data.data
        } else if (typeCutis[0] === 11 && totalSisaCuti.value <= 4) {
            totalSisaCuti.value = data.data
        } else {
            totalSisaCuti.value = data.data
        }
    });
};


const setSigner = (event) => {
    inputForm.signer = event.value
};

const setTembusan = (event) => {
    inputForm.tembusan = event.value
};

const setVerificator = (event) => {
    inputForm.verificator = event.value
};

const setSifatSurat = (event) => {
    inputForm.document_nature = event.value;  // Simpan ID ke database
    selectedSifatSurat.value = event.value;      // Simpan objek terpilih
};

const setContent = () => {
    // // console.log(selectedTujuan, "TTTTT");
    let myTarget = JSON.parse(JSON.stringify(props.formData))
    const contentTemplate = props.formData.template.content;
    let contentDoc = contentTemplate;
    let dataUsersCuti = JSON.parse(localStorage.getItem('sipam'));

    // SET CONTENT IZIN
    if (props.formData.template.name.includes('Izin') || props.formData.template.name.includes('Cuti')) {
        contentDoc = contentDoc.replaceAll('{nama_pembuat}', dataUsersCuti.user_name);
        contentDoc = contentDoc.replaceAll('{jabatan_pembuat}', dataUsersCuti.position);
        contentDoc = contentDoc.replaceAll('{tujuan_divisi}', inputForm.receiver[0].user_name);

        if (props.formData.template.name === 'Permohonan Cuti Panjang') {
            dataForm.value.forEach((item, idx) => {
                if (item.value.default_qty !== undefined) {
                    contentDoc = contentDoc.replaceAll('{jumlah_hari}', item.value.default_qty);
                }

                if (Object.prototype.toString.call(item.value) === '[object Date]') {
                    // Buat salinan dari item.value untuk memastikan tidak memodifikasi nilai asli
                    let addDate = new Date(item.value);
                    dataForm.value.forEach((itemDetail, idxDetail) => {
                        if (itemDetail.value.default_qty !== undefined) {
                            let daysToAdd = itemDetail.value.default_qty; // Perbaiki penamaan variabel
                            // Pastikan daysToAdd adalah angka dan bukan NaN
                            if (!isNaN(daysToAdd)) {
                                // Tambahkan daysToAdd
                                daysToAdd = parseInt(daysToAdd, 10); // Convert to integer
                                addDate.setDate(addDate.getDate() + daysToAdd);

                                // Format tanggal baru menggunakan setFormatDateOnly atau fungsi format kustom
                                const formatAddDate = setFormatDateOnly(addDate);
                                contentDoc = contentDoc.replaceAll('{tanggal_akhir}', formatAddDate);
                            }
                        }
                    });
                }
            });
        }
    }
    // END SET CONTENT IZIN
    contentDoc = contentDoc.replaceAll('{perihal}', inputForm.perihal);
    contentDoc = contentDoc.replaceAll('{tujuan}', selectedTujuan.value.length > 1 ? "Tujuan Terlampir" : `${selectedTujuan.value[0].user_name} (${selectedTujuan.value[0].address})`);
    contentDoc = contentDoc.replaceAll('{alamat}', selectedTujuan.value.length > 1 ? "" : selectedTujuan.value.address);
    contentDoc = contentDoc.replaceAll('{tanggal}', setFormatDate());
    contentDoc = contentDoc.replaceAll('{nomor}', inputForm.document_no);
    contentDoc = contentDoc.replaceAll('{sifat_surat}', inputForm.document_nature.name_document_nature);
    contentDoc = contentDoc.replaceAll('{lampiran}', (inputForm.attachment.length + inputForm.attachment_avail.length) === 0 ? "-" : inputForm.attachment.length + inputForm.attachment_avail.length);
    // contentDoc = contentDoc.replaceAll('{lampiran}', myTarget.attachment.length === 0 ? '-' : myTarget.attachment.length);
    contentDoc = contentDoc.replaceAll('{tembusan}', selectTembusan.value.length === 0 ? '' : setTextList(selectTembusan.value));
    contentDoc = contentDoc.replaceAll('{up}', inputForm.up);
    contentDoc = contentDoc.replaceAll('{signer}', setTextSigner(selectSigner.value));
    contentDoc = contentDoc.replaceAll('{tujuan_terlampir}', selectedTujuan.value.length > 1 ? setTextTujuan(selectedTujuan.value) : "");
    // contentDoc = contentDoc.replaceAll('{note_sign}', props.formData.need_sign === 1 ? "Dokumen ini ditandatangani secara elektronik." : " ");
    if (Object.keys(dataBlotter.value).length === 0 && props.formData.template.name === 'Blotter') {
        toast.add({ severity: 'error', summary: 'Blotter', detail: 'Template Blotter harus diisi', life: 3000 });
    } else {
        contentDoc = contentDoc.replaceAll('{date_blotter}', tempInputDateBlotter.date === null ? "" : setFormatDate(tempInputDateBlotter.date));
        contentDoc = contentDoc.replaceAll('{fund_blotter}', tempInputBlotterFund.fund_type === null ? "" : tempInputBlotterFund.fund_type.name);
        contentDoc = contentDoc.replaceAll('{ins_blotter}', tempInputBlotterIns.ins_type === null ? "" : tempInputBlotterIns.ins_type.name);
    }
    // contentDoc = contentDoc.replaceAll('{{signer}}', setTextTable(inputForm.signer));
    for (let i = 0; i < dataForm.value.length; i++) {
        const element = dataForm.value[i];
        const inputType = dataForm.value[i].type
        switch (inputType) {
            case "1":
                contentDoc = contentDoc.replaceAll('{' + element.param + '}', element.value);
                break;

            case "2":
                contentDoc = contentDoc.replaceAll('{' + element.param + '}', setFormatDateOnly(element.value));
                break;

            case "3":
                contentDoc = contentDoc.replaceAll('{' + element.param + '}', setTextTable(element.value));
                break;

            case "5":
                contentDoc = contentDoc.replaceAll('{' + element.param + '}', setFormatDate(element.value));
                break;

            case "7":
                contentDoc = contentDoc.replaceAll('{' + element.param + '}', setBlotterPreview(dataBlotter.value));
                break;

            case "8":
                contentDoc = contentDoc.replaceAll('{' + element.param + '}', setFormatDateLooping(element.value));
                break;

            case "9":
                contentDoc = contentDoc.replaceAll('{' + element.param + '}', setOption(element.value));
                break;

            default:
                contentDoc = contentDoc.replaceAll('{' + element.param + '}', element.value);
                break;
        }
        // contentDoc = contentDoc.replaceAll('{{'+element.parameter+'}}', element.value);
    }
    return contentDoc
}

// const setTextTujuan = (data) => {
//     return `<span>${data.name}</span><br><span>${data.alamat}</span>`;
// }
const setOption = (data) => {
    // let data = optionSigner.value;
    let html;
    const element = data;
    html = `<a>${element.type_cuti}</a>`;

    return html;
}

const setTextTujuan = (data) => {
    // let data = optionSigner.value;
    let html;
    html = '<p>Tujuan : </p>';
    html += `<ol>`;
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        html += '<li>';
        html += `<span>${element.user_name}</span><span> (${element.address})</span>`;
        html += '</li>';
    }
    html += `</ol>`;
    return html;
}

const setFormatDateDisplayInput = (date) => {
    if (typeof date === 'string') {
        date = new Date(date)
    }

    return date;
}
const setFormatDateLooping = (date) => {
    let html;
    html = `<ol>`;
    date.map((date, index) => {
        let tahun = date.getFullYear();
        let bulan = date.getMonth();
        let tanggal = date.getDate();
        switch (bulan) {
            case 0: bulan = "Januari"; break;
            case 1: bulan = "Februari"; break;
            case 2: bulan = "Maret"; break;
            case 3: bulan = "April"; break;
            case 4: bulan = "Mei"; break;
            case 5: bulan = "Juni"; break;
            case 6: bulan = "Juli"; break;
            case 7: bulan = "Agustus"; break;
            case 8: bulan = "September"; break;
            case 9: bulan = "Oktober"; break;
            case 10: bulan = "November"; break;
            case 11: bulan = "Desember"; break;
        }
        let tampilTanggal = tanggal + " " + bulan + " " + tahun;

        html += '<li>';
        html += `${tampilTanggal}`;
        html += '</li>';
    })

    html += `</ol>`;
    return html;
}
const setFormatDateOnly = (date) => {
    // let date = new Date();
    let tahun = date.getFullYear();
    let bulan = date.getMonth();
    let tanggal = date.getDate();
    switch (bulan) {
        case 0: bulan = "Januari"; break;
        case 1: bulan = "Februari"; break;
        case 2: bulan = "Maret"; break;
        case 3: bulan = "April"; break;
        case 4: bulan = "Mei"; break;
        case 5: bulan = "Juni"; break;
        case 6: bulan = "Juli"; break;
        case 7: bulan = "Agustus"; break;
        case 8: bulan = "September"; break;
        case 9: bulan = "Oktober"; break;
        case 10: bulan = "November"; break;
        case 11: bulan = "Desember"; break;
    }
    let tampilTanggal = tanggal + " " + bulan + " " + tahun;

    return tampilTanggal;
}
const setFormatDateNumber = (date) => {
    var d = new Date(date),
        bulan = '' + (d.getMonth() + 1),
        tanggal = '' + d.getDate(),
        tahun = d.getFullYear();

    if (bulan.length < 2)
        bulan = '0' + bulan;
    if (tanggal.length < 2)
        tanggal = '0' + tanggal;

    inputBlotter.date = [tahun, bulan, tanggal].join('-');
}
const setFormatDate = (data) => {
    let date = data ? new Date(data) : new Date();
    let tahun = date.getFullYear();
    let bulan = date.getMonth();
    let tanggal = date.getDate();
    let hari = date.getDay();
    switch (hari) {
        case 0: hari = "Minggu"; break;
        case 1: hari = "Senin"; break;
        case 2: hari = "Selasa"; break;
        case 3: hari = "Rabu"; break;
        case 4: hari = "Kamis"; break;
        case 5: hari = "Jum'at"; break;
        case 6: hari = "Sabtu"; break;
    }
    switch (bulan) {
        case 0: bulan = "Januari"; break;
        case 1: bulan = "Februari"; break;
        case 2: bulan = "Maret"; break;
        case 3: bulan = "April"; break;
        case 4: bulan = "Mei"; break;
        case 5: bulan = "Juni"; break;
        case 6: bulan = "Juli"; break;
        case 7: bulan = "Agustus"; break;
        case 8: bulan = "September"; break;
        case 9: bulan = "Oktober"; break;
        case 10: bulan = "November"; break;
        case 11: bulan = "Desember"; break;
    }
    let tampilTanggal = hari + ", " + tanggal + " " + bulan + " " + tahun;

    return tampilTanggal;
}

const setTextSigner = (data) => {
    let html = `<table style="width:100%"><tr>`;

    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        html += `<td style="padding-right: 20px;">`; // Add padding between each column

        // If speciment exists, display the image; otherwise, display an empty placeholder
        if (props.formData.need_sign === '1') {
            if (element.speciment) {
                html += `<img src="${element.speciment}" width="158" height="87" style="display: block; margin-bottom: 5px;"/>`;
            } else {
                html += `<div style="width: 158px; height: 87px;  display: block; margin-bottom: 5px;"></div>`; // Placeholder
            }
        } else {
            html += `<div style="width: 158px; height: 87px;  display: block; margin-bottom: 5px;"></div>`; // Placeholder
        }

        html += `
            <p class="mb-0" style="${element.position !== 'External' ? 'text-decoration: underline;' : ''} font-weight: bold; margin-top: 5px;">${element.user_name}</p>
            ${element.position !== 'External' ? element.position : ''}
        </td>
        `;
    }
    html += `</tr></table>`;
    return html;
}

const setTextTable = (data) => {
    // let data = optionSigner.value;
    let html = `<table style="width:50%">`;
    let header = Object.keys(data[0]); //['name', 'jabatan', 'id']

    //set header table
    html += '<tr>';
    header.forEach(el => {
        html += `<th>${el}</th>`;
    });
    html += '</tr>';

    //set body table
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        // if (i === 0) {
        html += '<tr>';
        header.forEach(el => {
            html += `<td>${element[el]}</td>`;
        });
        html += '</tr>';
    }
    html += `</table>`;
    return html;
}

const handleAddTujuan = (event) => {
    inputFormTujuan.user_type = "2"
    inputFormTujuan.status = "1"
    suratService.addTujuan(inputFormTujuan).then((res) => {
        getListTujuan()
        getListTembusan()
        op.value.toggle(event);
        inputFormTujuan.name = ""
        inputFormTujuan.alamat = ""
    });
}

const setTextList = (data) => {
    // let data = optionSigner.value;
    let html;
    html = '<p>Tembusan : </p>';
    html += `<ol>`;
    let header = Object.keys(data[0]); //['name', 'jabatan', 'id']

    //set header table
    // html += '<tr>';
    //     header.forEach(el => {
    //         html += `<th>${el}</th>`;
    // });
    // html += '</tr>';

    //set body table
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        // if (i === 0) {
        html += '<li>';
        // header.forEach(el => {
        html += `${element.user_name}`;
        // });
        html += '</li>';
    }
    html += `</ol>`;
    return html;
}

// HELPERS BLOTTER
const formatPriceDataBlotter = (data) => {
    let number_string = data.toString()
    let split = number_string.split(',')
    let sisa = split[0].length % 3
    let rupiah = split[0].substr(0, sisa)
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah;
}
const totalPriceDataBlotter = (data) => {
    let total = data.reduce((n, { amount }) => n + amount, 0)
    let number_string = total.toString()
    let split = number_string.split(',')
    let sisa = split[0].length % 3
    let rupiah = split[0].substr(0, sisa)
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah;
}
const checkDataBlotter = () => {
    tempInputDateBlotter.date = inputBlotter.date
    setFormatDateNumber(inputBlotter.date)
    suratService.postBlotter(inputBlotter).then((res) => {
        if (res.data.length === 0) {
            toast.add({ severity: 'error', summary: 'Data Kosong', detail: 'Data Blotter Tidak ada', life: 3000 });
        } else {
            dataBlotter.value = res.data
        }
    });
}
const resetDataBlotter = () => {
    dataBlotter.value = []
}
// END HELPERS BLOTTER

// BLOTTER CONTENT
const setBlotterTable = (datax) => {
    let insType = inputBlotter.ins_type;
    let table = ` <table style="border:none;border-collapse:collapse;width: 100%;">`;
    if (insType === 1) {
        table += `    <colgroup>
    										<col width="64">
    										<col width="63">
    										<col width="104">
    										<col width="126">
    										<col width="141">
    										<col width="95">
    									</colgroup>`;
    } else if (insType === 2 || insType === 3) {
        table += `    <colgroup>
                        <col width="45">
                        <col width="39">
                        <col width="30">
                        <col width="63">
                        <col width="55">
                        <col width="52">
                        <col width="89">
                        <col width="46">
                        <col width="50">
    									</colgroup>`;
    } else {
        table += `    <colgroup>
    										<col width="64">
    										<col width="63">
    										<col width="104">
    										<col width="63">
    										<col width="63">
    										<col width="141">
    										<col width="95">
    									</colgroup>`;
    }

    table += `    <thead>
    										<tr style="height:0pt">
    											<th style="border-left:solid #000000 1pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
    												<p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
    													<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; white-space: pre-wrap;">Ticket ID</span>
    												</p>
    											</th>`;

    if (insType === 1) {
        table += `        <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Stock ID</span>
                            </p>
                          </th>
                          <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Volume</span>
                            </p>
                          </th>
                          <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Price</span>
                            </p>
                          </th>`;
    } else if (insType === 2 || insType === 3) {
        table += `        <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Bond ID</span>
                            </p>
                          </th>
                          <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Nominal</span>
                            </p>
                          </th>
                          <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Price</span>
                            </p>
                          </th>
                          <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Coupon %</span>
                            </p>
                          </th>
                          <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Yield %</span>
                            </p>
                          </th>`;
    } else {
        table += `        <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Bank ID</span>
                            </p>
                          </th>
                          <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Nominal</span>
                            </p>
                          </th>
                          <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Value Date</span>
                            </p>
                          </th>
                          <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Maturity Date</span>
                            </p>
                          </th>`;
    }

    table += `          <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Amount</span>
                            </p>
                          </th>`;

    if (insType === 1) {
        table += `        <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 1pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Order Type</span>
                            </p>
                          </th>
                        </tr>
                      </thead>`;
    } else if (insType === 2 || insType === 3) {
        table += `        <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Settlement Date</span>
                            </p>
                          </th>
                          <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 1pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Last Coupon Date</span>
                            </p>
                          </th>
                        </tr>
                      </thead>`;
    } else {
        table += `        <th style="border-left:solid #000000 0.5pt;border-right:solid #000000 1pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 1pt;vertical-align:top;overflow:hidden;overflow-wrap:break-word;">
                            <p dir="ltr" style="line-height:1.2;text-align: center;margin-top:0pt;margin-bottom:0pt;">
                              <span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Int. Percent</span>
                            </p>
                          </th>
                        </tr>
                      </thead>`;
    }
    datax.forEach((el) => {
        table += `<tbody><tr style="height:0pt">
    												<td style="border-left:solid #000000 1pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<p dir="ltr" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;">
    														<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${el.ticket_id}</span>
    													</p>
    												</td>`;

        if (insType === 2 || insType === 3) {
            table += `          
    												<td style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<p dir="ltr" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;">
    														<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${el.bond_id}</span>
    													</p>
    												</td>`;
        } else {
            table += `          
    												
          <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<p dir="ltr" style="line-height:1.2;text-align: left;margin-top:0pt;margin-bottom:0pt;">
    														<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${el.stock_id}</span>
    													</p>
    												</td>`;
        }

        table += `          
    												<td style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<p dir="ltr" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;">
    														<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${formatPriceDataBlotter(
            el.volume_share
        )}</span>
    													</p>
    												</td>`;

        if (insType === 1) {
            table += `          <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<p dir="ltr" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;">
    														<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${formatPriceDataBlotter(
                el.price
            )}</span>
    													</p>
    												</td>`;
        } else if (insType === 2 || insType === 3) {
            table += `          <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<p dir="ltr" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;">
    														<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${el.price}</span>
    													</p>
    												</td>
                            <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<p dir="ltr" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;">
    														<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${el.coupon_percent}</span>
    													</p>
    												</td>
                            <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<p dir="ltr" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;">
    														<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${el.yield_percent}</span>
    													</p>
    												</td>`;
        } else {
            table += `          <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<p dir="ltr" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;">
    														<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${setFormatDate(
                el.value_date
            )}</span>
    													</p>
    												</td>
                            <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<p dir="ltr" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;">
    														<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${setFormatDate(
                el.maturity_date
            )}</span>
    													</p>
    												</td>`;
        }
        table += `				  <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<p dir="ltr" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;">
    														<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${formatPriceDataBlotter(
            el.amount
        )}</span>
    													</p>
    												</td>`;
        if (insType === 1) {
            table += `				  <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 1pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${typeof el.order_type === "undefined"
                    ? ""
                    : el.order_type
                }</span>
    												</td>
    											</tr>`;
        } else if (insType === 2 || insType === 3) {
            table += `				  <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 0.5pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${setFormatDate(
                el.settled_date
            )}</span>
    												</td>
                            <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 1pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${setFormatDate(
                el.last_coupon_date
            )}</span>
    												</td>
    											</tr>`;
        } else {
            table += `				  <td style="border-left:solid #000000 0.5pt;border-right:solid #000000 1pt;border-bottom:solid #000000 0.5pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    													<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${el.int_percent}</span>
    												</td>
    											</tr>`;
        }
    });

    table += `<tr style="height:0pt">
    											<td style="border-left:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    												<br>
    											</td>
    											<td style="border-bottom:solid #000000 1pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    												<p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
    													<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Total</span>
    												</p>
    											</td>
    											<td style="border-bottom:solid #000000 1pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    												<p dir="ltr" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;">
    													<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${totalPriceDataBlotter(
        datax,
        "volume"
    )}</span>
    												</p>
    											</td>
    											<td style="border-bottom:solid #000000 1pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    												<br>
    											</td>`;

    if (insType === 5) {
        table += `
                          <td style="border-bottom:solid #000000 1pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    												<br>
    											</td>`;
    }
    if (insType === 2 || insType === 3) {
        table += `
                          <td style="border-bottom:solid #000000 1pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    												<br>
    											</td>
                          <td style="border-bottom:solid #000000 1pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    												<br>
    											</td>`;
    }

    table += `<td style="border-bottom:solid #000000 1pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    												<p dir="ltr" style="line-height:1.2;text-align: right;margin-top:0pt;margin-bottom:0pt;">
    													<span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">${totalPriceDataBlotter(
        datax,
        "amount"
    )}</span>
    												</p>
    											</td>`;
    if (insType === 2 || insType === 3) {
        table += `
                          <td style="border-bottom:solid #000000 1pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    												<br>
    											</td>`;
    }
    table += `
    											<td style="border-right:solid #000000 1pt;border-bottom:solid #000000 1pt;border-top:solid #000000 0.5pt;vertical-align:middle;padding:0pt 5pt 0pt 5pt;overflow:hidden;overflow-wrap:break-word;">
    												<br>
    											</td></tr>
    									</tbody>
    								</table>`;

    return table;
}
const setBlotterPreview = (data) => {
    // // console.log(data, "SET TEM");
    let html = "";
    if (typeof data.buy !== "undefined" && data.buy.length > 0) {
        html += `<div dir="ltr" style="margin-left:0pt;" align="left">
                <table style="border:none;border-collapse:collapse;">
                    <colgroup>
                    <col width="115">
                    <col width="17">
                    <col width="469">
                    </colgroup>
                    <tbody>
                    <tr style="height:0pt">
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 0pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Tipe Transaksi</span>
                        </p>
                        </td>
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">:</span>
                        </p>
                        </td>
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Buy</span>
                        </p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
                <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">
                ${setBlotterTable(data.buy)}
                </p>`;
    }

    if (typeof data.sell !== "undefined" && data.sell.length > 0) {
        html += `<div dir="ltr" style="margin-left:0pt;" align="left">
                <table style="border:none;border-collapse:collapse;">
                    <colgroup>
                    <col width="115">
                    <col width="17">
                    <col width="469">
                    </colgroup>
                    <tbody>
                    <tr style="height:0pt">
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 0pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Tipe Transaksi</span>
                        </p>
                        </td>
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">:</span>
                        </p>
                        </td>
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Sell</span>
                        </p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
                <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">
                ${setBlotterTable(data.sell)}
                </p>`;
    }

    if (typeof data.rollover !== "undefined" && data.rollover.length > 0) {
        html += `<div dir="ltr" style="margin-left:0pt;" align="left">
                <table style="border:none;border-collapse:collapse;">
                    <colgroup>
                    <col width="115">
                    <col width="17">
                    <col width="469">
                    </colgroup>
                    <tbody>
                    <tr style="height:0pt">
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 0pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Tipe Transaksi</span>
                        </p>
                        </td>
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">:</span>
                        </p>
                        </td>
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Rollover</span>
                        </p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
                <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">
                ${setBlotterTable(data.rollover)}
                </p>`;
    }

    if (typeof data.placement !== "undefined" && data.placement.length > 0) {
        html += `<div dir="ltr" style="margin-left:0pt;" align="left">
                <table style="border:none;border-collapse:collapse;">
                    <colgroup>
                    <col width="115">
                    <col width="17">
                    <col width="469">
                    </colgroup>
                    <tbody>
                    <tr style="height:0pt">
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 0pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Tipe Transaksi</span>
                        </p>
                        </td>
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">:</span>
                        </p>
                        </td>
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Placement</span>
                        </p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
                <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">
                ${setBlotterTable(data.placement)}
                </p>`;
    }

    if (typeof data.liquidate !== "undefined" && data.liquidate.length > 0) {
        html += `<div dir="ltr" style="margin-left:0pt;" align="left">
                <table style="border:none;border-collapse:collapse;">
                    <colgroup>
                    <col width="115">
                    <col width="17">
                    <col width="469">
                    </colgroup>
                    <tbody>
                    <tr style="height:0pt">
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 0pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Tipe Transaksi</span>
                        </p>
                        </td>
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">:</span>
                        </p>
                        </td>
                        <td style="vertical-align:top;padding:5pt 5pt 5pt 5pt;overflow:hidden;overflow-wrap:break-word;">
                        <p dir="ltr" style="line-height:1.2;margin-top:0pt;margin-bottom:0pt;">
                            <span style="font-size: 10pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0); background-color: transparent; font-weight: 700; font-variant-numeric: normal; font-variant-east-asian: normal; vertical-align: baseline; white-space: pre-wrap;">Liquidate</span>
                        </p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
                <p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;">
                ${setBlotterTable(data.liquidate)}
                </p>`;
    }

    let notesList = setBlotterNote(data);
    let notes = setNotes(notesList);
    html += notes
    return html;
}
const setBlotterNote = (data) => {
    let dataNotes = [];
    if (typeof data.buy !== "undefined" && data.buy.length > 0) {
        dataNotes = [...dataNotes, ...data.buy];
        // // console.log(dataNotes);
    }

    if (typeof data.sell !== "undefined" && data.sell.length > 0) {
        dataNotes = [...dataNotes, ...data.sell];
    }

    if (typeof data.rollover !== "undefined" && data.rollover.length > 0) {
        dataNotes = [...dataNotes, ...data.rollover];
    }

    if (typeof data.placement !== "undefined" && data.placement.length > 0) {
        dataNotes = [...dataNotes, ...data.placement];
    }

    if (typeof data.liquidate !== "undefined" && data.liquidate.length > 0) {
        dataNotes = [...dataNotes, ...data.liquidate];
    }

    return dataNotes;
}
const setNotes = (datax) => {
    let text = `<p style='font-weight: bolder; font-size: 14px; margin-top: 6px;'>Note : </p>
                    <ul style="list-style: none;padding-left: 0px;color: #000;">`;
    datax.forEach((el) => {
        if (el.investment_notes !== "") {
            text += `<li><span style="font-size: 8pt; font-family: Arial, Helvetica, sans-serif; color: rgb(0, 0, 0);"><b style="font-size: 8pt;">${el.trx_type} ${el.stock_id}: </b> ${el.investment_notes}</span></li>`;
        }
    });
    text += "</ul>";
    return text;
}

const validasiLimitTanggalCuti = (data) => {
    if (data.length <= totalSisaCuti.value) {
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Tanggal berhasil dipilih.', life: 2000 });
    } else if (data.length <= props.formData.total_cuti) {
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Tanggal berhasil dipilih.', life: 2000 });
    } else {
        data.splice(-1)
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Pilihan tanggal melebihi sisa cuti.', life: 3000 });
    }
}

const validasiLimitTanggalCutiMulti = (data) => {
    const filteredData = dataForm.value.filter(item => item.type === '9');
    const typeCutis = filteredData.map(item => item.value.type);

    if (typeCutis[0] === 11 && totalSisaCuti.value < 4) {
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Tanggal berhasil dipilih.', life: 2000 });
    } else if (data.length <= totalSisaCuti.value) {
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Tanggal berhasil dipilih.', life: 2000 });
    } else {
        data.splice(-1)
        toast.add({ severity: 'error', summary: 'Gagal', detail: 'Pilihan tanggal melebihi sisa cuti.', life: 3000 });
    }
}
// END BLOTTER CONTENT

// SETGET OPTIONS BLOTTER INSTRUMENT TYPE
const getBlotterInstrumentType = () => {
    divisiService.getListAll().then((data) => {
        optionDivisi.value = data;
    });
}
const setBlotterInstrumentType = (event) => {
    dataBlotter.value = []
    tempInputBlotterIns.ins_type = event.value
    inputBlotter.ins_type = event.value.type
};
// SETGEN GET OPTIONS BLOTTER INSTRUMENT TYPE

// SETGET OPTIONS BLOTTER FUND TYPE
const getBlotterFundType = () => {
    divisiService.getListAll().then((data) => {
        optionDivisi.value = data;
    });
}
const setBlotterFundType = (event) => {
    dataBlotter.value = []
    tempInputBlotterFund.fund_type = event.value
    inputBlotter.fund_type = event.value.type
};
// SETGEN GET OPTIONS BLOTTER FUND TYPE

// FILE
const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};
const onRemoveSuratFileEdit = (data) => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Hapus Attachment!',
        text: "Anda yakin ingin menghapus attachment?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        // reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            suratService.removeSuratEdit(data).then((res) => {
                if (!res.error) {
                    let myTarget = JSON.parse(JSON.stringify(inputForm.attachment_avail))
                    let filtered = myTarget.filter((el) => {
                        return el.id != data.id;
                    });
                    inputForm.attachment_avail = filtered
                } else {
                    toast.add({ severity: 'danger', summary: 'Error', detail: 'Gagal hapus', life: 3000 });
                }
            });
        }
    })


}
const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
// END FILE

const checkValidate = () => {
    if (
        !inputForm.perihal ||
        !selectedTujuan.value ||
        !selectSigner.value.length ||
        !selectVerificator.value ||
        !selectedSifatSurat.value
    ) {
        return false
    } else {
        return true
    }
}

const nextPage = async () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    if (Object.keys(dataBlotter.value).length === 0 && props.formData.template.name === 'Blotter') {
        toast.add({ severity: 'error', summary: 'Blotter', detail: 'Template Blotter harus diisi', life: 3000 });
    } else {
        const check = checkValidate()
        submitted.value = true

        const usersWithoutSpeciment = inputForm.signer.filter(user => !user.speciment);

        if (usersWithoutSpeciment.length > 0) {
            // Buat teks daftar nama pengguna tanpa speciment
            const userList = usersWithoutSpeciment
                .map((user, index) => `${index + 1}. ${user.user_name}`)
                .join('<br />');

            // Tampilkan dialog konfirmasi
            const result = await swalWithBootstrapButtons.fire({
                title: 'Informasi',
                html: `Berikut ini belum memiliki spesimen tanda tangan:<br />${userList}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Lanjuti',
                cancelButtonText: 'Batal',
                reverseButtons: true
            });

            // Jika pengguna memilih "Batal", hentikan eksekusi
            if (result.isDismissed) {
                return;
            }
        }

        if (check !== false) {
            const contentDoc = setContent();

            emit("next-page", {
                formData: {
                    document_id: paramId,
                    document_no: inputForm.document_no,
                    divisi: selectedDivisi,
                    receiver: selectedTujuan,
                    signer: selectSigner,
                    verificator: selectVerificator,
                    perihal: inputForm.perihal,
                    tembusan: selectTembusan,
                    attachment: inputForm.attachment,
                    attachment_avail: inputForm.attachment_avail,
                    content: contentDoc,
                    // status: '1',
                    is_reply: "1",
                    document_nature: selectedSifatSurat,
                    need_attach: "0",
                    // need_sign: "0",
                    data_form: dataForm
                },
                pageIndex: 1,
            });
            submitted.value = true
        } else {
            window.scrollTo(0, 180);
            // console.log("masuk");
            // swal.fire({
            //     icon: 'error',
            //     text: 'Input Kosong, cek kembali input anda.',
            //     showConfirmButton: false,
            //     timer: 1500
            // })
        }
    }
};

const prevPage = () => {
    emit("prev-page", {
        pageIndex: 1,
        document_id: paramId
    });
};
</script>
<template>
    <Toast />
    <div class="stepsdemo-content">
        <Card class="mt-3">
            <template v-slot:title>
                Input Form
            </template>
            <template v-slot:subtitle>
                <i>Enter form details template</i>
            </template>
            <!-- <template v-slot:subtitle>
                Enter form details template {{ props.formData.template.id }} {{ props.formData }} {{ dataForm }}
            </template> -->
            <template v-slot:content>
                <div class="p-fluid formgrid grid mt-3">
                    <div class="field col-12 md:col-6">
                        <label for="perihal">Nomor Surat</label>
                        <InputText id="perihal" type="text" v-model="inputForm.document_no" disabled />
                    </div>
                </div>
                <div class="p-fluid formgrid grid mt-3">
                    <div class="field col-12 md:col-12">
                        <label for="perihal">Perihal</label>
                        <InputText id="perihal" type="text" v-if="formData.template.category_name === 'Izin'"
                            v-model="inputForm.perihal" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !inputForm.perihal }" disabled />
                        <InputText id="perihal" type="text" v-else v-model="inputForm.perihal" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !inputForm.perihal }" />
                        <small class="p-error" v-if="!inputForm.perihal">Perihal is required.</small>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="divisi">Divisi</label>
                        <MultiSelect inputId="divisi" v-model="selectedDivisi" display="chip" :options="optionDivisi"
                            @change="setDivisi($event)" optionLabel="name" placeholder="Pilih Divisi" required="true"
                            autofocus :class="{ 'p-invalid': submitted && !selectedDivisi }" />
                        <small class="p-error" v-if="submitted && !selectedDivisi">Divisi is required.</small>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="tujuan">Tujuan</label>
                        <div class="p-inputgroup flex-1">
                            <MultiSelect inputId="tujuan" display="chip" v-model="selectedTujuan"
                                :options="optionTujuan" @change="setTujuan($event)" optionLabel="user_name"
                                placeholder="Pilih Tujuan" filter panelClass="custom-panel" required="true" autofocus
                                :class="{ 'p-invalid': submitted && !selectedTujuan }" />
                        </div>
                        <small class="p-error" v-if="submitted && !selectedTujuan">Tujuan is required.</small>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="signer">Penandatangan {{ }}</label>
                        <MultiSelect inputId="signer" v-model="selectSigner" display="chip" :options="optionSigner"
                            @change="setSigner($event)" optionLabel="user_name" placeholder="Pilih Penandatangan" />
                        <small class="p-error" v-if="submitted && !selectSigner">Penandatangan is required.</small>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="verificator">Verificator</label>
                        <Dropdown inputId="verificator" :disabled="formData.status === '1'" v-model="selectVerificator"
                            :options="optionVerif" @change="setVerificator($event)" optionLabel="user_name" filter
                            panelClass="custom-panel" placeholder="Pilih Verificator">
                            <template #value="slotProps">
                                <div v-tooltip.bottom="slotProps.value.user_id" v-if="slotProps.value"
                                    class="flex align-items-center">
                                    <div>{{ slotProps.value.user_name }}</div>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                            <template #option="slotProps">
                                <div v-tooltip.bottom="slotProps.option.address"
                                    class="flex align-items-center py-2 px-4">
                                    <div>{{ slotProps.option.user_name }}</div>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="tembusan">Tembusan {{ }}</label>
                        <MultiSelect inputId="divisi" v-model="selectTembusan" display="chip" :options="optionTembusan"
                            @change="setTembusan($event)" optionLabel="user_name" placeholder="Pilih Tembusan" />
                        <!-- <InputText for="tembusan" type="text" v-model="inputForm.tembusan" /> -->
                    </div>
                   
                    <div class="field col-12 md:col-6">
                        <label for="document_nature">Sifat Surat</label>
                        <Dropdown inputId="document_nature" v-model="selectedSifatSurat" display="chip"
                            :options="optionSifatSurat" @change="setSifatSurat($event)"
                            optionLabel="name_document_nature" placeholder="Pilih Sifat Surat" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !selectedSifatSurat }" />
                        <small class="p-error" v-if="submitted && !selectedSifatSurat">Sifat Surat is required.</small>
                    </div>

                    <div class="field col-12">
                        <label for="tembusan">Attachment</label>
                        <FileUpload @select="onSelectFile($event)" :multiple="true" accept="application/pdf"
                            :maxFileSize="1000000">
                            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                                    <div class="flex gap-2">
                                        <Button @click="chooseCallback()" icon="pi pi-upload" style="padding: 6px 20px;"
                                            outlined>Choose</Button>
                                        <!-- <Button @click="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" rounded outlined severity="success" :disabled="!files || files.length === 0"></Button> -->
                                        <!-- <Button @click="clearCallback()" icon="pi pi-times" style="padding: 6px 20px;" outlined severity="danger" :disabled="!files || files.length === 0">Clear</Button> -->
                                    </div>
                                    <!-- <ProgressBar :value="totalSizePercent" :showValue="false" :class="['md:w-20rem h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]"
                                        ><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar
                                    > -->
                                </div>
                            </template>
                            <template
                                #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                                <p v-if="inputForm.attachment_avail.length !== 0" class="font-semibold">
                                    File Uploaded
                                </p>
                                <div class="p-0 sm:p-5 sm:pb-2 sm:pt-0 gap-5">
                                    <div v-for="(fileData, index) of inputForm.attachment_avail" :key="index"
                                        class="card m-0 px-6 grid border-1 surface-border align-items-center my-2">
                                        <div class="col-8">
                                            <span class="font-semibold">{{ fileData.asset_url }}</span>
                                            <div>{{ fileData.size ? formatSize(fileData.size) : '' }}</div>
                                        </div>
                                        <div class="col-3">
                                            <Badge value="Uploaded" severity="success" />
                                        </div>
                                        <div class="col-1">
                                            <Button icon="pi pi-times" outlined @click="onRemoveSuratFileEdit(fileData)"
                                                severity="danger"
                                                style="width: 100%; background-color: #D32F2F; border: none; color: white;" />
                                        </div>
                                    </div>
                                </div>

                                <p v-if="inputForm.attachment.length !== 0" class="mt-3 font-semibold">
                                    File Pending
                                </p>
                                <div class="p-0 sm:p-5 sm:pb-2 sm:pt-0 gap-5">
                                    <div v-for="(file, index) of inputForm.attachment"
                                        :key="file.name + file.type + file.size"
                                        class="card m-0 px-6 grid border-1 surface-border align-items-center my-2">
                                        <div class="col-8">
                                            <span class="font-semibold">{{ file.name }}</span>
                                            <div>{{ file.size ? formatSize(file.size) : '' }}</div>
                                        </div>
                                        <div class="col-3">
                                            <Badge value="Pending" severity="warning" />
                                        </div>
                                        <div class="col-1">
                                            <Button icon="pi pi-times"
                                                @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                                                outlined severity="danger"
                                                style="width: 100%; background-color: #D32F2F; border: none; color: white;" />
                                        </div>
                                    </div>
                                </div>
                                <!-- </div> -->

                                <!-- <div v-if="uploadedFiles.length > 0">
                                    <h5>Completed</h5>
                                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                                        <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3">
                                            <div>
                                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" class="shadow-2" />
                                            </div>
                                            <span class="font-semibold">{{ file.name }}</span>
                                            <div>{{ formatSize(file.size) }}</div>
                                            <Badge value="Completed" class="mt-3" severity="success" />
                                            <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded  severity="danger" />
                                        </div>
                                    </div>
                                </div> -->
                            </template>
                            <template #empty>
                                <p>Drag and drop files to here to upload.</p>
                            </template>
                        </FileUpload>
                    </div>
                    <!-- <div class="field-checkbox col-12">
                        <Checkbox id="remember" v-model="remember" :binary="true" />
                        <label for="remember" class="p-checkbox-label">Save credit card information for future</label>
                    </div> -->
                    <template v-for="(item, idx) in dataForm" :key="idx">
                        <div class="field col-12 md:col-6">
                            <label v-if="item.type !== '7'" :for="item.parameter">{{ item.label }}</label>
                            <InputText v-if="item.type === '1' & props.formData.template.name !== 'Template Izin Cuti'"
                                :id="item.parameter" type="text" v-model="item.value" autofocus
                                :class="{ 'p-invalid': submitted && !item.value }" />
                            <Calendar
                                v-if="(item.type === '2' || item.type === '5') && props.formData.template.name !== 'Permohonan Cuti Panjang'"
                                :id="item.parameter" v-model="item.value" autofocus
                                :class="{ 'p-invalid': submitted && !item.value }" />
                            <Calendar
                                v-if="(item.type === '2' || item.type === '5') && props.formData.template.name === 'Permohonan Cuti Panjang'"
                                :id="item.parameter" v-model="item.value" autofocus
                                :class="{ 'p-invalid': submitted && !item.value }" />
                            <Calendar v-if="item.type === '8' && props.formData.template.name === 'Template Izin Cuti'"
                                :id="item.parameter" :minDate="minDate" v-model="item.value" selectionMode="multiple"
                                @date-select="validasiLimitTanggalCuti(item.value)" autofocus
                                :class="{ 'p-invalid': submitted && !item.value }" />
                            <Calendar v-if="item.type === '8' && props.formData.template.name === 'Izin Sakit'"
                                :id="item.parameter" :minDate="minDate" v-model="item.value" selectionMode="multiple"
                                autofocus :class="{ 'p-invalid': submitted && !item.value }" />
                            <Calendar
                                v-if="item.type === '8' && props.formData.template.name !== 'Template Izin Cuti' && props.formData.template.name !== 'Permohonan Cuti' && props.formData.template.name !== 'Izin Sakit'"
                                :id="item.parameter" :minDate="minDate" v-model="item.value" selectionMode="multiple"
                                @date-select="validasiLimitTanggalCuti(item.value)" autofocus
                                :class="{ 'p-invalid': submitted && !item.value }" />
                            <Calendar
                                v-if="item.type === '8' && props.formData.template.name === 'Permohonan Cuti' && item.value.type !== '10'"
                                :id="item.parameter" :minDate="minDate" v-model="item.value" selectionMode="multiple"
                                @date-select="validasiLimitTanggalCutiMulti(item.value)" autofocus
                                :class="{ 'p-invalid': submitted && !item.value }" />
                            <Calendar
                                v-if="item.type === '8' && props.formData.template.name === 'Permohonan Cuti' && item.value.type === '10'"
                                :id="item.parameter" :minDate="minDate" v-model="item.value" selectionMode="multiple"
                                autofocus :class="{ 'p-invalid': submitted && !item.value }" />
                            <div v-if="props.formData.template.name === 'Template Izin Cuti'" class="mt-3"
                                style="background: rgba(4, 168, 59, 0.425)0000; border-radius: 6px">
                                <p class="p-2 py-1 font-bold">Sisa Total Cuti anda : {{ formData.total_cuti }} </p>
                            </div>

                            <MultiSelect v-if="item.type === '3'" :inputId="item.parameter" v-model="item.value"
                                display="chip" :options="optionSigner" optionLabel="user_name" placeholder="Pilih User"
                                autofocus :class="{ 'p-invalid': submitted && !item.value }" />
                            <Dropdown v-if="item.type === '9' && (props.formData.template.name === 'Permohonan Cuti')"
                                :inputId="item.parameter" v-model="item.value" display="chip" :options="optionTypeIzin"
                                optionLabel="type_cuti" @change="setTypeIzinNew($event)" placeholder="Pilih Cuti"
                                autofocus :class="{ 'p-invalid': submitted && !item.value }" />
                            <Dropdown
                                v-if="item.type === '9' && (props.formData.template.name === 'Permohonan Cuti Panjang')"
                                :inputId="item.parameter" v-model="item.value" display="chip" :options="optionTypeIzin"
                                optionLabel="type_cuti" @change="setTypeIzinNew($event)" placeholder="Pilih Cuti"
                                autofocus :class="{ 'p-invalid': submitted && !item.value }" />

                            <InputText v-if="item.type === '1' & props.formData.template.name === 'Template Izin Cuti'"
                                :id="tem.parameter" type="text" v-model="item.value" autofocus
                                :class="{ 'p-invalid': submitted && !item.value }" />
                            <div v-if="item.type === '9' && ((props.formData.template.name === 'Permohonan Cuti Panjang' || props.formData.template.name === 'Permohonan Cuti') && item.value.type !== 10)"
                                class="mt-3" style="background: rgba(4, 168, 59, 0.425)0000; border-radius: 6px">
                                <p class="p-2 py-1 font-bold">Max Jumlah / Default Cuti: {{ totalSisaCuti || 0 }} </p>
                            </div>
                            <!-- <div v-if="item.type === '9' && (props.formData.template.name === 'Permohonan Cuti Panjang' || props.formData.template.name === 'Permohonan Cuti')"
                                class="mt-3" style="background: rgba(4, 168, 59, 0.425)0000; border-radius: 6px">
                                <p class="p-2 py-1 font-bold">Sisa saldo cuti anda : {{ formData.total_cuti < 0 ? 0 :
                                    formData.total_cuti }} </p>
                            </div> -->

                            <small class="p-error" v-if="submitted && !item.value">{{ item.label }} is required.</small>
                        </div>

                        <div v-if="item.type === '4'" class="field col-12 md:col-12">
                            <ckeditor :editor="editor" v-model="item.value"></ckeditor>
                        </div>

                        <!-- FOR UPLOAD FILE -->
                        <div v-if="item.type === '6'" class="field col-12 md:col-12">
                            <FileUpload mode="basic" customUpload @select="onSelectFileTandatanganBasah"
                                accept="application/pdf" :maxFileSize="10000000" />
                        </div>
                        <!-- END FOR UPLOAD FILE -->

                        <!-- BLOTTER -->
                        <div v-if="item.type === '7'" class="field col-12 md:col-12">
                            <label :for="item.parameter">{{ item.label }}</label>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-2">
                                    <label for="date_blotter">Date</label>
                                    <Calendar :id="'date_blotter'" v-model="inputBlotter.date" />
                                </div>
                                <div class="field col-12 md:col-2">
                                    <label>Instrument Type</label>
                                    <Dropdown v-model="tempInputBlotterIns.ins_type" display="chip"
                                        :options="optionInstrumentType" @change="setBlotterInstrumentType($event)"
                                        optionLabel="name" placeholder="Pilih Instrument Type" />
                                </div>
                                <div class="field col-12 md:col-2">
                                    <label>Fund Type</label>
                                    <Dropdown v-model="tempInputBlotterFund.fund_type" display="chip"
                                        :options="optionFundType" @change="setBlotterFundType($event)"
                                        optionLabel="name" placeholder="Pilih Fund Type" />
                                </div>
                                <div class="field col-12 md:col-2">
                                    <label style="visibility: hidden;">-</label>
                                    <Button severity="success" label="Get Data" @click="checkDataBlotter()" />
                                </div>
                            </div>
                        </div>
                        <div v-if="item.type === '7' && Object.keys(dataBlotter).length !== 0"
                            class="field col-12 md:col-12">
                            <!-- TABLE EQUITY REGULER -->
                            <div class="p-fluid formgrid grid" v-if="inputBlotter.ins_type === 1">
                                <div class="field col-12 md:col-6">
                                    <label style="font-weight: bolder; font-size: 20px;">Buy</label>
                                    <DataTable class="p-datatable-buy" :value="dataBlotter.buy"
                                        tableStyle="min-width: 50rem">
                                        <Column field="ticket_id" header="ID" sortable></Column>
                                        <Column field="fund" header="Fund" sortable></Column>
                                        <Column field="stock_id" header="Stock"></Column>
                                        <Column field="price" header="Price" sortable></Column>
                                        <Column field="volume_share" header="Volume" sortable></Column>
                                        <Column field="amount" header="Amount" sortable></Column>
                                        <Column field="investment_notes" header="Notes" sortable></Column>
                                        <ColumnGroup type="footer" v-if="dataBlotter.hasOwnProperty('buy')">
                                            <Row>
                                                <Column :footer="'Total: ' + totalPriceDataBlotter(dataBlotter.buy)"
                                                    :colspan="7" footerStyle="text-align:right" />
                                            </Row>
                                        </ColumnGroup>
                                    </DataTable>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label style="font-weight: bolder; font-size: 20px;">Sell</label>
                                    <DataTable class="p-datatable-sell" :value="dataBlotter.sell"
                                        tableStyle="min-width: 50rem">
                                        <Column field="ticket_id" header="ID" sortable></Column>
                                        <Column field="fund" header="Fund" sortable></Column>
                                        <Column field="stock_id" header="Stock"></Column>
                                        <Column field="price" header="Price" sortable></Column>
                                        <Column field="volume_share" header="Volume" sortable></Column>
                                        <Column field="amount" header="Amount" sortable></Column>
                                        <Column field="investment_notes" header="Notes" sortable></Column>
                                        <ColumnGroup type="footer" v-if="dataBlotter.hasOwnProperty('sell')">
                                            <Row>
                                                <Column :footer="'Total: ' + totalPriceDataBlotter(dataBlotter.sell)"
                                                    :colspan="7" footerStyle="text-align:right" />
                                            </Row>
                                        </ColumnGroup>
                                    </DataTable>
                                </div>
                            </div>
                            <!-- END TABLE EQUITY REGULER -->

                            <!-- TABLE GOVERNMENT BOND -->
                            <div class="p-fluid formgrid grid" v-if="inputBlotter.ins_type === 2">
                                <div class="field col-12 md:col-12">
                                    <label style="font-weight: bolder; font-size: 20px;">Buy</label>
                                    <DataTable class="p-datatable-buy" :value="dataBlotter.buy"
                                        tableStyle="min-width: 50rem">
                                        <Column field="ticket_id" header="ID" sortable></Column>
                                        <Column field="fund" header="Fund" sortable></Column>
                                        <Column field="bond_id" header="Bond"></Column>
                                        <Column field="rating" header="Rating"></Column>
                                        <Column field="volume_share" header="Nominal" sortable></Column>
                                        <Column field="price" header="Price" sortable></Column>
                                        <Column field="coupon_percent" header="Coupon %" sortable></Column>
                                        <Column field="yield_percent" header="Yield %" sortable></Column>
                                        <Column field="amount" header="Amount" sortable></Column>
                                        <Column field="settled_date" header="Settlement Date" sortable></Column>
                                        <Column field="last_coupon_date" header="Last Coupon Date" sortable></Column>
                                        <ColumnGroup type="footer" v-if="dataBlotter.hasOwnProperty('buy')">
                                            <Row>
                                                <Column :footer="' '" :colspan="7" footerStyle="" />
                                                <Column :footer="'Total: '" footerStyle="" />
                                                <Column :footer="totalPriceDataBlotter(dataBlotter.buy)"
                                                    footerStyle="" />
                                            </Row>
                                        </ColumnGroup>
                                    </DataTable>
                                </div>
                                <div class="field col-12 md:col-12">
                                    <label style="font-weight: bolder; font-size: 20px;">Sell</label>
                                    <DataTable class="p-datatable-sell" :value="dataBlotter.sell"
                                        tableStyle="min-width: 50rem">
                                        <Column field="ticket_id" header="ID" sortable></Column>
                                        <Column field="fund" header="Fund" sortable></Column>
                                        <Column field="bond_id" header="Bond"></Column>
                                        <Column field="rating" header="Rating"></Column>
                                        <Column field="volume_share" header="Nominal" sortable></Column>
                                        <Column field="price" header="Price" sortable></Column>
                                        <Column field="coupon_percent" header="Coupon %" sortable></Column>
                                        <Column field="yield_percent" header="Yield %" sortable></Column>
                                        <Column field="amount" header="Amount" sortable></Column>
                                        <Column field="settled_date" header="Settlement Date" sortable></Column>
                                        <Column field="last_coupon_date" header="Last Coupon Date" sortable></Column>
                                        <ColumnGroup type="footer" v-if="dataBlotter.hasOwnProperty('sell')">
                                            <Row>
                                                <Column :footer="' '" :colspan="7" footerStyle="" />
                                                <Column :footer="'Total: '" footerStyle="" />
                                                <Column :footer="totalPriceDataBlotter(dataBlotter.sell)"
                                                    footerStyle="" />
                                            </Row>
                                        </ColumnGroup>
                                    </DataTable>
                                </div>
                            </div>
                            <!-- END TABLE GOVERNMENT BOND -->

                            <!-- TABLE CORPORATE BOND -->
                            <div class="p-fluid formgrid grid" v-if="inputBlotter.ins_type === 3">
                                <div class="field col-12 md:col-12">
                                    <label style="font-weight: bolder; font-size: 20px;">Buy</label>
                                    <DataTable class="p-datatable-buy" :value="dataBlotter.buy"
                                        tableStyle="min-width: 50rem">
                                        <Column field="ticket_id" header="ID" sortable></Column>
                                        <Column field="fund" header="Fund" sortable></Column>
                                        <Column field="bond_id" header="Bond"></Column>
                                        <Column field="rating" header="Rating"></Column>
                                        <Column field="volume_share" header="Nominal" sortable></Column>
                                        <Column field="price" header="Price" sortable></Column>
                                        <Column field="coupon_percent" header="Coupon %" sortable></Column>
                                        <Column field="yield_percent" header="Yield %" sortable></Column>
                                        <Column field="amount" header="Amount" sortable></Column>
                                        <Column field="settled_date" header="Settlement Date" sortable></Column>
                                        <Column field="last_coupon_date" header="Last Coupon Date" sortable></Column>
                                        <ColumnGroup type="footer" v-if="dataBlotter.hasOwnProperty('buy')">
                                            <Row>
                                                <Column :footer="' '" :colspan="7" footerStyle="" />
                                                <Column :footer="'Total: '" footerStyle="" />
                                                <Column :footer="totalPriceDataBlotter(dataBlotter.buy)"
                                                    footerStyle="" />
                                            </Row>
                                        </ColumnGroup>
                                    </DataTable>
                                </div>
                                <div class="field col-12 md:col-12">
                                    <label style="font-weight: bolder; font-size: 20px;">Sell</label>
                                    <DataTable class="p-datatable-sell" :value="dataBlotter.sell"
                                        tableStyle="min-width: 50rem">
                                        <Column field="ticket_id" header="ID" sortable></Column>
                                        <Column field="fund" header="Fund" sortable></Column>
                                        <Column field="bond_id" header="Bond"></Column>
                                        <Column field="rating" header="Rating"></Column>
                                        <Column field="volume_share" header="Nominal" sortable></Column>
                                        <Column field="price" header="Price" sortable></Column>
                                        <Column field="coupon_percent" header="Coupon %" sortable></Column>
                                        <Column field="yield_percent" header="Yield %" sortable></Column>
                                        <Column field="amount" header="Amount" sortable></Column>
                                        <Column field="settled_date" header="Settlement Date" sortable></Column>
                                        <Column field="last_coupon_date" header="Last Coupon Date" sortable></Column>
                                        <ColumnGroup type="footer" v-if="dataBlotter.hasOwnProperty('sell')">
                                            <Row>
                                                <Column :footer="' '" :colspan="7" footerStyle="" />
                                                <Column :footer="'Total: '" footerStyle="" />
                                                <Column :footer="totalPriceDataBlotter(dataBlotter.sell)"
                                                    footerStyle="" />
                                            </Row>
                                        </ColumnGroup>
                                    </DataTable>
                                </div>
                            </div>
                            <!-- END TABLE CORPORATE BOND -->

                            <!-- TABLE DEPOSITO MONEY MARKET -->
                            <div class="p-fluid formgrid grid" v-if="inputBlotter.ins_type === 5">
                                <div class="field col-12 md:col-12" v-if="dataBlotter.hasOwnProperty('rollover')">
                                    <label style="font-weight: bolder; font-size: 20px;">Rollover</label>
                                    <DataTable class="p-datatable-dmm" :value="dataBlotter.rollover"
                                        tableStyle="min-width: 50rem">
                                        <Column field="ticket_id" header="ID" sortable></Column>
                                        <Column field="fund" header="Fund" sortable></Column>
                                        <Column field="stock_id" header="Bank"></Column>
                                        <Column field="volume_share" header="Volume" sortable></Column>
                                        <Column field="value_date" header="Value Date" sortable></Column>
                                        <Column field="maturity_date" header="Maturity Date" sortable></Column>
                                        <Column field="amount" header="Amount" sortable></Column>
                                        <Column field="int_percent" header="Int.Percent" sortable></Column>
                                        <Column field="investment_notes" header="Notes" sortable></Column>
                                        <ColumnGroup type="footer">
                                            <Row>
                                                <Column :footer="' '" :colspan="5" footerStyle="" />
                                                <Column :footer="'Total: '" footerStyle="" />
                                                <Column :footer="totalPriceDataBlotter(dataBlotter.rollover)"
                                                    footerStyle="" />
                                            </Row>
                                        </ColumnGroup>
                                    </DataTable>
                                </div>
                                <div class="field col-12 md:col-12" v-if="dataBlotter.hasOwnProperty('placement')">
                                    <label style="font-weight: bolder; font-size: 20px;">Placement</label>
                                    <DataTable class="p-datatable-dmm" :value="dataBlotter.placement"
                                        tableStyle="min-width: 50rem">
                                        <Column field="ticket_id" header="ID" sortable></Column>
                                        <Column field="fund" header="Fund" sortable></Column>
                                        <Column field="stock_id" header="Bank"></Column>
                                        <Column field="volume_share" header="Volume" sortable></Column>
                                        <Column field="value_date" header="Value Date" sortable></Column>
                                        <Column field="maturity_date" header="Maturity Date" sortable></Column>
                                        <Column field="amount" header="Amount" sortable></Column>
                                        <Column field="int_percent" header="Int.Percent" sortable></Column>
                                        <Column field="investment_notes" header="Notes" sortable></Column>
                                        <ColumnGroup type="footer">
                                            <Row>
                                                <Column :footer="' '" :colspan="5" footerStyle="" />
                                                <Column :footer="'Total: '" footerStyle="" />
                                                <Column :footer="totalPriceDataBlotter(dataBlotter.placement)"
                                                    footerStyle="" />
                                            </Row>
                                        </ColumnGroup>
                                    </DataTable>
                                </div>
                                <div class="field col-12 md:col-12" v-if="dataBlotter.hasOwnProperty('liquidate')">
                                    <label style="font-weight: bolder; font-size: 20px;">Liquidate</label>
                                    <DataTable class="p-datatable-dmm" :value="dataBlotter.liquidate"
                                        tableStyle="min-width: 50rem">
                                        <Column field="ticket_id" header="ID" sortable></Column>
                                        <Column field="fund" header="Fund" sortable></Column>
                                        <Column field="stock_id" header="Bank"></Column>
                                        <Column field="volume_share" header="Volume" sortable></Column>
                                        <Column field="value_date" header="Value Date" sortable></Column>
                                        <Column field="maturity_date" header="Maturity Date" sortable></Column>
                                        <Column field="amount" header="Amount" sortable></Column>
                                        <Column field="int_percent" header="Int.Percent" sortable></Column>
                                        <Column field="investment_notes" header="Notes" sortable></Column>
                                        <ColumnGroup type="footer">
                                            <Row>
                                                <Column :footer="' '" :colspan="5" footerStyle="" />
                                                <Column :footer="'Total: '" footerStyle="" />
                                                <Column :footer="totalPriceDataBlotter(dataBlotter.liquidate)"
                                                    footerStyle="" />
                                            </Row>
                                        </ColumnGroup>
                                    </DataTable>
                                </div>
                            </div>
                            <!-- END TABLE DEPOSITO MONEY MARKET -->
                        </div>
                        <!-- END BLOTTER -->
                    </template>
                </div>
            </template>
            <template v-slot:footer>
                <div class="grid grid-nogutter justify-content-between">
                    <Button label="Back" @click="prevPage()" icon="pi pi-angle-left" />
                    <Button label="Next" @click="nextPage()" icon="pi pi-angle-right" iconPos="right" />
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
:deep(.ck-toolbar) {
    font-size: .9rem;
}

:deep(.ck-editor__editable) {
    min-height: 500px;
}

:deep(.ck-powereds-by) {
    display: none !important;
}


:deep(.p-datatable .p-datatable-thead > tr > th .p-column-header-content span svg) {
    filter: invert(99%) sepia(67%) saturate(0%) hue-rotate(21deg) brightness(150%) contrast(100%) !important;
}

:deep(.p-datatable-buy .p-datatable-thead > tr > th) {
    background: #0ba006;
    color: #e9ecef;
    border: none;
}

:deep(.p-datatable-sell .p-datatable-thead > tr > th) {
    background: #c51812;
    color: #e9ecef;
    border: none;
}

:deep(.p-datatable .p-sortable-column:focus) {
    box-shadow: none !important;
    outline: none !important;
}

:deep(.p-datatable-buy .p-datatable-thead > tr > th.p-highlight) {
    background-color: #e9ecef;
    color: #0ba006;
}

:deep(.p-datatable-sell .p-datatable-thead > tr > th.p-highlight) {
    background-color: #e9ecef;
    color: #c51812;
}

:deep(.p-datatable-buy .p-datatable-thead > tr > th.p-highlight span svg) {
    filter: invert(46%) sepia(100%) saturate(3079%) hue-rotate(88deg) brightness(93%) contrast(95%) !important;
}

:deep(.p-datatable-sell .p-datatable-thead > tr > th.p-highlight span svg) {
    filter: invert(20%) sepia(86%) saturate(3074%) hue-rotate(352deg) brightness(78%) contrast(99%) !important;
}
</style>
