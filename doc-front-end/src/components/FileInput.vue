<template>
    <label class="cursor-pointer">
        <div class="pointer-events-none w-full min-h-75 border border-blue-400 border-dashed rounded-md flex flex-col items-center justify-center">
            <input type="file" class="hidden" @change="handlerFileUpload" />

            <div class="text-center font-primary">
                <upload-cloud :size="60" class="mx-auto mb-5 text-gray-500" />
                <p class="text-gray-500">Clique para selecionar um arquivo</p>

                <template v-if="hasFile">
                    <p class="mt-10 text-blue-400">{{ model?.name }}</p>
                    <p class="text-sm text-blue-400 mt-3">
                        {{ fileSizeInMB }} MB
                    </p>
                </template>
            </div>
        </div>
    </label>
</template>

<script setup lang="ts">

import { computed } from 'vue';
import { UploadCloud } from '@lucide/vue';

const model = defineModel<File | null>({ default: null });

const hasFile = computed(() => !!model.value);

const fileSizeInMB = computed(() => {
    if (!model.value) {
        return 0;
    }

    return (model.value.size / Math.pow(1024, 2)).toFixed(2);
});

function handlerFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;

    if (!target.files || target.files.length === 0) {
        model.value = null;
        return;
    }

    model.value = target.files[0];
}

</script>