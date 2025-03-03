<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import SchedulerService from '@/service/SchedulerService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Job' }, { label: 'List' }]);


const Jobs = ref(null);
const Rows = ref(null);

const jobDialog = ref(false);
// const deletejobDialog = ref(false);
// const deleteJobsDialog = ref(false);
const job = ref({});
// const selectedJobs = ref(null);
const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const first = ref(0);
const email = ref("");
const submitted = ref(false);

const selectedStatus = ref({});
const statuses = ref([
    { label: 'Running', value: '1' },
    { label: 'Stop', value: '0' },
    // { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const jobService = new SchedulerService();

const loading = ref(false);
const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
}

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    var page = (first.value/10)+1;
    getListData(page);
});
computed(() => {
    console.log(first);
    // checkLogin();
});
watch(() => {
    console.log(first);
    // checkLogin();
});

// const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };

const openNew = () => {
    job.value = {};
    submitted.value = false;
    jobDialog.value = true;
};

const hideDialog = () => {
    jobDialog.value = false;
    submitted.value = false;
};

const editJob = (prod) => {
    job.value = {...prod};
    selectedStatus.value = job.value.status;
    jobDialog.value = true;
};

const saveJob = () => {
    submitted.value = true;
    if (job.value.name.trim()) {
        console.log(job.value.id, typeof(job.value.id));
        if (typeof(job.value.id) === "undefined") {
            job.value.status = '1';
            saveListData(job.value)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Job Updated', life: 3000 });
        } else {
            job.value.status = selectedStatus.value.value ? selectedStatus.value.value : job.value.status;
            updateListData(job.value, job.value.id)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Job Created', life: 3000 });
        }
        jobDialog.value = false;
        job.value = {};
    }
};

// const toDetail = (id) => {
//     router.push('/job/detail/'+id);
// };

const getListData = (page) => {
    var params = {
        page: page
    }
    jobService.getList(params).then((data) => {
        Jobs.value = data.rows;
        Rows.value = data.total_rows;
    });
};

const saveListData = (params) => {
    jobService.saveListData(params).then((data) => {
        console.log(data);
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'New data scheduler saved', life: 3000 });
    });
};

const updateListData = (params, id) => {
    console.log(params, id);
    jobService.updateListData(params, id).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data scheduler updated', life: 3000 });
    });
};

const runScheduler = () => {
    jobService.runScheduler().then((data) => {
        console.log(data);
        // getListData(1);
    });
};

const accessData = () => {
    var page = (first.value/10)+1;
    getListData(page)
    // console.log(row);
};



// const confirmDeleteJob = (editJob) => {
//     job.value = editJob;
//     deletejobDialog.value = true;
// };

// const deleteJob = () => {
//     Jobs.value = Jobs.value.filter((val) => val.id !== job.value.id);
//     deletejobDialog.value = false;
//     job.value = {};
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Job Deleted', life: 3000 });
// };

// const findIndexById = (id) => {
//     let index = -1;
//     for (let i = 0; i < Jobs.value.length; i++) {
//         if (Jobs.value[i].id === id) {
//             index = i;
//             break;
//         }
//     }
//     return index;
// };

// const createId = () => {
//     let id = '';
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (let i = 0; i < 5; i++) {
//         id += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return id;
// };

// const exportCSV = () => {
//     dt.value.exportCSV();
// };

const filterMonthEvent = () => {
    var page = (first.value/10)+1;
    getListData(page);
};

// const dateMonthYear = (dateString) => {
//     var date = new Date(dateString);
//     var dateFormat = date.getFullYear() + "-" +(String((date.getMonth()+1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1));
//     return dateFormat;
// }

// const confirmDeleteSelected = () => {
//     deleteJobsDialog.value = true;
// };
// const deleteSelectedJobs = () => {
//     Jobs.value = Jobs.value.filter((val) => !selectedJobs.value.includes(val));
//     deleteJobsDialog.value = false;
//     selectedJobs.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Jobs Deleted', life: 3000 });
// };
const getStatusLabel = (status) => {
    switch (status) {
        case '1':
            return 'success';

        case '2':
            return 'warning';

        case '0':
            return 'danger';

        default:
            return null;
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const columns = [
    // { field: 'username', header: 'Nama Karyawan' },
    { field: 'name', header: 'Job Name' },
    { field: 'cron', header: 'Cron' },
    { field: 'exec', header: 'Execution URL' },
    { field: 'method', header: 'Method' },
];
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card card-w-title">
                <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <!-- <span class="p-float-label"> -->
                                <!-- <Calendar inputId="inputMont" v-model="filterMonth" view="month" dateFormat="MM yy" @date-select="filterMonthEvent"/> -->
                                <!-- <label for="inputMont">Pilih Bulan</label> -->
                            <!-- </span> -->
                            <Button label="New Scheduler" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Run" icon="pi pi-caret-right" class="p-button-warning mr-2" @click="runScheduler" />
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedJobs || !selectedJobs.length" /> -->
                        </div>
                    </template>

                    <template v-slot:end>
                        <!-- <Button label="Send Email" icon="pi pi-upload" class="p-button-help" @click="toggle" />
                        <OverlayPanel ref="op" appendTo="body">
                                <div class="flex justify-valuecontent-center p-fluid">
                                    <div v-focustrap class="cards">
                                        <div class="field">
                                            <InputText id="input" v-model="email" type="text" placeholder="Email" autofocus />
                                        </div>
                                        <Button type="submit" label="Send" class="mt-2" :loading="loading" @click="sendEmail"/>
                                    </div>
                                </div>
                        </OverlayPanel> -->
                    </template>
                </Toolbar>
                <DataTable ref="dt" :value="Jobs" responsiveLayout="scroll">
                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" headerStyle="width:20%; min-width:10rem;"></Column>
                    <Column field="status" header="Status" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <!-- <span class="p-column-title">Status</span>
                            <span :class="'item-badge status-' + (slotProps.data.status==='1' ? 'active' : 'deactive')">{{ (slotProps.data.status==='1' ? 'Running' : 'Stop') }}</span> -->
                            <Tag :value="slotProps.data.status==='1' ? 'Running' : 'Stop'" :severity="getStatusLabel(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column :exportable="false" style="min-width:10rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editJob(slotProps.data)" />
                            <!-- <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteJob(slotProps.data)" /> -->
                        </template>
                    </Column>
                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
                    </template>
                </DataTable>
            </div>

            <Dialog v-model:visible="jobDialog" :style="{width: '450px'}" header="Job Scheduler" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="job.name" required="true" autofocus :class="{'p-invalid': submitted && !job.name}" />
                    <small class="p-error" v-if="submitted && !job.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="cron">Cron</label>
                    <InputText id="cron" v-model.trim="job.cron" required="true" autofocus :class="{'p-invalid': submitted && !job.cron}" />
                    <small class="p-error" v-if="submitted && !job.cron">Cron is required.</small>
                </div>
                <div class="field">
                    <label for="exec">Exec</label>
                    <InputText id="exec" v-model.trim="job.exec" required="true" autofocus :class="{'p-invalid': submitted && !job.exec}" />
                    <small class="p-error" v-if="submitted && !job.exec">Exec is required.</small>
                </div>
                <div class="field">
                    <label for="method">Method</label>
                    <InputText id="method" v-model.trim="job.method" required="true" autofocus :class="{'p-invalid': submitted && !job.method}" />
                    <small class="p-error" v-if="submitted && !job.method">Method is required.</small>
                </div>

                <div class="field">
                    <label for="status" class="mb-3">Status</label>
                    <Dropdown id="status" v-model="selectedStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
                        <template #value="slotProps">
                            <div v-if="slotProps.value && slotProps.value.value">
                                <Tag :value="slotProps.value.label" :severity="getStatusLabel(slotProps.value.value)" />
                            </div>
                            <div v-else-if="slotProps.value && !slotProps.value.value">
                                <Tag :value="slotProps.value==='1' ? 'Running' : 'Stop'" :severity="getStatusLabel(slotProps.value)" />
                            </div>
                            <span v-else>
                                {{slotProps.placeholder}}
                            </span>
                        </template>
                    </Dropdown>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
                    <Button label="Save" icon="pi pi-check" text @click="saveJob" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
