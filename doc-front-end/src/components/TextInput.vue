<template>

    <div :class="attr.class">
        <label :for="id">
            <p class="text-base text-gray-300 font-primary mb-2">
                {{ label }}
            </p>
        </label>

        <div 
            class="w-full px-5 py-2 bg-gray-200 min-h-16 rounded-xl flex items-center gap-1"
            :class="{ 'ring-2 ring-blue-300': isFocused }">
                <div 
                    :class="{ 
                        'text-black-900': value.length || isFocused, 
                        'text-gray-100': !value.length && !isFocused 
                    }">
                    <slot name="icon"></slot>
                </div>
    
                <input
                    :type="type"
                    :placeholder="placeholder"
                    :id="id"
                    class="w-full h-12 outline-none bg-transparent placeholder:font-primary placeholder:font-medium placeholder:text-gray-100"
                    @focus="handleFocus(true)"
                    @blur="handleFocus(false)"
                    v-model="value" />
    
        </div>

        <p v-if="error" class="text-sm text-red-500 mt-1">
            {{ error }}
        </p>
    </div>


</template>

<script setup lang="ts">

import { shallowRef, useAttrs } from 'vue';

defineProps({
    type: {
        type: String,
        default: 'text',
        validate: (value: string) => ['text', 'password', 'email'].includes(value)
    },
    placeholder: {
        type: String,
        default: 'Digite seu texto aqui'
    },
    id: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        default: ''
    },
    error: {
        type: String,
        default: ''
    }
});

defineOptions({
    inheritAttrs: false,
})

const attr = useAttrs();

const isFocused = shallowRef(false);
const value = defineModel<string>({ default: '' });


function handleFocus(value: boolean) {
    isFocused.value = value;
}

</script>