
import { ethers } from 'ethers';
import { DocumentsContract } from '../utils/contracts/Document';


let documentContract: DocumentsContract | null = null;



export function useRegisterDocument() {

    function createInstanceContract(signer: ethers.Signer) {
        if (!documentContract) {
            documentContract = new DocumentsContract(signer);
        }
    }

    async function registerDocument(hash: string, cid: string, signer: ethers.Signer | null) {
        if (!signer)
            throw new Error('Signer not valid');

        createInstanceContract(signer);

        const address = await signer.getAddress();
        const contractAddress = await documentContract!.getAddress();

        const message = ethers.keccak256(
            ethers.solidityPacked(
                ["bytes32", "address", "address"],
                [hash, address, contractAddress]
            )
        )

        const signature = await signer.signMessage(ethers.getBytes(message));
        return await documentContract!.registerDocument(hash, cid, signature);
    }

    return {
        registerDocument,
    }
}

