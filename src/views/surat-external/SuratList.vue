<script setup>
import { onMounted, onUpdated, provide, ref } from 'vue';
import SuratService from '@/service/SuratService';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
const breadcrumbItems = ref([{ label: 'Surat', to: '/surat-external/list' }, { label: 'List', to: '/surat-external/list' }]);

const suratService = new SuratService();

const dataTotal = ref([])
const keyword = ref("")

const childComponentRef = ref(null);

const getData = () => {
  const childComponent = childComponentRef.value;
  // console.log(childComponent.$.ctx, route);
  childComponent.$.ctx[route.meta.actionSearching](1, keyword.value)

//   if (childComponent) {
//     // Call a method on the child component
//     childComponent.getListData(1, keyword.value);
//   }
};

onMounted(() => {
    getTotalSurat()
    // childComponentRef.value = $refs.childComponentRef;
    // const instance = getCurrentInstance();
    // childComponentRef.value = instance.vnode.component.proxy.$refs.childComponentRef;
})

onUpdated(() => {
    getTotalSuratUpdate(dataTotal.value)
})

const getTotalSurat = async () => {
    let params = {
        type: "1",
    }
    let dataTotals = await suratService.getSuratCount(params).then((data) => {
        return data
    });
    dataTotal.value = dataTotals

    let data0 = document.querySelectorAll("li.p-tabmenuitem")[2]
    if (dataTotal.value[0] !== "0") {
        document.querySelectorAll("li.p-tabmenuitem")[2].classList.add("notip")
    }
    let data1 = document.querySelectorAll("li.p-tabmenuitem")[3]
    if (dataTotal.value[1] !== "0") {
        document.querySelectorAll("li.p-tabmenuitem")[3].classList.add("notip")
    }
    let data2 = document.querySelectorAll("li.p-tabmenuitem")[4]
    if (dataTotal.value[2] !== "0") {
        document.querySelectorAll("li.p-tabmenuitem")[4].classList.add("notip")
    }
    let data3 = document.querySelectorAll("li.p-tabmenuitem")[5]
    if (dataTotal.value[3] !== "0") {
        document.querySelectorAll("li.p-tabmenuitem")[5].classList.add("notip")
    }

    data0.setAttribute("dataDynamic", dataTotal.value[0]);
    data1.setAttribute("dataDynamic", dataTotal.value[1]);
    data2.setAttribute("dataDynamic", dataTotal.value[2]);
    data3.setAttribute("dataDynamic", dataTotal.value[3]);
}

const getTotalSuratUpdate = (tempDataTotal) => {
    let data0 = document.querySelectorAll("li.p-tabmenuitem")[2]
    if (tempDataTotal[0] !== "0") {
        document.querySelectorAll("li.p-tabmenuitem")[2].classList.add("notip")
    }
    let data1 = document.querySelectorAll("li.p-tabmenuitem")[3]
    if (tempDataTotal[1] !== "0") {
        document.querySelectorAll("li.p-tabmenuitem")[3].classList.add("notip")
    }
    let data2 = document.querySelectorAll("li.p-tabmenuitem")[4]
    if (tempDataTotal[2] !== "0") {
        document.querySelectorAll("li.p-tabmenuitem")[4].classList.add("notip")
    }
    let data3 = document.querySelectorAll("li.p-tabmenuitem")[5]
    if (tempDataTotal[3] !== "0") {
        document.querySelectorAll("li.p-tabmenuitem")[5].classList.add("notip")
    }

    data0.setAttribute("dataDynamic", tempDataTotal[0]);
    data1.setAttribute("dataDynamic", tempDataTotal[1]);
    data2.setAttribute("dataDynamic", tempDataTotal[2]);
    data3.setAttribute("dataDynamic", tempDataTotal[3]);
}

const nestedRouteItems = ref([
    {
        label: 'Complete',
        to: '/surat-external/list'
    },
    {
        label: 'Draft',
        to: '/surat-external/list/draft'
    },
    {
        label: 'Revisi',
        to: '/surat-external/list/open'
    },
    {
        label: 'Need Verif',
        to: '/surat-external/list/waiting'
    },
    {
        label: 'Need Signer',
        to: '/surat-external/list/signer'
    },
    {
        label: 'Upload Documents',
        to: '/surat-external/list/upload-documents'
    },
    {
        label: 'Surat Cancel',
        to: '/surat-external/list/surat-cancel'
    }
]);

const createNew = () => {
    router.push('/surat/external/create');
}

// provide("childComponentRef", childComponentRef)
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card card-w-title">
                <h3>Surat External</h3>
                <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />
                <Button icon="pi pi-plus" label="Surat Baru" @click="createNew" class="mr-2 mb-2" />
                        
                        <TabMenu :model="nestedRouteItems" class="button-tabSurat"/>
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
        .notip::after {
            content: " " attr(dataDynamic) "" !important;
            position: absolute;
            z-index: 999;
            top: 0;
            right: 0px;
            background: red;
            border-radius: 50%;
            font-size: 11px;
            font-weight: bold;
            padding: 2px;
            width: 12px;
            height: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }
    }
}

</style>