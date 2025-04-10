<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, inject } from 'vue';
import SuratService from '@/service/SuratService';
import { useRouter } from 'vue-router';

const swal = inject('$swal')

const router = useRouter()

const SuratData = ref(null);
const Rows = ref(null);
const divisiRole = JSON.parse(localStorage.getItem('sipam'))

const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const first = ref(0)
const loading = ref(false);
const keywords = ref("");
const dateSearch = ref("");

const suratService = new SuratService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    var page = (first.value / 10) + 1;
    getListData(page);
    loading.value = true;

    setTimeout(() => {
        loading.value = false;
    }, 1000);
});

// VIEW SURAT EXTERNAL
const viewSuratCompleteMasuk = (prod) => {
    // // console.log(prod, "HALO");
    router.push('/surat-masuk/preview/' + prod.id);
};
// END VIEW SURAT EXTERNAL
const replySuratMasuk = (prod) => {
    router.push('/surat/masuk/balas/' + prod.id);
};
// GET SURAT EXTERNAL
const getListData = (page, date = "", keyword = "") => {
    let dataTarget = JSON.parse(localStorage.getItem("sipam"))
    var params = {
        page: page,
        target: dataTarget.target,
        status: "4",
        type: "3",
        keyword: keyword,
        year: date
    }
    // suratService.getList(params).then((data) => {
    suratService.getList(params).then((data) => {
        SuratData.value = data.rows
        SuratData.value.forEach((item, i) => {
            item.key = item.id
        });
        Rows.value = data.total_rows;
    });
};
// END GET SURAT EXTERNAL

// DELETE SURAT EXTERNAL
const deleteSuratComplete = (data) => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Delete Surat Masuk!',
        text: "Anda yakin ingin delete surat masuk?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            const param = {
                id: data.id
            }
            suratService.deleteSurat(param).then((data) => {
                let page = (first.value / 10) + 1;
                // let date = new Date();
                // let currentDate = dateMonthYear(date);
                // filterMonth.value = date;
                getListData(page);
            });
        }
    })
};
// END DELETE SURAT EXTERNAL

const accessData = () => {
    const selectedDate = (dateSearch.value) ? dateMonthYear(dateSearch.value) : ""
    var page = (first.value / 10) + 1;
    getListData(page, selectedDate, keywords.value)
};

const dateMonthYear = (dateString) => {
    var date = new Date(dateString);
    var dateFormat = date.getFullYear() + "-" + (String((date.getMonth() + 1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
    return dateFormat;
}

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

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

const columns = [
    { field: 'label', header: 'Name', expander: true },
];
</script>
<template>
    <div>
        <Toast />
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
        <!-- <p>{{ SuratData }}</p> -->
        <TreeTable :value="SuratData" :loading="loading" responsiveLayout="scroll">
            <template #empty>
                <div class="text-center p-2">
                    <p class="text-lg font-semibold">No Data Available</p>
                </div>
            </template>
            <!-- <Column
            v-for="col of columns"
            :key="col.field"
            :expander="col.expander"
        ></Column> -->
            <Column header="Aksi" :exportable="false" headerStyle="min-width:14rem" expander>
                <template #body="slotProps">
                    <Button icon="pi pi-eye" outlined rounded class="mr-2 "
                        @click="viewSuratCompleteMasuk(slotProps.node)" />
                    <Button v-if="slotProps.node.parent === 0" icon="pi pi-reply" outlined rounded severity="success"
                        class="mr-2 " @click="replySuratMasuk(slotProps.node)" />
                    <!-- <Button icon="pi pi-reply" outlined rounded class="mr-2 " severity="secondary" /> -->
                    <Button v-if="divisiRole.divisi === 1" icon="pi pi-trash" outlined rounded severity="danger"
                        class="" @click="deleteSuratComplete(slotProps.node)" />
                </template>
            </Column>
            <Column field="category" header="Category" headerStyle="min-width:10rem;">
                <template #body="slotProps">
                    <span>{{ JSON.parse(slotProps.node.category)?.name }}</span>
                </template>
            </Column>
            <Column field="document_no" header="No.Surat" headerStyle="min-width:12rem;">
                <template #body="slotProps">
                    <span>{{ slotProps.node.document_no }}</span>
                </template>
            </Column>
            <Column field="perihal" header="Perihal" headerStyle="min-width:12rem;">
                <template #body="slotProps">
                    <span>{{ slotProps.node.perihal }}</span>
                </template>
            </Column>
            <Column field="created_at" header="Tanggal" :sortable="false" headerStyle="min-width:9rem;">
                <template #body="slotProps">
                    <p>{{ setFormatDate(slotProps.node.created_at) }}</p>
                </template>
            </Column>
            <Column field="receiver" header="Tujuan" headerStyle="min-width:14rem;">
                <template #body="slotProps">
                    <template v-for="item, idxTujuan in slotProps.node.receiver" :key="idxTujuan">
                        <Chip :label="item.user_name" class="mb-2 mr-2" />
                    </template>
                    <!-- <span>{{ slotProps.node.receiver.user_name }}</span> -->
                </template>
            </Column>
            <Column field="user_name" header="Pembuat" headerStyle="min-width:12rem;">
                <template #body="slotProps">
                    <span>{{ slotProps.node.sender.user_name }}</span>
                </template>
            </Column>
            <Column field="Verifikator" header="Verifikator" headerStyle="min-width:12rem;">
                <template #body="slotProps">
                    <span>{{ slotProps.node.verificator.user_name }}</span>
                </template>
            </Column>
            <Column field="status" header="Status" :sortable="false">
                <template #body="">
                    <Badge :value="`Complete`" severity="success"></Badge>
                </template>
            </Column>
            <!-- <Column field="size" header="Size"></Column> -->
            <template #footer>
                <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
            </template>
        </TreeTable>
    </div>
</template>
<style>
.p-treetable table {
    table-layout: auto !important;
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

.vue-pdf-embed>div {
    display: flex;
    justify-content: center;
}

.vue-pdf-embed>div>canvas {
    width: 100% !important;
    height: auto !important;
}
</style>