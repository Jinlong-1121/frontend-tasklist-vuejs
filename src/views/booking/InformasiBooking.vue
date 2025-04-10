<script setup>
import '@schedule-x/theme-default/dist/index.css'
import { useToast } from 'primevue/usetoast';
import { computed, inject, onMounted, ref, watch } from 'vue';
import BookingRoom from '@/service/BookingRoom';

const toast = useToast();
const swal = inject('$swal')
const bookingRoom = new BookingRoom();

const dataItemUser = JSON.parse(localStorage.getItem("sipam"))

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

const bookingList = ref([]);

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

const getListData = () => {
    var params = {
        user_id: dataItemUser.target,
    }
    bookingRoom.getList(params).then((data) => {
        bookingList.value = data;
    });
};

const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Format tanggal
    const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('id-ID', dateOptions).replace(/Feb/i, 'Feb');

    // Format waktu
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const formattedTime = date.toLocaleTimeString('id-ID', timeOptions);

    // Gabungkan hasil format tanggal dan waktu
    return `${formattedDate} ${formattedTime}`;
};

const formatDate2 = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// const openNew = () => {
//     booking.value = {};
//     submitted.value = false;
//     bookingDialog.value = true;
//     visible.value = true;
//     edited.value = false;

//     getListTimes();
//     getListHours();
// };

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
        getListData(1);
    }).catch((error) => {
        // console.log("error", error)
        if (res.code === 409) {
            // Conflict: 409 (room already booked)
            swalWithBootstrapButtons.fire(
                'Error!',
                error.message || 'The room is already booked by another user.',
                'error'
            );
        }
        getListData(1);

    });
};

const updateBookingRoom = (params, id) => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    return bookingRoom.updateBookingRoom(params, id).then((res) => {
        // Handle response status codes
        if (res.code === 200) {
            // Success: 200
            swalWithBootstrapButtons.fire(
                'Success!',
                'Data Booking updated',
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
        getListData(1);
    }).catch((error) => {
        // console.log("error", error)
        if (res.code === 409) {
            // Conflict: 409 (room already booked)
            swalWithBootstrapButtons.fire(
                'Error!',
                error.message || 'The room is already booked by another user.',
                'error'
            );
        }
        getListData(1);

    });

};

const editBooking = (prod) => {
    booking.value = { ...prod };
    selectedTimesStart.value = booking.value.id_time_start;
    selectedHour.value = booking.value.id_hour;
    bookingDialog.value = true;
    edited.value = true;

    getListTimes();
    getListHours();
};


const deleteBookingRoom = (data) => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Delete Meeting Room!',
        text: `Anda yakin ingin Meeting Room ${data.title}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true, // This enables the loader on the confirm button
        preConfirm: () => {
            const param = data.id;

            // Return the promise to SweetAlert2 so it knows when to stop the loader
            return bookingRoom.deleteBookingRoom(param)
                .then((res) => {
                    getListData();
                    swal.fire({
                        icon: 'success',
                        title: 'Surat!',
                        text: `Meeting Room ${data.title} berhasil dihapus.`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                })
                .catch((error) => {
                    // Handle errors here, e.g., show an error message
                    swalWithBootstrapButtons.fire(
                        'Error!',
                        'Terjadi kesalahan saat menghapus meeting room.',
                        'error'
                    );
                    console.error(error);
                });
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            // You can perform additional actions here if needed
        }
    });
};

const saveData = () => {
    submitted.value = true;

    // if (booking.value.title.trim() && booking.value.date_start && booking.value.date_end && booking.value.id_time_start && booking.value.id_time_end) {
    if (booking.value.title.trim() && booking.value.date_start && booking.value.id_time_start && booking.value.id_hour) {

        booking.value.date_start = formatDate2(booking.value.date_start);
        booking.value.id_time_start = parseInt(selectedTimesStart.value);
        // booking.value.date_end = formatDate2(booking.value.date_end);
        // booking.value.id_time_end = parseInt(selectedTimesEnd.value);
        booking.value.id_time_end = 0;
        booking.value.id_hour = parseInt(selectedHour.value)

        booking.value.user_id = dataItemUser.target;
        booking.value.location = "PAM - Meeting Room";

        if (typeof booking.value.id === "undefined") {
            saveBookingRoom(booking.value)
        } else {
            updateBookingRoom(booking.value, booking.value.id)
        }
        bookingDialog.value = false;
        booking.value = {};
    }
};

const totalHours = computed(() => {
    // Calculate the total hours based on the selected `id_hour` or any other field as necessary
    return booking.value.id_hour ? `${booking.value.id_hour} hours` : '';
});

onMounted(() => {
    getListData();
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
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="">
                <Toast />
                <div>
                    <DataTable :value="bookingList" paginator :rows="15" :rowsPerPageOptions="[15, 20, 50, 80, 100]">
                        <template #empty>
                            <div class="text-center p-2">
                                <p class="text-lg font-semibold">No Data Available</p>
                            </div>
                        </template>

                        <!-- tableStyle="min-width: 50rem" -->
                        <Column field="no" header="No" :sortable="false">
                            <template #body="slotProps">
                                {{ bookingList.indexOf(slotProps.data) + 1 }} <!-- Use indexOf to find the position -->
                            </template>
                        </Column>
                        <Column field="title" header="Title" :sortable="false" headerStyle="width=4% min-width:10rem;">
                            <template #body="slotProps">
                                {{ slotProps.data.title }}
                            </template>
                        </Column>

                        <Column v-if="dataItemUser.divisi === 1" field="people" header="People" :sortable="false"
                            headerStyle="width=4% min-width:10rem;">
                            <template #body="slotProps">
                                {{ slotProps.data.people.replace(/\['|'\]|\[' '\]/g, '') }}
                            </template>
                        </Column>

                        <Column field="date" header="Tanggal" :sortable="false" headerStyle="width=4% min-width:10rem;">
                            <template #body="slotProps">
                                {{ formatDate(slotProps.data.start) }} - {{ formatDate(slotProps.data.end) }}
                            </template>
                        </Column>
                        <Column field="action" header="Aksi" :sortable="false" headerStyle="width=4% min-width:10rem;">
                            <template #body="slotProps">
                                <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                                    @click="editBooking(slotProps.data)" />
                                <Button icon="pi pi-trash" outlined rounded severity="danger"
                                    @click="deleteBookingRoom(slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <Dialog v-model:visible="bookingDialog" :style="{ width: '990px' }" header="Meeting Room" :modal="true"
                class="p-fluid">
                <template #empty>
                    <div class="text-center p-2">
                        <p class="text-lg font-semibold">No Data Available</p>
                    </div>
                </template>
                <!-- <span class="p-text-secondary block mb-5">Meeting Room</span> -->
                <div class="field">
                    <label for="title">Title</label>
                    <InputText id="title" v-model.trim="booking.title" required="true" autofocus
                        :class="{ 'p-invalid': submitted && !booking.title }" />
                    <small class="p-error" v-if="submitted && !booking.title">Title is required.</small>
                </div>

                <div class="field">
                    <label for="date_start">Start Date</label>
                    <Calendar v-model="booking.date_start" dateFormat="yy-mm-dd"
                        :class="{ 'p-invalid': submitted && !booking.date_start }" />
                    <small class="p-error" v-if="submitted && !booking.date_start">Start Date is required.</small>
                </div>

                <div class="field">
                    <label for="id_time_start">Start Time</label>
                    <Dropdown v-model="booking.id_time_start" :options="timeStart" optionLabel="time"
                        @change="setTimeStart($event)" optionValue="id" required="true" autofocus
                        placeholder="Select a Time" :class="{ 'p-invalid': submitted && !booking.id_time_start }" />
                    <small class="p-error" v-if="submitted && !booking.id_time_start">Start Time is required.</small>
                </div>

                <div class="field">
                    <label for="id_hour">Hours</label>
                    <Dropdown v-model="booking.id_hour" :options="timeHour" optionLabel="hour" optionValue="id"
                        required="true" autofocus placeholder="Select a Time" @change="setHour($event)"
                        :class="{ 'p-invalid': submitted && !booking.id_hour }" />
                    <small class="p-error" v-if="submitted && !booking.id_hour">Hours is required.</small>
                </div>

                <div class="field font-bold" v-if="booking.id_time_start && booking.id_hour">
                    Sampai: {{ endTimeAndDuration }}
                </div>

                <!-- <div class="field">
                    <label for="date_end">End Date</label>
                    <Calendar v-model="booking.date_end" dateFormat="yy-mm-dd"
                        :class="{ 'p-invalid': submitted && !booking.date_end }" />
                    <small class="p-error" v-if="submitted && !booking.date_end">End Date is required.</small>
                </div>

                <div class="field">
                    <label for="id_time_end">End Time</label>
                    <Dropdown v-model="booking.id_time_end" :options="timeEnd" optionLabel="time"
                        @change="setTimeEnd($event)" optionValue="id" placeholder="Select a Time" required="true"
                        autofocus :class="{ 'p-invalid': submitted && !booking.id_time_end }" />
                    <small class="p-error" v-if="submitted && !booking.id_time_end">End Time is required.</small>
                </div> -->

                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                    <Button label="Save" icon="pi pi-check" text @click="saveData" />
                </template>
            </Dialog>
        </div>
    </div>
</template>
