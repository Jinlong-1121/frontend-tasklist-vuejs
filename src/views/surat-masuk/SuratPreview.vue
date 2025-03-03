<script setup>
import { inject, ref, onMounted, onUpdated, reactive } from "vue";
import SuratService from '@/service/SuratService';
import VuePdfEmbed from 'vue-pdf-embed'
import { useRoute, useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast';

const swal = inject('$swal')

const route = useRoute();
const router = useRouter();
const paramId = route.params.id;

const suratService = new SuratService();
const dataSinglePreview = ref({});
const dataCategoryPreview = ref({});
const dataSignerUser = ref({})
const toast = useToast();
const statusSign = ref(false)

const dataPdf = ref();

const page = ref(null);

const props = defineProps({ formData: Object })
const emit = defineEmits(['next-page', 'prev-page']);

onMounted(() => {
    getListSingleData();
    if (dataSignerUser.value.is_sign === '0' && dataSinglePreview.value.status === '3') {
        statusSign.value = true
    }
});

onUpdated(() => {
    getListSingleData();
});

// GET SURAT EXTERNAL
const getListSingleData = () => {
    const param = {
        id: paramId
    }
    suratService.getDetail(param).then((data) => {
        dataSinglePreview.value = data;
        dataCategoryPreview.value = JSON.parse(data.category)

        dataPdf.value = `http://192.168.4.250:6067/file/download/${data.asset_url}`
        // setUserIDSigner(data.signer)
    });
};
// END GET SURAT EXTERNAL

// USER ID
const setUserIDVerif = () => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    if(dataSinglePreview.value.verificator?.user_id === dataLocalStorage.target && dataSinglePreview.value.status === "2") {
        return true
    }else {
        return false
    } 
}
const setUserIDSigner = (dataParam) => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    dataParam.map(item => {
        if (item.user_id === dataLocalStorage.target) {
            dataSignerUser.value = item
        }
    })
}
// END USER ID

// HANDLE VERIF
const handleVerif = () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Verifikasi Surat!',
        text: "Anda yakin ingin verifikasi surat?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            dataSinglePreview.value.verificator.is_verification = "1"
            dataSinglePreview.value.status = "3"
            statusSign.value = true
            return suratService.putSurat(dataSinglePreview.value).then((res) => {
                if (!res.error) {
                    swalWithBootstrapButtons.fire(
                        'Success!',
                        'Surat berhasil diverifikasi.',
                        'success'
                    )
                    router.push('/surat-masuk/list');
                }else {
                    toast.add({ severity: 'error', summary: 'Failed!', detail: res.data, life: 2000 });
                    dataSinglePreview.value.status = "2"
                    dataSignerUser.value.is_sign = "0"
                    statusSign.value = true
                }
            })
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            
        }
    })
}
// END HANDLE VERIF

// HANDLE REVISI
const handleRevisi = () => {
    swal.fire({
        title: 'Isi note revisi',
        input: 'textarea',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: (inputText) => {
            dataSinglePreview.value.note = inputText
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            dataSinglePreview.value.status = "1"
            suratService.putSurat(dataSinglePreview.value).then((res) => {
                swal.fire(
                    'Success!',
                    'Surat berhasil untuk direvisi.',
                    'success'
                )
                router.push('/surat-internal/list/open');
            });
        }
    })
}
// END HANDLE REVISI

const handleDownload = (url, urlName) => {
    fetch(url, {
        method: 'GET'
    }).then(resp => resp.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = urlName; // the filename you want
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
}
const printDocument = (url) => {
    var iframe = _printIframe;
    if (!_printIframe) {
        iframe = _printIframe = document.createElement('iframe');
        document.body.appendChild(iframe);

        iframe.style.display = 'none';
        iframe.onload = function() {
        setTimeout(function() {
            iframe.focus();
            iframe.contentWindow.print();
        }, 1);
        };
    }

    iframe.src = url;
}

// HANDLE GO BACK
const goBack = () => {
    router.push('/surat-masuk/list');
}

</script>
<template>
    <div class="stepsdemo-content">
        <Toast />
        <Card class="mt-3">
            <template v-slot:title>
                <div class="grid">
                    <div class="field col-12 md:col-6">
                        <div class="flex align-items-baseline">
                            <Button @click="goBack()" iconPos="right" class="p-button-warning mx-1">
                                <i class="fas fa-arrow-left"></i>
                            </Button>
                            <span class="mb-3">
                                Preview Surat
                            </span>
                        </div>
                    </div>
                    <div class="field col-12 md:col-6 text-right">
                        <Button v-if="dataSinglePreview.status === '4'" @click="handleDownload(`http://192.168.4.250:6067/file/document/${dataSinglePreview.asset_url}`, dataSinglePreview.asset_url)" iconPos="right" class="p-button-warning mx-1">
                        <!-- <Button v-if="dataSinglePreview.status === '4'" @click="handleDownload(`${dataSinglePreview.link_url}`, dataSinglePreview.asset_url)" iconPos="right" class="p-button-warning mx-1"> -->
                            <span class="mr-2">Download</span>
                            <i class="fas fa-cloud-download-alt"></i>
                        </Button>
                    </div>
                </div>
            </template>
            <template v-slot:content>
                <div class="p-fluid grid">
                    <div class="field col-12 md:col-3">
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Nomor</label>
                            <br>
                            <b>{{dataSinglePreview.document_no}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Kategori</label>
                            <br>
                            <b>{{dataCategoryPreview.name}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Perihal</label>
                            <br>
                            <b>{{dataSinglePreview.perihal}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Tujuan</label><br>
                            <template v-for="item, idxTujuan in dataSinglePreview.receiver" :key="idxTujuan">
                                <Chip :label="item.user_name" class="mb-2 mr-2"/>
                            </template>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Verifikator</label>
                            <br>
                            <b>{{dataSinglePreview.verificator?.user_name}}</b>
                        </div>
                    </div>
                    <div class="field col-12 md:col-9">
                            <br>
                            <div class="bg-gray-300">
                                <ScrollPanel style="width: 100%; height: 1300px" class="custombar1">
                                    <div class="p-8">
                                        <vue-pdf-embed
                                        v-if="dataSinglePreview.parent === 0"
                                        ref="pdfRef"
                                        :source="`data:application/pdf;base64,`+dataSinglePreview.content"
                                        :page="page"
                                        @password-requested="handlePasswordRequest"
                                        @rendered="handleDocumentRender"
                                        />
                                        <vue-pdf-embed
                                        v-else
                                        ref="pdfRef"
                                        :source="dataPdf"
                                        :page="page"
                                        @password-requested="handlePasswordRequest"
                                        @rendered="handleDocumentRender"
                                        />
                                        <!-- <vue-pdf-embed
                                        ref="pdfRef"
                                        :source="`data:application/pdf;base64,`+dataSinglePreview.content"
                                        :page="page"
                                        @password-requested="handlePasswordRequest"
                                        @rendered="handleDocumentRender"
                                        /> -->
                                    </div>
                                </ScrollPanel>
                            </div>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="grid grid-nogutter justify-content-end">
                    <Button v-if="setUserIDVerif()" label="Revisi" @click="handleRevisi()" icon="pi pi-times" iconPos="right" class="p-button-danger mx-1"/>
                    <Button v-if="setUserIDVerif()" label="Verif" @click="handleVerif()" icon="pi pi-check" iconPos="right" class="p-button-success mx-1"/>
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