<script setup>
import { FilterMatchMode } from 'primevue/api';
import { inject, ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import AbsenService from '@/service/AbsenService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const swal = inject('$swal')

const toast = useToast();

const Izin = ref(null);
const Rows = ref(null);

const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const first = ref(0)

// POPUP IZIN FORM
const izinDialog = ref(false);
const dataIzin = ref({});
const submitted = ref(false);

const maxDate = ref(new Date());

const absenService = new AbsenService();

const minDate = ref(new Date());

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
        month: date,
    }
    absenService.getLeaveAdjustmentDetailCount(params).then((data) => {
        if (data) {
            Izin.value = data.rows;
            Rows.value = data.total_rows;
        }
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
    let dateFormat = date.getFullYear() + "-" + (String((date.getMonth() + 1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
    return dateFormat;
}

// OPTIONS VARIABLE
const optionsListUserAbsen = ref({})
const selectedListUserAbsen = ref()
const optionsIzinType = ref({})
const selectedIzinType = ref()
// END OPTIONS VARIABLE

const setOptionsListUserAbsen = () => {
    absenService.getListUserAbsen().then((data) => {
        optionsListUserAbsen.value = data.data
    });
}

const setOptionsListIzinType = () => {
    absenService.getListDefaultBalanceType().then((data) => {
        optionsIzinType.value = data.data
        // console.log("data.data", data.data)
    });
}

const openNewIzin = () => {
    dataIzin.value = {};
    submitted.value = false;
    izinDialog.value = true;
    selectedListUserAbsen.value = null;
    selectedIzinType.value = null;
    // edited.value = false;
};

const hideIzinDialog = () => {
    izinDialog.value = false;
    submitted.value = false;
};
const handleSubmitIzin = () => {
    submitted.value = true;
    const username = JSON.parse(localStorage.getItem("sipam")).user_name;

    if (
        selectedListUserAbsen.value !== null &&
        selectedIzinType.value !== null &&
        dataIzin.value.effective_date !== undefined &&
        dataIzin.value.keterangan !== undefined &&
        dataIzin.value.qty !== undefined
    ) {
        dataIzin.value.created_by = username
        dataIzin.value.effective_date = formatDate(dataIzin.value.effective_date);

        // if (selectedIzinType.value.multi === 0) {
        //     dataIzin.value.qty = parseInt(selectedIzinType.value.default_qty, 10);
        // } else if (selectedIzinType.value.multi === 1) {
        //     // Ensure effective_date is an array of valid Date objects or ISO strings
        //     let dateArray = dataIzin.value.effective_date.map(date => new Date(date));

        //     // Count the number of selected dates
        //     dataIzin.value.qty = dateArray.length;

        //     // Extract the earliest date from the selected dates
        //     let earliestDate = new Date(Math.min(...dateArray.map(date => date.getTime())));

        //     // Format the earliest date
        //     let formattedDate = formatDate(earliestDate);

        //     // Set the earliest date to dataIzin.effective_date
        //     dataIzin.value.effective_date = formattedDate;

        // }

        // // console.log(" dataIzin.value",  dataIzin.value)

        saveListDataIzin(dataIzin.value);
        izinDialog.value = false;
        dataIzin.value = {};
    }
};

const saveListDataIzin = (params) => {
    absenService.sendLeaveAdjustmentHR(params).then((data) => {
        toast.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        let page = (first.value / 10) + 1;
        let effective_date = new Date();
        let currentDate = dateMonthYear(effective_date);
        filterMonth.value = effective_date;
        getListData(page, currentDate);
    });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const setIzinType = (data) => {
    dataIzin.value.type = data.value.type
}

const setUserAbsenPin = (data) => {
    dataIzin.value.pin = data.value.pin
}

const formatDate = (date) => {
    // Ensure the date is a valid Date object
    let d = new Date(date);
    if (isNaN(d.getTime())) {
        return "";
    }

    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear();

    return `${year}-${month}-${day}`;
};


const setFormatDate = (data) => {
    let date = data ? new Date(data) : new Date();
    let tahun = date.getFullYear();
    let bulan = date.getMonth();
    let tanggal = date.getDate();

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
    let tampilTanggal = tanggal + " " + bulan + " " + tahun;

    return tampilTanggal;
}

const columns = [
    { field: 'username', header: 'Nama Karyawan' },
    { field: 'leave_desc', header: 'Tipe Cuti' },
    { field: 'qty', header: 'Jumlah Hari' },
    { field: 'keterangan', header: 'Keterangan' },

];
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Calendar inputId="inputMont" v-model="filterMonth" view="month" dateFormat="MM yy"
                                @date-select="filterMonthEvent" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Add Cuti" icon="pi pi-plus" class="p-button-help" @click="openNewIzin" />
                    </template>
                </Toolbar>
                <DataTable ref="dt" :value="Izin" responsiveLayout="scroll">
                    <template #empty>
                        <div class="text-center p-2">
                            <p class="text-lg font-semibold">No Data Available</p>
                        </div>
                    </template>

                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"
                        headerStyle="width:14%; min-width:10rem;"></Column>

                    <Column field="effective_date" header="Tanggal Efektif" :sortable="false"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <p>{{ setFormatDate(slotProps.data.effective_date) }}</p>
                        </template>
                    </Column>

                    <Column field="effective_date" header="Tanggal Cetak" :sortable="false"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <p>{{ setFormatDate(slotProps.data.created_at) }}</p>
                        </template>
                    </Column>

                    <!-- <Column  field="action" header="Action" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" class="p-button-danger" outlined rounded @click="handleApprovedIzin(slotProps.data)" />
                        </template>
                    </Column> -->

                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData">
                        </Paginator>
                    </template>
                </DataTable>
            </div>

            <!-- POPUP ADD IZIN -->
            <Dialog v-model:visible="izinDialog" :closable="false" :style="{ width: '450px' }" header="Add Cuti"
                :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <Dropdown inputId="class" v-model="selectedListUserAbsen" @change="setUserAbsenPin($event)"
                        :options="optionsListUserAbsen" optionLabel="user_name" placeholder="Select User"
                        class="w-full" />
                    <small class="p-error" v-if="submitted && !dataIzin.pin">User is required.</small>
                </div>
                <div class="field">
                    <label for="type_izin">Jenis Cuti</label>
                    <Dropdown inputId="class" v-model="selectedIzinType" @change="setIzinType($event)"
                        :options="optionsIzinType" optionLabel="type_cuti" placeholder="Select Cuti" class="w-full" />
                    <small class="p-error" v-if="submitted && !dataIzin.type">Cuti is required.</small>
                </div>

                <div class="field">
                    <label for="tanggal">Tanggal Efektif</label>
                    <Calendar id="tanggal" v-model.trim="dataIzin.effective_date" />
                    <small class="p-error" v-if="submitted && !dataIzin.effective_date">Date is required.</small>
                </div>

                <!-- <div v-if="selectedIzinType && selectedIzinType.multi === 0" class="field">
                    <div class="field">
                        <label for="tanggal">Mulai Tanggal</label>
                        <Calendar id="tanggal" v-model.trim="dataIzin.effective_date" />
                        <small class="p-error" v-if="submitted && !dataIzin.effective_date">Date is required.</small>
                    </div>
                </div>
                <div v-if="selectedIzinType && selectedIzinType.multi === 1" class="field">
                    <div class="field">
                        <label for="tanggal">Tanggal</label>
                        <Calendar selectionMode="multiple" :minDate="minDate" id="tanggal"
                            v-model.trim="dataIzin.effective_date" />
                        <small class="p-error" v-if="submitted && !dataIzin.effective_date">Date is required.</small>
                    </div>
                </div> -->


                <div class="field">
                    <label for="qty">Jumlah Hari</label>
                    <InputNumber inputId="withoutgrouping" id="qty" v-model.trim="dataIzin.qty" />
                    <small class="p-error" v-if="submitted && !dataIzin.qty">Qty is required.</small>
                </div>
                <div class="field">
                    <label for="keterangan">Keterangan</label>
                    <Textarea v-model.trim="dataIzin.keterangan" rows="5" cols="30" />
                    <small class="p-error" v-if="submitted && !dataIzin.keterangan">Keterangan is required.</small>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="hideIzinDialog" />
                    <Button label="Save" icon="pi pi-check" text @click="handleSubmitIzin" />
                </template>
            </Dialog>
            <!-- END POPUP ADD IZIN -->
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