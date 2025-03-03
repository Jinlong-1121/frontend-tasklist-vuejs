import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/pages/Welcome.vue')
                },
                {
                    path: '/Tasklist',
                    name: 'TaskList',
                    component: () => import('@/views/pages/TaskList.vue')
                },
                {
                    path: '/admin/divisi',
                    name: 'admin-divisi',
                    component: () => import('@/views/admin/divisi/DivisiList.vue')
                },
                {
                    path: '/admin/position',
                    name: 'admin-position',
                    component: () => import('@/views/admin/position/PositionList.vue')
                },
                {
                    path: '/admin/menu',
                    name: 'admin-menu',
                    component: () => import('@/views/admin/menu/MenuList.vue')
                },
                {
                    path: '/admin/privilege',
                    name: 'admin-privilege',
                    component: () => import('@/views/admin/privilege/PrivilegeList.vue')
                },
                {
                    path: '/admin/user',
                    name: 'admin-user',
                    component: () => import('@/views/admin/user/UserList.vue')
                },
                {
                    path: '/admin/template',
                    name: 'admin-template',
                    component: () => import('@/views/admin/template/TemplateList.vue')
                },
                {
                    path: '/admin/category',
                    name: 'admin-category',
                    component: () => import('@/views/admin/category/CategoryList.vue')
                },
                {
                    path: '/admin/template/form',
                    name: 'admin-template-form',
                    component: () => import('@/views/admin/template/TemplateForm.vue')
                },
                {
                    path: '/admin/template/form/:id',
                    name: 'admin-template-edit',
                    component: () => import('@/views/admin/template/TemplateForm.vue')
                },
                //Route absensi
                {
                    path: '/absen/list',
                    name: 'absen-list',
                    component: () => import('@/views/absen/AbsenList.vue')
                },
                {
                    path: '/cuti/list',
                    name: 'cuti-list',
                    component: () => import('@/views/absen/CutiList.vue')
                },
                {
                    path: '/izin/list',
                    name: 'izin-list',
                    component: () => import('@/views/absen/IzinList.vue')
                },
                {
                    path: '/absen/detail/:id',
                    name: 'absen-detail',
                    component: () => import('@/views/absen/AbsenDetail.vue')
                },
                //Route Scheduler
                {
                    path: '/scheduler/list',
                    name: 'scheduler-list',
                    component: () => import('@/views/scheduler/JobList.vue')
                },
                // Route webinar
                {
                    path: '/webinar/list',
                    name: 'webinar-list',
                    component: () => import('@/views/webinar/WebinarLists.vue'),
                    children: [
                        {
                            path: '/webinar/list',
                            component: () => import('@/views/webinar/list/WebinarEvent.vue')
                        },
                        {
                            path: '/webinar/list/past-webinar',
                            component: () => import('@/views/webinar/list/WebinarPast.vue')
                        }
                    ]
                },
                {
                    path: '/webinar/participant/list/:id',
                    name: 'participant-list',
                    component: () => import('@/views/webinar/ParticipantList.vue')
                },

                // SURAT EXTERNAL ROUTES
                {
                    path: '/surat-external/list',
                    name: 'surat-external-list',
                    component: () => import('@/views/surat-external/SuratList.vue'),
                    children: [
                        {
                            path: '/surat-external/list',
                            component: () => import('@/views/surat-external/list/SuratComplete.vue'),
                            meta: {
                                actionSearching: {
                                    methodName: "getListData",
                                }
                            }
                        },
                        {
                            path: '/surat-external/list/open',
                            component: () => import('@/views/surat-external/list/SuratOpen.vue')
                        },
                        {
                            path: '/surat-external/list/draft',
                            component: () => import('@/views/surat-external/list/SuratDraft.vue')
                        },
                        {
                            path: '/surat-external/list/waiting',
                            component: () => import('@/views/surat-external/list/SuratWaiting.vue')
                        },
                        {
                            path: '/surat-external/list/signer',
                            component: () => import('@/views/surat-external/list/SuratNeedSign.vue')
                        },
                        {
                            path: '/surat-external/list/upload-documents',
                            component: () => import('@/views/surat-external/list/SuratUploadDocuments.vue')
                        },
                        {
                            path: '/surat-external/list/surat-cancel',
                            component: () => import('@/views/surat-external/list/SuratCancel.vue')
                        }
                    ]
                },
                {
                    path: '/surat/external/create',
                    name: 'surat-external-create',
                    component: () => import('@/views/surat-external/SuratCreate.vue'),
                    children: [
                        {
                            path: '/surat/external/create',
                            component: () => import('@/views/surat-external/create/SuratTemplate.vue')
                        },
                        {
                            path: '/surat/external/create/form',
                            component: () => import('@/views/surat-external/create/SuratForm.vue')
                        },
                        {
                            path: '/surat/external/create/preview',
                            component: () => import('@/views/surat-external/create/SuratPreview.vue')
                        },
                        {
                            path: '/surat/masuk/balas/:id',
                            component: () => import('@/views/surat-external/create/SuratTemplate.vue')
                        },
                    ]
                },
                {
                    path: '/surat/external/edit/:id',
                    name: 'surat-external-edit',
                    component: () => import('@/views/surat-external/SuratEdit.vue'),
                    children: [
                        {
                            path: '/surat/external/edit/:id',
                            component: () => import('@/views/surat-external/edit/EditSuratTemplate.vue')
                        },
                        {
                            path: '/surat/external/edit/:id/form',
                            component: () => import('@/views/surat-external/edit/EditSuratForm.vue')
                        },
                        {
                            path: '/surat/external/edit/:id/preview',
                            component: () => import('@/views/surat-external/edit/EditSuratPreview.vue')
                        }
                    ]
                },
                {
                    path: '/surat-external/preview/:id',
                    name: 'surat-external',
                    component: () => import('@/views/surat-external/SuratPreview.vue'),
                },
                // END SURAT EXTERNAL ROUTES

                // SURAT INTERNAL ROUTES
                {
                    path: '/surat-internal/list',
                    name: 'surat-internal-list',
                    component: () => import('@/views/surat-internal/SuratList.vue'),
                    children: [
                        {
                            path: '/surat-internal/list',
                            component: () => import('@/views/surat-internal/list/SuratComplete.vue')
                        },
                        {
                            path: '/surat-internal/list/open',
                            component: () => import('@/views/surat-internal/list/SuratOpen.vue')
                        },
                        {
                            path: '/surat-internal/list/draft',
                            component: () => import('@/views/surat-internal/list/SuratDraft.vue')
                        },
                        {
                            path: '/surat-internal/list/waiting',
                            component: () => import('@/views/surat-internal/list/SuratWaiting.vue')
                        },
                        {
                            path: '/surat-internal/list/signer',
                            component: () => import('@/views/surat-internal/list/SuratNeedSign.vue')
                        }
                    ]
                },
                {
                    path: '/surat/internal/create',
                    name: 'surat-internal-create',
                    component: () => import('@/views/surat-internal/SuratCreate.vue'),
                    children: [
                        {
                            path: '/surat/internal/create',
                            component: () => import('@/views/surat-internal/create/SuratTemplate.vue')
                        },
                        {
                            path: '/surat/internal/create/form',
                            component: () => import('@/views/surat-internal/create/SuratForm.vue')
                        },
                        {
                            path: '/surat/internal/create/preview',
                            component: () => import('@/views/surat-internal/create/SuratPreview.vue')
                        },
                        {
                            path: '/surat/internal/balas/:id',
                            component: () => import('@/views/surat-internal/create/SuratTemplate.vue')
                        },
                    ]
                },
                {
                    path: '/surat/internal/edit/:id',
                    name: 'surat-internal-edit',
                    component: () => import('@/views/surat-internal/SuratEdit.vue'),
                    children: [
                        {
                            path: '/surat/internal/edit/:id',
                            component: () => import('@/views/surat-internal/edit/EditSuratTemplate.vue')
                        },
                        {
                            path: '/surat/internal/edit/:id/form',
                            component: () => import('@/views/surat-internal/edit/EditSuratForm.vue')
                        },
                        {
                            path: '/surat/internal/edit/:id/preview',
                            component: () => import('@/views/surat-internal/edit/EditSuratPreview.vue')
                        }
                    ]
                },
                {
                    path: '/surat-internal/preview/:id',
                    name: 'surat-internal',
                    component: () => import('@/views/surat-internal/SuratPreview.vue'),
                },
                {
                    path: '/signer-external',
                    name: 'signer-external',
                    component: () => import('@/views/signer-external/SignerExternalList.vue'),
                },
                {
                    path: '/accounting/account-list',
                    name: 'account-list',
                    component: () => import('@/views/accounting/AccountRecord.vue'),
                },
                // END SURAT INTERNAL ROUTES

                // SURAT MASUK ROUTES
                {
                    path: '/surat-masuk/list',
                    name: 'surat-masuk-list',
                    component: () => import('@/views/surat-masuk/SuratList.vue'),
                    children: [
                        {
                            path: '/surat-masuk/list',
                            component: () => import('@/views/surat-masuk/list/SuratMasuk.vue')
                        },
                        // {
                        //     path: '/surat-masuk/list/open',
                        //     component: () => import('@/views/surat-masuk/list/SuratOpen.vue')
                        // },
                        {
                            path: '/surat-masuk/list/draft',
                            component: () => import('@/views/surat-masuk/list/SuratMasukDraft.vue')
                        },
                        {
                            path: '/surat-masuk/list/waiting',
                            component: () => import('@/views/surat-masuk/list/SuratMasukNeedVerif.vue')
                        }
                    ]
                },
                {
                    path: '/surat/masuk/create',
                    name: 'surat-masuk-create',
                    component: () => import('@/views/surat-masuk/SuratCreate.vue'),
                    children: [
                        {
                            path: '/surat/masuk/create',
                            component: () => import('@/views/surat-masuk/create/SuratForm.vue')
                        },
                        {
                            path: '/surat/external/balas/:id',
                            component: () => import('@/views/surat-masuk/create/SuratForm.vue')
                        },
                        {
                            path: '/surat/masuk/create/preview',
                            component: () => import('@/views/surat-masuk/create/SuratPreview.vue')
                        }
                    ]
                },
                {
                    path: '/surat/masuk/edit/:id',
                    name: 'surat-masuk-edit',
                    component: () => import('@/views/surat-masuk/SuratEdit.vue'),
                    children: [
                        {
                            path: '/surat/masuk/edit/:id',
                            component: () => import('@/views/surat-masuk/edit/EditSuratForm.vue')
                        },
                        {
                            path: '/surat/masuk/edit/:id/preview',
                            component: () => import('@/views/surat-masuk/edit/EditSuratPreview.vue')
                        }
                    ]
                },
                // {
                //     path: '/surat/masuk/page',
                //     name: 'surat-masuk-page',
                //     component: () => import('@/views/surat-masuk/SuratLink.vue'),
                // },
                // {
                //     path: '/surat/masuk/:link',
                //     name: 'surat-masuk-page',
                //     component: () => import('@/views/surat-masuk/SuratLink.vue'),
                // },
                {
                    path: '/surat-masuk/preview/:id',
                    name: 'surat-masuk',
                    component: () => import('@/views/surat-masuk/SuratPreview.vue'),
                },
                // END SURAT MASUK ROUTES

                // {
                //     path: '/nasabah',
                //     // name: 'nasabah',
                //     component: () => import('@/views/nasabah/Index.vue'),
                //     children: [
                //         {
                //             path: 'list',
                //             name: 'nasabah-list',
                //             component: () => import('@/views/nasabah/NasabahList.vue')
                //         },
                //         {
                //             path: '/detail/:id',
                //             name: 'nasabah-detail',
                //             component: () => import('@/views/nasabah/NasabahDetail.vue')
                //         },
                //     ]
                // },
            ]
        },
        // {
        //     path: '/landing',
        //     name: 'landing',
        //     component: () => import('@/views/pages/Landing.vue')
        // },
        {
            path: '/surat/masuk/page',
            name: 'surat-masuk-page',
            component: () => import('@/views/surat-masuk/SuratLink.vue'),
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/auth/Error.vue')
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    const isAuthenticated = localStorage.getItem('sipam');
    if (to.name !== 'login' && !isAuthenticated){
        if (to.name === 'surat-masuk-page') next()
        else  next({ name: 'login' })
    } 
    else next()
    // redirect to login page if not logged in and trying to access a restricted page
    // const publicPages = ['/login'];
    // const authRequired = !publicPages.includes(to.path);
    // const auth = useAuthStore();

    // if (authRequired && !auth.user) {
    //     auth.returnUrl = to.fullPath;
    //     return '/login';
    // }
    // console.log(to);
});

export default router;
