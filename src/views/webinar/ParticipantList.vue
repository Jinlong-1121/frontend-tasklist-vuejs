<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import WebinarService from '@/service/WebinarService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const route = useRoute();
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Webinar' }, { label: 'Participant' }, { label: 'List' }]);


const Webinars = ref(null);
const Rows = ref(null);

const webinarDialog = ref(false);
// const deletewebinarDialog = ref(false);
// const deleteWebinarsDialog = ref(false);
const webinar = ref({});
// const selectedWebinars = ref(null);
const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const first = ref(0);
const email = ref("");
const submitted = ref(false);
// const statuses = ref([
//     { label: 'INSTOCK', value: 'instock' },
//     { label: 'LOWSTOCK', value: 'lowstock' },
//     { label: 'OUTOFSTOCK', value: 'outofstock' }
// ]);

const webinarService = new WebinarService();

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
    // console.log(first);
    // checkLogin();
});
watch(() => {
    // console.log(first);
    // checkLogin();
});

// const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };

const openNew = () => {
    webinar.value = {};
    submitted.value = false;
    webinarDialog.value = true;
};

const hideDialog = () => {
    webinarDialog.value = false;
    submitted.value = false;
};

const editWebinar = (data) => {
    webinar.value = {...data};
    webinarDialog.value = true;
};

const saveWebinar = () => {
    submitted.value = true;
    if (webinar.value.name.trim()) {
        // console.log(webinar.value.id, typeof(webinar.value.id));
        if (typeof(webinar.value.id) === "undefined") {
            webinar.value.status = '1';
            saveListData(webinar.value)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Webinar Updated', life: 3000 });
        } else {
            webinar.value.status = '1';
            updateListData(webinar.value, webinar.value.id)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Webinar Created', life: 3000 });
        }
        webinarDialog.value = false;
        webinar.value = {};
    }
};

// const toDetail = (id) => {
//     router.push('/webinar/detail/'+id);
// };

const getListData = (page) => {
    var params = {
        page: page,
        id: route.params.id,
    }
    webinarService.getListParticipant(params).then((data) => {
        Webinars.value = data.rows;
        Rows.value = data.total_rows;
    });
};

const dowloadFile = (page) => {
    var params = {
        id: route.params.id,
    }
    webinarService.downloadParticipant(params).then((data) => {
        forceFileDownload(data, `webinar-${route.params.id}.xlsx`);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data Dowloaded', life: 3000 });
    });
};

const saveListData = (params) => {
    webinarService.saveListData(params).then((data) => {
        getListData(1);
    });
};

const updateListData = (params, id) => {
    webinarService.updateListData(params, id).then((data) => {
        getListData(1);
    });
};

// const runScheduler = () => {
//     webinarService.runScheduler().then((data) => {
//         // console.log(data);
//         // getListData(1);
//     });
// };

const accessData = () => {
    var page = (first.value/10)+1;
    getListData(page)
    // // console.log(row);
};

const forceFileDownload = (response, title) => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", title);
      document.body.appendChild(link);
      link.click();
};


// const confirmDeleteWebinar = (editWebinar) => {
//     webinar.value = editWebinar;
//     deletewebinarDialog.value = true;
// };

// const deleteWebinar = () => {
//     Webinars.value = Webinars.value.filter((val) => val.id !== webinar.value.id);
//     deletewebinarDialog.value = false;
//     webinar.value = {};
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Webinar Deleted', life: 3000 });
// };

// const findIndexById = (id) => {
//     let index = -1;
//     for (let i = 0; i < Webinars.value.length; i++) {
//         if (Webinars.value[i].id === id) {
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
//     deleteWebinarsDialog.value = true;
// };
// const deleteSelectedWebinars = () => {
//     Webinars.value = Webinars.value.filter((val) => !selectedWebinars.value.includes(val));
//     deleteWebinarsDialog.value = false;
//     selectedWebinars.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Webinars Deleted', life: 3000 });
// };

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const columns = [
    // { field: 'username', header: 'Nama Karyawan' },
    // { field: 'webinar_id', header: 'Webinar ID' },
    { field: 'name', header: 'Nama' },
    { field: 'user_email', header: 'Email' },
    { field: 'phone', header: 'No HP' },
    { field: 'job_title', header: 'Pekerjaan' },
    { field: 'panelist', header: 'Panelis' },
    { field: 'internal', header: 'Internal' },
    { field: 'status', header: 'Status' },
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
                            <!-- <Button label="New Scheduler" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" /> -->
                            <!-- <Button label="Run Scheduler" icon="pi pi-plus" class="p-button-warning mr-2" @click="runScheduler" /> -->
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedWebinars || !selectedWebinars.length" /> -->
                        </div>
                    </template>

                    <template v-slot:end>
                        <Button label="Download" icon="pi pi-download" class="p-button-warning mr-2" @click="dowloadFile" />
                        <!-- <Button label="Send Email" icon="pi pi-upload" class="p-button-help" @click="toggle" />
                        <OverlayPanel ref="op" appendTo="body">
                                <div class="flex justify-content-center p-fluid">
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
                <DataTable ref="dt" :value="Webinars" responsiveLayout="scroll">
                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" headerStyle="width:14%; min-width:10rem;"></Column>
                    <Column field="duration" header="Sesi Waktu (Menit)" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Sesi Waktu (Menit)</span>
                            {{ Math.ceil(slotProps.data.duration/60) }}
                        </template>
                    </Column>
                    <!-- <Column :exportable="false" style="min-width:1rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editWebinar(slotProps.data)" />
                            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteWebinar(slotProps.data)" />
                        </template>
                    </Column> -->
                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
                    </template>
                </DataTable>
            </div>

            <Dialog v-model:visible="webinarDialog" :style="{width: '450px'}" header="Webinar Scheduler" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="webinar.name" required="true" autofocus :class="{'p-invalid': submitted && !webinar.name}" />
                    <small class="p-error" v-if="submitted && !webinar.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="cron">Cron</label>
                    <InputText id="cron" v-model.trim="webinar.cron" required="true" autofocus :class="{'p-invalid': submitted && !webinar.cron}" />
                    <small class="p-error" v-if="submitted && !webinar.cron">Cron is required.</small>
                </div>
                <div class="field">
                    <label for="exec">Exec</label>
                    <InputText id="exec" v-model.trim="webinar.exec" required="true" autofocus :class="{'p-invalid': submitted && !webinar.exec}" />
                    <small class="p-error" v-if="submitted && !webinar.exec">Exec is required.</small>
                </div>
                <div class="field">
                    <label for="method">Method</label>
                    <InputText id="method" v-model.trim="webinar.method" required="true" autofocus :class="{'p-invalid': submitted && !webinar.method}" />
                    <small class="p-error" v-if="submitted && !webinar.method">Method is required.</small>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
                    <Button label="Save" icon="pi pi-check" text @click="saveWebinar" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
