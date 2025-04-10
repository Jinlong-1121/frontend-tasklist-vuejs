<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import UserService from '@/service/UserService';
import DivisiService from '@/service/DivisiService';
import PositionService from '@/service/PositionService';
import SuratService from '@/service/SuratService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Signer' }, { label: 'List' }]);


const UsersSignerExternal = ref(null);
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

const userSignerExternal = ref({});


// DECLARE SERVICE
const userService = new UserService();
const divisiService = new DivisiService();
const positionService = new PositionService();
const suratService = new SuratService();

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
    user.value = {};
    submitted.value = false;
    userDialog.value = true;
    selectedDivisi.value = null;
    selectedPosition.value = null;
    edited.value = false;

    userSignerExternal.value = {};
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
    userSignerExternal.value.created_by = JSON.parse(localStorage.getItem("sipam")).target
    // console.log(userSignerExternal.value, "VALUE");
    submitted.value = true;
    // if (userSignerExternal.value.name.trim()) {
    //     // // console.log(user.value.id, typeof(user.value.id));
    //     // if (typeof(user.value.id) === "undefined") {
            saveListData(userSignerExternal.value)
    //         // toast.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
    //     // }
    //     // userDialog.value = false;
    //     // user.value = {};
    // }
};

// const toDetail = (id) => {
//     router.push('/user/detail/'+id);
// };


// CRUD User
const getListData = (page) => {
    var params = {
        page: page
    }
    userService.getSignerExternal(params).then((data) => {
        UsersSignerExternal.value = data.rows;
        Rows.value = data.total_rows;
    });
};

const saveListData = (params) => {
    userService.addSignerExternal(params).then((data) => {
        var page = (first.value/10)+1;
        userDialog.value = false;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'New data user saved', life: 3000 });
        getListData(page);
    });
};

const resendSignerExternal = (data) => {
    // console.log(data, "DATANYA");
    delete data.created_at
    delete data.divisi_alias
    delete data.due_date
    delete data.id
    delete data.join_date
    delete data.position
    delete data.status
    delete data.updated_at
    data.created_by = 1
    userService.addSignerExternal(data).then((data) => {
        var page = (first.value/10)+1;
        userDialog.value = false;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'New data user saved', life: 3000 });
        getListData(page);
    });
}

const updateListData = (params, id) => {
    // console.log(params, id);
    userService.updateListData(params, id).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data user updated', life: 3000 });
    });
};

const runUser = () => {
    userService.runUser().then((data) => {
        // console.log(data);
        // getListData(1);
    });
};

const accessData = () => {
    var page = (first.value/10)+1;
    getListData(page)
    // // console.log(row);
};

const filterMonthEvent = () => {
    var page = (first.value/10)+1;
    getListData(page);
};

const getStatusLabel = (status) => {
    switch (status) {
        case '0':
            return 'warning';

        case '1':
            return 'success';

        case '2':
            return 'info';

        case '3':
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

// FORMAT DATE
const setFormatDateOnly = (dateData) => {
    let date = new Date(dateData);
    let tahun = date.getFullYear();
    let bulan = date.getMonth();
    let tanggal = date.getDate();
    switch(bulan) {
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
// END FORMAT DATE

const columns = [
    // { field: 'username', header: 'Nama Karyawan' },
    { field: 'user_name', header: 'Name' },
    { field: 'email', header: 'Email' },
    // { field: 'start_date', header: 'Start Date' },
    // { field: 'end_date', header: 'End Date' },
    // { field: 'status', header: 'Status' }
];
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card card-w-title">
                <h3>Signer External</h3>

                <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <!-- <span class="p-float-label"> -->
                                <!-- <Calendar inputId="inputMont" v-model="filterMonth" view="month" dateFormat="MM yy" @date-select="filterMonthEvent"/> -->
                                <!-- <label for="inputMont">Pilih Bulan</label> -->
                            <!-- </span> -->
                            <Button label="New Signer" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" /> -->
                        </div>
                    </template>
                </Toolbar>
                <DataTable ref="dt" :value="UsersSignerExternal" responsiveLayout="scroll">
                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" headerStyle="width:20%; min-width:10rem;"></Column>
                    <Column field="join_date" header="Start Date" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <p>{{ setFormatDateOnly(slotProps.data.join_date) }}</p>
                        </template>
                    </Column>
                    <Column field="due_date" header="End Date" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <p>{{ setFormatDateOnly(slotProps.data.due_date) }}</p>
                        </template>
                    </Column>
                    <Column field="status" header="Status" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status==='0' ? 'Pending' : slotProps.data.status==='1' ? 'Active' : slotProps.data.status==='2' ? 'Non Active' : 'Failed'" :severity="getStatusLabel(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column header="Aksi" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-eye" outlined rounded class="mr-2" @click="resendSignerExternal(slotProps.data)" v-if="slotProps.data.status === '3'" />
                        </template>
                    </Column>
                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
                    </template>
                </DataTable>
            </div>

            <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="User Signer External" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="userSignerExternal.name" required="true" autofocus :class="{'p-invalid': submitted && !userSignerExternal.name}" />
                    <small class="p-error" v-if="submitted && !userSignerExternal.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <InputText id="email" v-model.trim="userSignerExternal.email" required="true" autofocus :class="{'p-invalid': submitted && !userSignerExternal.email}" />
                    <small class="p-error" v-if="submitted && !userSignerExternal.email">Email is required.</small>
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
