<script setup>
// import { FilterMatchMode } from 'primevue/api';
import { ref, reactive, onBeforeMount, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import SuratService from '@/service/SuratService';

const router = useRouter();
const route = useRoute();
const toast = useToast();
// const disabledBtnCreate = ref(true);
// const disabledBtnPost = ref(false);

const suratService = new SuratService();
const paramId = route.params.id;

const breadcrumbHome = ref({ icon: "pi pi-home", to: "/" });
const breadcrumbItems = ref([{ label: "Surat Masuk" }, { label: "Create" }]);

let linkCreate = (paramId) ? "/surat/external/balas/"+paramId : "/surat/masuk/create"
let parentId = (paramId) ? parseInt(paramId) : 0

const items = ref([
  {
    label: "Form",
    to: linkCreate,
  },
  {
    label: "View",
    to: "/surat/masuk/create/preview",
  },
]);

const formObject = ref({
  type: {
    id : 1,
    name: "Surat Masuk",
    code: "MAS"
  },
  parent: parentId,
});

onBeforeMount(() => {
});

onMounted(() => {
  accessCreate()
});

const accessCreate = () => {
  const params = {
    edited: 1,
    document_type: "3",
    status: "0",
    sender: setSender()
  }
  suratService.createActionAccess(params).then((data) => {
    // console.log(data);
    const updatedObject = reactive({
      ...formObject.value,  // Copy existing properties
      ...data,
    });

    // Update the reference
    formObject.value = updatedObject;
  });
}

const setSender = () => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    const dataSender = {}
    dataSender.user_id = dataLocalStorage.target;
    dataSender.user_name = dataLocalStorage.user_name;
    dataSender.user_type = "1";
    return dataSender;
};

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

// const editAction = () => {
//   // console.log(formObject, "data form object");
//   disabledBtnCreate.value = true
//   disabledBtnPost.value = false
// }
// const postAction = () => {
//   // console.log(formObject, "data form object");
//   // console.log("post action");
//   disabledBtnCreate.value = false
//   disabledBtnPost.value = true
// }
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
        <!-- <ButtonGroup> -->
          <!-- <div class="card flex justify-content-start flex-wrap gap-3">
            <Button label="Edit" icon="pi pi-check" :disabled="disabledBtnCreate" @click="editAction"/>
            <Button label="Post" icon="pi pi-send" :disabled="disabledBtnPost" @click="postAction" />
          </div> -->
        <!-- </ButtonGroup> -->
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
