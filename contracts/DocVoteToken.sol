// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import { Nonces } from "@openzeppelin/contracts/utils/Nonces.sol";


/**
 * @dev Token utilizado para realizar votações no DAO.
 */
contract DocVoteToken is ERC20, ERC20Permit, ERC20Votes, Ownable {



    /**
     * @dev Owner deve ser o contrato de staking. Pois apenas ele deve
     * ter permissão para transferir esses tokens.
     */
    constructor(address owner) Ownable(owner) ERC20("Vote Doc Token", "sDOCT") ERC20Permit("Vote Doc Token") 
    {}


    /**
     * @dev Função para fazer o mint de tokens. Apenas o proprietario pode chamar 
     * essa função.
     */
    function mint(address _to, uint256 _tokens) external onlyOwner {
        _mint(_to, _tokens);
    }

    /**
     * @dev Função para queimar os tokens. Apenas o proprietario pode chamar 
     * essa função.
     */
    function burn(address _from, uint256 _tokens) external onlyOwner {
        _burn(_from, _tokens);
    } 

    /**
     * @dev Override a documentação diz para sobrescrever.
     */
    function _update(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._update(from, to, amount);
    }

    function nonces(address owner) public view virtual override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}

