<script setup>
import { useLayout } from '@/layout/composables/layout';
import { inject, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import AuthService from '@/service/AuthService';

const swal = inject('$swal')
// import AppConfig from '@/layout/AppConfig.vue';

const { layoutConfig, contextPath } = useLayout();
const email = ref('');
const password = ref('');
const dataAuth = ref({});

const router = useRouter();

const today = new Date();

// Mendapatkan waktu dalam zona waktu Jakarta (Asia/Jakarta)
const options = {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Format 24 jam
};

const formattedDate = today.toLocaleString('en-GB', options).replace(',', '').replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1 $4:$5:$6');

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
            text: 'Input Email atau Password tidak boleh kosong.'
        })
    } else {
        authService.authLogin(params).then((data) => {
            if (!data.error) {
                localStorage.setItem("sipam", JSON.stringify(data.data));
                localStorage.setItem('lastLoginTime', new Date().toISOString());

                const redirectTo = localStorage.getItem('redirectTo');
                localStorage.removeItem('redirectTo');

                router.push(redirectTo || '/');
            } else if (data.code == 403) {
                const swalWithButtonsCustom = swal.mixin({
                    customClass: {
                        confirmButton: 'btnCustomSweetalert bg-yellow-500',
                        cancelButton: 'btnCustomSweetalert bg-red-500'
                    },
                    buttonsStyling: false
                })

                swalWithButtonsCustom.fire({
                    icon: 'error',
                    title: 'Password Expired!',
                    text: data.message,
                    showCancelButton: true,
                    confirmButtonText: 'Reset Password',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "http://192.168.4.250/sipam/#/auth/forgot-password";
                    }
                });

            } else {
                const swalWithButtonsCustom = swal.mixin({
                    customClass: {
                        confirmButton: 'btnCustomSweetalert bg-yellow-500',
                        cancelButton: 'btnCustomSweetalert bg-red-500'
                    },
                    buttonsStyling: false
                })

                swalWithButtonsCustom.fire({
                    icon: 'error',
                    title: 'Login Gagal!',
                    text: data.error
                })
            }
        });
    }
}

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <!-- <div class="text-900 text-6xl font-medium mb-3">RDO Admin</div> -->
            <div>
            <!-- <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"> -->
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-6xl font-medium mb-3">SIPAM</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :feedback="false" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>

                        <!-- <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div> -->
                        <Button label="Sign In" class="w-full p-3 text-xl mt-5" @click.prevent="loginAction()"></Button>

                        <div class="mt-4 text-center">
                            <a href="/sipam/#/auth/forgot-password" class="text-gray-500 hover:text-gray-700 mt-6 texr-center">Lupa Password</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <AppConfig simple /> -->
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
