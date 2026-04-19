// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @dev O contrato DocNft representa um documento que o usuario faz upload.
 * Cada documento é unico portanto se faz nescessario um token 721 para representar
 * o documento.
 *
 * Nesse caso, somente o proprietario do contrato DocNft pode chamar as funções 
 * de mint e burn.
 */
contract DocNft is ERC721, Ownable {

    /**
     * @dev Mapping para armazenar os cids dos arquivos.
     */
    mapping(uint256 => string) private cids;


    constructor(address owner) ERC721("Document NFT", "DOCNFT") Ownable(owner) {}


    /**
     * @dev Função para recuperar o cid de um token.
     */
    function getTokenCid(uint256 _tokenId) public view returns (string memory) {
        require(_ownerOf(_tokenId) != address(0), "Document does not exist.");
        return cids[_tokenId];
    }


    /**
     * @dev Função para fazer mint de uma NFT para um usuario. O hash do
     * arquivo sera utilizado como token id.
     */
    function mint(address _to, uint256 _tokenId, string memory _cid) external onlyOwner {
        require(_ownerOf(_tokenId) == address(0), "The document already exists.");

        _safeMint(_to, _tokenId);
        cids[_tokenId] = _cid;
    }


    /**
     * @dev Função para fazer o burn de uma NFT de um usuario.
     */
    function burn(uint256 _tokenId) external onlyOwner {
        require(_ownerOf(_tokenId) != address(0), "Document does not exist.");

        delete cids[_tokenId];
        _burn(_tokenId);
    }

}
