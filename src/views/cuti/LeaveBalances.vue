<script setup>
import { FilterMatchMode } from 'primevue/api';
import { inject, ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import AbsenService from '@/service/AbsenService';

const swal = inject('$swal')

const Izin = ref(null);
const Rows = ref(null);

const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const maxDate = ref(new Date());
const first = ref(0);
const email = ref("");
const selectedFilterStatus = ref();
const optionsFilterStatus = ref([
    { name: 'Cuti Tahunan', type: '1' },
    { name: 'Cuti Hamil dan Melahirkan', type: '2' },
    // { name: 'Cuti Tidak Berbayar - Unpaid Leave', type: '10' },
    { name: 'Cuti In Advance - Hutang Cuti Tahunan', type: '11' },
    { name: 'Replacement Day Off', type: '12' },
    { name: 'Cuti Kedaruratan - Emergency Leave', type: '13' },
    { name: 'Cuti Keguguran', type: '14' },
    { name: 'Cuti Alasan Penting - Istri Melahirkan / Keguguran', type: '16' },
    { name: 'Cuti Alasan Penting - Mengkhitankan Anak', type: '17' },
    { name: 'Cuti Alasan Penting - Baptis Anak', type: '18' },
    { name: 'Cuti Alasan Penting - Karyawan Menikah', type: '19' },
    { name: 'Cuti Alasan Penting - Menikahkan Anak', type: '20' },
    { name: 'Cuti Alasan Penting - Kedukaan (Pasangan, Orang Tua, Anak, Menantu)', type: '21' },
    { name: 'Cuti Alasan Penting - Kedukaan Satu Rumah', type: '22' },
    { name: 'Cuti Alasan Penting - Istri Melahirkan / Keguguran', type: '23' },
]);

const absenService = new AbsenService();

const loading = ref(false);
const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
}

onBeforeMount(() => {
    initFilters();
    setOptionsListUserAbsen();
    setOptionsListIzinType();
});
onMounted(() => {
    setOptionsListUserAbsen();
    setOptionsListIzinType();
    let page = (first.value / 10) + 1;
    let date = new Date();
    let currentDate = dateMonthYear(date);
    selectedFilterStatus.value = { name: 'Cuti Tahunan', type: '1' }
    filterMonth.value = date;
    getListData(page, currentDate);
});
computed(() => {
    // console.log(first);
    // checkLogin();
});
watch(() => {
    // console.log(first);
    // checkLogin();
});

const getListData = (page, date) => {
    let params = {
        page: page,
        year: date,
        type: selectedFilterStatus.value.type
    }
    absenService.getLeaveBalance(params).then((data) => {
        Izin.value = data.data.rows;
        Rows.value = data.data.total_rows;

        // console.log("statusIzin", data.data.rows)
    });
};

const accessData = () => {
    let page = (first.value / 10) + 1;
    let selectedDate = dateMonthYear(filterMonth.value);
    getListData(page, selectedDate)
};

const filterMonthEvent = () => {
    let page = (first.value / 10) + 1;
    let selectedDate = dateMonthYear(filterMonth.value);
    getListData(page, selectedDate);
};

const dateMonthYear = (dateString) => {
    let date = new Date(dateString);
    let dateFormat = date.getFullYear();
    return dateFormat;
}

const setFilterStatus = (data) => {
    selectedFilterStatus.value = data.value
    let page = (first.value / 10) + 1;
    let selectedDate = dateMonthYear(filterMonth.value);
    getListData(page, selectedDate);
}

// OPTIONS VARIABLE
const optionsListUserAbsen = ref({})
const optionsIzinType = ref({})
// END OPTIONS VARIABLE

const setOptionsListUserAbsen = () => {
    absenService.getListUserAbsen().then((data) => {
        optionsListUserAbsen.value = data.data
    });
}
const setOptionsListIzinType = () => {
    absenService.getListIzinType().then((data) => {
        optionsIzinType.value = data.data
    });
}
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const columns = computed(() => {
    if (selectedFilterStatus.value && selectedFilterStatus.value.type === '1') {
        return [
            { field: 'username', header: 'Nama Karyawan' },
            { field: 'year_trx', header: 'Tahun' },
            { field: 'leave_desc', header: 'Tipe Izin' },
            ...dataNumberCutiTahunan
        ];
    } else if (selectedFilterStatus.value && selectedFilterStatus.value.type === '12') {
        return [
            { field: 'username', header: 'Nama Karyawan' },
            { field: 'year_trx', header: 'Tahun' },
            { field: 'leave_desc', header: 'Tipe Izin' },
            ...dataNumberRDO
        ];
    } else {
        return [
            { field: 'username', header: 'Nama Karyawan' },
            { field: 'year_trx', header: 'Tahun' },
            { field: 'leave_desc', header: 'Tipe Izin' },
            ...dataNumber
        ];
    }
});

const dataNumber = [
    { field: 'additional_balance', header: 'Saldo Cuti Awal' },
    { field: 'leave_used', header: 'Cuti Terpakai' },
    { field: 'total_balance', header: 'Saldo Cuti Akhir' },
];

const dataNumberRDO = [
    { field: 'initial_balance', header: 'Sisa Saldo Periode Sebelum' },
    { field: 'additional_balance', header: 'Saldo Cuti Awal' },
    { field: 'leave_used', header: 'Cuti Terpakai' },
    { field: 'total_balance', header: 'Saldo Cuti Akhir' },
];

const dataNumberCutiTahunan = [
    { field: 'initial_balance', header: 'Saldo Cuti Awal' },
    { field: 'carry_forward', header: 'Sisa Cuti Tahun Kemarin' },
    { field: 'carry_forward_balance', header: 'Sisa Cuti Tahun Terpakai' },
    { field: 'obligatory_leave', header: 'Cuti Bersama' },
    { field: 'in_advance_leave', header: 'Hutang Cuti' },
    { field: 'leave_used', header: 'Cuti Terpakai' },
    { field: 'total_balance', header: 'Saldo Cuti Akhir' },
];
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div>
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Calendar inputId="inputMont" v-model="filterMonth" view="year" dateFormat="yy"
                                :maxDate="maxDate" @date-select="filterMonthEvent" />

                            <Dropdown inputId="class" v-model="selectedFilterStatus" :options="optionsFilterStatus"
                                @change="setFilterStatus($event)" optionLabel="name" placeholder="Select a City"
                                class="ml-2 w-full md:w-14rem" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <OverlayPanel ref="op" appendTo="body">
                            <div class="flex justify-content-center p-fluid">
                                <div v-focustrap class="cards">
                                    <div class="field">
                                        <InputText id="input" v-model="email" type="text" placeholder="Email"
                                            autofocus />
                                    </div>

                                </div>
                            </div>
                        </OverlayPanel>
                    </template>
                </Toolbar>
                <DataTable ref="dt" :value="Izin" responsiveLayout="scroll">
                    <template #empty>
                        <div class="text-center p-2">
                            <p class="text-lg font-semibold">No Data Available</p>
                        </div>
                    </template>

                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"
                        headerStyle="width:14%; min-width:15rem;"></Column>

                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData">
                        </Paginator>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
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
