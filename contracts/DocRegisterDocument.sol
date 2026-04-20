// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


interface IDocNft721 {
    function mint(address _to, uint256 _tokenId, string memory _cid) external;
    function burn(uint256 _tokenId) external;
    function getTokenCid(uint256 _tokenId) external view returns (string memory);
}

interface IDocStaking {
    function notifyReward(uint256 _tokens) external;
    function totalStaking() external view returns (uint256);
}

/**
 * @dev Contrato utilizado para tratar arquivos. Esse contrato tem as funções
 * para validar e registrar um arquivo. Ao registrar um arquivo seu hash e cid
 * seram armazenados, para que futuramente possam ser validados. A função de validar
 * recebe um hash de um arquivo e verifica se ele corresponde ao registrado.
 *
 * Para registrar um documento, precisa informar o Hash do arquivo e a assinatura do 
 * do hash com o identificador da carteira do usuario.
 */
contract DocRegisterDocument is ReentrancyGuard {

    /**
     * @dev Estrutura para armazenar quem assinou e assinatura.
     */
    struct Document {
        address signer;
        bytes signature;
    }

    /**
     * @dev Mapping para o token id e o documento.
     */
    mapping (uint256 => Document) public documents;

    /**
     * @dev Token NFT para representar os documentos.
     */
    IDocNft721 tokenNft;

    /**
     * @dev Token para pagamento da taxa
     */
    IERC20 token;

    /**
     * @dev Taxa de token para registrar um documento.
     */
    uint256 taxTokens = 10e18;

    /**
     * @dev Interface do contrato de staking para que ele possa receber os tokens
     * e em seguida dividir para os usuarios.
     */
    IDocStaking stakingContract;

    /**
     * @dev Evento emitido quando o documento é registrado na blockchain.
     */
    event DocumentRegistred(address indexed user, uint256 tokenId);


    constructor(address _tokenNft, address _token, address _staking) {
        stakingContract = IDocStaking(_staking);
        tokenNft = IDocNft721(_tokenNft);
        token = IERC20(_token);
    }


    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }


    /**
     * @dev Função para saber quem fez a assinatura do hash.
     */
    function recoverSigner(uint256 _hash, bytes memory _sig) public view returns (address) {
        bytes32 message = keccak256(abi.encodePacked(_hash, msg.sender, address(this)));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));

        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_sig);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    /**
     * @dev Essa função pega toda a taxa para a plataforma
     */
    function claimTaxToPlatform() private {
        /**
         * @dev Transferindo a parte da plataforma.
         */
        bool sucess = token.transferFrom(msg.sender, address(this), taxTokens);
        require(sucess, "Error when making transfer.");
    }


    /**
     * @dev Função para pegar a taxa do usuario para registrar um documento e distribuir
     * entre a plataforma e o contrato de staking.
     */
    function claimTaxToRegister() internal {
        uint256 totalInStake = stakingContract.totalStaking();

        /**
         * @dev Se não tem tokens em stake, a taxa sera toda transferida para a plataforma.
         */
        if (totalInStake == 0) {
            claimTaxToPlatform();
            return;
        }


        /**
         * @dev A plataforma pega 1% da taxa
         */
        uint256 platformFee = taxTokens / 100;

        /*
         * @dev O restante vai ser distribuido para quem tem tokens em staking.
         */

        uint256 reward = taxTokens - platformFee;


        /**
         * @dev Transferindo a parte da plataforma.
         */
        bool sucess = token.transferFrom(msg.sender, address(this), platformFee);
        require(sucess, "Error when making transfer.");

        

        /**
         * @dev Transferindo tokens para o contrato de staking.
         */
        sucess = token.transferFrom(msg.sender, address(stakingContract), reward);
        require(sucess, "Error when making transfer.");

        stakingContract.notifyReward(reward);
    }

    /**
     * @dev Funçao para registrat um documento. Essa função vai, receber a taxa, em token, 
     * do usuario que ira registrar um documento. Essa taxa deverar ser distribuida entre 
     * os usuario que mativerem tokens em staking. Em seguida a função vai armazenar o 
     * documento assinado pelo usuario por meio do token NFT.
     */
    function registerDocument(bytes32 _hash, string memory _cid, bytes memory _sig) external nonReentrant {
        /**
         * @dev Verificar se o usuario tem tokens suficiente para completar a operação
         */
        uint256 userNumberTokens = token.allowance(msg.sender, address(this));
        require(userNumberTokens >= taxTokens, "Insufficient tokens to complete the operation.");

        /**
         * @dev Verificando a assinatura.
         */
        uint256 tokenId = uint256(_hash);

        address signer = recoverSigner(tokenId, _sig);
        require(signer == msg.sender, "Signer invalid.");


        claimTaxToRegister();

        /**
         * @dev Fazendo o mint do token NFT
         */
        tokenNft.mint(msg.sender, tokenId, _cid);

        documents[tokenId] = Document({
            signer: signer,
            signature: _sig
        });

        emit DocumentRegistred(msg.sender, tokenId);
    }


    /**
     * @dev Validar um documento. Para isso precisa do _hash do arquivo e a assinatura do hash.
     * A função ira recuperar quem fez a assinatura do hash e verificar se é igual ao endereço
     * armazenado no mapping.
     */
    function validateDocument(uint256 _hash, bytes memory _signature) external view returns (bool) {
        uint256 tokenId = uint256(_hash);

        Document memory doc = documents[tokenId];
        address recovered = recoverSigner(tokenId, _signature);

        return (recovered == doc.signer);
    }

}
