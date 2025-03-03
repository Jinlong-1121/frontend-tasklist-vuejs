<script setup>
import { inject, ref, reactive, onMounted, onUpdated } from "vue";
import { useRoute } from "vue-router";
import SuratService from '@/service/SuratService';
import CategoryService from '@/service/CategoryService';
import DivisiService from '@/service/DivisiService';
import TemplateService from "@/service/TemplateService";
import UserService from "@/service/UserService";
import HelpersFunction from "../functions/Helpers";

import Editor from "@/components/editor";

import { useToast } from "primevue/usetoast";
const toast = useToast();
const swal = inject('$swal')

const props = defineProps({ formData: Object });
const emit = defineEmits(['next-page', 'prev-page']);
const route = useRoute();
const paramId = route.params.id;
const disabledBtnCreate = ref(true);
const disabledBtnPost = ref(false);

const categoryService = new CategoryService();
const suratService = new SuratService();
const userService = new UserService();
const divisiService = new DivisiService();
const templateService = new TemplateService();
const helpers = new HelpersFunction();

const editor = Editor;
const submitted = ref(false);
const enabledForm = ref(false);

// SELECTION OPTIONS
const selectedCategory = ref();
const selectedCategoryTemp = ref();
const selectedTemplate = ref();
const selectedDivisi = ref();
const selectedTujuan = ref();
const selectedPenandatangan = ref();
const selectedPenandatanganExternal = ref();
const selectedVerificator = ref();
const listEmailTujuan = ref();
// END SELECTION OPTIONS

// OPTIONS DROPDOWN
const optionCategory = ref([]);
const optionDivisi = ref([]);
const optionTujuan = ref([]);
const optionTujuanTemp = ref([]);
const optionSigner = ref([]);
const optionVerif = ref([]);
const optionTembusan = ref([]);
// END OPTIONS DROPDOWN

const dataForm = ref([]);
const dataBlotter = ref({})
const isReply = ref("0")
const isFinance = ref("0")
const isSecret = ref("0")

const inputForm = reactive({
    document_no: "",
    perihal: "",
    divisi: [],
    receiver: [],
    signer: [],
    verificator: {},
    tembusan: [],
    attachment: [],
    attachment_avail: [],
    lampiran: 0,
    status: '1',
    is_reply: "1",
    need_attach: "0",
    need_sign: "1",
    document_type: "2"
});
const sender = ref({});

const onSelectFile = (event) => {
    inputForm.attachment = event.files;
    inputForm.lampiran = event.files.length;
}

// const onSelectFileTandatanganBasah = (event) => {
//     let reader = new FileReader()
//     reader.onload = (e) => {
//         dataForm.value[0].value = e.target.result
//     }
//     reader.readAsDataURL(event.files[0])
// }

onMounted(() => {
    // loadData();
});

onUpdated(() => {
    loadData();
});

const loadData = async () => {
    submitted.value = false
    console.log(props.formData);
    if (props.formData.is_used) {
        enabledForm.value = true;
        disabledBtnPost.value = true;
    }
    getCategory()
    getListTujuan();
    getListDivisi();
    getListVerif();
    // getListTembusan();
    sender.value = setSender();
    setData();
}

const setData = () => {
    console.log(typeof props.formData.category, props.formData.category, "lklklk");
    if (props.formData.category!=="") {
        const categoryJson = JSON.parse(props.formData.category);
        isReply.value = categoryJson.is_reply;
        isFinance.value = categoryJson.is_finance;
        isSecret.value = categoryJson.is_secret;

        categoryJson.is_reply = 0;
        categoryJson.is_finance = 0;
        categoryJson.is_secret = 0;

        selectedCategory.value = categoryJson;

        inputForm.document_no = props.formData.document_no
        inputForm.perihal = props.formData.perihal

        selectedVerificator.value = props.formData.verificator

        getTemplate(categoryJson.id);
        console.log(inputForm, selectedVerificator.value, "GGGG");
    }
    props.formData.receiver.map(item => {
        delete item.document_id
        delete item.id
    })
    props.formData.signer.map(item => {
        delete item.document_id
        delete item.id
    })

    
    const verifData = props.formData.verificator
    
    delete verifData.document_id
    delete verifData.id
    
    props.formData.verificator = verifData
    
    console.log(props.formData, "LLLLL");
    
    
    inputForm.divisi = JSON.parse(props.formData.divisi)
    selectedDivisi.value = JSON.parse(props.formData.divisi);
    // const thirdArray = optionTujuanTemp.value.filter((elem) => {
    //     return selectedDivisi.value.some((ele) => {
    //         return elem.up == ele.id;
    //     });
    // });
    // optionTujuan.value = thirdArray
    // selectedTujuan.value = props.formData.receiver;
    
}


const setValFlag = () => {
    selectedCategoryTemp.value.is_reply = isReply.value;
    selectedCategoryTemp.value.is_finance = isFinance.value;
    selectedCategoryTemp.value.is_secret = isSecret.value;
    console.log(selectedCategory.value, "KKKK");
}

// SETGET OPTIONS LIST CATEGORY
const getCategory = () => {
  const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
  const params = {
    type: "3",
    divisi: dataLocalStorage.divisi
  }
  categoryService.getListCategoryAll(params).then((data) => (optionCategory.value = data));
};
const setCategory = (event) => {
    console.log(selectedCategory.value.alias, "PPPP");
    // need_attach.value = '0'
    selectedCategory.value = event.value
    selectedCategoryTemp.value = event.value
    setValFlag();
    // validateSelectedCategory.value = event.value
    getTemplate(event.value.id);

    let currentTime  = new Date();
    inputForm.document_no = `{no}/${props.formData.type.code}.${selectedCategory.value.alias}/DIR/${helpers.romanize(currentTime.getMonth() + 1)}/${currentTime.getFullYear()}`
    // if (inputForm.document_no === "") {
    // }else {
    //     inputForm.document_no = inputForm.document_no;
    // }
};
const getTemplate = (id) => {
  const params = {
    type: id
  }
  templateService.getListTemplateAll(params).then((data) => {
    selectedTemplate.value = data[0];
    dataForm.value = selectedTemplate.value.parameter;
    console.log(dataForm.value, "HAHAHA");
  });
}
// END SETGET OPTIONS LIST CATEGORY

// SETGET OPTIONS LIST TUJUAN
const getListDivisi = () => {
    divisiService.getListAll().then((data) => {
        optionDivisi.value = data;
    });
}
const setDivisi = (event) => {
    inputForm.receiver = []
    selectedTujuan.value = []
    listEmailTujuan.value = []
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

// SETGET OPTIONS LIST TUJUAN
const getListTujuan = () => {
    userService.getListTujuanAll().then((data) => {
        optionTujuanTemp.value = data;
        if (props.formData.divisi !== "") {
            selectedDivisi.value = JSON.parse(props.formData.divisi);
            const thirdArray = optionTujuanTemp.value.filter((elem) => {
                return selectedDivisi.value.some((ele) => {
                    return elem.up == ele.id;
                });
            });
            optionTujuan.value = thirdArray
        }
        const result = props.formData.receiver.map(({id,...rest}) => ({...rest}));
        selectedTujuan.value = result;
        console.log(optionTujuan.value, result, "balalala");
    });
}
const setTujuan = (event) => {
    selectedTujuan.value = [];
    const dataTujuan = event.value;
    const emailTujuan = dataTujuan.map(({email, user_name}) => ({email, user_name}))
    listEmailTujuan.value = emailTujuan;
    inputForm.receiver = dataTujuan
    selectedTujuan.value = dataTujuan
    inputForm.receiver.map(item => {
        delete item.document_id
        delete item.id
    })
    selectedTujuan.value.receiver.map(item => {
        delete item.document_id
        delete item.id
    })
};
// SETGEN GET OPTIONS LIST TUJUAN

// SETGET OPTIONS LIST SIGNER
// const getListSigner = () => {
//     userService.getListSigner().then((data) => (optionSigner.value = data));
// }
// const setSigner = (event) => {
//     let currentTime  = new Date();
//     inputForm.signer = event.value
//     let myTarget = JSON.parse(JSON.stringify(inputForm.signer))
//     let statusDIR = myTarget.filter((item) => {
//         return item.divisi_alias === "DIR"
//     })
//     inputForm.document_no = `{no}/INT.${props.formData.category.alias}/${statusDIR.length !== 0 ? 'DIR' : inputForm.signer.length === 0 ? "DIR" : inputForm.signer[0].divisi_alias}/${romanize(currentTime.getMonth() + 1)}/${currentTime.getFullYear()}`
//     if (event.value.length === 0) {
//         selectedPenandatangan.value = !selectedPenandatangan
//     }
//     selectedPenandatangan.signer = event.value
// };
// END SETGET OPTIONS LIST SIGNER

// SETGET OPTIONS LIST VERIFICATOR
const getListVerif = () => {
    userService.getListVerif().then((data) => (optionVerif.value = data));
}
const setVerificator = (event) => {
    inputForm.verificator = event.value
    selectedVerificator.verificator = event.value
};
// END SETGET OPTIONS LIST VERIFICATOR

// SET SENDER
const setSender = () => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    const dataSender = {}
    dataSender.user_id = dataLocalStorage.target;
    dataSender.user_name = dataLocalStorage.user_name;
    dataSender.user_type = "1";
    return dataSender;
};
// END SET SENDER

// SET CONTENT PREVIEW PDF
const setContent = () => {
    console.log(selectedTemplate.value, "OOO");
    const contentTemplate = selectedTemplate.value.content;
    let contentDoc = contentTemplate;
    let dataUsersCuti = JSON.parse(localStorage.getItem('sipam'));

    contentDoc = contentDoc.replace('{perihal}', inputForm.perihal);
    contentDoc = contentDoc.replaceAll('{tujuan}', inputForm.receiver.length > 1 ? "Tujuan Terlampir" : `${inputForm.receiver[0].user_name} (${inputForm.receiver[0].address})`);
    contentDoc = contentDoc.replaceAll('{alamat}', inputForm.receiver.length > 1 ? "" : inputForm.receiver[0].address);
    contentDoc = contentDoc.replace('{tanggal}', helpers.setFormatDate());
    contentDoc = contentDoc.replace('{nomor}', inputForm.document_no);
    contentDoc = contentDoc.replace('{lampiran}', inputForm.attachment.length === 0 ? '-' : inputForm.attachment.length);
    contentDoc = contentDoc.replace('{tembusan}', inputForm.tembusan.length === 0 ? '' : helpers.setTextList(inputForm.tembusan));
    contentDoc = contentDoc.replace('{up}', inputForm.up);
    contentDoc = contentDoc.replace('{signer}', helpers.setTextSigner(inputForm.signer));
    contentDoc = contentDoc.replaceAll('{tujuan_terlampir}', inputForm.receiver.length > 1 ? setTextTujuan(inputForm.receiver) : "");
    // contentDoc = contentDoc.replace('{{signer}}', setTextTable(inputForm.signer));
    for (let i = 0; i < dataForm.value.length; i++) {
        const element = dataForm.value[i];
        const inputType = dataForm.value[i].type
        switch (inputType) {
            case "1":
                contentDoc = contentDoc.replace('{'+element.param+'}', element.value);
                break;

            case "2":
                contentDoc = contentDoc.replace('{'+element.param+'}', helpers.setFormatDateOnly(element.value));
                break;

            case "3":
                contentDoc = contentDoc.replace('{'+element.param+'}', helpers.setTextTable(element.value));
                break;

            case "5":
                contentDoc = contentDoc.replace('{'+element.param+'}', helpers.setFormatDate(element.value));
                break;
                
            case "8":
                contentDoc = contentDoc.replace('{'+element.param+'}', helpers.setFormatDateLooping(element.value));
                break;
        
            default:
                contentDoc = contentDoc.replace('{'+element.param+'}', element.value);
                break;
        }
        // contentDoc = contentDoc.replace('{{'+element.parameter+'}}', element.value);
    }
    return contentDoc
}
// END SET CONTENT PREVIEW PDF

// FILE
const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    // console.log(removeFileCallback());
    // removeFileCallback(index);
    if (index >= 0 && index < inputForm.attachment.length) {
        inputForm.attachment.splice(index, 1);
    } else {
        console.error('Invalid index.');
    }
    // totalSize.value -= parseInt(formatSize(file.size));
    // totalSizePercent.value = totalSize.value / 10;
};
const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
// END FILE

// VALIDATE
const checkValidate = () => {
    if (
        !inputForm.perihal ||
        !selectedDivisi.value ||
        !selectedTujuan.value ||
        !selectedVerificator.value
    ) {
        return false
    }else {
        return true
    }
}
// END VALIDATE
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

const nextPage = () => {
    if (selectedPenandatanganExternal.value !== undefined) {
        for (let i = 0; i < selectedPenandatanganExternal.value.length; i++) {
            inputForm.signer.push(selectedPenandatanganExternal.value[i])
        }
    }
    let check = true
    if (!props.formData.is_used) {
        console.log("lolos cek", props.formData.is_used);
        check = checkValidate()
        
    }
    submitted.value = true
    if (check !== false) {
        // const contentDoc = setContent();
        const contentDoc = props.formData.content;
        emit("next-page", {
            formData: {
                document_type: "3",
                sender: sender.value,
                document_no: inputForm.document_no,
                divisi: inputForm.divisi,
                receiver: inputForm.receiver,
                verificator: inputForm.verificator,
                perihal: inputForm.perihal,
                attachment: inputForm.attachment,
                category: selectedCategoryTemp.value,
                template: selectedTemplate.value,
                content: contentDoc,
                status: '1',
                is_reply: "1",
                need_attach: "0",
                need_sign: "0",
                data_form: dataForm
            },
            pageIndex: 0,
        });
        submitted.value = true
    }else {
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
      });
};

async function convertFileToBase64() {
    const arrayBuffer = await readFileAsArrayBuffer(inputForm.attachment[0]);
    const base64Data = arrayBufferToBase64(arrayBuffer);
    props.formData.content = base64Data;
    // dataPdf.value = 'data:application/pdf;base64,'+base64Data;
}
const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
const arrayBufferToBase64 = (arrayBuffer) => {
    const uint8Array = new Uint8Array(arrayBuffer);
    const binaryString = uint8Array.reduce(
        (binary, byte) => binary + String.fromCharCode(byte),
        ''
    );
    return btoa(binaryString);
}


const updateData = () => {
    convertFileToBase64();
    selectedCategory.value.is_reply = isReply.value;
    selectedCategory.value.is_finance = isFinance.value;
    selectedCategory.value.is_secret = isSecret.value;
    props.formData.document_no = inputForm.document_no;
    props.formData.divisi = JSON.stringify(inputForm.divisi);
    props.formData.receiver = inputForm.receiver;
    props.formData.verificator = inputForm.verificator;
    props.formData.perihal = inputForm.perihal;
    props.formData.attachment = inputForm.attachment;
    props.formData.category = JSON.stringify(selectedCategoryTemp.value);
    props.formData.template = JSON.stringify(selectedTemplate.value);
    props.formData.status = '1';
    props.formData.is_reply = "1";
    props.formData.need_attach = "0";
    props.formData.need_sign = "0";
    props.formData.data_form = JSON.stringify(dataForm);
};

const editAction = () => {
    setData();
    updateData();
    suratService.editActionAccess(props.formData, "edit").then((data) => {
        console.log(data);
        disabledBtnCreate.value = true
        disabledBtnPost.value = false
        enabledForm.value = false
    });
}
const postAction = () => {
    setData();
    updateData();
    suratService.postActionAccess(props.formData, "edit").then((data) => {
        console.log(data);
        disabledBtnCreate.value = false
    disabledBtnPost.value = true
    enabledForm.value = true
    });
}

</script>
<template>
    <Toast />
    <div class="stepsdemo-content">
        <div class="card flex justify-content-start flex-wrap gap-3">
            <Button label="Edit" icon="pi pi-check" :disabled="disabledBtnCreate" @click="editAction"/>
            <Button label="Post" icon="pi pi-send" :disabled="disabledBtnPost" @click="postAction" />
        </div>
        <Card class="mt-3">
            <template v-slot:title>
                Input Form
            </template>
            <template v-slot:subtitle>
                <i>Enter form details template</i>
            </template>
            <template v-slot:content>
                <div class="p-fluid formgrid grid mt-3">
                    <div class="field col-12 md:col-6">
                        <label for="class">Category</label>
                        <Dropdown
                        inputId="class"
                        v-model="selectedCategory"
                        :options="optionCategory"
                        @change="setCategory($event)"
                        optionLabel="name"
                        placeholder="Select a Category"
                        required="true" autofocus :class="{'p-invalid': submitted && !selectedCategory}"
                        :disabled="enabledForm"
                        />
                        <small class="p-error" v-if="submitted && !selectedCategory">Category is required.</small>
                    </div>
                    <div class="field col-12 md:col-6">
                        <div v-if="selectedCategory" class="flex flex-row justify-content-between">
                            <div class="field flex flex-column">
                                <label for="email">Need Response</label>
                                <InputSwitch v-model="isReply" trueValue="1" falseValue="0" @change="setValFlag" :disabled="enabledForm"/>
                            </div>
                            <div class="field flex flex-column">
                                <label for="email">To Finance</label>
                                <InputSwitch v-model="isFinance" trueValue="1" falseValue="0" @change="setValFlag" :disabled="enabledForm"/>
                            </div>
                            <div class="field flex flex-column">
                                <label for="email">Secret Document</label>
                                <InputSwitch v-model="isSecret" trueValue="1" falseValue="0" @change="setValFlag" :disabled="enabledForm"/>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="p-fluid formgrid grid mt-3">
                    <div class="field col-12 md:col-6">
                        <label for="perihal">Nomor Surat</label>
                        <InputText id="perihal" type="text" v-model="inputForm.document_no" disabled />
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="perihal">Perihal</label>
                        <InputText id="perihal" type="text" v-model="inputForm.perihal" required="true" autofocus :class="{'p-invalid': submitted && !inputForm.perihal}" :disabled="enabledForm"/>
                        <small class="p-error" v-if="submitted && !inputForm.perihal">Perihal is required.</small>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="divisi">Divisi</label>
                        <MultiSelect
                            inputId="divisi"
                            v-model="selectedDivisi"
                            display="chip"
                            :options="optionDivisi"
                            @change="setDivisi($event)"
                            optionLabel="name"
                            placeholder="Pilih Divisi"
                            required="true" autofocus :class="{'p-invalid': submitted && !selectedDivisi}"
                            :disabled="enabledForm"
                            />
                        <small class="p-error" v-if="submitted && !selectedDivisi">Divisi is required.</small>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="tujuan">Tujuan</label>
                        <div class="p-inputgroup flex-1">
                            <MultiSelect
                                inputId="tujuan"
                                display="chip"
                                v-model="selectedTujuan"
                                :options="optionTujuan"
                                @change="setTujuan($event)"
                                optionLabel="user_name"
                                placeholder="Pilih Tujuan"
                                filter 
                                panelClass="custom-panel"
                                required="true" autofocus :class="{'p-invalid': submitted && !selectedTujuan}"
                                :disabled="enabledForm"
                            />
                        </div>
                        <small class="p-error" v-if="submitted && !selectedTujuan">Tujuan is required.</small>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="verificator">Verificator</label>
                        <Dropdown
                            inputId="verificator"
                            v-model="selectedVerificator"
                            display="chip"
                            :options="optionVerif"
                            @change="setVerificator($event)"
                            optionLabel="user_name"
                            placeholder="Pilih Verifikator"
                            required="true" autofocus :class="{'p-invalid': submitted && !selectedVerificator}"
                            :disabled="enabledForm"
                            />
                        <small class="p-error" v-if="submitted && !selectedVerificator">Verificator is required.</small>
                    </div>
                    
                    <!-- INPUT ATTACHMENT -->
                    <div v-if="dataForm[0]?.type !== '6'" class="field col-12">
                        <label for="tembusan">Attachment</label>
                        <FileUpload @select="onSelectFile($event)" :multiple="true" accept="application/pdf" :maxFileSize="1000000">
                            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                                    <div class="flex gap-2">
                                        <Button @click="chooseCallback()" icon="pi pi-upload" style="padding: 6px 20px;" outlined :disabled="enabledForm">Choose</Button>
                                    </div>
                                </div>
                            </template>
                            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                                    <p v-if="inputForm.attachment_avail.length !== 0" class="font-semibold">
                                        File Uploaded
                                    </p>
                                    <div class="p-0 sm:p-5 sm:pb-2 sm:pt-0 gap-5">
                                        <div v-for="(fileData, index) of inputForm.attachment_avail" :key="index" class="card m-0 px-6 grid border-1 surface-border align-items-center my-2">
                                            <div class="col-8">
                                                <span class="font-semibold">{{ fileData.asset_url }}</span>
                                                <div>{{ fileData.size?formatSize(fileData.size):'' }}</div>
                                            </div>
                                            <div class="col-3">
                                                <Badge value="Uploaded" severity="success" />
                                            </div>
                                            <div class="col-1">
                                                <Button icon="pi pi-times" outlined @click="onRemoveSuratFileEdit(fileData)" severity="danger" style="width: 100%; background-color: #D32F2F; border: none; color: white;"/>
                                            </div>
                                        </div>
                                    </div>

                                    <p v-if="inputForm.attachment.length !== 0" class="mt-3 font-semibold">
                                        File Pending
                                    </p>
                                    <div class="p-0 sm:p-5 sm:pb-2 sm:pt-0 gap-5">
                                        <div v-for="(file, index) of inputForm.attachment" :key="file.name + file.type + file.size" class="card m-0 px-6 grid border-1 surface-border align-items-center my-2">
                                            <div class="col-8">
                                                <span class="font-semibold">{{ file.name }}</span>
                                                <div>{{ file.size?formatSize(file.size):'' }}</div>
                                            </div>
                                            <div class="col-3">
                                                <Badge value="Pending" severity="warning" />
                                            </div>
                                            <div class="col-1">
                                                <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined  severity="danger" style="width: 100%; background-color: #D32F2F; border: none; color: white;"/>
                                            </div>
                                        </div>
                                    </div>
                            </template>
                            <template #empty>
                                <p>Drag and drop files to here to upload.</p>
                            </template>
                        </FileUpload>
                    </div>
                    <!-- END INPUT ATTACHMENT -->
                    
                    <!-- TEMPLATE -->
                    <template v-for="(item, idx) in dataForm" :key="idx" >
                        <div class="field col-12 md:col-6">
                            <label v-if="item.type!=='7'" :for="item.parameter">{{ item.label }}</label>
                            <InputText v-if="item.type==='1'" :id="item.parameter" type="text" v-model="item.value" :disabled="enabledForm"/>
                            <Calendar v-if="item.type==='2' || item.type==='5'" :id="item.parameter" v-model="item.value" :disabled="enabledForm"/>
                            <Calendar v-if="item.type==='2' && item.type==='8'" :id="item.parameter" v-model="item.value" selectionMode="multiple" @date-select="validasiLimitTanggalCuti(item.value)" :disabled="enabledForm"/>
                            <MultiSelect
                                v-if="item.type==='3'"
                                :inputId="item.parameter"
                                v-model="item.value"
                                display="chip"
                                :options="optionSigner"
                                optionLabel="user_name"
                                placeholder="Pilih User"
                                :disabled="enabledForm"
                            />
                        </div>
                    </template>
                    <!-- END TEMPLATE -->
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
<style>
.custom-panel .p-dropdown-items-wrapper .p-dropdown-items .p-dropdown-item {
    padding: 0px !important;
}
</style>