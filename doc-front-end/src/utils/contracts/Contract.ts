import { ethers } from "ethers";


export class ContractInstance {

    protected instance: ethers.Contract | null = null;

    constructor(provider: ethers.BrowserProvider | ethers.Signer, address: string, abi: any) {
        if (!this.instance)
            this.instance = new ethers.Contract(address, abi, provider);
    }

}

