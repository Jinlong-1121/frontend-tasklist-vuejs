<script setup>
import { onMounted, onUpdated, provide, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Absen', to: '/cuti/informasi' }, { label: 'List', to: '/surat-internal/list' }]);

const childComponentRef = ref(null);



const nestedRouteItems = ref([
    {
        label: 'Leave Adjustment',
        to: '/cuti/informasi'
    },
    {
        label: 'Leave Balances',
        to: '/cuti/informasi/leave-balances'
    },

]);

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card card-w-title">
                <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />

                <TabMenu :model="nestedRouteItems" class="button-tabSurat" />
                <router-view ref="childComponentRef" />
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
            position: relative;
            a:focus {
                box-shadow: none !important;
            }
        }
    }
}




</style>