<script setup>
// import { FilterMatchMode } from 'primevue/api';
import { ref } from 'vue';
// import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router'
// import SuratService from '@/service/SuratService';
// import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

// const toast = useToast();
// const { contextPath } = useLayout();
const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Webinar' }, { label: 'List' }]);

// const SuratData = ref(null);
// const Rows = ref(null);

// const dt = ref(null);
// const filterMonth = ref();
// const filters = ref({});
// const first = ref(0)

// const suratService = new SuratService();

// onBeforeMount(() => {
//     initFilters();
// });
// onMounted(() => {
//     var page = (first.value/10)+1;
//     var date = new Date();
//     var currentDate = dateMonthYear(date);
//     filterMonth.value = date;
//     getListData(page,currentDate);
// });

// const getListData = (page, date) => {
//     var params = {
//         page: page,
//         year: date
//     }
//     // suratService.getList(params).then((data) => {
//     suratService.getList().then((data) => {
//         SuratData.value = data;
//         // Rows.value = data.total_rows;
//     });
// };

// const accessData = () => {
//     var page = (first.value/10)+1;
//     var selectedDate = dateMonthYear(filterMonth.value);
//     getListData(page, selectedDate)
// };

// const dateMonthYear = (dateString) => {
//     var date = new Date(dateString);
//     var dateFormat = date.getFullYear() + "-" +(String((date.getMonth()+1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1));
//     return dateFormat;
// }

// const initFilters = () => {
//     filters.value = {
//         global: { value: null, matchMode: FilterMatchMode.CONTAINS }
//     };
// };

const nestedRouteItems = ref([
    {
        label: 'Event Webinar',
        to: '/webinar/list'
    },
    {
        label: 'Past Webinar',
        to: '/webinar/list/past-webinar'
    }
]);

const createNew = () => {
    router.push('/surat/external/create');
}

// const columns = [
//     // { field: 'document_no', header: 'No Surat' },
//     { field: 'perihal', header: 'Perihal' },
//     { field: 'sender_name', header: 'Pengirim' },
//     { field: 'receiver_name', header: 'Penerima' },
//     { field: 'status', header: 'Status' },
// ];
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card card-w-title">
                <h3>Surat External</h3>
                <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />
                <!-- <Toolbar class="mb-4">
                    <template v-slot:start> -->
                        <!-- <div class="my-2">
                                <Calendar inputId="inputMont" v-model="filterMonth" view="month" dateFormat="MM yy" @date-select="filterMonthEvent"/>
                        </div> -->
                        <!-- <Button icon="pi pi-plus" label="Surat Baru" @click="createNew" class="mr-2 mb-2" /> -->
                    <!-- </template>
                </Toolbar> -->
                <!-- <Toolbar class="mb-4">
                    <template v-slot:start> -->
                        <TabMenu :model="nestedRouteItems" class="button-tabSurat"/>
                    <!-- </template>
                </Toolbar> -->
                <router-view />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';

</style>

<style lang="scss">
.button-tabSurat {
    ul {
        li {
            a:focus {
                box-shadow: none !important;
            }
        }
    }
}
</style>