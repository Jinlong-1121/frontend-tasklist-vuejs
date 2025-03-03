<script setup>
import { inject, ref, onMounted, onUpdated, reactive } from "vue";
import SuratService from '@/service/SuratService';
import VuePdfEmbed from 'vue-pdf-embed';
import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';
import { useRoute, useRouter } from "vue-router";
import { useToast } from 'primevue/usetoast';

const swal = inject('$swal')

const route = useRoute();
const router = useRouter();
const paramId = route.params.id;
const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))

const suratService = new SuratService();
const qrcode = ref(null)
const qrimage = ref()
const fileUploaded = ref('')
const fileUploadedOptional = ref('')
const fileUploadedOptionalPreview = ref('')
const fileUploadedOptionalFiles = ref()
const imgcode = ref(null)
const dataPdf = ref();
const tempTemplateDataPdf = ref()
const dataSinglePreview = ref({});
const dataCategoryPreview = ref({});
const dataSignerUser = ref({})
// const statusSign = reactive(false)
const visibleModalSign = ref(false);
const visible = ref(false);
const visibleFileOptional = ref(false)
const visibleFileOptionalUpload = ref(false)
const toast = useToast();
const statusSign = ref(false)

const page = ref(null);
// const pdfSource = ref("https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf");

const props = defineProps({ formData: Object })
const emit = defineEmits(['next-page', 'prev-page']);

onMounted(() => {
    // filterMonth.value = date;
    getListSingleData();
    if (dataSignerUser.value.is_sign === '0' && dataSinglePreview.value.status === '3') {
        statusSign.value = true
    }
});

onUpdated(() => {
    getListSingleData();
    console.log(qrcode.value);
    // console.log('update', dataSinglePreview.data_form, dataSinglePreview);
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
const getListSingleData = async () => {
    const param = {
        id: paramId
    }
    suratService.getDetail(param).then((data) => {
        if (data.need_attach === '1') {
            if (data.asset_upload !== '') {
                if (data.asset_upload !== '' && data.status === '6') {
                    let parseTemplate = JSON.parse(data.template)
                    dataPdf.value = parseTemplate.parameter[0].value
                }else {
                    dataPdf.value = data.asset_upload
                }
                let parseTemplate = JSON.parse(data.template)
                tempTemplateDataPdf.value = parseTemplate.parameter[0].value
            } else {
                let parseTemplate = JSON.parse(data.template)
                dataPdf.value = parseTemplate.parameter[0].value
            }
            generateQRCode(data.link_url)
        }else {
            generatePreviewPDF(data);
        }
        dataSinglePreview.value = data;
        dataCategoryPreview.value = JSON.parse(data.category)
        setUserIDSigner(data.signer)
    });
};
// END GET SURAT EXTERNAL

// USER ID
const setUserIDVerif = () => {
    const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
    if(dataSinglePreview.value.verificator?.user_id === dataLocalStorage.target && dataSinglePreview.value.status === "2") {
        return true
    }else {
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
// END USER ID

// COPY
const onCopy = async (data) => {
    if (navigator.clipboard) {
        try {
            console.log(navigator);
            await navigator.clipboard.writeText(data);
            toast.add({ severity: 'success', summary: 'Success', detail: 'Copied', life: 2000 });
        } catch (err) {
            toast.add({ severity: 'error', summary: 'Failed!', detail: 'Copy Failed '+err, life: 2000 });
        }
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = data;
        textArea.style.top = "0px";
        textArea.style.position = "absolute";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        if (successful) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Copied', life: 2000 });
        } else {
            toast.add({ severity: 'error', summary: 'Failed!', detail: 'Copy Failed', life: 2000 });
        }
        document.body.removeChild(textArea);
    }
}
// END COPY

// COPY QR IMAGE
const onCopyQR = async () => {
  const contentElement = qrimage.value;
  try {
        const canvas = await html2canvas(contentElement);
        if (navigator.clipboard) {
            await canvas.toBlob((blob) => {
                const clipboardItem = new ClipboardItem({ 'image/png': blob });

                navigator.clipboard.write([clipboardItem]).then(() => {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Copied', life: 2000 });
                });
            });
        } else {
            const imgData = canvas.toDataURL();
            const imgs = document.createElement('img');
            imgs.src = imgData;

            const bodys = document.body ;
            bodys.appendChild(imgs);
            
            let myrange;
            if (document.createRange)  
            {
                myrange = document.createRange();
                myrange.setStartBefore(imgs);
                myrange.setEndAfter(imgs);
                myrange.selectNode(imgs);
            }
            else
            {
                toast.add({ severity: 'error', summary: 'Failed!', detail: 'Copy Failed, CreateRange NOT work', life: 2000 });
            }

            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(myrange);
            const successful = document.execCommand('copy');
            if (successful) {
                toast.add({ severity: 'success', summary: 'Success', detail: 'Copied', life: 2000 });
            } else {
                toast.add({ severity: 'error', summary: 'Failed!', detail: 'Copy Failed', life: 2000 });
            }

            bodys.removeChild(imgs);
        }
  } catch (error) {
        toast.add({ severity: 'error', summary: 'Failed!', detail: 'Copy Failed', life: 2000 });
  }
};
//END COPY QR IMAGE

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
            if(dataSinglePreview.value.need_attach === '1' && dataSinglePreview.value.asset_upload === '') {
                dataSinglePreview.value.status = "6" 
            }else {
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
                    if(dataSinglePreview.value.need_attach === '1' && dataSinglePreview.value.status === "6") {
                        router.push('/surat-external/list/upload-documents');
                    }else {
                        router.push('/surat-external/list/signer');
                    }
                }else {
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

// HANDLE VERIF TTD BASAH
const handleUpload = () => {
    if (fileUploaded.value !== '') {
        const swalWithBootstrapButtons = swal.mixin({
            customClass: {
                confirmButton: 'btnCustomSweetalert bg-yellow-500',
                cancelButton: 'btnCustomSweetalert bg-red-500'
            },
            buttonsStyling: false
        })
        swalWithBootstrapButtons.fire({
            title: 'Upload File!',
            text: "Anda yakin ingin upload file tanda tangan basah?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                let sendData = {
                    document_id: dataSinglePreview.value.id,
                    attachment: fileUploaded.value
                }
                // dataSinglePreview.value.status = "1"
                return suratService.uploadFileTTDBasah(JSON.stringify(sendData)).then((res) => {
                    if (typeof(res) === "undefined") {
                        toast.add({ severity: 'error', summary: 'Failed!', detail: res, life: 2000 });
                    } else {
                        swalWithBootstrapButtons.fire(
                            'Success!',
                            'File berhasil diupload.',
                            'success'
                        )
                        router.push('/surat-external/list/waiting');
                    }
                }).catch( err => {
                    toast.add({ severity: 'error', summary: 'Failed!', detail: err, life: 2000 });
                });
            },
            allowOutsideClick: () => !swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) { 
            }
        })
    } else {
        toast.add({ severity: 'error', summary: 'Failed!', detail: 'File tanda tangan basah kosong', life: 2000 });
    }
    
}
// END HANDLE VERIF TTD BASAH

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
            if (dataSinglePreview.value.need_attach === '1' && dataSinglePreview.value.asset_upload !== '') {
                dataSinglePreview.value.status = "6"
                return suratService.putSurat(dataSinglePreview.value).then((res) => {
                    swal.fire(
                        'Success!',
                        'Surat berhasil untuk direvisi.',
                        'success'
                    )
                    router.push('/surat-external/list/upload-documents');
                });
            } else {
                dataSinglePreview.value.status = "1"
                return suratService.putSurat(dataSinglePreview.value).then((res) => {
                    swal.fire(
                        'Success!',
                        'Surat berhasil untuk direvisi.',
                        'success'
                    )
                    router.push('/surat-external/list/open');
                });
            }
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            
        }
    })
}
// END HANDLE REVISI

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
            const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
            let sendData = {
                user_id: dataLocalStorage.target,
                document_id: dataSinglePreview.value.id,
                ref_id: dataSinglePreview.value.ref_id
            }
            // dataSinglePreview.value.status = "1"
            suratService.postSign(sendData).then((res) => {
                visibleModalSign.value = true;
                viewSignValidate(res.data)
            });
        }
    })
}
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
    let timerInterval
    swal.fire({
        title: 'Waiting!',
        html: 'Sedang melakukan proses verifikasi.',
        timer: 3000,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
            swal.showLoading()
        },
        willClose: () => {
            clearInterval(timerInterval)
        },
    }).then((result) => {
    /* Read more about handling dismissals below */
        if (result.dismiss === swal.DismissReason.timer) {
            const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
            const param = {
                id: paramId
            }
            suratService.getDetail(param).then((data) => {
                data.signer.map(item => {
                    if (item.user_id === dataLocalStorage.target) {
                        if (item.is_sign === "0") {
                            toast.add({ severity: 'error', summary: 'Failed', detail: 'Silahkan tandatangan ulang', life: 3000 });
                        } else {
                            toast.add({ severity: 'success', summary: 'Successful', detail: 'Tandatangan berhasil', life: 3000 });
                            if (dataSinglePreview.status === "4") {
                                router.push('/surat-external/list');
                            }
                        }
                    }
                })
            });
        }
    })
};
// END HANDLE SIGNER

// HANDLE DOWNLOAD AND PRINT
const downloadPDFBase64 = (base64Data) => {
      // Buat elemen tautan untuk mengunduh
      const a = document.createElement("a");
      a.href = base64Data;
      a.download = "file.pdf"; // Nama file yang akan diunduh

      // Tambahkan tautan ke dalam dokumen
      document.body.appendChild(a);

      // Pemicu untuk mengklik tautan dan memulai unduhan
      a.click();

      // Hapus tautan dari dokumen
      document.body.removeChild(a);
}
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
// END HANDLE DOWNLOAD AND PRINT

// HANDLE GENERATE PDF
const generatePDF = (params) => {
    suratService.generatePreviewPDF(params).then((data) => (dataPdf.value = data));
}
// END  HANDLE GENERATE PDF

// GENERATE QR FROM LINK URL DATA
const qrOption = {"width":300,"height":300,"data":"https://purwanto.co.id.com","margin":0,"qrOptions":{"typeNumber":"0","mode":"Byte","errorCorrectionLevel":"H"},"imageOptions":{"hideBackgroundDots":false,"imageSize":0.4,"margin":0},"dotsOptions":{"type":"square","color":"#100f0f"},"backgroundOptions":{"color":"#ffffff"},"image":"data:image/png;base64,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","dotsOptionsHelper":{"colorType":{"single":true,"gradient":false},"gradient":{"linear":true,"radial":false,"color1":"#6a1a4c","color2":"#6a1a4c","rotation":"0"}},"cornersSquareOptions":{"type":"","color":"#000000"},"cornersSquareOptionsHelper":{"colorType":{"single":true,"gradient":false},"gradient":{"linear":true,"radial":false,"color1":"#000000","color2":"#000000","rotation":"0"}},"cornersDotOptions":{"type":"","color":"#000000"},"cornersDotOptionsHelper":{"colorType":{"single":true,"gradient":false},"gradient":{"linear":true,"radial":false,"color1":"#000000","color2":"#000000","rotation":"0"}},"backgroundOptionsHelper":{"colorType":{"single":true,"gradient":false},"gradient":{"linear":true,"radial":false,"color1":"#ffffff","color2":"#ffffff","rotation":"0"}}}

const generateQRCode = (urlLink) => {
    if (urlLink !== "") {
        qrOption.data = urlLink;
    }
    const qrCode = new QRCodeStyling(qrOption);
    qrCode.append(qrcode.value);
};
// END GENERATE QR

// UPLOAD FILE TANDATANGAN BASAH
const onUploadFileTandatanganBasah = (event) => {
    // console.log(event, "OOO");
    let reader = new FileReader()
    reader.onload = (e) => {
        fileUploaded.value = e.target.result
    }
    reader.readAsDataURL(event.files[0])
}
// END UPLOAD FILE TANDATANGAN BASAH

// UPLOAD FILE OPTIONAL
const onUploadFileOptional = (event) => {
    let reader = new FileReader()
    reader.onload = (e) => {
        fileUploadedOptional.value = e.target.result
    }
    // console.log(event.files[0]);
    reader.readAsDataURL(event.files[0])
    fileUploadedOptionalFiles.value = event
    visibleFileOptional.value = true
}
const previewFileOptional = (url) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
          console.log(blob);
            let reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                fileUploadedOptionalPreview.value = reader.result
                console.log(reader);
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
// END UPLOAD FILE OPTIONAL

// HANDLE GO BACK
const goBack = () => {
    router.push('/surat-external/list');
}
// END HANDLE GO BACK

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
                    <div class="field col-12 md:col-12 mb-0 pt-0 pb-0" v-if="dataSinglePreview.status === '6' && dataSinglePreview.note !== ''">
                        <Message class="m-0" severity="warn" :closable="false">Catatan Revisi : {{ dataSinglePreview.note }}</Message>
                    </div>
                    <div v-if="dataSinglePreview.status === '4'" class="field col-12 md:col-6 text-right">
                        <Button @click="handleDownload(`http://192.168.4.250:6067/file/download/${dataSinglePreview.asset_url}`, dataSinglePreview.asset_url)" iconPos="right" class="p-button-warning mx-1">
                            <span class="mr-2">Download</span>
                            <i class="fas fa-cloud-download-alt"></i>
                        </Button>
                        <Button @click="printDocument(dataSinglePreview.asset_print)" iconPos="right" class="p-button-warning mx-1">
                            <span class="mr-2">Print</span>
                            <i class="fas fa-cloud-download-alt"></i>
                        </Button>
                    </div>
                </div>
            </template>
            <template v-slot:content>
                <div class="p-fluid grid">
                    <div class="field col-12 md:col-3">
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Nomor</label>
                            <div class="grid align-items-center">
                                <div class="field col-10 mb-0">
                                    <b>{{dataSinglePreview.document_no}}</b>
                                </div>
                                <div class="field col-2 mb-0" v-if="dataSinglePreview.status === '6' && dataSinglePreview.need_attach === '1'">
                                    <Button v-if="dataLocalStorage.target === dataSinglePreview.sender?.user_id" @click="onCopy(dataSinglePreview.document_no)" v-clipboard:error="onError" class="p-button-warning justify-content-center">
                                        <i class="pi pi-clone"></i>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div class="field col-12 mb-0" :class="dataSinglePreview.status === '6' && dataSinglePreview.need_attach === '1'? 'block' : 'hidden'">
                            <label for="Perihal">QR Code</label>
                            <br>
                            <div class="flex justify-content-center flex-wrap">
                                <div ref="qrimage" class="flex justify-content-center flex-wrap">
                                    <div id="canvas" ref="qrcode"></div>
                                    <p class="text-center" style="font-size: 1.5rem;">dokumen ini ditandatangani <br> secara elektronik</p>
                                </div>
                            </div>
                            <Button v-if="dataLocalStorage.target === dataSinglePreview.sender?.user_id" @click="onCopyQR" v-clipboard:error="onError" class="p-button-warning justify-content-center mt-3">
                                <i class="pi pi-clone"></i>
                            </Button>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Kategori</label>
                            <br>
                            <!-- <div id="canvas" ref="qrcode"></div> -->
                            <b>{{dataCategoryPreview.name}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Perihal">Perihal</label>
                            <br>
                            <b>{{dataSinglePreview.perihal}}</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Tujuan</label>
                            <br>
                            <template v-for="item, idxTujuan in dataSinglePreview.receiver" :key="idxTujuan">
                                <b>{{item.user_name}}</b>
                                <br>
                                <b>{{item.address}}</b>
                            </template>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Up">Up</label><br>
                            <template v-for="item, idxTujuan in dataSinglePreview.receiver" :key="idxTujuan">
                                <b>{{item.up}}</b>
                            </template>
                        </div>
                        <div class="field col-12 mb-0" v-if="dataSinglePreview.attachment?.length !== 0">
                            <label for="Up">Lampiran</label><br>
                            <div class="flex flex-wrap gap-2" v-if="dataSinglePreview.attachment?.length !== 0">
                                <!-- <template v-for="item, idx in dataSinglePreview.attachment" :key="idx">
                                    <Chip class="p-2 px-3"><i class="pi pi-file"></i></Chip>
                                </template> -->
                                <template v-for="item, idx in dataSinglePreview.attachment" :key="idx">
                                    <Chip class="p-2 px-3 bg-primary-500" style="width: 100%;">
                                        <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.asset_url }}</p>
                                    </Chip>
                                </template>
                            </div>
                            <b v-if="dataSinglePreview.attachment?.length === 0">-</b>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Penanda Tangan</label><br>
                            <div class="flex flex-wrap gap-2">
                                <template v-for="item, idx in dataSinglePreview.signer" :key="idx">
                                    <Badge :value="item.user_name" :severity="item.is_sign === '1' ? 'success' : 'danger'"></Badge>
                                </template>
                            </div>
                        </div>
                        <div class="field col-12 mb-0">
                            <label for="Tujuan">Verifikator</label>
                            <br>
                            <b>{{dataSinglePreview.verificator?.user_name}}</b>
                            <!-- <div class="flex flex-wrap gap-2">
                                <template v-for="item, idx in dataSinglePreview.verificator" :key="idx">
                                    <Chip :label="item.user_name" />
                                </template>
                            </div> -->
                        </div>
                        <div class="field col-12 mb-0" v-if="dataSinglePreview.status === '6' && dataSinglePreview.need_attach === '1' && dataLocalStorage.target === dataSinglePreview.sender.user_id">
                            <label for="upload">Upload File</label>
                            <!-- FOR UPLOAD FILE YANG SUDAH DI TANDATANGAN BASAH -->
                            <div class="field col-12 md:col-12">
                                <FileUpload mode="basic" customUpload @select="onUploadFileTandatanganBasah" accept="application/pdf" :maxFileSize="10000000" />
                            </div>
                            <!-- END FOR UPLOAD FILE YANG SUDAH DI TANDATANGAN BASAH -->
                        </div>
                        <div class="field col-12 mb-0" v-if="dataSinglePreview.status === '4' && dataSinglePreview.need_attach !== '1' && dataSinglePreview.link_external !== ''">
                            <label for="upload">Upload File <span class="text-orange-600">(Optional)</span></label>
                            <div class="field col-12 md:col-12 p-0">
                                <Badge :value="'File Already Exists'" :severity="'success'"></Badge>
                            </div>
                            <div class="field col-12 md:col-12 p-0">
                                <Button type="button" label="Preview" @click="previewFileOptional(`http://192.168.4.250:6067/file/upload/${dataSinglePreview.asset_url}`)" />
                            </div>
                        </div>
                        <div class="field col-12 mb-0" v-if="dataSinglePreview.status === '4' && dataSinglePreview.need_attach !== '1' && dataSinglePreview.link_external === ''">
                            <label for="upload">Upload File <span class="text-orange-600">(Optional)</span></label>
                            <!-- FOR UPLOAD FILE YANG SUDAH DI TANDATANGAN BASAH -->
                            <div class="field col-12 md:col-12 p-0">
                                <FileUpload mode="basic" customUpload @select="onUploadFileOptional" accept="application/pdf" :maxFileSize="10000000" />
                            </div>
                            <!-- END FOR UPLOAD FILE YANG SUDAH DI TANDATANGAN BASAH -->
                        </div>
                        <div class="field col-12 mb-0" v-if="dataSinglePreview.status === '2' && dataSinglePreview.need_attach === '1' && dataSinglePreview.asset_upload !== ''">
                            <label for="banding">Bandingkan</label>
                            <!-- FOR COMPARE FILE YANG SUDAH DI TANDATANGAN BASAH -->
                            <div class="field col-12 md:col-12 p-0">
                                <Button @click="visible = true" v-clipboard:error="onError" class="p-button-warning justify-content-center mt-0" label="Bandingkan">
                                <!-- <i class="pi pi-clone"></i> -->
                            </Button>
                            </div>
                            <!-- END FOR COMPARE FILE YANG SUDAH DI TANDATANGAN BASAH -->
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
                                        v-if="dataSinglePreview.status === '4'"
                                        ref="pdfRef"
                                        :source="`http://192.168.4.250:6067/file/download/${dataSinglePreview.asset_url}`"
                                        :page="page"
                                        @password-requested="handlePasswordRequest"
                                        @rendered="handleDocumentRender"
                                        />
                                        <vue-pdf-embed
                                        v-if="dataSinglePreview.status !== '4'"
                                        ref="pdfRef"
                                        :source="dataPdf"
                                        :page="page"
                                        @password-requested="handlePasswordRequest"
                                        @rendered="handleDocumentRender"
                                        />
                                    </div>
                                </ScrollPanel>
                            </div>
                        <!-- </div> -->
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="grid grid-nogutter justify-content-end">
                    <Button v-if="dataSignerUser.is_sign === '0' && dataSinglePreview.status === '3'" label="Signer" @click="handleSigner()" icon="pi pi-user-edit" iconPos="right" class="p-button-info mx-1" :style="statusSign ? 'visibility: hidden;' : ''"/>
                    <Button v-if="setUserIDVerif()" label="Revisi" @click="handleRevisi()" icon="pi pi-times" iconPos="right" class="p-button-danger mx-1"/>
                    <Button v-if="setUserIDVerif()" label="Verif" @click="handleVerif()" icon="pi pi-check" iconPos="right" class="p-button-success mx-1"/>
                    <Button v-if="dataSinglePreview.status === '6' && dataSinglePreview.need_attach === '1' && dataLocalStorage.target === dataSinglePreview.sender?.user_id" label="Submit Upload" @click="handleUpload()" icon="pi pi-check" iconPos="right" class="p-button-success mx-1"/>
                </div>
            </template>
        </Card>

        <Dialog v-model:visible="visibleModalSign" :style="{width: '450px'}" :closable="false" :modal="true" class="p-fluid" :showHeader="false">
            <div class="text-center fa-5x text-yellow-500 mb-2 mt-3">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <p class="text-center">
                Silahkan klik Lanjutkan untuk cek status sign anda.
            </p>
            <Button label="Lanjutkan" text @click="handleProcessSign"/>
        </Dialog>
        <Dialog v-model:visible="visible" maximizable modal header="Bandingkan" :style="{ width: '50vw' }">
            <div class="card">
                <div class="flex flex-column md:flex-row gap-5">
                    <div class="flex-auto">
                        <Button @click="downloadPDFBase64(tempTemplateDataPdf)" iconPos="right" class="p-button-warning mx-1">
                            <span class="mr-2">Download</span>
                            <i class="fas fa-cloud-download-alt"></i>
                        </Button>
                        <ScrollPanel style="width: 100%; height: auto" class="custombar1">
                            <vue-pdf-embed
                                ref="pdfRef"
                                :source="tempTemplateDataPdf"
                                :page="page"
                                @password-requested="handlePasswordRequest"
                                @rendered="handleDocumentRender"
                            />
                        </ScrollPanel>
                    </div>
                    <div class="flex-auto">
                        <Button @click="downloadPDFBase64(dataPdf)" iconPos="right" class="p-button-warning mx-1">
                            <span class="mr-2">Download</span>
                            <i class="fas fa-cloud-download-alt"></i>
                        </Button>
                        <ScrollPanel style="width: 100%; height: auto" class="custombar1">
                            <vue-pdf-embed
                                ref="pdfRef"
                                :source="dataPdf"
                                :page="page"
                                @password-requested="handlePasswordRequest"
                                @rendered="handleDocumentRender"
                            />
                        </ScrollPanel>
                    </div>
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="visibleFileOptional" maximizable modal header="Preview" :style="{ width: '50vw' }">
            <div class="card">
                <vue-pdf-embed
                    ref="pdfRef"
                    :source="fileUploadedOptional"
                    :page="page"
                    @password-requested="handlePasswordRequest"
                    @rendered="handleDocumentRender"
                />
                <Button @click="submitUploadFileOptional(fileUploadedOptionalFiles)" iconPos="right" class="p-button-warning mx-1">
                    <span class="mr-2">Submit</span>
                    <i class="fas fa-cloud-download-alt"></i>
                </Button>   
            </div>
        </Dialog>

        <Dialog v-model:visible="visibleFileOptionalUpload" maximizable modal header="Preview" :style="{ width: '50vw' }">
            <div class="card">
                <vue-pdf-embed
                    ref="pdfRef"
                    :source="fileUploadedOptionalPreview"
                    :page="page"
                    @password-requested="handlePasswordRequest"
                    @rendered="handleDocumentRender"
                />
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
.vue-pdf-embed > div {
    display: flex;
    justify-content: center;
}
.vue-pdf-embed > div > canvas {
    width: 100% !important;
    height: auto !important;
}
</style>