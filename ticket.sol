// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
import "https://github.com/0xcert/ethereum-erc721/src/contracts/tokens/nf-token-metadata.sol";
import "https://github.com/0xcert/ethereum-erc721/src/contracts/ownership/ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

//contract newNFT is NFTokenMetadata, Ownable {

contract EventTicket is NFTokenMetadata, Ownable {
    // Event info
    struct Section {
        string name;
        uint256 num_tickets;
        uint256 sold;
        uint256 price;
    }
    //address public owner;
    string public eventName;
    Section[] public sections;
    bool public saleOpen;

    // Minted tickets
    struct Ticket {
        uint256 sectionId;
        address owner;
        bool used;
    }
    Ticket[] public tickets;

    constructor(string memory name) {
        owner = msg.sender;
        eventName = name;
        saleOpen = false;
        nftName = "SectionTest NFT";
        nftSymbol = "STNF";
    }

    // Create section
    function createSection(
        string memory sectionName,
        uint256 num_tickets,
        uint256 sectionPrice
    ) public {
        require(
            saleOpen == false,
            "Cannot edit sections while selling tickets"
        );
        require(msg.sender == owner, "Only owner may create sections");
        require(sectionPrice > 0, "Price must be a positive number (Wei)");
        require(num_tickets > 0, "Must sell at least one ticket per section");

        Section memory newSection;

        newSection.name = sectionName;
        newSection.num_tickets = num_tickets;
        newSection.sold = 0;
        newSection.price = sectionPrice;

        sections.push(newSection);
    }

    // Start sale
    function startSale() public {
        require(msg.sender == owner, "Only owner may start sale");
        require(saleOpen == false, "Sale already started");
        require(sections.length > 0, "Create sections before opening sale");

        saleOpen = true;
    }

    // End sale (withdraw)
    function endSale() public {
        require(msg.sender == owner, "Only owner may end sale");
        require(saleOpen == true, "Needs to be on sale to end");
        saleOpen = false;

        payable(owner).transfer(address(this).balance);
    }

    function getSections() public view returns (Section[] memory) {
        return sections;
    }

    function getTickets() public view returns (Ticket[] memory) {
        return tickets;
    }

    function verifyTicket(uint256 id) public view returns (bool) {
        require(tickets[id].owner == msg.sender, "Not owner of ticket");
        require(tickets[id].used == false, "Ticket already used");
        return true;
    }

    function checkIn(uint256 id) public {
        require(tickets[id].owner == msg.sender, "Not ticket owner");
        require(tickets[id].used == false, "Ticket already used");

        tickets[id].used = true;
    }

    function buyTicket(uint256 sectionId, uint256 tokenId) external payable returns (uint256) {
        require(saleOpen == true, "Sale must be open");
        require(sectionId < sections.length, "Section ID must be valid");
        require(
            sections[sectionId].sold < sections[sectionId].num_tickets,
            "Section sold out"
        );
        require(
            msg.value == sections[sectionId].price,
            "Full price of ticket must be paid"
        );

        Ticket memory ticket;
        ticket.sectionId = sectionId;
        ticket.owner = msg.sender;
        tickets.push(ticket);
        sections[sectionId].num_tickets--;
        sections[sectionId].sold++;

        // Mint NFTs (QR code that contains the number of the sold ticket (first = 1 etc.))
        string memory soldToString = Strings.toString(sections[sectionId].sold);
        super._mint(msg.sender, tokenId);
        super._setTokenUri(tokenId, string.concat("https://qrcode.tec-it.com/API/QRCode?data=", "-", soldToString));

        return tickets.length - 1;
    }
}
