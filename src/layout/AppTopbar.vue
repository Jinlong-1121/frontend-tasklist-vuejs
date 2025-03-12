<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import TaskListService, { RetrunValue } from "@/service/TaskListService";
const { layoutConfig, onMenuToggle, contextPath } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();
const dataItemUser = JSON.parse(localStorage.getItem("sipam")) 
const Clicked = ref("");
const items= [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },]

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});


// const logoUrl = computed(() => {
//     return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
// });

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};

// Handle Logout
const handleLogout = () => {
    localStorage.removeItem("sipam")
    router.push('/auth/login');
}



// End Handle Logout

</script>
<script>
import { defineComponent, isReadonly, ref } from "vue";
const dataLocal = localStorage.getItem("sipam");

import TaskListService, { RetrunValue } from "@/service/TaskListService";

export default {
data() {
  return {
    userid: null,
    name: null,
    data: null,
    loading: false,
    error: null,
    intervalId: null,
    snackbar:false,
    TaskCount:0,
    TaskUser:[],
    TaskCount:null
  }  
},
async mounted() {
        if(this.userid == null)
        {
            const taskService = new TaskListService();
            const Useridd = await taskService.GetUser("GetUserid",JSON.parse(dataLocal).pin);
            this.userid = Useridd[0].number_officer;
        }
        
        await this.startPolling()
    },
    methods: {
        async fetchData(){
        try {
            const taskService = new TaskListService();
            const Task = await taskService.FetchingNotifications(this.userid);
            if(Task[0].new_task > 0)
            {
                this.TaskCount = Task[0].new_task;
                this.snackbar = true;
            }
            this.TaskUser = await taskService.FetchingUserNotifications(this.userid);
            if(this.TaskUser.length > 0){
                let newStatusCount = 0;
                for (let i = 0; i < this.TaskUser.length; i++) {
                    if (this.TaskUser[i].notif_status === "NEW") {
                        newStatusCount++;
                    }
                }
                this.TaskCount = newStatusCount;
            }else{
                this.TaskCount = 0;
            }
        } catch (error) {
        console.error("Error fetching task summary:", error);
        }
        },
        async NotifClicked(TaskUsers) {
            var url_value = ""
            const taskService = new TaskListService();
            const data = {
                taskid: TaskUsers.notif_value
            };
            const Tasklist = await taskService.UpdateStatusNotifTask(data);
            this.fetchData();
            if(TaskUsers.notif_category == "New Task Available"){
                url_value = `#/tasklist?Taskid=${TaskUsers.notif_value}`
            }
            if(TaskUsers.notif_category == "You Have New Comments"){
                const taskService = new TaskListService();
                const taskid = await taskService.GetTaskID(TaskUsers.notif_value);
                if(taskid[0].task_id != null)
                {
                    url_value = `#/tasklist?Taskid=${taskid[0]?.task_id || ''}`
                }else{
                    url_value = `#/tasklist`
                }
            }
        const url = url_value;
        window.location.href = url;
        window.location.reload();
        },
        async startPolling() {
        await this.fetchData(); 
        this.intervalId = setInterval(() => {
        this.fetchData(); 
      }, 5000); // 5000 ms = 5 seconds
    },
    stopPolling() {
    if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        }}, 
    },
}
</script>
<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <!-- <img :src="logoUrl" alt="logo" /> -->
            <span>SiPAM{{ Clicked }}</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>
        
        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <!-- <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
                <i class="pi pi-calendar"></i>
                <span>Calendar</span>
            </button> -->
            
            <div style="align-self: center;display: grid;grid-template-columns: auto auto;width: 300px;">
                <v-menu class="Notif-Box"
                location="bottom"
                transition="slide-y-transition"
                width="auto"
                height="500px"
                >
                    <template v-slot:activator="{ props }" >
                        <v-badge :content="TaskCount"  style="margin-right: auto;" >
                            <v-icon class="Notifinprofile" icon="mdi-bell" v-bind="props"  size="x-large" ></v-icon>
                        </v-badge>
                    </template>
                    <v-list style="width: 290px;height: auto;max-height: 500px;">
                        <v-list-item v-if="TaskCount > 0"
                        v-for="(TaskUsers, index) in TaskUser"
                        :key="index"
                        :value="index"
                        @click="NotifClicked(TaskUsers)"
                        >
                        <div  class="Notif-Item">
                            <div class="Notif-Item-Header">
                                <a>{{ TaskUsers.notif_category }}</a>
                            </div>
                            <div
                            :style="{ backgroundColor: TaskUsers.notif_status === 'NEW' ? '#b8b8b8' : TaskUsers.notif_status === 'Clicked' ? '#ffffff':''}"
                            class="Notif-Item-Detail"
                            
                            >
                                <div style="display: grid;grid-template-columns: 60px auto;">
                                    <a>ID</a>
                                    <a>: <a>{{ TaskUsers.notif_value }}</a></a>
                                </div>
                                <div style="display: grid;grid-template-columns: 60px auto;">
                                    <a>Subject</a>
                                    <a>: <a>{{ TaskUsers.subject }}</a></a>
                                </div>
                                <a style="text-align: center;">Click Here To Show Detail</a>
                            </div>

                        </div>
                        
                        </v-list-item>
                        <div v-else style="height: 20px;">
                            <div style="text-align: center;">
                                <a>No Notification Available</a>
                            </div>
                        </div>
                    </v-list>
                    </v-menu>
                <p class="mb-0" style="font-weight: bold;">{{ dataItemUser.user_name }} </p>
            </div>
            <button @click="handleLogout()" class="p-link layout-topbar-button">
                <i class="pi pi-sign-out"></i>
                <span>Logout</span>
            </button>
        </div>
    </div>
    <v-snackbar
    
      style="justify-content: right;align-items: start;margin-top: 80px;"
      v-model="snackbar"
    >
      {{ TaskCount + " New Task Added"  }}

      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<style lang="scss" scoped>


.Notifinprofile:hover{
    cursor:pointer;
}
.Notif-Item{
    width: 250px;
    border: 2px solid #FFC627;
    border-top-left-radius: 20px;
    border-bottom-right-radius: 20px;
    margin: auto;
}
.Notif-Item :hover{
    background-color: #868686;
}
.Notif-Item-Header{
    color: #ffffff;
    background-color: #868686;
    border-top-left-radius: 20px;
    width: 100%;
    height: 20px;
    text-align: center;
    margin: auto
}
// .Notif-Item-Header :hover{
//     background-color: #000;
// }
.Notif-Item-Detail{
    background-color: #ffffff;

    border-bottom-right-radius: 20px;
    display: grid;
    grid-template-rows: auto auto auto;
}
.Notif-Item-Detail :hover{
    background-color: #868686;
}
.Notif-Item-Detail a:hover{
    background-color: transparent;
}
.Notif-Item-Detail div:hover{
    background-color: transparent;
}

</style>
