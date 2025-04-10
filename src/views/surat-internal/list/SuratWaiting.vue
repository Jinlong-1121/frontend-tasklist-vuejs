<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, inject } from 'vue';
import SuratService from '@/service/SuratService';
import { useRouter } from 'vue-router';

const swal = inject('$swal')

const router = useRouter()

const SuratData = ref(null);
const Rows = ref(null);
const user_name_sipam = JSON.parse(localStorage.getItem('sipam')).user_name

const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const first = ref(0)
const keywords = ref("");
const dateSearch = ref("");

const suratService = new SuratService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    var page = (first.value / 10) + 1;
    getListData(page);
});

// VIEW SURAT EXTERNAL
const viewSuratWaiting = (prod) => {
    router.push('/surat-internal/preview/' + prod.id);
};
// END VIEW SURAT EXTERNAL

// GET SURAT EXTERNAL
const getListData = (page, date = "", keyword = "") => {
    keywords.value = keyword
    let dataTarget = JSON.parse(localStorage.getItem("sipam"))
    var params = {
        page: page,
        target: dataTarget.target,
        status: "2",
        type: "2",
        keyword: keyword,
        year: date
    }
    // suratService.getList(params).then((data) => {
    suratService.getList(params).then((data) => {
        SuratData.value = data.rows;
        Rows.value = data.total_rows;
        // console.log("data", data)
    });
};
// END GET SURAT EXTERNAL

// DELETE SURAT EXTERNAL
const cancelSuratWaiting = (data) => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    const htmlContent = `
        <select id="note-select" class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 mb-3 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
            <option value="" disabled selected>Pilih Note</option>
            <option value="link">Link</option>
            <option value="file-pdf">File PDF</option>
        </select>
        <div id="dynamic-file" class="hidden">
            <textarea id="swal-textarea" class="block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-2 px-4 mb-3 leading-tight focus:bg-white" placeholder="Keterangan Cancel"></textarea>
            <input type="file" id="swal-file" class="block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-2 px-4 mb-3 leading-tight focus:bg-white" accept=".pdf">
        </div>
        <div id="dynamic-link" class="hidden">
            <textarea id="swal-textarea-link" class="block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-2 px-4 mb-3 leading-tight focus:bg-white" placeholder="Keterangan Cancel"></textarea>
            <input type="text" id="swal-link" class="block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-2 px-4 mb-3 leading-tight focus:bg-white" placeholder="Link Surat">
        </div>
    `;

    swalWithBootstrapButtons.fire({
        title: 'Cancel Surat!',
        text: `Anda yakin ingin cancel surat ${data.perihal}?`,
        icon: 'warning',
        html: htmlContent,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        preConfirm: () => {
            const selectedValue = document.getElementById('note-select').value;
            const notes = document.getElementById('swal-textarea').value;
            const notes_link = document.getElementById('swal-textarea-link').value;
            const file = document.getElementById('swal-file').files[0];
            const links = document.getElementById('swal-link').value;

            if (!selectedValue) {
                swal.showValidationMessage('Pilih salah satu menu: Link atau File PDF');
                return;
            }

            // Validate based on selected note type
            if (selectedValue === 'file-pdf') {
                if (!notes) {
                    swal.showValidationMessage('Keterangan cancel wajib diisi!');
                    return;
                }

                if (!file) {
                    swal.showValidationMessage('Anda perlu upload file terlebih dahulu!');
                    return;
                }
            } else if (selectedValue === 'link') {
                if (!notes_link) {
                    swal.showValidationMessage('Keterangan cancel wajib diisi!');
                    return;
                }

                if (!links) {
                    swal.showValidationMessage('Link Surat wajib diisi!');
                    return;
                }
            }

            if (selectedValue === 'file-pdf') {
                const formFile = new FormData();
                formFile.append("attachment", file);
                formFile.append("document_id", data.id);

                // Call upload service only for file-pdf
                return suratService.uploadFileNoteCancel(formFile).then((uploadResponse) => {
                    data.status = "7";
                    data.update_cancel_by = user_name_sipam;
                    data.note_cancel = notes;
                    return suratService.putSurat(data);
                }).catch((error) => {
                    swalWithBootstrapButtons.fire('Error!', 'Cancel surat gagal!', 'error');
                    console.error(error);
                });
            } else if (selectedValue === 'link') {
                // For 'link', directly update the status and note without file upload
                data.status = "7";
                data.update_cancel_by = user_name_sipam;
                data.note_cancel = notes_link;
                data.link_cancel = links;
                return suratService.putSurat(data).catch((error) => {
                    swalWithBootstrapButtons.fire('Error!', 'Cancel surat gagal!', 'error');
                    console.error(error);
                });
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            swal.fire({
                icon: 'success',
                title: 'Surat Dibatalkan!',
                text: `Surat ${data.perihal} berhasil dicancel.`,
                showConfirmButton: false,
                timer: 1500
            });
            let page = (first.value / 10) + 1;
            getListData(page);
        }
    });

    // Menambahkan event listener untuk dropdown
    document.getElementById('note-select').addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        const dynamicFile = document.getElementById('dynamic-file');
        const dynamicLink = document.getElementById('dynamic-link');
        const textarea = document.getElementById('swal-textarea');
        const textareaLink = document.getElementById('swal-textarea-link');
        const fileInput = document.getElementById('swal-file');
        const links = document.getElementById('swal-link');

        // Reset visibilitas konten dinamis
        if (selectedValue === 'file-pdf') {
            dynamicFile.classList.remove('hidden'); // Tampilkan konten dinamis
            dynamicLink.classList.add('hidden');
            textarea.classList.remove('hidden'); // Tampilkan textarea
            textareaLink.classList.add('hidden');
            fileInput.classList.remove('hidden'); // Tampilkan input file
            links.classList.add('hidden'); // Sembunyikan input link
        } else if (selectedValue === 'link') {
            dynamicFile.classList.add('hidden'); // Sembunyikan konten dinamis
            dynamicLink.classList.remove('hidden');
            textarea.classList.add('hidden'); // Sembunyikan textarea
            textareaLink.classList.remove('hidden');
            fileInput.classList.add('hidden'); // Sembunyikan input file
            links.classList.remove('hidden'); // Tampilkan input link
        }
    });
};

// END DELETE SURAT EXTERNAL

const accessData = () => {
    const selectedDate = (dateSearch.value) ? dateMonthYear(dateSearch.value) : ""
    var page = (first.value / 10) + 1;
    getListData(page, selectedDate, keywords.value)
};

const dateMonthYear = (dateString) => {
    var date = new Date(dateString);
    var dateFormat = date.getFullYear() + "-" + (String((date.getMonth() + 1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (String((date.getDate())).length != 2 ? "0" + (date.getDate()) : (date.getDate()));
    return dateFormat;
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

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const columns = [
    // { field: 'receiver.user_name', header: 'Tujuan' },
    { field: 'sender.user_name', header: 'Pembuat' },
    { field: 'verificator.user_name', header: 'Verificator' },
];
</script>
<template>
    <div>
        <Toolbar class="mb-4">
            <template v-slot:start>
            </template>

            <template v-slot:end>
                <div class="flex flex-wrap gap-3">
                    <Calendar v-model="dateSearch" placeholder="Created At" showButtonBar />
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="keywords" placeholder="Keyword Search" />
                    </span>
                    <Button type="submit" label="Filter" class="" @click="accessData" />
                </div>
            </template>
        </Toolbar>
        <DataTable ref="dt" :value="SuratData" responsiveLayout="scroll">
            <template #empty>
                <div class="text-center p-2">
                    <p class="text-lg font-semibold">No Data Available</p>
                </div>
            </template>
            <Column header="Aksi" :exportable="false" style="width: 10%; min-width:8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-eye" outlined rounded class="mr-2" @click="viewSuratWaiting(slotProps.data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger"
                        @click="cancelSuratWaiting(slotProps.data)" />
                </template>
            </Column>
            <Column field="category" header="Category" :sortable="false" headerStyle="width:10%; min-width:10rem;">
                <template #body="slotProps">
                    <p>{{ JSON.parse(slotProps.data.category).name }}</p>
                </template>
            </Column>
            <Column field="document_no" header="No.Surat" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <p>{{ slotProps.data.document_no }}</p>
                </template>
            </Column>
            <Column field="perihal" header="Perihal" :sortable="false" headerStyle="width:24%; min-width:10rem;">
                <template #body="slotProps">
                    <p>{{ slotProps.data.perihal }}</p>
                </template>
            </Column>
            <Column field="created_at" header="Tanggal" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <p>{{ setFormatDate(slotProps.data.created_at) }}</p>
                </template>
            </Column>
            <Column field="receiver" header="Tujuan" headerStyle="width:14%; min-width:10rem;">
                <template #body="slotProps">
                    <template v-if="slotProps.data.receiver.length > 3">
                        <template v-if="showAll(slotProps.node.id)">
                            <template v-for="(item, idxTujuan) in slotProps.data.receiver" :key="idxTujuan">
                                <Chip :label="item.user_name" class="mb-2 mr-2" />
                            </template>
                            <a @click="toggleShowAll(slotProps.data.id)">...</a>
                        </template>
                        <template v-else>
                            <template v-for="(item, idxTujuan) in slotProps.data.receiver.slice(0, 3)" :key="idxTujuan">
                                <Chip :label="item.user_name" class="mb-2 mr-2" />
                            </template>
                            <a @click="toggleShowAll(slotProps.data.id)">...</a>
                        </template>
                    </template>
                    <template v-else>
                        <template v-for="(item, idxTujuan) in slotProps.data.receiver" :key="idxTujuan">
                            <Chip :label="item.user_name" class="mb-2 mr-2" />
                        </template>
                    </template>
                </template>
            </Column>
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"
                headerStyle="width:14%; min-width:10rem;"></Column>
            <Column field="status" header="Status" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                <template #body="">
                    <Badge :value="`Need Verif`" severity="warning"></Badge>
                </template>
            </Column>
            <template #footer>
                <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
            </template>
        </DataTable>
    </div>
</template>

<style>
.p-treetable table {
    table-layout: auto !important;
}
</style>

<script>
export default {
    data() {
        return {
            showAllIds: new Set(), // Menggunakan Set untuk menyimpan ID yang sedang ditampilkan
        };
    },
    computed: {
        showAll() {
            return (id) => this.showAllIds.has(id);
        },
    },
    methods: {
        toggleShowAll(id) {
            if (this.showAllIds.has(id)) {
                this.showAllIds.delete(id);
            } else {
                this.showAllIds.add(id);
            }
        },
    },
};
</script>