<template>

    <div class="w-full max-w-2xl mx-auto">
        <div class="mb-5">
            <router-link to="/" class="text-blue-500 font-primary">
                <arrow-left class="inline" />
                Voltar para Home
            </router-link>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-5 font-primary">
            Cadastrar Documento
        </h1>

        <p class="text-gray-600 mb-5 font-primary">
            Esta é a pagina de registro de documentos. Aqui você pode 
            cadastrar seus documentos para que eles sejam armazenados 
            no IPFS e na blockchain.
        </p>

        <form @submit.prevent>
            <file-input v-model="form.file" />

            <div class="w-full flex items-center justify-end mt-10">
                <button-component @click="handlerStoreDocument">
                    Cadastrar
                </button-component>
            </div>
        </form>
    </div>
    

</template>

<script setup lang="ts">

import { ref } from 'vue';
import { ArrowLeft } from '@lucide/vue';

import { useIpfs } from '../composable/useIpfs';
import { useFileUpload } from '../composable/useFileUpload';
import { useWalletStore } from '../store/wallet';
import { useRegisterDocument } from '../composable/useRegisterDocument';

import FileInput from '../components/FileInput.vue';
import ButtonComponent from '../components/ButtonComponent.vue';


const form = ref({
    file: null as File | null,
});


const { 
    uploadFileIpfs, 
    removeFileIpfs 
} = useIpfs();

const { 
    hashFile, 
    uploadFile,
    deleteFile,
} = useFileUpload();

const { registerDocument } = useRegisterDocument();

const { getSigner } = useWalletStore();

async function uploadOnIfps(file: File): Promise<[string | null, Error | null]> {
    try {
        const cid = await uploadFileIpfs(file);
        return [cid, null];
    }
    catch (err) {
        return [null, err as Error];
    }
}

async function hashFileContent(file: File): Promise<[string | null, Error | null]> {
    try {
        const hash = await hashFile(file);
        return [hash, null];
    }
    catch (err) {
        return [null, err as Error];
    }
}

async function registerFileOnBackend(file: File, hash: string, cid: string) {
    const registerDoc = {
        title: file.name,
        mimeType: file.type,
        size: file.size,
        url: `ipfs/${cid}`,
        hash,
    };

    try {
        const response = await uploadFile(registerDoc);
        return [response, null];
    } 
    catch (err) {
        return [null, err];
    }
}

async function handlerRegisterDocument(hash: string, cid: string) {
    try {
        await registerDocument(
            hash!,
            cid!,
            getSigner()
        );

        return [true, null];
    }
    catch (err) {
        return [false, err as Error];
    }
}

async function handlerStoreDocument() {
    if (!form.value.file)
        return;

    const file = form.value.file;


    const [cid, errorIpfs] = await uploadOnIfps(file);

    if (errorIpfs) {
        console.log('Erro ao salvar arquivo no ipfs');
        return;
    }

    const [hash, errorHash] = await hashFileContent(file);

    if (errorHash) {
        console.log('Erro ao fazer hash do arquivo')
        return;
    }

    const [response, error] = await registerFileOnBackend(file, hash!, cid!);

    if (error) {
        await removeFileIpfs(cid!);
        return;
    }

    const [sucess, err] = await handlerRegisterDocument(hash!, cid!);

    if (err) {
        await removeFileIpfs(cid!);
        await deleteFile(response.id);

        console.log('arquivo deletado devido um erro');
        return;
    }

    console.log('Arquivo cadastrado com sucesso');
}

</script>
