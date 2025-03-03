<script setup>
// import AppConfig from '@/layout/AppConfig.vue';
const isAuthenticated = localStorage.getItem('sipam');
console.log(JSON.parse(isAuthenticated));
</script>
<template>
    <div className="grid">
        <div className="col-12">
            <div className="card">
                <h5>Welcome</h5>
                <p>This is SiPAM dashboard page.</p>
            </div>
        </div>
    </div>
</template>
