import { ethers } from 'ethers';
import http from '../utils/axios';


interface UploadFileForm {
    title: string;
    mimeType: string;
    size: number;
    url: string;
    hash: string;
}

export function useFileUpload() {

    const hashFile = async (file: File): Promise<string> => {
        const buffer = await file.arrayBuffer();
        const hashArray = ethers.keccak256(new Uint8Array(buffer));

        return hashArray;
    }

    const getFiles = async () => {
        const response = await http.get('/documents');
        return response.data;
    }

    const uploadFile = async (form: UploadFileForm) => {
        const response = await http.post('/documents', form);
        return response.data;
    }

    const deleteFile = async (id: string) => {
        const response = await http.delete(`/documents/${id}`);
        return response.data;
    }

    return {
        uploadFile,
        deleteFile,
        hashFile,
        getFiles,
    }
}
