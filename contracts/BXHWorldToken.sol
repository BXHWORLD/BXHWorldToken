// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity 0.8.4;

import '@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol';
import './ERC20PresetMinterPauser.sol';
 import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol';
/**
 * @author Eman Herawy
 *@title  Elboxah token 
 * 
 */
contract BXHWorldToken is ERC20Permit, ERC20PresetMinterPauser, ERC20Capped{

    uint256 _holdersReflectionFees;
    uint256 _bXHPaybackLiquidityFees;
    bool _burnActivated;
    address _holdersReflectionWallet;
    address _bXHPaybackLiquidityWallet;
       constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cap,
        address _owner
    )ERC20Permit(_name) ERC20PresetMinterPauser(_name,_symbol,_owner) ERC20Capped(_cap) {
    }
        function _mint(address account, uint256 amount) internal virtual override (ERC20,ERC20Capped)  {
        super._mint(account, amount);
    }
        function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override (ERC20,ERC20PresetMinterPauser){
        super._beforeTokenTransfer(from, to, amount);

     }

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address to, uint256 amount) public virtual override (ERC20) returns (bool) {
        address owner = _msgSender();
         (uint256 taxShare,uint256 holderShare,uint256 remaining)= _getShares( amount); 
        _transfer(owner, _bXHPaybackLiquidityWallet, taxShare);
        _transfer(owner, _holdersReflectionWallet, holderShare);
        _transfer(owner, to, remaining);
        return true;
    }
     function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override (ERC20) returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
         (uint256 taxShare,uint256 holderShare,uint256 remaining)= _getShares( amount); 
        _transfer(from, _bXHPaybackLiquidityWallet, taxShare);
        _transfer(from, _holdersReflectionWallet, holderShare);
        _transfer(from, to, remaining);
    
        _transfer(from, to, remaining);
        return true;
    }
    /**
     * @dev Destroys `amount` tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 amount) public virtual override(ERC20Burnable) {
       require(_burnActivated, "ElboxahToken: Burn is disable");

        super.burn(amount);
    }
    function _getShares(uint256 _amount) view  private returns (uint256 taxShare,uint256 holderShare,uint256 remaining) {
        taxShare = _amount*(_bXHPaybackLiquidityFees/100);
        holderShare = _amount*(_holdersReflectionFees/100);
        remaining=_amount -(taxShare+holderShare);
    }
    function activateBurn() external {
        require(hasRole(BURNER_ROLE, _msgSender()), "ElboxahToken: must have BURNER_ROLE");
        _burnActivated =!_burnActivated;
    }
}
