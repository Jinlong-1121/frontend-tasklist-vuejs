<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import PositionService from '@/service/PositionService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Position' }, { label: 'List' }]);


const Positions = ref(null);
const Rows = ref(null);

const positionDialog = ref(false);
// const deletepositionDialog = ref(false);
// const deletePositionsDialog = ref(false);
const position = ref({});
// const selectedPositions = ref(null);
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

const positionService = new PositionService();

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
    position.value = {};
    submitted.value = false;
    positionDialog.value = true;
};

const hideDialog = () => {
    positionDialog.value = false;
    submitted.value = false;
};

const editPosition = (prod) => {
    position.value = {...prod};
    selectedStatus.value = position.value.status;
    positionDialog.value = true;
};

const savePosition = () => {
    submitted.value = true;
    if (position.value.name.trim()) {
        console.log(position.value.id, typeof(position.value.id));
        if (typeof(position.value.id) === "undefined") {
            position.value.status = '1';
            saveListData(position.value)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Position Updated', life: 3000 });
        } else {
            position.value.status = selectedStatus.value.value ? selectedStatus.value.value : position.value.status;
            updateListData(position.value, position.value.id)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Position Created', life: 3000 });
        }
        positionDialog.value = false;
        position.value = {};
    }
};

// const toDetail = (id) => {
//     router.push('/position/detail/'+id);
// };

const getListData = (page) => {
    var params = {
        page: page
    }
    positionService.getList(params).then((data) => {
        Positions.value = data.rows;
        Rows.value = data.total_rows;
    });
};

const saveListData = (params) => {
    positionService.saveListData(params).then((data) => {
        console.log(data);
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'New data position saved', life: 3000 });
    });
};

const updateListData = (params, id) => {
    console.log(params, id);
    positionService.updateListData(params, id).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data position updated', life: 3000 });
    });
};

const runPosition = () => {
    positionService.runPosition().then((data) => {
        console.log(data);
        // getListData(1);
    });
};

const accessData = () => {
    var page = (first.value/10)+1;
    getListData(page)
    // console.log(row);
};



// const confirmDeletePosition = (editPosition) => {
//     position.value = editPosition;
//     deletepositionDialog.value = true;
// };

// const deletePosition = () => {
//     Positions.value = Positions.value.filter((val) => val.id !== position.value.id);
//     deletepositionDialog.value = false;
//     position.value = {};
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Position Deleted', life: 3000 });
// };

// const findIndexById = (id) => {
//     let index = -1;
//     for (let i = 0; i < Positions.value.length; i++) {
//         if (Positions.value[i].id === id) {
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
//     deletePositionsDialog.value = true;
// };
// const deleteSelectedPositions = () => {
//     Positions.value = Positions.value.filter((val) => !selectedPositions.value.includes(val));
//     deletePositionsDialog.value = false;
//     selectedPositions.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Positions Deleted', life: 3000 });
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
    { field: 'name', header: 'Position Name' },
    { field: 'alias', header: 'Description' }
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
                            <Button label="New Position" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <!-- <Button label="Run" icon="pi pi-caret-right" class="p-button-warning mr-2" @click="runPosition" /> -->
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedPositions || !selectedPositions.length" /> -->
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
                <DataTable ref="dt" :value="Positions" responsiveLayout="scroll">
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
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editPosition(slotProps.data)" />
                            <!-- <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeletePosition(slotProps.data)" /> -->
                        </template>
                    </Column>
                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
                    </template>
                </DataTable>
            </div>

            <Dialog v-model:visible="positionDialog" :style="{width: '450px'}" header="Position Position" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="position.name" required="true" autofocus :class="{'p-invalid': submitted && !position.name}" />
                    <small class="p-error" v-if="submitted && !position.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="alias">Alias</label>
                    <InputText id="alias" v-model.trim="position.alias" required="true" autofocus :class="{'p-invalid': submitted && !position.alias}" />
                    <small class="p-error" v-if="submitted && !position.alias">Alias is required.</small>
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
                    <Button label="Save" icon="pi pi-check" text @click="savePosition" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
