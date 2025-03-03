<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import UserService from '@/service/UserService';
import DivisiService from '@/service/DivisiService';
import PositionService from '@/service/PositionService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'User' }, { label: 'List' }]);


const Users = ref(null);
const Rows = ref(null);

const userDialog = ref(false);
// const deleteuserDialog = ref(false);
// const deleteUsersDialog = ref(false);
const user = ref({});
// const selectedUsers = ref(null);
const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const first = ref(0);
const email = ref("");
const submitted = ref(false);
const edited = ref(false);

const selectedDivisi = ref();
const divisiList = ref([]);

const selectedPosition = ref();
const positionList = ref([]);

const selectedStatus = ref({});
const statuses = ref([
    { label: 'Active', value: '1' },
    { label: 'No Active', value: '0' },
    // { label: 'OUTOFSTOCK', value: 'outofstock' }
]);


// DECLARE SERVICE
const userService = new UserService();
const divisiService = new DivisiService();
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
    getListDivisi();
    getListPosition();
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
    user.value = {};
    submitted.value = false;
    userDialog.value = true;
    selectedDivisi.value = null;
    selectedPosition.value = null;
    edited.value = false;
};

const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};

const editUser = (prod) => {
    user.value = {...prod};
    selectedStatus.value = user.value.status;
    selectedDivisi.value = user.value.divisi;
    selectedPosition.value = user.value.position;
    userDialog.value = true;
    edited.value = true;
};

const saveUser = () => {
    submitted.value = true;
    if (user.value.name.trim()) {
        console.log(user.value.id, typeof(user.value.id));
        if (typeof(user.value.id) === "undefined") {
            user.value.status = '1';
            user.value.divisi = parseInt(selectedDivisi.value);
            user.value.position = parseInt(selectedPosition.value);
            saveListData(user.value)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        } else {
            user.value.status = selectedStatus.value.value ? selectedStatus.value.value : user.value.status;
            // user.value.divisi = parseInt(user.value.divisi);
            user.value.divisi = parseInt(selectedDivisi.value);
            user.value.position = parseInt(selectedPosition.value);
            updateListData(user.value, user.value.id)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
        }
        userDialog.value = false;
        user.value = {};
    }
};

// const toDetail = (id) => {
//     router.push('/user/detail/'+id);
// };

// DIVISI
const getListDivisi = () => {
    divisiService.getListAll().then((data) => {
        console.log(data);
        divisiList.value = data;
    });
};
const setDivisi = (event) => {
    console.log(event);
    selectedDivisi.value = event.value;
};


// POSITION
const getListPosition = () => {
    positionService.getListAll().then((data) => {
        positionList.value = data;
    });
};
const setPostion = (event) => {
    selectedPosition.value = event.value;
};


// CRUD User
const getListData = (page) => {
    var params = {
        page: page
    }
    userService.getList(params).then((data) => {
        Users.value = data.rows;
        Rows.value = data.total_rows;
    });
};

const saveListData = (params) => {
    userService.saveListData(params).then((data) => {
        console.log(data);
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'New data user saved', life: 3000 });
    });
};

const updateListData = (params, id) => {
    console.log(params, id);
    userService.updateListData(params, id).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data user updated', life: 3000 });
    });
};

const runUser = () => {
    userService.runUser().then((data) => {
        console.log(data);
        // getListData(1);
    });
};

const accessData = () => {
    var page = (first.value/10)+1;
    getListData(page)
    // console.log(row);
};



// const confirmDeleteUser = (editUser) => {
//     user.value = editUser;
//     deleteuserDialog.value = true;
// };

// const deleteUser = () => {
//     Users.value = Users.value.filter((val) => val.id !== user.value.id);
//     deleteuserDialog.value = false;
//     user.value = {};
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
// };

// const findIndexById = (id) => {
//     let index = -1;
//     for (let i = 0; i < Users.value.length; i++) {
//         if (Users.value[i].id === id) {
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
//     deleteUsersDialog.value = true;
// };
// const deleteSelectedUsers = () => {
//     Users.value = Users.value.filter((val) => !selectedUsers.value.includes(val));
//     deleteUsersDialog.value = false;
//     selectedUsers.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
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
    { field: 'name', header: 'User Name' },
    { field: 'email', header: 'Email' },
    { field: 'position_name', header: 'Position' }
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
                            <Button label="New User" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" /> -->
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
                <DataTable ref="dt" :value="Users" responsiveLayout="scroll">
                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" headerStyle="width:20%; min-width:10rem;"></Column>
                    <Column field="status" header="Status" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <!-- <span class="p-column-title">Status</span>
                            <span :class="'item-badge status-' + (slotProps.data.status==='1' ? 'active' : 'deactive')">{{ (slotProps.data.status==='1' ? 'Active' : 'No Active') }}</span> -->
                            <Tag :value="slotProps.data.status==='1' ? 'Active' : 'No Active'" :severity="getStatusLabel(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column :exportable="false" style="min-width:10rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data)" />
                            <!-- <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUser(slotProps.data)" /> -->
                        </template>
                    </Column>
                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
                    </template>
                </DataTable>
            </div>

            <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="User User" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="user.name" required="true" autofocus :class="{'p-invalid': submitted && !user.name}" />
                    <small class="p-error" v-if="submitted && !user.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <InputText id="email" v-model.trim="user.email" required="true" autofocus :class="{'p-invalid': submitted && !user.email}" />
                    <small class="p-error" v-if="submitted && !user.email">Email is required.</small>
                </div>
                <div class="field">
                    <label for="divisi">Divisi</label>
                    <Dropdown
                        inputId="class"
                        v-model="selectedDivisi"
                        :options="divisiList"
                        @change="setDivisi($event)"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select a Divisi"
                        required="true" autofocus :class="{'p-invalid': submitted && !user.divisi}"
                    />
                    <small class="p-error" v-if="submitted && !user.divisi">Divisi is required.</small>
                </div>
                <div class="field">
                    <label for="position">Position</label>
                    <Dropdown
                        inputId="class"
                        v-model="selectedPosition"
                        :options="positionList"
                        @change="setPostion($event)"
                        optionLabel="alias"
                        optionValue="id"
                        placeholder="Select a Position"
                        required="true" autofocus :class="{'p-invalid': submitted && !user.position}"
                    />
                    <small class="p-error" v-if="submitted && !user.position">Divisi is required.</small>
                </div>
                <div class="field" v-if="!edited">
                    <label for="password">Password</label>
                    <Password id="password" v-model.trim="user.password" type="text" required="true" toggleMask autofocus :class="{'p-invalid': submitted && !user.password}" promptLabel="Input a password" weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Complex password" />
                    <small class="p-error" v-if="submitted && !user.password">Password is required.</small>
                </div>
                <div class="field" v-if="edited">
                    <label for="password">Password</label>
                    <Password id="password" v-model.trim="user.password" type="text" required="true" toggleMask autofocus promptLabel="Input a password" weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Complex password" />
                </div>

                <div class="field flex flex-column">
                    <label for="email">Signer</label>
                    <InputSwitch v-model="user.signer" trueValue="1" falseValue="0" />
                </div>
                <div class="field flex flex-column">
                    <label for="email">Verificator</label>
                    <InputSwitch v-model="user.verificator" trueValue="1" falseValue="0" />
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
                    <Button label="Save" icon="pi pi-check" text @click="saveUser" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';

::v-deep(.p-icon) {
    right: 14 !important;
}
</style>
