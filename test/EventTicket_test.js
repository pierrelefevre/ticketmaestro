const EventTicket = artifacts.require('EventTicket');

contract('EventTicket', (accounts) => {
    it('should create a section', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        // Test one easy section
        await eventTicket.createSection('VIP', 1000, 100, 10);
        const sections = await eventTicket.getSections();

        assert.equal(sections.length, 1, 'Section is not created');
        assert.equal(sections[0].name, 'VIP', 'Section name does not match');

        // Test minimum requirements + number as string
        await eventTicket.createSection('1', 1, 1, 1);
        const updatedSections = await eventTicket.getSections();

        assert.equal(updatedSections.length, 2, 'Section is not created');
        assert.equal(updatedSections[1].num_tickets, 1, 'Num_tickets is wrong');
        assert.equal(updatedSections[1].price, 1, 'Price is wrong');
    });

    it('should start and end the sale', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        // Check whether the sale is open before startSale
        await eventTicket.createSection('VIP', 100, 1, 5);

        const isOpenBeforeStart = await eventTicket.saleOpen();
        assert.equal(isOpenBeforeStart, false, 'Sale should be closed');

        // Test startSale
        await eventTicket.startSale();
        const isOpenAfterStart = await eventTicket.saleOpen();
        assert.equal(isOpenAfterStart, true, 'Sale should be open');

        // Test endSale
        await eventTicket.endSale();
        const isOpenAfterEnd = await eventTicket.saleOpen();
        assert.equal(isOpenAfterEnd, false, 'Sale should be closed');

        // Test reopen openSale and endSale again        
        await eventTicket.startSale();
        const isOpenAfterReopen = await eventTicket.saleOpen();
        assert.equal(isOpenAfterReopen, true, 'Sale should be open');

        await eventTicket.endSale();
        const isOpenAfterSecondEnd = await eventTicket.saleOpen();
        assert.equal(isOpenAfterSecondEnd, false, 'Sale should be closed');
    });

    it('should buy one ticket', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);
        await eventTicket.startSale();
        await eventTicket.buyTicket(0, {value: 1});

        const tickets = await eventTicket.getTickets();
        const sections = await eventTicket.getSections();

        assert.equal(tickets.length, 1, 'Ticket is not bought');
        assert.equal(tickets[0].owner, accounts[0], 'Ticket owner should be the test contract');
        assert.equal(sections[0].num_tickets, 99, 'Available tickets should be decreased');
        assert.equal(sections[0].sold, 1, 'Sold tickets should be increased');
    });

    it('should buy multiple tickets', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);
        await eventTicket.startSale();
        await eventTicket.buyTicket(0, {value: 1});
        await eventTicket.buyTicket(0, {value: 1});

        const tickets = await eventTicket.getTickets();

        assert.equal(tickets.length, 2, 'Tickets are not bought');
        assert.equal(tickets[0].owner, accounts[0], 'Ticket owner should be the test contract');
        assert.equal(tickets[1].owner, accounts[0], 'Ticket owner should be the test contract');
    });

    it('should not buy a ticket out of section scope', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);
        await eventTicket.startSale();

        try {
            await eventTicket.buyTicket(1, {value: 1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 0, 'Ticket should not be bought');
        }
    });

    it('should not buy a ticket before sale', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);

        try {
            await eventTicket.buyTicket(0, {value: 1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 0, 'Ticket should not be bought');
        }
    });

    it('should not buy a ticket when sold out', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 1, 1, 1);
        await eventTicket.startSale();

        await eventTicket.buyTicket(0, {value: 1});

        try {
            await eventTicket.buyTicket(0, {value: 1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 1, 'There is only one ticket for sale');
        }
    });


    it('should buy a ticket for other person', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);
        await eventTicket.startSale();
        await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value:1});

        const tickets = await eventTicket.getTickets();

        assert.equal(tickets.length, 1, 'Ticket is not bought');
        assert.equal(tickets[0].owner, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', 'Wrong ticket owner on the test contract');
    });

    it('should not buy a ticket for other person before sale', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);

        try {
            await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value:1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 0, "Ticket shouldn't be booked outside of sale");
        }
    });

    it('should not buy a ticket for other person while limit already reached', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 1);
        await eventTicket.startSale();

        await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value:1});
        try {
            await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value:1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 1, 'There is only one ticket for sale');
        }
    });

    it('should buy a ticket and a ticket for other person combined', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);
        await eventTicket.startSale();

        await eventTicket.buyTicketForOtherPerson(0, accounts[0], {value:1});
        await eventTicket.buyTicket(0, {value: 1});

        const tickets = await eventTicket.getTickets();

        assert.equal(tickets.length, 2, 'One or two tickets are not bought');
        assert.equal(tickets[0].owner, accounts[0], 'Wrong ticket owner on the test contract');
        assert.equal(tickets[1].owner, accounts[0], 'Wrong ticket owner on the test contract');
    });

    it('should buy a ticket for other person (own person here) but not an additional ticket (reach the limit after the first)', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 1);
        await eventTicket.startSale();

        await eventTicket.buyTicketForOtherPerson(0, accounts[0], {value:1});

        try {
            await eventTicket.buyTicket(0, {value: 1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 1, 'Either both tickets have not been bought or both have been bought');
            assert.equal(tickets[0].owner, accounts[0], 'Wrong ticket owner on the test contract');
        }
    });
});
