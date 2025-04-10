<script setup>
import { useLayout } from '@/layout/composables/layout';
// import { computed } from 'vue';

const { layoutConfig, contextPath } = useLayout();

// const logoUrl = computed(() => {
//     return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
// });
</script>

<template>
    <div class="layout-footer">
        <!-- <img :src="logoUrl" alt="Logo" height="20" class="mr-2" /> -->
        by
        <span class="font-medium ml-2">PurwantoAM, <a style="color: #4f4f4f;" href="https://docs.google.com/spreadsheets/d/e/2PACX-1vTnfp1hqzDT8ba0OREwsvnDXebtBsGELHWH5zO5cvTycDEXtAP_MG58cHvStfD5gpjuHLr80oiXg4YG/pubhtml?gid=0&single=true" target="_blank"> Versi 3.253.21.0</a></span>
    </div>
</template>
<style lang="scss" scoped></style>
