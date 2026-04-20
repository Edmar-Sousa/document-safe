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
     * @dev Valor da recompensa por tokens em staking.
     */
    uint256 rewardPerTokenStoraged;

    /**
     * @dev Mapping para saber quanto tokens cada usuario tem em staking.
     */
    mapping (address => uint256) private stakingValue;

    /**
     * @dev Quantidade de recompensa por tokens pagos no registro
     */
    mapping (address => uint256) private userRewardPerTokenPaid;

    /**
     * @dev Recompensas
     */
    mapping (address => uint256) private reward;

    /**
     * @dev Interface para o token (DOCT)
     */
    IERC20 token;


    /**
     * @dev Endereço do contrato de registro de documento.
     */
    address registerDocumentAddress;

    /**
     * @dev Evento emitido quando o usuario faz staking de tokens
     */
    event StakingTokens(address indexed user, uint256 value);

    /**
     * @dev Evento emitido quando o usuario coleta a recompensa
     */
    event RewardClaim(address indexed user, uint256 value);

    /**
     * @dev Evento emitido quando usuario faz o unstake dos tokens
     */
    event UnstakingTokens(address indexed user, uint256 value);


    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    modifier calledByRegister() {
        require(msg.sender == registerDocumentAddress, "Only the document registration contract can call this function.");
        _;
    }

    /**
     * @dev Retorna a quantidade de staking para um usuario.
     */
    function getStaking() public view returns (uint256) {
        return stakingValue[msg.sender];
    }

    /**
     * @dev Função para pegar quanto de recompensa foi acumulado.
     */
    function getReward() public view returns (uint256) {
        return reward[msg.sender] + ((stakingValue[msg.sender] * (rewardPerTokenStoraged - userRewardPerTokenPaid[msg.sender])) / 1e18);
    }

    /**
     * @dev Função que apenas o proprietario do contrato deve chamar para configurar
     * o endereço do contrato de registro de documentos.
     */
    function setAddressRegisterDocument(address _registerDocumentAddress) external onlyOwner {
        registerDocumentAddress = _registerDocumentAddress;
    }


    /**
     * @dev Função que deve ser chamada apenas pelo contrato de 'DocRegisterDocument'
     * quando a taxa for coletada.
     */
    function notifyReward(uint256 _tokens) external calledByRegister {
        if (totalStaking == 0)
            return;

        rewardPerTokenStoraged += (_tokens * 1e18) / totalStaking;
    }


    /**
     * @dev Função para atualizar as recompensas que o usuario vai receber.
     */
    function updateReward(address _user) internal {
        reward[_user] += (stakingValue[_user] * (rewardPerTokenStoraged - userRewardPerTokenPaid[_user])) / 1e18;
        userRewardPerTokenPaid[_user] = rewardPerTokenStoraged;
    }


    /**
     * @dev Função para coletar a recompensa em tokens.
     */
    function claim() external nonReentrant {
        updateReward(msg.sender);

        uint256 userReward = reward[msg.sender];
        require(userReward > 0, "No rewards to claim");

        reward[msg.sender] = 0;

        bool success = token.transfer(msg.sender, userReward);
        require(success, "Error while transferring");
    } 

    /**
     * @dev Função utilizada para fazer staking.
     */
    function stake(uint256 _tokens) public nonReentrant {
        uint256 tokensApproved = token.allowance(msg.sender, address(this));
        require(tokensApproved >= _tokens, "Insufficient number of tokens approved for transfer.");

        /**
         * @dev Atualizando a recompensa do usuario.
         */
        updateReward(msg.sender);

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

        /**
         * @dev Atualizando a recompensa do usuario.
         */
        updateReward(msg.sender);

        bool success = token.transfer(msg.sender, _tokens);
        require(success, "Error while transferring.");

        stakingValue[msg.sender] -= _tokens;
        totalStaking -= _tokens;

        emit UnstakingTokens(msg.sender, _tokens);
    }

}
