<script setup>
// import { FilterMatchMode } from 'primevue/api';
import { ref, onBeforeMount, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import SuratService from '@/service/SuratService';

const router = useRouter();
const route = useRoute();
const paramId = route.params.id;
const toast = useToast();

const suratService = new SuratService();

// const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: "pi pi-home", to: "/" });
const breadcrumbItems = ref([{ label: "Surat Internal" }, { label: "Edit" }]);
const dataTempStatus = reactive({
  status: '',
  note: ''
})
// const items = ref([])
// const formObject = ref({})

const items = ref([
  {
    label: "Template",
    to: "/surat/internal/edit/:id",
  },
  {
    label: "Form",
    to: "/surat/internal/edit/:id/form",
  },
  {
    label: "View",
    to: "/surat/internal/edit/:id/preview",
  },
]);
// const itemsExtCreate = ref([
//   {
//     label: "Template",
//     to: "/surat/external/create",
//   },
//   {
//     label: "Form",
//     to: "/surat/external/create/form",
//   },
//   {
//     label: "View",
//     to: "/surat/external/create/preview",
//   },
// ]);

// const itemsExtUpdate = ref([
//   {
//     label: "Template",
//     to: "/surat/external/update",
//   },
//   {
//     label: "Form",
//     to: "/surat/external/update/form",
//   },
//   {
//     label: "View",
//     to: "/surat/external/update/preview",
//   },
// ]);

const setTo = (to, val) => {
  return to.replace(":id", val)
}

const formObject = ref({
  type: {
    id : 1,
    name: "Surat Internal",
    code: "EXT"
  },
  parent: 0,
});
// const formExtObject = ref({
//   type: {
//     id : 2,
//     name: "Surat External",
//     code: "EXT"
//   },
//   parent: null,
// });

// const formIntObject = ref({
//   type: {
//     id : 1,
//     name: "Surat Internal",
//     code: "INT"
//   },
//   parent: null,
// });

onBeforeMount(() => {
  // const routeType = route.params.type;
  // const routeAction = route.params.action;

  // switch (true) {
  //   case ((routeType === "external") && (routeAction === "create")):
  //     items.value = itemsExtCreate.value;
  //     formObject.value = formExtObject.value;
  //     break;

  //   case ((routeType === "external") && (routeAction === "update")):
  //     items.value = itemsExtUpdate.value;
  //     loadData();
  //     // formObject.value = formExtObject.value;
  //     break;
  
  //   // default:
  //   //   items.value = formIntObject.value;
  //   //   formObject.value = formIntObject.value;
  //   //   break;
  // }
  // console.log(routeType, "type");
  // console.log(routeAction, "action");
  // console.log(items.value, "items");
  // console.log(formObject.value, "form");
});

onMounted(() => {
  // loadData();
  getDataDetail();
  // console.log(formObject.value, "form mount");
});

const getDataDetail = () => {
  // console.log("BOLEH");
   const param = {
        id: paramId
    }
    suratService.getDetail(param).then((data) => {
      // console.log(data, "MASUK MASZ");
      console.log(data, "data detail");
      dataTempStatus.status = data.status
      dataTempStatus.note = data.note
      // getCategory(data.document_type);
      // selectedCategory.value = JSON.parse(data.category)
      // actionCategory(selectedCategory);
      // selectedTemplate.value = JSON.parse(data.template)
    });
}

const loadData = async () => {
  suratService.getDetail().then((data) => {
    formObject.value = data;
    // console.log(formObject.value, 'value');
  });
}

const nextPage = (event) => {
  for (let field in event.formData) {
    formObject.value[field] = event.formData[field];
  }
  router.push(setTo(items.value[event.pageIndex + 1].to, event.formData.document_id));
};
const prevPage = (event) => {
  router.push(setTo(items.value[event.pageIndex - 1].to, event.document_id));
};
const complete = () => {
  toast.add({
    severity: "success",
    summary: "Order submitted",
    detail:
      "Dear, " +
      formObject.value.firstname +
      " " +
      formObject.value.lastname +
      " your order completed.",
  });
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card card-w-title">
        <Breadcrumb
        class="mb-4"
        :home="breadcrumbHome"
        :model="breadcrumbItems"
        />
        <Message v-if="dataTempStatus.status === '1'" severity="warn" :closable="false">{{ dataTempStatus.note }}</Message>
        <Steps :model="items" aria-label="Form Steps" />
        <router-view
          v-slot="{ Component, route }"
          :formData="formObject"
          @prevPage="prevPage($event)"
          @nextPage="nextPage($event)"
          @complete="complete"
        >
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/badges.scss";
</style>
