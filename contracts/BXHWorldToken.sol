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

    uint256 private _holdersReflectionFees;
    uint256 private _bXHPaybackLiquidityFees;
    bool private _burnActivated;
    address private _holdersReflectionWallet;
    address private _bXHPaybackLiquidityWallet;
    event HolderFeesUpdated(uint256 newFees,address from );
    event HolderWalletUpdated(address newWallet,address from );
    event BXHPaybackLiquidityFeesUpdated(uint256 newFees,address from );
    event BXHPaybackLiquidityWalletUpdated(address newWallet,address from );
        constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cap,
        address _owner
    )ERC20Permit(_name) ERC20PresetMinterPauser(_name,_symbol,_owner) ERC20Capped(_cap) {
    }
// private functions 
    function _getShares(uint256 _amount) view  private returns (uint256 taxShare,uint256 holderShare,uint256 remaining) {
        taxShare = _amount*(_bXHPaybackLiquidityFees/100);
        holderShare = _amount*(_holdersReflectionFees/100);
        remaining=_amount -(taxShare+holderShare);
    }




    // internals 
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
// externals 
    function activateBurn() external {
        require(hasRole(BURNER_ROLE, _msgSender()), "ElboxahToken: must have BURNER_ROLE");
        _burnActivated =!_burnActivated;
    }
    function updateHolderFees(uint256 fee) external {
        // TODO : ask about the mini ams max 
                require(fee>0,"fees percentage must be more than zero");
                require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ElboxahToken: must have Admin_ROLE");
                _holdersReflectionFees=fee;
                // emit event 
                emit HolderFeesUpdated(fee,  _msgSender());
   
    }

  function updateBXHPaybackLiquidityFees(uint256 fee) external {
        // TODO : ask about the mini ams max 
                require(fee>0,"fees percentage must be more than zero");
                require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ElboxahToken: must have Admin_ROLE");
                _bXHPaybackLiquidityFees=fee;
                // emit event 
                emit BXHPaybackLiquidityFeesUpdated(fee,  _msgSender());
   
    }
    function updateBXHPaybackLiquidityWallet(address newWallet) external {
                require(newWallet!= address(0),"Zero address is not allowed ");
                require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ElboxahToken: must have Admin_ROLE");
                _bXHPaybackLiquidityWallet=newWallet;
                // emit event 
                emit BXHPaybackLiquidityWalletUpdated(newWallet,  _msgSender());
   
    }
    function updateHolderWallet(address newWallet) external {
                require(newWallet!= address(0),"Zero address is not allowed ");
                require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "ElboxahToken: must have Admin_ROLE");
                _holdersReflectionWallet=newWallet;
                // emit event 
                emit HolderWalletUpdated(newWallet,  _msgSender());
   
    }

function burnActivated() view external returns (bool ) {
    return _burnActivated;
}
    function holderWallet() view external returns (address) {
        return _holdersReflectionWallet;
    }
    function bXHPaybackLiquidityWallet() view external returns (address) {
        return _bXHPaybackLiquidityWallet;
    }
    function holderFees() view external returns (uint256) {
        return _holdersReflectionFees;
    }
    function bXHPaybackLiquidityFees() view external returns (uint256) {
        return _bXHPaybackLiquidityFees;
    }
    // public
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
  
}
