<script setup>
import { inject, ref, reactive, onMounted, onBeforeMount, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import SuratService from '@/service/SuratService';
import TemplateService from "@/service/TemplateService";
import CategoryService from '@/service/CategoryService';
import DivisiService from '@/service/DivisiService';
import VuePdfEmbed from 'vue-pdf-embed'
import { useToast } from "primevue/usetoast";

const swal = inject('$swal')

// import ClassicEditor from "@/components/editor/ckeditor.js";
import Editor from "@/components/editor";

const editor = Editor;

const toast = useToast();
const router = useRouter();
const route = useRoute();
const breadcrumbHome = ref({ icon: "pi pi-home", to: "/" });
const breadcrumbItems = ref([{ label: "Template", to: "/admin/template" }, { label: "Add" }]);
const selectedCategory = ref({});
const selectedDivisiFilter = ref();
const selectedTipeCategoryFilter = ref()
const divisiList = ref([]);
const tipeCategoryList = ref([
  {name: 'External', type: '1'},
  {name: 'Internal', type: '2'},
  {name: 'Masuk', type: '3'}
])

const suratService = new SuratService();
const templateService = new TemplateService();
const categoryService = new CategoryService();
const divisiService = new DivisiService();
const paramId = route.params.id;

const inputForm = reactive({
  id: null,
  name: "",
  description: "",
  divisi: null,
  content: "",
  category: null,
  category_name: "",
  status: "1",
  parameter: [],
});

const dataParam = ref("");
const loading = ref(false);

const optionCategory = ref([]);

const visible = ref(false);

// FUNCTION HANDLE PARAMETER
const selectFormTypeNameParam = ref({});
const inputFormParam = ref({
  type: "",
  type_name: "",
  label: "",
  param: "",
  value: "",
});
const optionTypeInputParam = ref([
  { name: 'Input Text', type: '1' },
  { name: 'Input Date (dd MM yyyy)', type: '2' },
  { name: 'Input Dropdown', type: '3' },
  { name: 'Input Editor', type: '4' },
  { name: 'Input Date (Day, dd MM yyyy)', type: '5' },
  { name: 'Input File', type: '6' },
  { name: 'Input Blotter', type: '7' },
  { name: 'Input Date Multiple', type: '8' },
]);
const setTypeNameParam = (event) => {
  inputFormParam.value.type = event.value.type;
  inputFormParam.value.type_name = event.value.name;
};
const paramSelectedAdd = ref([])
const handleAddParam = () => {
  paramSelectedAdd.value.push(inputFormParam.value)
  inputFormParam.value = {
    type: "",
    type_name: "",
    label: "",
    param: "",
    value: "",
  }
  selectFormTypeNameParam.value = {}
}
const handleDeleteParam = (label) => {
  let myArrayDeleted = paramSelectedAdd.value.filter(function (obj) {
    return obj.label !== label;
  });
  paramSelectedAdd.value = myArrayDeleted
}
// END FUNCTION HANDLE PARAMETER

// FUNCTION SET GET DIVISI
const getListDivisi = () => {
  divisiService.getListAll().then((data) => {
    divisiList.value = data;
  });
};
const setDivisiFilter = (data) => {
  selectedTipeCategoryFilter.value = undefined
  selectedCategory.value = {}
}
const setTipeCategoryFilter = (data) => {
  getListCategoryAll(data.value)
}
// END FUNTION SET GET DIVISI

// FUNCTION GET TEMPLATE
const getDetailTemplate = () => {
  const param = {
    id: paramId
  }
  templateService.getDetailTemplate(param).then((data) => {
    inputForm.id = data.id;
    inputForm.name = data.name;
    inputForm.divisi = data.divisi;
    inputForm.description = data.description;
    inputForm.content = data.content;
    inputForm.category_name = data.category_name;
    inputForm.category = data.category;
    inputForm.status = data.status;
    inputForm.parameter = data.parameter;
    dataParam.value = JSON.stringify(data.parameter);
    paramSelectedAdd.value = data.parameter
    let dataFilters = divisiList.value.find(x => x.id === data.divisi)
    selectedDivisiFilter.value = dataFilters.id
    getListCategoryAll("1", data.category)
  });
}
// END FUNCTION GET TEMPLATE

// FUNCTION SET GET CATEGORY
const getListCategoryAll = (type, categoryID = null) => {
  const param = {
    type: type,
    divisi: selectedDivisiFilter.value !== undefined ? selectedDivisiFilter.value : ''
  }
  categoryService.getListCategoryAll(param).then((data) => {
    optionCategory.value = data
    if (categoryID !== null) {
      selectedCategory.value = optionCategory.value.filter((item) => (item.id === categoryID))[0];
    }
  });
}
const setCategory = (event) => {
  console.log(event);
  inputForm.category = event.value.id;
  inputForm.category_name = event.value.name;
};
// END FUNCTION SET GET CATEGORY

const toPage = (path) => {
  router.push(path);
};

// FUNCTION LOAD DATA TEMPLATE
const loadData = () => {
  // getListCategoryAll("all");
  if (paramId) {
    getDetailTemplate();
  }
  // initEditor();
}
// END  FUNTION LOAD DATA TEMPLATE

// FUNCTION HANDLE SUBMIT
const submitAction = () => {
  const swalWithBootstrapButtons = swal.mixin({
    customClass: {
      confirmButton: 'btnCustomSweetalert bg-yellow-500',
      cancelButton: 'btnCustomSweetalert bg-red-500'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: 'Buat Template!',
    text: "Anda yakin ingin membuat template?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    // reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      inputForm.parameter = paramSelectedAdd.value;
      inputForm.divisi = selectedDivisiFilter.value;
      loading.value = true;
      if (paramId) {
        inputForm.status = "1";
        templateService.updateListData(inputForm, paramId).then((data) => {
          if (!data.error) {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'New Data Webinar Saved', life: 3000 });
            loading.value = false;
            toPage('/admin/template');
          } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error Saved', life: 3000 });
            loading.value = false;
          }
        });
      } else {
        const sendData = {};
        sendData.name = inputForm.name;
        sendData.divisi = inputForm.divisi;
        sendData.description = inputForm.description;
        sendData.content = inputForm.content;
        sendData.category_name = inputForm.category_name;
        sendData.category = inputForm.category;
        sendData.status = inputForm.status;
        sendData.parameter = inputForm.parameter;

        templateService.saveTemplateData(inputForm).then((data) => {
          if (!data.error) {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'New Data Webinar Saved', life: 3000 });
            loading.value = false;
            toPage('/admin/template');
          } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error Saved', life: 3000 });
            loading.value = false;
          }
        });
      }
    }
  })
}
// END FUNCTION HANDLE SUBMIT

// FUNCTION HANDLE DUPLICATE
const duplicateAction = () => {
  const swalWithBootstrapButtons = swal.mixin({
    customClass: {
      confirmButton: 'btnCustomSweetalert bg-yellow-500',
      cancelButton: 'btnCustomSweetalert bg-red-500'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: 'Buat Template!',
    text: "Anda yakin ingin duplicate template?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Duplicate',
    cancelButtonText: 'Cancel',
    // reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      inputForm.parameter = paramSelectedAdd.value;
      inputForm.divisi = selectedDivisiFilter.value;
      loading.value = true;

      const sendData = {};
      sendData.name = inputForm.name;
      sendData.divisi = inputForm.divisi;
      sendData.description = inputForm.description;
      sendData.content = inputForm.content;
      sendData.category_name = inputForm.category_name;
      sendData.category = inputForm.category;
      sendData.status = inputForm.status;
      sendData.parameter = inputForm.parameter;

      delete inputForm.id;
      inputForm.parameter.map((item) => {
        delete item.id
      })
      templateService.saveTemplateData(inputForm).then((data) => {
        if (!data.error) {
          toast.add({ severity: 'success', summary: 'Successful', detail: 'New Data Webinar Saved', life: 3000 });
          loading.value = false;
          toPage('/admin/template');
        } else {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Error Saved', life: 3000 });
          loading.value = false;
        }
      });
    }
  })
}
// END FUNCTION HANDLE DUPLICATE

onMounted(() => {
  getListDivisi();
  loadData();
})


const dataPdf = ref();
const generatePDF = (params) => {
  visible.value = true
  const form = new FormData();
  form.append("content", inputForm.content)
  suratService.generatePDF(form).then((data) => (dataPdf.value = data));
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
              <!-- <Button label="New Template" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" /> -->
              <!-- <Button label="Run" icon="pi pi-caret-right" class="p-button-warning mr-2" @click="runScheduler" /> -->
              <!-- <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedTemplates || !selectedTemplates.length" /> -->
            </div>
          </template>

          <template v-slot:end>
            <Button @click="generatePDF()" v-clipboard:error="onError"
              class="p-button-warning justify-content-center mt-0 mr-2" label="Preview"></Button>
            <Button v-if="paramId !== undefined" label="Duplicate" icon="pi pi-plus" class="p-button-success mr-2"
              :loading="loading" @click="duplicateAction" />
            <Button label="Submit" icon="pi pi-plus" class="p-button-success mr-2" :loading="loading"
              @click="submitAction" />
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
        <div class="p-fluid formgrid grid mt-3">
          <div class="field col-12 md:col-4">
            <label for="name">Template Name</label>
            <InputText id="name" type="text" v-model="inputForm.name" />
          </div>

          <div class="field col-12 md:col-3">
            <label for="category">Divisi</label>
            <div class="p-inputgroup flex-1">
              <Dropdown inputId="category" v-model="selectedDivisiFilter" :options="divisiList"
                @change="setDivisiFilter($event)" optionLabel="name" optionValue="id" placeholder="Select Divisi" />
            </div>
          </div>

          <div class="field col-12 md:col-2">
            <label for="category">Template Tipe Category</label>
            <div class="p-inputgroup flex-1">
              <Dropdown inputId="category" v-model="selectedTipeCategoryFilter" :options="tipeCategoryList"
                @change="setTipeCategoryFilter($event)" optionLabel="name" optionValue="type" placeholder="Select Divisi" />
            </div>
          </div>

          <div class="field col-12 md:col-3">
            <label for="category">Category</label>
            <div class="p-inputgroup flex-1">
              <Dropdown inputId="category" v-model="selectedCategory" :options="optionCategory"
                @change="setCategory($event)" optionLabel="name" placeholder="Select Category" />
            </div>
          </div>

          <div class="field col-12 md:col-12">
            <p for="description">Description</p>
            <Textarea v-model="inputForm.description" rows="3" cols="30" />
          </div>

          <div class="field col-12 md:col-4">
            <label for="parameter">Parameter</label>
            <div class="formgrid grid">
              <div class="field col-4 md:col-4 pr-1">
                <label style="font-size: 12px;" for="typeInput_param">Type Input</label>
                <Dropdown inputId="category" v-model="selectFormTypeNameParam" :options="optionTypeInputParam"
                  @change="setTypeNameParam($event)" optionLabel="name" placeholder="Select Category" />
              </div>
              <div class="field col-4 md:col-4 px-1">
                <label style="font-size: 12px;" for="lable_param">Label</label>
                <InputText id="name" type="text" v-model="inputFormParam.label" />
              </div>
              <div class="field col-4 md:col-3 px-1">
                <label style="font-size: 12px;" for="paramName_param">Param Name</label>
                <InputText id="name" type="text" v-model="inputFormParam.param" />
              </div>
              <div class="field col-4 md:col-1 px-1">
                <label style="visibility: hidden;"> 1</label>
                <Button icon="pi pi-plus" class="p-button-success mr-2" :loading="loading" @click="handleAddParam" />
              </div>
            </div>

            <!-- DISPLAY -->
            <!-- <p class="mt-2 mb-1" v-if="paramSelectedAdd.length !== 0">Item Parameter</p> -->
            <div class="formgrid grid" v-for="(item, i) in paramSelectedAdd" :key="item">
              <div class="field col-4 md:col-4 pr-1 align-self-center">
                <p class="mb-0">{{ item.type_name }}</p>
              </div>
              <div class="field col-4 md:col-4 px-1 align-self-center">
                <p class="mb-0">{{ item.label }}</p>
              </div>
              <div class="field col-4 md:col-3 px-1 align-self-center">
                <p class="mb-0">{{ item.param }}</p>
              </div>
              <div class="field col-4 md:col-1 px-1">
                <Button icon="pi pi-trash" class="p-button-danger mr-2" :loading="loading"
                  @click="handleDeleteParam(item.label)" />
              </div>
            </div>
            <!-- <Textarea v-model="dataParam" rows="3" cols="30" /> -->
          </div>

          <div class="field col-12 md:col-8">
            <label for="content">Content</label>
            <ckeditor :editor="editor" v-model="inputForm.content"></ckeditor>
          </div>
        </div>


        <Dialog v-model:visible="visible" maximizable modal header="Preview">
          <div class="card">
            <div class="flex flex-column md:flex-row gap-5">
              <div class="flex-auto">
                <ScrollPanel style="width: 100%; height: auto" class="custombar1">
                  <vue-pdf-embed ref="pdfRef" :source="dataPdf" @password-requested="handlePasswordRequest"
                    @rendered="handleDocumentRender" />
                </ScrollPanel>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  </div>
</template>
<style scoped>
::v-deep(.p-scrollpanel.custombar1 .p-scrollpanel-wrapper) {
  /* border-right: 10px solid var(--surface-ground); */
  border-right: 10px solid var(--gray-300);
}

::v-deep(.p-scrollpanel.custombar1 .p-scrollpanel-bar) {
  background-color: var(--primary-300);
  opacity: 1;
  transition: background-color 0.3s;
}

::v-deep(.p-scrollpanel.custombar1 .p-scrollpanel-bar:hover) {
  background-color: var(--primary-400);
}

::v-deep(.vue-pdf-embed canvas) {
  margin-top: 10px;
}

::v-deep(.plb-10) {
  padding-left: 10px;
  padding-bottom: 10px;
}

::v-deep(.p-scrollpanel.custombar2 .p-scrollpanel-wrapper) {
  border-right: 10px solid var(--surface-50);
  border-bottom: 10px solid var(--surface-50);
}

::v-deep(.p-scrollpanel.custombar2 .p-scrollpanel-bar) {
  background-color: var(--surface-300);
  border-radius: 0;
  opacity: 1;
  transition: background-color 0.3s;
}

:deep(.ck-editor__editable) {
  min-height: 500px;
}
</style>
<style>
.btnCustomSweetalert {
  border: none;
  padding: 12px 32px;
  margin-left: 20px;
  margin-right: 20px;
  border-radius: 4px;
  cursor: pointer;
}

.vue-pdf-embed>div {
  display: flex;
  justify-content: center;
}

.vue-pdf-embed>div>canvas {
  width: 100% !important;
  height: auto !important;
}
</style>