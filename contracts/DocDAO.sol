// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import { IVotes } from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import { Governor } from "@openzeppelin/contracts/governance/Governor.sol";
import { GovernorVotes } from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import { TimelockController } from "@openzeppelin/contracts/governance/TimelockController.sol";
import { GovernorCountingSimple } from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import { GovernorTimelockControl } from "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import { GovernorVotesQuorumFraction } from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";


/**
 * @dev Contrato de governança descentralizado. Seguindo a documentação oficial do 
 * openzeppelin.
 */
contract DocDAO is 
    Governor,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{

    /**
     * @dev No deploy é preciso passar o endereço do token de votação (vDOCT) e o 
     * timelock para controlar o tempo.
     */
    constructor(IVotes _token, TimelockController _timelock) 
        Governor("DocDAO") 
        GovernorVotes(_token) 
        GovernorVotesQuorumFraction(10) 
        GovernorTimelockControl(_timelock) 
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
    function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }

    /**
     * @dev Diz se a proposta precisa passar pelo time lock antes de executar.
     */
    function proposalNeedsQueuing(uint256 proposalId) public view virtual override(Governor, GovernorTimelockControl) returns (bool) {
        return super.proposalNeedsQueuing(proposalId);
    }

    /**
     * @dev Função para agendar a execução da proposta.
     */
    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return super._queueOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    /**
     * @dev Vai executar a proposta depois do delay.
     */
    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(proposalId, targets, values, calldatas, descriptionHash);
    }

    /**
     * @dev Função para cancelar a proposta.
     */
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    /**
     * @dev Função para executar a proposta.
     */
    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }
}
