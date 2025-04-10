<script setup>
import { computed, inject, onMounted, onUpdated, provide, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Booking Room', to: '/booking/list' }, { label: 'List', to: '/booking/list' }]);

const childComponentRef = ref(null);

const dataItemUser = JSON.parse(localStorage.getItem("sipam"))

import BookingRoom from '@/service/BookingRoom';
const swal = inject('$swal')
const bookingRoom = new BookingRoom();

const bookingDialog = ref(false);
const visible = ref(false);
const submitted = ref(false);
const edited = ref(false);

const booking = ref({});

const selectedTimesStart = ref(null);
const selectedTimesEnd = ref(null);
const timeStart = ref([]);
const timeEnd = ref([]);

const selectedHour = ref(null);
const timeHour = ref([]);

const selectedMenu = ref(null);
const menu = ref([
    { "id": 3, "menu": "Sekali" },
    { "id": 1, "menu": "Harian" },
    { "id": 2, "menu": "Mingguan" }
]);

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

const formatDate2 = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const openNew = () => {
    booking.value = {};
    submitted.value = false;
    bookingDialog.value = true;
    visible.value = true;
    edited.value = false;

    getListTimes();
    getListHours();
};

const hideDialog = () => {
    bookingDialog.value = false;
    submitted.value = false;
};

const getListTimes = () => {

    bookingRoom.getTimes().then((data) => {
        timeStart.value = data;
        timeEnd.value = data;
    });
};

const getListHours = () => {

    bookingRoom.getHours().then((data) => {
        timeHour.value = data;
    });
};

const setTimeStart = (event) => {
    selectedTimesStart.value = event.value;
};

const setMenu = (data) => {
    selectedMenu.value = data.value;
};

const setTimeEnd = (event) => {
    selectedTimesEnd.value = event.value;
};

const setHour = (event) => {
    selectedHour.value = event.value;
};

const saveBookingRoom = (params) => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    return bookingRoom.saveBookingRoom(params).then((res) => {
        // Handle response status codes
        if (res.code === 200) {
            // Success: 200
            swalWithBootstrapButtons.fire(
                'Success!',
                'New data Meeting Room saved',
                'success'
            );
        } else if (res.code === 409) {
            // Conflict: 409 (room already booked)
            swalWithBootstrapButtons.fire(
                'Error!',
                res.message || 'The room is already booked by another user.',
                'error'
            );
        } else {
            // Handle other response codes (unexpected)
            swalWithBootstrapButtons.fire(
                'Error!',
                res.message || 'An unknown error occurred.',
                'error'
            );
        }

        // Refresh the list of data after saving
    }).catch((error) => {
        // console.log("error", error)
        swalWithBootstrapButtons.fire(
                'Error!',
                'The room is already booked by another user.',
                'error'
            );

    });
};

const saveData = () => {
    submitted.value = true;

    // Validasi input dengan pengecualian untuk count_month_day jika menu === 3
    if (
        booking.value.title.trim() && 
        booking.value.menu && 
        (booking.value.menu === 3 || booking.value.count_month_day) && 
        booking.value.date_start && 
        booking.value.id_time_start && 
        booking.value.id_hour
    ) {
        booking.value.date_start = formatDate2(booking.value.date_start);
        booking.value.id_time_start = parseInt(selectedTimesStart.value);
        booking.value.id_hour = parseInt(selectedHour.value);
        booking.value.menu = parseInt(selectedMenu.value);
        booking.value.id_time_end = 0; // Menyesuaikan end time jika diperlukan

        // Jika selectedMenu adalah 3, set count_month_day ke 1
        if (booking.value.menu === 3) {
            booking.value.count_month_day = 1;
        }

        booking.value.user_id = dataItemUser.target;
        booking.value.location = "PAM - Meeting Room";

        if (typeof booking.value.id === "undefined") {
            saveBookingRoom(booking.value);
        }
        bookingDialog.value = false;
        booking.value = {};
    }
};


const totalHours = computed(() => {
    // Calculate the total hours based on the selected `id_hour` or any other field as necessary
    return booking.value.id_hour ? `${booking.value.id_hour} hours` : '';
});


// watch(() => booking.value.date_start, (newDate) => {
//     booking.value.date_end = newDate;
// });

// // Watch for changes to booking.value.id_time_start and set id_time_end to id_time_start + 1
// watch(() => booking.value.id_time_start, (newTimeId) => {
//     if (newTimeId !== null && newTimeId < timeEnd.value.length) { // Ensure there is a next time available
//         booking.value.id_time_end = newTimeId + 1;
//     } else {
//         booking.value.id_time_end = null; // Reset if there's no valid end time available
//     }
// });

const selectedStartTime = computed(() => {
    const selectedTime = timeStart.value.find(item => item.id === selectedTimesStart.value);
    return selectedTime ? selectedTime.time : '';
});

const selectedStartHour = computed(() => {
    const selectedTime = timeHour.value.find(item => item.id === selectedHour.value);
    return selectedTime ? selectedTime.duration : '';
});

const endTimeAndDuration = computed(() => {
    const startTime = selectedStartTime.value; // e.g., "10:00"
    const duration = selectedStartHour.value;  // e.g., 570 (minutes)
    const startDate = booking.value.date_start; // e.g., "2024-12-24"

    if (!startTime || !duration || !startDate) return '';

    // Parse start time (e.g., "10:00")
    const [startHour, startMinute] = startTime.split(':').map(Number);

    // Calculate total minutes from start time
    const startInMinutes = startHour * 60 + startMinute;

    // Add the duration in minutes
    const endInMinutes = startInMinutes + duration;

    // Calculate end time in hours and minutes
    const endHour = Math.floor(endInMinutes / 60);
    const endMinute = endInMinutes % 60;

    // Determine if the end time is on the next day
    const isNextDay = endHour >= 24;

    // Adjust end time for next day if necessary
    const adjustedEndHour = isNextDay ? endHour - 24 : endHour;
    const formattedEndTime = `${adjustedEndHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    // Adjust end date for next day if necessary
    const endDate = new Date(startDate);
    if (isNextDay) {
        endDate.setDate(endDate.getDate() + 1); // Increment to the next day
    }
    const formattedEndDate = setFormatDate(endDate);

    // Convert duration to hours and minutes
    const durationHours = Math.floor(duration / 60);
    const durationMinutes = duration % 60;
    let formattedDuration = '';

    if (durationHours > 0) {
        formattedDuration += `${durationHours} ${durationHours === 1 ? 'hour' : 'hours'}`;
    }
    if (durationMinutes > 0) {
        formattedDuration += `${durationHours > 0 ? ' ' : ''}${durationMinutes} ${durationMinutes === 1 ? 'minute' : 'minutes'}`;
    }

    // Combine both results
    return `${formattedEndDate} - ${formattedEndTime}, ${formattedDuration}`;
});

const nestedRouteItems = ref([
    {
        label: 'Calender',
        to: '/booking/list'
    },
    {
        label: 'Informasi Booking',
        to: '/booking/informasi'
    },

]);

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card card-w-title">
                <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />
                <Toolbar>
                    <template v-slot:start>
                        <div class="my-1">
                            <Button label="Booking Meeting Room" icon="pi pi-plus" class="p-button-success mr-2"
                                @click="openNew" />
                        </div>
                    </template>
                </Toolbar>

                <TabMenu :model="nestedRouteItems" class="button-tabSurat mb-1" />
                <router-view ref="childComponentRef" />
            </div>
        </div>
    </div>

    <Dialog v-model:visible="bookingDialog" :style="{ width: '990px' }" header="Meeting Room" :modal="true"
        class="p-fluid">
        <!-- Input Title -->
        <div class="field">
            <label for="title">Title</label>
            <InputText id="title" v-model.trim="booking.title" required
                :class="{ 'p-invalid': submitted && !booking.title }" />
            <small class="p-error" v-if="submitted && !booking.title">Title is required.</small>
        </div>

        <!-- Dropdown Menu -->
        <div class="field">
            <label for="title">Jenis Tanggal Booking</label>
            <Dropdown v-model="booking.menu" :options="menu" optionLabel="menu" optionValue="id" @change="setMenu"
                placeholder="Select a Menu" :class="{ 'p-invalid': submitted && !booking.menu }" />
            <small class="p-error" v-if="submitted && !booking.menu">Menu is required.</small>
        </div>

        <!-- Condition for showing count_month_day -->
        <div v-if="booking.menu && booking.menu !== 3">
            <div v-if="booking.menu === 1" class="field">
                <label for="count_month_day">Jumlah Hari</label>
                <InputNumber id="count_month_day" v-model="booking.count_month_day" :useGrouping="false"
                    :class="{ 'p-invalid': submitted && !booking.count_month_day && (booking.menu === 1 || booking.menu === 2) }" />
                <small class="p-error"
                    v-if="submitted && !booking.count_month_day && (booking.menu === 1 || booking.menu === 2)">Jumlah
                    Hari
                    is required.</small>

                    <div class="field font-bold">
                        Note: Berapa hari yang di booking
                    </div>
            </div>
            <div v-if="booking.menu === 2" class="field">
                <label for="count_month_day">Jumlah Mingguan</label>
                <InputNumber id="count_month_day" v-model="booking.count_month_day" :useGrouping="false"
                    :class="{ 'p-invalid': submitted && !booking.count_month_day && (booking.menu === 1 || booking.menu === 2) }" />
                <small class="p-error"
                    v-if="submitted && !booking.count_month_day && (booking.menu === 1 || booking.menu === 2)">Jumlah
                    Mingguan is required.</small>
                <div class="field font-bold">
                    Note: Setiap minggu pada hari yang sama.
                </div>
            </div>
        </div>


        <!-- Date and Time Selectors -->
        <div class="field">
            <label for="date_start">Start Date</label>
            <Calendar v-model="booking.date_start" dateFormat="yy-mm-dd"
                :class="{ 'p-invalid': submitted && !booking.date_start }" />
            <small class="p-error" v-if="submitted && !booking.date_start">Start Date is required.</small>
        </div>

        <div class="field">
            <label for="id_time_start">Start Time</label>
            <Dropdown v-model="booking.id_time_start" :options="timeStart" optionLabel="time" @change="setTimeStart"
                optionValue="id" required placeholder="Select a Time"
                :class="{ 'p-invalid': submitted && !booking.id_time_start }" />
            <small class="p-error" v-if="submitted && !booking.id_time_start">Start Time is required.</small>
        </div>

        <div class="field">
            <label for="id_hour">Hours</label>
            <Dropdown v-model="booking.id_hour" :options="timeHour" optionLabel="hour" optionValue="id" required
                placeholder="Select a Time" @change="setHour" :class="{ 'p-invalid': submitted && !booking.id_hour }" />
            <small class="p-error" v-if="submitted && !booking.id_hour">Hours is required.</small>
        </div>

        <!-- Display End Time and Duration -->
        <div class="field font-bold" v-if="booking.id_time_start && booking.id_hour && booking.date_start">
            Sampai: {{ endTimeAndDuration }}
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

<style lang="scss">
.button-tabSurat {
    ul {
        li {
            position: relative;

            a:focus {
                box-shadow: none !important;
            }
        }
    }
}
</style>