<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import PrivilegeService from '@/service/PrivilegeService';
import DivisiService from '@/service/DivisiService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Privilege' }, { label: 'List' }]);


const Privileges = ref(null);
const Divisies = ref([]);
const Rows = ref(null);

const privilegeDialog = ref(false);
// const deleteprivilegeDialog = ref(false);
// const deletePrivilegesDialog = ref(false);
const privilege = ref({});
// const selectedPrivileges = ref(null);
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

const privilegeService = new PrivilegeService();
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
    getListDataDivisi();
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
    privilege.value = {};
    submitted.value = false;
    privilegeDialog.value = true;
};

const hideDialog = () => {
    privilegeDialog.value = false;
    submitted.value = false;
};

const editPrivilege = (prod) => {
    privilege.value = {...prod};
    selectedStatus.value = privilege.value.status;
    privilegeDialog.value = true;
};

const savePrivilege = () => {
    submitted.value = true;
    if (privilege.value.name.trim()) {
        // console.log(privilege.value.id, typeof(privilege.value.id));
        if (typeof(privilege.value.id) === "undefined") {
            privilege.value.status = '1';
            saveListData(privilege.value)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Privilege Updated', life: 3000 });
        } else {
            privilege.value.status = selectedStatus.value.value ? selectedStatus.value.value : privilege.value.status;
            updateListData(privilege.value, privilege.value.id)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'Privilege Created', life: 3000 });
        }
        privilegeDialog.value = false;
        privilege.value = {};
    }
};

// const toDetail = (id) => {
//     router.push('/privilege/detail/'+id);
// };

const getListData = (page) => {
    var params = {
        page: page,
        divisi: selectedDivisi.value
    }
    privilegeService.getList(params).then((data) => {
        Privileges.value = data.rows;
        Rows.value = data.total_rows;
    });
};

const getListDataDivisi = () => {
    divisiService.getListAll().then((data) => {
        Divisies.value = data;
    });
};

const saveListData = (params) => {
    privilegeService.saveListData(params).then((data) => {
        // console.log(data);
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'New data privilege saved', life: 3000 });
    });
};

const updateListData = (params, id) => {
    // console.log(params, id);
    privilegeService.updateListData(params, id).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data privilege updated', life: 3000 });
    });
};

const runPrivilege = () => {
    privilegeService.runPrivilege().then((data) => {
        // console.log(data);
        // getListData(1);
    });
};

const accessData = () => {
    var page = (first.value/10)+1;
    getListData(page)
    // // console.log(row);
};



// const confirmDeletePrivilege = (editPrivilege) => {
//     privilege.value = editPrivilege;
//     deleteprivilegeDialog.value = true;
// };

// const deletePrivilege = () => {
//     Privileges.value = Privileges.value.filter((val) => val.id !== privilege.value.id);
//     deleteprivilegeDialog.value = false;
//     privilege.value = {};
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Privilege Deleted', life: 3000 });
// };

// const findIndexById = (id) => {
//     let index = -1;
//     for (let i = 0; i < Privileges.value.length; i++) {
//         if (Privileges.value[i].id === id) {
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

// const filterMonthEvent = () => {
//     var page = (first.value/10)+1;
//     getListData(page);
// };

// const dateMonthYear = (dateString) => {
//     var date = new Date(dateString);
//     var dateFormat = date.getFullYear() + "-" +(String((date.getMonth()+1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1));
//     return dateFormat;
// }

// const confirmDeleteSelected = () => {
//     deletePrivilegesDialog.value = true;
// };
// const deleteSelectedPrivileges = () => {
//     Privileges.value = Privileges.value.filter((val) => !selectedPrivileges.value.includes(val));
//     deletePrivilegesDialog.value = false;
//     selectedPrivileges.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Privileges Deleted', life: 3000 });
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

const getStatusText = (status) => {
    switch (status) {
        case '1':
            return 'Yes';

        case '0':
            return 'No';

        default:
            return 'No';
    }
};

// const getStatusSwitch = (status) => {
//     switch (status) {
//         case '1':
//             return true;

//         case '0':
//             return false;

//         default:
//             return false;
//     }
// };

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const columns = [
    // { field: 'username', header: 'Nama Karyawan' },
    { field: 'menu_name', header: 'Menu' },
    { field: 'access', header: 'Access' },
    { field: 'create', header: 'Create' },
    { field: 'edit', header: 'Edit' },
    { field: 'delete', header: 'Delete' },
    { field: 'download', header: 'Download' },
    { field: 'print', header: 'Print' }
];
const selectedDivisi = ref(1);
const selectDivisi = () => {
    // console.log(selectedDivisi.value);
    var page = (first.value/10)+1;
    getListData(page);
}
const editingRows = ref([]);
const onRowEditSave = (event) => {
    let { newData, index } = event;

    Privileges.value[index] = newData;
    // console.log(newData.divisi_id);
    const sendData = {
        menu_id: newData.menu_id,
        divisi: selectedDivisi.value,
        access: newData.access,
        create: newData.create,
        edit: newData.edit,
        delete: newData.delete,
        download: newData.download,
        print: newData.print
    }
    saveListData(sendData);
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card card-w-title">
                <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />
                <Toast />
                <div class="grid">
                    <div class="col-2">
                            <Listbox v-model="selectedDivisi" :options="Divisies" filter optionLabel="name" optionValue="id" class="w-full md:w-14rem" @change="selectDivisi"/>
                    </div>
                    <div class="col-10">
                        <DataTable ref="dt" v-model:editingRows="editingRows" :value="Privileges" editMode="row" dataKey="menu_id" @row-edit-save="onRowEditSave" responsiveLayout="scroll">
                            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" headerStyle="width:20%; min-width:10rem;">
                                <template #body="{ data, field }">
                                    <template v-if="field !== 'menu_name'">
                                        <Tag :value="getStatusText(data[field])" :severity="getStatusLabel(data[field])" />
                                    </template>
                                    <template v-else>
                                        {{ data[field] }}
                                    </template>
                                </template>
                                <template #editor="{ data, field }">
                                    <template v-if="field !== 'menu_name'">
                                        <InputSwitch v-model=data[field] trueValue="1" falseValue="0"/>
                                    </template>
                                    <template v-else>
                                        {{ data[field] }}
                                    </template>
                                </template>
                            </Column>
                            <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
                            <!-- <Column field="status" header="Status" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.status==='1' ? 'Active' : 'No Active'" :severity="getStatusLabel(slotProps.data.status)" />
                                </template>
                            </Column> -->
                            <!-- <Column :exportable="false" style="min-width:10rem">
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editPrivilege(slotProps.data)" />
                                </template>
                            </Column> -->
                            <template #footer>
                                <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
                            </template>
                        </DataTable>
                    </div>
                </div>
            </div>

            <Dialog v-model:visible="privilegeDialog" :style="{width: '450px'}" header="Privilege Privilege" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="privilege.name" required="true" autofocus :class="{'p-invalid': submitted && !privilege.name}" />
                    <small class="p-error" v-if="submitted && !privilege.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="alias">Name</label>
                    <InputText id="alias" v-model.trim="privilege.alias" required="true" autofocus :class="{'p-invalid': submitted && !privilege.alias}" />
                    <small class="p-error" v-if="submitted && !privilege.alias">Name is required.</small>
                </div>
                <div class="field">
                    <label for="icon">Icon</label>
                    <InputText id="icon" v-model.trim="privilege.icon" required="true" autofocus />
                </div>
                <div class="field">
                    <label for="url">URL</label>
                    <InputText id="url" v-model.trim="privilege.url" required="true" autofocus />
                </div>
                <div class="field">
                    <label for="parent">Parent</label>
                    <InputText id="parent" v-model.trim="privilege.parent" required="true" autofocus />
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
                    <Button label="Save" icon="pi pi-check" text @click="savePrivilege" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
