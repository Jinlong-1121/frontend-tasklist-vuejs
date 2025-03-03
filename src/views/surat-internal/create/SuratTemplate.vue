<script setup>
import { inject, ref, onMounted, onUpdated } from "vue";
import { useRoute } from "vue-router";
// import SuratService from '@/service/SuratService';
import CategoryService from '@/service/CategoryService';
import TemplateService from "@/service/TemplateService";
import AbsenService from '@/service/AbsenService';

import { useToast } from "primevue/usetoast";
const toast = useToast();
const swal = inject('$swal')

const props = defineProps({ formData: Object })
const emit = defineEmits(['next-page', 'prev-page'])
const route = useRoute();

const submitted = ref(false);

const selectedCategory = ref({});
const validateSelectedCategory = ref();
const categoryList = ref([]);     
const selectedTemplate = ref({});
const sender = ref({});
const templateList = ref(null);
const need_attach = ref('0');
const layout = ref('grid');
const switchTandatanganBasah = ref(false)
const totalCuti = ref(0)

// const suratService = new SuratService();
const categoryService = new CategoryService();
const templateService = new TemplateService();
const absenService = new AbsenService();

onMounted(() => {
    getCategory();
    sender.value = setSender();
    if (route.params.action==="update") {
      selectedCategory.value = props.formData.category;
      getTemplate(1);
    }
});

onUpdated(() => {
    getCategory();
    sender.value = setSender();
    if (route.params.action==="update") {
      selectedCategory.value = props.formData.category;
      getTemplate(1);
    }
});

// FUNCTION HANDLE SET TEMPLATE & PICK TEMPLATE
const setTemplate = (event) => {
    need_attach.value = '0'
    switchTandatanganBasah.value = false
    selectedTemplate.value = {}
    selectedCategory.value = event.value
    validateSelectedCategory.value = event.value
    getTemplate(event.value.id);
};
const pickTemplate = (data) => {
    let dataUser = JSON.parse(localStorage.getItem('sipam')).pin
    need_attach.value = '0'
    const dataTemplate = templateList.value.filter(item => item.id === data.id);
    selectedTemplate.value = dataTemplate[0];
    if (data.category_name === 'General' && data.name === 'Template Tanda Tangan Basah') {
      switchTandatanganBasah.value = true
    }else {
      switchTandatanganBasah.value = false
    }

    // console.log(data, "TEMPLATE");
    if (data.category_name === 'Izin' && data.name === "Template Izin Cuti") {
      absenService.getSisaTotalCuti(dataUser).then((res) => {
        totalCuti.value = res.data
      });
    }else {
      console.log("KELUAR");
    }
};
// END FUNCTION HANDLE SET TEMPLATE & PICK TEMPLATE

const setSender = () => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    const dataSender = {}
    dataSender.user_id = dataLocalStorage.target;
    dataSender.user_name = dataLocalStorage.user_name;
    dataSender.user_type = "1";
    return dataSender;
};

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
const getTemplate = (id) => {
  const params = {
    type: id
  }
  templateService.getListTemplateAll(params).then((data) => {

    let dataTemp = data.filter(item => item.name === "Surat Bebas");
    if (dataTemp.length > 0) {
      data = data.filter(item => item.name !== "Surat Bebas");
      data.unshift(dataTemp[0]);
    }
    templateList.value = data;
    if (route.params.action==="update") {
      pickTemplate(props.formData.template.id);
    }
  });
}

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
  if (selectedTemplate.value.name === 'Template Izin Cuti') {
    if (totalCuti.value > 0) {
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
              need_attach: need_attach.value,
              perihal: '',
              is_cuti: '1',
              total_cuti: totalCuti.value
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
    }else {
      toast.add({ severity: 'error', summary: 'Cuti', detail: 'Sisa cuti habis', life: 3000 });
    }
  }else {
    const check = checkValidate()
    submitted.value = true
    if (check !== false) {
      if (Object.keys(selectedTemplate.value).length !== 0) {
        if (selectedCategory.value.alias === 'GEN' && selectedTemplate.value.name === 'Template Tanda Tangan Basah') {
          if (switchTandatanganBasah.value && need_attach.value === '1') {
            emit("next-page", {
              formData: {
                category: selectedCategory.value,
                template: selectedTemplate.value,
                sender: sender.value,
                document_type: "2",
                need_attach: need_attach.value,
                perihal: ''
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
              title: 'Switch Tanda Tangan Basah!',
              text: 'Silahkan aktifkan tanda tangan basah dahulu.',
            })
          }
        }else {
          emit("next-page", {
            formData: {
              category: selectedCategory.value,
              template: selectedTemplate.value,
              sender: sender.value,
              document_type: "2",
              need_attach: need_attach.value,
              perihal: ''
            },
            pageIndex: 0,
          });
        }
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
  }
};
</script>

<template>
  <Toast />
  <div class="stepsdemo-content">
    <Card class="mt-3">
      <template v-slot:title> Create {{ formData.type.name }} </template>
      <template v-slot:subtitle> <i>Choose your category & template</i> </template>
      <template v-slot:content>
        <div class="p-fluid formgrid grid mt-3 justify-content-between">
          <div class="field col-12 md:col-6">
            <label for="class">Category</label>
            <Dropdown
              inputId="class"
              v-model="validateSelectedCategory"
              :options="categoryList"
              @change="setTemplate($event)"
              optionLabel="name"
              placeholder="Select a Category"
              required="true" autofocus :class="{'p-invalid': submitted && !validateSelectedCategory}"
            />
            <small class="p-error" v-if="submitted && !validateSelectedCategory">Category is required.</small>
          </div>
          <div class="field col-12 md:col-3 text-right" v-if="switchTandatanganBasah">
            <label for="class">Tandatangan Basah</label>
            <div class="switch-Tandatangan">
              <InputSwitch v-model="need_attach" falseValue="0" trueValue="1"/>
            </div>
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
                        <div class="col-12 md:col-3 mt-3">
                            <div class="card mx-3 border-1 surface-border hcard" :class="{ 'active': slotProps.data === selectedTemplate }" :key="slotProps.data.id" @click="pickTemplate(slotProps.data)" style="min-height: 100%">
                                <div class="text-center">
                                    <div class="text-2xl font-bold">{{ slotProps.data.name }}</div>
                                    <div class="mb-3">
                                      <p>
                                        {{ slotProps.data.description }}
                                      </p>
                                    </div>
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
