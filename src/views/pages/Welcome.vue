<script setup>
import AbsenService from '@/service/AbsenService';
import UserService from '@/service/UserService';
import { ref, onMounted, computed, watch, reactive, onUpdated, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import SuratService from '@/service/SuratService';
import DivisiService from '@/service/DivisiService';
import TemplateService from "@/service/TemplateService";
import CategoryService from '@/service/CategoryService';

import { useToast } from 'primevue/usetoast';

const swal = inject('$swal')

const router = useRouter();
const route = useRoute();
const isAuthenticated = JSON.parse(localStorage.getItem('sipam'));
const userPin = JSON.parse(localStorage.getItem('sipam')).pin
const sender = ref({});

const absenService = new AbsenService();
const userService = new UserService();
const suratService = new SuratService();
const divisiService = new DivisiService();
const templateService = new TemplateService();
const categoryService = new CategoryService();

const toast = useToast();

const ListCuti = ref([]); // Assume ListCuti is an array of leave data
const ListCutiBersama = ref([]);
const ListCutiTambahan = ref([]);
const maxDate = ref(new Date());
const minDateJoin = ref(new Date());

const RestartCuti = ref(null);

const selectedTypeCuti = ref();
const ListCutiType = ref([]);
const ListYearJoin = ref([]);
const ListDataDetail = ref([]);

const suratDialog = ref(false);
const visible = ref(false);
const submitted = ref(false);
const edited = ref(false);

const templateList = ref(null);
const selectedTemplate = ref({});
const dataForm = ref([]);

const minDateSurat = ref(new Date());

const surat = ref({});

const inputForm = reactive({
  document_no: "",
  perihal: "",
  up: "",
  content: "",
  divisi: [],
  receiver: [],
  signer: [],
  verificator: {},
  sender: {},
  category: {},
  template: {},
  type_cuti: {},
  tembusan: [],
  date: [],
  attachment: [],
  attachment_avail: [],
  lampiran: 0,
  document_type: "2",
  status: "2",
  is_reply: "1",
  need_attach: "0",
  need_sign: "1",
  is_cuti: "1",
  data_form: "",
});

// SELECTION OPTIONS
const selectedDivisi = ref();
const selectedTujuan = ref();
const selectedPenandatangan = ref();
const selectedVerificator = ref();
const selectedTypeIzin = ref();
const selectedCategory = ref({});
const validateSelectedCategory = ref();
// END SELECTION OPTIONS

// OPTIONS DROPDOWN
const optionDivisi = ref([]);
const optionTujuan = ref([]);
const optionTujuanTemp = ref([]);
const optionSigner = ref([]);
const optionTypeIzin = ref([]);
const optionTypeIzinPanjang = ref([]);
const optionVerif = ref([]);
const optionTembusan = ref([]);
const categoryList = ref([]);

// State variables
const listDetail = ref({});
const Alpa = ref({});
const listDetailCuti = ref({});
const listDetailCutiTahunan = ref({});
const listIzin = ref({});
const listCarryForwardExpiring = ref({});
const selectedMonthYear = ref('');
const selectedYear = ref(''); // Use this to store the selected year

const need_attach = ref('0');

const selectedListUserAbsen = ref(); // Tambahan: untuk user absen yang dipilih
const optionsListUserAbsen = ref([]); // Tambahan: untuk opsi user absen

const totalSisaCuti = ref()

// Utility for current month and year
const getCurrentMonthYear = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const getCurrentYear = () => {
  const date = new Date();
  return `${date.getFullYear()}`;
};

const getNumber = (intNumber) => {
  const number = intNumber;
  return number;
};

// Fetch attendance detail data
const getListData = (date) => {
  const params = {
    pin: ([1, 2, 3, 9].includes(isAuthenticated.divisi) && selectedListUserAbsen.value)
      ? selectedListUserAbsen.value.pin
      : isAuthenticated.pin,
    month: date,
  };

  absenService.getDetail(params)
    .then((response) => {
      listDetail.value = response.detail;
      Alpa.value = response.alpa;
      listIzin.value = response.list_izin;
      listCarryForwardExpiring.value = response.carry_forward_expiring;
    })

    .catch((error) => {
      console.error("Error fetching attendance data:", error);
    });
};

// Fetch leave balance detail data
const getListDetailCuti = (date, type) => {
  // Ambil maxYear dari ListYearJoin atau gunakan tahun sekarang jika kosong
  let maxYear = (Array.isArray(ListYearJoin.value) && ListYearJoin.value.length > 0)
    ? Math.max(...ListYearJoin.value.map(item => item.year_trx))
    : new Date().getFullYear();

  // Gunakan maxYear sebagai default jika `date` tidak diberikan
  let selectedDate = date ?? maxYear.toString();

  // Gunakan default typeCuti jika `type` tidak diberikan
  const typeCuti = type ?? (Array.isArray(ListCutiType.value) && ListCutiType.value.length > 0
    ? ListCutiType.value[0].type
    : 1);
    
  const params = {
    pin: ([1, 2, 3, 9].includes(isAuthenticated.divisi) && selectedListUserAbsen.value)
      ? selectedListUserAbsen.value.pin
      : isAuthenticated.pin,
    year: selectedDate,
    type: typeCuti
  };


  absenService.getDetailCuti(params)
    .then((response) => {
      listDetailCuti.value = response.detail;
      ListCuti.value = response.list_cuti_tahunan;
      ListCutiTambahan.value = response.list_cuti_tambahan;
      ListCutiBersama.value = response.list_cuti_bersama;
      ListCutiType.value = response.list_type_cuti_user;
      ListYearJoin.value = response.list_year_user;
      ListDataDetail.value = response;

      // Perbarui maxYear berdasarkan data terbaru dari API
      if (Array.isArray(ListYearJoin.value) && ListYearJoin.value.length > 0) {
        const years = ListYearJoin.value.map(item => item.year_trx);
        maxYear = Math.max(...years);
      }

      // console.log("maxYear setelah API:", maxYear);

      // Pastikan selectedYear diperbarui dengan maxYear yang terbaru
      if (!selectedYear.value || selectedYear.value > maxYear) {
        console.log(`Updating selectedYear to latest maxYear: ${maxYear}`);
        selectedYear.value = maxYear.toString();
      }

      // Update selectedTypeCuti jika masih kosong
      if (!selectedTypeCuti.value) {
        selectedTypeCuti.value = (Array.isArray(ListCutiType.value) && ListCutiType.value.length > 0)
          ? ListCutiType.value[0].type
          : 1;
      }
    })
    .catch((error) => {
      console.error("Error fetching leave balance data:", error);
    });
};


watch([selectedYear, selectedTypeCuti], ([newYear, newType], [oldYear, oldType]) => {
  if (newYear !== oldYear || newType !== oldType) {
    getListDetailCuti(newYear, newType);
  }
});


const getListDetailCutiTahunan = (date) => {
  const params = {
    pin: ([1, 2, 3, 9].includes(isAuthenticated.divisi) && selectedListUserAbsen.value)
      ? selectedListUserAbsen.value.pin
      : isAuthenticated.pin,
    year: date,
    type: 1
  };

  absenService.getDetailCuti(params)
    .then((response) => {
      listDetailCutiTahunan.value = response.detail;

      if (Array.isArray(ListCutiType.value) && ListCutiType.value.length > 0 && !selectedTypeCuti.value) {
        selectedTypeCuti.value = ListCutiType.value[0].type;
      }
    })
    .catch((error) => {
      console.error("Error fetching leave balance data:", error);
    });
};

// Fetch list of users for absen selection (for admin only)
const setOptionsListUserAbsen = () => {
  if ([1, 2, 3, 9].includes(isAuthenticated.divisi)) {
    absenService.getListUserAbsen()
      .then((data) => {
        optionsListUserAbsen.value = data.data;

        // Set default user to the authenticated user
        const defaultUser = optionsListUserAbsen.value.find(user => user.pin === isAuthenticated.pin);
        if (defaultUser) {
          selectedListUserAbsen.value = defaultUser;
        }
      })
      .catch((error) => {
        console.error("Error fetching user absen list:", error);
      });
  }
};

// Mounted hook to fetch initial data
onMounted(() => {
  const currentDate = getCurrentMonthYear();
  selectedMonthYear.value = currentDate;
  getListData(currentDate);
  setOptionsListUserAbsen(); // Initialize user absen options for admin
});

onMounted(() => {
  const currentYear = getCurrentYear();
  selectedYear.value = currentYear;

  const typeCuti = getNumber(selectedTypeCuti.value); // Use the currently selected type
  selectedTypeCuti.value = typeCuti;
  getListDetailCuti(currentYear, typeCuti);
  getListDetailCutiTahunan(currentYear)
});

// Handler for month and year change
const handleMonthYearChange = (value) => {
  if (!(value instanceof Date)) {
    return;
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  selectedMonthYear.value = `${year}-${month}`;

  getListData(selectedMonthYear.value);
};

// Ensure selectedTypeCuti has a fallback before calling getListDetailCuti
const handleYearNumberChange = (value) => {
  // Pastikan value berupa objek Date
  if (!(value instanceof Date)) {
    return;
  }

  const year = value.getFullYear();
  selectedYear.value = `${year}`;

  // Cari type cuti yang sesuai dengan tahun yang dipilih
  const typeCuti = ListYearJoin.value.find(item => item.year_trx === year)?.status === 1
    ? (selectedTypeCuti.value ?? (ListCutiType.value.length > 0 ? ListCutiType.value[0].type : 1))
    : 1; // Default jika tidak ditemukan

  selectedTypeCuti.value = typeCuti;

  // Panggil fungsi untuk update data berdasarkan tahun dan tipe cuti yang dipilih
  getListDetailCuti(selectedYear.value, selectedTypeCuti.value);
  getListDetailCutiTahunan(selectedYear.value);
};

// Watch for changes in selectedTypeCuti and update data accordingly
watch(selectedTypeCuti, (newType) => {
  if (selectedYear.value) { // Make sure selectedYear is defined
    getListDetailCuti(selectedYear.value, newType);
    getListDetailCutiTahunan(selectedYear.value);
  }
});

// Watch for changes in selectedListUserAbsen and update data accordingly (for admin only)
watch(selectedListUserAbsen, async (newUser) => {
  if (selectedMonthYear.value) {
    getListData(selectedMonthYear.value);
  }

  // Pastikan data ListYearJoin sudah terisi sebelum melakukan reset
  if (ListYearJoin.value.length === 0) {
    await getListDetailCuti(selectedYear.value, selectedTypeCuti.value); // Pastikan ListYearJoin terisi
  }

  // 🔴 Tambahkan pembaruan min/max tahun disini
  if (Array.isArray(ListYearJoin.value) && ListYearJoin.value.length > 0) {
    const years = ListYearJoin.value.map(item => item.year_trx);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    minYearJoin.value = new Date(minYear, 0, 1);
    maxYearJoin.value = new Date(maxYear, 11, 31);

    selectedYear.value = maxYear.toString(); // Pastikan selectedYear disesuaikan
  }

  if (Array.isArray(ListCutiType.value) && ListCutiType.value.length > 0) {
    selectedTypeCuti.value = ListCutiType.value[0].type; // Reset ke tipe pertama
  }

  // Panggil kembali fungsi untuk mendapatkan data cuti dengan nilai yang sudah diperbarui
  if (selectedYear.value && selectedTypeCuti.value) {
    getListDetailCuti(selectedYear.value, selectedTypeCuti.value);
    getListDetailCutiTahunan(selectedYear.value);
  }
});

watch([selectedListUserAbsen, selectedYear], ([newUser, newYear]) => {
  if (newUser && newYear) {
    getListDetailCuti(newYear, selectedTypeCuti.value);
  }
});

// Ajukan Cuti

// SETGET OPTIONS LIST TUJUAN
const getListDivisi = () => {
  divisiService.getListAll().then((data) => {
    const defaultOption = data.find(option => option.id === 9);
    if (defaultOption) {
      optionDivisi.value = [defaultOption];
    }
  });
}

const setDivisi = (event) => {
  inputForm.receiver = []
  selectedTujuan.value = []
  inputForm.divisi = event.value
  selectedDivisi.value = event.value
  const thirdArray = optionTujuanTemp.value.filter((elem) => {
    return selectedDivisi.value.some((ele) => {
      return elem.up == ele.id;
    });
  });
  optionTujuan.value = thirdArray
};
// SETGEN GET OPTIONS LIST TUJUAN


// SETGET OPTIONS LIST TUJUAN
const getListTujuan = () => {
  userService.getListTujuanAll().then((data) => {
    optionTujuanTemp.value = data
  });
}

const setTujuan = (event) => {
  inputForm.receiver = event.value
  selectedTujuan.receiver = event.value
};

// SETGEN GET OPTIONS LIST TUJUAN

// SETGET OPTIONS LIST SIGNER
const getListSigner = () => {
  userService.getListSigner().then((data) => {
    optionSigner.value = data;
  });
};

const getTypeIzin = async () => {
  try {
    const response = await absenService.getTypeIzin();

    // Check if response data is an array
    if (Array.isArray(response.data)) {
      // Filter options where option.type is not 1 and option.multi is 0
      const filteredOptions = response.data.filter(option => option.multi === 1);

      if (filteredOptions.length > 0) {
        optionTypeIzin.value = filteredOptions;
      }
    }
  } catch (error) {
    console.error("Error fetching type izin:", error);
  }
};


const getTypeIzinPanjang = async () => {
  try {
    const response = await absenService.getTypeIzin();

    // Check if response data is an array
    if (Array.isArray(response.data)) {
      // Filter options where option.type is not 1 and option.multi is 0
      const filteredOptions = response.data.filter(option => option.multi === 0);

      if (filteredOptions.length > 0) {
        optionTypeIzinPanjang.value = filteredOptions;
      }
    }
  } catch (error) {
    console.error("Error fetching type izin:", error);
  }
};


const setTypeIzinNew = (event) => {
  // if (!event.value || !event.value.type) {
  //   console.error("Unexpected event structure:", event);
  //   return;
  // }

  // Check if dataForm.value is defined and has data before filtering
  const filteredData = dataForm.value ? dataForm.value.filter(item => item.type === '9') : [];
  const typeCutis = filteredData.map(item => item.value.type);

  inputForm.type_cuti = event.value;
  selectedTypeIzin.value = event.value;

  absenService.getCountTotalCuti(event.value.type).then((data) => {
    if (typeCutis[0] === 10 && totalSisaCuti.value <= 4) {
      totalSisaCuti.value = 100 - data.data;
    } else if (typeCutis[0] === 11 && totalSisaCuti.value <= 4) {
      totalSisaCuti.value = data.data;
    } else {
      totalSisaCuti.value = data.data;
    }
  });
};


watch(selectedTypeIzin, (newSelectedTypeIzin) => {
  // Check if the new selected template is defined and has an id
  if (newSelectedTypeIzin && newSelectedTypeIzin.id) {
    validasiLimitTanggalCutiMulti(newSelectedTypeIzin.id);
  }
});
const validasiLimitTanggalCutiMulti = (data) => {
  // Ensure dataForm.value exists before filtering
  const typeCutis = selectedTypeIzin.value.type

  // Check if data is an array and handle it accordingly
  if (!Array.isArray(data)) {
    return; // Exit if data is not an array
  }

  if (typeCutis === 10) {
    toast.add({ severity: 'success', summary: 'Sukses', detail: 'Tanggal berhasil dipilih.', life: 2000 });
  } else if (typeCutis === 11 && data.length <= totalSisaCuti.value) {
    toast.add({ severity: 'success', summary: 'Sukses', detail: 'Tanggal berhasil dipilih.', life: 2000 });
  } else if (data.length <= totalSisaCuti.value) {
    toast.add({ severity: 'success', summary: 'Sukses', detail: 'Tanggal berhasil dipilih.', life: 2000 });
  } else {
    // Only splice if data is indeed an array
    if (data.length > 0) {
      data.splice(-1);
    }
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Pilihan tanggal melebihi sisa cuti.', life: 3000 });
  }
};

const getCategory = () => {
  const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
  const params = {
    type: "2",
    divisi: dataLocalStorage.divisi
  }

  categoryService.getListCategoryAll(params).then((data) => {
    const defaultOptions = data.filter(option => option.name === "Izin");
    if (defaultOptions.length > 0) {
      categoryList.value = defaultOptions;
    }
  });
};

const setSigner = (event) => {
  let currentTime = new Date();
  inputForm.signer = event.value

  inputForm.document_no = `{no}/INT.IZIN/DIR/${romanize(currentTime.getMonth() + 1)}/${currentTime.getFullYear()}`
  if (event.value.length === 0) {
    selectedPenandatangan.value = !selectedPenandatangan
  }

  selectedPenandatangan.signer = event.value
};
// END SETGET OPTIONS LIST SIGNER

// SETGET OPTIONS LIST VERIFICATOR
const getListVerif = () => {
  userService.getListVerif().then((data) => (optionVerif.value = data));
}

const setVerificator = (event) => {
  inputForm.verificator = event.value
  selectedVerificator.verificator = event.value

};
// END SETGET OPTIONS LIST VERIFICATOR

const setSender = () => {
  const dataLocalStorage = JSON.parse(localStorage.getItem("sipam"))
  const dataSender = {}
  dataSender.user_id = dataLocalStorage.target;
  dataSender.user_name = dataLocalStorage.user_name;
  dataSender.user_type = "1";
  return dataSender;
};

const setTemplate = (event) => {
  need_attach.value = '0';
  selectedTemplate.value = {};
  selectedCategory.value = event.value;
  validateSelectedCategory.value = event.value;
  inputForm.template = event.value;

  getTemplate(event.value.id);
};
const pickTemplate = (data) => {
  need_attach.value = '0'
  const dataTemplate = templateList.value.filter(item => item.id === data.id);
  selectedTemplate.value = dataTemplate[0];
};

watch(selectedTemplate, (newSelectedTemplate) => {
  // Check if the new selected template is defined and has an id
  if (newSelectedTemplate && newSelectedTemplate.id) {
    getTemplate(newSelectedTemplate.id);
  }
});

const getTemplate = (id) => {
  const params = {
    type: id
  };

  templateService.getListTemplateAll(params).then((data) => {
    // Filter options based on the template name
    const defaultOptions = data.filter(option => option.name.includes("Permohonan Cuti"));
    if (defaultOptions.length > 0) {
      templateList.value = defaultOptions;

      // Check the current selected template and set the default template accordingly
      if (selectedTemplate.value) {
        if (selectedTemplate.value.name === "Permohonan Cuti Panjang") {
          selectedTemplate.value = defaultOptions[0]; // Set to first option
        } else if (selectedTemplate.value.name === "Permohonan Cuti") {
          selectedTemplate.value = defaultOptions[1]; // Set to second option
        }
      }
    }

    // If the action is update, pick the template
    if (route.params.action === "update") {
      pickTemplate(selectedTemplate.value.id);
    }
  }).catch((error) => {
    console.error("Error fetching templates:", error);
  });
};


onMounted(() => {
  getCategory();
  sender.value = setSender();
  inputForm.sender = sender.value;

});

onUpdated(() => {
  getCategory();
  sender.value = setSender();
  inputForm.sender = sender.value;


});

const openNew = () => {
  surat.value = {};
  submitted.value = false;
  suratDialog.value = true;
  visible.value = true;
  edited.value = false;

  getListTujuan();
  getListDivisi();
  getListSigner();
  getListVerif();
  getTypeIzin();
  getTypeIzinPanjang();
  let currentTime = new Date();
  if (inputForm.document_no === "") {
    inputForm.document_no = `{no}/INT.IZIN/DIR/${romanize(currentTime.getMonth() + 1)}/${currentTime.getFullYear()}`
  } else {
    inputForm.document_no = inputForm.document_no;
  }
  if (inputForm.perihal === '') {
    inputForm.perihal = inputForm.template.name + " - " + isAuthenticated.user_name;
  }
  inputForm.need_attach = inputForm.need_attach;
  dataForm.value = inputForm.template.parameter;

};

const hideDialog = () => {
  suratDialog.value = false;
  submitted.value = false;
};

const postSurat = (params) => {
  suratService.postSurat(params).then((data) => {
    // Show the toast notification
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Sukses Ajukan Cuti', life: 3000 });

    // Navigate after a delay (matching the toast duration)
    setTimeout(() => {
      router.push(`/surat-internal/list/waiting`);
    }, 3000); // Delay in milliseconds (same as toast life)
  });
};

const saveData = async () => {
  const swalWithBootstrapButtons = swal.mixin({
    customClass: {
      confirmButton: 'btnCustomSweetalert bg-yellow-500',
      cancelButton: 'btnCustomSweetalert bg-red-500'
    },
    buttonsStyling: false
  });

  submitted.value = true;

  const dataUsersCuti = JSON.parse(localStorage.getItem("sipam"));
  let tempDataCheckTypeTemplate = selectedTemplate.value;
  let tempDataFormCuti = [];

  // Check if the selected template is "Permohonan Cuti"
  if (tempDataCheckTypeTemplate && tempDataCheckTypeTemplate.name.includes("Permohonan Cuti")) {
    tempDataFormCuti = surat.value.date; // Assuming this needs to be populated for "Permohonan Cuti"
  }

  if (typeof surat.value.id === "undefined") {
    const contentTemplate = tempDataCheckTypeTemplate.content;
    let contentDoc = contentTemplate;

    // Handle "Permohonan Cuti Panjang" specifically
    if (tempDataCheckTypeTemplate.name === 'Permohonan Cuti Panjang') {
      if (selectedTypeIzin.value.default_qty !== undefined) {
        contentDoc = contentDoc.replaceAll('{jumlah_hari}', selectedTypeIzin.value.default_qty);

        let addDate = new Date(surat.value.dateFull);
        let daysToAdd = parseInt(selectedTypeIzin.value.default_qty, 10); // Convert to integer
        addDate.setDate(addDate.getDate() + daysToAdd);

        const formatAddDate = setFormatDateOnly(addDate);
        contentDoc = contentDoc.replaceAll('{tanggal_akhir}', formatAddDate);
      }

      const formatMulaiDate = setFormatDateOnly(surat.value.dateFull);
      contentDoc = contentDoc.replaceAll('{tanggal_mulai}', formatMulaiDate);
    }

    // Common content replacement for both templates
    contentDoc = contentDoc.replaceAll('{nama_pembuat}', dataUsersCuti.user_name);
    contentDoc = contentDoc.replaceAll('{jabatan_pembuat}', dataUsersCuti.position);
    contentDoc = contentDoc.replaceAll('{tujuan_divisi}', inputForm.receiver[0].user_name);
    contentDoc = contentDoc.replaceAll('{perihal}', selectedTemplate.value.name);
    contentDoc = contentDoc.replaceAll('{tujuan}', inputForm.receiver.length > 1 ? "Tujuan Terlampir" : `${inputForm.receiver[0].user_name} (${inputForm.receiver[0].address})`);
    contentDoc = contentDoc.replaceAll('{tanggal}', setFormatDate());
    contentDoc = contentDoc.replaceAll('{nomor}', inputForm.document_no);
    contentDoc = contentDoc.replaceAll('{lampiran}', inputForm.attachment.length === 0 ? '-' : inputForm.attachment.length);
    contentDoc = contentDoc.replaceAll('{up}', inputForm.up);
    contentDoc = contentDoc.replaceAll('{tembusan}', inputForm.tembusan.length === 0 ? '' : setTextList(inputForm.tembusan));
    contentDoc = contentDoc.replaceAll('{signer}', setTextSigner(inputForm.signer));
    contentDoc = contentDoc.replaceAll('{tujuan_terlampir}', inputForm.receiver.length > 1 ? setTextTujuan(inputForm.receiver) : "");

    contentDoc = contentDoc.replaceAll('{category}', setOption(selectedTypeIzin.value));

    // Specific content replacement for "Permohonan Cuti"
    if (tempDataCheckTypeTemplate && tempDataCheckTypeTemplate.name === 'Permohonan Cuti') {
      contentDoc = contentDoc.replaceAll('{date_content}', setFormatDateLooping(surat.value.date));
    }

    contentDoc = contentDoc.replaceAll('{keterangan}', surat.value.keterangan);

    // Set value sebelum submit
    surat.value.category = JSON.stringify(validateSelectedCategory.value);
    surat.value.template = JSON.stringify(selectedTemplate.value);
    surat.value.divisi = JSON.stringify(selectedDivisi.value);
    surat.value.tujuan = JSON.stringify(selectedTujuan.value);
    surat.value.signer = JSON.stringify(selectedPenandatangan.value);
    surat.value.kategori = JSON.stringify(selectedTypeIzin.value);

    let keterangan = surat.value.keterangan
    let dateMulti = surat.value.date
    let dateFull = surat.value.dateFull

    // Set value before submit
    surat.value = {
      document_no: inputForm.document_no,
      perihal: selectedTemplate.value.name,
      up: inputForm.up,
      content: contentDoc,
      divisi: JSON.stringify(selectedDivisi.value),
      category: JSON.stringify(validateSelectedCategory.value),
      template: JSON.stringify(selectedTemplate.value),
      receiver: inputForm.receiver,
      signer: inputForm.signer,
      verificator: selectedVerificator.verificator,
      type_cuti: inputForm.type_cuti,
      tembusan: inputForm.tembusan,
      attachment: inputForm.attachment,
      attachment_avail: inputForm.attachment_avail,
      lampiran: inputForm.lampiran,
      document_type: inputForm.document_type,
      is_reply: inputForm.is_reply,
      need_attach: inputForm.need_attach,
      need_sign: inputForm.need_sign,
      is_cuti: inputForm.is_cuti,
      status: inputForm.status,
      sender: inputForm.sender,
      keterangan: keterangan,
      date_multi: dateMulti,
      date_full: dateFull,
    };

    const res = await suratService.postSurat(surat.value); // Await the postSurat call

    // Handle "Permohonan Cuti Panjang"
    if (selectedTemplate.value.name === 'Permohonan Cuti Panjang') {
      const type = selectedTypeIzin.value.type;
      const tanggalValue = surat.value.date_full ? new Date(surat.value.date_full) : new Date();
      let bulan = String(tanggalValue.getMonth() + 1).padStart(2, '0');
      let tanggal = String(tanggalValue.getDate()).padStart(2, '0');
      const tahun = tanggalValue.getFullYear();

      const qty = selectedTypeIzin.value.default_qty; // Floors to nearest lower integer

      const keterangan = `Izin: ${surat.value.keterangan}`;

      const dataAbsen = {
        pin: dataUsersCuti.pin,
        type: type,
        effective_date: `${tahun}-${bulan}-${tanggal}`,
        qty: Array.isArray(surat.value.date_multi) ? surat.value.date_multi.length : 0,
        keterangan: keterangan,
        doc_id: `${res.data.id}`,
      };

      // Show loading only when sending leave adjustment
      swal.fire({
        title: 'Waiting!',
        html: 'Sedang proses Data.',
        allowOutsideClick: false,
        didOpen: () => {
          swal.showLoading();
        },
      });

      await absenService.sendLeaveAdjustment(dataAbsen);

      // Close the swal when finished
      swal.close();
    }

    suratDialog.value = false;

    // Handle "Permohonan Cuti"
    if (selectedTemplate.value.name === "Permohonan Cuti") {
      const type = selectedTypeIzin.value.type;
      for (let date of tempDataFormCuti || []) {

        let d = new Date(date);
        let bulan = String(d.getMonth() + 1).padStart(2, '0');
        let tanggal = String(d.getDate()).padStart(2, '0');
        const tahun = d.getFullYear();

        const keterangan = `Izin: ${surat.value.keterangan}`;
        const dataAbsen = {
          pin: dataUsersCuti.pin,
          type: type,
          effective_date: `${tahun}-${bulan}-${tanggal}`,
          qty: surat.value.date_multi.length, // Set qty based on the length of surat.value.date
          keterangan: keterangan,
          doc_id: `${res.data.id}`,
        };

        // Show loading only when sending leave adjustment
        swal.fire({
          title: 'Waiting!',
          html: 'Sedang proses Refresh Data.',
          allowOutsideClick: false,
          didOpen: () => {
            swal.showLoading();
          },
        });

        await absenService.sendLeaveAdjustment(dataAbsen);

        // Close the swal when finished
        swal.close();
      }
    }

    swalWithBootstrapButtons.fire(
      'Success!',
      'Sukses Ajukan Cuti.',
      'success'
    ).then(() => {
      // This code will run after the user clicks "OK" on the SweetAlert
      setTimeout(() => {
        router.push(`/surat-internal/list/waiting`);
      }, 1000); // Delay in milliseconds (same as toast life)
    });


  }

  surat.value = {};
};


// Handler for detail button
const handleDetail = () => {
  router.push(`/absen/detail/user/${isAuthenticated.pin}`);
};

const handleDetailAdmin = (pin) => {
  router.push(`/absen/detail/user/${pin}`);
};

// Define calendarOptions as a reactive variable
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  events: [] // Initialize empty events array
});

// Watch for changes in ListCuti and update the calendar events
watch(ListCuti, (newListCuti) => {
  if (newListCuti && Array.isArray(newListCuti)) {
    // Map ListCuti data to the format FullCalendar expects
    calendarOptions.value.events = newListCuti.map((cuti) => ({
      title: cuti.desc,  // Assuming 'desc' is the title/description of the leave
      date: cuti.date    // Assuming 'date' is the date of the leave
    }));
  }
});

watch(ListCutiBersama, (newListCutiBersama) => {
  if (newListCutiBersama && Array.isArray(newListCutiBersama)) {
    // Map ListCutiBersama data to the format FullCalendar expects
    calendarOptions.value.events = newListCutiBersama.map((cuti) => ({
      title: cuti.desc,  // Assuming 'desc' is the title/description of the leave
      date: cuti.date    // Assuming 'date' is the date of the leave
    }));
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('id-ID', options).replace(/Feb/i, 'Feb'); // Menggunakan 'id-ID' untuk format Indonesia
};

watch(selectedListUserAbsen, (newUser) => {
  if (newUser && newUser.join_date) {

    minDateJoin.value = new Date(selectedListUserAbsen.value.join_date);
  }
});

minDateJoin.value = new Date(isAuthenticated.join_date);


const minYearJoin = ref(new Date());
const maxYearJoin = ref(new Date());

watch(ListYearJoin, (newYears) => {
  if (newYears && newYears.length > 0) {
    const years = newYears.map(item => item.year_trx);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years); // Ensure maxYear is defined
    minYearJoin.value = new Date(minYear, 0, 1); // Set minYearJoin based on the earliest year
    maxYearJoin.value = new Date(maxYear, 11, 31); // Set maxYearJoin based on the latest year
  }
});

const PostRestart = (numberOfficer, year, type) => {
  var params = {
    numberOfficer: numberOfficer,
    year: year,
    type: type,
    pin: userPin,
  }

  absenService.PostRestart(params).then((data) => {
    RestartCuti.value = data.data;

    toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Sukses Update Data Cuti', life: 3000 });

    setTimeout(() => {

      router.push(`/mployee-leave-today`);
      setTimeout(() => {

        router.push(`/`);
      }, 1); // Delay in milliseconds (same as toast life)
    }, 3000); // Delay in milliseconds (same as toast life)
  });
};


const setFormatDateLooping = (date) => {
  let html;
  html = `<ol>`;
  date.map((date, index) => {
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

    html += '<li>';
    html += `${tampilTanggal}`;
    html += '</li>';
  })

  html += `</ol>`;
  return html;
}

const setFormatDateOnly = (date) => {
  // let date = new Date();
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

const setTextList = (data) => {
  // let data = optionSigner.value;
  // console.log(data, "KKKKKK");
  let html;
  html = '<p>Tembusan : </p>';
  html += `<ol>`;
  // html += data.map((item) => {
  //     // console.log(item, "HAHAHAH");
  //     `<li>${item.name}</li>`
  // })

  // let header = Object.keys(data[0]); //['name', 'jabatan', 'id']

  //set header table
  // html += '<tr>';
  //     header.forEach(el => {
  //         html += `<th>${el}</th>`;
  // });
  // html += '</tr>';

  //set body table
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    html += '<li>';
    html += `${element.name}`;
    html += '</li>';
  }
  html += `</ol>`;
  return html;
}

const setOption = (data) => {
  // let data = optionSigner.value;
  let html;
  const element = data;
  html = `<a>${element.type_cuti}</a>`;

  return html;
}

const setTextTujuan = (data) => {
  // let data = optionSigner.value;
  let html;
  html = '<p>Tujuan : </p>';
  html += `<ol>`;
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    html += '<li>';
    html += `<span>${element.user_name}</span><span> (${element.address})</span>`;
    html += '</li>';
  }
  html += `</ol>`;
  return html;
}

const setTextSigner = (data) => {
  let html = `<table style="width:100%"><tr>`;

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    html += `<td style="padding-right: 20px;">`; // Add padding between each column

    // If speciment exists, display the image; otherwise, display an empty placeholder
    if (inputForm.need_sign === '1') {
      if (element.speciment) {
        html += `<img src="${element.speciment}" width="158" height="87" style="display: block; margin-bottom: 5px;"/>`;
      } else {
        html += `<div style="width: 158px; height: 87px;  display: block; margin-bottom: 5px;"></div>`; // Placeholder
      }
    } else {
      html += `<div style="width: 158px; height: 87px;  display: block; margin-bottom: 5px;"></div>`; // Placeholder
    }

    html += `
            <p class="mb-0" style="${element.position !== 'External' ? 'text-decoration: underline;' : ''} font-weight: bold; margin-top: 5px;">${element.user_name}</p>
            ${element.position !== 'External' ? element.position : ''}
        </td>
        `;
  }
  html += `</tr></table>`;
  return html;
}

function romanize(num) {
  if (!+num)
    return false;
  var digits = String(+num).split(""),
    key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
      "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
      "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
    roman = "",
    i = 3;
  while (i--)
    roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

const setFormatDate = (data) => {
  let date = data ? new Date(data) : new Date();
  let tahun = date.getFullYear();
  let bulan = date.getMonth();
  let tanggal = date.getDate();
  let hari = date.getDay();
  switch (hari) {
    case 0: hari = "Minggu"; break;
    case 1: hari = "Senin"; break;
    case 2: hari = "Selasa"; break;
    case 3: hari = "Rabu"; break;
    case 4: hari = "Kamis"; break;
    case 5: hari = "Jum'at"; break;
    case 6: hari = "Sabtu"; break;
  }
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
  let tampilTanggal = hari + ", " + tanggal + " " + bulan + " " + tahun;

  return tampilTanggal;
}
</script>

<template>
  <Toast />
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Welcome</h5>
        <p>This is SiPAM dashboard page.</p>
      </div>
    </div>
  </div>



  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Absensi</h5>
        <div v-if="listDetail.pin != '-' && listDetail.pin != ''">
          <!-- Cards displaying data -->
          <!-- <div class="text-lg mb-1">Absensi</div> -->

          <!-- Input for selecting month and year with button -->
          <div class="flex items-center space-x-4 mt-3 mb-3">
            <Calendar v-model.trim="selectedMonthYear" view="month" dateFormat="yy-mm"
              @update:model-value="handleMonthYearChange" :minDate="minDateJoin" :maxDate="maxDate" />

            <div class="ml-3"
              v-if="isAuthenticated.divisi == 1 || isAuthenticated.divisi == 2 || isAuthenticated.divisi == 3 || isAuthenticated.divisi == 9">
              <Dropdown inputId="class" filter v-model="selectedListUserAbsen" :options="optionsListUserAbsen"
                optionLabel="user_name" placeholder="Select User" @update:model-value="handleMonthYearChange"
                class="w-full md:w-14rem" />
            </div>

            <button
              v-if="isAuthenticated.divisi == 1 || isAuthenticated.divisi == 2 || isAuthenticated.divisi == 3 || isAuthenticated.divisi == 9"
              class="ml-3 p-button p-button-success" @click="handleDetailAdmin(listDetail.pin)">Detail Bulan
              Ini</button>
            <button v-else class="ml-3 p-button p-button-success" @click="handleDetail(listDetail.pin)">Detail Bulan
              Ini</button>

          </div>

          <div class="p-fluid formgrid grid">
            <!-- Card for 'Sakit' -->
            <div class="field col-12 xl:col-3">
              <div class="card">
                <div class="text-lg">Sakit</div>
                <div class="text-4xl mt-3">{{ listDetail.sakit }}</div>
              </div>
            </div>
            <!-- Card for 'Dinas' -->
            <div class="field col-12 xl:col-3 mt-4 xl:mt-0">
              <div class="card">
                <div class="text-lg">Dinas</div>
                <div class="text-4xl mt-3">{{ listDetail.dinas }}</div>
              </div>
            </div>
            <!-- Card for 'Terlambat' -->
            <div class="field col-12 xl:col-3 mt-4 xl:mt-0">
              <div class="card">
                <div class="text-lg">Terlambat</div>
                <div class="text-4xl mt-3">{{ listDetail.telat }}</div>
              </div>
            </div>
            <!-- Card for 'Pulang Cepat' -->
            <div class="field col-12 xl:col-3 mt-4 xl:mt-0">
              <div class="card">
                <div class="text-lg">Pulang Cepat</div>
                <div class="text-4xl mt-3">{{ listDetail.izin_pulang }}</div>
              </div>
            </div>
            <!-- Card for 'Cuti' -->
            <div class="field col-12 xl:col-3 mt-4 xl:mt-0">
              <div class="card">
                <div class="text-lg">Cuti Tahunan</div>
                <div class="text-4xl mt-3">{{ listDetail.cuti_tahunan }}</div>
              </div>
            </div>
            <!-- Card for 'Potong Cuti' -->
            <div class="field col-12 xl:col-3 mt-4 xl:mt-0">
              <div class="card">
                <div class="text-lg">Cuti Bersama</div>
                <div class="text-4xl mt-3">{{ listDetail.cuti_sistem }}</div>
              </div>
            </div>
            <div class="field col-12 xl:col-3 mt-4 xl:mt-0">
              <div class="card">
                <div class="text-lg">Alpa</div>
                <div class="text-4xl mt-3">{{ Alpa.alpha_count }}</div>
              </div>
            </div>
            <!-- Card for 'Sisa Cuti' -->
            <!-- <div class="field col-12 xl:col-3 mt-4 xl:mt-0">
              <div class="card">
                <div class="text-lg">Saldo Cuti Tahunan</div>
                <div class="text-4xl mt-3">{{ listDetail.sisa_cuti }}</div>
              </div>
            </div> -->
          </div>
        </div>

      </div>
    </div>
  </div>

  <div class="grid" v-if="listIzin && listIzin.length > 0 && listDetail.pin != '-' && listDetail.pin != ''">
    <div class="col-12">
      <div class="card">
        <h5>List Izin</h5>
        <div v-if="listDetail.pin != '-' && listDetail.pin != ''">
          <DataTable :value="listIzin" paginator :rows="15" :rowsPerPageOptions="[15, 20, 50, 80, 100]">
            <template #empty>
              <div class="text-center p-2">
                <p class="text-lg font-semibold">No Data Available</p>
              </div>
            </template>
            <!-- tableStyle="min-width: 50rem" -->
            <Column field="no" header="No" :sortable="false">
              <template #body="slotProps">
                {{ listIzin.indexOf(slotProps.data) + 1 }} <!-- Use indexOf to find the position -->
              </template>
            </Column>
            <Column field="date" header="Tanggal" :sortable="false" headerStyle="width=4% min-width:10rem;">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.date) }}
              </template>
            </Column>
            <!-- <Column field="desc" header="Jenis Cuti" :sortable="false"  headerStyle="width=4% min-width:10rem;">
                    <template #body="slotProps">
                      {{ slotProps.data.desc }}
                    </template>
                  </Column> -->
            <Column field="keterangan" header="Keterangan" :sortable="false" headerStyle="width=4% min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.desc }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>

  <div class="grid"
    v-if="listCarryForwardExpiring && listCarryForwardExpiring.length > 0 && listDetail.pin != '-' && listDetail.pin != ''">
    <div class="col-12">
      <div class="card">
        <h5>List Cuti Tahunan Periode Sebelumnya (Carry Forward)</h5>
        <div v-if="listDetail.pin != '-' && listDetail.pin != ''">
          <DataTable :value="listCarryForwardExpiring" paginator :rows="15" :rowsPerPageOptions="[15, 20, 50, 80, 100]">
            <template #empty>
              <div class="text-center p-2">
                <p class="text-lg font-semibold">No Data Available</p>
              </div>
            </template>
            <!-- tableStyle="min-width: 50rem" -->
            <Column field="No" header="no" :sortable="false">
              <template #body="slotProps">
                {{ listCarryForwardExpiring.indexOf(slotProps.data) + 1 }} <!-- Use indexOf to find the position -->
              </template>
            </Column>

            <Column field="carry_forward_balance" header="Sisa Saldo Cuti" :sortable="false"
              headerStyle="width=4% min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.carry_forward_balance }}
              </template>
            </Column>

            <Column field="expired_in_days" header="Kedaluwarsa Dalam Hari" :sortable="false"
              headerStyle="width=4% min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.expired_in_days }}
              </template>
            </Column>

            <Column field="carry_forward_expiry" header="Tanggal Kedaluwarsa" :sortable="false"
              headerStyle="width=4% min-width:10rem;">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.carry_forward_expiry) }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>
  </div>

  <div class="grid"
    v-if="ListCutiTambahan && ListCutiTambahan.length > 0 && ListCutiTambahan.pin != '-' && ListCutiTambahan.pin != ''">
    <div class="col-12">
      <div class="card">
        <h5>List Hak Cuti Tambahan</h5>
        <div v-if="listDetail.pin != '-' && listDetail.pin != ''">
          <DataTable :value="ListCutiTambahan" paginator :rows="15" :rowsPerPageOptions="[15, 20, 50, 80, 100]">
            <template #empty>
              <div class="text-center p-2">
                <p class="text-lg font-semibold">No Data Available</p>
              </div>
            </template>
            <!-- tableStyle="min-width: 50rem" -->
            <Column field="no" header="No" :sortable="false">
              <template #body="slotProps">
                {{ ListCutiTambahan.indexOf(slotProps.data) + 1 }} <!-- Use indexOf to find the position -->
              </template>
            </Column>
            <Column field="type" header="Tipe Cuti" :sortable="false" headerStyle="width=4% min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.leave_desc }}
              </template>
            </Column>
            <Column field="qty" header="Jumlah Hari" :sortable="false" headerStyle="width=4% min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.qty }}
              </template>
            </Column>
            <Column field="keterangan" header="Keterangan" :sortable="false" headerStyle="width=4% min-width:10rem;">
              <template #body="slotProps">
                {{ slotProps.data.keterangan }}
              </template>
            </Column>
            <Column field="effective_date" header="Tanggal Efektif" :sortable="false"
              headerStyle="width=4% min-width:10rem;">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.effective_date) }}
              </template>
            </Column>
            <Column field="created_at" header="Tanggal Cetak" :sortable="false" headerStyle="width=4% min-width:10rem;">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.created_at) }}
              </template>
            </Column>

          </DataTable>
        </div>
      </div>
    </div>
  </div>

  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Detail Cuti</h5>

        <div v-if="listDetail.pin != '-' && listDetail.pin != ''">
          <!-- Cards displaying data -->
          <!-- <div class="text-lg mb-1 mt-5">Detail Cuti</div> -->
          <!-- Input for selecting month and year with button -->
          <div class="flex items-center space-x-4 mt-3 mb-3 justify-content-between flex-wrap">
            <div>
              <Calendar v-model.trim="selectedYear" view="year" dateFormat="yy"
                @update:model-value="handleYearNumberChange" :minDate="minYearJoin" :maxDate="maxYearJoin"
                class="mr-3" />

              <Dropdown v-model="selectedTypeCuti" :options="ListCutiType" optionLabel="type_cuti" optionValue="type"
                @update:model-value="handleYearNumberChange" placeholder="Select a Type Cuti"
                class="w-full md:w-14rem" />
            </div>
            <div class="flex items-center space-x-4 justify-content-between flex-wrap">
              <div
                v-if="(parseInt(selectedListUserAbsen?.pin) === parseInt(isAuthenticated?.pin)) && (isAuthenticated.divisi == 1 || isAuthenticated.divisi == 2 || isAuthenticated.divisi == 3 || isAuthenticated.divisi == 9)"
                class="sm:mt-4 sm:mr-12 lg:mt-1">
                <button class="ml-3 p-button p-button-warning" @click="openNew">Pemohonan Cuti</button>
              </div>

              <div
                v-else-if="isAuthenticated.divisi !== 1 && isAuthenticated.divisi !== 2 && isAuthenticated.divisi !== 3 && isAuthenticated.divisi !== 9"
                class="sm:mt-4 sm:mr-12 lg:mt-1">
                <button class="ml-3 p-button p-button-warning" @click="openNew">Pemohonan Cuti</button>
              </div>

              <div
                v-if="(isAuthenticated.divisi == 1 || isAuthenticated.divisi == 2 || isAuthenticated.divisi == 3 || isAuthenticated.divisi == 9)"
                class="sm:mt-4 sm:mr-12 lg:mt-1">

                <button v-if="ListYearJoin.find(item => item.year_trx === Number(selectedYear))?.status === 1"
                  class="ml-3 p-button p-button-warning"
                  @click="PostRestart(listDetailCuti.number_officer, listDetailCuti.Year, listDetailCuti.Type)">
                  Refresh Data Cuti
                </button>

              </div>
            </div>
          </div>

          <!-- {{ listDetailCuti }} -->

          <div v-if="selectedTypeCuti != 12" class="mb-3 text-lg">Periode: {{ formatDate(listDetailCuti.AwalPeriode) }}
            - {{ formatDate(listDetailCuti.AkhirPeriode) }}</div>

          <div class="p-fluid formgrid grid">
            <!-- Card for 'SaldoCutiAwal' -->
            <!-- Card for 'CutiTambahan' -->
            <div v-if="selectedTypeCuti == 1"
              :class="['field col-12', selectedTypeCuti == 1 ? 'xl:col-vp' : 'xl:col-3']">
              <div class="card">
                <div class="text-lg">Hak Cuti</div>
                <div class="text-4xl mt-3">{{ listDetailCuti.CutiTambahan }}</div>
              </div>
            </div>

            <div v-if="selectedTypeCuti == 1"
              :class="['field col-12', selectedTypeCuti == 1 ? 'xl:col-vp' : 'xl:col-3']">
              <div class="card">
                <div class="text-lg">Saldo Cuti Awal Periode</div>
                <div class="text-4xl mt-3">{{ listDetailCuti.SaldoCutiAwalTahun }}</div>
              </div>
            </div>

            <div v-else-if="selectedTypeCuti == 12"
              class="field col-12 xl:col-3">
              <div class="card">
                <div class="text-lg">Saldo Cuti Awal</div>
                <div class="text-4xl mt-3">{{ listDetailCuti.SaldoCutiAwalTahun + listDetailCuti.SaldoCutiAwal}}</div>
              </div>
            </div>

            <div v-else class="field col-12 xl:col-3">
              <div class="card">
                <div class="text-lg">Saldo Cuti Awal</div>
                <div class="text-4xl mt-3">{{ listDetailCuti.SaldoCutiAwal }}</div>
              </div>
            </div>
            <!-- Card for 'CarryForward' -->
            <div v-if="selectedTypeCuti == 1"
              :class="['field col-12', selectedTypeCuti == 1 ? 'xl:col-vp' : 'xl:col-3']">
              <div class="card">
                <div class="text-lg">Cuti Carry Forward</div>
                <div class="text-4xl mt-3">{{ listDetailCuti.CarryForward }}</div>
              </div>
            </div>

            <!-- Card for 'CutiTahunanTerpakai' -->
            <div :class="['field col-12', selectedTypeCuti == 1 ? 'xl:col-vv' : 'xl:col-3']">
              <div class="card">
                <div class="text-lg">Cuti Terpakai</div>
                <div class="text-4xl mt-3">{{ listDetailCuti.CutiTahunanTerpakai }}</div>
              </div>
            </div>
            <!-- Card for 'CutiBersama' -->
            <div v-if="selectedTypeCuti == 1"
              :class="['field col-12', selectedTypeCuti == 1 ? 'xl:col-vv' : 'xl:col-3']">
              <div class="card">
                <div class="text-lg">Cuti Bersama</div>
                <div class="text-4xl mt-3">{{ listDetailCuti.CutiBersama }}</div>
              </div>
            </div>
            <!-- Card for 'CarryForwardBalance' -->
            <div v-if="selectedTypeCuti == 1"
              :class="['field col-12', selectedTypeCuti == 1 ? 'xl:col-vv' : 'xl:col-3']">
              <div class="card">
                <div class="text-lg">Carry Forward ({{ formatDate(listDetailCuti.CarryForwardExpiry) }})</div>
                <div class="text-4xl mt-3">{{ listDetailCuti.CarryForwardBalance }}</div>
              </div>
            </div>
            <!-- Card for 'SaldoCutiAhir' -->
            <div :class="['field col-12', selectedTypeCuti == 1 ? 'xl:col-vv' : 'xl:col-3']">
              <div class="card">
                <div class="text-lg">Saldo Cuti Akhir</div>
                <div class="text-4xl mt-3">{{ listDetailCuti.SaldoCutiAhir }}</div>
              </div>
            </div>

            <div
              v-if="Array.isArray(ListCutiType) && (ListCutiType.find(cuti => cuti.type === selectedTypeCuti)?.multi) === 0"
              class="field col-12 xl:col-3">
              <div class="card">
                <div class="text-lg">Tanggal</div>
                <div class="text-lg mt-3 lg:mb-3">
                  <!-- Cek jika ListCuti memiliki data dengan date yang valid -->
                  <template v-if="Array.isArray(ListCuti) && ListCuti.length > 0 && ListCuti.some(cuti => cuti.date)">
                    {{formatDate(ListCuti.sort((a, b) => new Date(a.date) - new Date(b.date))[0].date)}} -
                    {{formatDate(ListCuti.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-1)[0].date)}}
                  </template>
                  <template v-else>
                    <span>Tidak ada data tanggal</span>
                  </template>
                </div>
              </div>

            </div>

            <div class="field col-12 xl:col-6 mt-4 xl:mt-0" v-if="selectedTypeCuti == 1">
              <div class="card">
                <div class="text-lg mb-3">List Cuti</div>
                <DataTable :value="ListCuti" paginator :rows="15" :rowsPerPageOptions="[15, 20, 50, 80, 100]">
                  <template #empty>
                    <div class="text-center p-2">
                      <p class="text-lg font-semibold">No Data Available</p>
                    </div>
                  </template>
                  <!-- tableStyle="min-width: 50rem" -->
                  <Column field="no" header="No" :sortable="false">
                    <template #body="slotProps">
                      {{ ListCuti.indexOf(slotProps.data) + 1 }} <!-- Use indexOf to find the position -->
                    </template>
                  </Column>
                  <Column field="date" header="Tanggal" :sortable="false" headerStyle="width=4% min-width:10rem;">
                    <template #body="slotProps">
                      {{ formatDate(slotProps.data.date) }}
                    </template>
                  </Column>
                  <!-- <Column field="desc" header="Jenis Cuti" :sortable="false"  headerStyle="width=4% min-width:10rem;">
                    <template #body="slotProps">
                      {{ slotProps.data.desc }}
                    </template>
                  </Column> -->
                  <Column field="keterangan" header="Keterangan" :sortable="false"
                    headerStyle="width=4% min-width:10rem;">
                    <template #body="slotProps">
                      {{ slotProps.data.keterangan }}
                    </template>
                  </Column>
                </DataTable>
              </div>
            </div>

            <div class="field col-12 xl:col-12 mt-4 xl:mt-0" v-else>
              <div class="card">
                <div class="text-lg mb-3">List Cuti</div>
                <DataTable :value="ListCuti" paginator :rows="15" :rowsPerPageOptions="[15, 20, 50, 80, 100]">
                  <template #empty>
                    <div class="text-center p-2">
                      <p class="text-lg font-semibold">No Data Available</p>
                    </div>
                  </template>
                  <!-- tableStyle="min-width: 50rem" -->
                  <Column field="no" header="No" :sortable="false">
                    <template #body="slotProps">
                      {{ ListCuti.indexOf(slotProps.data) + 1 }} <!-- Use indexOf to find the position -->
                    </template>
                  </Column>
                  <Column field="date" header="Tanggal" :sortable="false" headerStyle="width=4% min-width:10rem;">
                    <template #body="slotProps">
                      {{ formatDate(slotProps.data.date) }}
                    </template>
                  </Column>
                  <!-- <Column field="desc" header="Jenis Cuti" :sortable="false"  headerStyle="width=4% min-width:10rem;">
                    <template #body="slotProps">
                      {{ slotProps.data.desc }}
                    </template>
                  </Column> -->
                  <Column field="keterangan" header="Keterangan" :sortable="false"
                    headerStyle="width=4% min-width:10rem;">
                    <template #body="slotProps">
                      {{ slotProps.data.keterangan }}
                    </template>
                  </Column>
                </DataTable>
              </div>
            </div>


            <!-- <div class="field col-12 xl:col-6 mt-4 xl:mt-0">
              <div class="card">
                <FullCalendar :options="calendarOptions" />
              </div>
            </div> -->

            <div class="field col-12 xl:col-6 mt-4 xl:mt-0" v-if="selectedTypeCuti == 1">
              <div class="card">
                <div class="text-lg mb-3">Kalender Cuti Bersama</div>
                <DataTable :value="ListCutiBersama">
                  <!-- tableStyle="min-width: 50rem" -->
                  <Column field="no" header="No" :sortable="false" headerStyle="width=4% min-width:10rem;">
                    <template #body="slotProps">
                      {{ ListCutiBersama.indexOf(slotProps.data) + 1 }} <!-- Use indexOf to find the position -->
                    </template>
                  </Column>
                  <Column field="date" header="Tanggal" :sortable="false" headerStyle="width=4% min-width:10rem;">
                    <template #body="slotProps">
                      {{ formatDate(slotProps.data.date) }}
                    </template>
                  </Column>
                  <Column field="desc" header="Keterangan" :sortable="false" headerStyle="width=4% min-width:10rem;">
                    <template #body="slotProps">
                      {{ slotProps.data.desc }}
                    </template>
                  </Column>
                </DataTable>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="suratDialog" :style="{ width: '450px' }" header="Pemohonan Cuti" :modal="true"
    class="p-fluid">
    <div class="field">
      <label for="name">Category</label>
      <Dropdown inputId="class" v-model="surat.category" :options="categoryList" @change="setTemplate($event)"
        optionLabel="name" placeholder="Select a Category" required="true" autofocus
        :class="{ 'p-invalid': submitted && !surat.category }" />
      <small class="p-error" v-if="submitted && !surat.category">Category is required.</small>
    </div>

    <div class="field">
      <label for="name">Jenis Permohonan Cuti</label>
      <Dropdown inputId="class" v-model="selectedTemplate" :options="templateList" optionLabel="name"
        placeholder="Select a Jenis Permohonan Cuti" required="true" autofocus
        :class="{ 'p-invalid': submitted && !selectedTemplate }" :disabled="!selectedTemplate" />
      <small class="p-error" v-if="submitted && !selectedTemplate">Jenis Permohonan Cuti is required.</small>
    </div>


    <div class="field">
      <label for="divisi">Divisi Tujuan</label>
      <MultiSelect id="divisi" display="chip" v-model="surat.divisi" @change="setDivisi($event)"
        :class="{ 'p-invalid': submitted && !surat.divisi }" :options="optionDivisi" optionLabel="name"
        placeholder="Pilih Divisi Tujuan" filter panelClass="custom-panel" required autofocus />

      <small class="p-error" v-if="submitted && !surat.divisi">Divisi Tujuan is required.</small>
    </div>

    <div class="field">
      <label for="divisi">Tujuan</label>
      <MultiSelect id="tujuan" display="chip" v-model="surat.tujuan" @change="setTujuan($event)"
        :class="{ 'p-invalid': submitted && !surat.tujuan }" :options="optionTujuan" optionLabel="user_name"
        placeholder="Pilih Tujuan" filter panelClass="custom-panel" required autofocus />

      <small class="p-error" v-if="submitted && !surat.tujuan">Tujuan Time is required.</small>
    </div>

    <div class="field">
      <label for="divisi">Penandatangan</label>
      <MultiSelect id="signer" display="chip" v-model="surat.signer" @change="setSigner($event)"
        :class="{ 'p-invalid': submitted && !surat.signer }" :options="optionSigner" optionLabel="user_name"
        placeholder="Pilih Penandatangan" filter panelClass="custom-panel" required autofocus />

      <small class="p-error" v-if="submitted && !surat.signer">Penandatangan Time is required.</small>
    </div>

    <div class="field">
      <label for="verificator">Verificator</label>
      <Dropdown id="verificator" display="chip" v-model="surat.verificator" @change="setVerificator($event)"
        :class="{ 'p-invalid': submitted && !surat.verificator }" :options="optionVerif" optionLabel="user_name"
        placeholder="Pilih Verificator" filter panelClass="custom-panel" required autofocus />

      <small class="p-error" v-if="submitted && !surat.verificator">Verificator Time is required.</small>
    </div>

    <!-- Category -->
    <div v-if="selectedTemplate && selectedTemplate.name === 'Permohonan Cuti Panjang'" class="field">
      <label for="divisi">Kategori</label>
      <Dropdown id="kategori" display="chip" v-model="surat.kategori" @change="setTypeIzinNew($event)"
        :class="{ 'p-invalid': submitted && !surat.kategori }" :options="optionTypeIzinPanjang" optionLabel="type_cuti"
        placeholder="Pilih Cuti" filter panelClass="custom-panel" required autofocus />

      <small class="p-error" v-if="submitted && !surat.kategori">Kategori Time is required.</small>

      <div class="mt-3" style="background: rgba(4, 168, 59, 0.425)0000; border-radius: 6px">
        <p class="p-2 py-1 font-bold">Max Jumlah / Default Cuti: {{ totalSisaCuti || 0 }} </p>
      </div>
    </div>

    <div v-if="selectedTemplate && selectedTemplate.name === 'Permohonan Cuti'" class="field">
      <label for="divisi">Kategori</label>
      <Dropdown id="kategori" display="chip" v-model="surat.kategori" @change="setTypeIzinNew($event)"
        :class="{ 'p-invalid': submitted && !surat.kategori }" :options="optionTypeIzin" optionLabel="type_cuti"
        placeholder="Pilih Cuti" filter panelClass="custom-panel" required autofocus />

      <small class="p-error" v-if="submitted && !surat.kategori">Kategori Time is required.</small>

      <div v-if="surat.kategori !== 10" class="mt-3"
        style="background: rgba(4, 168, 59, 0.425)0000; border-radius: 6px">
        <p class="p-2 py-1 font-bold">Max Jumlah / Default Cuti: {{ totalSisaCuti || 0 }} </p>
      </div>
    </div>

    <!-- Date -->
    <!-- Only display Tanggal for 'Permohonan Cuti Panajang' template -->
    <div v-if="selectedTemplate && selectedTemplate.name === 'Permohonan Cuti Panjang'" class="field mt-3">
      <label for="dateFull">Tanggal</label>
      <Calendar id="dateFull" :minDate="minDateSurat" v-model="surat.dateFull"
        :class="{ 'p-invalid': submitted && !surat.dateFull }" />
      <small class="p-error" v-if="submitted && !surat.dateFull">Tanggal is required.</small>
    </div>

    <!-- Only display Tanggal for 'Permohonan Cuti' template -->
    <div v-if="selectedTemplate && selectedTemplate.name === 'Permohonan Cuti'" class="field mt-3">
      <label for="date">Tanggal</label>
      <Calendar id="date" :minDate="minDateSurat" v-model="surat.date" selectionMode="multiple"
        :class="{ 'p-invalid': submitted && !surat.date }" @date-select="validasiLimitTanggalCutiMulti(surat.date)" />
      <small class="p-error" v-if="submitted && !surat.date">Tanggal is required.</small>
    </div>

    <div class="field">
      <label for="keterangan">Keterangan Cuti</label>
      <Textarea inputId="keterangan" v-model="surat.keterangan" required="true" autofocus
        :class="{ 'p-invalid': submitted && !surat.keterangan }" />
      <small class="p-error" v-if="submitted && !surat.keterangan">Keterangan is required.</small>
    </div>

    <template #footer>
      <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Save" icon="pi pi-check" text @click="saveData" />
    </template>
  </Dialog>
</template>

<script>
export default {
  data() {
    return {
      showAllIds: new Set(), // Menggunakan Set untuk menyimpan ID yang sedang ditampilkan
    };
  },
  computed: {
    showAll() {
      return (id) => this.showAllIds.has(id);
    },
  },
  methods: {
    toggleShowAll(id) {
      if (this.showAllIds.has(id)) {
        this.showAllIds.delete(id);
      } else {
        this.showAllIds.add(id);
      }
    },
  },
};
</script>

<style>
@media screen and (min-width: 1200px) {
  .xl\:col-vp {
    flex: 0 0 auto;
    padding: 1rem;
    width: 33.3%;
  }

  .xl\:col-vv {
    flex: 0 0 auto;
    padding: 1rem;
    width: 25.0%;
  }
}
</style>
