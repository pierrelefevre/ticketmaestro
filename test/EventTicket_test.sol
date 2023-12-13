// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "./remix_tests.sol";

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "../contracts/EventTicket.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract testSuite {
    /*
    // test createSection
    function testCreateSection() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        // Test one easy section
        eventTicket.createSection("VIP", 1000, 100 wei, 10);
        EventTicket.Section[] memory sections = eventTicket.getSections();

        Assert.equal(sections.length, 1, "Section is not created");
        Assert.equal(sections[0].name, "VIP", "Section name does not match");

        // Test minimum requirements + number as string
        eventTicket.createSection("1", 1, 1 wei, 1);
        sections = eventTicket.getSections();

        Assert.equal(sections.length, 2, "Section is not created");
        Assert.equal(sections[1].num_tickets, 1, "Num_tickets is wrong");
        Assert.equal(sections[1].price, 1 wei, "Price is wrong");
    }
*/
    // test startSale and endSale
    function testStartSaleAndEndSale() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        // Check whether the sale is open before startSale
        eventTicket.createSection("VIP", 100, 1 wei, 5);

        bool isOpen = eventTicket.saleOpen();

        Assert.equal(isOpen, false, "Sale should be closed");

        // Test startSale
        eventTicket.startSale();

        isOpen = eventTicket.saleOpen();

        Assert.equal(isOpen, true, "Sale should be open");

        // Test endSale
        eventTicket.endSale();
        isOpen = eventTicket.saleOpen();

        Assert.equal(isOpen, false, "Sale should be closed");

        // Test reopen openSale and endSale again        
        eventTicket.startSale();
        isOpen = eventTicket.saleOpen();

        Assert.equal(isOpen, true, "Sale should be open");

        eventTicket.endSale();
        isOpen = eventTicket.saleOpen();

        Assert.equal(isOpen, false, "Sale should be closed");
    }

    // test returnTicket
    function testReturnTicket() public payable {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 5, 1 wei, 5);

        eventTicket.startSale();

        eventTicket.buyTicket{value: 1 wei}(0);
        eventTicket.buyTicketForOtherPerson{value: 1 wei}(0, 0x17F6AD8Ef982297579C203069C1DbfFE4348c372);

        eventTicket.returnTicket(0);

        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();
        EventTicket.Section[] memory sections = eventTicket.getSections();

        Assert.equal(tickets.length, 2, "Ticket should be available but blocked");
        Assert.equal(tickets[0].blocked, true, "Ticket should be blocked");
        Assert.equal(sections[0].num_tickets, 4, "Available tickets should be increased");
        Assert.equal(sections[0].sold, 1, "Sold tickets should be decreased");
    }
}
    
