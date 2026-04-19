// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


/**
 * @dev Contrato para teste. Esse contrato é usado para realizar os
 * testes unitarios do Oraculo. Não deve ser usado no projeto alem dos
 * testes unitarios.
 */
contract MockChainLink {
    int public answer;
    uint256 public updatedAt;

    constructor(int _answer, uint256 _updatedAt) {
        answer = _answer;
        updatedAt = _updatedAt;
    }

    function latestRoundData() external view returns (uint80, int, uint256, uint256, uint80) {
        return (0, answer, 0, updatedAt, 0);
    }
}

