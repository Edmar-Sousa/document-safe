// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


/**
 * @dev Contrato de interface com o oraculo chainlink. Esse contrato é usado 
 * para pegar o valor de ETH/USD. Util no momento da compra de tokens para 
 * ter um preço dinamico de acordo com o valor vindo do oraculo.
 */
contract DocOracle {
    /**
     * @dev Usando o chainlink para acessar dados fora da blockchain
     */
    AggregatorV3Interface public priceFeed;


    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    /**
     * @dev Função para pegar o valor vindo do chainlink
     */
    function getLastPrice() external view returns (uint256) {
        (
            ,
            int answer,
            ,
            uint256 updatedAt,
        ) = priceFeed.latestRoundData();

        require(answer > 0, "Invalid price");
        require(block.timestamp - updatedAt < 1 hours, "Outdated oracle price");

        return uint256(answer);
    }
}

