// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts-v0.7/token/ERC721/ERC721.sol";

contract PixieNFT is ERC721 {
    
    uint _tokenIds;

    constructor() ERC721("PixieNFT", "PIXIE")public{}

    function mint(address user, string memory _tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds;
        _mint(user, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        _tokenIds++;
        return newItemId;
    }

    function burn(uint256 tokenId)
    public{
        _burn(tokenId);
    }

}