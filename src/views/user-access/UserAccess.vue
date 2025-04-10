<script setup>
import { useToast } from 'primevue/usetoast';
import { ref, onMounted, watch, inject } from 'vue';
import UserService from '@/service/UserService';
import ActivityLogService from '@/service/ActivityLogService';
import bcrypt from 'bcryptjs';
import { useRouter } from 'vue-router';
import SignaturePad from 'signature_pad';

// Handling password update functionality
const loading = ref(false);
const submitted = ref(false);
const router = useRouter();
const toast = useToast();
const userService = new UserService();
const activityLogService = new ActivityLogService();

const swal = inject('$swal')

const showPasswordDialog = ref(false);
const enteredPassword = ref(null);
const User = ref(null);
const Speciment = ref(null);
const PinAccess = ref(null);

const ActivityLogLogin = ref();

const preview = ref(null);
const base64 = ref(null);

const showSignatureDialog = ref(false);
const signature = ref({});
const submittedSignature = ref(false);
const editedSignature = ref(false);

const currentPassword = ref();
const newPassword = ref();
const reTypeNewPassword = ref();
const showPinAccess = ref(false);
const signaturePad = ref(null); // Signature pad instance reference
const dataUser = JSON.parse(localStorage.getItem('sipam'));

const email = ref('');
const password = ref('');

// Get user data
const getListData = () => {
    const id = JSON.parse(localStorage.getItem('sipam')).target;
    userService.getListData(id).then((data) => {
        User.value = data;
        PinAccess.value = data.pin_access;
    });
};

const getSpeciment = () => {
    const id = JSON.parse(localStorage.getItem('sipam')).pin;
    userService.getSpeciment(id).then((data) => {
        Speciment.value = data.speciment;
    });
};

// Update password logic
const updatePassword = async () => {
    const dataAbsen = {
        current_password: currentPassword.value,
        new_password: newPassword.value,
        re_type_new_password: reTypeNewPassword.value,
    };

    try {
        await userService.updatePassword(dataAbsen);
        loading.value = true; // Start loading
        toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Sukses Update Password', life: 3000 });

        setTimeout(() => {
            localStorage.removeItem("sipam"); // Clear the local storage
            router.push('/auth/login'); // Redirect to login page
        }, 3000); // Wait for 3 seconds before redirecting

    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to update password', life: 3000 });
    } finally {
        loading.value = false; // Stop loading
    }
};

// Update pin access logic
const updateListPinAccess = async () => {
    const id = JSON.parse(localStorage.getItem('sipam')).target;

    try {
        const updatedData = await userService.updateListPinAccess(id);
        PinAccess.value = updatedData.pin_access;

        toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Sukses Update Pin Access Surat', life: 3000 });

        // Sembunyikan kembali pin setelah update
        showPinAccess.value = false;

    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Failed to update Pin Access Surat', life: 3000 });
    }
};


// Copy to clipboard logic
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Copied to clipboard', life: 3000 });
        }).catch(err => {
            console.error('Failed to copy: ', err);
            toast.add({ severity: 'error', summary: 'Failed', detail: 'Failed to copy to clipboard', life: 3000 });
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Copied to clipboard', life: 3000 });
    }
}

// Save updated password
const saveUpdatePassword = async () => {
    submitted.value = true;
    if (!currentPassword.value || !newPassword.value || !reTypeNewPassword.value) {
        loading.value = false;
        return;
    }
    await updatePassword();
};

// Handle confirm password and toggle pin access visibility
const confirmPasswordAndToggle = async () => {
    const storedHash = User.value.password;
    const isPasswordValid = await bcrypt.compare(enteredPassword.value, storedHash);

    if (isPasswordValid) {
        showPinAccess.value = !showPinAccess.value;
        showPasswordDialog.value = false;
        enteredPassword.value = '';
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid password', life: 3000 });
    }
};

const confirmSign = async () => {
    // Close the signature dialog only after successful submission
    showSignatureDialog.value = false;

    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    // Show confirmation dialog
    const result = await swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "Do you want to submit this signature?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    });

    // If user cancels, stop the process
    if (!result.isConfirmed) {
        await swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your signature was not submitted.',
            'error'
        );
        return;
    }

    // Proceed with signature submission
    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = 158; // Desired width for data URL
    offScreenCanvas.height = 87; // Desired height for data URL

    const offScreenContext = offScreenCanvas.getContext('2d');

    // Draw the signature from the original canvas to the off-screen canvas with scaling
    offScreenContext.scale(158 / 400, 87 / 200); // Scale the drawing to fit the new resolution
    offScreenContext.drawImage(signaturePad.value.canvas, 0, 0);

    // Get the data URL from the off-screen canvas
    const dataURL = offScreenCanvas.toDataURL();
    const id = JSON.parse(localStorage.getItem('sipam')).target;

    const params = { speciment: `data:image/png;base64,${base64.value}` }; // Adjust according to your API needs
    try {
        // Upload signature
        await userService.UploadSign(params, id);

        // Show success message
        await swalWithBootstrapButtons.fire(
            'Success!',
            'Your signature has been submitted.',
            'success'
        );

        // Remove item from localStorage and redirect after submission
        localStorage.removeItem("sipam");

        setTimeout(() => {
            localStorage.removeItem("sipam"); // Clear the local storage
            router.push('/auth/login'); // Redirect to login page
        }, 1000); // Wait for 1 seconds before redirecting

    } catch (error) {
        console.error("Error submitting signature:", error);
        swalWithBootstrapButtons.fire(
            'Error!',
            'Something went wrong while submitting your signature.',
            'error'
        );
    }
};

// Toggle pin access visibility
const togglePinAccessVisibility = () => {
    if (!showPinAccess.value) {
        showPasswordDialog.value = true;
    } else {
        showPinAccess.value = !showPinAccess.value;
    }
};

// Reset password dialog
const closePasswordDialog = () => {
    showPasswordDialog.value = false;
    enteredPassword.value = '';
};

// Signature Pad logic
const signatureCanvasRef = ref(null);
const canvasWidth = ref(400);
const canvasHeight = ref(200);

// Function to update canvas size based on screen width
const updateCanvasSize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 400) {
        // Mobile screen, set smaller canvas size
        canvasWidth.value = screenWidth - 40;  // Reduce a little for padding/margin
        canvasHeight.value = (canvasWidth.value * 1) / 2;  // Maintain aspect ratio of 2:1 (width:height)
    } else {
        // Desktop screen, set larger canvas size
        canvasWidth.value = 400;
        canvasHeight.value = 200;
    }
};

// Initialize SignaturePad when the component is mounted
const initSignaturePad = () => {
    const canvas = signatureCanvasRef.value;
    if (canvas) {
        canvas.width = canvasWidth.value;  // Set canvas width dynamically
        canvas.height = canvasHeight.value;  // Set canvas height dynamically
        signaturePad.value = new SignaturePad(canvas);  // Initialize SignaturePad with canvas
    }
};

const saveSignature = async () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    if (signaturePad.value.isEmpty()) {
        swalWithBootstrapButtons.fire(
            'Error!',
            'Please provide a signature.',
            'error'
        );
        return; // Stop execution if no signature
    }

    // Show confirmation dialog
    const result = await swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "Do you want to submit this signature?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    });

    // If user cancels, do nothing
    if (!result.isConfirmed) {
        swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your signature was not submitted.',
            'error'
        );
        return;
    }

    // If user confirms, proceed with signature submission
    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = 158; // Desired width for data URL
    offScreenCanvas.height = 87; // Desired height for data URL

    const offScreenContext = offScreenCanvas.getContext('2d');

    // Draw the signature from the original canvas to the off-screen canvas with scaling
    offScreenContext.scale(158 / 400, 87 / 200); // Scale the drawing to fit the new resolution
    offScreenContext.drawImage(signaturePad.value.canvas, 0, 0);

    // Get the data URL from the off-screen canvas
    const dataURL = offScreenCanvas.toDataURL();
    const id = JSON.parse(localStorage.getItem('sipam')).target;

    const params = { speciment: dataURL }; // Adjust according to your API needs

    try {
        // Upload signature
        await userService.UploadSign(params, id);

        // Show success message
        await swalWithBootstrapButtons.fire(
            'Success!',
            'Your signature has been submitted.',
            'success'
        );

        setTimeout(() => {
            router.push('/user/access'); // Redirect to login page
        }, 1000); // Wait for 1 seconds before redirecting

    } catch (error) {
        console.error("Error submitting signature:", error);
        swalWithBootstrapButtons.fire(
            'Error!',
            'Something went wrong while submitting your signature.',
            'error'
        );
    }
};

const clearSignature = () => {
    signaturePad.value.clear();
};

const handleFileUpload = (event) => {
    const file = event.files[0]; // Mengambil file dari event.files
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = () => {
                // Target canvas size
                const targetWidth = 158;
                const targetHeight = 87;

                // Hitung rasio untuk scaling tanpa memotong
                const originalWidth = image.width;
                const originalHeight = image.height;
                const aspectRatio = Math.min(
                    targetWidth / originalWidth,
                    targetHeight / originalHeight
                );

                // Hitung dimensi baru
                const scaledWidth = originalWidth * aspectRatio;
                const scaledHeight = originalHeight * aspectRatio;

                // Atur canvas dengan dimensi target
                const canvas = document.createElement("canvas");
                canvas.width = targetWidth;
                canvas.height = targetHeight;

                const ctx = canvas.getContext("2d");

                // Bersihkan canvas (opsional, jika diperlukan)
                ctx.clearRect(0, 0, targetWidth, targetHeight);

                // Gambarkan gambar yang sudah diskalakan ke tengah canvas
                ctx.drawImage(
                    image,
                    (targetWidth - scaledWidth) / 2, // Pusatkan secara horizontal
                    (targetHeight - scaledHeight) / 2, // Pusatkan secara vertikal
                    scaledWidth,
                    scaledHeight
                );

                // Mengubah hasil ke PNG
                const pngDataUrl = canvas.toDataURL("image/png");

                base64.value = pngDataUrl.split(",")[1]; // Mengambil Base64 tanpa prefix
            };
        };
        reader.readAsDataURL(file);
    }
};

watch([Speciment], () => {
    if (Speciment) {
        drawSignature(Speciment.value);
    }
});

const drawSignature = () => {
    if (Speciment.value) {
        const canvas = signatureCanvasRef.value;
        const ctx = canvas.getContext("2d");
        const image = new Image();

        // Set ukuran canvas sesuai spesimen
        canvas.width = 400; // Atur ukuran sesuai kebutuhan
        canvas.height = 200;

        // Base64 tanda tangan dari database
        image.src = `${Speciment.value}`;

        image.onload = () => {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
    }
};

const setFormatDate2 = (date) => {
  if (!date) return "-"; // Jika nilai kosong atau tidak valid, kembalikan "-"

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-"; // Jika bukan tanggal valid, kembalikan "-"

  const padZero = (num) => (num < 10 ? "0" + num : num);

  const tahun = d.getFullYear();
  const bulan = padZero(d.getMonth() + 1);
  const tanggal = padZero(d.getDate());
  const jam = padZero(d.getHours());
  const menit = padZero(d.getMinutes());
  const detik = padZero(d.getSeconds());

  return `${tahun}-${bulan}-${tanggal} ${jam}:${menit}:${detik}`;
};

const getActivityLogLogin = () => {
    {
        activityLogService.getActivityLogLogin(dataUser.target).then((data) => {
            ActivityLogLogin.value = data.data
        });
    }
};

// Call getListData when the component is mounted
onMounted(() => {
    getActivityLogLogin();
    getListData();
    getSpeciment();
    initSignaturePad();
    drawSignature();
});

watch(
    () => window.innerWidth,
    () => {
        updateCanvasSize();
        initSignaturePad();  // Re-initialize the signature pad with new dimensions
    },
    { immediate: true }  // Run on initial mount
);

const openSignature = () => {
    signature.value = {};
    submittedSignature.value = false;
    showSignatureDialog.value = true;
};

const closeSignatureDialog = () => {
    showSignatureDialog.value = false;
};

</script>


<template>
    <Toast />

    <div class="grid">
        <div class="col-12">
            <div class="card">
                <div class="field">
                    <h5>Akses User</h5>

                    <div class="p-fluid formgrid grid">

                        <div class="field col-12 xl:col-6">
                            <div class="card">
                                <h5>Update Password</h5>
                                <div class="field vertical-layout">
                                    <label for="current-password">Current Password</label>
                                    <Password v-model.trim="currentPassword" type="password" required="true"
                                        v-model="value" />
                                    <small class="p-error" v-if="submitted && !currentPassword">Current Password is
                                        required.</small>
                                </div>

                                <div class="field vertical-layout">
                                    <label for="new-password">New Password</label>
                                    <Password v-model.trim="newPassword" type="password" required="true"
                                        v-model="value" />
                                    <small class="p-error" v-if="submitted && !newPassword">New Password is
                                        required.</small>
                                </div>

                                <div class="field vertical-layout">
                                    <label for="retype-password">Re-Type New Password</label>
                                    <Password v-model.trim="reTypeNewPassword" type="password" required="true"
                                        v-model="value" />
                                    <small class="p-error" v-if="submitted && !reTypeNewPassword">Re-Type New Password
                                        is required.</small>
                                </div>

                                <Button type="button" label="Update Password" :loading="loading"
                                    @click="saveUpdatePassword" />

                            </div>
                        </div>

                        <div class="field col-12 xl:col-6">
                            <div class="card">
                                <!-- Pin Access Surat -->
                                <h5>Pin Access Surat</h5>
                                <div class="flex items-center space-x-4 mt-3">
                                    <!-- Pin Access -->
                                    <b class="mr-2">
                                        {{ showPinAccess ? PinAccess : '******' }}
                                    </b>

                                    <!-- Icon Copy -->
                                    <div class="flex items-center ml-2">
                                        <img src="https://purwanto.co.id/img/icon/aa1f4fc1.svg" alt="Copy"
                                            @click="copyToClipboard(PinAccess)" class="cursor-pointer" />
                                    </div>

                                    <!-- Icon Toggle Show/Hide PinAccess -->
                                    <div class="flex items-center ml-3" @click="togglePinAccessVisibility">
                                        <i :class="showPinAccess ? 'pi pi-eye-slash text-lg' : 'pi pi-eye text-lg'"></i>
                                    </div>

                                    <!-- Icon Update -->
                                    <div v-if="showPinAccess">
                                        <div class="flex items-center ml-3">
                                            <img src="https://purwanto.co.id/img/icon/ab1f3fc4.svg" alt="Update"
                                                @click="updateListPinAccess" class="cursor-pointer" />
                                        </div>
                                    </div>
                                </div>

                                <!-- User Access Trail -->
                                <h5 class="mb-5 mt-6">User Access Trail</h5>
                                <div class="grid">
                                    <div class="col-5 font-bold mb-1">Last Login Success</div>
                                    <div class="col-7">{{ setFormatDate2(ActivityLogLogin?.last_login_success) || "-" }}
                                    </div>

                                    <div class="col-5 font-bold mb-1">Last Login Fail</div>
                                    <div class="col-7">{{ setFormatDate2(ActivityLogLogin?.last_login_fail) || "-" }}
                                    </div>

                                    <div class="col-5 font-bold mb-1">Last Logout</div>
                                    <div class="col-7">{{ setFormatDate2(ActivityLogLogin?.last_logout) || "-" }}</div>

                                    <div class="col-5 font-bold mb-1">Last Change Password</div>
                                    <div class="col-7">{{ setFormatDate2(ActivityLogLogin?.last_change_password) || "-" }}</div>

                                    <div class="col-5 font-bold mb-1">Success Login Frequency</div>
                                    <div class="col-7">{{ ActivityLogLogin?.success_login_frequency|| "0" }}</div>

                                    <div class="col-5 font-bold mb-1">Fail Login Frequency</div>
                                    <div class="col-7">{{ ActivityLogLogin?.fail_login_frequency|| "0" }}</div>

                                    <div class="col-5 font-bold mb-1">Logout Frequency</div>
                                    <div class="col-7">{{ ActivityLogLogin?.logout_frequency|| "0" }}</div>

                                    <div class="col-5 font-bold mb-1">Change Password Frequency</div>
                                    <div class="col-7">{{ ActivityLogLogin?.change_password_frequency|| "0" }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="field col-12 xl:col-6">
                            <div class="card">
                                <h5>Signature</h5>

                                <div v-if="Speciment !== ''"
                                    class="mb-3 flex items-center space-x-4 mt-3 font-bold text-green-700">
                                    Done
                                </div>

                                <div v-if="Speciment === ''"
                                    class="mb-3 flex items-center space-x-4 mt-3 font-bold text-red-700 ">
                                    Not registered Signature
                                </div>


                                <div>

                                    <canvas ref="signatureCanvasRef" style="border: 1px solid #000;"
                                        class="mb-3"></canvas>

                                    <Button v-if="Speciment === ''" type="button" label="Save" :loading="loading"
                                        @click="saveSignature" class="mb-3" />

                                    <Button v-if="Speciment !== ''" type="button" label="Update" :loading="loading"
                                        @click="saveSignature" class="mb-3" />

                                    <Button type="button" label="Clear" :loading="loading" @click="clearSignature"
                                        class="mb-3" />


                                    <Button type="button" label="Upload Via File" :loading="loading"
                                        @click="openSignature" class="mb-3" />
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>

    <!-- Add this dialog to prompt for password when showing PinAccess -->
    <Dialog v-model:visible="showPasswordDialog" header="Enter Password" :modal="true" :closable="false"
        :style="{ width: '300px' }">

        <div class="field col-12">
            <label for="field vertical-layout">Password</label>
            <Password v-model="enteredPassword" :feedback="false" type="password" required />
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" @click="closePasswordDialog" />
            <Button label="Confirm" icon="pi pi-check" @click="confirmPasswordAndToggle" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showSignatureDialog" header="Signature" :modal="true" :closable="false"
        :style="{ width: '380px' }">

        <div class="field col-12">
            <label for="field vertical-layout">Image</label>
            <FileUpload mode="basic" accept="image/*" @select="handleFileUpload" />
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" @click="closeSignatureDialog" />
            <Button label="Confirm" icon="pi pi-check" @click="confirmSign" />
        </template>
    </Dialog>

</template>


<style scoped>
/* Default styling for small screens */
/* .flex-center {
    display: block;
} */

.vertical-layout {
    display: flex;
    flex-direction: column;
    /* Stack label and Password vertically */
}

label {
    margin-bottom: 0.5rem;
    /* Add spacing below the label */
}


/* Apply flexbox centering for screens wider than 990px (tablets, desktops, etc.) */
@media (min-width: 990px) {
    .flex-center {
        display: flex;
        justify-content: center;
        /* Horizontal centering */
    }
}
</style>