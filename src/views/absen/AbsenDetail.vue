<script setup>
// import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'


import { useRouter, useRoute } from 'vue-router'
import AbsenService from '@/service/AbsenService';
// import { color } from 'html2canvas/dist/types/css/types/color';

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Absen' }, { label: 'List' }]);

const fullCalendar = ref(null);
const calendarKey = ref(null);
const listDetail = ref({});

const absenService = new AbsenService();
const router = useRouter();
const route = useRoute();

var arrEvent = []

onMounted(() => {
    var date = new Date();
    var currentDate = dateMonthYear(date);
    getListData(currentDate);
});

// let calendarApi = fullCalendar.value.getApi()

const getListData = (date) => {
    var params = {
        pin: route.params.id,
        month: date
    }

    absenService.getDetail(params).then((data) => {
        arrEvent = [];
        data.list.forEach(parseEventData);
        calendarOptions.events = arrEvent;
        calendarKey.value = date;
        listDetail.value = data.detail;
        fullCalendar.value.getApi().addEventSource(arrEvent);
        fullCalendar.value.getApi().render();
    });
};

const handleEventClick = () => {
    console.log("hello");
}

const handleBack = () => {
    router.push('/absen/list');
}

const removeEvent = () => {
    let eventSources = fullCalendar.value.getApi().getEventSources(); 
    let len = eventSources.length;
    for (let i = 0; i < len; i++) { 
        eventSources[i].remove(); 
    } 
}

const dateMonthYear = (dateString) => {
    var date = new Date(dateString);
    var dateFormat = date.getFullYear() + "-" +(String((date.getMonth()+1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1));
    return dateFormat;
}

const dateDayMonthYear = (dateString) => {
    var date = new Date(dateString);
    var dateFormat = date.getFullYear() + "-" +(String((date.getMonth()+1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1)) + "-" +(String(date.getDate()).length != 2 ? "0" + date.getDate() : date.getDate());
    return dateFormat;
}

const parseEventData = (items, index) => {

    if (items.time_in === "null" && items.time_out === "null" && items.izin_desc !== "null") {
        arrEvent.push({
            title : items.izin_desc,
            start : items.tanggal,
            backgroundColor : (items.izin_desc === 'alpha') ? '#ff014c' : '#2cc7f5'
        });
    }

    console.log("libur_desc", items.libur_desc)

    if (items.libur_desc !== "null" &&  items.libur_desc.includes("Bersama")) {
        arrEvent.push({
            title : items.libur_desc,
            start : items.tanggal,
            backgroundColor : 'orange'
        });

    }

    if (items.libur_desc !== "null" && items.libur_desc.includes("Libur")) {
        arrEvent.push({
            title : items.libur_desc,
            start : items.tanggal,
            backgroundColor : 'red',
        });
    }

    if (items.libur_desc !== "null" && items.libur_desc.includes("Weekend")) {
        arrEvent.push({
            title : items.libur_desc,
            start : items.tanggal,
            backgroundColor : '#E9517E',
        });
    }
    

    if (items.libur_desc === "null" && items.izin_desc === "null" && items.time_in !== "null" && items.time_out !== "null") {
        
        arrEvent.push({
            title : ( items.status_in==="Normal") ? items.time_in+' '+"Masuk" : items.time_in+' '+items.status_in,
            start : items.tanggal,
            backgroundColor : (items.status_in === 'Telat') ? '#ff014c' : '#93f342'
        });

        arrEvent.push({
            title : ( items.status_out==="Normal") ? items.time_out+' '+"Pulang" : items.time_out+' '+items.status_out,
            start : items.tanggal,
            backgroundColor : (items.status_out === 'Pulang Cepat') ? '#ff014c' : 'yellow'
        });
    }

    if (items.libur_desc === "null" && items.izin_desc !== "null" && items.time_in !== "null" && items.time_out !== "null") {
        arrEvent.push({
            title : ( items.status_in==="Normal") ? items.time_in+' '+"Masuk" : items.time_in+' '+items.status_in,
            start : items.tanggal,
            backgroundColor : (items.status_in === 'Telat') ? '#ff014c' : '#93f342'
        });

        arrEvent.push({
            title : ( items.status_out==="Normal") ? items.time_in+' '+"Pulang" : items.time_in+' '+items.status_out,
            start : items.tanggal,
            backgroundColor : (items.status_out === 'Pulang Cepat') ? '#ff014c' : 'yellow'
        });

        arrEvent.push({
            title : ( items.time_izin!=="null") ? items.time_in : ""+' '+items.izin_desc,
            start : items.tanggal,
            backgroundColor : 'grey'
        });
    }
}

// const handleEvents = (events) => {
//       currentEvents = events
//     }

const calendarOptions = {
        plugins: [
          dayGridPlugin,
          // timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        customButtons: {
            customPrev: {
                text: 'custom!',
                icon: 'chevron-left',
                click: function() {
                    removeEvent();
                    fullCalendar.value.getApi().prev();
                    let currentDate = dateMonthYear(fullCalendar.value.getApi().currentData.currentDate);
                    getListData(currentDate);
                }
            },
            customNext: {
                text: 'custom!',
                icon: 'chevron-right',
                click: function() {
                    removeEvent();
                    fullCalendar.value.getApi().next();
                    let currentDate = dateMonthYear(fullCalendar.value.getApi().currentData.currentDate);
                    getListData(currentDate);
                }
            },
        },
        headerToolbar: {
          left: 'customPrev,customNext',
          center: 'title',
          right: ''
        },
        initialView: 'dayGridMonth',
        // initialEvents: arrEvent, // alternatively, use the `events` setting to fetch from a feed
        events: arrEvent,
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
                <Breadcrumb class="border-0 bg-transparent pl-2" :home="breadcrumbHome" :model="breadcrumbItems" />
            <div class="card card-w-title bg-transparent border-0 px-0 pt-3">
                <div class="flex flex-column md:flex-row gap-5">
                    <div class="card mb-0 md:w-20rem">
                        <ul class="list-none p-0 m-0">
                            <li class="mb-4">
                                <div>
                                    <Button label="Kembali" class="p-button-success mr-2 w-full" @click="handleBack" />
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Nama Karyawan</span>
                                    <div class="mt-1 text-600">{{ listDetail.username }}</div>
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Jumlah Ambil Cuti</span>
                                    <div class="mt-1 text-600">{{ listDetail.cuti_tahunan }}</div>
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Jumlah Sakit</span>
                                    <div class="mt-1 text-600">{{ listDetail.sakit }}</div>
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Jumlah Dinas</span>
                                    <div class="mt-1 text-600">{{ listDetail.dinas }}</div>
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Terlambat</span>
                                    <div class="mt-1 text-600">{{ listDetail.telat }}</div>
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Pulang Cepat</span>
                                    <div class="mt-1 text-600">{{ listDetail.bolos }}</div>
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Potong Cuti Sistem</span>
                                    <div class="mt-1 text-600">{{ listDetail.cuti_sistem }}</div>
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Cuti Tahun Lalu</span>
                                    <div class="mt-1 text-600">{{ listDetail.last_cuti }}</div>
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Cuti Tahun Berjalan</span>
                                    <div class="mt-1 text-600">{{ listDetail.total_cuti }}</div>
                                </div>
                            </li>
                            <li class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Sisa Cuti</span>
                                    <div class="mt-1 text-600">{{ listDetail.sisa_cuti }}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="card flex-1">
                        <FullCalendar
                            ref="fullCalendar"
                            class="demo-app-calendar"
                            :options="calendarOptions"
                        >
                            <template v-slot:eventContent="arg">
                                <div class="p-1">
                                    <b>{{ arg.timeText }}</b>
                                    <i class="text-overflow-ellipsis white-space-normal">{{ arg.event.title }}</i>
                                </div>
                            </template>
                        </FullCalendar>
                        <!-- <FullCalendar
                            ref="fullCalendar"
                            :key="calendarKey"
                            class="demo-app-calendar"
                            :options="calendarOptions"
                        >
                            <template v-slot:eventContent="arg">
                            <b>{{ arg.timeText }}</b>
                            <i>{{ arg.event.title }}</i>
                            </template>
                        </FullCalendar> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
