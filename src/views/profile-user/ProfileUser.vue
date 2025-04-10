<script setup>
import { ref, onMounted, inject, nextTick } from 'vue';
import UserService from '@/service/UserService';
import { useRouter } from 'vue-router';

const loading = ref(false);
const dataUser = JSON.parse(localStorage.getItem('sipam'));
const userService = new UserService();

const base64 = ref(null);
const showPhotoDialog = ref(false);
const photo = ref({});
const submittedPhoto = ref(false);

const swal = inject('$swal');
const router = useRouter(); // Ini untuk menginisialisasi router

const User = ref(null);

onMounted(() => {
    getListData();

});

const getListData = () => {
    userService.getListData(dataUser.target).then((data) => {
        User.value = data;
    });
};


const setFormatDate = (data) => {
    let date = data ? new Date(data) : new Date();
    let tahun = date.getFullYear();
    let bulan = date.getMonth();
    let tanggal = date.getDate();

    switch (bulan) {
        case 0: bulan = "Januari"; break;
        case 1: bulan = "Februari"; break;
        case 2: bulan = "Maret"; break;
        case 3: bulan = "April"; break;
        case 4: bulan = "Mei"; break;
        case 5: bulan = "Juni"; break;
        case 6: bulan = "Juli"; break;
        case 7: bulan = "Agustus"; break;
        case 8: bulan = "September"; break;
        case 9: bulan = "Oktober"; break;
        case 10: bulan = "November"; break;
        case 11: bulan = "Desember"; break;
    }
    let tampilTanggal = tanggal + " " + bulan + " " + tahun;

    return tampilTanggal;
}

const openPhoto = () => {
    photo.value = {};
    submittedPhoto.value = false;
    showPhotoDialog.value = true;
};

const closePhotoDialog = () => {
    showPhotoDialog.value = false;
};

const handleFileUpload = (event) => {
    const file = event.files[0]; // Mengambil file dari event.files

    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const image = new Image();
            image.src = e.target.result;

            image.onload = () => {
                // Target ukuran canvas 472 x 709
                const targetWidth = 472;
                const targetHeight = 709;

                // Hitung rasio untuk scaling tanpa memotong
                const originalWidth = image.width;
                const originalHeight = image.height;
                const aspectRatio = Math.min(
                    targetWidth / originalWidth,
                    targetHeight / originalHeight
                );

                // Dimensi setelah diskalakan
                const scaledWidth = originalWidth * aspectRatio;
                const scaledHeight = originalHeight * aspectRatio;

                // Buat canvas untuk proses resizing
                const canvas = document.createElement("canvas");
                canvas.width = targetWidth;
                canvas.height = targetHeight;

                const ctx = canvas.getContext("2d");

                // Bersihkan canvas (opsional)
                ctx.clearRect(0, 0, targetWidth, targetHeight);

                // Gambar gambar yang sudah diskalakan ke tengah canvas
                ctx.drawImage(
                    image,
                    (targetWidth - scaledWidth) / 2, // Pusatkan secara horizontal
                    (targetHeight - scaledHeight) / 2, // Pusatkan secara vertikal
                    scaledWidth,
                    scaledHeight
                );

                // Konversi hasil ke format base64 PNG
                base64.value = canvas.toDataURL("image/png").split(",")[1]; // Ambil base64 tanpa prefix
            };
        };

        reader.readAsDataURL(file);
    }
};

const confirmPhoto = async () => {
    showPhotoDialog.value = false;

    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    const result = await swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "Do you want to submit this Photo Profile?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    });

    if (!result.isConfirmed) {
        await swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your signature was not submitted.',
            'error'
        );
        return;
    }

    const id = JSON.parse(localStorage.getItem('sipam')).target;
    const params = { photo: `data:image/png;base64,${base64.value}` };

    try {
        await userService.UploadPhoto(params, id);

        await swalWithBootstrapButtons.fire(
            'Success!',
            'Your photo profile has been submitted.',
            'success'
        );

        setTimeout(() => {
            router.push('/');

            setTimeout(() => {
                router.push('/user/profile'); // Redirect to user profile after 1 second
            }, 1000); // Delay 1 detik sebelum redirect ke profile
        }, 1000); // Delay 1 detik sebelum redirect ke profile


        await nextTick();

    } catch (error) {
        console.error("Error submitting photo:", error);
        swalWithBootstrapButtons.fire(
            'Error!',
            'Something went wrong while submitting your photo.',
            'error'
        );
    }
}
</script>

<template>
    <Toast />

    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="field">
                    <h5>Profile</h5>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 xl:col-4">
                            <div class="card">
                                <h5>Foto Profile</h5>
                                <div class="text-center">
                                    <Image
                                    :src="User?.photo ? User.photo : 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png'"
                                    alt="Foto Profile" width="250" class="" />

                                <Button type="button" label="Upload Photo" :loading="loading"
                                    @click="openPhoto" class="mb-3" />
                                </div>
                               
                            </div>
                        </div>

                        <div class="field col-12 xl:col-8">
                            <div class="card">
                                <h5 class="mb-5">Biodata</h5>

                                <div class="grid">
                                    <div class="col-4 font-bold mb-1">Nama Lengkap</div>
                                    <div class="col-8">{{ User?.name || "-" }}</div>

                                    <div class="col-4 font-bold mb-1">Email</div>
                                    <div class="col-8">{{ User?.email || "-" }}</div>

                                    <div class="col-4 font-bold mb-1">Nomor Telepon</div>
                                    <div class="col-8">{{ User?.phone || "-" }}</div>

                                    <div class="col-4 font-bold mb-1">Jenis Kelamin</div>
                                    <div class="col-8">{{ User?.gender === '1' ? "Laki-laki" : User?.gender === '2' ? "Perempuan" : "-" }}</div>

                                    <div class="col-4 font-bold mb-1">NPP</div>
                                    <div class="col-8">{{ User?.number_officer || "-" }}</div>

                                    <div class="col-4 font-bold mb-1">NIK KTP</div>
                                    <div class="col-8">{{ User?.id_card || "-" }}</div>

                                    <div class="col-4 font-bold mb-1">Tanggal Lahir</div>
                                    <div class="col-8">{{ setFormatDate(User?.dob) || "-" }}</div>

                                    <div class="col-4 font-bold mb-1">Tanggal Masuk</div>
                                    <div class="col-8">{{ setFormatDate(User?.join_date) || "-" }}</div>

                                    <div class="col-4 font-bold mb-1">Status Karyawan</div>
                                    <div class="col-8">{{ User?.status_karyawan === '1' ? "Karyawan Tetap Dengan Peobation 3 Bulan" : User?.status_karyawan === '2' ? "Karyawan Tetap" : User?.status_karyawan === '3' ? "Kontrak" : "-" }}</div>

                                    <div class="col-4 font-bold mb-1">Sign</div>
                                    <div v-if="User?.speciment != ''" class="col-8">
                                        <Image
                                            :src="User?.speciment"
                                            alt="Speciment photo" width="250" />
                                    </div>
                                    <div v-if="User?.speciment == ''" class="col-8">
                                       -
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>

            </div>
        </div>
    </div>

    <Dialog v-model:visible="showPhotoDialog" header="Photo Profile" :modal="true" :closable="false"
        :style="{ width: '380px' }">

        <div class="field col-12">
            <label for="field vertical-layout">Photo</label>
            <FileUpload mode="basic" accept="image/*" @select="handleFileUpload" />
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" @click="closePhotoDialog" />
            <Button label="Confirm" icon="pi pi-check" @click="confirmPhoto" />
        </template>
    </Dialog>


</template>
