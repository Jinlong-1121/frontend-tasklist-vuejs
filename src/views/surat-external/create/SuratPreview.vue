<script setup>
import { inject, ref, onMounted, onUpdated } from "vue";
import { useRouter } from 'vue-router';
import SuratService from '@/service/SuratService';
import VuePdfEmbed from 'vue-pdf-embed'

const swal = inject('$swal')

const router = useRouter()

const suratService = new SuratService();
const dataPdf = ref();
const page = ref(null);
// const pdfSource = ref("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf");

const props = defineProps({ formData: Object })
const emit = defineEmits(['next-page', 'prev-page']);

onMounted(() => {
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
        allowOutsideClick: () => !swal.isLoading(), // Tidak bisa klik luar saat loading
        // reverseButtons: true
    }).then((result) => {

        if (result.isConfirmed) {
            emit('complete');
            let dataTemp = props.formData
            props.formData.category = JSON.stringify(dataTemp.category)
            props.formData.template = JSON.stringify(dataTemp.template)
            props.formData.data_form = JSON.stringify(dataTemp.data_form)
            props.formData.document_nature = JSON.stringify(dataTemp.document_nature)
            props.formData.receiver[0].up = props.formData.up
            props.formData.receiver[0].is_read = "0"
            props.formData.status = "2"
            
            suratService.postSurat(dataTemp).then((res) => {
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
                        router.push('/surat-external/list/waiting');
                    })
                }else {
                    swalWithBootstrapButtons.fire(
                        'Success!',
                        'Surat anda berhasil dibuat.',
                        'success'
                    )
                    router.push('/surat-external/list/waiting');
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
            let dataTemp = props.formData
            props.formData.category = JSON.stringify(dataTemp.category)
            props.formData.template = JSON.stringify(dataTemp.template)
            props.formData.document_nature = JSON.stringify(dataTemp.document_nature)
            props.formData.receiver[0].up = props.formData.up
            props.formData.receiver[0].is_read = "0"
            props.formData.status = "0"
            
            suratService.postSurat(dataTemp).then((res) => {
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
                        router.push('/surat-external/list/draft');
                    })
                }
                swalWithBootstrapButtons.fire(
                    'Success!',
                    'Surat anda berhasil di draft.',
                    'success'
                )
                router.push('/surat-external/list/draft');
            });
        }
    })
} 
// End Handle Draft

</script>
<template>
    {{ console.log("form", formData) }}
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
                            <label for="Perihal">Sifat Surat</label>
                            <br>
                            <b>{{formData.document_nature.name_document_nature}}</b>
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
                            <b>{{formData.receiver[0].user_name}}</b><br>
                            <b>{{formData.receiver[0].alamat}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Up">Up</label><br>
                            <b>{{formData.up ? formData.up : '-'}}</b>
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
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Jenis Tandatangan</label>
                            <br>
                            <b>{{ formData.need_sign === '1' ? 'Tandatangan Digital (VIDA)' :
                                (formData.need_sign === '0' ?
                                    'Tandatangan Basah' : '') }}</b>
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
                            <div>
                                <!-- <iframe :src="dataPdf" frameborder="0" width="100%" height="500px"></iframe> -->
                                <!-- <iframe src="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" frameborder="0" toolbar="0" width="100%" height="500px"></iframe> -->
                                
                            </div>
                        <!-- </div> -->
                    </div>
                </div>
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