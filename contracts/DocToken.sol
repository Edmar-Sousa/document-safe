// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


/**
 * @dev Token usados para pagar o envio de documentos, fazer staking e votar no DAO.
 */
contract DocToken is ERC20 {

    constructor() ERC20("Document Token", "DOCT") {
        /**
         * Criando um token ERC20 e enviando todos para quem fez o
         * deploy do contrato na bloackchain.
         */
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }

}
