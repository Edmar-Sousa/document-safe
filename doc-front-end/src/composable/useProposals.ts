import http from "../utils/axios"



export function useProposals() {
    async function getProposals() {
        const response = await http.get('/blockchain/proposals')
        return response.data;
    }

    return {
        getProposals,
    }
}
