<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount, computed, watch, inject } from 'vue';
import KpiService from '@/service/KpiService';

import { useToast } from 'primevue/usetoast';

const toast = useToast();

const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Data Template KPI' }, { label: 'List' }]);

// DECLARE SERVICE
const kpiService = new KpiService();

const titleTemplateDialog = ref(false);
const titleTemplate = ref({});

const submitted = ref(false);

// Title Template
const saveListDataTitleTemplate = (params) => {
    kpiService.postCreateTemplateName(params).then((data) => {
        // getListData(1);
    });
};

const openTitleTemplateNew = () => {
    titleTemplate.value = {};
    submitted.value = false;
    titleTemplateDialog.value = true;
};

const hideTitleTemplateDialog = () => {
    titleTemplateDialog.value = false;
    submitted.value = false;
};

const saveTitleTemplate = () => {
    submitted.value = true;
    if (titleTemplate.value.template_name.trim()) {

        if (typeof (titleTemplate.value.id) === "undefined") {
            titleTemplate.value.created_by = ""
            saveListDataTitleTemplate(titleTemplate.value)
        } else {

        }
    }
}


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
                            <Button label="New Title Template" icon="pi pi-plus" class="p-button-success mr-2"
                                @click="openTitleTemplateNew" />
                            <Button label="New Template" icon="pi pi-plus" class="p-button-success mr-2"
                                @click="openTitleTemplateNew" />
                        </div>
                    </template>

                </Toolbar>

            </div>


        </div>
    </div>

    <Dialog v-model:visible="titleTemplateDialog" :style="{ width: '450px' }" header="Title Template" :modal="true"
        class="p-fluid">

        <div class="field">
            <label for="template_name">Nama Title Template</label>
            <InputText v-model.trim="titleTemplate.template_name" required="true" autofocus />
        </div>

        <div class="field">
            <label for="group_name">Nama Group Name</label>
            <InputText v-model.trim="titleTemplate.group_name" required="true" autofocus />
        </div>


        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="hideTitleTemplateDialog" />
            <Button label="Save" icon="pi pi-check" text @click="saveTitleTemplate" />
        </template>
    </Dialog>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';

::v-deep(.p-icon) {
    right: 14 !important;
}
</style>