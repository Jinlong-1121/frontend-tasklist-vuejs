<script setup>
import { useLayout } from '@/layout/composables/layout';
import { inject,onMounted, computed, onUpdated, reactive, ref } from 'vue';
import { HelperFunc } from '@/service/Helper';
import { useRouter, useRoute } from 'vue-router'
import AuthService from '@/service/AuthService';
// import CryptoJS from 'crypto-js'

const router = useRouter()
const route = useRoute()
const swal = inject('$swal')

const { layoutConfig, contextPath } = useLayout();
const email = ref('');
const password = ref('');
const docId = ref('');
const logoUrl = computed(() => {
    return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const authService = new AuthService;

const loginAction = () => {
    var params = {
        email: email.value,
        password: password.value
    }
    if (!params.email || !params.password) {
        const swalWithButtonsCustom = swal.mixin({
            customClass: {
                confirmButton: 'btnCustomSweetalert bg-yellow-500',
                cancelButton: 'btnCustomSweetalert bg-red-500'
            },
            buttonsStyling: false
        })
        swalWithButtonsCustom.fire({
            icon: 'error',
            title: 'Input!',
            text: 'Input Email atau Password tidak boleh kosong.',
        })
    }else {
        authService.authLogin(params).then((data) => {
        if (!data.error) {
            localStorage.setItem("sipam", JSON.stringify(data.data));
            ocation.href = `http://localhost:2323/#/surat/masuk/edit/${docId.value}`;
            // router.push('/')
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
                title: 'Password!',
                text: data.error,
            })
        }
    });
    }
}

const routeValidation = () => {
    
    const data = route.query.link;
    const dataRep = data.replace(/ /g,"+")
    const realData = HelperFunc.decryption(dataRep);
    const parsingData = JSON.parse(realData);
    docId.value = parsingData.id
    console.log(JSON.stringify(data));
    console.log(realData, docId.value);
    const isAuthenticated = localStorage.getItem('sipam');
    if (isAuthenticated) {
        // console.log(isAuthenticated, "atuh");
        const dataUser = JSON.parse(isAuthenticated);
        if (dataUser.target === parsingData.user) {
            location.href = `http://localhost:2323/#/surat/masuk/edit/${parsingData.id}`;
        }
        // router.push('/')
    }

}
// const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/' });
// const breadcrumbItems = ref([{ label: 'Surat Masuk', to: '/surat-masuk/list' }, { label: 'List', to: '/surat-masuk/list' }]);

// const suratService = new SuratService();

// const dataTotal = ref([])

onMounted(() => {
    // getTotalSurat()
    routeValidation();
})

// onUpdated(() => {
//     getTotalSuratUpdate(dataTotal.value)
// })

// const getTotalSurat = async () => {
//     let params = {
//         type: "1",
//     }
//     let dataTotals = await suratService.getSuratCount(params).then((data) => {
//         return data
//     });
//     dataTotal.value = dataTotals

//     let data0 = document.querySelectorAll("li.p-tabmenuitem")[2]
//     if (dataTotal.value[0] !== "0") {
//         document.querySelectorAll("li.p-tabmenuitem")[2].classList.add("notip")
//     }
//     let data1 = document.querySelectorAll("li.p-tabmenuitem")[3]
//     if (dataTotal.value[1] !== "0") {
//         document.querySelectorAll("li.p-tabmenuitem")[3].classList.add("notip")
//     }
//     let data2 = document.querySelectorAll("li.p-tabmenuitem")[4]
//     if (dataTotal.value[2] !== "0") {
//         document.querySelectorAll("li.p-tabmenuitem")[4].classList.add("notip")
//     }
//     let data3 = document.querySelectorAll("li.p-tabmenuitem")[5]
//     if (dataTotal.value[3] !== "0") {
//         document.querySelectorAll("li.p-tabmenuitem")[5].classList.add("notip")
//     }

//     data0.setAttribute("dataDynamic", dataTotal.value[0]);
//     data1.setAttribute("dataDynamic", dataTotal.value[1]);
//     data2.setAttribute("dataDynamic", dataTotal.value[2]);
//     data3.setAttribute("dataDynamic", dataTotal.value[3]);
// }

// const getTotalSuratUpdate = (tempDataTotal) => {
//     let data0 = document.querySelectorAll("li.p-tabmenuitem")[2]
//     if (tempDataTotal[0] !== "0") {
//         document.querySelectorAll("li.p-tabmenuitem")[2].classList.add("notip")
//     }
//     let data1 = document.querySelectorAll("li.p-tabmenuitem")[3]
//     if (tempDataTotal[1] !== "0") {
//         document.querySelectorAll("li.p-tabmenuitem")[3].classList.add("notip")
//     }
//     let data2 = document.querySelectorAll("li.p-tabmenuitem")[4]
//     if (tempDataTotal[2] !== "0") {
//         document.querySelectorAll("li.p-tabmenuitem")[4].classList.add("notip")
//     }
//     let data3 = document.querySelectorAll("li.p-tabmenuitem")[5]
//     if (tempDataTotal[3] !== "0") {
//         document.querySelectorAll("li.p-tabmenuitem")[5].classList.add("notip")
//     }

//     data0.setAttribute("dataDynamic", tempDataTotal[0]);
//     data1.setAttribute("dataDynamic", tempDataTotal[1]);
//     data2.setAttribute("dataDynamic", tempDataTotal[2]);
//     data3.setAttribute("dataDynamic", tempDataTotal[3]);
// }

// const nestedRouteItems = ref([
//     {
//         label: 'Complete',
//         to: '/surat-masuk/list'
//     },
//     {
//         label: 'Draft',
//         to: '/surat-masuk/list/draft'
//     },
//     // {
//     //     label: 'Revisi',
//     //     to: '/surat-masuk/list/open'
//     // },
//     {
//         label: 'Need Verif',
//         to: '/surat-masuk/list/waiting'
//     },
// ]);

const createNew = () => {
    router.push('/surat/masuk/create');
}
</script>


<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div>
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-6xl font-medium mb-3">SIPAM</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :feedback="false" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>
                        <Button label="Sign In" class="w-full p-3 text-xl mt-5" @click.prevent="loginAction()"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>