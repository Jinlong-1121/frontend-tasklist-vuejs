<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import DivisiService from '@/service/DivisiService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Divisi' }, { label: 'List' }]);


const Divisis = ref(null);
const Rows = ref(null);

const divisiDialog = ref(false);
// const deletedivisiDialog = ref(false);
// const deleteDivisisDialog = ref(false);
const divisi = ref({});
// const selectedDivisis = ref(null);
const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const first = ref(0);
const email = ref("");
const submitted = ref(false);

const selectedStatus = ref({});
const statuses = ref([
    { label: 'Active', value: '1' },
    { label: 'No Active', value: '0' },
    // { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const divisiService = new DivisiService();

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
    divisi.value = {};
    submitted.value = false;
    divisiDialog.value = true;
};

const hideDialog = () => {
    divisiDialog.value = false;
    submitted.value = false;
};

const editDivisi = (prod) => {
    divisi.value = {...prod};
    selectedStatus.value = divisi.value.status;
    divisiDialog.value = true;
};

const saveDivisi = () => {
    submitted.value = true;
    if (divisi.value.name.trim()) {
        console.log(divisi.value.id, typeof(divisi.value.id));
        if (typeof(divisi.value.id) === "undefined") {
            divisi.value.status = '1';
            saveListData(divisi.value)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Divisi Updated', life: 3000 });
        } else {
            divisi.value.status = selectedStatus.value.value ? selectedStatus.value.value : divisi.value.status;
            updateListData(divisi.value, divisi.value.id)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Divisi Created', life: 3000 });
        }
        divisiDialog.value = false;
        divisi.value = {};
    }
};

// const toDetail = (id) => {
//     router.push('/divisi/detail/'+id);
// };

const getListData = (page) => {
    var params = {
        page: page
    }
    divisiService.getList(params).then((data) => {
        Divisis.value = data.rows;
        Rows.value = data.total_rows;
    });
};

const saveListData = (params) => {
    divisiService.saveListData(params).then((data) => {
        console.log(data);
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'New data divisi saved', life: 3000 });
    });
};

const updateListData = (params, id) => {
    console.log(params, id);
    divisiService.updateListData(params, id).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data divisi updated', life: 3000 });
    });
};

const runDivisi = () => {
    divisiService.runDivisi().then((data) => {
        console.log(data);
        // getListData(1);
    });
};

const accessData = () => {
    var page = (first.value/10)+1;
    getListData(page)
    // console.log(row);
};



// const confirmDeleteDivisi = (editDivisi) => {
//     divisi.value = editDivisi;
//     deletedivisiDialog.value = true;
// };

// const deleteDivisi = () => {
//     Divisis.value = Divisis.value.filter((val) => val.id !== divisi.value.id);
//     deletedivisiDialog.value = false;
//     divisi.value = {};
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Divisi Deleted', life: 3000 });
// };

// const findIndexById = (id) => {
//     let index = -1;
//     for (let i = 0; i < Divisis.value.length; i++) {
//         if (Divisis.value[i].id === id) {
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
//     deleteDivisisDialog.value = true;
// };
// const deleteSelectedDivisis = () => {
//     Divisis.value = Divisis.value.filter((val) => !selectedDivisis.value.includes(val));
//     deleteDivisisDialog.value = false;
//     selectedDivisis.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Divisis Deleted', life: 3000 });
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
    { field: 'name', header: 'Divisi Name' },
    { field: 'alias', header: 'Alias' }
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
                            <Button label="New Divisi" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <!-- <Button label="Run" icon="pi pi-caret-right" class="p-button-warning mr-2" @click="runDivisi" /> -->
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedDivisis || !selectedDivisis.length" /> -->
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
                <DataTable ref="dt" :value="Divisis" responsiveLayout="scroll">
                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" headerStyle="width:20%; min-width:10rem;"></Column>
                    <Column field="status" header="Status" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <!-- <span class="p-column-title">Status</span>
                            <span :class="'item-badge status-' + (slotProps.data.status==='1' ? 'active' : 'deactive')">{{ (slotProps.data.status==='1' ? 'Active' : 'Stop') }}</span> -->
                            <Tag :value="slotProps.data.status==='1' ? 'Active' : 'No Active'" :severity="getStatusLabel(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column :exportable="false" style="min-width:10rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editDivisi(slotProps.data)" />
                            <!-- <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteDivisi(slotProps.data)" /> -->
                        </template>
                    </Column>
                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
                    </template>
                </DataTable>
            </div>

            <Dialog v-model:visible="divisiDialog" :style="{width: '450px'}" header="Divisi Divisi" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="divisi.name" required="true" autofocus :class="{'p-invalid': submitted && !divisi.name}" />
                    <small class="p-error" v-if="submitted && !divisi.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="alias">Alias</label>
                    <InputText id="alias" v-model.trim="divisi.alias" required="true" autofocus :class="{'p-invalid': submitted && !divisi.alias}" />
                    <small class="p-error" v-if="submitted && !divisi.alias">Alias is required.</small>
                </div>

                <div class="field">
                    <label for="status" class="mb-3">Status</label>
                    <Dropdown id="status" v-model="selectedStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
                        <template #value="slotProps">
                            <div v-if="slotProps.value && slotProps.value.value">
                                <Tag :value="slotProps.value.label" :severity="getStatusLabel(slotProps.value.value)" />
                            </div>
                            <div v-else-if="slotProps.value && !slotProps.value.value">
                                <Tag :value="slotProps.value==='1' ? 'Active' : 'No Active'" :severity="getStatusLabel(slotProps.value)" />
                            </div>
                            <span v-else>
                                {{slotProps.placeholder}}
                            </span>
                        </template>
                    </Dropdown>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
                    <Button label="Save" icon="pi pi-check" text @click="saveDivisi" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
