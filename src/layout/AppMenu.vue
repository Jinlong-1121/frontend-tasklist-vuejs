<script setup>
import { ref, onMounted } from 'vue';

import MenuService from '@/service/MenuService';

import AppMenuItem from './AppMenuItem.vue';

const menuService = new MenuService();

const model = ref([]);
const menu = ref([]);
const dataLocal = localStorage.getItem('sipam');

// // const menu = [
// //     {
// //         "id": 1,
// //         "name": "Home",
// //         "alias": "home",
// //         "url": "",
// //         "icon": "",
// //         "parent": 0,
// //         "status": "1",
// //         "created_at": "2023-06-20T13:39:21.715+07:00",
// //         "updated_at": "2023-06-20T13:39:21.716+07:00"
// //       },
// //       {
// //         "id": 2,
// //         "name": "Dashboard",
// //         "alias": "dashboard",
// //         "url": "/",
// //         "icon": "pi pi-fw pi-home",
// //         "parent": 1,
// //         "status": "1",
// //         "created_at": "2023-06-20T13:40:45.793+07:00",
// //         "updated_at": "2023-06-20T13:40:45.793+07:00"
// //       },
// //       {
// //         "id": 3,
// //         "name": "Modul",
// //         "alias": "modul",
// //         "url": "",
// //         "icon": "",
// //         "parent": 0,
// //         "status": "1",
// //         "created_at": "2023-06-21T15:53:17.966+07:00",
// //         "updated_at": "2023-06-21T15:53:17.966+07:00"
// //       },
// //       {
// //         "id": 4,
// //         "name": "Absen",
// //         "alias": "absen",
// //         "url": "",
// //         "icon": "pi pi-fw pi-check-square",
// //         "parent": 3,
// //         "status": "1",
// //         "created_at": "2023-06-21T15:59:24.415+07:00",
// //         "updated_at": "2023-06-21T15:59:24.415+07:00"
// //       },
// //       {
// //         "id": 5,
// //         "name": "List Absen",
// //         "alias": "list-absen",
// //         "url": "/absen/list",
// //         "icon": "pi pi-chevron-circle-right",
// //         "parent": 4,
// //         "status": "1",
// //         "created_at": "2023-06-21T15:59:24.415+07:00",
// //         "updated_at": "2023-06-21T15:59:24.415+07:00"
// //       },
// //       {
// //         "id": 4,
// //         "name": "List Cuti",
// //         "alias": "list-cuti",
// //         "url": "/cuti/list",
// //         "icon": "pi pi-chevron-circle-right",
// //         "parent": 4,
// //         "status": "1",
// //         "created_at": "2023-06-21T15:59:24.415+07:00",
// //         "updated_at": "2023-06-21T15:59:24.415+07:00"
// //       }
// // ];

// const getChild = (id) => {
//     return menu.value.filter(item => item.parent === id);
// }

// const getParent = () => {
//     return menu.value.filter(item => item.parent === 0);
// }
// // const parent = menu.filter(item => item.parent === 0);

// let count = 0;
// const genArr = (arr) => {
//     let dataArr = [];
//     // count++;
//     // if (count === 5) {
//     //     return
//     // }
//     arr.forEach( (item, i) => {
//         // console.log(i, arr);
//         let obj = {};
//         let child = getChild(item.id);

//         if(item.name) obj.label = item.name;
//         if(item.icon) obj.icon = item.icon;
//         if(item.url) obj.to = item.url;
//         if (child.length > 0) obj.items = genArr(child);
//         dataArr.push(obj);
//     });
//     return dataArr;
// }

// onMounted(() => {
//     // const dataLocal = localStorage.getItem('sipam');
//     const userDivisi = JSON.parse(dataLocal).divisi;
//     console.log(JSON.parse(dataLocal));
//     let params ={
//         divisi : userDivisi
//     }
//     menuService.getListMenuDivisi(params).then((data) => {
//         menu.value = data;
//         console.log(menu);
//         let fs = genArr(getParent());
//         if (userDivisi!==1) {
//             model.value = fs;
//         } else {
//             model.value = nav.value;
//         }
//     })
// // Log to console
// })

const nav = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'TaskList',
        items: [{ label: 'TaskLiast', icon: 'pi pi-fw pi-home', to: '/Tasklist' }]
    },
    {
        label: 'Modul',
        items: [
            {
                label: 'Surat',
                icon: 'pi pi-fw pi-file',
                items: [
                    // { label: 'External', icon: 'pi pi-fw pi-eye', to: '/surat-external/list', badge: 'NEW' },
                    { label: 'External', icon: 'pi pi-fw pi-eye', to: '/surat-external/list' },
                    { label: 'Internal', icon: 'pi pi-fw pi-eye', to: '/surat-internal/list' },
                    { label: 'Surat Masuk', icon: 'pi pi-fw pi-eye', to: '/surat-masuk/list' },
                ]
            },
            {
                label: 'Absen',
                icon: 'pi pi-fw pi-check-square',
                // to: '/absen/list'
                items: [
                    { label: 'List Absen', icon: 'pi pi-chevron-circle-right', to: '/absen/list', badge: 'NEW' },
                    { label: 'List Cuti', icon: 'pi pi-chevron-circle-right', to: '/cuti/list' },
                    { label: 'List Izin', icon: 'pi pi-chevron-circle-right', to: '/izin/list' },
                ]
            },
            {
                label: 'Accounting',
                icon: 'pi pi-fw pi-check-square',
                // to: '/absen/list'
                items: [
                    { label: 'Account List', icon: 'pi pi-chevron-circle-right', to: '/accounting/account-list', badge: 'NEW' },
                //     { label: 'List Cuti', icon: 'pi pi-chevron-circle-right', to: '/cuti/list' },
                //     { label: 'List Izin', icon: 'pi pi-chevron-circle-right', to: '/izin/list' },
                ]
            },
            {
                label: 'Scheduler',
                icon: 'pi pi-fw pi-stopwatch',
                to: '/scheduler/list'
            },
            {
                label: 'Signer External',
                icon: 'pi pi-fw pi-user-edit',
                to: '/signer-external'
            },
            {
                label: 'Webinar',
                icon: 'pi pi-fw pi-desktop',
                to: '/webinar/list'
            },
            // {
            //     label: 'Absensi',
            //     icon: 'pi pi-fw pi-check-square',
            //     url: 'https://github.com/primefaces/sakai-vue',
            //     target: '_blank'
            // }
        ]
    },
    {
        label: 'Admin',
        items: [
            { label: 'Category', icon: 'pi pi-fw pi-th-large', to: '/admin/category' },
            { label: 'Template', icon: 'pi pi-fw pi-id-card', to: '/admin/template' },
            { label: 'User', icon: 'pi pi-fw pi-user-edit', to: '/admin/user' },
            { label: 'Divisi', icon: 'pi pi-fw pi-chart-pie', to: '/admin/divisi' },
            { label: 'Position', icon: 'pi pi-fw pi-chart-pie', to: '/admin/position' },
            { label: 'Menu', icon: 'pi pi-fw pi-th-large', to: '/admin/menu' },
            { label: 'Privilege', icon: 'pi pi-fw pi-shield', to: '/admin/privilege' },
        ]
    },
    // {
    //     label: 'UI Components',
    //     items: [
    //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
    //         { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
    //         { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
    //         { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
    //         { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
    //         { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
    //         { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
    //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
    //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
    //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
    //         { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
    //         { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
    //         { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
    //         { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
    //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
    //         { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
    //     ]
    // },
    // {
    //     label: 'Prime Blocks',
    //     items: [
    //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW' },
    //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://www.primefaces.org/primeblocks-vue', target: '_blank' }
    //     ]
    // },
    // {
    //     label: 'Utilities',
    //     items: [
    //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
    //         { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: 'https://www.primefaces.org/primeflex/', target: '_blank' }
    //     ]
    // },
    // {
    //     label: 'Pages',
    //     icon: 'pi pi-fw pi-briefcase',
    //     to: '/pages',
    //     items: [
    //         {
    //             label: 'Landing',
    //             icon: 'pi pi-fw pi-globe',
    //             to: '/landing'
    //         },
    //         {
    //             label: 'Auth',
    //             icon: 'pi pi-fw pi-user',
    //             items: [
    //                 {
    //                     label: 'Login',
    //                     icon: 'pi pi-fw pi-sign-in',
    //                     to: '/auth/login'
    //                 },
    //                 {
    //                     label: 'Error',
    //                     icon: 'pi pi-fw pi-times-circle',
    //                     to: '/auth/error'
    //                 },
    //                 {
    //                     label: 'Access Denied',
    //                     icon: 'pi pi-fw pi-lock',
    //                     to: '/auth/access'
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Crud',
    //             icon: 'pi pi-fw pi-pencil',
    //             to: '/pages/crud'
    //         },
    //         {
    //             label: 'Timeline',
    //             icon: 'pi pi-fw pi-calendar',
    //             to: '/pages/timeline'
    //         },
    //         {
    //             label: 'Not Found',
    //             icon: 'pi pi-fw pi-exclamation-circle',
    //             to: '/pages/notfound'
    //         },
    //         {
    //             label: 'Empty',
    //             icon: 'pi pi-fw pi-circle-off',
    //             to: '/pages/empty'
    //         }
    //     ]
    // },
    // {
    //     label: 'Hierarchy',
    //     items: [
    //         {
    //             label: 'Submenu 1',
    //             icon: 'pi pi-fw pi-bookmark',
    //             items: [
    //                 {
    //                     label: 'Submenu 1.1',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [
    //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
    //                     ]
    //                 },
    //                 {
    //                     label: 'Submenu 1.2',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Submenu 2',
    //             icon: 'pi pi-fw pi-bookmark',
    //             items: [
    //                 {
    //                     label: 'Submenu 2.1',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [
    //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
    //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
    //                     ]
    //                 },
    //                 {
    //                     label: 'Submenu 2.2',
    //                     icon: 'pi pi-fw pi-bookmark',
    //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     label: 'Get Started',
    //     items: [
    //         {
    //             label: 'Documentation',
    //             icon: 'pi pi-fw pi-question',
    //             to: '/documentation'
    //         },
    //         {
    //             label: 'View Source',
    //             icon: 'pi pi-fw pi-search',
    //             url: 'https://github.com/primefaces/sakai-vue',
    //             target: '_blank'
    //         }
    //     ]
    // }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <!-- <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li> -->
    </ul>
</template>

<style lang="scss" scoped></style>
