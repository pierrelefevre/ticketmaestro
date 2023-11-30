// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EventTicket is ERC721{

    // Event info
    struct Section {
        string name;
        uint256 num_tickets;
        uint256 sold;
        uint256 price;
    }
    address public owner;
    string public eventName;
    Section[] public sections;
    bool public saleOpen;


    // Minted tickets
    struct Ticket{
        uint256 sectionId;
    }
    Ticket[] public tickets;
    uint256 public nextTicketId;


    constructor(string memory name) ERC721("EventTicket", "ETK") {
        owner = msg.sender;
        eventName = name;
        saleOpen = false;
    }

    // Create section
    function createSection(string memory sectionName, uint256 num_tickets, uint256 sectionPrice) public {
        require(saleOpen == false, "Cannot edit sections while selling tickets");
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
    function endSale() public{
        require(msg.sender == owner, "Only owner may start sale");
        require(saleOpen == true, "Needs to be on sale to end");
        saleOpen = false;

        payable(owner).transfer(address(this).balance);
    }

    // Mint ticket
    function mintTicket(uint256 sectionId) public payable {
        require(saleOpen == true, "Sale must be open");
        require(sectionId < sections.length-1, "Section ID must be valid");
        require(sections[sectionId].sold < sections[sectionId].num_tickets, "Section sold out");
        require(msg.value == sections[sectionId].price, "Full price of ticket must be paid");

        Ticket memory ticket;
        ticket.sectionId = sectionId;
        tickets.push(ticket);
        uint256 ticketId = nextTicketId++;

        _safeMint(msg.sender, ticketId);
    }
}
