<template>
    <button
        class="h-16 px-7 py-4 bg-blue-400 text-white rounded-md cursor-pointer hover:bg-blue-500 transition-colors duration-300"
        @click="$emit('click')"
        :disabled="disabled"
        >
            <slot name="default"></slot>
    </button>
</template>

<script setup lang="ts">

defineEmits(['click']);
defineProps({
    disabled: {
        type: Boolean,
        default: false,
    }
})

</script>
