<script setup>
import { inject, onMounted, onUpdated, provide, ref, watch } from 'vue';
import AbsenService from '@/service/AbsenService';
import { useRouter, useRoute } from 'vue-router';
import { formatDate } from '@fullcalendar/core/index.js';

const swal = inject('$swal')

const router = useRouter()
const route = useRoute()

const optionsIzinType = ref({})
const selectedIzinType = ref()

const izinDialog = ref(false);
const visible = ref(false);
const submitted = ref(false);
const edited = ref(false);

const totalSisaCuti = ref()

const dataIzin = ref({});

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Alpa', to: '/alpa/list' }, { label: 'List', to: '/alpa/list' }]);

const absenService = new AbsenService();
const ListData = ref();

const GetAttendanceAbsent = () => {
  {
    absenService.GetAttendanceAbsent().then((data) => {
      ListData.value = data.data
    });
  }
};

const setFormatDate = (data) => {
  let date = data ? new Date(data) : new Date();
  let tahun = date.getFullYear();
  let bulan = date.getMonth();
  let tanggal = date.getDate();
  let hari = date.getDay();
  switch (hari) {
    case 0: hari = "Minggu"; break;
    case 1: hari = "Senin"; break;
    case 2: hari = "Selasa"; break;
    case 3: hari = "Rabu"; break;
    case 4: hari = "Kamis"; break;
    case 5: hari = "Jum'at"; break;
    case 6: hari = "Sabtu"; break;
  }
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
  let tampilTanggal = hari + ", " + tanggal + " " + bulan + " " + tahun;

  return tampilTanggal;
}

const setFormatDate2 = (date) => {
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

const setFormatDate3 = (date) => {
  var d = new Date(date),
    bulan = '' + (d.getMonth() + 1),
    tanggal = '' + d.getDate(),
    tahun = d.getFullYear();

  if (bulan.length < 2)
    bulan = '0' + bulan;
  if (tanggal.length < 2)
    tanggal = '0' + tanggal;

  return [tanggal, bulan, tahun,].join('/');
}


onMounted(() => {
  GetAttendanceAbsent();
});

const setOptionsListIzinType = () => {
  absenService.getListIzinType().then((data) => {
    optionsIzinType.value = data.data
  });
}

const setIzinType = (data) => {
  dataIzin.value.type = data.value.type
}


const hideDialog = () => {
  izinDialog.value = false;
  submitted.value = false;
};

const editIzin = (prod) => {
  dataIzin.value = { ...prod };

  izinDialog.value = true;
  edited.value = true;
  selectedIzinType.value = null;

  getCountTotalCutiByUser();
  setOptionsListIzinType()
};

const filterIzinPayload = (data) => {
  return {
    type: data.type,
    date: data.date,
    keterangan: data.keterangan,
    status: data.status,
    times: data.times,
  };
};


const saveData = () => {
  submitted.value = true;

  if (
    selectedIzinType.value !== null &&
    dataIzin.value.keterangan !== undefined
  ) {
    // Format the date properly
    dataIzin.value.date = setFormatDate2(dataIzin.value.absenteeism_date);

    // Assign other required fields
    dataIzin.value.status = "1";
    dataIzin.value.times = "";

    // Filter the payload
    const payload = filterIzinPayload(dataIzin.value);

    // console.log("Payload being sent:", payload);

    // Call the save function
    saveListDataIzin(payload, dataIzin.value.pin);

    izinDialog.value = false;
    dataIzin.value = {};
  }
};


watch(selectedIzinType, (newValue) => {
  if (newValue) {
    getCountTotalCutiByUser(); // Call the function when type changes
  }
});

const getCountTotalCutiByUser = () => {
  if (dataIzin.value && selectedIzinType.value) {

    let params = {
      pin: dataIzin.value.pin,  // Access pin from dataIzin
      type: selectedIzinType.value.type     // Access type from selectedIzinType
    };

    absenService.getCountTotalCutiByUser(params).then((data) => {
      totalSisaCuti.value = data.data;

    });
  }
};

const saveListDataIzin = (params, id) => {
  // Show loading dialog
  const swalWithBootstrapButtons = swal.mixin({
    customClass: {
      confirmButton: 'btnCustomSweetalert bg-yellow-500',
      cancelButton: 'btnCustomSweetalert bg-red-500'
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons.fire({
    title: 'Please wait',
    allowOutsideClick: false, // Prevent user from closing the dialog
    didOpen: () => {
      swal.showLoading(); // Show loading spinner
    }
  });

  // Perform API call
  return absenService.saveDateCutiUser(params, id)
    .then((res) => {
      // Close the loading dialog
      swal.close();

      // Handle success
      swalWithBootstrapButtons.fire(
        'Success!',
        'Save data cuti',
        'success'
      );

      // Refresh attendance data
      GetAttendanceAbsent(1);
    })
    .catch((error) => {
      // Close the loading dialog
      swal.close();

      // Handle errors
      if (error.response && error.response.data.code === 409) {
        swalWithBootstrapButtons.fire(
          'Error!',
          'Kendala pada sistem',
          'error'
        );
      } else {
        swalWithBootstrapButtons.fire(
          'Error!',
          'An unexpected error occurred. Please try again.',
          'error'
        );
      }

      // Optionally refresh attendance data even on failure
      GetAttendanceAbsent(1);
    });
};

</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card card-w-title">
        <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />

        <DataTable :value="ListData" paginator :rows="15" :rowsPerPageOptions="[15, 20, 50, 80, 100]">
          <template #empty>
            <div class="text-center p-2">
              <p class="text-lg font-semibold">No Data Available</p>
            </div>
          </template>

          <Column field="no" header="No" :sortable="false" headerStyle="width=4% min-width:10rem;">
            <template #body="slotProps">
              {{ ListData.indexOf(slotProps.data) + 1 }}
            </template>
          </Column>

          <Column field="emp_name" header="Nama" :sortable="false" headerStyle="width=4% min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.emp_name }}
            </template>
          </Column>

          <Column field="absenteeism_date" header="Tanggal" :sortable="false" headerStyle="width=4% min-width:10rem;">
            <template #body="slotProps">
              {{ setFormatDate(slotProps.data.absenteeism_date) }}
            </template>
          </Column>

          <Column field="notes" header="Keterangan" :sortable="false" headerStyle="width=4% min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.notes }}
            </template>
          </Column>

          <Column field="action" header="Action" :sortable="false" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editIzin(slotProps.data)" />
            </template>
          </Column>
        </DataTable>


      </div>
    </div>
  </div>

  <Dialog v-model:visible="izinDialog" :closable="false" :style="{ width: '450px' }" header="Add Izin/Cuti"
    :modal="true" class="p-fluid">
    <div class="field">
      <label for="name">Name</label>
      <InputText type="text" :value='dataIzin.emp_name' disabled />

    </div>


    <div class="field">
      <label for="type_izin">Izin/Cuti</label>
      <Dropdown inputId="class" v-model="selectedIzinType" @change="setIzinType($event)" :options="optionsIzinType"
        optionLabel="desc" placeholder="Select Izin/Cuti" class="w-full" />
      <small class="p-error" v-if="submitted && !dataIzin.type">Izin is required.</small>
    </div>

    <div
      v-if="selectedIzinType && !selectedIzinType.desc.includes('Izin') && !selectedIzinType.desc.includes('WFH') && !selectedIzinType.desc.includes('Dinas')"
      class="mt-3 mb-3" style="background: rgba(4, 168, 59, 0.425); border-radius: 6px">
      <p class="p-2 py-1 font-bold"> Sisa Cuti: {{ totalSisaCuti || 0 }} </p>
    </div>

    <div class="field">
      <label for="tanggal">Date</label>
      <InputText type="text" :value='setFormatDate3(dataIzin.absenteeism_date)' disabled />
    </div>
    <div class="field">
      <label for="keterangan">Keterangan</label>
      <Textarea v-model.trim="dataIzin.keterangan" rows="5" cols="30" />
      <small class="p-error" v-if="submitted && !dataIzin.keterangan">Keterangan is required.</small>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Save" icon="pi pi-check" text @click="saveData" />
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
