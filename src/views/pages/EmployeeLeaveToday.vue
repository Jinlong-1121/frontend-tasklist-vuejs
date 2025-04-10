<script setup>
import { onMounted, onUpdated, provide, ref } from 'vue';
import AbsenService from '@/service/AbsenService';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Dashboard', to: '/' }, { label: 'Informasi Izin & Cuti', to: '/employee-leave-today' }]);

const currentDate = ref('');
const futureDate = ref('');

const absenService = new AbsenService();
const ListData = ref();

const getListCuti = () => {
  {
    absenService.getEmployeeLeaveToday().then((data) => {
      ListData.value = data
    });
  }
};

const getDateRange = () => {
  const today = new Date();
  const tenDaysLater = new Date(today);
  tenDaysLater.setDate(today.getDate() + 10);

  // Menyimpan tanggal sekarang dan 10 hari ke depan dalam format yang sudah ditentukan
  currentDate.value = setFormatDateNotDay(today);
  futureDate.value = setFormatDateNotDay(tenDaysLater);
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

const setFormatDateNotDay = (data) => {
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

onMounted(() => {
  getListCuti();
  getDateRange();
});

</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card card-w-title">
        <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />
        <div class="mb-3 text-lg">
          Tanggal: {{ currentDate }} - {{ futureDate }}
        </div>
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
          <Column field="username" header="Nama" :sortable="false" headerStyle="width=4% min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.username }}
            </template>
          </Column>
          <Column field="desc" header="Type Cuti" :sortable="false" headerStyle="width=4% min-width:10rem;">
            <template #body="slotProps">
              {{ slotProps.data.desc }}
            </template>
          </Column>
          <Column field="date" header="Tanggal Cuti" :sortable="false" headerStyle="width=4% min-width:10rem;">
            <template #body="slotProps">
              {{ setFormatDate(slotProps.data.date) }}
            </template>
          </Column>
          <Column field="status" header="Status" :sortable="false" headerStyle="width=4% min-width:10rem;">
            <template #body="slotProps">
              <!-- By Surat -->
              <Badge v-if="slotProps.data.status == 1 && slotProps.data.status_surat == 2" :value="`Pending Verificator`" severity="info"></Badge>
              <Badge v-if="slotProps.data.status == 1 && slotProps.data.status_surat == 3" :value="`Pending Signer`" severity="info"></Badge>
              <Badge v-if="slotProps.data.status == 1 && slotProps.data.status_surat == 4" :value="`Pending HRD`" severity="info"></Badge>              
              <Badge v-if="slotProps.data.status == 0 && slotProps.data.status_surat == 4" :value="`Approved`" severity="success"></Badge>

              <!-- Only HR -->
              <Badge v-if="slotProps.data.status == 1 && slotProps.data.status_surat == ''" :value="`Pending HRD`"></Badge>              
              <Badge v-if="slotProps.data.status == 0 && slotProps.data.status_surat == ''" :value="`Approved`" severity="success"></Badge>

            </template>
          </Column>
          <!-- <Column field="status_surat" header="Status Surat" :sortable="false" headerStyle="width=4% min-width:10rem;">
            <template #body="slotProps">
              <Badge v-if="slotProps.data.status_surat == 2" :value="`Pending Verificator`" severity="info"></Badge>
              <Badge v-if="slotProps.data.status_surat == 3" :value="`Pending Signer`" severity="info"></Badge>
              <Badge v-if="slotProps.data.status_surat == 4" :value="`Approved`" severity="success"></Badge>
              <Badge v-else :value="`Tidak ada Surat`"></Badge>

            </template>
          </Column> -->
        </DataTable>


      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
