<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch, inject } from 'vue';
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

const photo = ref(null);

const signaturePad = ref(null); // Signature pad instance reference

const selectedStatusKaryawan = ref(null);
const StatusKaryawanList = ref([
    { label: 'Karyawan Tetap Dengan Probation 3 Bulan', id: '1' },
    { label: 'Karyawan Tetap', id: '2' },
    { label: 'Kontrak', id: '3' }
]);

const swal = inject('$swal')

const selectedPosition = ref();
const positionList = ref([]);

const selectedGender= ref(null);
const StatusGenderList = ref([
    { label: 'Laki - Laki', id: '1' },
    { label: 'Perempuan', id: '2' },
]);

const selectedStatus = ref({});
const statuses = ref([
    { label: 'Active', value: '1' },
    { label: 'No Active', value: '0' },
    // { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

const showSignatureDialog = ref(false);
const signature = ref({});
const submittedSignature = ref(false);

// DECLARE SERVICE
const userService = new UserService();
const divisiService = new DivisiService();
const positionService = new PositionService();

const loading = ref(false);

const base64 = ref(null);

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
    getListPosition();
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

const convertToBase64 = async (event) => {
    const file = event.files[0];
    if (!file || !file.type.startsWith('image/')) {
        alert('File harus berupa gambar!');
        return;
    }
    // Konversi file ke base64
    const resizedBase64 = await resizeImage(file, 113, 170); // Lebar 113, tinggi proporsional
    photo.value = { base64: resizedBase64 }; // Perbaikan: simpan langsung
};

const openNew = () => {
    user.value = {};
    submitted.value = false;
    userDialog.value = true;
    selectedStatus.value = null;
    selectedStatusKaryawan.value = null;
    selectedGender.value = null;
    selectedDivisi.value = null;
    selectedPosition.value = null;
    photo.value = null;
    edited.value = false;
};

const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};

const editUser = (prod) => {
    user.value = { ...prod };
    selectedStatus.value = user.value.status;
    selectedStatusKaryawan.value = user.value.status_karyawan;
    selectedGender.value = user.value.gender;
    selectedDivisi.value = user.value.divisi;
    selectedPosition.value = user.value.position;
    photo.value = user.value.photo;
    userDialog.value = true;
    edited.value = true;
};



const saveUser = () => {
    submitted.value = true;
    if (user.value.name.trim()) {
        // Pastikan tanggal dalam format lokal "YYYY-MM-DD"
        if (user.value.dob instanceof Date) {
            const localDate = new Date(user.value.dob.getTime() - user.value.dob.getTimezoneOffset() * 60000);
            user.value.dob = localDate.toISOString().split("T")[0];
        }

        if (user.value.start_date instanceof Date) {
            const localDate = new Date(user.value.start_date.getTime() - user.value.start_date.getTimezoneOffset() * 60000);
            user.value.start_date = localDate.toISOString().split("T")[0];
        }

        if (user.value.end_date instanceof Date) {
            const localDate = new Date(user.value.end_date.getTime() - user.value.end_date.getTimezoneOffset() * 60000);
            user.value.end_date = localDate.toISOString().split("T")[0];
        }

        if (typeof (user.value.id) === "undefined") {

            user.value.status = '1';
            user.value.status_karyawan = selectedStatusKaryawan.value ? selectedStatusKaryawan.value.id : user.value.status_karyawan;
            user.value.gender = selectedGender.value ? selectedGender.value.id : user.value.gender;
            user.value.divisi = parseInt(selectedDivisi.value);
            user.value.position = parseInt(selectedPosition.value);
            user.value.photo = photo.value ? photo.value.base64 : user.value.photo;
            saveListData(user.value)
            // toast.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
        } else {

            user.value.status = selectedStatus.value.value ? selectedStatus.value.value : user.value.status;
            user.value.status_karyawan = selectedStatusKaryawan.value ? selectedStatusKaryawan.value.id : user.value.status_karyawan;
            user.value.gender = selectedGender.value ? selectedGender.value.id : user.value.gender;
            // user.value.divisi = parseInt(user.value.divisi);
            user.value.divisi = parseInt(selectedDivisi.value);
            user.value.position = parseInt(selectedPosition.value);
            user.value.photo = photo.value ? photo.value.base64 : user.value.photo;
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
        divisiList.value = data;
    });
};
const setDivisi = (event) => {
    selectedDivisi.value = event.value;
};

const runStatus = () => {

    userService.runStatus().then((data) => {
        toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Sukses Update Status User Vida', life: 3000 });
        setTimeout(() => {
            router.push('/');
            // Pengalihan ke halaman admin pengguna ('/admin/user') setelah 2900 ms
            setTimeout(() => {
                router.push('/admin/user');
            }, 2900);
        }, 100);
        // getListData(1);
    });
}

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
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'New data user saved', life: 3000 });
    });
};

const updateListData = (params, id) => {
    userService.updateListData(params, id).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data user updated', life: 3000 });
    });
};

const updateListPinAccess = (id) => {
    userService.updateListPinAccess(id).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data pin access surat updated', life: 3000 });
    });
};

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Copied to clipboard', life: 3000 });
        }).catch(err => {
            console.error('Failed to copy: ', err);
            toast.add({ severity: 'error', summary: 'Failed', detail: 'Failed to copy to clipboard', life: 3000 });
        });
    } else {
        // Fallback for browsers that do not support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Copied to clipboard', life: 3000 });
    }
}

const runUser = () => {
    userService.runUser().then((data) => {
        // getListData(1);
    });
};

const accessData = () => {
    var page = (first.value / 10) + 1;
    getListData(page)
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
    var page = (first.value / 10) + 1;
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
    // { field: 'number_officer', header: 'NIP' },
    { field: 'name', header: 'User Name' },
    { field: 'email', header: 'Email' },
    { field: 'phone', header: 'Phone' },
    { field: 'position_name', header: 'Position' }
];


const dataProsesVida = async (dataProses) => {
    userService.postProsesViva(dataProses).then((data) => {
        toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Sukses User Vida', life: 3000 });
        setTimeout(() => {
            router.push('/');
            // Pengalihan ke halaman admin pengguna ('/admin/user') setelah 2900 ms
            setTimeout(() => {
                router.push('/admin/user');
            }, 2900);
        }, 100);
        // getListData(1);
    });

};


watch(() => user.value.status_karyawan, (newStatus) => {
    if (newStatus === '1') {
        // Add 3 months to join_date if it's not empty
        updateEndDateBasedOnJoinDate();
    } else if (newStatus === '2') {
        // Set end_date to 9999-12-31
        if (openNew) {
            user.value.end_date = '9999-12-31';
        } else {
            
        }
    } else if (newStatus === '3') {
        // Clear end_date to allow manual input
        // user.value.end_date = '';
    }
});

// Watch for join_date change when the status is '1'
watch(() => user.value.join_date, (newJoinDate) => {
    if (selectedStatusKaryawan.value === '1' && newJoinDate) {
        // Update end_date when join_date changes
        updateEndDateBasedOnJoinDate();
    }
});

// Function to update end_date by adding 3 months to join_date
const updateEndDateBasedOnJoinDate = () => {
    if (user.value.join_date) {
        const joinDate = new Date(user.value.join_date);
        const probationEndDate = new Date(joinDate.setMonth(joinDate.getMonth() + 3));
        user.value.end_date = probationEndDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
    }
};

// Sign
const openSignature = (prod) => {
    signature.value = { ...prod };
    console.log("signature", signature)
    submittedSignature.value = false;
    showSignatureDialog.value = true;
};

const closeSignatureDialog = () => {
    showSignatureDialog.value = false;
};

const handleFileUpload = async (event) => {
    const file = event.files[0]; // Mendapatkan file dari FileUpload

    if (!file || !file.type.startsWith('image/')) {
        alert('File harus berupa gambar!');
        return;
    }

    // Konversi file ke base64 dan ubah ukuran
    const resizedBase64 = await resizeImage(file, 158, 87);
    signature.value = { ...signature.value, base64: resizedBase64 };
    console.log('Base64 resized:', resizedBase64);
};

const resizeImage = (file, width, height) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Buat canvas untuk mengubah ukuran gambar
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Konversi canvas ke base64
                resolve(canvas.toDataURL(file.type));
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const confirmSign = async () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    // Periksa apakah tanda tangan sudah diunggah
    if (!signature.value || !signature.value.base64) {
        showSignatureDialog.value = false; // Tutup dialog tanda tangan
        await swalWithBootstrapButtons.fire({
            title: 'Error',
            text: "Harap unggah tanda tangan terlebih dahulu.",
            icon: 'warning',
            confirmButtonText: 'Ok',
            buttonsStyling: true
        });
        return; // Hentikan eksekusi jika belum ada tanda tangan
    }

    // Tutup dialog sebelum SweetAlert muncul
    showSignatureDialog.value = false;

    // Tampilkan dialog konfirmasi
    const result = await swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "Do you want to submit this signature?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    });

    if (!result.isConfirmed) {
        await swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your signature was not submitted.',
            'error'
        );
        return;
    }

    try {
        const params = { speciment: `${signature.value.base64}` }; // Sesuaikan dengan kebutuhan API Anda

        await userService.UploadSign(params, signature.value.id);
        await swalWithBootstrapButtons.fire(
            'Submitted!',
            'Your signature has been submitted.',
            'success'
        );
    } catch (error) {
        await swalWithBootstrapButtons.fire(
            'Error',
            'There was an error submitting your signature. Please try again.',
            'error'
        );
    }
};

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
                            <Button label="Run Status VIDA" icon="pi pi-caret-right" class="p-button-warning mr-2"
                                @click="runStatus" />
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
                    <template #empty>
                        <div class="text-center p-2">
                            <p class="text-lg font-semibold">No Data Available</p>
                        </div>
                    </template>
                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header"
                        headerStyle="width:18%; min-width:10rem;"></Column>
                    <Column field="pin_access" header="Pin Access Surat" :sortable="false" headerStyle="width:15%;">
                        <template #body="slotProps">
                            <div class="flex items-center" v-if="slotProps.data.status == '1'">
                                <b v-if="slotProps.data.pin_access" class="mr-2">{{ slotProps.data.pin_access }}</b>

                                <div v-if="slotProps.data.pin_access" class="flex items-center">
                                    <img src="https://purwanto.co.id/img/icon/aa1f4fc1.svg" alt="Copy"
                                        @click="copyToClipboard(slotProps.data.pin_access)"
                                        class="cursor-pointer ml-2" />
                                </div>

                                <div class="flex items-center ml-2">
                                    <img src="https://purwanto.co.id/img/icon/ab1f3fc4.svg" alt="Update"
                                        @click="updateListPinAccess(slotProps.data.id)" class="cursor-pointer ml-2" />
                                </div>
                            </div>
                            <div class="flex items-center text-center" v-if="slotProps.data.status == '0'">
                                <b v-if="slotProps.data.pin_access" class="mr-2">-</b>
                            </div>
                        </template>

                    </Column>
                    <Column field="status" header="Status" :sortable="false" headerStyle="width:24%;">
                        <template #body="slotProps">
                            <!-- <span class="p-column-title">Status</span>
                            <span :class="'item-badge status-' + (slotProps.data.status==='1' ? 'active' : 'deactive')">{{ (slotProps.data.status==='1' ? 'Active' : 'No Active') }}</span> -->
                            <Tag :value="slotProps.data.status === '1' ? 'Active' : 'No Active'"
                                :severity="getStatusLabel(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column field="aksi" header="Aksi" :exportable="false" style="min-width:11rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                                @click="editUser(slotProps.data)" />
                            <template v-if="slotProps.data.user_vida.status !== '9' && slotProps.data.status === '1'">
                                <Button icon="pi pi-key" outlined rounded class="mr-2" severity="danger"
                                    @click="dataProsesVida(slotProps.data)" />
                            </template>
                            <template v-if="slotProps.data.status === '1'">
                                <Button icon="pi pi-cloud" outlined rounded severity="secondary"
                                    @click="openSignature(slotProps.data)" />
                            </template>
                        </template>
                    </Column>
                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData">
                        </Paginator>
                    </template>
                </DataTable>
            </div>

            <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="User" :modal="true"
                class="p-fluid">

                <div class="field">
                    <label for="name">NIP</label>
                    <InputText v-model.trim="user.number_officer" disabled  />
                    <small>NIP otomatis.</small>
                </div>
                
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="user.name" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !user.name }" />
                    <small class="p-error" v-if="submitted && !user.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="user.name" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !user.name }" />
                    <small class="p-error" v-if="submitted && !user.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <InputText id="email" v-model.trim="user.email" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !user.email }" />
                    <small class="p-error" v-if="submitted && !user.email">Email is required.</small>
                </div>
                <div class="field">
                    <label for="phone">Phone</label>
                    <InputText id="phone" v-model.trim="user.phone" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !user.phone }" />
                    <small class="p-error" v-if="submitted && !user.phone">Phone is required.</small>
                </div>
                
                <div class="field">
                    <label for="gender">Jenis Kelamin</label>
                    <Dropdown inputId="gender" v-model="user.gender" :options="StatusGenderList"
                        optionLabel="label" optionValue="id" placeholder="Select a Jenis Kelamin" required autofocus
                        :class="{ 'p-invalid': submitted && !user.gender }" />
                    <small class="p-error" v-if="submitted && !user.gender">Jenis Kelamin is
                        required.</small>
                </div>
                <div class="field">
                    <label for="divisi">Divisi</label>
                    <Dropdown inputId="class" v-model="selectedDivisi" :options="divisiList" @change="setDivisi($event)"
                        optionLabel="name" optionValue="id" placeholder="Select a Divisi" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !user.divisi }" />
                    <small class="p-error" v-if="submitted && !user.divisi">Divisi is required.</small>
                </div>
                <div class="field">
                    <label for="position">Position</label>
                    <Dropdown inputId="class" v-model="selectedPosition" :options="positionList"
                        @change="setPostion($event)" optionLabel="alias" optionValue="id"
                        placeholder="Select a Position" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !user.position }" />
                    <small class="p-error" v-if="submitted && !user.position">Divisi is required.</small>
                </div>
                <div class="field">
                    <label for="dob">Date of Birth</label>
                    <Calendar id="dob" v-model.trim="user.dob" required="true" autofocus dateFormat="yy-mm-dd"
                        maxlength="10" :class="{ 'p-invalid': submitted && !user.dob }" />
                    <small class="p-error" v-if="submitted && !user.dob">Date of Birth
                        must be in YYYY-MM-DD format.</small>
                </div>

                <div class="field">
                    <label for="join_date">Join Date</label>
                    <Calendar id="join_date" v-model.trim="user.join_date" required autofocus dateFormat="yy-mm-dd"
                        maxlength="10" :class="{ 'p-invalid': submitted && !user.join_date }" />
                    <small class="p-error" v-if="submitted && !user.join_date">Join
                        date must be in YYYY-MM-DD format.</small>
                </div>

                <div class="field">
                    <label for="status_karyawan">Status Karyawan</label>
                    <Dropdown inputId="status_karyawan" v-model="user.status_karyawan" :options="StatusKaryawanList"
                        optionLabel="label" optionValue="id" placeholder="Select a Status Karyawan" required autofocus
                        :class="{ 'p-invalid': submitted && !user.status_karyawan }" />
                    <small class="p-error" v-if="submitted && !user.status_karyawan">Status Karyawan is
                        required.</small>
                </div>

                <!-- Jika status 1 atau 2, end_date akan otomatis terisi -->
                <div v-if="user.status_karyawan !== '3'" class="field">
                    <label for="end_date">End Date</label>
                    <Calendar id="end_date" v-model.trim="user.end_date" required dateFormat="yy-mm-dd" maxlength="10"
                        :class="{ 'p-invalid': submitted && !user.end_date }" />
                </div>

                <!-- Jika status 3, tampilkan field untuk input manual end_date -->
                <div v-if="user.status_karyawan === '3'" class="field">
                    <label for="manual_end_date">End Date (Manual Input)</label>
                    <Calendar id="manual_end_date" v-model.trim="user.end_date" required autofocus dateFormat="yy-mm-dd"
                        maxlength="10" :class="{ 'p-invalid': submitted && !user.end_date }" />
                    <small class="p-error" v-if="submitted && !user.end_date">End
                        date must be in YYYY-MM-DD format.</small>
                </div>

                <div class="field">
                    <label for="pin">Pin Absensi</label>
                    <InputText id="pin" v-model.trim="user.pin" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !user.pin }" />
                    <small class="p-error" v-if="submitted && !user.pin">Pin Absensi is required.</small>
                </div>
                <div class="field" v-if="!edited">
                    <label for="password">Password</label>
                    <Password id="password" v-model.trim="user.password" type="text" required="true" toggleMask
                        autofocus :class="{ 'p-invalid': submitted && !user.password }" promptLabel="Input a password"
                        weakLabel="Too simple" mediumLabel="Average complexity" strongLabel="Complex password" />
                    <small class="p-error" v-if="submitted && !user.password">Password is required.</small>
                </div>
                <div class="field" v-if="edited">
                    <label for="password">Password</label>
                    <Password id="password" v-model.trim="user.password" type="text" required="true" toggleMask
                        autofocus promptLabel="Input a password" weakLabel="Too simple" mediumLabel="Average complexity"
                        strongLabel="Complex password" />
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
                    <label for="photo">Foto Pass</label>
                    <FileUpload mode="basic" accept="image/*" v-model.trim="user.photo" :maxFileSize="1000000"
                        @select="convertToBase64" />
                    <!-- <small class="p-error" v-if="submitted && !user.photo">Foto Pass is
                        required.</small> -->
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
                    <Button label="Save" icon="pi pi-check" text @click="saveUser" />
                </template>
            </Dialog>

            <Dialog v-model:visible="showSignatureDialog" :header="`Signature - (${signature.name})`" :modal="true" :closable="false"
                :style="{ width: '380px' }">

                <div class="field vertical-layout"></div>

                <div class="field col-12">
                    <label for="field vertical-layout">Image</label>
                    <FileUpload mode="basic" accept="image/*" @select="handleFileUpload" />
                </div>

                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" @click="closeSignatureDialog" />
                    <Button label="Confirm" icon="pi pi-check" @click="confirmSign" />
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

