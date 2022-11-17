pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "./tokens/PixieNFT.sol";
import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

import "hardhat/console.sol";

contract PixielandNFTMarketplace is VRFConsumerBase {
    PixieNFT public pixie;

    bytes32 internal keyHash;
    uint256 internal fee;

    uint256 public randomResult;

    string[] pixies_names;

    mapping(address => uint[]) public userToPixiesIdOwned;

    mapping(uint256 => string) public idToPixieName;

    string[] public urlList;

    constructor()
        public
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255,
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB
        )
    {
        pixie = new PixieNFT();
        console.log("Pixie NFT:", address(pixie));
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18; // 0.0001 LINK

        pixies_names = [
            "Uira",
            "Tiana",
            "Rose",
            "Bella",
            "Fae",
            "Aurora",
            "Andrea",
            "Lumine",
            "Rosa",
            "Prinsesa",
            "Lara",
            "Persephone",
            "Jane",
            "Ariel",
            "Alana",
            "Tina",
            "Joanna",
            "Annette",
            "Ana",
            "Rhea"
        ];
    }

    function addImage(string calldata url) external {
        urlList.push(url);
    }

    function getUrlList() external view returns (string[] memory) {
        return urlList;
    }

    /**
     * Requests randomness
     */
    function getRandomNumber() public returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) > fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        randomResult = randomness;
    }

    function buyNFT(string calldata tokenURI)
        external
        payable
        returns (uint256 id)
    {
        uint256 _randomNumber = uint256(
            keccak256(
                abi.encode(
                    block.timestamp,
                    block.difficulty,
                    msg.sender,
                    randomResult
                )
            )
        ) % 20;
        getRandomNumber();

        id = pixie.mint(msg.sender, tokenURI);

        userToPixiesIdOwned[msg.sender].push(id);

        idToPixieName[id] = pixies_names[_randomNumber];
    }

    function getURI(uint256 id) external view returns (string memory) {
        return pixie.tokenURI(id);
    }

    function getPixieNftAddress()external view returns(address){
        return address(pixie);
    } 

}
