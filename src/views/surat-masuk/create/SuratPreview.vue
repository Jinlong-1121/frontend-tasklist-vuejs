<script setup>
import { inject, ref, onMounted, onUpdated } from "vue";
import { useRouter } from 'vue-router';
import SuratService from '@/service/SuratService';
import VuePdfEmbed from 'vue-pdf-embed'
import CryptoJS from 'crypto-js'

const swal = inject('$swal')

const router = useRouter()

const suratService = new SuratService();

const dataPdf = ref("");
const page = ref(null);

// const listEmailTujuan = ref();

const props = defineProps({ formData: Object })
const emit = defineEmits(['next-page', 'prev-page']);

onMounted(() => {
    convertFileToBase64()
    console.log(props.formData);
});

onUpdated(() => {
    convertFileToBase64()
});

async function convertFileToBase64() {
    const arrayBuffer = await readFileAsArrayBuffer(props.formData.attachment[0]);
    const base64Data = arrayBufferToBase64(arrayBuffer);
    props.formData.content = base64Data;
    dataPdf.value = 'data:application/pdf;base64,'+base64Data;
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

const prevPage = () => {
    // for (let i = 0; i < selectedPenandatanganExternal.value.length; i++) {
    //     inputForm.signer.push(selectedPenandatanganExternal.value[i])
    // }
    emit('prev-page', {pageIndex: 1});
};

// Handle Complete or Submit
const handleComplete = () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Buat Surat!',
        text: "Anda yakin ingin membuat surat?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        // reverseButtons: true
    }).then((result) => {
        
        if (result.isConfirmed) {
            // const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
            emit('complete');
            let dataTemp = props.formData
            props.formData.category = JSON.stringify(dataTemp.category)
            props.formData.template = JSON.stringify(dataTemp.template)
            props.formData.divisi = JSON.stringify(dataTemp.divisi)
            props.formData.data_form = JSON.stringify(dataTemp.data_form)
            props.formData.status = "2"
            // dataTemp.status = "2"

            console.log(props.formData.category);
            
            suratService.updateActionAccess(dataTemp).then((res) => {
                console.log(res, "RESPONSE");
                swalWithBootstrapButtons.fire(
                    'Success!',
                    'Surat anda berhasil dibuat.',
                    'success'
                )
                // handleDraft();
            });
        }
    })
} 
// End Handle Complete or Submit

// listEmailTujuan.value.forEach(el => {
//         const content = `
//             <h4>Dear ${el.user_name}</h4>
//             <p>Ada Surat Masuk nih</p>
//             <p></p>
//             <p>Regard</p>
//             <p>siPAM</p> 
//         `
//         sendingEmail(file, "Surat Masuk", el.email, content)
//         // console.log(file, "Surat Masuk", el.email, content)
//     });

const sendingEmail = (file, subject, to, content) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("to", to);
    formData.append("content", content);
    suratService.uploadSuratMasuk(formData).then((res) => {
        console.log(res, "response");
        router.push('/surat-masuk/list/waiting');
    });
}

const mergeEmail = () => {
    const listEmail = [];
    listEmail.push({
        name: props.formData.verificator.user_name,
        email: props.formData.verificator.email,
        type: "verificator"
    });
    props.formData.receiver.forEach(el => {
        listEmail.push({
            name: el.user_name,
            email: el.email,
            type: "receiver"
        });
    });
    return listEmail;
}

// Handle Draft
const handleDraft = () => {
    console.log(props.formData, " data form");

    const dataUser = {
        user: props.formData.verificator.user_id,
        id: props.formData.id,
    }

    const encData = encrypt(JSON.stringify(dataUser));
    const linkUrl = `http://localhost:2323/#/surat/masuk/page?link=${encData}`


    const dataEmail = mergeEmail();
    console.log(dataEmail, " data email");
    const filex = props.formData.attachment[0]

    dataEmail.forEach(el => {
        const contentVerif = `
            <h4>Dear ${el.name}</h4>
            <p>Anda ditunjuk sebagai <b><i>verificator</i><b> untuk memverifikasi surat masuk baru. Untuk melanjutkan proses verifikasi, silahkan klik  akses SiPAM atau klik link dibawah. </p>
            <p>
                <a href="${linkUrl}" target="_blank">Halaman verifikasi SiPAM</a>
            </p>
            <p>Regard</p>
            <p>siPAM</p> 
        `
        const contentReceive = `
            <h4>Dear ${el.name}</h4>
            <p>Ada surat masuk baru yang ditujukan kepada anda. Silahkan akses SiPAM atau klik link dibawah ini.</p>
            <p>
                <a href="${linkUrl}" target="_blank">Klik Disini</a>
            </p>
            <p>Regard</p>
            <p>siPAM</p> 
        `

        const content = (el.type === "verificator") ? contentVerif : contentReceive;
        sendingEmail(filex, "Surat Masuk", el.email, content)
        // console.log(file, "Surat Masuk", el.email, content)
    });

    console.log(encData, " data preview");
    console.log(decrypt(encData), " data preview2");

    //sending email
    
    // const swalWithBootstrapButtons = swal.mixin({
    //     customClass: {
    //         confirmButton: 'btnCustomSweetalert bg-yellow-500',
    //         cancelButton: 'btnCustomSweetalert bg-red-500'
    //     },
    //     buttonsStyling: false
    // })

    // swalWithBootstrapButtons.fire({
    //     title: 'Draft Surat!',
    //     text: "Anda yakin ingin membuat draft?",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Submit',
    //     cancelButtonText: 'Cancel',
    //     // reverseButtons: true
    // }).then((result) => {

    //     if (result.isConfirmed) {
    //         emit('draft');
    //         delete props.formData.type
    //         let dataTemp = props.formData
    //         props.formData.category = JSON.stringify(dataTemp.category)
    //         props.formData.template = JSON.stringify(dataTemp.template)
    //         props.formData.divisi = JSON.stringify(dataTemp.divisi)
    //         props.formData.status = "0"
            
    //         suratService.postSurat(props.formData).then((res) => {
    //             console.log(res, "RESPON");
    //             swalWithBootstrapButtons.fire(
    //                 'Success!',
    //                 'Surat anda berhasil di draft.',
    //                 'success'
    //             )
    //             router.push('/surat-internal/list/draft');
    //         });
    //     }
    // })
} 
// End Handle Draft
const key = 'mySecretKey'
const encrypt = (inputText) => {
  if (inputText.trim() === '') {
    alert('Please enter text to encrypt!')
    return
  }
  return CryptoJS.AES.encrypt(inputText, key).toString()
}

const decrypt = (outputText) => {
  if (outputText.trim() === '') {
    alert('Nothing to decrypt!')
    return
  }
  try {
    const decryptedText = CryptoJS.AES.decrypt(outputText, key).toString(CryptoJS.enc.Utf8)
    return decryptedText
  } catch (error) {
    alert('Error decrypting text!')
    return
  }
}

</script>
<template>
    <div class="stepsdemo-content">
        <Card class="mt-3">
            <template v-slot:title>
                Preview Surat
            </template>
            <template v-slot:content>
                <div class="p-fluid grid mt-3">
                    <div class="field col-12 md:col-3">
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Nomor Surat</label>
                            <br>
                            <b>{{formData.document_no}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Kategori</label>
                            <br>
                            <b>{{formData.category.name}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Perihal</label>
                            <br>
                            <b>{{formData.perihal}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Tujuan</label><br>
                            <template v-for="item, idxTujuan in formData.receiver" :key="idxTujuan">
                                <Chip :label="item.user_name" class="mb-2 mr-2"/>
                            </template>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Verificator</label><br>
                            <b>{{formData.verificator.user_name}}</b>
                        </div>
                    </div>
                    <div class="field col-12 md:col-9">
                            <br>
                            <div class="bg-gray-300">

                                <ScrollPanel style="width: 100%; height: 1300px" class="custombar1">
                                    <div class="p-8">
                                        <vue-pdf-embed
                                            ref="pdfRef"
                                            :source="dataPdf"
                                            :page="page"
                                            @password-requested="handlePasswordRequest"
                                            @rendered="handleDocumentRender"
                                        />
                                    </div>
                                </ScrollPanel>
                            </div>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="grid grid-nogutter justify-content-between">
                    <div>
                        <Button label="Back" @click="prevPage()" icon="pi pi-angle-left" />
                    </div>
                    <div>
                        <!-- <Button label="Draft" @click="handleDraft()" icon="pi pi-file-edit" iconPos="right" class="p-button-secondary mr-2"/> -->
                        <Button label="Submit" @click="handleComplete()" icon="pi pi-check" iconPos="right" class="p-button-success"/>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<!-- <script>
export default {
    props: {
        formData: Object
    },
    methods: {
        prevPage() {
            this.$emit('prev-page', {pageIndex: 2});
        },
        complete() {
            this.$emit('complete');
        }
    }
}
</script> -->
<style scoped>
::v-deep(.p-scrollpanel.custombar1 .p-scrollpanel-wrapper) {
    /* border-right: 10px solid var(--surface-ground); */
    border-right: 10px solid var(--gray-300);
}

::v-deep(.p-scrollpanel.custombar1 .p-scrollpanel-bar) {
    background-color: var(--primary-300);
    opacity: 1;
    transition: background-color 0.3s;
}

::v-deep(.p-scrollpanel.custombar1 .p-scrollpanel-bar:hover) {
    background-color: var(--primary-400);
}

::v-deep(.vue-pdf-embed canvas) {
    margin-top: 10px;
}

::v-deep(.plb-10) {
    padding-left: 10px;
    padding-bottom: 10px;
}

::v-deep(.p-scrollpanel.custombar2 .p-scrollpanel-wrapper) {
    border-right: 10px solid var(--surface-50);
    border-bottom: 10px solid var(--surface-50);
}

::v-deep(.p-scrollpanel.custombar2 .p-scrollpanel-bar) {
    background-color: var(--surface-300);
    border-radius: 0;
    opacity: 1;
    transition: background-color 0.3s;
}
</style>
<style>
.btnCustomSweetalert {
    border: none;
    padding: 12px 32px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 4px;
    cursor: pointer;
}
</style>