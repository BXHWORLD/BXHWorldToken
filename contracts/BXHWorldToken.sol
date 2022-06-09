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

     bool private _burnActivated;
           constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cap,
        address _owner
    )ERC20Permit(_name) ERC20PresetMinterPauser(_name,_symbol,_owner) ERC20Capped(_cap) {
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
function burnActivated() view external returns (bool ) {
    return _burnActivated;
}

// temp for test
function getChainId() view external returns (uint256 ) {
    return block.chainid;
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
