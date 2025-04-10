<script setup>
import { FilterMatchMode } from 'primevue/api';
import { inject, ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import AbsenService from '@/service/AbsenService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const swal = inject('$swal')

const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Izin' }, { label: 'List' }]);

const totalSisaCuti = ref()

const Izin = ref(null);
const Rows = ref(null);

// const AbsenDialog = ref(false);
// const deleteAbsenDialog = ref(false);
// const deleteAbsensDialog = ref(false);
// const Absen = ref({});
// const selectedAbsens = ref(null);
const Restart = ref(null);
const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const first = ref(0)
const email = ref("")
// const submitted = ref(false);
// const selectedFilterType = ref()
// const optionsFilterType = ref();
const selectedFilterStatus = ref();
const optionsFilterStatus = ref([
    { name: 'Pending', statIzin: '1' },
    { name: 'Approve', statIzin: '0' },
    { name: 'Reject', statIzin: '2' }
]);

const absenService = new AbsenService();

const loading = ref(false);
const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
}

onBeforeMount(() => {
    initFilters();
    setOptionsListUserAbsen();
    setOptionsListIzinType();
    getCountTotalCutiByUser();
});
onMounted(() => {
    setOptionsListUserAbsen();
    setOptionsListIzinType();
    getCountTotalCutiByUser();
    let page = (first.value / 10) + 1;
    let date = new Date();
    let currentDate = dateMonthYear(date);
    selectedFilterStatus.value = { name: 'Pending', statIzin: '1' }
    filterMonth.value = date;
    getListData(page, currentDate);
});
computed(() => {
    // console.log(first);
    // checkLogin();
});
watch(() => {
    // console.log(first);
    // checkLogin();
});

const handleApprovedIzin = (data) => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })

    if (data.doc_id != "") {
        absenService.notifApproval(data.doc_id).then((datanotifApproval) => {

            if (datanotifApproval.data.status_document != "4") {
                let text = ""
                if (datanotifApproval.data.status_document == "3") {
                    text = `Pengajuan cuti ini belum penandatangan oleh ${datanotifApproval.data.user_name_signer}. Apakah Anda yakin ingin approve izin?`;
                } else  {
                    text = `Pengajuan cuti ini belum verifikator oleh ${datanotifApproval.data.user_name_verif}.  Apakah Anda yakin ingin approve izin?`;
                }

                swalWithBootstrapButtons.fire({
                    title: 'Warning!',
                    text: text,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Lanjut, Sabmit',
                    cancelButtonText: 'Cancel',
                    // reverseButtons: true
                }).then((result) => {

                    if (result.isConfirmed) {
                        data.status = "0"
                        absenService.approvedIzin(data).then((data) => {
                            // console.log(data, "RESPON");
                            let page = (first.value / 10) + 1;
                            let date = filterMonth.value;
                            let currentDate = dateMonthYear(date);
                            getListData(page, currentDate);
                            swalWithBootstrapButtons.fire(
                                'Success!',
                                'Izin berhasil di approve.',
                                'success'
                            )
                        });
                    }
                })
            } else {
                swalWithBootstrapButtons.fire({
                    title: 'Approve Izin!',
                    text: "Anda yakin ingin approve izin?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel',
                    // reverseButtons: true
                }).then((result) => {

                    if (result.isConfirmed) {
                        data.status = "0"
                        absenService.approvedIzin(data).then((data) => {
                            // console.log(data, "RESPON");
                            let page = (first.value / 10) + 1;
                            let date = filterMonth.value;
                            let currentDate = dateMonthYear(date);
                            getListData(page, currentDate);
                            swalWithBootstrapButtons.fire(
                                'Success!',
                                'Izin berhasil di approve.',
                                'success'
                            )
                        });
                    }
                })
            }
        });
    }

    if (data.doc_id == "") {
        swalWithBootstrapButtons.fire({
            title: 'Approve Izin!',
            text: "Anda yakin ingin approve izin?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            // reverseButtons: true
        }).then((result) => {

            if (result.isConfirmed) {
                data.status = "0"
                absenService.approvedIzin(data).then((data) => {
                    // console.log(data, "RESPON");
                    let page = (first.value / 10) + 1;
                    let date = filterMonth.value;
                    let currentDate = dateMonthYear(date);
                    getListData(page, currentDate);
                    swalWithBootstrapButtons.fire(
                        'Success!',
                        'Izin berhasil di approve.',
                        'success'
                    )
                });
            }
        })
    }

}

const PostAttendanceAbsent = (year, month) => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: 'Informasi',
        text: "Anda yakin ingin Refresh Data",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            swal.fire({
                title: 'Waiting!',
                html: 'Sedang proses Refresh Data.',
                allowOutsideClick: false,
                didOpen: () => {
                    swal.showLoading();
                },
            });

            // Call the API and adjust success check
            const params = { year: year, month: month, pin: userPin};
            absenService.PostAttendanceAbsent(params)
                .then((res) => {
                    // console.log("API response:", res); // Log the response for inspection

                    // Adjusted success condition based on custom response format
                    if (res && res.code === 200) {
                        swal.close();
                        swalWithBootstrapButtons.fire(
                            'Success!',
                            'Surat anda berhasil Refresh Data.',
                            'success'
                        );
                    } else {
                        throw new Error("Unexpected response format"); // Trigger catch block
                    }
                })
                .catch((error) => {
                    console.error("API error:", error); // Log error details
                    swal.close();
                    swalWithBootstrapButtons.fire(
                        'Error!',
                        'Terjadi kesalahan saat Refresh Data.',
                        'error'
                    );
                });
        }
    });
}

const getListData = (page, date) => {
    let params = {
        page: page,
        month: date,
        statusIzin: selectedFilterStatus.value.statIzin
    }
    absenService.getListIzin(params).then((data) => {
        Izin.value = data.data.rows;
        Rows.value = data.data.total_rows;
    });
};

const sendEmail = () => {
    var params = {
        month: dateMonthYear(filterMonth.value),
        email: email.value
    }
    loading.value = true;
    // setTimeout(() => {
    //     loading.value = false;
    //     toast.add({ severity: 'success', summary: 'Successful', detail: 'Absen Deleted', life: 3000 });
    // }, 2000);
    // // console.log(params);
    absenService.sendEmailCuti(params).then((data) => {
        // Absens.value = data.data;
        if (!data.error) {
            loading.value = false;
            toast.add({ severity: 'success', summary: 'Successful', detail: data.data, life: 3000 });
        } else {
            loading.value = false;
            toast.add({ severity: 'danger', summary: 'Error', detail: 'Gagal kirim', life: 3000 });
        }
        // console.log(data);
    });
};

const accessData = () => {
    let page = (first.value / 10) + 1;
    let selectedDate = dateMonthYear(filterMonth.value);
    getListData(page, selectedDate)
};

const filterMonthEvent = () => {
    let page = (first.value / 10) + 1;
    let selectedDate = dateMonthYear(filterMonth.value);

    getListData(page, selectedDate);
};

const dateMonthYear = (dateString) => {
    let date = new Date(dateString);
    let dateFormat = date.getFullYear() + "-" + (String((date.getMonth() + 1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
    return dateFormat;
}

const setFilterStatus = (data) => {
    selectedFilterStatus.value = data.value
    let page = (first.value / 10) + 1;
    let selectedDate = dateMonthYear(filterMonth.value);
    getListData(page, selectedDate);
}

// POPUP IZIN FORM
const izinDialog = ref(false);
const dataIzin = ref({});
const submitted = ref(false);

// OPTIONS VARIABLE
const optionsListUserAbsen = ref({})
const selectedListUserAbsen = ref()
const optionsIzinType = ref({})
const selectedIzinType = ref()
const divisiID = JSON.parse(localStorage.getItem('sipam')).divisi
const userPin = JSON.parse(localStorage.getItem('sipam')).pin

// END OPTIONS VARIABLE

const setOptionsListUserAbsen = () => {
    absenService.getListUserAbsen().then((data) => {
        optionsListUserAbsen.value = data.data
    });
}
const setOptionsListIzinType = () => {
    absenService.getListIzinType().then((data) => {
        optionsIzinType.value = data.data
    });
}


const openNewIzin = () => {
    dataIzin.value = {};
    submitted.value = false;
    izinDialog.value = true;
    selectedListUserAbsen.value = null;
    selectedIzinType.value = null;
    // edited.value = false;
};
const hideIzinDialog = () => {
    izinDialog.value = false;
    submitted.value = false;
};
const handleSubmitIzin = () => {
    submitted.value = true;
    if (
        selectedListUserAbsen.value !== null &&
        selectedIzinType.value !== null &&
        dataIzin.value.date !== undefined &&
        dataIzin.value.keterangan !== undefined
    ) {
        dataIzin.value.date = setFormatDate(dataIzin.value.date)
        dataIzin.value.status = "1";
        dataIzin.value.times = "";
        saveListDataIzin(dataIzin.value)
        izinDialog.value = false;
        dataIzin.value = {};
    }
};

const saveListDataIzin = (params) => {
    // Panggil API untuk mengirim data izin pengguna
    absenService.sendUserIzin(params)
        .then((data) => {
            // Tampilkan toast notifikasi sukses
            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'User Updated',
                life: 3000
            });

            // Hitung halaman saat ini berdasarkan nilai "first"
            let page = (first.value / 10) + 1;

            // Ambil tanggal saat ini
            let date = new Date();
            let currentDate = dateMonthYear(date);

            // Set nilai filter status menjadi "Pending"
            selectedFilterStatus.value = { name: 'Pending', statIzin: '1' };

            // Set filter bulan ke tanggal saat ini
            filterMonth.value = date;

            // Panggil ulang fungsi `getListData` untuk merefresh data
            getListData(page, currentDate);
        })
        .catch((error) => {
            // Tangani error dan tampilkan notifikasi
            console.error("Error sending user izin:", error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update user izin',
                life: 3000
            });
        });
};

const setUserAbsenPin = (data) => {
    dataIzin.value.pin = data.value.pin
}

const setIzinType = (data) => {
    dataIzin.value.type = data.value.type


}

const setFormatDate = (date) => {
    var d = new Date(date),
        bulan = '' + (d.getMonth() + 1),
        tanggal = '' + d.getDate(),
        tahun = d.getFullYear();

    if (bulan.length < 2)
        bulan = '0' + bulan;
    if (tanggal.length < 2)
        tanggal = '0' + tanggal;

    return [tahun, bulan, tanggal].join('-');
}
// END POPUP IZIN FORM

// const confirmDeleteSelected = () => {
//     deleteAbsensDialog.value = true;
// };
// const deleteSelectedAbsens = () => {
//     Absens.value = Absens.value.filter((val) => !selectedAbsens.value.includes(val));
//     deleteAbsensDialog.value = false;
//     selectedAbsens.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Absens Deleted', life: 3000 });
// };

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

watch(selectedListUserAbsen, (newValue) => {
    if (newValue) {
        getCountTotalCutiByUser(); // Call the function when user changes
    }
});

watch(selectedIzinType, (newValue) => {
    if (newValue) {
        getCountTotalCutiByUser(); // Call the function when type changes
    }
});

const getCountTotalCutiByUser = () => {
    if (selectedListUserAbsen.value && selectedIzinType.value) {
        let params = {
            pin: selectedListUserAbsen.value.pin,  // Access pin from selectedListUserAbsen
            type: selectedIzinType.value.type     // Access type from selectedIzinType
        };
        absenService.getCountTotalCutiByUser(params).then((data) => {
            totalSisaCuti.value = data.data;

        });
    }
};

const setFormatDateBI = (data) => {
    let date = data ? new Date(data) : new Date();
    let tahun = date.getFullYear();
    let bulan = date.getMonth();
    let tanggal = date.getDate();

    switch (bulan) {
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

const columnsP1 = [
    { field: 'username', header: 'Nama Karyawan' }
];

const columnsP2 = [
    { field: 'izin_desc', header: 'Kategori Cuti' },
    { field: 'keterangan', header: 'Keterangan' },
    // { field: 'status', header: 'Status' },
];
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <!-- <div class="card card-w-title">
                <h5>Surat</h5>
                <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
            </div> -->
            <div class="card card-w-title">
                <!-- <div class="mb-4">
                    <h5>Surat</h5>
                    <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" />
                </div> -->
                <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <!-- <span class="p-float-label"> -->
                            <Calendar inputId="inputMont" v-model="filterMonth" view="month" dateFormat="MM yy"
                                @date-select="filterMonthEvent" />
                            <!-- <label for="inputMont">Pilih Bulan</label> -->
                            <!-- </span> -->
                            <!-- <Dropdown
                                class="ml-2"
                                inputId="class"
                                v-bind="selectedFilterType"
                                :options="optionsFilterType"
                                @change="setFilterType($event)"
                                optionLabel="name"
                                placeholder="Select Filter"
                            /> -->
                            <Dropdown inputId="class" v-model="selectedFilterStatus" :options="optionsFilterStatus"
                                @change="setFilterStatus($event)" optionLabel="name" placeholder="Select a City"
                                class="ml-2 w-full md:w-14rem" />
                            <!-- <Button label="Filter" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" /> -->
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedAbsens || !selectedAbsens.length" /> -->
                        </div>
                    </template>

                    <template v-slot:end>
                        <!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" /> -->
                        <Button label="Refresh Data" icon="pi pi-refresh" class="ml-3 p-button p-button-warning mr-3"
                            @click="PostAttendanceAbsent(new Date(filterMonth).getFullYear(), ('0' + (new Date(filterMonth).getMonth() + 1)).slice(-2))" />
                        <Button label="Add Izin/Cuti" icon="pi pi-plus" class="p-button-help" @click="openNewIzin" />

                        <OverlayPanel ref="op" appendTo="body">
                            <!-- <template> -->
                            <div class="flex justify-content-center p-fluid">
                                <div v-focustrap class="cards">
                                    <!-- <div class="field">
                                            <label><b>Tambah Tujuan Baru</b></label>
                                        </div> -->
                                    <div class="field">
                                        <InputText id="input" v-model="email" type="text" placeholder="Email"
                                            autofocus />
                                    </div>
                                    <Button type="submit" label="Send" class="mt-2" :loading="loading"
                                        @click="sendEmail" />
                                </div>
                            </div>
                            <!-- </template> -->
                        </OverlayPanel>
                    </template>
                </Toolbar>
                <DataTable ref="dt" :value="Izin" responsiveLayout="scroll">
                    <template #empty>
                        <div class="text-center p-2">
                            <p class="text-lg font-semibold">No Data Available</p>
                        </div>
                    </template>

                    <!-- <Column field="username" header="Nama Karyawan" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <router-link :to="{ name: 'absen-detail', params: { id: slotProps.data.pin }}">{{ slotProps.data.username }}</router-link>
                        </template>
                    </Column> -->
                    <Column v-for="col of columnsP1" :key="col.field" :field="col.field" :header="col.header"
                        headerStyle="width:14%; min-width:10rem;"></Column>
                    <Column field="date" header="Tanggal" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            {{ setFormatDateBI(slotProps.data.date) }}
                        </template>
                    </Column>
                    <Column v-for="col of columnsP2" :key="col.field" :field="col.field" :header="col.header"
                        headerStyle="width:14%; min-width:10rem;"></Column>
                    <Column field="status" header="Status" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Badge v-if="slotProps.data.status === '0'" :value="`Approve`" severity="success"></Badge>
                            <Badge v-if="slotProps.data.status === '1'" :value="`Pending`" severity="warning"></Badge>
                            <Badge v-if="slotProps.data.status === '2'" :value="`Reject`" severity="danger"></Badge>
                        </template>
                    </Column>
                    <Column
                        v-if="selectedFilterStatus?.statIzin === '1' && (divisiID === 1 || divisiID === 2 || divisiID === 9)"
                        field="action" header="Action" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Button v-if="slotProps.data.status === '1'" icon="pi pi-pencil" outlined rounded
                                class="mr-2" @click="handleApprovedIzin(slotProps.data)" />
                        </template>
                    </Column>
                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData">
                        </Paginator>
                    </template>
                </DataTable>
            </div>

            <!-- POPUP ADD IZIN -->
            <Dialog v-model:visible="izinDialog" :closable="false" :style="{ width: '450px' }" header="Add Izin/Cuti"
                :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <Dropdown inputId="class" v-model="selectedListUserAbsen" @change="setUserAbsenPin($event)"
                        :options="optionsListUserAbsen" optionLabel="user_name" placeholder="Select User"
                        class="w-full" />
                    <small class="p-error" v-if="submitted && !dataIzin.pin">User is required.</small>
                </div>

                <div class="field">
                    <label for="type_izin">Izin/Cuti</label>
                    <Dropdown inputId="class" v-model="selectedIzinType" @change="setIzinType($event)"
                        :options="optionsIzinType" optionLabel="desc" placeholder="Select Izin/Cuti" class="w-full"
                        :disabled="selectedListUserAbsen == null" />
                    <small class="p-error" v-if="submitted && !dataIzin.type">Izin is required.</small>
                </div>

                <div v-if="selectedIzinType && !selectedIzinType.desc.includes('Izin') && !selectedIzinType.desc.includes('WFH') && !selectedIzinType.desc.includes('Dinas')"
                    class="mt-3 mb-3" style="background: rgba(4, 168, 59, 0.425); border-radius: 6px">
                    <p class="p-2 py-1 font-bold"> Sisa Cuti: {{ totalSisaCuti || 0 }} </p>
                </div>

                <div class="field">
                    <label for="tanggal">Date</label>
                    <Calendar id="tanggal" v-model.trim="dataIzin.date" />
                    <small class="p-error" v-if="submitted && !dataIzin.date">Date is required.</small>
                </div>
                <div class="field">
                    <label for="keterangan">Keterangan</label>
                    <Textarea v-model.trim="dataIzin.keterangan" rows="5" cols="30" />
                    <small class="p-error" v-if="submitted && !dataIzin.keterangan">Keterangan is required.</small>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="hideIzinDialog" />
                    <Button label="Save" icon="pi pi-check" text @click="handleSubmitIzin" />
                </template>
            </Dialog>
            <!-- END POPUP ADD IZIN -->
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
<style>
.btnCustomSweetalert {
    border: none;
    padding: 12px 32px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 4px;
    cursor: pointer;
}
</style>