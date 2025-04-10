<script setup>
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWX5fdXRRRmleV0JzW0Q=');

// import { useRouter, useRoute } from 'vue-router'
// import { computed, onBeforeMount, watch } from 'vue';

// const router = useRouter()
// const route = useRoute()

// const nameRoute = route.name

// const checkLogin = () => {
//     console.log("computed");
//     if(!localStorage.getItem('login')){
//         if (nameRoute !== 'login') {
//             router.push('/auth/login');
//         }
//     }
// }

// onBeforeRouteLeave( (to, from) => {
//       // only fetch the user if the id changed as maybe only the query or the hash changed
//     //   if (to.params.id !== from.params.id) {
//     //     userData.value = await fetchUser(to.params.id)
//     //   }
//     console.log(to, from);
//     })

// computed(() => {
//     console.log("computed");
//     checkLogin();
// });

// watch(() => {
//     console.log("watch");
//     // checkLogin();
// });

// onBeforeMount(() => {
//     console.log("beforemonth");
//     // initFilters();
// });

</script>

<template>
    <router-view />
</template>

<style scoped></style>


<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-calendars/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
@import "../node_modules/@syncfusion/ej2-grids/styles/material.css";
@import "../node_modules/@syncfusion/ej2-treegrid/styles/material.css";
@import "../node_modules/@syncfusion/ej2-vue-lists/styles/material.css";

</style>
