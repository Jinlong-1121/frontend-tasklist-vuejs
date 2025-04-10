<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import KpiService from '@/service/KpiService';
import { useToast } from 'primevue/usetoast';

// DECLARE SERVICE
const kpiService = new KpiService();

const toast = useToast();
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Data KPI' }, { label: 'List' }]);



</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card card-w-title">
                <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />
                <Toast />

                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New Title Template" icon="pi pi-plus" class="p-button-success mr-2"  />
                            <Button label="New Template" icon="pi pi-plus" class="p-button-success mr-2"  />
                        </div>
                    </template>
                    
                </Toolbar>
                
            </div>

           
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';

::v-deep(.p-icon) {
    right: 14 !important;
}
</style>