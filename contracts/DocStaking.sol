// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @dev Esse contrato é utilizado para fazer staking dos tokens.
 * Os usuarios que tiverem tokens em staking, poderam votar no DAO
 * e ainda ganharam uma porcentagem em token (DOCT) referente ao pagamento
 * para armazenar arquivos.
 */
contract DocStaking is Ownable, ReentrancyGuard {

    /**
     * @dev Variavel para armazenar a quantidade total de tokens em staking.
     */
    uint256 public totalStaking;

    /**
     * @dev Mapping para saber quanto tokens cada usuario
     * tem em staking.
     */
    mapping (address => uint256) private stakingValue;

    /**
     * @dev Interface para o token (DOCT)
     */
    IERC20 token;


    /**
     * @dev Evento emitido quando o usuario faz staking de tokens
     */
    event StakingTokens(address indexed user, uint256 value);

    /**
     * @dev Evento emitido quando usuario faz o unstake dos tokens
     */
    event UnstakingTokens(address indexed user, uint256 value);


    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }


    /**
     * @dev Função para ver quanto de staking o usuario tem.
     */
    function getTokensStaking() public view returns (uint256) {
        return stakingValue[msg.sender];
    }


    /**
     * @dev Função para calcular a porcentagem de tokens em staking
     * de um usuario.
     */
    function getGainPorcentage() public view returns (uint256) {
        uint256 tokensInStake = getTokensStaking();
        return 100 * tokensInStake / totalStaking;
    }


    /**
     * @dev Função utilizada para fazer staking.
     */
    function stake(uint256 _tokens) public nonReentrant {
        uint256 tokensApproved = token.allowance(msg.sender, address(this));
        require(tokensApproved >= _tokens, "Insufficient number of tokens approved for transfer.");

        /**
         * @dev Os tokens são enviados para o contrato.
         */
        bool success = token.transferFrom(msg.sender, address(this), _tokens);
        require(success, "Error while transferring.");

        /**
         * @dev Armazenando a quantidade de tokens que o usuario fez
         * staking.
         */
        stakingValue[msg.sender] += _tokens;
        totalStaking += _tokens;

        emit StakingTokens(msg.sender, _tokens);
    }


    /**
     * @dev Função para fazer unstake dos tokens. 
     */
    function unstake(uint256 _tokens) public nonReentrant {
        uint256 amountTokensStaking = stakingValue[msg.sender];

        require(amountTokensStaking > 0, "No tokens staked.");
        require(_tokens <= amountTokensStaking, "Insufficient number of tokens staked.");


        bool success = token.transfer(msg.sender, _tokens);
        require(success, "Error while transferring.");

        delete stakingValue[msg.sender];
        totalStaking -= _tokens;

        emit UnstakingTokens(msg.sender, _tokens);
    }

}
