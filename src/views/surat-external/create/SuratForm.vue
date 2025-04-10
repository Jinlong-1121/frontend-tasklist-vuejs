<script setup>
import { inject, ref, reactive, onMounted, onUpdated } from "vue";
import { useRoute } from "vue-router";
import SuratService from '@/service/SuratService';
import TemplateService from "@/service/TemplateService";
import UserService from "@/service/UserService";

import Editor from "@/components/editor";

const swal = inject('$swal')

const editor = Editor;

const props = defineProps({ formData: Object });
const emit = defineEmits(['next-page', 'prev-page']);
const route = useRoute();

const submitted = ref(false);
const suratService = new SuratService();
const userService = new UserService();
const templateService = new TemplateService();

const selectedTujuan = ref();
const selectedPenandatangan = ref();
const selectedPenandatanganExternal = ref();
const selectedVerificator = ref();
const selectedSifatSurat = ref();

const dataForm = ref([]);
const optionTujuan = ref([]);
const optionSigner = ref([]);
const optionSignerExternal = ref([])
const optionVerif = ref([]);
const optionSifatSurat = ref([]);
const optionTembusan = ref([]);
const inputForm = reactive({
    document_no: "",
    perihal: "",
    up: "",
    receiver: [],
    signer: [],
    verificator: {},
    tembusan: [],
    attachment: [],
    attachment_avail: [],
    lampiran: 0,
    status: '1',
    document_nature: "",
    is_reply: "1",
    need_attach: "0",
    // need_sign: "1"
});
const tempUploadFileTandaTanganBasah = ref(null)
const penandatanganExternalSwitch = ref(false)

const inputFormTujuan = reactive({
    name: "",
    address: ""
});

const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
}

const onSelectFile = (event) => {
    inputForm.attachment = event.files;
    inputForm.lampiran = event.files.length === 0 ? '-' : event.files.length;
}

const onSelectFileTandatanganBasah = (event) => {
    // console.log(event, "OOO");
    let reader = new FileReader()
    reader.onload = (e) => {
        // // console.log(e.target.result);
        dataForm.value[0].value = e.target.result
    }
    reader.readAsDataURL(event.files[0])
}

onMounted(() => {
    loadData();

});

onUpdated(() => {
    loadData();
});

const loadData = async () => {
    if (props.formData.signer !== undefined) {
        let dataTempSigner = inputForm.signer.filter((item) => {
            return item.position !== "External"
        })
        inputForm.signer = dataTempSigner
        selectedPenandatangan.value = props.formData.signer.filter((elemen) => elemen.position !== "External");
    }

    // const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    getListTujuan();
    getListSigner();
    getListSignerExternal();
    getListVerif();
    getListTembusan();
    getDocumentNatures();
    let currentTime = new Date();
    if (inputForm.document_no === "") {
        inputForm.document_no = `{no}/EXT.${props.formData.category.alias}/DIR/${romanize(currentTime.getMonth() + 1)}/${currentTime.getFullYear()}`
    } else {
        inputForm.document_no = inputForm.document_no;
    }
    if (props.formData.perihal === '') {
        inputForm.perihal = props.formData.template.name;
    }
    inputForm.need_attach = props.formData.need_attach;
    dataForm.value = props.formData.template.parameter;
    // initEditor();
}

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

const getListTujuan = () => {
    suratService.getListTujuan().then((data) => (optionTujuan.value = data));
}

const getListSigner = () => {
    userService.getListSigner().then((data) => (optionSigner.value = data));
}

const getListSignerExternal = () => {
    userService.getListSignerExternal().then((data) => (optionSignerExternal.value = data));
}

const getListVerif = () => {
    userService.getListVerif().then((data) => (optionVerif.value = data));
}

const getDocumentNatures = () => {
    suratService.getDocumentNatures(1).then((data) => (optionSifatSurat.value = data));
}

const getListTembusan = () => {
    suratService.getListTembusan().then((data) => (optionTembusan.value = data));
}

const setTujuan = (event) => {
    inputForm.receiver[0] = event.value
    selectedTujuan.receiver[0] = event.value
};

const setSigner = (event) => {
    let currentTime = new Date();
    inputForm.signer = event.value
    let myTarget = JSON.parse(JSON.stringify(inputForm.signer))
    let statusDIR = myTarget.filter((item) => {
        return item.divisi_alias === "DIR"
    })
    inputForm.document_no = `{no}/EXT.${props.formData.category.alias}/${statusDIR.length !== 0 ? 'DIR' : inputForm.signer.length === 0 ? "DIR" : inputForm.signer[0].divisi_alias}/${romanize(currentTime.getMonth() + 1)}/${currentTime.getFullYear()}`
    if (event.value.length === 0) {
        selectedPenandatangan.value = !selectedPenandatangan
    }
    selectedPenandatangan.signer = event.value
};


const setSignerExternal = (event) => {
    if (event.value.length === 0) {
        selectedPenandatanganExternal.value = !selectedPenandatanganExternal
    }
    selectedPenandatanganExternal.signer = event.value
}

const setSignerExternalSwitch = () => {
    selectedPenandatanganExternal.value = []
    if (props.formData.signer !== undefined) {
        selectedPenandatangan.value = props.formData.signer.filter((elemen) => elemen.position !== "External");
    }
}

const setTembusan = (event) => {
    inputForm.tembusan = event.value
};

const setVerificator = (event) => {
    inputForm.verificator = event.value
    selectedVerificator.verificator = event.value
};

const setSifatSurat = (event) => {
    inputForm.document_nature = event.value;  // Simpan ID ke database
    selectedSifatSurat.value = event.value;      // Simpan objek terpilih
};

const setContent = () => {
    const contentTemplate = props.formData.template.content;
    let contentDoc = contentTemplate;


    contentDoc = contentDoc.replaceAll('{perihal}', inputForm.perihal);
    contentDoc = contentDoc.replaceAll('{tujuan}', inputForm.receiver[0].user_name);
    contentDoc = contentDoc.replaceAll('{alamat}', inputForm.receiver[0].address);
    contentDoc = contentDoc.replaceAll('{tanggal}', setFormatDate());
    contentDoc = contentDoc.replaceAll('{nomor}', inputForm.document_no);
    contentDoc = contentDoc.replaceAll('{sifat_surat}', inputForm.document_nature.name_document_nature);
    contentDoc = contentDoc.replaceAll('{lampiran}', inputForm.attachment.length === 0 ? '-' : inputForm.attachment.length);
    contentDoc = contentDoc.replaceAll('{tembusan}', inputForm.tembusan.length === 0 ? '' : setTextList(inputForm.tembusan));
    contentDoc = contentDoc.replaceAll('{up}', inputForm.up);
    contentDoc = contentDoc.replaceAll('{signer}', setTextSigner(inputForm.signer));
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

            default:
                contentDoc = contentDoc.replaceAll('{' + element.param + '}', element.value);
                break;
        }
        // contentDoc = contentDoc.replaceAll('{{'+element.parameter+'}}', element.value);
    }
    return contentDoc
}

const setTextTujuan = (data) => {
    return `<span>${data.name}</span><br><span>${data.alamat}</span>`;
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
        case 6: bulan = "Juli"; break; m
        case 7: bulan = "Agustus"; break;
        case 8: bulan = "September"; break;
        case 9: bulan = "Oktober"; break;
        case 10: bulan = "November"; break;
        case 11: bulan = "Desember"; break;
    }
    let tampilTanggal = hari + ", " + tanggal + " " + bulan + " " + tahun;

    return tampilTanggal;
}

{/* <img src="data:image/png;base64,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"/> */ }
{/*  <img src="${element.speciment}"/>  */ }

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

// const setTextSigner = (data) => {
//     let html = `<table style="width:100%"><tr>`;
//     for (let i = 0; i < data.length; i++) {
//         const element = data[i];
//         html += `
//             <td>
//                 <p class="mb-0" style="${element.position !== 'External' ? 'text-decoration: underline;' : ''} font-weight: bold;">${element.user_name}</p>
//                 ${element.position !== 'External' ? element.position : ''}
//             </td>
//         `;
//     }
//     html += `</tr></table>`;
//     return html;
// }

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

const setTextList = (data) => {
    // let data = optionSigner.value;
    let html;
    html = '<p>Tembusan : </p>';
    html += `<ol>`;
    //set body table
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        html += '<li>';
        html += `${element.user_name}`;
        html += '</li>';
    }
    html += `</ol>`;
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

// FILE
const onRemoveTemplatingFileTandaTanganBasah = (file, removeFileCallback, index) => {
    // console.log(file, "AAAA");
};
const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    if (index >= 0 && index < inputForm.attachment.length) {
        inputForm.attachment.splice(index, 1);
    } else {
        console.error('Invalid index.');
    }
};
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
        !inputForm.up ||
        !selectedPenandatangan.value ||
        !selectedVerificator.value ||
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

    if (selectedPenandatanganExternal.value !== undefined) {
        for (let i = 0; i < selectedPenandatanganExternal.value.length; i++) {
            inputForm.signer.push(selectedPenandatanganExternal.value[i]);
        }
    }

    // Lanjutkan jika validasi berhasil
    const check = checkValidate();
    submitted.value = true;
    if (check !== false) {
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

        const contentDoc = setContent();
        emit("next-page", {
            formData: {
                document_no: inputForm.document_no,
                up: inputForm.up,
                receiver: inputForm.receiver,
                signer: inputForm.signer,
                verificator: inputForm.verificator,
                perihal: inputForm.perihal,
                tembusan: inputForm.tembusan,
                attachment: inputForm.attachment,
                content: contentDoc,
                status: '1',
                document_nature: inputForm.document_nature,
                is_reply: "1",
                need_attach: props.formData.need_attach,
                // need_sign: "1",
                data_form: dataForm
            },
            pageIndex: 1
        });

        submitted.value = true;
    } else {
        window.scrollTo(0, 180);
        // swal.fire({
        //     icon: 'error',
        //     text: 'Input Kosong, cek kembali input anda.',
        //     showConfirmButton: false,
        //     timer: 1500
        // });
    }
};

const prevPage = () => {
    emit("prev-page", {
        pageIndex: 1,
    });
};

</script>
<template>
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
                    <div class="field col-12 md:col-6">
                        <label for="perihal">Perihal</label>
                        <InputText id="perihal" type="text" v-model="inputForm.perihal" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !inputForm.perihal }" />
                        <small class="p-error" v-if="submitted && !inputForm.perihal">Perihal is required.</small>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="tujuan">Tujuan</label>
                        <div class="p-inputgroup flex-1">
                            <Dropdown inputId="tujuan" v-model="selectedTujuan" :options="optionTujuan"
                                @change="setTujuan($event)" optionLabel="user_name" placeholder="Pilih Tujuan" filter
                                panelClass="custom-panel" required="true" autofocus
                                :class="{ 'p-invalid': submitted && !selectedTujuan }">
                                <template #value="slotProps">
                                    <div v-tooltip.bottom="slotProps.value.address" v-if="slotProps.value"
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
                            <Button icon="pi pi-plus" severity="success" @click="toggle" />
                        </div>
                        <small class="p-error" v-if="submitted && !selectedTujuan">Tujuan is required.</small>
                        <OverlayPanel ref="op" appendTo="body">
                            <!-- <template> -->
                            <div class="flex justify-content-center p-fluid">
                                <div v-focustrap class="cards">
                                    <div class="field">
                                        <label><b>Tambah Tujuan Baru</b></label>
                                    </div>
                                    <div class="field">
                                        <InputText id="input" v-model="inputFormTujuan.name" type="text"
                                            placeholder="Name" autofocus />
                                    </div>
                                    <div class="field">
                                        <Textarea v-model="inputFormTujuan.address" rows="5" cols="30"
                                            placeholder="Alamat" />
                                    </div>
                                    <Button label="Submit" class="mt-2" @click="handleAddTujuan()" />
                                </div>
                            </div>
                            <!-- </template> -->
                        </OverlayPanel>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="up">Up</label>
                        <InputText for="up" type="text" v-model="inputForm.up" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !inputForm.up }" />
                        <small class="p-error" v-if="submitted && !inputForm.up">Up is required.</small>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="signer">Penandatangan {{ }}</label>
                        <MultiSelect inputId="signer" v-model="selectedPenandatangan" display="chip"
                            :options="optionSigner" @change="setSigner($event)" optionLabel="user_name"
                            placeholder="Pilih Penandatangan" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !selectedPenandatangan }" />
                        <small class="p-error" v-if="submitted && !selectedPenandatangan">Penandatangan is
                            required.</small>
                    </div>

                    <!-- <div class="field col-12 md:col-6">
                        <label for="signer">Penandatangan External {{ }}</label>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-1 mb-0 align-self-end">
                                <div class="switch-Tandatangan">
                                    <InputSwitch v-model="penandatanganExternalSwitch"
                                        @click="setSignerExternalSwitch()" />
                                </div>
                            </div>
                            <div class="field col-12 md:col-11 mb-0" v-if="penandatanganExternalSwitch">
                                <MultiSelect inputId="signer" v-model="selectedPenandatanganExternal" display="chip"
                                    :options="optionSignerExternal" @change="setSignerExternal($event)"
                                    optionLabel="user_name" placeholder="Pilih Penandatangan" required="true" autofocus
                                    :class="{ 'p-invalid': submitted && !selectedPenandatangan }" />
                                <small class="p-error" v-if="submitted && !selectedPenandatangan">Penandatangan is
                                    required.</small>
                            </div>
                        </div>
                    </div> -->

                    <div class="field col-12 md:col-6">
                        <label for="verificator">Verificator</label>
                        <Dropdown inputId="verificator" v-model="selectedVerificator" display="chip"
                            :options="optionVerif" @change="setVerificator($event)" optionLabel="user_name"
                            placeholder="Pilih Verifikator" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !selectedVerificator }" />
                        <small class="p-error" v-if="submitted && !selectedVerificator">Verificator is required.</small>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="tembusan">Tembusan</label>
                        <MultiSelect inputId="signer" v-model="inputForm.tembusan" display="chip"
                            :options="optionTembusan" @change="setTembusan($event)" optionLabel="user_name"
                            placeholder="Pilih Tembusan" />
                        <!-- <InputText for="tembusan" type="text" v-model="inputForm.tembusan" /> -->
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="document_nature">Sifat Surat</label>
                        <Dropdown inputId="document_nature" v-model="selectedSifatSurat" display="chip"
                            :options="optionSifatSurat" @change="setSifatSurat($event)" optionLabel="name_document_nature"
                            placeholder="Pilih Sifat Surat" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !selectedSifatSurat }" />
                        <small class="p-error" v-if="submitted && !selectedSifatSurat">Sifat Surat is required.</small>

                      
                    </div>

                    <div v-if="dataForm[0]?.type !== '6'" class="field col-12">
                        <label for="tembusan">Attachment</label>
                        <!-- <FileUpload v-model="inputForm.attachment" @select="onSelectFile($event)" :multiple="true" accept="application/pdf" :maxFileSize="1000000">
                                <template #empty>
                                    <p>Drag and drop files to here to upload.</p>
                                </template>
                            </FileUpload> -->

                        <FileUpload @select="onSelectFile($event)" :multiple="true" accept="application/pdf"
                            :maxFileSize="10000000">
                            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                                    <div class="flex gap-2">
                                        <Button @click="chooseCallback()" icon="pi pi-upload" style="padding: 6px 20px;"
                                            outlined>Choose</Button>
                                    </div>
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
                        <!-- <FileUpload mode="basic" v-model="inputForm.attachment" @select="onSelectFile($event)" :multiple="true" accept="application/pdf" :maxFileSize="1000000" /> -->
                    </div>

                    <!-- TEMPLATE -->
                    <template v-for="(item, idx) in dataForm" :key="idx">
                        <div class="field col-12 md:col-6">
                            <label :for="item.parameter">{{ item.label }}</label>
                            <InputText v-if="item.type === '1'" :id="item.parameter" type="text" v-model="item.value"
                                autofocus :class="{ 'p-invalid': submitted && !item.value }" />
                            <Calendar v-if="item.type === '2' || item.type === '5'" :id="item.parameter"
                                v-model="item.value" :class="{ 'p-invalid': submitted && !item.value }" />
                            <MultiSelect v-if="item.type === '3'" :inputId="item.parameter" v-model="item.value"
                                display="chip" :options="optionSigner" optionLabel="user_name" placeholder="Pilih User"
                                :class="{ 'p-invalid': submitted && !item.value }" />

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
</style>
<style>
.custom-panel .p-dropdown-items-wrapper .p-dropdown-items .p-dropdown-item {
    padding: 0px !important;
}
</style>