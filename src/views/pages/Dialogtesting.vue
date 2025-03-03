<template>
    <div style="width: 300px;height: 300px;">
        <v-dialog v-model="dialog" width="300px" height="300px" align-center>
            <div style="background-color: white;width: 300px;height: 300px;">

            </div>
        </v-dialog>
    </div>
</template>

<script >
import { defineComponent } from 'vue'

export default defineComponent({
    setup () {
        
        return {
        }
    },
    data() {
        return {
            dialog: false
        }
    },
    methods: {
        async enabledialog() {
            this.dialog = true;
        },
        disabledialog() {
            this.dialog = false;
        }   
    }

})
</script>

<style scoped>

</style>