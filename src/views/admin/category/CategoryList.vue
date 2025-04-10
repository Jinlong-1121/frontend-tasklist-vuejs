<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import CategoryService from '@/service/CategoryService';
import DivisiService from '@/service/DivisiService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Category' }, { label: 'List' }]);


const dataItemUser = JSON.parse(localStorage.getItem("sipam"))

const Categories = ref(null);
const Rows = ref(null);

const categoryDialog = ref(false);
// const deletecategoryDialog = ref(false);
// const deleteCategoriesDialog = ref(false);
const category = ref({});
// const selectedCategories = ref(null);
const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const first = ref(0);
const email = ref("");
const submitted = ref(false);

const selectedDivisiFilter = ref(1);
const selectedDivisi = ref();
const divisiList = ref([]);

const typeSuratList = ref([
    { name: "External", id: '1' },
    { name: "Internal", id: '2' },
    { name: "Masuk", id: '3' }
]);

const selectedStatus = ref({});
const statuses = ref([
    { label: 'Active', value: '1' },
    { label: 'No Active', value: '0' },
    // { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const categoryService = new CategoryService();
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
    var page = (first.value / 10) + 1;
    getListData(page);
    getListDivisi();
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
    category.value = {};
    submitted.value = false;
    categoryDialog.value = true;
    // selectedDivisi.value = user.value.divisi;
};

const hideDialog = () => {
    categoryDialog.value = false;
    submitted.value = false;
};

// DIVISI
const getListDivisi = () => {
    divisiService.getListAll().then((data) => {
        // console.log(data);
        divisiList.value = data;
    });
};
const setDivisi = (event) => {
    selectedDivisi.value = event.value;
};

const editCategory = (prod) => {
    category.value = { ...prod };
    selectedStatus.value = category.value.status;
    categoryDialog.value = true;
    selectedDivisi.value = category.value.divisi;
};

const saveCategory = () => {
    submitted.value = true;
    if (category.value.name.trim()) {
        // console.log(category.value.id, typeof(category.value.id));
        if (typeof (category.value.id) === "undefined") {
            category.value.status = '1';
            category.value.divisi = parseInt(selectedDivisi.value);
            saveListData(category.value)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Category Updated', life: 3000 });
        } else {
            category.value.status = selectedStatus.value.value ? selectedStatus.value.value : category.value.status;
            category.value.divisi = parseInt(selectedDivisi.value);
            updateListData(category.value, category.value.id)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Category Created', life: 3000 });
        }
        categoryDialog.value = false;
        category.value = {};
    }
};

// const toDetail = (id) => {
//     router.push('/category/detail/'+id);
// };

const getListData = (page) => {
    var params = {
        page: page,
        divisi: selectedDivisiFilter.value !== undefined ? selectedDivisiFilter.value : ''
    }
    categoryService.getList(params).then((data) => {
        Categories.value = data.rows;
        Rows.value = data.total_rows;
    });
};

const saveListData = (params) => {
    categoryService.saveListData(params).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'New data category saved', life: 3000 });
    });
};

const updateListData = (params, id) => {
    categoryService.updateListData(params, id).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data category updated', life: 3000 });
    });
};

const runCategory = () => {
    categoryService.runCategory().then((data) => {
        // getListData(1);
    });
};

const accessData = () => {
    var page = (first.value / 10) + 1;
    getListData(page)
    // // console.log(row);
};

const setDivisiFilter = (data) => {
    var page = 1;
    getListData(page)
}

// const confirmDeleteCategory = (editCategory) => {
//     category.value = editCategory;
//     deletecategoryDialog.value = true;
// };

// const deleteCategory = () => {
//     Categories.value = Categories.value.filter((val) => val.id !== category.value.id);
//     deletecategoryDialog.value = false;
//     category.value = {};
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 3000 });
// };

// const findIndexById = (id) => {
//     let index = -1;
//     for (let i = 0; i < Categories.value.length; i++) {
//         if (Categories.value[i].id === id) {
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
    var page = (first.value / 10) + 1;
    getListData(page);
};

// const dateMonthYear = (dateString) => {
//     var date = new Date(dateString);
//     var dateFormat = date.getFullYear() + "-" +(String((date.getMonth()+1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1));
//     return dateFormat;
// }

// const confirmDeleteSelected = () => {
//     deleteCategoriesDialog.value = true;
// };
// const deleteSelectedCategories = () => {
//     Categories.value = Categories.value.filter((val) => !selectedCategories.value.includes(val));
//     deleteCategoriesDialog.value = false;
//     selectedCategories.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Categories Deleted', life: 3000 });
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
const getTypeColor = (typeSurat) => {
    switch (typeSurat) {
        case '1':
            return 'info';

        case '2':
            return 'primary';

        case '3':
            return 'danger';

        default:
            return null;
    }
};
const getTypeLabel = (typeSurat) => {
    switch (typeSurat) {
        case '1':
            return 'External';

        case '2':
            return 'Internal';

        case '3':
            return 'Masuk';

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
    { field: 'name', header: 'Category' },
    { field: 'alias', header: 'Alias' },
    // { field: 'type_surat', header: 'Type' },
    { field: 'description', header: 'Description' }
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
                            <Button label="New Category" icon="pi pi-plus" class="p-button-success mr-2"
                                @click="openNew" />
                            <!-- <Button label="Run" icon="pi pi-caret-right" class="p-button-warning mr-2" @click="runCategory" /> -->
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedCategories || !selectedCategories.length" /> -->
                            <Dropdown inputId="class" v-model="selectedDivisiFilter" :options="divisiList"
                                @change="setDivisiFilter($event)" optionLabel="name" optionValue="id"
                                placeholder="Filter Divisi" />
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
                <DataTable ref="dt" :value="Categories" responsiveLayout="scroll">
                    <template #empty>
                        <div class="text-center p-2">
                            <p class="text-lg font-semibold">No Data Available</p>
                        </div>
                    </template>
                    <Column header="Action" :exportable="false" headerStyle="width:3%;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                                @click="editCategory(slotProps.data)" />
                            <!-- <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteCategory(slotProps.data)" /> -->
                        </template>
                    </Column>
                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"
                        headerStyle="width:20%; min-width:10rem;"></Column>
                    <Column field="type_surat" header="Type" :sortable="false"
                        headerStyle="width:10%; min-width:10rem;">
                        <template #body="slotProps">
                            <Tag :value="getTypeLabel(slotProps.data.type_surat)"
                                :severity="getTypeColor(slotProps.data.type_surat)" />
                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <!-- <span class="p-column-title">Status</span>
                            <span :class="'item-badge status-' + (slotProps.data.status==='1' ? 'active' : 'deactive')">{{ (slotProps.data.status==='1' ? 'Active' : 'Stop') }}</span> -->
                            <Tag :value="slotProps.data.status === '1' ? 'Active' : 'No Active'"
                                :severity="getStatusLabel(slotProps.data.status)" />
                        </template>
                    </Column>
                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData">
                        </Paginator>
                    </template>
                </DataTable>
            </div>

            <Dialog v-model:visible="categoryDialog" :style="{ width: '450px' }" header="Category Category" :modal="true"
                class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="category.name" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !category.name }" />
                    <small class="p-error" v-if="submitted && !category.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="alias">Alias</label>
                    <InputText id="alias" v-model.trim="category.alias" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !category.alias }" />
                    <small class="p-error" v-if="submitted && !category.alias">Alias is required.</small>
                </div>
                <div class="field">
                    <label for="type_surat">Type Surat</label>
                    <Dropdown inputId="class" v-model.trim="category.type_surat" :options="typeSuratList"
                        optionLabel="name" optionValue="id" placeholder="Type Surat" />
                    <!-- <InputText id="type_surat" v-model.trim="category.type_surat" required="true" autofocus /> -->
                </div>
                <div class="field">
                    <label for="divisi">Divisi</label>
                    <Dropdown inputId="class" v-model="selectedDivisi" :options="divisiList" @change="setDivisi($event)"
                        optionLabel="name" optionValue="id" placeholder="Select a Divisi" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !selectedDivisi }" />
                    <small class="p-error" v-if="submitted && !selectedDivisi">Divisi is required.</small>
                </div>
                <div class="field">
                    <label for="description">Description</label>
                    <InputText id="description" v-model.trim="category.description" required="true" autofocus />
                </div>

                <div class="field">
                    <label for="status" class="mb-3">Status</label>
                    <Dropdown id="status" v-model="selectedStatus" :options="statuses" optionLabel="label"
                        placeholder="Select a Status">
                        <template #value="slotProps">
                            <div v-if="slotProps.value && slotProps.value.value">
                                <Tag :value="slotProps.value.label" :severity="getStatusLabel(slotProps.value.value)" />
                            </div>
                            <div v-else-if="slotProps.value && !slotProps.value.value">
                                <Tag :value="slotProps.value === '1' ? 'Active' : 'No Active'"
                                    :severity="getStatusLabel(slotProps.value)" />
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                    </Dropdown>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                    <Button label="Save" icon="pi pi-check" text @click="saveCategory" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
