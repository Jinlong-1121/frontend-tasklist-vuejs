<script setup>
import { inject, ref, onMounted, onUpdated, reactive } from "vue";
import SuratService from '@/service/SuratService';
import VuePdfEmbed from 'vue-pdf-embed'
import { useRoute, useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast';

const swal = inject('$swal')

const route = useRoute();
const router = useRouter();
const paramId = route.params.id;

const suratService = new SuratService();
const dataPdf = ref();
const dataSinglePreview = ref({});
const dataCategoryPreview = ref({});
const dataSignerUser = ref({})
const dataSifatSurat = ref({});
// const statusSign = reactive(false)
const visibleModalSign = ref(false);
const toast = useToast();
const statusSign = ref(false)
const visibleFileOptional = ref(false)
const fileUploadedOptional = ref('')
const fileUploadedOptionalFiles = ref()
const fileUploadedOptionalPreview = ref('')
const visibleFileOptionalUpload = ref(false)
const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))

const page = ref(null);
const pdfSource = ref("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf");

const props = defineProps({ formData: Object })
const emit = defineEmits(['next-page', 'prev-page']);

onMounted(() => {
    // filterMonth.value = date;
    getListSingleData();
    if (dataSignerUser.value.is_sign === '0' && dataSinglePreview.value.status === '3') {
        statusSign.value = true
    }
});

const setPreviewCategory = () => {
    // return JSON.parse(dataSinglePreview.category).name
}

onUpdated(() => {
    getListSingleData();
    // // console.log('update', dataSinglePreview.data_form, dataSinglePreview);
    // const form = new FormData();
    // form.append("content", dataSinglePreview.formData.content)
    // for (let i = 0; i < dataSinglePreview.formData.attachment.length; i++) {
    //     form.append("attachment[]", dataSinglePreview.formData.attachment[i])
    // }
    // generatePDF(form);
});

const generatePreviewPDF = (data) => {
    const form = new FormData();
    form.append("content", data.content)
    form.append("document_id", data.id)
    for (let i = 0; i < data.attachment.length; i++) {
        form.append("attachment[]", data.attachment[i].asset_url)
    }
    generatePDF(form);
}

// GET SURAT EXTERNAL
const getListSingleData = () => {
    const param = {
        id: paramId
    }
    suratService.getDetail(param).then((data) => {
        if (data.status === '3' || data.status === '4') {

        } else {
            generatePreviewPDF(data);

        }
        dataSinglePreview.value = data;
        dataCategoryPreview.value = JSON.parse(data.category)

        if (data.document_nature) {
            try {
                dataSifatSurat.value = JSON.parse(data.document_nature);
            } catch (error) {
                dataSifatSurat.value = null; // Jika parsing gagal, set menjadi null
            }
        } else {
            dataSifatSurat.value = null; // Jika tidak ada data, set menjadi null
        }

        setUserIDSigner(data.signer)

        // Check if any of the conditions is true
        // Check if the user_id from signer matches dataLocalStorage.target
        const isSignerMatch = dataSinglePreview.value.signer.some(signer => signer.user_id === dataLocalStorage.target);
        const isTembusanMatch = dataSinglePreview.value.tembusan.some(tembusan => tembusan.user_id === dataLocalStorage.target);
        const isReceiverMatch = dataSinglePreview.value.receiver.some(receiver => receiver.user_id === dataLocalStorage.target);

        // Check other conditions
        const isVerificatorMatch = dataLocalStorage.target === dataSinglePreview.value.verificator.user_id;
        const isSenderMatch = dataLocalStorage.target === dataSinglePreview.value.sender.user_id;
        const isDivisiMatch = dataLocalStorage.divisi === 1;
        const isDireksiMatch = dataLocalStorage.divisi === 2;
        const isKomiteInvestasiMatch = dataLocalStorage.divisi === 3;


        // Determine if showTemplate should be called
        const shouldShowTemplate =
            (!isSignerMatch && !isTembusanMatch && !isVerificatorMatch && !isSenderMatch && !isDivisiMatch && !isDireksiMatch && !isKomiteInvestasiMatch && !isReceiverMatch);

        var accessFitur = JSON.parse(data.document_nature)

        // Show template if all conditions are false and isSignerMatch is false
        if (shouldShowTemplate) {
            showTemplate();
        }
    });
};
// END GET SURAT EXTERNAL

// USER ID
const setUserIDVerif = () => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    if (dataSinglePreview.value.verificator?.user_id === dataLocalStorage.target && dataSinglePreview.value.status === "2") {
        return true
    } else {
        return false
    }
}
const setUserIDSigner = (dataParam) => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    dataParam.map(item => {
        if (item.user_id === dataLocalStorage.target) {
            dataSignerUser.value = item
        }
    })
}

const setUserIDReference = (dataParam) => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    dataParam.map(item => {
        if (item.user_id === dataLocalStorage.target) {
            dataReferenceUser.value = item
        }
    })
}
// END USER ID

// HANDLE VERIF
const handleVerif = () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Verifikasi Surat!',
        text: "Anda yakin ingin verifikasi surat?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            dataSinglePreview.value.verificator.is_verification = "1"
            if (dataSinglePreview.value.need_attach === '1' && dataSinglePreview.value.asset_upload === '') {
                dataSinglePreview.value.status = "6"
            } else {
                dataSinglePreview.value.status = "3"
            }
            statusSign.value = true
            return suratService.putSurat(dataSinglePreview.value).then((res) => {
                if (!res.error) {
                    swalWithBootstrapButtons.fire(
                        'Success!',
                        'Surat berhasil diverifikasi.',
                        'success'
                    )
                    if (dataSinglePreview.value.need_attach === '1') {
                        router.push('/surat-internal/list/upload-documents');
                    } else {
                        router.push('/surat-internal/list/signer');
                    }
                } else {
                    toast.add({ severity: 'error', summary: 'Failed!', detail: res.data, life: 2000 });
                    dataSinglePreview.value.status = "2"
                    dataSignerUser.value.is_sign = "0"
                    statusSign.value = true
                }
            })
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {

        }
    })
}
// END HANDLE VERIF

// HANDLE REVISI
const handleRevisi = () => {
    swal.fire({
        title: 'Isi note revisi',
        input: 'textarea',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: (inputText) => {
            dataSinglePreview.value.note = inputText
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            dataSinglePreview.value.status = "1"
            suratService.putSurat(dataSinglePreview.value).then((res) => {
                swal.fire(
                    'Success!',
                    'Surat berhasil untuk direvisi.',
                    'success'
                )
                router.push('/surat-internal/list/open');
            });
        }
    })
}
// END HANDLE REVISI

const showTemplate = () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: 'Information Akses!',
        html: `<p>Anda tidak bisa melihat surat ini</p>`,
        icon: 'warning',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        allowOutsideClick: false, // Prevent closing by clicking outside
        allowEscapeKey: false,    // Prevent closing with Escape key
        willOpen: () => {
            // Add blur class to background element, not the body
            document.getElementById('app').classList.add('blur-background');
        },
        willClose: () => {
            // Remove blur class when modal closes
            document.getElementById('app').classList.remove('blur-background');
        },
        preConfirm: () => {
            router.push('/surat-external/list');
        }
    });
};

// HANDLE SIGNER
const handleSigner = () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Sign Surat!',
        text: "Anda yakin ingin sign surat ini?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sign',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
            // let sendData = {
            //     user_id: dataLocalStorage.target,
            //     document_id: dataSinglePreview.value.id,
            //     ref_id: dataSinglePreview.value.ref_id
            // }
            // // dataSinglePreview.value.status = "1"
            // suratService.postSign(sendData).then((res) => {
            //     visibleModalSign.value = true;
            //     viewSignValidate(res.data)
            // });
            const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
            let sendData = {
                user_id: dataLocalStorage.target,
                document_id: dataSinglePreview.value.id
            }
            // dataSinglePreview.value.status = "1"
            suratService.postSignNew(sendData).then((res) => {
                visibleModalSign.value = true;
                // if (res.data === "valid") {

                // }
                // viewSignValidate(res.data)
            });
        }
    })
}

const RejectCuti = () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'Reject Cuti!',
        text: "Anda yakin ingin reject cuti?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Reject',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
            let sendData = {
                user_id: dataLocalStorage.target,
                document_id: dataSinglePreview.value.id
            }
            // dataSinglePreview.value.status = "1"
            suratService.postRejectCuti(sendData).then((res) => {
                visibleModalSign.value = true;

            });
        }
    })
}

const handleSignerVIDAViaEmail = () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    if (dataLocalStorage.status_vida === "0" || dataLocalStorage.status_vida === "") {
        swalWithBootstrapButtons.fire({
            title: 'Perhatian!',
            text: 'Harap validasi User VIDA sebelum melanjutkan proses ini.',
            icon: 'error'
        });
    } else {
        swalWithBootstrapButtons.fire({
            title: 'Validasi Surat!',
            text: "Anda akan validasi surat melalui VIDA lewat email?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Signer',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true, // Tampilkan loading indicator saat tombol "Signer" diklik
            preConfirm: () => {
                return new Promise((resolve) => {
                    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"));
                    let sendData = {
                        user_id: dataLocalStorage.target,
                        document_id: dataSinglePreview.value.id,
                    };

                    suratService.postSignValidasi(sendData)
                        .then((res) => {
                            resolve(res); // Resolve promise dengan respons API
                        })
                        .catch((err) => {
                            console.error('API call error:', err);
                            // Handle error here, misalnya dengan menampilkan pesan error
                            toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal proses sign surat.', life: 3000 });
                        });
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Toast atau tampilkan pesan sukses setelah berhasil
                swalWithBootstrapButtons.fire({
                    title: 'Lanjutkan Melalui Email Anda!',
                    text: 'Silahkan cek email anda untuk validasi surat',
                    icon: 'warning'
                }).then(() => {
                    // Setelah pengguna menutup modal sukses, navigasi ke halaman signer
                    router.push('/surat-internal/list/signer');
                });
            }
        });
    }
};

// Function to initialize and clear PIN inputs
function initializePINInputs() {
    [...Array(6)].forEach((_, i) => {
        const input = document.getElementById(`pin-access-${i}`);
        if (input) {
            input.value = ''; // Clear the value
        }
    });
}

function handlePINInput(event, index) {
    const input = event.target;
    const nextInput = document.getElementById(`pin-access-${index + 1}`);
    const prevInput = document.getElementById(`pin-access-${index - 1}`);

    if (input.value.length === 1 && nextInput) {
        nextInput.focus();
    } else if (input.value.length === 0 && prevInput) {
        prevInput.focus();
    }
}

function handlePINKeyDown(event, index) {
    const input = event.target;
    const prevInput = document.getElementById(`pin-access-${index - 1}`);

    if (event.key === "Backspace" && input.value === "" && prevInput) {
        prevInput.focus();
    }
}

// Main function to handle signer via PIN
const handleSignerVIDAViaPIN = () => {
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    });

    if (dataLocalStorage.status_vida === "0" || dataLocalStorage.status_vida === "") {
        swalWithBootstrapButtons.fire({
            title: 'Perhatian!',
            text: 'Harap validasi User VIDA sebelum melanjutkan proses ini.',
            icon: 'error'
        });
    } else {
        swalWithBootstrapButtons.fire({
            title: 'Validasi Surat!',
            html: `
                <p>Anda akan validasi surat melalui VIDA lewat PIN?</p>
                <div style="display: flex; justify-content: center;">
                    ${[...Array(6)].map((_, i) => `
                        <input id="pin-access-${i}" 
                            class="swal2-input pin-input" 
                            maxlength="1" 
                            type="text" 
                            style="width: 40px; margin: 0 5px; text-align: center;" 
                            autocomplete="off">
                    `).join('')}
                </div>
                `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Signer',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
            didOpen: () => {
                // Attach event listeners programmatically
                [...Array(6)].forEach((_, i) => {
                    const input = document.getElementById(`pin-access-${i}`);
                    input.addEventListener('input', (event) => handlePINInput(event, i));
                    input.addEventListener('keydown', (event) => handlePINKeyDown(event, i));
                });
            },
            preConfirm: () => {
                return new Promise((resolve) => {
                    const pinAccess = [...Array(6)].map((_, i) => document.getElementById(`pin-access-${i}`).value).join('');
                    if (pinAccess.length !== 6) {
                        swalWithBootstrapButtons.showValidationMessage(
                            'PIN harus terdiri dari 6 digit.'
                        );
                        resolve(false);
                    } else {
                        const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"));
                        let sendData = {
                            user_id: dataLocalStorage.target,
                            document_id: dataSinglePreview.value.id,
                            pin_access: pinAccess
                        };

                        suratService.postSignVidaPin(sendData)
                            .then((res) => {
                                resolve(res);
                            })
                            .catch((err) => {
                                console.error('API call error:', err);
                                toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal proses sign surat.', life: 3000 });
                                resolve(false);
                            });
                    }
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value && result.value.code === 200) {
                    visibleModalSign.value = true;
                } else {
                    swalWithBootstrapButtons.fire({
                        title: 'Terjadi Kesalahan!',
                        text: 'Salah PIN. Silahkan coba lagi nanti.',
                        icon: 'error'
                    });
                    router.push('/surat-internal/preview/' + paramId);
                }
            } else {
                // console.log('User cancelled.');
            }
        });
    }


};


const handleURLToken = async () => {
    const hash = window.location.hash;
    const tokenMatch = hash.match(/token=(\w+)/);

    if (tokenMatch) {
        const token = tokenMatch[1]; // Ambil token dari hasil match

        const swalWithBootstrapButtons = swal.mixin({
            customClass: {
                confirmButton: 'btnCustomSweetalert bg-yellow-500',
                cancelButton: 'btnCustomSweetalert bg-red-500'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: 'Waiting!',
            text: "Apakah ingin melakukan proses verifikasi VIDA?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Signer',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true, // Tampilkan loading indicator saat tombol "Signer" diklik
            preConfirm: () => {
                return new Promise((resolve) => {
                    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"));
                    const sendData = {
                        user_id: dataLocalStorage.target,
                        document_id: parseInt(paramId),
                        token: token
                    };

                    suratService.postSignVida(sendData)
                        .then((res) => {
                            resolve(res); // Resolve promise dengan respons API
                        })
                        .catch((err) => {
                            console.error('API call error:', err);
                            resolve({ code: 500 }); // Resolve dengan objek yang menunjukkan error
                        });
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                if (result.value && result.value.code === 200) {
                    // Jika respons berhasil dengan code 200
                    visibleModalSign.value = true;
                } else {
                    // Jika respons mengandung code 500 atau kondisi lain yang perlu ditangani
                    swalWithBootstrapButtons.fire({
                        title: 'Terjadi Kesalahan!',
                        text: 'Gagal melakukan proses verifikasi VIDA. Silahkan coba lagi nanti.',
                        icon: 'error'
                    });
                }
            } else {
                // Handle case when user cancels
                // console.log('User cancelled.');
            }
        });
    }
};

onMounted(() => {
    handleURLToken();
});

const viewSignValidate = (url) => {
    const dualScreenLeft =
        window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop =
        window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
            ? document.documentElement.clientWidth
            : screen.width;
    const height = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
            ? document.documentElement.clientHeight
            : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
    const top = (height - 600) / 2 / systemZoom + dualScreenTop;
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no, width=500,height=600,left=${left},top=${top}`;

    // let newWindow = open(this.detail.sign_url, "test", params);
    let newWindow = open(url, "test", params);
    newWindow.onload = function () {
        newWindow.location.reload(true);
    };
}

const handleProcessSign = () => {
    visibleModalSign.value = false;
    let timerInterval;

    swal.fire({
        title: 'Waiting!',
        html: 'Sedang melakukan proses verifikasi.',
        timer: 3000,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            swal.showLoading();
        },
        willClose: () => {
            clearInterval(timerInterval);
        },
    }).then((result) => {
        if (result.dismiss === swal.DismissReason.timer) {
            const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"));
            const param = {
                id: paramId
            };

            suratService.getDetail(param).then((data) => {
                let success = false;
                data.signer.forEach(item => {
                    if (item.user_id === dataLocalStorage.target) {
                        if (item.is_sign === "1") {
                            success = true;
                        }
                        if (item.is_sign === "2") {
                            success = true;
                        }
                        return; // exit forEach loop after finding the target user
                    }
                });

                if (success) {
                    data.signer.forEach(item => {
                        if (item.user_id === dataLocalStorage.target) {
                            if (item.is_sign === "1") {
                                toast.add({ severity: 'success', summary: 'Successful', detail: 'Tandatangan berhasil', life: 3000 });
                                router.push('/surat-internal/preview/' + paramId);
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            }
                            if (item.is_sign === "2") {
                                toast.add({ severity: 'success', summary: 'Successful', detail: 'Reject Cuti berhasil', life: 3000 });
                                router.push('/surat-internal/preview/' + paramId);
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            }
                            return; // exit forEach loop after finding the target user
                        }
                    });


                } else {
                    toast.add({ severity: 'error', summary: 'Failed', detail: 'Silahkan tandatangan ulang', life: 3000 });
                }
            });
        }
    });
};

const handleDownload = (url, urlName) => {
    // window.open(url, '_blank');

    fetch(url, {
        method: 'GET'
    }).then(resp => resp.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = urlName; // the filename you want
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })

    //   const a = document.createElement('a')
    //   a.href = url
    //   a.download = url.split('/').pop()
    //   document.body.appendChild(a)
    //   a.click()
    //   document.body.removeChild(a)
}

const printDocument = (base64String) => {
    // Convert base64 to binary data
    base64String = base64String.replace('data:application/pdf;base64,', '')
    const binaryPDF = atob(base64String);

    // Convert binary data to an ArrayBuffer
    const arrayBuffer = new ArrayBuffer(binaryPDF.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryPDF.length; i++) {
        uint8Array[i] = binaryPDF.charCodeAt(i);
    }

    // Create a Blob from the ArrayBuffer
    const pdfBlob = new Blob([uint8Array], { type: 'application/pdf' });

    // Create an Object URL from the Blob
    const objectURL = URL.createObjectURL(pdfBlob);

    // Open a new window or tab and load the Object URL
    const printWindow = window.open(objectURL, '_blank');

    // Wait for the window to load before applying the print styles and triggering the print
    printWindow.onload = function () {
        // Add a style element with print-specific CSS to the print window
        const style = printWindow.document.createElement('style');
        style.innerHTML = '@media print { body { margin: 0; } }';
        printWindow.document.head.appendChild(style);

        // Trigger the print dialog
        printWindow.print();
    };
}

// UPLOAD FILE OPTIONAL
const onUploadFileOptional = (event) => {
    let reader = new FileReader()
    reader.onload = (e) => {
        fileUploadedOptional.value = e.target.result
    }
    // // console.log(event.files[0]);
    reader.readAsDataURL(event.files[0])
    fileUploadedOptionalFiles.value = event
    visibleFileOptional.value = true
}

const previewFileOptional = (url) => {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            // console.log(blob);
            let reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                fileUploadedOptionalPreview.value = reader.result
                // console.log(reader);
            }
            visibleFileOptionalUpload.value = true
        });
}

const submitUploadFileOptional = (event) => {
    visibleFileOptional.value = false
    let tempDataFileOptionals = event.files[0]
    const swalWithBootstrapButtons = swal.mixin({
        customClass: {
            confirmButton: 'btnCustomSweetalert bg-yellow-500',
            cancelButton: 'btnCustomSweetalert bg-red-500'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Upload Surat Optional!',
        text: "Anda yakin ingin upload file surat surat?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const formFileOptionals = new FormData();
            formFileOptionals.append("attachment", tempDataFileOptionals)
            formFileOptionals.append("document_id", paramId)
            return suratService.uploadFileOptionalComplete(formFileOptionals).then((res) => {
                getListSingleData();
            })
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {

        }
    })
}
// const printDocument = (url) => {
//     var iframe = _printIframe;
//     if (!_printIframe) {
//         iframe = _printIframe = document.createElement('iframe');
//         document.body.appendChild(iframe);

//         iframe.style.display = 'none';
//         iframe.onload = function() {
//         setTimeout(function() {
//             iframe.focus();
//             iframe.contentWindow.print();
//         }, 1);
//         };
//     }

//     iframe.src = url;
// }
// END HANDLE SIGNER

const generatePDF = (params) => {
    suratService.generatePreviewPDF(params).then((data) => (dataPdf.value = data));
}

// HANDLE GO BACK
const goBack = () => {
    router.push('/surat-internal/list');
}

const goPageMemo = (link) => {
    // Hapus bagian domain dari link jika ada
    const relativeLink = link.replace(window.location.origin + '/#', '');
    router.push(relativeLink);
};


</script>
<template>
    <div class="stepsdemo-content">
        <Toast />
        <Card class="mt-3">
            <template v-slot:title>
                <div class="grid">
                    <div class="field col-12 md:col-6">
                        <div class="flex align-items-baseline">
                            <Button @click="goBack()" iconPos="right" class="p-button-warning mx-1">
                                <i class="fas fa-arrow-left"></i>
                            </Button>
                            <span class="mb-3">
                                Preview Surat
                            </span>
                        </div>
                    </div>
                    <div v-if="dataSinglePreview.status === '4'" class="field col-12 md:col-6 text-right">
                        <Button
                            @click="handleDownload(`http://192.168.4.250:6067/file/download/${dataSinglePreview.asset_url}`, dataSinglePreview.asset_url)"
                            iconPos="right" class="p-button-warning mx-1">
                            <!-- <Button @click="handleDownload(`http://192.168.4.250/sipamv2/filepdf.php?type=download&name=${dataSinglePreview.asset_url}`, dataSinglePreview.asset_url)" iconPos="right" class="p-button-warning mx-1"> -->
                            <span class="mr-2">Download</span>
                            <i class="fas fa-cloud-download-alt"></i>
                        </Button>
                        <Button @click="printDocument(dataSinglePreview.asset_print)" iconPos="right"
                            class="p-button-warning mx-1">
                            <span class="mr-2">Print</span>
                            <i class="fas fa-cloud-download-alt"></i>
                        </Button>
                        <!-- <Button v-if="dataSinglePreview.status === '4'" @click="printDocument(`http://192.168.4.250:6067/file/download/${dataSinglePreview.asset_url}`, dataSinglePreview.asset_url)" iconPos="right" class="p-button-warning mx-1">
                            <span class="mr-2">Print</span>
                            <i class="fas fa-cloud-download-alt"></i>
                        </Button> -->
                    </div>
                </div>
            </template>
            <template v-slot:content>
                <div class="p-fluid grid">
                    <div class="field col-12 md:col-3">
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Nomor Surat</label>
                            <br>
                            <b>{{ dataSinglePreview.document_no }}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Sifat Surat</label>
                            <br>
                            <!-- <div id="canvas" ref="qrcode"></div> -->
                            <b v-if="dataSifatSurat?.name_document_nature">
                                {{ dataSifatSurat.name_document_nature }}
                            </b>
                            <b v-else>-</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Kategori</label>
                            <br>
                            <b>{{ dataCategoryPreview.name }}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Perihal</label>
                            <br>
                            <b>{{ dataSinglePreview.perihal }}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Tujuan</label><br>
                            <template v-for="item, idxTujuan in dataSinglePreview.receiver" :key="idxTujuan">
                                <Chip :label="item.user_name" class="mb-2 mr-2" />
                            </template>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Up">Lampiran</label><br>
                            <div class="flex flex-wrap gap-2" v-if="dataSinglePreview.attachment?.length !== 0">
                                <!-- <template v-for="item, idx in dataSinglePreview.attachment" :key="idx">
                                    <Chip class="p-2 px-3"><i class="pi pi-file"></i></Chip>
                                </template> -->
                                <template v-for="item, idx in dataSinglePreview.attachment" :key="idx">
                                    <Chip class="p-2 px-3 bg-primary-500" style="width: 100%;">
                                        <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{
                                            item.asset_url }}</p>
                                    </Chip>
                                </template>
                            </div>
                            <b v-if="dataSinglePreview.attachment?.length === 0">-</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Penanda Tangan</label><br>
                            <div class="flex flex-wrap gap-2">
                                <template v-for="item, idx in dataSinglePreview.signer" :key="idx">
                                    <Badge :value="item.user_name"
                                        :severity="item.is_sign === '1' ? 'success' : 'danger'"></Badge>
                                </template>
                            </div>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Verifikator</label>
                            <br>
                            <b>{{ dataSinglePreview.verificator?.user_name }}</b>
                            <!-- <div class="flex flex-wrap gap-2">
                                <template v-for="item, idx in dataSinglePreview.verificator" :key="idx">
                                    <Chip :label="item.user_name" />
                                </template>
                            </div> -->
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Jenis Tandatangan</label>
                            <br>
                            <b>{{ dataSinglePreview.need_sign === '1' ? 'Tandatangan Digital (VIDA)' :
                                (dataSinglePreview.need_sign === '0' ?
                                    'Tandatangan Basah' : '') }}</b>
                            <!-- <div class="flex flex-wrap gap-2">
                                <template v-for="item, idx in dataSinglePreview.verificator" :key="idx">
                                    <Chip :label="item.user_name" />
                                </template>
                            </div> -->
                        </div>

                        <div class="field col-12 mb-0" v-if="dataSinglePreview.status === '7'">
                            <label for="Tujuan">Keterangan Cancel</label>
                            <br>
                            <b>{{ dataSinglePreview.note_cancel || '-' }}</b>
                        </div>

                        <div class="field col-12 mb-0"
                            v-if="dataSinglePreview.status === '7' && (dataSinglePreview.asset_url_cancel != '' && dataSinglePreview.asset_url_cancel != null)">
                            <label for="Tujuan">File Cancel</label>
                            <br>
                            <b
                                v-if="dataSinglePreview.asset_url_cancel == null || dataSinglePreview.asset_url_cancel == ''">-</b>
                            <Button v-else type="button" label="Preview"
                                @click="previewFileOptional(`http://192.168.4.250:6067/file/cancel/${dataSinglePreview.asset_url_cancel}`)" />
                        </div>

                        <div class="field col-12 mb-0"
                            v-if="dataSinglePreview.status === '7' && (dataSinglePreview.link_cancel != '' && dataSinglePreview.link_cancel != null)">
                            <label for="Tujuan">Link Cancel</label>
                            <br>
                            <b v-if="dataSinglePreview.link_cancel == null || dataSinglePreview.link_cancel == ''">-</b>
                            <Button v-else type="button" label="Preview"
                                @click="goPageMemo(dataSinglePreview.link_cancel)" />
                        </div>

                        <div class="field col-12 mb-0" v-if="dataSinglePreview.status === '7'">
                            <label for="Tujuan">Cancel By</label>
                            <br>
                            <b>{{ dataSinglePreview.update_cancel_by || '-' }}</b>
                        </div>

                        <div class="field col-12 mb-0"
                            v-if="dataSinglePreview.status === '4' && dataSinglePreview.need_attach !== '1' && dataSinglePreview.link_external !== ''">
                            <label for="upload">Upload File <span class="text-orange-600">(Optional)</span></label>
                            <div class="field col-12 md:col-12 p-0">
                                <Badge :value="'File Already Exists'" :severity="'success'"></Badge>
                            </div>
                            <div class="field col-12 md:col-12 p-0">
                                <Button type="button" label="Preview"
                                    @click="previewFileOptional(`http://192.168.4.250:6067/file/upload/${dataSinglePreview.asset_url}`)" />
                                <!-- <Button type="button" label="Preview" @click="previewFileOptional(`http://192.168.4.250/sipamv2/filepdf.php?type=preview&name=${dataSinglePreview.asset_url}`)" /> -->
                            </div>
                        </div>
                        <div class="field col-12 mb-0"
                            v-if="dataSinglePreview.status === '4' && dataSinglePreview.need_attach !== '1' && dataSinglePreview.link_external === ''">
                            <label for="upload">Upload File <span class="text-orange-600">(Optional)</span></label>
                            <!-- FOR UPLOAD FILE YANG SUDAH DI TANDATANGAN BASAH -->
                            <div class="field col-12 md:col-12 p-0">
                                <FileUpload mode="basic" customUpload @select="onUploadFileOptional"
                                    accept="application/pdf" :maxFileSize="10000000" />
                            </div>
                            <!-- END FOR UPLOAD FILE YANG SUDAH DI TANDATANGAN BASAH -->
                        </div>
                        <!-- <label for="class">Data</label>
                        <br>
                        <pre>
                            <b>{{formData}}</b>
                        </pre> -->
                    </div>
                    <div class="field col-12 md:col-9">
                        <!-- <div class="field col-12 mb-0"> -->
                        <!-- <label for="class" class="mt-3">Content Surat</label> -->
                        <!-- <br> -->
                        <br>
                        <!-- <div v-html="props.formData.content"></div> -->
                        <div class="bg-gray-300">

                            <ScrollPanel style="width: 100%; height: 1300px" class="custombar1">
                                <div class="p-8">
                                    <vue-pdf-embed
                                        v-if="dataSinglePreview.status === '4' || dataSinglePreview.status === '3'"
                                        ref="pdfRef"
                                        :source="`http://192.168.4.250:6067/file/download/${dataSinglePreview.asset_url}`"
                                        :page="page" @password-requested="handlePasswordRequest"
                                        @rendered="handleDocumentRender" />
                                    <vue-pdf-embed
                                        v-if="dataSinglePreview.status !== '4' || dataSinglePreview.status !== '3'"
                                        ref="pdfRef" :source="dataPdf" :page="page"
                                        @password-requested="handlePasswordRequest" @rendered="handleDocumentRender" />
                                </div>
                            </ScrollPanel>
                        </div>
                        <div>
                            <!-- <iframe :src="dataPdf" frameborder="0" width="100%" height="500px"></iframe> -->
                            <!-- <iframe src="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" frameborder="0" toolbar="0" width="100%" height="500px"></iframe> -->

                        </div>
                        <!-- </div> -->
                    </div>

                    <!-- <iframe src="https://www.djelas.id/" frameborder="0"></iframe> -->
                    <!-- <embed src="https://www.djelas.id/" style="width:500px; height: 300px;"> -->
                </div>
                <!-- <div class="field col-12">
                    <label for="class">Name</label>
                    <b>{{formData.firstname ? formData.firstname : '-'}} {{formData.lastname ? formData.lastname : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Age</label>
                    <b>{{formData.age ? formData.age : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Seat Class</label>
                    <b>{{formData.class ? formData.class : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Wagon Number</label>
                    <b>{{formData.vagon ? formData.vagon : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Seat</label>
                    <b>{{formData.seat ? formData.seat : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Cardholder Name</label>
                    <b>{{formData.cardholderName ? formData.cardholderName : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Card Number</label>
                    <b>{{formData.cardholderNumber ? formData.cardholderNumber : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">Date</label>
                    <b>{{formData.date ? formData.date : '-'}}</b>
                </div>
                <div class="field col-12">
                    <label for="Age">CVV</label>
                    <b>{{formData.cvv && formData.cvv.length === 3  ? '**' + formData.cvv[2] : '-'}}</b>
                </div> -->
            </template>
            <template v-slot:footer>
                <div class="grid grid-nogutter justify-content-end">
                    <!-- Via Email PIN-->
                    <Button
                        v-if="dataSinglePreview.need_sign === '1' & dataSignerUser.is_sign === '0' && dataSinglePreview.status === '3'"
                        label="Signer Via PIN" @click="handleSignerVIDAViaPIN()" icon="pi pi-user-edit" iconPos="right"
                        class="p-button-warning mx-1" :style="statusSign ? 'visibility: hidden;' : ''" />

                    <!-- TTD Basah -->
                    <Button
                        v-if="dataSinglePreview.need_sign === '0' & dataSignerUser.is_sign === '0' && dataSinglePreview.status === '3'"
                        label="Signer" @click="handleSigner()" icon="pi pi-user-edit" iconPos="right"
                        class="p-button-info mx-1" :style="statusSign ? 'visibility: hidden;' : ''" />

                    <!-- Via Email VIDA-->
                    <Button
                        v-if="dataSinglePreview.need_sign === '1' & dataSignerUser.is_sign === '0' && dataSinglePreview.status === '3'"
                        label="Signer Via Email" @click="handleSignerVIDAViaEmail()" icon="pi pi-user-edit"
                        iconPos="right" class="p-button-info mx-1" :style="statusSign ? 'visibility: hidden;' : ''" />

                    <!-- Reject Cuti -->
                    <Button
                        v-if="(dataSinglePreview.category ? JSON.parse(dataSinglePreview.category).alias : 'IZIN') && dataSignerUser.is_sign === '0' && dataSinglePreview.status === '3'"
                        label="Reject Cuti" @click="RejectCuti()" icon="pi pi-times" iconPos="right"
                        class="p-button-danger mx-1" :style="statusSign ? 'visibility: hidden;' : ''" />

                    <Button v-if="setUserIDVerif() && !dataCategoryPreview.name == 'Izin'" label="Revisi"
                        @click="handleRevisi()" icon="pi pi-times" iconPos="right" class="p-button-danger mx-1" />
                    <Button v-if="setUserIDVerif()" label="Verif" @click="handleVerif()" icon="pi pi-check"
                        iconPos="right" class="p-button-success mx-1" />
                </div>
            </template>
        </Card>
        <Dialog v-model:visible="visibleModalSign" :style="{ width: '450px' }" :closable="false" :modal="true"
            class="p-fluid" :showHeader="false">
            <div class="text-center fa-5x text-yellow-500 mb-2 mt-3">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <p class="text-center">
                Silahkan klik Lanjutkan untuk cek status sign anda.
            </p>
            <Button label="Lanjutkan" text @click="handleProcessSign" />
        </Dialog>
        <Dialog v-model:visible="visibleFileOptional" maximizable modal header="Preview" :style="{ width: '50vw' }">
            <div class="card">
                <vue-pdf-embed ref="pdfRef" :source="fileUploadedOptional" :page="page"
                    @password-requested="handlePasswordRequest" @rendered="handleDocumentRender" />
                <Button @click="submitUploadFileOptional(fileUploadedOptionalFiles)" iconPos="right"
                    class="p-button-warning mx-1">
                    <span class="mr-2">Submit</span>
                    <i class="fas fa-cloud-download-alt"></i>
                </Button>
            </div>
        </Dialog>
        <Dialog v-model:visible="visibleFileOptionalUpload" maximizable modal header="Preview"
            :style="{ width: '50vw' }">
            <div class="card">
                <vue-pdf-embed ref="pdfRef" :source="fileUploadedOptionalPreview" :page="page"
                    @password-requested="handlePasswordRequest" @rendered="handleDocumentRender" />
            </div>
        </Dialog>
    </div>
</template>

<!-- <script>
export default {
    props: {
        formData: Object
    },
    methods: {
        prevPage() {
            this.$emit('prev-page', {pageIndex: 2});
        },
        complete() {
            this.$emit('complete');
        }
    }
}
</script> -->
<style scoped>
::v-deep(.p-scrollpanel.custombar1 .p-scrollpanel-wrapper) {
    /* border-right: 10px solid var(--surface-ground); */
    border-right: 10px solid var(--gray-300);
}

::v-deep(.p-scrollpanel.custombar1 .p-scrollpanel-bar) {
    background-color: var(--primary-300);
    opacity: 1;
    transition: background-color 0.3s;
}

::v-deep(.p-scrollpanel.custombar1 .p-scrollpanel-bar:hover) {
    background-color: var(--primary-400);
}

::v-deep(.vue-pdf-embed canvas) {
    margin-top: 10px;
}

::v-deep(.plb-10) {
    padding-left: 10px;
    padding-bottom: 10px;
}

::v-deep(.p-scrollpanel.custombar2 .p-scrollpanel-wrapper) {
    border-right: 10px solid var(--surface-50);
    border-bottom: 10px solid var(--surface-50);
}

::v-deep(.p-scrollpanel.custombar2 .p-scrollpanel-bar) {
    background-color: var(--surface-300);
    border-radius: 0;
    opacity: 1;
    transition: background-color 0.3s;
}
</style>
<style>
.btnCustomSweetalert {
    border: none;
    padding: 12px 32px;
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 4px;
    cursor: pointer;
}

.vue-pdf-embed>div {
    display: flex;
    justify-content: center;
}

.vue-pdf-embed>div>canvas {
    width: 100% !important;
    height: auto !important;
}

.blur-background {
    filter: blur(5px);
    transition: all 0.3s ease;
}
</style>