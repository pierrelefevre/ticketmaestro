// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract EventTicket {
    // Event info
    struct Section {
        string name;
        uint256 num_tickets;
        uint256 sold;
        uint256 price;
        uint256 ticketLimit;
    }

    mapping(address => uint256) public ticketsPurchasedByBuyer; // New mapping to track tickets purchased by each buyer

    address public owner;
    string public eventName;
    Section[] public sections;
    bool public saleOpen;

    // Minted tickets
    struct Ticket {
        uint256 sectionId;
        address owner;
        bool used;
        bool blocked;
    }
    Ticket[] public tickets;

    constructor(string memory name) {
        owner = msg.sender;
        eventName = name;
        saleOpen = false;
    }

    // Create section
    function createSection(
        string memory sectionName,
        uint256 num_tickets,
        uint256 sectionPrice,
        uint256 maxTicketsPerPerson
    ) public {
        require(
            saleOpen == false,
            "Cannot edit sections while selling tickets"
        );
        require(msg.sender == owner, "Only owner may create sections");
        require(sectionPrice > 0, "Price must be a positive number (Wei)");
        require(num_tickets > 0, "Must sell at least one ticket per section");
        require(
            maxTicketsPerPerson > 0,
            "The maximum ticket number per person must be at least one"
        );

        // Create new section
        Section memory newSection;
        newSection.name = sectionName;
        newSection.num_tickets = num_tickets;
        newSection.sold = 0;
        newSection.price = sectionPrice;
        newSection.ticketLimit = maxTicketsPerPerson;

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
        require(tickets[id].blocked == false, "Ticket already returned");

        return true;
    }

    function checkIn(uint256 id) public {
        require(tickets[id].owner == msg.sender, "Not ticket owner");
        require(tickets[id].used == false, "Ticket already used");
        require(tickets[id].blocked == false, "Ticket already returned");

        tickets[id].used = true;
    }

    function buyTicket(uint256 sectionId) external payable returns (uint256) {
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
        require(
            ticketsPurchasedByBuyer[msg.sender] + 1 <=
                sections[sectionId].ticketLimit,
            "Maximum number of tickets already reached"
        );

        // Create new ticket
        Ticket memory ticket;
        ticket.sectionId = sectionId;
        ticket.owner = msg.sender;
        tickets.push(ticket);

        // Decrease the available number of tickets and increase the sold number
        sections[sectionId].num_tickets--;
        sections[sectionId].sold++;

        // Increase the number of bought tickets
        ticketsPurchasedByBuyer[msg.sender]++;

        return tickets.length - 1;
    }

    // Buy ticket for another person
    function buyTicketForOtherPerson(
        uint256 sectionId,
        address otherPerson
    ) external payable returns (uint256) {
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
        require(
            ticketsPurchasedByBuyer[otherPerson] + 1 <=
                sections[sectionId].ticketLimit,
            "Maximum number of tickets already reached"
        );

        // Create new ticket
        Ticket memory ticket;
        ticket.sectionId = sectionId;
        ticket.owner = otherPerson;
        tickets.push(ticket);

        // Decrease the available number of tickets and increase the sold number
        sections[sectionId].num_tickets--;
        sections[sectionId].sold++;

        // Increase the number of bought tickets
        ticketsPurchasedByBuyer[otherPerson]++;

        return tickets.length - 1;
    }

    // Return an own ticket
    function returnTicket(uint256 id) public {
        require(saleOpen == true, "Sale must be open");
        require(id < tickets.length, "Invalid ticket ID");
        require(tickets[id].owner == msg.sender, "Not owner of ticket");
        require(tickets[id].used == false, "Ticket already used");
        require(tickets[id].blocked == false, "Ticket already returned");

        // Mark ticket as blocked in the array
        tickets[id].blocked = true;
#?¤"=)#¤?=)"#¤?=
        // Increase the available number of tickets and decrease the sold number
        sections[tickets[id].sectionId].num_tickets++;
        sections[tickets[id].sectionId].sold--;

        // Refund the ticket price to the ticket owner
        payable(msg.sender).transfer(sections[tickets[id].sectionId].price);

        // Decrease the number of bought tickets
        ticketsPurchasedByBuyer[msg.sender]--;
    }
}
