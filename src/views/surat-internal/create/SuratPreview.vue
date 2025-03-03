<script setup>
import { inject, ref, onMounted, onUpdated } from "vue";
import { useRouter } from 'vue-router';
import SuratService from '@/service/SuratService';
import AbsenService from '@/service/AbsenService';
import VuePdfEmbed from 'vue-pdf-embed'

const swal = inject('$swal')

const router = useRouter()

const suratService = new SuratService();
const absenService = new AbsenService();

const dataPdf = ref();
const page = ref(null);
const pdfSource = ref("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf");

const props = defineProps({ formData: Object })
const emit = defineEmits(['next-page', 'prev-page']);

onMounted(() => {
    console.log('update', props.formData.template.parameter[0].value);
    const form = new FormData();
    form.append("content", props.formData.content)
    for (let i = 0; i < props.formData.attachment.length; i++) {
        form.append("attachment[]", props.formData.attachment[i])
    }
    if (props.formData.need_attach === '0') {
        generatePDF(form);
    }else {
        dataPdf.value = props.formData.template.parameter[0].value
    }
});

onUpdated(() => {
    console.log('update', props.formData.template.parameter[0].value);
    const form = new FormData();
    form.append("content", props.formData.content)
    for (let i = 0; i < props.formData.attachment.length; i++) {
        form.append("attachment[]", props.formData.attachment[i])
    }
    if (props.formData.need_attach === '0') {
        generatePDF(form);
    }else {
        dataPdf.value = props.formData.template.parameter[0].value
    }
});

const generatePDF = (params) => {
    suratService.generatePDF(params).then((data) => (dataPdf.value = data));
}

const prevPage = () => {
    // for (let i = 0; i < selectedPenandatanganExternal.value.length; i++) {
    //     inputForm.signer.push(selectedPenandatanganExternal.value[i])
    // }
    emit('prev-page', {pageIndex: 2});
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
            const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))

            emit('complete');
            delete props.formData.total_cuti
            let dataTemp = props.formData
            let tempDataCheckTypeTemplate = props.formData.template
            let tempDataFormCuti = [];
            if (tempDataCheckTypeTemplate.name === 'Template Izin Cuti') {
                tempDataFormCuti = props.formData.template.parameter[0]
            }
            props.formData.category = JSON.stringify(dataTemp.category)
            props.formData.template = JSON.stringify(dataTemp.template)
            props.formData.divisi = JSON.stringify(dataTemp.divisi)
            props.formData.data_form = JSON.stringify(dataTemp.data_form)
            // props.formData.receiver[0].is_read = "0"
            props.formData.status = "2"
            
            suratService.postSurat(dataTemp).then((res) => {
                // POST SURAT CUTI
                if (tempDataCheckTypeTemplate.name === 'Template Izin Cuti') {
                    tempDataFormCuti.value.map((date, index) => {
                        let d = new Date(date),
                        bulan = '' + (d.getMonth() + 1),
                        tanggal = '' + d.getDate(),
                        tahun = d.getFullYear();
                        
                        if (bulan.length < 2) 
                            bulan = '0' + bulan;
                        if (tanggal.length < 2) 
                            tanggal = '0' + tanggal;
    
                        const dataAbsen = {
                            type: 1,
                            pin: dataLocalStorage.pin,
                            date: [tahun, bulan, tanggal].join('-'),
                            times: '',
                            keterangan: 'Izin Cuti',
                            doc_id: `${res.data.id}`,
                            status: '1'
                        }
    
                        absenService.postSuratSisaCuti(dataAbsen).then((resp) => {
                        })
                    })
                }
                // END POST SURAT CUTI

                if (props.formData.attachment.length !== 0) {
                    const formAttach = new FormData();
                    formAttach.append("document_id", res.data.id)
                    for (let i = 0; i < props.formData.attachment.length; i++) {
                        formAttach.append("attachment[]", props.formData.attachment[i])
                    }
                    suratService.postAttachment(formAttach).then((rest) => {
                        swalWithBootstrapButtons.fire(
                            'Success!',
                            'Surat anda berhasil dibuat.',
                            'success'
                        )
                        router.push('/surat-internal/list/waiting');
                    })
                }else {
                    swalWithBootstrapButtons.fire(
                        'Success!',
                        'Surat anda berhasil dibuat.',
                        'success'
                    )
                    router.push('/surat-internal/list/waiting');
                }
                // router.push('/surat-external/list/waiting');
            });
        }
    })
} 
// End Handle Complete or Submit

// Handle Draft
const handleDraft = () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Draft Surat!',
        text: "Anda yakin ingin membuat draft?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        // reverseButtons: true
    }).then((result) => {

        if (result.isConfirmed) {
            emit('draft');
            delete props.formData.type
            let dataTemp = props.formData
            props.formData.category = JSON.stringify(dataTemp.category)
            props.formData.template = JSON.stringify(dataTemp.template)
            props.formData.divisi = JSON.stringify(dataTemp.divisi)
            props.formData.status = "0"
            
            suratService.postSurat(props.formData).then((res) => {
                console.log(res, "RESPON");
                if (props.formData.attachment.length !== 0) {
                    const formAttach = new FormData();
                    formAttach.append("document_id", res.data.id)
                    for (let i = 0; i < props.formData.attachment.length; i++) {
                        formAttach.append("attachment[]", props.formData.attachment[i])
                    }
                    suratService.postAttachment(formAttach).then((rest) => {
                        swalWithBootstrapButtons.fire(
                            'Success!',
                            'Surat anda berhasil di draft.',
                            'success'
                        )
                        router.push('/surat-internal/list/draft');
                    })
                }
                swalWithBootstrapButtons.fire(
                    'Success!',
                    'Surat anda berhasil di draft.',
                    'success'
                )
                router.push('/surat-internal/list/draft');
            });
        }
    })
} 
// End Handle Draft

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
                            <!-- <div class="flex align-items-center">
                                <i class="pi pi-key mr-2"></i>
                            </div> -->
                            <label for="Perihal">Nomor Surat</label>
                            <br>
                            <b>{{formData.document_no}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <!-- <div class="flex align-items-center">
                                <i class="pi pi-bars mr-2"></i>
                            </div> -->
                            <label for="Perihal">Kategori</label>
                            <br>
                            <b>{{formData.category.name}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <!-- <div class="flex align-items-center">
                                <i class="pi pi-tag mr-2"></i>
                            </div> -->
                            <label for="Perihal">Perihal</label>
                            <br>
                            <b>{{formData.perihal}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Tujuan</label><br>
                            <template v-for="item, idxTujuan in formData.receiver" :key="idxTujuan">
                                <Chip :label="item.user_name" class="mb-2 mr-2"/>
                            </template>
                            <!-- <b>{{formData.receiver.user_name}}</b><br>
                            <b>{{formData.receiver.alamat}}</b> -->
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Up">Lampiran</label><br>
                            <div class="flex flex-wrap gap-2" v-if="formData.attachment?.length !== 0">
                                <template v-for="item, idx in formData.attachment" :key="idx">
                                    <Chip class="p-2 px-3 bg-primary-500" style="width: 100%;">
                                        <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.name }}</p>
                                    </Chip>
                                </template>
                            </div>
                            <b v-if="formData.attachment?.length === 0">-</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Penanda Tangan</label><br>
                            <div class="flex flex-wrap gap-2">
                                <template v-for="item, idx in formData.signer" :key="idx">
                                    <Chip :label="item.user_name" />
                                </template>
                            </div>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Verificator</label><br>
                            <b>{{formData.verificator.user_name}}</b>
                            <!-- <div class="flex flex-wrap gap-2">
                                <template v-for="item, idx in formData.verificator" :key="idx">
                                    <Chip :label="item.user_name" />
                                </template>
                            </div> -->
                        </div>
                        <!-- <label for="class">Data</label>
                        <br>
                        <pre>
                            <b>{{formData}}</b>
                        </pre> -->
                    </div>
                    <div class="field col-12 md:col-9">
                        <!-- <div class="field col-12 mb-0"> -->
                            <!-- <label for="class" class="mt-3">Content Surat</label> -->
                            <!-- <br> -->
                            <br>
                            <!-- <div v-html="props.formData.content"></div> -->
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
                            <div>
                                <!-- <iframe :src="dataPdf" frameborder="0" width="100%" height="500px"></iframe> -->
                                <!-- <iframe src="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" frameborder="0" toolbar="0" width="100%" height="500px"></iframe> -->
                                
                            </div>
                        <!-- </div> -->
                    </div>
                </div>
                <!-- <div class="field col-12">
                    <label for="class">Name</label>
                    <b>{{formData.firstname ? formData.firstname : '-'}} {{formData.lastname ? formData.lastname : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Age</label>
                    <b>{{formData.age ? formData.age : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Seat Class</label>
                    <b>{{formData.class ? formData.class : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Wagon Number</label>
                    <b>{{formData.vagon ? formData.vagon : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Seat</label>
                    <b>{{formData.seat ? formData.seat : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Cardholder Name</label>
                    <b>{{formData.cardholderName ? formData.cardholderName : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Card Number</label>
                    <b>{{formData.cardholderNumber ? formData.cardholderNumber : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Date</label>
                    <b>{{formData.date ? formData.date : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">CVV</label>
                    <b>{{formData.cvv && formData.cvv.length === 3  ? '**' + formData.cvv[2] : '-'}}</b>
                </div> -->
            </template>
            <template v-slot:footer>
                <div class="grid grid-nogutter justify-content-between">
                    <div>
                        <Button label="Back" @click="prevPage()" icon="pi pi-angle-left" />
                    </div>
                    <div>
                        <Button label="Draft" @click="handleDraft()" icon="pi pi-file-edit" iconPos="right" class="p-button-secondary mr-2"/>
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