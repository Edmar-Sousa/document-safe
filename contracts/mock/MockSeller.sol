// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../DocSeller.sol";

/**
 * @dev Contrato usado para testar as funções internas do contrato
 * DocSeller.sol. Esse arquivo é utilizado apenas para testes unitarios
 * do contrato de DocSeller.
 *
 * Não deve ir para a produção.
 */
contract MockSeller is DocSeller {

    constructor (address _oracle, address _token) DocSeller(_oracle, _token) {}


    function _getUsdValue(uint256 _ethValue) public view returns (uint256) {
        return getUsdValue(_ethValue);
    }


    function _getNumberTokens(uint256 _value) public view returns (uint256) {
        return getNumberTokens(_value);
    }

    function _getTokenOwner() public view returns (address) {
        return owner();
    }

}

