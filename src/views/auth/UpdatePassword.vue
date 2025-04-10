<script setup>
import { useRouter, useRoute } from 'vue-router';
import { inject, ref, onMounted } from 'vue';
import AuthService from '@/service/AuthService';

const swal = inject('$swal');
const router = useRouter();
const route = useRoute();
const authService = new AuthService();

const email = ref('');
const token = ref('');
const new_password = ref('');
const re_type_new_password = ref('');

// Fungsi untuk memeriksa token saat halaman dimuat
const checkTokenValidity = async () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    email.value = route.query.email || '';
    token.value = route.query.token || '';

    if (!email.value || !token.value) {
        swalWithBootstrapButtons.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Invalid request. Missing email or token.',
        }).then(() => {
            window.location.href = "http://192.168.4.250/sipam/#/auth/login";
            // router.push('/');
        });
        return;
    }

    try {
        const response = await authService.cekForgotPassword({ email: email.value, token: token.value });

        // Cek jika response null atau bukan objek
        if (!response || typeof response !== 'object') {
            throw new Error("Invalid response from API");
        }

        if (response.code === 200) {

        } else {
            let errorMessage = response.message || 'An unknown error occurred.';
            swalWithBootstrapButtons.fire({
                icon: 'error',
                title: 'Error!',
                text: errorMessage,
            }).then(() => {
                window.location.href = "http://192.168.4.250/sipam/#/auth/login";
                // router.push('/');
            });
        }
    } catch (error) {
        console.error("Terjadi error saat verifikasi token:", error);

        swalWithBootstrapButtons.fire({
            icon: 'error',
            title: 'Error!',
            text: 'An error occurred while verifying your token.',
        }).then(() => {
            window.location.href = "http://192.168.4.250/sipam/#/auth/login";
            // router.push('/');
        });
    }
};

// Panggil saat halaman dimuat
onMounted(checkTokenValidity);

const updatePassword = () => {
    var params = {
        email: email.value,
        token: token.value,
        new_password: new_password.value,
        re_type_new_password: re_type_new_password.value,
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

    authService.updatePassword(params)
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
                    router.push('/'); // Redirect setelah user klik "OK"
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
                        <span class="text-600 font-medium">Update Password</span>
                    </div>

                    <div>
                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password Baru</label>
                        <Password id="password1" v-model="new_password" placeholder="Password Baru" :feedback="false"
                            class="w-full md:w-30rem mb-5" inputClass="w-full" inputStyle="padding:1rem"></Password>

                        <label for="password2" class="block text-900 font-medium text-xl mb-2">Re Type Password</label>
                        <Password id="password2" v-model="re_type_new_password" placeholder="Re Type Password"
                            :feedback="false" class="w-full md:w-30rem mb-5" inputClass="w-full"
                            inputStyle="padding:1rem"></Password>

                        <label class="block  font-medium text-lg mb-2"></label>

                        <Button label="Update Password" class="w-full p-3 text-xl mt-5"
                            @click.prevent="updatePassword()"></Button>
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
