
import { ethers } from 'ethers';
import { GovernorContract } from '../utils/contracts/Governor';
import { DocumentsContract } from '../utils/contracts/Document';
import { SellerContract } from '../utils/contracts/Seller';


let governor: GovernorContract | null = null;


interface ProposalFormType {
    value: string;
    description: string;
    contract: string;
}

interface ProposalVoteType {
    proposalId: string;
    castVote: 0 | 1;
}

export function useDao(signer: ethers.Signer | null) {

    if (!signer)
        throw new Error('signer is null');

    if (!governor)
        governor = new GovernorContract(signer);


    function createInterfaceFromContract(contract: string) {
        let address = DocumentsContract.address;
        let abi = DocumentsContract.abi
        let fun = 'setTaxToken';

        if (contract == 'tokens_per_usd') {
            abi = SellerContract.abi;
            address = SellerContract.address;
            fun = 'setTokensPerUsd';
        }

        return {
            contractInterface: new ethers.Interface(abi),
            address,
            fun,
        };
    }

    async function createProposal(form: ProposalFormType) {
        const { contract, value, description } = form;
        const { contractInterface, fun, address } = createInterfaceFromContract(contract);

        const call = contractInterface.encodeFunctionData(fun, [value]);

        return await governor!.propose(
            [address],
            [0n],
            [call],
            description
        );
    }

    async function voteInProposal(form: ProposalVoteType) {
        const { proposalId, castVote } = form;
        return await governor!.castVote(proposalId, castVote);
    }

    async function stateProposal(proposalId: string) {
        return await governor!.state(proposalId);
    }

    return {
        createProposal,
        voteInProposal,
        stateProposal,
    }
}
