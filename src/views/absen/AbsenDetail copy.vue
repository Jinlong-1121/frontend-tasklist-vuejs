<script setup>
// import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'


// import { useRouter, useRoute } from 'vue-router'
import AbsenService from '@/service/AbsenService';
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Absen' }, { label: 'List' }]);


const absenService = new AbsenService();

onMounted(() => {
    
});

const handleEventClick = () => {
    // console.log("hello");
}

const INITIAL_EVENTS = [
{
    id: 1,
    title: 'All-day event',
    start: '2023-04-01',
    backgroundColor: '#ffddbb'
  },
  {
    id: 2,
    title: 'Timed event',
    start: '2023-04-05',
    backgroundColor: 'green'
  }
]

const calendarOptions = {
        plugins: [
          dayGridPlugin,
          // timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: ''
        },
        initialView: 'dayGridMonth',
        initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        editable: false,
        selectable: false,
        selectMirror: false,
        dayMaxEvents: true,
        weekends: true,
        // select: this.handleDateSelect,
        eventClick: handleEventClick,
        // eventsSet: this.handleEvents
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      };
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
                <!-- <Toast /> -->
                <div class="grid">
                    <div class="col-12">
                        <h5 class="mr-2 mt-1 mmd:mb-0">Detail Data</h5>
                    </div>
                    <div class="col-2">
                        <ul class="list-none p-0 m-0">
                            <li class="mb-4">
                                <div>
                                    <Button label="Filter" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Nama Karyawan</span>
                                    <div class="mt-1 text-600">Abdul Rouf</div>
                                </div>
                                <!-- <div class="mt-2 md:mt-0 flex align-items-center">
                                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                        <div class="bg-orange-500 h-full" style="width: 50%"></div>
                                    </div>
                                    <span class="text-orange-500 ml-3 font-medium">%50</span>
                                </div> -->
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Jumlah Ambil Cuti</span>
                                    <div class="mt-1 text-600">1</div>
                                </div>
                                <!-- <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                        <div class="bg-cyan-500 h-full" style="width: 16%"></div>
                                    </div>
                                    <span class="text-cyan-500 ml-3 font-medium">%16</span>
                                </div> -->
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Jumlah Sakit</span>
                                    <div class="mt-1 text-600">0</div>
                                </div>
                                <!-- <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                        <div class="bg-pink-500 h-full" style="width: 67%"></div>
                                    </div>
                                    <span class="text-pink-500 ml-3 font-medium">%67</span>
                                </div> -->
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Jumlah Dinas</span>
                                    <div class="mt-1 text-600">0</div>
                                </div>
                                <!-- <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                        <div class="bg-green-500 h-full" style="width: 35%"></div>
                                    </div>
                                    <span class="text-green-500 ml-3 font-medium">%35</span>
                                </div> -->
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Terlambat</span>
                                    <div class="mt-1 text-600">2</div>
                                </div>
                                <!-- <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                        <div class="bg-purple-500 h-full" style="width: 75%"></div>
                                    </div>
                                    <span class="text-purple-500 ml-3 font-medium">%75</span>
                                </div> -->
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Pulang Cepat</span>
                                    <div class="mt-1 text-600">1</div>
                                </div>
                                <!-- <div class="mt-2 md:mt-0 ml-0 md:ml-8 flex align-items-center">
                                    <div class="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style="height: 8px">
                                        <div class="bg-teal-500 h-full" style="width: 40%"></div>
                                    </div>
                                    <span class="text-teal-500 ml-3 font-medium">%40</span>
                                </div> -->
                            </li>
                        </ul>
                    </div>
                    <div class="col-10">
                        <FullCalendar
                            class="demo-app-calendar"
                            :options="calendarOptions"
                        >
                            <template v-slot:eventContent="arg">
                            <b>{{ arg.timeText }}</b>
                            <i>{{ arg.event.title }}</i>
                            </template>
                        </FullCalendar>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
