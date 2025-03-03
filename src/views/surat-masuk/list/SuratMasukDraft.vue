
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
const keywords = ref("");
const dateSearch = ref("");

const suratService = new SuratService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    var page = (first.value/10)+1;
    getListData(page);
});

// VIEW SURAT EXTERNAL
const viewSuratWaiting = (prod) => {
    router.push('/surat/masuk/edit/'+prod.id);
};
// END VIEW SURAT EXTERNAL

// GET SURAT EXTERNAL
const getListData = (page, date="", keyword="") => {
    keywords.value = keyword
    let dataTarget = JSON.parse(localStorage.getItem("sipam"))
    var params = {
        page: page,
        target: dataTarget.target,
        status: "0",
        type: "3",
        keyword: keyword,
        year: date
    }
    // suratService.getList(params).then((data) => {
    suratService.getList(params).then((data) => {
        SuratData.value = data.rows;
        Rows.value = data.total_rows;
    });
};
// END GET SURAT EXTERNAL

// DELETE SURAT EXTERNAL
const deleteSuratWaiting = (data) => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Delete Surat!',
        text: `Anda yakin ingin delete surat ${data.perihal}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            const param = {
                id: data.id
            }
            suratService.deleteSurat(param).then((res) => {
                let page = (first.value/10)+1;
                let date = new Date();
                let currentDate = dateMonthYear(date);
                // filterMonth.value = date;
                getListData(page,currentDate);
                swal.fire({
                    icon: 'success',
                    title: 'Surat!',
                    text: `Surat ${data.perihal} berhasil dihapus.`,
                    showConfirmButton: false,
                    timer: 1500
                })
            });
        }
    })
};
// END DELETE SURAT EXTERNAL

const accessData = () => {
    const selectedDate = (dateSearch.value) ? dateMonthYear(dateSearch.value) : ""
    var page = (first.value/10)+1;
    getListData(page, selectedDate, keywords.value)
};

const dateMonthYear = (dateString) => {
    var date = new Date(dateString);
    var dateFormat = date.getFullYear() + "-" +(String((date.getMonth()+1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1)) + "-" +(String((date.getDate())).length != 2 ? "0" + (date.getDate()) : (date.getDate()));
    return dateFormat;
}

const setFormatDate = (data) => {
    let date = data?new Date(data):new Date();
    let tahun = date.getFullYear();
    let bulan = date.getMonth();
    let tanggal = date.getDate();
    let hari = date.getDay();
    switch(hari) {
        case 0: hari = "Minggu"; break;
        case 1: hari = "Senin"; break;
        case 2: hari = "Selasa"; break;
        case 3: hari = "Rabu"; break;
        case 4: hari = "Kamis"; break;
        case 5: hari = "Jum'at"; break;
        case 6: hari = "Sabtu"; break;
    }
    switch(bulan) {
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
                            <Button type="submit" label="Filter" class="" @click="accessData"/>
                        </div>
                    </template>
                </Toolbar>
    <DataTable ref="dt" :value="SuratData" responsiveLayout="scroll">
        <Column header="Aksi" :exportable="false" style="width: 100%; min-width:8rem">
            <template #body="slotProps">
                <Button icon="pi pi-eye" outlined rounded class="mr-2" @click="viewSuratWaiting(slotProps.data)" />
                <Button icon="pi pi-trash" outlined rounded severity="danger" @click="deleteSuratWaiting(slotProps.data)" />
            </template>
        </Column>
        <Column field="category" header="Category" :sortable="false" headerStyle="width: 100%; min-width:10rem;">
            <template #body="slotProps">
                <p v-if="slotProps.data.category != ''">{{ JSON.parse(slotProps.data.category).name }}</p>
            </template>
        </Column>
        <Column field="document_no" header="No.Surat" :sortable="false">
            <template #body="slotProps">
                <p>{{ slotProps.data.document_no }}</p>
            </template>
        </Column>
        <Column field="perihal" header="Perihal" :sortable="false" headerStyle="min-width:18rem;">
            <template #body="slotProps">
                <p>{{ slotProps.data.perihal }}</p>
            </template>
        </Column>
        <Column field="created_at" header="Tanggal" :sortable="false" headerStyle="min-width:14rem;">
            <template #body="slotProps">
                <p>{{ setFormatDate(slotProps.data.created_at) }}</p>
            </template>
        </Column>
        <Column field="receiver" header="Tujuan" :sortable="false" headerStyle="min-width:14rem;">
            <template #body="slotProps">
                <p v-for="(rec, i) in slotProps.data.receiver" :key="i">{{ rec.user_name }}</p>
            </template>
        </Column>
        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" headerStyle="width:14%; min-width:10rem;"></Column>
        <Column field="status" header="Status" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <Badge :value="`Need Verif`" severity="warning"></Badge>
            </template>
        </Column>
        <template #footer>
            <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
        </template>
    </DataTable>
    </div>
</template>
