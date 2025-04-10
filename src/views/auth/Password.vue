<script setup>
import { useLayout } from '@/layout/composables/layout';
import { inject, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import AuthService from '@/service/AuthService';

const swal = inject('$swal')
// import AppConfig from '@/layout/AppConfig.vue';

const email = ref('');

const authService = new AuthService;

const forgotPassword = () => {
    var params = {
        email: email.value,
    };

    if (!params.email) {
        // Tampilkan modal error jika email kosong
        const swalWithButtonsCustom = swal.mixin({
            customClass: {
                confirmButton: 'btnCustomSweetalert bg-yellow-500',
                cancelButton: 'btnCustomSweetalert bg-red-500'
            },
            buttonsStyling: false
        });

        swalWithButtonsCustom.fire({
            icon: 'error',
            title: 'Input!',
            text: 'Input Email tidak boleh kosong.',
        });

        return; // Hentikan eksekusi jika email kosong
    }

    authService.forgotPassword(params)
        .then((res) => {
            const swalWithBootstrapButtons = swal.mixin({
                customClass: {
                    confirmButton: 'btnCustomSweetalert bg-yellow-500',
                    cancelButton: 'btnCustomSweetalert bg-red-500'
                },
                buttonsStyling: false
            });

            if (res.code === 200) {
                // Jika sukses, tampilkan pesan lalu redirect ke /auth/login
                swalWithBootstrapButtons.fire(
                    'Success!',
                    'Password reset token has been sent to your email.',
                    'success'
                ).then(() => {
                    window.location.href = "http://192.168.4.250/sipam/#/auth/login";
                    // router.push('/'); // Redirect setelah user klik "OK"
                });

            } else {
                // Jika gagal (misalnya user tidak ditemukan)
                swalWithBootstrapButtons.fire(
                    'Error!',
                    res.message || 'Failed to process your request.',
                    'error'
                );
            }
        })
        .catch((error) => {
            // Tangani error jaringan atau lainnya
            const swalWithBootstrapButtons = swal.mixin({
                customClass: {
                    confirmButton: 'btnCustomSweetalert bg-yellow-500',
                    cancelButton: 'btnCustomSweetalert bg-red-500'
                },
                buttonsStyling: false
            });

            swalWithBootstrapButtons.fire(
                'Error!',
                'An error occurred while processing your request.',
                'error'
            );
        });
};


</script>

<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <!-- <div class="text-900 text-6xl font-medium mb-3">RDO Admin</div> -->
            <div>
                <!-- <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"> -->
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-6xl font-medium mb-3">SIPAM</div>
                        <span class="text-600 font-medium">Reset Password</span>
                    </div>

                    <div>
                        <label for="email" class="block text-900 font-medium text-xl mb-2">Email</label>
                        <InputText id="email" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5"
                            style="padding: 1rem" v-model="email" />

                        <label class="block  font-medium text-lg mb-2"></label>

                        <Button label="Kirim" class="w-full p-3 text-xl mt-5"
                            @click.prevent="forgotPassword()"></Button>

                        <div class="mt-4 text-center">
                            <a href="/sipam/#/auth/login" class="text-gray-500 hover:text-gray-700 mt-6 texr-center">Back
                                Login</a>
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
