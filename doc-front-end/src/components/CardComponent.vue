<template>

    <div class="w-full p-4 shadow-md rounded-xs">
        <template v-if="loading">
            <div class="skeleton w-full max-w-75 h-4 mb-3"></div>
            <div class="skeleton w-full h-10"></div>
        </template>

        <template v-else>
            <h2 class="text-base text-gray-300 mb-3 font-primary">
                {{ title }}:
            </h2>
    
            <p class="text-3xl font-bold text-black-900 font-primary">
                {{ value }} {{ simbols }}
            </p>
        </template>
    </div>

</template>

<script setup lang="ts">

defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    simbols: {
        type: String,
        required: true
    }
});


</script>

