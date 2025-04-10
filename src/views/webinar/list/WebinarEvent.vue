<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import WebinarService from '@/service/WebinarService';
import { useToast } from 'primevue/usetoast';
import Editor from "@/components/editor";

const editor = Editor;
// import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()

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

const saveWebinarEvent = () => {
    submitted.value = true;
    // if (webinar.value.webinar_id.trim()) {
    //     // console.log(webinar.value.id, typeof(webinar.value.id));
    //     if (typeof(webinar.value.id) === "undefined") {
    //         webinar.value.webinar_id = webinar.value.webinar_id.replaceAll(/\s/g,'')
    //         webinar.value.tanggal = dateDayMonthYear(webinar.value.tanggal)
    //         saveListData(webinar.value)
    //         toast.add({ severity: 'success', summary: 'Successful', detail: 'New Data Webinar Saved', life: 3000 });
    //     } else {
    //         // webinar.value.status = '1';
    //         updateListData(webinar.value, webinar.value.id)
    //         toast.add({ severity: 'success', summary: 'Successful', detail: 'Webinar Updated', life: 3000 });
    //     }
    //     webinarDialog.value = false;
    //     webinar.value = {};
    // }
};

const dateDayMonthYear = (dateString) => {
    var date = new Date(dateString);
    // var dateFormat = date.getFullYear() + "-" +((date.getMonth()+1).toString().length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1)) + "-" + date.getDate();
    var dateFormat = date.getFullYear() + "-" +((date.getMonth()+1).toString().length != 2 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth()+1).toString()) + "-" +(date.getDate().toString().length != 2 ? "0" + date.getDate().toString() : date.getDate().toString());
    return dateFormat;
}

const getListData = (page) => {
    var params = {
        page: page
    }
    webinarService.getList(params).then((data) => {
        Webinars.value = data.rows;
        Rows.value = data.total_rows;
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

const runScheduler = () => {
    webinarService.runScheduler().then((data) => {
        // console.log(data);
    });
};

const accessData = () => {
    var page = (first.value/10)+1;
    getListData(page)
};

const filterMonthEvent = () => {
    var page = (first.value/10)+1;
    getListData(page);
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const onSelectFile = (event) => {
    let reader = new FileReader()
    reader.onload = (e) => {
        webinar.value.file = e.target.result
    }
    reader.readAsDataURL(event.files[0])
}

const columns = [
    // { field: 'eventmeetid', header: 'Meet ID' },
    // { field: 'eventtitle', header: 'Title' },
    { field: 'tanggal', header: 'Tanggal' },
];
</script>

<template>
    <Toast />
    <Toolbar class="my-4 py-1">
        <template v-slot:start>
            <div class="my-2">
                <!-- <span class="p-float-label"> -->
                    <!-- <Calendar inputId="inputMont" v-model="filterMonth" view="month" dateFormat="MM yy" @date-select="filterMonthEvent"/> -->
                    <!-- <label for="inputMont">Pilih Bulan</label> -->
                <!-- </span> -->
                <Button label="New Event Webinar" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                <!-- <Button label="Run Scheduler" icon="pi pi-plus" class="p-button-warning mr-2" @click="runScheduler" /> -->
                <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedWebinars || !selectedWebinars.length" /> -->
            </div>
        </template>
    </Toolbar>
    <DataTable ref="dt" :value="Webinars" responsiveLayout="scroll">
        <Column field="webinar_no" header="Webinar ID" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
                <!-- <router-link :to="{ name: 'participant-list', params: { id: slotProps.data.id }}">{{ slotProps.data.webinar_no }}</router-link> -->
                <p>{{ slotProps.data.webinar_no }}</p>
            </template>
        </Column>
        <Column field="topic" header="Title" headerStyle="width:50%; min-width:10rem;">
            <template #body="slotProps">
                <!-- <router-link :to="{ name: 'participant-list', params: { id: slotProps.data.id }}">{{ slotProps.data.webinar_no }}</router-link> -->
                <p>{{ slotProps.data.topic }}</p>
            </template>
        </Column>
        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" headerStyle="width:28%; min-width:10rem;"></Column>
        <Column :exportable="false" style="min-width:1rem">
            <template #body="slotProps">
                <!-- <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editWebinar(slotProps.data)" /> -->
                <!-- <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteWebinar(slotProps.data)" /> -->
            </template>
        </Column>
        <template #footer>
            <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
        </template>
    </DataTable>

    <Dialog v-model:visible="webinarDialog" :style="{width: '450px'}" header="Webinar Scheduler" :modal="true" class="p-fluid">
        <div class="field">
            <label for="tanggal">Tanggal</label>
            <Calendar id="tanggal" v-model.trim="webinar.tanggal" required="true" autofocus :class="{'p-invalid': submitted && !webinar.tanggal}" />
            <!-- <InputText id="tanggal" v-model.trim="webinar.tanggal" required="true" autofocus :class="{'p-invalid': submitted && !webinar.tanggal}" /> -->
            <small class="p-error" v-if="submitted && !webinar.tanggal">Tanggal is required.</small>
        </div>
        <div class="field">
            <label for="webinar_id">Webinar ID</label>
            <InputText id="webinar_id" v-model.trim="webinar.webinar_id" required="true" autofocus :class="{'p-invalid': submitted && !webinar.webinar_id}" />
            <small class="p-error" v-if="submitted && !webinar.webinar_id">Webinar ID is required.</small>
        </div>
        <div class="field">
            <label for="title">Title</label>
            <InputText id="title" v-model.trim="webinar.title" required="true" autofocus :class="{'p-invalid': submitted && !webinar.title}" />
            <small class="p-error" v-if="submitted && !webinar.title">Title is required.</small>
        </div>
        <div class="field">
            <label for="description">Description</label>
            <ckeditor :editor="editor" v-model="webinar.description"></ckeditor>
            <small class="p-error" v-if="submitted && !webinar.description">Description is required.</small>
        </div>
        <div class="grid">
            <div class="field col">
                <label for="file">Upload File</label>
                <FileUpload mode="basic" @select="onSelectFile" customUpload accept="image/*" :maxFileSize="1000000000" />
                <small class="p-error" v-if="submitted && !webinar.file">Pemateri is required.</small>
            </div>
            <div class="field col text-right">
                <label for="class">Status Publish</label>
                <div class="switch-publishEvent">
                  <InputSwitch v-model="webinar.status" falseValue="0" trueValue="1"/>
                </div>
            </div>
        </div>
        <div class="field" v-if="webinar.file">
            <label for="file">Preview</label>
            <div>
                <Image :src="webinar.file" alt="Image" width="250" preview />
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
            <Button label="Save" icon="pi pi-check" text @click="saveWebinarEvent" />
        </template>
    </Dialog>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
