<script setup>
import { inject, ref, reactive, onMounted, onUpdated } from "vue";
import { useRoute } from "vue-router";
import SuratService from '@/service/SuratService';
import TemplateService from "@/service/TemplateService";
import UserService from "@/service/UserService";
import Editor from "@/components/editor";

const editor = Editor;

import { useToast } from "primevue/usetoast";
const toast = useToast();
const swal = inject('$swal')
// import CKEditor from '@ckeditor/ckeditor5-vue'
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
// import Editor from "ckeditor5-custom-build/build/ckeditor";

// const editor = Editor;
// const editor = ClassicEditor;
// const ckeditor = CKEditor.component;
// const editorData = ref("<p>Content of the editor.</p>");
// const editorConfig = {
//     // plugins: [ 
//     //     Essentials, 
//     //     Table, 
//     //     TableToolbar, 
//     //     TableProperties, 
//     //     TableCellProperties, 
//     //     Bold, 
//     //     Code, 
//     //     Italic, 
//     //     Strikethrough, 
//     //     Subscript, 
//     //     Superscript, 
//     //     Underline, 
//     //     // Alignment, 
//     //     // Autoformat 
//     // ],
//     // toolbar: [ 
//     //     'insertTable', 
//     //     'bold', 
//     //     'italic', 
//     //     'underline', 
//     //     // 'undo', 
//     //     // 'redo'
//     // ],
//     // table: {
//     //         contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableCellProperties', 'tableCellProperties' ]
//     // }
//     toolbar: [ 'bold', 'italic', 'link', 'undo', 'redo', 'numberedList', 'bulletedList', 'sourceEditing' ]
// };

const props = defineProps({ formData: Object, draftStore: Object });
const emit = defineEmits(['next-page', 'prev-page']);
const route = useRoute();
const paramId = route.params.id;

const suratService = new SuratService();
const templateService = new TemplateService();
const userService = new UserService();

const submitted = ref(false);
const dataForm = ref([]);
const optionTujuan = ref([]);
const optionSigner = ref([]);
const optionSignerExternal = ref([])
const optionVerif = ref([]);
const optionSifatSurat = ref([]);
const optionTembusan = ref([])
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
    attachment_temp: [],
    lampiran: 0,
    status: '1',
    document_nature: "",
    is_reply: "1",
    need_attach: "0",
    // need_sign: "1"
});

const selectReceiver = ref([])
const selectSigner = ref([])
const selectSignerExternal = ref([])
const selectVerificator = ref({})
const selectTembusan = ref([])
const selectedSifatSurat = ref({});
const penandatanganExternalSwitch = ref(false)

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

const onSelectFileTandatanganBasah = (event) => {
    let reader = new FileReader()
    reader.onload = (e) => {
        // // console.log(e.target.result);
        dataForm.value[0].value = e.target.result
    }
    reader.readAsDataURL(event.files[0])
}

onMounted(() => {
    inputForm.attachment_avail = props.formData.attachment;
    setData();
});

onUpdated(() => {
    setData();
});

const setData = () => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    getListTujuan();
    getListSigner();
    getListSignerExternal();
    getListVerif();
    getListTembusan();
    getDocumentNatures();

    // console.log(props.formData.receiver, "IIII");
    let currentTime = new Date();
    let myTarget = props.formData.signer
    let statusDIR = myTarget.filter((item) => {
        return item.divisi_alias === "DIR"
    })
    inputForm.document_no = `{no}/EXT.${props.formData.category.alias}/${statusDIR.length !== 0 ? 'DIR' : props.formData.signer.length === 0 ? "DIR" : props.formData.signer[0].divisi_alias}/${romanize(currentTime.getMonth() + 1)}/${currentTime.getFullYear()}`

    if (props.formData.receiver[0].up === "") {
        inputForm.up = inputForm.up
    } else {
        inputForm.up = props.formData.receiver[0].up
    }
    props.formData.signer.map(item => {
        delete item.document_id
        delete item.id
    })
    props.formData.tembusan.map(item => {
        delete item.document_id
        delete item.id
    })
    delete props.formData.receiver[0].id;
    delete props.formData.receiver[0].document_id;
    // props.formData.receiver[0].up = ""
    delete props.formData.verificator.id;
    delete props.formData.verificator.document_id;

    inputForm.perihal = props.formData.perihal;
    selectReceiver.value = props.formData.receiver[0];
    selectSignerExternal.value = props.formData.signer.filter((elemen) => elemen.position === "External");
    selectSigner.value = props.formData.signer.filter((elemen) => elemen.position !== "External");
    selectVerificator.value = props.formData.verificator;
    selectTembusan.value = props.formData.tembusan;
    inputForm.lampiran = props.formData.lampiran;
    var documentNature = props.formData.draftStore;
    selectedSifatSurat.value = JSON.parse(documentNature.value.document_nature);

    // inputForm.attachment = [];
    props.formData.template.parameter.map((item) => {
        if (item.type === "2") {
            item.value = item.value === '' ? '' : setFormatDateDisplayInput(item.value)
        }
    });
    if (selectSignerExternal.value.length !== 0) {
        penandatanganExternalSwitch.value = true
    } else {
        penandatanganExternalSwitch.value = false
    }
    dataForm.value = props.formData.template.parameter
}

const setTujuan = (event) => {
    inputForm.up = ""
    inputForm.receiver[0] = event.value
    selectReceiver.receiver[0] = event.value
};

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

const setSigner = (event) => {
    let currentTime = new Date();
    inputForm.signer = event.value
    let myTarget = JSON.parse(JSON.stringify(inputForm.signer))
    let statusDIR = myTarget.filter((item) => {
        return item.divisi_alias === "DIR"
    })
    inputForm.document_no = `{no}/EXT.${props.formData.category.alias}/${statusDIR.length !== 0 ? 'DIR' : inputForm.signer.length === 0 ? "DIR" : inputForm.signer[0].divisi_alias}/${romanize(currentTime.getMonth() + 1)}/${currentTime.getFullYear()}`
   
    if (event.value.length === 0) {
        selectSigner.value = !selectSigner
    }
};

const setSignerExternal = (event) => {
    // console.log(event);
    if (event.value.length === 0) {
        selectSignerExternal.value = !selectSignerExternal
    }
    selectSignerExternal.signer = event.value
}

const changePenandatanganExternal = () => {
    selectSignerExternal.value = []
}

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
    let myTarget = JSON.parse(JSON.stringify(props.formData))
    const contentTemplate = props.formData.template.content;
    let contentDoc = contentTemplate;
    contentDoc = contentDoc.replaceAll('{perihal}', inputForm.perihal);
    contentDoc = contentDoc.replaceAll('{tujuan}', selectReceiver.value.user_name);
    contentDoc = contentDoc.replaceAll('{alamat}', selectReceiver.value.address);
    contentDoc = contentDoc.replaceAll('{tanggal}', setFormatDate());
    contentDoc = contentDoc.replaceAll('{nomor}', inputForm.document_no);
    contentDoc = contentDoc.replaceAll('{sifat_surat}', inputForm.document_nature.name_document_nature);
    contentDoc = contentDoc.replaceAll('{lampiran}', inputForm.attachment.length + inputForm.attachment_avail.length);
    // contentDoc = contentDoc.replaceAll('{lampiran}', myTarget.attachment.length === 0 ? '-' : myTarget.attachment.length);
    contentDoc = contentDoc.replaceAll('{tembusan}', selectTembusan.value.length === 0 ? '' : setTextList(selectTembusan.value));
    contentDoc = contentDoc.replaceAll('{up}', inputForm.up);
    contentDoc = contentDoc.replaceAll('{signer}', setTextSigner(selectSigner.value));
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

const setFormatDateDisplayInput = (date) => {
    if (typeof date === 'string') {
        date = new Date(date)
    }

    return date;
}

const setFormatDateOnly = (date) => {
    if (typeof date === 'string') {
        date = new Date(date)
    }
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
        !selectReceiver.value ||
        !inputForm.up ||
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


    for (let i = 0; i < selectSignerExternal.value.length; i++) {
        selectSigner.value.push(selectSignerExternal.value[i])
    }
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
                up: inputForm.up,
                receiver: selectReceiver,
                signer: selectSigner,
                verificator: selectVerificator,
                document_nature: selectedSifatSurat,
                perihal: inputForm.perihal,
                tembusan: selectTembusan,
                attachment: inputForm.attachment,
                attachment_avail: inputForm.attachment_avail,
                content: contentDoc,
                // status: '1',
                is_reply: "1",
                need_attach: props.formData.need_attach,
                need_sign: props.formData.need_sign,
                data_form: dataForm
            },
            pageIndex: 1,
        });
        submitted.value = true
    } else {
        window.scrollTo(0, 180);
        // swal.fire({
        //     icon: 'error',
        //     text: 'Input Kosong, cek kembali input anda.',
        //     showConfirmButton: false,
        //     timer: 1500
        // })
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

    <div class="stepsdemo-content">
        <Card class="mt-3">
            <Toast />
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
                        <small class="p-error" v-if="!inputForm.perihal">Perihal is required.</small>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="tujuan">Tujuan</label>
                        <div class="p-inputgroup flex-1">
                            <Dropdown inputId="tujuan" v-model="selectReceiver" :options="optionTujuan"
                                @change="setTujuan($event)" optionLabel="user_name" filter panelClass="custom-panel"
                                placeholder="Pilih Verificator">
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
                        <small class="p-error" v-if="!selectReceiver">Tujuan is required.</small>
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
                                        <Textarea v-model="inputFormTujuan.alamat" rows="5" cols="30"
                                            placeholder="Alamat" />
                                    </div>
                                    <Button label="Submit" class="mt-2" @click="handleAddTujuan()" />
                                </div>
                            </div>
                            <!-- </template> -->
                        </OverlayPanel>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="up">Up {{ }}</label>
                        <InputText for="up" type="text" v-model="inputForm.up" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !inputForm.up }" />
                        <small class="p-error" v-if="!inputForm.up">Up is required.</small>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="signer">Penandatangan {{ }}</label>
                        <MultiSelect inputId="signer" v-model="selectSigner" display="chip" :options="optionSigner"
                            @change="setSigner($event)" optionLabel="user_name" placeholder="Pilih Penandatangan" />
                        <small class="p-error" v-if="submitted && !selectSigner">Penandatangan is required.</small>
                    </div>

                    <!-- <div class="field col-12 md:col-6">
                        <label for="signer">Penandatangan External {{ }}</label>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-1 mb-0 align-self-end">
                                <div class="switch-Tandatangan">
                                    <InputSwitch @change="changePenandatanganExternal()"
                                        v-model="penandatanganExternalSwitch" />
                                </div>
                            </div>
                            <div class="field col-12 md:col-11 mb-0" v-if="penandatanganExternalSwitch">
                                <MultiSelect inputId="signer" v-model="selectSignerExternal" display="chip"
                                    :options="optionSignerExternal" @change="setSignerExternal($event)"
                                    optionLabel="user_name" placeholder="Pilih Penandatangan" required="true" autofocus
                                    :class="{ 'p-invalid': submitted && !selectSignerExternal }" />
                                <small class="p-error" v-if="submitted && !selectSignerExternal">Penandatangan is
                                    required.</small>
                            </div>
                        </div>
                    </div> -->

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
                        <label for="tembusan">Tembusan</label>
                        <MultiSelect inputId="signer" v-model="selectTembusan" display="chip" :options="optionTembusan"
                            optionLabel="user_name" filter placeholder="Pilih Tembusan" class="w-full md:w-80" />

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

                    <div v-if="dataForm[0]?.type !== '6'" class="field col-12">
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
                            <Message v-if="formData.template.parameter[0].value !== ''" class="w-2 mt-0" severity="warn"
                                icon="pi pi-file" :closable="false">File sudah ada</Message>
                            <FileUpload mode="basic" customUpload @select="onSelectFileTandatanganBasah"
                                accept="application/pdf" :maxFileSize="1000000" />
                        </div>
                        <!-- <Message severity="info"></Message> -->
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