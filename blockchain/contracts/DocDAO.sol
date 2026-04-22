// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import { IVotes } from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import { Governor } from "@openzeppelin/contracts/governance/Governor.sol";
import { GovernorVotes } from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import { GovernorCountingSimple } from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import { GovernorVotesQuorumFraction } from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";


/**
 * @dev Contrato de governança descentralizado. Seguindo a documentação oficial do 
 * openzeppelin.
 */
contract DocDAO is 
    Governor,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{

    /**
     * @dev No deploy é preciso passar o endereço do token de votação (vDOCT) e o 
     * timelock para controlar o tempo.
     */
    constructor(IVotes _token) 
        Governor("DAO") 
        GovernorVotes(_token) 
        GovernorVotesQuorumFraction(10)
    {
    }

    /**
     * @dev Função que vai definir o tempo até a votação começar depois de ser criada. 
     * Em blocos, 7200 equivale a 1 dia.
     */
    function votingDelay() public pure override returns (uint256) {
        /**
         * @dev 25 blocos equivale a aproximadamente cinco minutos
         */
        return 25;
    }

    /**
     * @dev Função para o periodo de votação. Tambem em blocos.
     */
    function votingPeriod() public pure override returns (uint256) {
        /**
         * @dev 100 blocos equivale a aproximadamente 20 minutos
         */
        return 100;
    }

    /**
     * @dev Função para definir a quantidade minima de tokens para criar uma proposta.
     */
    function proposalThreshold() public pure override returns (uint256) {
        /**
         * Nesse caso, quem tem pelo menos um token
         */
        return 1e18;
    }

    /**
     * @dev Retorna o estado da proposta (Pending, Active, Succeeded, Executed)
     */
    function state(uint256 proposalId) public view override returns (ProposalState) {
        return super.state(proposalId);
    }

    /**
     * @dev Diz se a proposta precisa passar pelo time lock antes de executar.
     */
    function proposalNeedsQueuing(uint256 proposalId) public view virtual override returns (bool) {
        return super.proposalNeedsQueuing(proposalId);
    }

}
