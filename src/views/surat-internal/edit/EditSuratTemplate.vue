<script setup>
import { inject, ref, onMounted, onUpdated, reactive } from "vue";
import { useRoute } from "vue-router";
// import SuratService from '@/service/SuratService';
import SuratService from '@/service/SuratService';
import CategoryService from '@/service/CategoryService';
import TemplateService from "@/service/TemplateService";

const route = useRoute();
const paramId = route.params.id;

const suratService = new SuratService();

const props = defineProps({ formData: Object })
const emit = defineEmits(['next-page', 'prev-page'])

const swal = inject('$swal')

const submitted = ref(false);

const dataDraft = reactive({})
const selectedCategory = ref({});
const validateSelectedCategory = ref();
const categoryList = ref([]);     
const selectedTemplate = ref({});
const sender = ref({});
const templateList = ref(null);
const layout = ref('grid');

// const suratService = new SuratService();
const categoryService = new CategoryService();
const templateService = new TemplateService();

onMounted(() => {
    // getCategory();
    sender.value = setSender();
    getDataDetail()
});

onUpdated(() => {
    // getCategory();
    sender.value = setSender();
});

const getDataDetail = () => {
   const param = {
        id: paramId
    }
    suratService.getDetail(param).then((data) => {
      dataDraft.value = data
      console.log(dataDraft.value, "OOOO");
      getCategory(data.document_type);
      selectedCategory.value = JSON.parse(data.category)
      getTemplate(selectedCategory);
      selectedTemplate.value = JSON.parse(data.template)
    });
}

const setTembusanData = (data) => {
  data.map(item => {
      delete item.document_id
      delete item.id
  })
  console.log(data, "GGGG");
  return data
}

// get category from api
const getCategory = () => {
  const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
  const params = {
    type: "2",
    divisi: dataLocalStorage.divisi
  }
  categoryService.getListCategoryAll(params).then((data) => (categoryList.value = data));
};

// get template from api by id category
const getTemplate = (data) => {
  const params = {
    type: data.value.id
  }
  templateService.getListTemplateAll(params).then((data) => {
      let dataTemp = data.filter(item => item.name === "Surat Bebas");
      if (dataTemp.length > 0) {
        data = data.filter(item => item.name !== "Surat Bebas");
        data.unshift(dataTemp[0]);
      }
      templateList.value = data;
      validateSelectedCategory.value = selectedCategory.value
    });
}

const actionCategory = (event) => {
  selectedTemplate.value = {}
  validateSelectedCategory.value = event.value
  // getTemplate(event.value.id);
  const params = {
    type: event.value.id
  }
  templateService.getListTemplateAll(params).then((data) => {
    let dataTemp = data.filter(item => item.name === "Surat Bebas");
    if (dataTemp.length > 0) {
      data = data.filter(item => item.name !== "Surat Bebas");
      data.unshift(dataTemp[0]);
    }
    templateList.value = data;
  });
};

const setSender = () => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    const dataSender = {}
    dataSender.user_id = dataLocalStorage.target;
    dataSender.user_name = dataLocalStorage.user_name;
    dataSender.user_type = "1";
    return dataSender;
};

const actionTemplate = (event) => {
  selectedTemplate.value = event;
};

// VALIDATE
const checkValidate = () => {
    if (
        !validateSelectedCategory.value
    ) {
        return false
    }else {
        return true
    }
}
// END VALIDATE

const nextPage = () => {
  const check = checkValidate()
  submitted.value = true
  if (check !== false) {
    if (Object.keys(selectedTemplate.value).length !== 0) {
      emit("next-page", {
           formData: {
             category: selectedCategory.value,
             template: selectedTemplate.value,
             sender: sender.value,
             document_type: "2",
             document_id: paramId,
             draftStore: dataDraft,
   
             id: dataDraft.value.id,
             divisi: JSON.parse(dataDraft.value.divisi),
             document_no: dataDraft.value.document_no,
             content: dataDraft.value.content,
             note: dataDraft.value.note,
             form_data: dataDraft.value.form_data,
             parent: dataDraft.value.parent,
             asset_url: dataDraft.value.asset_url,
             ref_id: dataDraft.value.ref_id,
             perihal: dataDraft.value.perihal,
             receiver: dataDraft.value.receiver,
             verificator: dataDraft.value.verificator,
             tembusan: setTembusanData(dataDraft.value.tembusan),
             signer: dataDraft.value.signer,
             attachment: dataDraft.value.attachment,
             is_reply: dataDraft.value.is_reply,
             need_attach: dataDraft.value.need_attach,
             need_sign: dataDraft.value.need_sign,
             status: dataDraft.value.status,
             created_at: dataDraft.value.created_at,
             updated_at: dataDraft.value.updated_at
           },
           pageIndex: 0,
         });
    }else {
      const swalWithButtonsCustom = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
      })
      swalWithButtonsCustom.fire({
        icon: 'error',
        title: 'Template Kosong!',
        text: 'Silahkan pilih template terlebih dahulu.',
      })
    }
  }
};
</script>

<template>
  <div class="stepsdemo-content">
    <Card class="mt-3">
      <template v-slot:title> Edit {{ formData.type_name }} </template>
      <template v-slot:subtitle> <i>Choose your category & template</i> </template>
      <template v-slot:content>
        <div class="p-fluid formgrid grid mt-3">
          <div class="field col-12 md:col-6">
            <label for="class">Category</label>
            <Dropdown
              inputId="class"
              v-model="selectedCategory"
              :options="categoryList"
              @change="actionCategory($event)"
              optionLabel="name"
              placeholder="Select a Category"
              :disabled="dataDraft.value?.status === '1'"
              required="true" autofocus :class="{'p-invalid': submitted && !validateSelectedCategory}"
            />
            <small class="p-error" v-if="submitted && !validateSelectedCategory">Category is required.</small>
          </div>
        </div>
        <div class="formgrid grid">
          <!-- <div class="field col-12 md:col-6">
                        <label for="lastname">Wagon</label>
                        <Dropdown inputId="wagon" v-model="selectedVagon" :options="vagons" @change="setSeats($event)" optionLabel="vagon" placeholder="Select a Vagon" />
                    </div> -->
          <div class="field col-12">
            <label for="seat">Template</label>
            <DataView :value="templateList" :layout="layout" :paginator="true" :rows="9">
                    <template #header>
                        <div class="grid grid-nogutter">
                            <div class="col-6 text-left">
                                <!-- <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By Price" @change="onSortChange($event)" /> -->
                            </div>
                            <div class="col-6 text-right">
                                <DataViewLayoutOptions v-model="layout" />
                            </div>
                        </div>
                    </template>
                    <template #list="slotProps">
                        <div class="col-12">
                            <div class="flex flex-column md:flex-row align-items-center p-3 w-full">
                                <!-- <img :src="contextPath + 'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.name" class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" /> -->
                                <div class="flex-1 text-center md:text-left">
                                    <div class="font-bold text-2xl">{{ slotProps.data.name }}</div>
                                    <div class="mb-3">{{ slotProps.data.description }}</div>
                                    <!-- <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" class="mb-2"></Rating> -->
                                    <!-- <div class="flex align-items-center">
                                        <i class="pi pi-tag mr-2"></i>
                                        <span class="font-semibold">{{ slotProps.data.category }}</span>
                                    </div> -->
                                </div>
                                <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                                    <!-- <span class="text-2xl font-semibold mb-2 align-self-center md:align-self-end">${{ slotProps.data.price }}</span> -->
                                    <!-- <Button icon="pi pi-shopping-cart" label="Add to Cart" :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'" class="mb-2"></Button> -->
                                    <span class="product-badge status-instock">{{ slotProps.data.category_name }}</span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #grid="slotProps">
                        <div class="col-12 md:col-3">
                            <div class="card m-3 border-1 surface-border hcard" :class="{ 'active': slotProps.data.id === selectedTemplate.id }" :key="slotProps.data.id" @click="dataDraft.value?.status === '1' ? '' : actionTemplate(slotProps.data)" style="cursor: pointer;">
                                <div class="text-center">
                                    <div class="text-2xl font-bold">{{ slotProps.data.name }}</div>
                                    <div class="mb-3">{{ slotProps.data.description }}</div>
                                    <span class="product-badge status-instock">{{ slotProps.data.category_name }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="grid grid-nogutter justify-content-between">
          <!-- <Button label="Back" @click="prevPage()" icon="pi pi-angle-left" /> -->
          <i></i>
          <Button
            label="Next"
            @click="nextPage()"
            icon="pi pi-angle-right"
            iconPos="right"
          />
        </div>
      </template>
    </Card>
  </div>
</template>
<style scoped>
:deep(.hcard:hover) {
  border-color: rgb(242, 151, 39) !important;
  background-color: antiquewhite !important;
  /* border-width: 2px !important; */
}
:deep(.active) {
  border-color: rgb(242, 151, 39) !important;
  background-color: antiquewhite !important;
  /* border-width: 2px !important; */
}
</style>
