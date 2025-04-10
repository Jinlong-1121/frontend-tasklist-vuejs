<script setup>
// import { FilterMatchMode } from 'primevue/api';
import { ref, onBeforeMount, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import SuratService from '@/service/SuratService';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const paramId = route.params.id;

const suratService = new SuratService();

// const toast = useToast();
// const { contextPath } = useLayout();
// const router = useRouter()
const breadcrumbHome = ref({ icon: "pi pi-home", to: "/" });
const breadcrumbItems = ref([{ label: "Surat Internal" }, { label: "Create" }]);
// const items = ref([])
// const formObject = ref({})
let linkCreate = (paramId) ? "/surat/internal/balas/"+paramId : "/surat/internal/create"
let parentId = (paramId) ? parseInt(paramId) : 0

const items = ref([
  {
    label: "Template",
    to: linkCreate,
  },
  {
    label: "Form",
    to: "/surat/internal/create/form",
  },
  {
    label: "View",
    to: "/surat/internal/create/preview",
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

const formObject = ref({
  type: {
    id : 1,
    name: "Surat Internal",
    code: "INT"
  },
  parent: parentId,
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
  // // console.log(routeType, "type");
  // // console.log(routeAction, "action");
  // console.log(items.value, "items");
  // console.log(formObject.value, "form");
});

onMounted(() => {
  // loadData();
  // console.log(formObject.value, "form mount");
});

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

  router.push(items.value[event.pageIndex + 1].to);
};
const prevPage = (event) => {
  router.push(items.value[event.pageIndex - 1].to);
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
