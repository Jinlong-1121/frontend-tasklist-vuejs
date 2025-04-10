<script setup>
import { ScheduleXCalendar } from '@schedule-x/vue';
import {
    createCalendar,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, shallowRef, watchEffect } from 'vue';
import { calendars } from "./calendars.ts";
import BookingRoom from '@/service/BookingRoom';

const toast = useToast();
const events = ref([]);
const bookingList = ref([]);

const bookingRoom = new BookingRoom();

const today = new Date().toISOString().split('T')[0];

const getCalender = () => {
    bookingRoom.getCalender().then((data) => {
        bookingList.value = data;
    });
};

// Computed property untuk menghasilkan event dari bookingList
watchEffect(() => {
    if (bookingList.value.length > 0) {
        events.value = bookingList.value.map(booking => ({
            id: booking.id,
            title: booking.title,
            start: booking.start,
            end: booking.end,
            location: booking.location,
            people: JSON.parse(booking.people.replace(/'/g, '"')) || [], // Mengonversi string JSON menjadi array
        }));
    } else {
        events.value = []; // Reset events jika bookingList kosong
    }
});

// Membuat calendarApp menggunakan shallowRef
const calendarApp = shallowRef(null);
watchEffect(() => {
    if (events.value.length > 0) {
        calendarApp.value = createCalendar({
            selectedDate: today,
            locale: 'id-ID',
            views: [
                createViewMonthGrid(),
                createViewWeek(),
                createViewMonthAgenda(),
            ],
            calendars: calendars,
            events: events.value, // Menggunakan events.value di sini
            monthGridOptions: {
                nEventsPerDay: 3,
            },
        });
    } else {
        calendarApp.value = null; // Reset jika tidak ada events
    }
});

onMounted(() => {
    getCalender();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="">
                <Toast />
                <div v-if="calendarApp"> <!-- Hanya tampilkan jika calendarApp tidak null -->
                    <ScheduleXCalendar :calendar-app="calendarApp" />
                </div>
            </div>
        </div>
    </div>
</template>


<style>
.sx-vue-calendar-wrapper {
    height: 60vh;
    max-height: 100vh;
}

.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}

.sx__view-container {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

:root {
    --sx-color-primary: #5c4708;
    --sx-color-on-primary: #fff;
    --sx-color-primary-container: #ffc107;
    --sx-color-on-primary-container: #21005e;
    --sx-color-secondary: #625b71;
    --sx-color-on-secondary: #fff;
    --sx-color-secondary-container: #e8def8;
    --sx-color-on-secondary-container: #1e192b;
    --sx-color-tertiary: #7d5260;
    --sx-color-on-tertiary: #fff;
    --sx-color-tertiary-container: #ffd8e4;
    --sx-color-on-tertiary-container: #370b1e;
    --sx-color-surface: #fef7ff;
    --sx-color-surface-dim: #ded8e1;
    --sx-color-surface-bright: #fef7ff;
    --sx-color-on-surface: #1c1b1f;
    --sx-color-surface-container: #f3edf7;
    --sx-color-surface-container-low: #f7f2fa;
    --sx-color-surface-container-high: #ece6f0;
    --sx-color-background: #fff;
    --sx-color-on-background: #1c1b1f;
    --sx-color-outline: #79747e;
    --sx-color-outline-variant: #c4c7c5;
    --sx-color-shadow: #000;
    --sx-color-surface-tint: #000000;
    --sx-color-neutral: var(--sx-color-outline);
    --sx-color-neutral-variant: var(--sx-color-outline-variant);

    --sx-internal-color-gray-ripple-background: #e0e0e0;
    --sx-internal-color-light-gray: #fafafa;
    --sx-internal-color-text: #000;
}
</style>