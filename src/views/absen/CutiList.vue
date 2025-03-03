<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import AbsenService from '@/service/AbsenService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Cuti' }, { label: 'List' }]);


const Absens = ref(null);
// const Rows = ref(null);

// const AbsenDialog = ref(false);
// const deleteAbsenDialog = ref(false);
// const deleteAbsensDialog = ref(false);
// const Absen = ref({});
// const selectedAbsens = ref(null);
const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const first = ref(0)
const email = ref("")
// const submitted = ref(false);
// const statuses = ref([
//     { label: 'INSTOCK', value: 'instock' },
//     { label: 'LOWSTOCK', value: 'lowstock' },
//     { label: 'OUTOFSTOCK', value: 'outofstock' }
// ]);

const absenService = new AbsenService();

const loading = ref(false);
const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
}

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    // var page = (first.value/10)+1;
    var date = new Date();
    var currentDate = dateMonthYear(date);
    filterMonth.value = date;
    getListData(currentDate);

    // var params = {
    //     page: 1,
    //     year: "2023-01"
    // }
    // absenService.getList(params).then((data) => {
    //     Absens.value = data.rows;
    //     Rows.value = data.total_rows;
    // });
});
computed(() => {
    console.log(first);
    // checkLogin();
});
watch(() => {
    console.log(first);
    // checkLogin();
});

const getListData = (date) => {
    var params = {
        month: date
    }
    absenService.getListCuti(params).then((data) => {
        Absens.value = data.data;
        console.log(Absens.value);
    });
};

const sendEmail = () => {
    var params = {
        month: dateMonthYear(filterMonth.value),
        email: email.value
    }
    loading.value = true;
    // setTimeout(() => {
    //     loading.value = false;
    //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Absen Deleted', life: 3000 });
    // }, 2000);
    // console.log(params);
    absenService.sendEmailCuti(params).then((data) => {
        // Absens.value = data.data;
        if (!data.error) {
            loading.value = false;
            toast.add({ severity: 'success', summary: 'Successful', detail: data.data, life: 3000 });
        } else {
            loading.value = false;
            toast.add({ severity: 'danger', summary: 'Error', detail: 'Gagal kirim', life: 3000 });
        }
        console.log(data);
    });
};

const accessData = () => {
    // var page = (first.value/10)+1;
    var selectedDate = dateMonthYear(filterMonth.value);
    getListData(selectedDate)
    // console.log(row);
};

const filterMonthEvent = () => {
    // var page = (first.value/10)+1;
    var selectedDate = dateMonthYear(filterMonth.value);
    getListData(selectedDate);
    // console.log(dateMonthYear(filterMonth.value));
};

const dateMonthYear = (dateString) => {
    var date = new Date(dateString);
    var dateFormat = date.getFullYear() + "-" +(String((date.getMonth()+1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1));
    return dateFormat;
}

// const confirmDeleteSelected = () => {
//     deleteAbsensDialog.value = true;
// };
// const deleteSelectedAbsens = () => {
//     Absens.value = Absens.value.filter((val) => !selectedAbsens.value.includes(val));
//     deleteAbsensDialog.value = false;
//     selectedAbsens.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Absens Deleted', life: 3000 });
// };

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const columns = [
    { field: 'username', header: 'Nama Karyawan' },
    { field: 'tanggal', header: 'Tanggal' },
    { field: 'jumlah_ambil_cuti', header: 'Jumlah Ambil Cuti' },
    { field: 'jumlah_potong_cuti', header: 'Jumlah Potong Cuti' },
    { field: 'sisa_cuti_lalu', header: 'Sisa Cuti Tahun Lalu' },
    { field: 'sisa_cuti_berjalan', header: 'Sisa Cuti Tahun Berjalan' },
    { field: 'sisa_cuti', header: 'Sisa Cuti' },
];
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <!-- <div class="card card-w-title">
                <h5>Surat</h5>
                <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
            </div> -->
            <div class="card card-w-title">
                <!-- <div class="mb-4">
                    <h5>Surat</h5>
                    <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
                </div> -->
                <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <!-- <span class="p-float-label"> -->
                                <Calendar inputId="inputMont" v-model="filterMonth" view="month" dateFormat="MM yy" @date-select="filterMonthEvent"/>
                                <!-- <label for="inputMont">Pilih Bulan</label> -->
                            <!-- </span> -->
                            <!-- <Button label="Filter" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" /> -->
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedAbsens || !selectedAbsens.length" /> -->
                        </div>
                    </template>

                    <template v-slot:end>
                        <!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" /> -->
                        <Button label="Send Email" icon="pi pi-upload" class="p-button-help" @click="toggle" />
                        <OverlayPanel ref="op" appendTo="body">
                            <!-- <template> -->
                                <div class="flex justify-content-center p-fluid">
                                    <div v-focustrap class="cards">
                                        <!-- <div class="field">
                                            <label><b>Tambah Tujuan Baru</b></label>
                                        </div> -->
                                        <div class="field">
                                            <InputText id="input" v-model="email" type="text" placeholder="Email" autofocus />
                                        </div>
                                        <Button type="submit" label="Send" class="mt-2" :loading="loading" @click="sendEmail"/>
                                    </div>
                                </div>
                            <!-- </template> -->
                        </OverlayPanel>
                    </template>
                </Toolbar>
                <DataTable ref="dt" :value="Absens" responsiveLayout="scroll">
                    <!-- <Column field="username" header="Nama Karyawan" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <router-link :to="{ name: 'absen-detail', params: { id: slotProps.data.pin }}">{{ slotProps.data.username }}</router-link>
                        </template>
                    </Column> -->
                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" headerStyle="width:14%; min-width:10rem;"></Column>
                    <!-- <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
                    </template> -->
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
