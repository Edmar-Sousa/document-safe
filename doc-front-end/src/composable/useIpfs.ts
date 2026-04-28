import { create } from 'ipfs-http-client';

const client = create({
    host: import.meta.env.VITE_IPFS_IP,
    port: import.meta.env.VITE_IPFS_PORT,
    protocol: import.meta.env.VITE_IPFS_PROTOCOL,
});



export function useIpfs() {

    const uploadFileIpfs = async (file: File) => {
        const result = await client.add(file, { pin: true });
        return result.cid.toString();
    }

    const removeFileIpfs = async (cid: string) => {
        await client.pin.rm(cid);
        client.repo.gc();
    }


    return {
        uploadFileIpfs,
        removeFileIpfs,
    }

}

