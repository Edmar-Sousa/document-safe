// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



interface InterfaceOracle {
    function getLastPrice() external view returns (uint256);
}


/**
 * @dev Contrato utilizado para comprar tokens DOCT. O preço do token
 * é dinâmico com o valor que vem do oraculo/chainlink.
 */
contract DocSeller is Ownable, ReentrancyGuard {
    /**
     * @dev Valor do tokens DOCT por USD. Valor poderar ser alterado
     * pelo o DAO.
     */
    uint256 public tokensPerUsd = 100;

    /**
     * @dev Interface do contrato do oraculo
     */
    InterfaceOracle oracle;

    /**
     * @dev Endereço do DAO.
     */
    address dao;

    /**
     * @dev Interface do contrato do token ERC20
     */
    IERC20 token;


    event TokensDOCTBought(address indexed user, uint256 tokens);


    constructor(address _oracle, address _token) Ownable(msg.sender) {
        oracle = InterfaceOracle(_oracle);
        token = IERC20(_token);
    }

    modifier onlyDao() {
        require(msg.sender == dao, "Only DAO allowed call this method");
        _;
    }

    /**
     * @dev Função para setar o endereço do DAO
     */
    function setDaoAddress(address _dao) external onlyOwner {
        dao = _dao;
    }

    function setTokensPerUsd(uint32 _tokensPerUsd) external onlyDao {
        require(_tokensPerUsd > 0, "The value must be greater than zero.");
        tokensPerUsd = _tokensPerUsd;
    }

    /**
     * @dev Função para converter o valor em ETH para USD de acordo com o valor
     * do chainlink.
     */
    function getUsdValue(uint256 _ethValue) internal view returns (uint256) {
        uint256 priceEthInUSD = oracle.getLastPrice();
        return (_ethValue * priceEthInUSD) / 1e18;
    }

    /**
     * @dev Função para converter o valor de USD para a quantidade de DOCT correspondente
     */
    function getNumberTokens(uint256 _value) internal view returns (uint256)  {
        uint256 usdValue = getUsdValue(_value);
        return (usdValue * tokensPerUsd * 1e18) / 1e8;
    }

    /**
     * @dev Função para comprar tokens DOCT utilizando ETH. O preço do token
     * é dinâmico de acordo com o valor que vem do oraculo.
     */
    function buyTokensDoc() external payable nonReentrant {
        require(msg.value > 0, "Error when buying tokens with this value.");

        uint256 tokens = getNumberTokens(msg.value);

        /**
         * Verificando se o contrato pode transferir token DOCT
         */
        uint256 balance = token.balanceOf(address(this));
        require(balance >= tokens, "Insufficient Harvest Balance to make the purchase");

        bool hasError = token.transfer(msg.sender, tokens);
        require(hasError, "Error to transfer tokens to wallet");

        emit TokensDOCTBought(msg.sender, tokens);
    }

}
