<script setup>
// import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, watch } from 'vue';
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'


import { useRouter, useRoute } from 'vue-router'
import AbsenService from '@/service/AbsenService';
import UserService from '@/service/UserService';
// import { color } from 'html2canvas/dist/types/css/types/color';

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Absen' }, { label: 'List' }]);

const fullCalendar = ref(null);
const calendarKey = ref(null);
const listDetail = ref({});
const Alpa = ref({});
const workToday = ref({});
const listUser = ref();

const today = new Date();

// Mendapatkan waktu dalam zona waktu Jakarta (Asia/Jakarta)
const options = {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Format 24 jam
};

const options1 = {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: undefined, // Do not include time
    minute: undefined,
    second: undefined,
    hour12: false // Format 24-hour clock, though it's not needed here since we're removing time
};

const formattedDate = today.toLocaleString('en-GB', options).replace(',', '').replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:$6');
const formattedOnlyDate = today.toLocaleString('en-GB', options1).replace(',', '').replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');

const absenService = new AbsenService();
const userService = new UserService();
const router = useRouter();
const route = useRoute();

const listDetailCutiTahunan = ref({});

const users = JSON.parse(localStorage.getItem('sipam'))

var arrEvent = []

onMounted(() => {
    var date = new Date();
    var currentDate = dateMonthYear(date);
    getListData(currentDate);
    // getListDetailCutiTahunan(currentDate);
    getListUser();
    getWorkToday();

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
        Alpa.value = data.alpa;
        fullCalendar.value.getApi().addEventSource(arrEvent);
        fullCalendar.value.getApi().render();
    });
};

const getWorkToday = () => {

    absenService.GetWorkToday().then((data) => {
        workToday.value = data.data;

    });
};

// const getListDetailCutiTahunan = (date) => {
//   const params = {
//     pin: route.params.id,
//     year: date,
//     type: 1
//   };

//   absenService.getDetailCuti(params)
//     .then((response) => {
//       listDetailCutiTahunan.value = response.detail;

//       if (ListCutiType.value.length > 0 && !selectedTypeCuti.value) {
//         selectedTypeCuti.value = ListCutiType.value[0].type;
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching leave balance data:", error);
//     });
// };

const getListUser = () => {
    var params = {
        pin: route.params.id
    }
    userService.getUserPin(params).then((data) => {
        listUser.value = data
    });
};

const handleEventClick = () => {
    // console.log("hello");
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
    var dateFormat = date.getFullYear() + "-" + (String((date.getMonth() + 1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
    return dateFormat;
}

const dateDayMonthYear = (dateString) => {
    var date = new Date(dateString);
    var dateFormat = date.getFullYear() + "-" + (String((date.getMonth() + 1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (String(date.getDate()).length != 2 ? "0" + date.getDate() : date.getDate());
    return dateFormat;
}


const parseEventData = (items, index) => {
    const eventDateIN = new Date(items.tanggal + ' ' + items.time_out);
    const eventDateOUT = new Date(items.tanggal + ' ' + '23:59:00');
    const adjustedEventDateOUT = new Date(eventDateOUT);
    const workEndDate = new Date(items.tanggal + ' ' + workToday.value.end_time);

    const today = new Date(formattedDate);

    if (listUser.value.join_date <= items.tanggal && (listUser.value.end_date >= items.tanggal || listUser.value.end_date == "")) {
        if (items.time_in === "null" && items.time_out === "null" && items.izin_desc !== "null") {
            arrEvent.push({
                title: items.izin_desc,
                start: items.tanggal,
                backgroundColor: (items.izin_desc === 'alpha') ? '#ff014c' : '#2cc7f5'
            });

        }

        if (items.libur_desc !== "null" && items.libur_desc.includes("Bersama")) {
            arrEvent.push({
                title: items.libur_desc,
                start: items.tanggal,
                backgroundColor: 'orange'
            });

        }

        if (items.libur_desc !== "null" && items.libur_desc.includes("Libur")) {
            arrEvent.push({
                title: items.libur_desc,
                start: items.tanggal,
                backgroundColor: 'red',
            });

            if (items.status_in !== "null") {
                arrEvent.push({
                    title: items.time_in + ' ' + "Masuk",
                    start: items.tanggal,
                    backgroundColor: '#93f342'
                });

                arrEvent.push({
                    title: (items.time_out || items.time_in) + ' ' + "Pulang",
                    start: items.tanggal,
                    backgroundColor: 'yellow'
                });
            }
        }

        if (items.libur_desc === "null" && items.izin_desc === "null" && items.time_in !== "null" && items.time_out !== "null") {

            arrEvent.push({
                title: (items.status_in === "Normal") ? items.time_in + ' ' + "Masuk" : items.time_in + ' ' + items.status_in,
                start: items.tanggal,
                backgroundColor: (items.status_in === 'Telat') ? '#ff014c' : '#93f342'
            });

            if (eventDateIN >= workEndDate || eventDateIN >= adjustedEventDateOUT || adjustedEventDateOUT < new Date(formattedDate)) {
                arrEvent.push({
                    title: (items.status_out === "Normal") ? items.time_out + ' ' + "Pulang" : items.time_out + ' ' + items.status_out,
                    start: items.tanggal,
                    backgroundColor: (items.status_out === 'Pulang Cepat') ? '#ff014c' : 'yellow'
                });
            }
        }

        if (items.libur_desc === "null" && items.izin_desc !== "null" && items.time_in !== "null" && items.time_out !== "null") {
            if (!items.izin_desc.includes('Lupa Finger IN')) {
                arrEvent.push({
                    title: (items.status_in === "Normal") ? items.time_in + ' ' + "Masuk" : items.time_in + ' ' + items.status_in,
                    start: items.tanggal,
                    backgroundColor: (items.status_in === 'Telat') ? '#ff014c' : '#93f342'
                });
            }


            if (!items.izin_desc.includes('Lupa Finger OUT')) {
                arrEvent.push({
                    title: (items.status_out === "Normal") ? items.time_out + ' ' + "Pulang" : items.time_out + ' ' + items.status_out,
                    start: items.tanggal,
                    backgroundColor: (items.status_out === 'Pulang Cepat') ? '#ff014c' : 'yellow'
                });
            }

            arrEvent.push({
                title: (items.time_izin !== "null") ? items.time_in : "" + ' ' + items.izin_desc,
                start: items.tanggal,
                backgroundColor: 'grey'
            });
        }
    }

    if (items.libur_desc !== "null" && items.libur_desc.includes("Weekend")) {
        arrEvent.push({
            title: items.libur_desc,
            start: items.tanggal,
            backgroundColor: '#E9517E',
        });

        if (items.status_in !== "null") {
            arrEvent.push({
                title: items.time_in + ' ' + "Masuk",
                start: items.tanggal,
                backgroundColor: '#93f342'
            });

            arrEvent.push({
                title: (items.status_out === "Normal") ? items.time_out + ' ' + "Pulang" : items.time_out + ' ' + items.status_out,
                start: items.tanggal,
                backgroundColor: (items.status_out === 'Pulang Cepat') ? '#ff014c' : 'yellow'
            });
        }
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
            click: function () {
                removeEvent();
                fullCalendar.value.getApi().prev();
                let currentDate = dateMonthYear(fullCalendar.value.getApi().currentData.currentDate);
                getListData(currentDate);
                // getListDetailCutiTahunan(currentDate);
                getListUser();
            }
        },
        customNext: {
            text: 'custom!',
            icon: 'chevron-right',
            click: function () {
                removeEvent();
                fullCalendar.value.getApi().next();
                let currentDate = dateMonthYear(fullCalendar.value.getApi().currentData.currentDate);
                getListData(currentDate);
                // getListDetailCutiTahunan(currentDate);
                getListUser();
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
                            <li
                                class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Nama Karyawan</span>
                                    <div class="mt-1 text-600">{{ listDetail.username }}</div>
                                </div>
                            </li>
                            <li
                                class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Jumlah Ambil Cuti</span>
                                    <div class="mt-1 text-600">{{ listDetail.cuti_tahunan }}</div>
                                </div>
                            </li>
                            <li
                                class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Jumlah Sakit</span>
                                    <div class="mt-1 text-600">{{ listDetail.sakit }}</div>
                                </div>
                            </li>
                            <li
                                class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Jumlah Dinas</span>
                                    <div class="mt-1 text-600">{{ listDetail.dinas }}</div>
                                </div>
                            </li>
                            <li
                                class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Terlambat</span>
                                    <div class="mt-1 text-600">{{ listDetail.telat }}</div>
                                </div>
                            </li>
                            <li
                                class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Alpa</span>
                                    <div class="mt-1 text-600">{{ Alpa.alpha_count }}</div>
                                </div>
                            </li>
                            <li
                                class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Pulang Cepat</span>
                                    <div class="mt-1 text-600">{{ listDetail.bolos }}</div>
                                </div>
                            </li>
                            <!-- <li
                                class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Potong Cuti Sistem</span>
                                    <div class="mt-1 text-600">{{ listDetail.cuti_sistem }}</div>
                                </div>
                            </li>
                            <li
                                class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Cuti Tahun Lalu</span>
                                    <div class="mt-1 text-600">{{ listDetail.last_cuti }}</div>
                                </div>
                            </li>
                            <li
                                class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Cuti Tahun Berjalan</span>
                                    <div class="mt-1 text-600">{{ listDetail.total_cuti }}</div>
                                </div>
                            </li>
                            <li
                                class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span class="text-900 font-medium mr-2 mb-1 md:mb-0">Sisa Cuti</span>
                                    <div class="mt-1 text-600">{{ listDetail.sisa_cuti }}</div>
                                </div>
                            </li> -->
                        </ul>
                    </div>
                    <div class="card flex-1">
                        <FullCalendar ref="fullCalendar" class="demo-app-calendar" :options="calendarOptions">
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

<script>
export default {
    data() {
        return {
            today: new Date().toLocaleDateString(), // Get today's date in a readable format
        };
    },
};
</script>