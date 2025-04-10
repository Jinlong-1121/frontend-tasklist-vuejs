<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import MenuService from '@/service/MenuService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Menu' }, { label: 'List' }]);


const Menus = ref(null);
const Rows = ref(null);

const menuDialog = ref(false);
// const deletemenuDialog = ref(false);
// const deleteMenusDialog = ref(false);
const menu = ref({});
// const selectedMenus = ref(null);
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

const menuService = new MenuService();

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
    menu.value = {};
    submitted.value = false;
    menuDialog.value = true;
};

const hideDialog = () => {
    menuDialog.value = false;
    submitted.value = false;
};

const editMenu = (prod) => {
    menu.value = {...prod};
    selectedStatus.value = menu.value.status;
    menuDialog.value = true;
};

const saveMenu = () => {
    submitted.value = true;
    if (menu.value.name.trim()) {
        // console.log(menu.value.id, typeof(menu.value.id));
        if (typeof(menu.value.id) === "undefined") {
            menu.value.status = '1';
            menu.value.parent = parseInt(menu.value.parent);
            saveListData(menu.value)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Menu Updated', life: 3000 });
        } else {
            menu.value.status = selectedStatus.value.value ? selectedStatus.value.value : menu.value.status;
            menu.value.parent = parseInt(menu.value.parent);
            updateListData(menu.value, menu.value.id)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Menu Created', life: 3000 });
        }
        menuDialog.value = false;
        menu.value = {};
    }
};

// const toDetail = (id) => {
//     router.push('/menu/detail/'+id);
// };

const getListData = (page) => {
    var params = {
        page: page
    }
    menuService.getList(params).then((data) => {
        Menus.value = data.rows;
        Rows.value = data.total_rows;
    });
};

const saveListData = (params) => {
    menuService.saveListData(params).then((data) => {
        // console.log(data);
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'New data menu saved', life: 3000 });
    });
};

const updateListData = (params, id) => {
    // console.log(params, id);
    menuService.updateListData(params, id).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data menu updated', life: 3000 });
    });
};

const runMenu = () => {
    menuService.runMenu().then((data) => {
        // console.log(data);
        // getListData(1);
    });
};

const accessData = () => {
    var page = (first.value/10)+1;
    getListData(page)
    // // console.log(row);
};



// const confirmDeleteMenu = (editMenu) => {
//     menu.value = editMenu;
//     deletemenuDialog.value = true;
// };

// const deleteMenu = () => {
//     Menus.value = Menus.value.filter((val) => val.id !== menu.value.id);
//     deletemenuDialog.value = false;
//     menu.value = {};
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Menu Deleted', life: 3000 });
// };

// const findIndexById = (id) => {
//     let index = -1;
//     for (let i = 0; i < Menus.value.length; i++) {
//         if (Menus.value[i].id === id) {
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
//     deleteMenusDialog.value = true;
// };
// const deleteSelectedMenus = () => {
//     Menus.value = Menus.value.filter((val) => !selectedMenus.value.includes(val));
//     deleteMenusDialog.value = false;
//     selectedMenus.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Menus Deleted', life: 3000 });
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
    { field: 'name', header: 'Menu' },
    { field: 'alias', header: 'Alias' },
    { field: 'icon', header: 'Icon' },
    { field: 'url', header: 'Url' },
    { field: 'parent', header: 'Parent' }
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
                            <Button label="New Menu" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <!-- <Button label="Run" icon="pi pi-caret-right" class="p-button-warning mr-2" @click="runMenu" /> -->
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedMenus || !selectedMenus.length" /> -->
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
                <DataTable ref="dt" :value="Menus" responsiveLayout="scroll">
                    <template #empty>
                        <div class="text-center p-2">
                            <p class="text-lg font-semibold">No Data Available</p>
                        </div>
                    </template>
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
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editMenu(slotProps.data)" />
                            <!-- <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteMenu(slotProps.data)" /> -->
                        </template>
                    </Column>
                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
                    </template>
                </DataTable>
            </div>

            <Dialog v-model:visible="menuDialog" :style="{width: '450px'}" header="Menu Menu" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="menu.name" required="true" autofocus :class="{'p-invalid': submitted && !menu.name}" />
                    <small class="p-error" v-if="submitted && !menu.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="alias">Alias</label>
                    <InputText id="alias" v-model.trim="menu.alias" required="true" autofocus :class="{'p-invalid': submitted && !menu.alias}" />
                    <small class="p-error" v-if="submitted && !menu.alias">Alias is required.</small>
                </div>
                <div class="field">
                    <label for="icon">Icon</label>
                    <InputText id="icon" v-model.trim="menu.icon" required="true" autofocus />
                </div>
                <div class="field">
                    <label for="url">URL</label>
                    <InputText id="url" v-model.trim="menu.url" required="true" autofocus />
                </div>
                <div class="field">
                    <label for="parent">Parent</label>
                    <InputText id="parent" v-model="menu.parent" required="true" autofocus />
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
                    <Button label="Save" icon="pi pi-check" text @click="saveMenu" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
