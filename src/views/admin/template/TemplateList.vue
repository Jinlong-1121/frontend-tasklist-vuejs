<script setup>
import { FilterMatchMode } from 'primevue/api';
import { inject, ref, onMounted, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import TemplateService from '@/service/TemplateService';
import DivisiService from '@/service/DivisiService';
import { useToast } from 'primevue/usetoast';
// import { useLayout } from '@/layout/composables/layout';

const swal = inject('$swal')

const toast = useToast();
// const { contextPath } = useLayout();
const router = useRouter()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Template' }, { label: 'List' }]);


const Templates = ref(null);
const Rows = ref(null);

const templateDialog = ref(false);
const deletetemplateDialog = ref(false);
// const deleteTemplatesDialog = ref(false);
const template = ref({});
// const selectedTemplates = ref(null);
const dt = ref(null);
const filterMonth = ref();
const filters = ref({});
const first = ref(0);
const email = ref("");
const submitted = ref(false);

const selectedStatus = ref({});
const statuses = ref([
    { label: 'Running', value: '1' },
    { label: 'Stop', value: '0' },
]);

const selectedDivisiFilter = ref(1);
const divisiList = ref([]);

const templateService = new TemplateService();
const divisiService = new DivisiService();

const loading = ref(false);
const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
}

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    var page = (first.value/10)+1;
    getListData(page);
    getListDivisi();
});

const openNew = () => {
    router.push('/admin/template/form');
    // template.value = {};
    // submitted.value = false;
    // templateDialog.value = true;
};

const hideDialog = () => {
    templateDialog.value = false;
    submitted.value = false;
};

const editTemplate = (prod) => {
    console.log(prod.id);
    router.push('/admin/template/form/'+prod.id);
    // template.value = {...prod};
    // selectedStatus.value = template.value.status;
    // templateDialog.value = true;
};

const saveTemplate = () => {
    submitted.value = true;
    if (template.value.name.trim()) {
        console.log(template.value.id, typeof(template.value.id));
        if (typeof(template.value.id) === "undefined") {
            template.value.status = '1';
            saveListData(template.value);
        } else {
            template.value.status = selectedStatus.value.value ? selectedStatus.value.value : template.value.status;
            updateListData(template.value, template.value.id);
        }
        templateDialog.value = false;
        template.value = {};
    }
};

const toDetail = (id) => {
    // router.push('/template/detail/'+id);
};

const actionCreate = () => {
    router.push('/admin/template/form');
};

const getListData = (page) => {
    var params = {
        page: page,
        divisi: selectedDivisiFilter.value !== undefined ? selectedDivisiFilter.value : ''
    }
    templateService.getList(params).then((data) => {
        Templates.value = data.rows;
        Rows.value = data.total_rows;
    });
};

const saveListData = (params) => {
    templateService.saveListData(params).then((data) => {
        console.log(data);
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'New data scheduler saved', life: 3000 });
    });
};

const updateListData = (params, id) => {
    console.log(params, id);
    templateService.updateListData(params, id).then((data) => {
        getListData(1);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Data scheduler updated', life: 3000 });
    });
};

const runScheduler = () => {
    templateService.runScheduler().then((data) => {
        console.log(data);
        // getListData(1);
    });
};

const accessData = () => {
    var page = (first.value/10)+1;
    getListData(page)
    // console.log(row);
};

const deleteTemplate = (editTemplate) => {
    template.value = editTemplate;
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Delete Template!',
        text: `Anda yakin ingin delete template ${template.value.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            templateService.deleteListData(template.value.id).then((data) => {
                getListData(1);
                // toast.add({ severity: 'success', summary: 'Successful', detail: 'Template Deleted', life: 3000 });
                // deletetemplateDialog.value = false;
                swal.fire({
                    icon: 'success',
                    title: 'Template!',
                    text: `Template ${template.value.name} berhasil dihapus.`,
                    showConfirmButton: false,
                    timer: 1500
                })
                template.value = {};
            });
        }
    })
    // console.log(id);
};

// const findIndexById = (id) => {
//     let index = -1;
//     for (let i = 0; i < Templates.value.length; i++) {
//         if (Templates.value[i].id === id) {
//             index = i;
//             break;
//         }
//     }
//     return index;
// };

// const createId = () => {
//     let id = '';
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (let i = 0; i < 5; i++) {
//         id += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return id;
// };

// const exportCSV = () => {
//     dt.value.exportCSV();
// };

const filterMonthEvent = () => {
    var page = (first.value/10)+1;
    getListData(page);
};

// const dateMonthYear = (dateString) => {
//     var date = new Date(dateString);
//     var dateFormat = date.getFullYear() + "-" +(String((date.getMonth()+1)).length != 2 ? "0" + (date.getMonth() + 1) : (date.getMonth()+1));
//     return dateFormat;
// }

// const confirmDeleteSelected = () => {
//     deleteTemplatesDialog.value = true;
// };
// const deleteSelectedTemplates = () => {
//     Templates.value = Templates.value.filter((val) => !selectedTemplates.value.includes(val));
//     deleteTemplatesDialog.value = false;
//     selectedTemplates.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Templates Deleted', life: 3000 });
// };
const getStatusLabel = (status) => {
    switch (status) {
        case '1':
            return 'success';

        case '2':
            return 'warning';

        case '0':
            return 'danger';

        default:
            return null;
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const getListDivisi = () => {
    divisiService.getListAll().then((data) => {
        console.log(data);
        divisiList.value = data;
    });
};

const setDivisiFilter = (data) => {
    var page = 1;
    console.log(selectedDivisiFilter.value, "MASUK SET FILTER");
    getListData(page, selectedDivisiFilter.value)
}

const columns = [
    { field: 'name', header: 'Template Name' },
    { field: 'description', header: 'Description' },
    { field: 'category_name', header: 'Category' },
    // { field: 'status', header: 'Status' },
];
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
                            <Button label="New Template" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <!-- <Button label="Run" icon="pi pi-caret-right" class="p-button-warning mr-2" @click="runScheduler" /> -->
                            <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedTemplates || !selectedTemplates.length" /> -->
                            <Dropdown
                                inputId="class"
                                v-model="selectedDivisiFilter"
                                :options="divisiList"
                                @change="setDivisiFilter($event)"
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Filter Divisi"
                            />
                        </div>
                    </template>

                    <template v-slot:end>
                        <!-- <Button label="Send Email" icon="pi pi-upload" class="p-button-help" @click="toggle" />
                        <OverlayPanel ref="op" appendTo="body">
                                <div class="flex justify-valuecontent-center p-fluid">
                                    <div v-focustrap class="cards">
                                        <div class="field">
                                            <InputText id="input" v-model="email" type="text" placeholder="Email" autofocus />
                                        </div>
                                        <Button type="submit" label="Send" class="mt-2" :loading="loading" @click="sendEmail"/>
                                    </div>
                                </div>
                        </OverlayPanel> -->
                    </template>
                </Toolbar>
                <DataTable ref="dt" :value="Templates" responsiveLayout="scroll">
                    <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" headerStyle="width:20%; min-width:10rem;"></Column>
                    <Column field="status" header="Status" :sortable="false" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status==='1' ? 'Active' : 'Non Active'" :severity="getStatusLabel(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column :exportable="false" style="min-width:10rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editTemplate(slotProps.data)" />
                            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="deleteTemplate(slotProps.data)" />
                        </template>
                    </Column>
                    <template #footer>
                        <Paginator v-model:first="first" :rows="10" :totalRecords="Rows" @click="accessData"></Paginator>
                    </template>
                </DataTable>
            </div>

            <Dialog v-model:visible="templateDialog" :style="{width: '450px'}" header="Template Scheduler" :modal="true" class="p-fluid">
                <div class="field">
                    <label for="name">Name</label>
                    <InputText id="name" v-model.trim="template.name" required="true" autofocus :class="{'p-invalid': submitted && !template.name}" />
                    <small class="p-error" v-if="submitted && !template.name">Name is required.</small>
                </div>
                <div class="field">
                    <label for="cron">Cron</label>
                    <InputText id="cron" v-model.trim="template.cron" required="true" autofocus :class="{'p-invalid': submitted && !template.cron}" />
                    <small class="p-error" v-if="submitted && !template.cron">Cron is required.</small>
                </div>
                <div class="field">
                    <label for="exec">Exec</label>
                    <InputText id="exec" v-model.trim="template.exec" required="true" autofocus :class="{'p-invalid': submitted && !template.exec}" />
                    <small class="p-error" v-if="submitted && !template.exec">Exec is required.</small>
                </div>
                <div class="field">
                    <label for="method">Method</label>
                    <InputText id="method" v-model.trim="template.method" required="true" autofocus :class="{'p-invalid': submitted && !template.method}" />
                    <small class="p-error" v-if="submitted && !template.method">Method is required.</small>
                </div>

                <div class="field">
                    <label for="status" class="mb-3">Status</label>
                    <Dropdown id="status" v-model="selectedStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
                        <template #value="slotProps">
                            <div v-if="slotProps.value && slotProps.value.value">
                                <Tag :value="slotProps.value.label" :severity="getStatusLabel(slotProps.value.value)" />
                            </div>
                            <div v-else-if="slotProps.value && !slotProps.value.value">
                                <Tag :value="slotProps.value==='1' ? 'Running' : 'Stop'" :severity="getStatusLabel(slotProps.value)" />
                            </div>
                            <span v-else>
                                {{slotProps.placeholder}}
                            </span>
                        </template>
                    </Dropdown>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
                    <Button label="Save" icon="pi pi-check" text @click="saveTemplate" />
                </template>
            </Dialog>

            <Dialog v-model:visible="deletetemplateDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="template">Are you sure you want to delete <b>{{template.name}}</b>?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="deletetemplateDialog = false"/>
                    <Button label="Yes" icon="pi pi-check" text @click="deleteTemplate(template.id)" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/badges.scss';
</style>
