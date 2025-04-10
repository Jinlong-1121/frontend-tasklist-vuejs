<template>
    <div class="card">
        <Breadcrumb class="mb-4" :home="breadcrumbHome" :model="breadcrumbItems" />
        <Toolbar class="mb-4">
                <template v-slot:start>
                    <div class="flex flex-wrap gap-3">
                        <!-- <div>
                            <h5 class="m-0">{{ accountDetail.description }}</h5>
                        </div> -->
                        <Button v-if="accountDetail.level==1" type="button" icon="pi pi-plus" class="p-button-info mr-2" :label="selectedType ? selectedType.name : 'New'" @click="toggle" aria-haspopup="true" aria-controls="overlay_panel" />
                        <Button v-if="accountDetail.level!=1 && typeof accountDetail.level!='undefined'" label="New" icon="pi pi-plus" class="p-button-info mr-2" @click="openNew" />
                        <Button v-if="accountDetail.general_detail==1" label="New Child" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                    </div>
                </template>
                <template v-slot:center>
                    <div class="flex flex-wrap gap-3">
                        <div>
                            <h5 class="m-0">{{ accountDetail.description }}</h5>
                        </div>
                    </div>
                </template>

                <template v-slot:end>
                    <div class="flex flex-wrap gap-3">
                        <Calendar v-model="dateSearch" placeholder="Created At" showButtonBar />
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="keywords" placeholder="Keyword Search" />
                        </span>
                        <Button type="submit" label="Filter" class="" @click="accessData"/>
                    </div>
                </template>
            </Toolbar>
        <DataTable v-model:selection="selectedProduct" :value="products" selectionMode="single" dataKey="account_no" :metaKeySelection="false"
                @rowSelect="onRowSelect" @rowUnselect="onRowUnselect" :rowClass="rowClass" :rowStyle="rowStyle" tableStyle="min-width: 50rem" class="p-datatable-sm">
            <Column style="width: 10rem;" field="code" header="Code">
             <template #body="slotProps">
                    <div :class="codeClass(slotProps.data)">
                        {{ slotProps.data.account_no }}
                    </div>
                </template>
            </Column>
            <Column field="description" header="Name"></Column>
            <Column field="account_type" header="Type"></Column>
            <Column field="account_cost" header="Cost">
                <!-- <template #body="slotProps">
                    <div :class="stockClass(slotProps.data)">
                        {{ slotProps.data.quantity }}
                    </div>
                </template> -->
            </Column>
            <Column style="flex: 0 0 4rem">
                <template #body="{ data }">
                    <!-- <Button type="button" icon="pi pi-lock-open" text size="small" @click="addChild(data)" /> -->
                    <Button v-if="data.general_detail!==0" icon="pi pi-plus" severity="secondary" rounded outlined aria-label="Add Child" size="small" @click="openNew(data)"/>
                </template>
            </Column>
        </DataTable>
        <!-- <div v-for="number in sequentialNumbers" :key="number">{{ number }}</div> -->
        
        <Dialog v-model:visible="accountDialogHeader" :style="{width: '450px'}" header="New Account" :modal="true" class="p-fluid">
            <div class="field">
                <label for="account_no">Account Number</label>
                <InputText id="account_no" v-model.trim="account.account_no" required="true" autofocus :class="{'p-invalid': submittedHeader && !account.account_no}" />
                <small class="p-error" v-if="submittedHeader && !account.name">Account Number is required.</small>
            </div>
            <div class="field">
                <label for="description">Account Name</label>
                <InputText id="description" v-model.trim="account.description" required="true" autofocus :class="{'p-invalid': submittedHeader && !account.description}" />
                <small class="p-error" v-if="submittedHeader && !account.name">Name is required.</small>
            </div>
            <div class="field">
                <label for="type">Account Type</label>
                <Dropdown
                    inputId="class"
                    v-model.trim="account.account_type"
                    :options="accountTypeList"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Type"
                />
            </div>
            <div class="field">
                <label for="accountCost">Account Cost {{ account }}</label>
                <SelectButton v-model="account.account_cost" :options="trueFalse" optionLabel="name" optionValue="id" aria-labelledby="basic" />
            </div>
            <div class="field">
                <label for="costCenter">Cost Center {{ account.cost_center }}</label>
                <SelectButton v-model="account.cost_center" :options="trueFalse" optionLabel="name" optionValue="id" aria-labelledby="basic" />
            </div>
            <div class="field">
                <label for="status">Status {{ account.status }}</label>
                <SelectButton v-model="account.status" :options="trueFalse" optionLabel="alias" optionValue="id" aria-labelledby="basic" />
            </div>

            <!-- <div class="field">
                <label for="status" class="mb-3">Status</label>
                <Dropdown id="status" v-model="selectedStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
                    <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                            <Tag :value="slotProps.value.label" :severity="getStatusLabel(slotProps.value.value)" />
                        </div>
                        <div v-else-if="slotProps.value && !slotProps.value.value">
                            <Tag :value="slotProps.value==='1' ? 'Active' : 'No Active'" :severity="getStatusLabel(slotProps.value)" />
                        </div>
                        <span v-else>
                            {{slotProps.placeholder}}
                        </span>
                    </template>
                </Dropdown>
            </div> -->
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" text @click="addAccountHeader" />
            </template>
        </Dialog>

        <Dialog v-model:visible="accountDialog" :style="{width: '450px'}" header="New Account" :modal="true" class="p-fluid">
            <div class="field">
                <label for="account_no">Account Number</label>
                <InputText id="account_no" v-model.trim="account.account_no" required="true" autofocus :class="{'p-invalid': submitted && !account.account_no}" />
                <small class="p-error" v-if="submitted && !account.name">Account Number is required.</small>
            </div>
            <div class="field">
                <label for="description">Account Name</label>
                <InputText id="description" v-model.trim="account.description" required="true" autofocus :class="{'p-invalid': submitted && !account.description}" />
                <small class="p-error" v-if="submitted && !account.name">Name is required.</small>
            </div>
            <div class="field">
                <label for="generalDetail">General Detail</label>
                <SelectButton v-model.trim="account.general_detail" :options="trueFalse" optionLabel="name" optionValue="id" aria-labelledby="basic" />
            </div>
            <!-- <div class="field">
                <label for="type">Account Type</label>
                <Dropdown
                    inputId="class"
                    v-model.trim="account.account_type"
                    :options="accountTypeList"
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Type"
                />
            </div> -->
            <div class="field">
                <label for="accountCost">Account Cost {{ account }}</label>
                <SelectButton v-model="account.account_cost" :options="trueFalse" optionLabel="name" optionValue="id" aria-labelledby="basic" />
            </div>
            <div class="field">
                <label for="costCenter">Cost Center {{ account.cost_center }}</label>
                <SelectButton v-model="account.cost_center" :options="trueFalse" optionLabel="name" optionValue="id" aria-labelledby="basic" />
            </div>
            <div class="field">
                <label for="status">Status {{ account.status }}</label>
                <SelectButton v-model="account.status" :options="trueFalse" optionLabel="name" optionValue="id" aria-labelledby="basic" />
            </div>

            <!-- <div class="field">
                <label for="status" class="mb-3">Status</label>
                <Dropdown id="status" v-model="selectedStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
                    <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                            <Tag :value="slotProps.value.label" :severity="getStatusLabel(slotProps.value.value)" />
                        </div>
                        <div v-else-if="slotProps.value && !slotProps.value.value">
                            <Tag :value="slotProps.value==='1' ? 'Active' : 'No Active'" :severity="getStatusLabel(slotProps.value)" />
                        </div>
                        <span v-else>
                            {{slotProps.placeholder}}
                        </span>
                    </template>
                </Dropdown>
            </div> -->
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" text @click="addAccount" />
            </template>
        </Dialog>

        <OverlayPanel ref="op" appendTo="body" showCloseIcon>
            <DataTable v-model:selection="selectedType" :value="accountTypeList" selectionMode="single" :paginator="false" :rows="10" @row-select="onTypeSelect">
                <Column field="id" header="ID" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Name" sortable style="min-width: 12rem"></Column>
            </DataTable>
        </OverlayPanel>
    </div>
    <Toast/>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AccountService } from '@/service/AccountingService';
import { useToast } from 'primevue/usetoast';

const selectedProduct = ref();
const selectedType = ref();
const toast = useToast();
const op = ref();
const toggle = (event) => {
    op.value.toggle(event);
};

const onTypeSelect = (event) => {
    op.value.hide();
    account.value.account_type = event.data.id
    openNewHeader();
    toast.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name, life: 3000 });
}
const onRowSelect = (event) => {
    accountDetail.value = event.data;
    // console.log("ada"+ selectedProduct.value.description);
    toast.add({ severity: 'info', summary: 'Product Selected', detail: 'Name: ' + event.data.description, life: 3000 });
};
const onRowUnselect = (event) => {
    accountDetail.value = {};
    toast.add({ severity: 'warn', summary: 'Product Unselected', detail: 'Name: ' + event.data.description, life: 3000 });
}

const accountDialogHeader = ref(false);
const accountDialog = ref(false);
const account = ref({
    account_no: "",
    parent: "",
    level: 1,
    account_type: 0,
    description: "",
    general_detail: 1,// 1 = general, 0 = detail
    account_cost: 1,
    cost_center: 1,
    status: 1,
});
const submittedHeader = ref(false);
const submitted = ref(false);

onMounted(() => {
    // account.value.account_cost = 1
    // account.value.cost_center = 1
    // account.value.status = 1
    // const account = ref({
    //     account_cost: 1,
    //     cost_center: 1,
    //     status: 1,
    // });
    AccountService.getList().then((data) => (products.value = data));
});

const products = ref();
const accountDetail = ref({});
const accountCostVal = ref();
const costCenterVal = ref();
const statusVal = ref(1);
const accountTypeList = ref([
    {
        id: 1,
        name: "Asset",
    },
    {
        id: 2,
        name: "Kewajiban",
    },
    {
        id: 3,
        name: "Equitas",
    },
]);
const trueFalse = ref([
    {
        id: 1,
        name: "True",
        alias: "Active",
    },
    {
        id: 0,
        name: "False",
        alias: "Inactive",
    },
]);

const inputData = ref({
    account_no: "",
    parent: "",
    level: 1,
    account_type: 1,
    description: "",
    general_detail: 1,// 1 = general, 0 = detail
    account_cost: 1,
    cost_center: 1,
    status: 1,
})

const rowClass = (data) => {
    if (data.level === 1) {
        return [{ 'bg-primary' : true }];
    }
    if (data.level === 2) {
        return [{ 'bg-primary-100': true }];
    }
    return [{ 'bg-primary': false }];
};
const rowStyle = (data) => {
    if (data.level === 1 || data.level === 2) {
        return { fontWeight: 'bold' };
    }
};
const codeClass = (data) => {
    return [
        // 'border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm',
        {
            'pl-2': data.level === 2,
            'pl-4': data.level === 3
        }
    ];
};

const addChild = (data) => {
    resetInput()
    // const lvl = (data.level == 1) ? 2 : 3;
    // const genDetail = (data.level == 3) ? 0 : 1;
    // inputData.value.account_no = data.account_no
    inputData.value.parent = data.account_no
    // inputData.value.level = lvl
    inputData.value.account_type = data.account_type
    inputData.value.account_cost = data.account_cost
    inputData.value.cost_center = account.value.cost_center
    inputData.value.status = account.value.status
    // console.log(data.account_no, "data");
    // console.log(inputData.value, "data input");
};

const addAccountHeader = () => {
    inputData.value.account_no = account.value.account_no
    inputData.value.parent = ""
    inputData.value.level = 1
    inputData.value.description = account.value.description
    inputData.value.general_detail = 1
    inputData.value.account_cost = account.value.account_cost
    inputData.value.cost_center = account.value.cost_center
    inputData.value.status = account.value.status
    // console.log(inputData.value, "data input");
    // AccountService.createAccount(inputData.value).then(() => {
    //     hideDialog()
    //     AccountService.getList().then((data) => (products.value = data));
    // });
}
const addAccount = () => {
    const lvl = (account.value.general_detail == 0) ? 3 : 2;
    inputData.value.account_no = account.value.account_no
    // inputData.value.parent = account.value.parent
    inputData.value.level = lvl
    inputData.value.description = account.value.description
    inputData.value.general_detail = account.value.general_detail
    inputData.value.account_cost = account.value.account_cost
    inputData.value.cost_center = account.value.cost_center
    inputData.value.status = account.value.status
    // console.log(inputData.value, "data input");
    AccountService.createAccount(inputData.value).then(() => {
        hideDialog()
        AccountService.getList().then((data) => (products.value = data));
    });
    // createAccount()
}

const openNewHeader = () => {
    // account.value = {};
    resetAccount();
    resetInput();
    submittedHeader.value = false;
    accountDialogHeader.value = true;
    // selectedDivisi.value = user.value.divisi;
};
const openNew = (data) => {
    addChild(data)
    // account.value = {};
    submitted.value = false;
    accountDialog.value = true;
    // selectedDivisi.value = user.value.divisi;
};

const hideDialog = () => {
    accountDialogHeader.value = false;
    accountDialog.value = false;
    submitted.value = false;
};
const resetAccount = () => {
    inputData.value.account_no = ""
    inputData.value.parent = ""
    inputData.value.level = 0
    inputData.value.account_type = 0
    inputData.value.description = ""
    inputData.value.general_detail = 1
    inputData.value.account_cost = 1
    inputData.value.cost_center = 1
    inputData.value.status = 1
}
const resetInput = () => {
    inputData.value.account_no = ""
    inputData.value.parent = ""
    inputData.value.level = 1
    inputData.value.account_type = 1
    inputData.value.description = ""
    inputData.value.general_detail = 1
    inputData.value.account_cost = 1
    inputData.value.cost_center = 1
    inputData.value.status = 1
}
// const stockClass = (data) => {
//     return [
//         'border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm',
//         {
//             'bg-red-100 text-red-900': data.quantity === 0,
//             'bg-blue-100 text-blue-900': data.quantity > 0 && data.quantity < 10,
//             'bg-teal-100 text-teal-900': data.quantity > 10
//         }
//     ];
// };
const startNumber = "100.00.000";
const sequentialNumbers = ref([]);

// Function to increment the number based on the pattern
const incrementNumber = (number, position) => {
  const parts = number.split('.');
  if (position===1) {
      parts[position] = String(parseInt(parts[position], 10) + 10).padStart(2, '0');
    } else {
        parts[position] = String(parseInt(parts[position], 10) + 1).padStart(3, '0');
    }
  return parts.join('.');
};

// Generate sequential numbers
let currentNumber = startNumber;
for (let i = 0; i < 5; i++) {
  sequentialNumbers.value.push(currentNumber);
  currentNumber = incrementNumber(currentNumber, 2); // Increment the last part
  if (i % 2 === 0) {
    currentNumber = incrementNumber(currentNumber, 1); // Increment the middle part every two iterations
  }
}

// const generateSequentialNumbers = (start, end, step) => {
//   const numbers = [];
//   for (let i = start; i <= end; i += step) {
//     numbers.push(formatNumber(i));
//   }
//   return numbers;
// };

// const formatNumber = (number) => {
//   const parts = number.toString().split('.');
//   return parts.map((part, index) => (index === parts.length - 1 ? part.padStart(3, '0') : part)).join('.');
// };

// const sequentialNumbers = generateSequentialNumbers(100000000, 100200001, 1);
</script>
