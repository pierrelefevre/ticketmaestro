# 🎟️ ticketmaestro
Event tickets on the Ethereum blockchain

A project by Robert Scholz and Pierre Le Fevre, built in the context of the KTH DD2485 Programmable Society course.

![logo](./app/public/android-chrome-192x192.png)

## Contract breakdown

This smart protocol is intended to simulate a ticketing system for an event such as the upcoming European Championship 2024 in football e.g. An owner can deploy a contract and create tickets for an event and checkin customers to an event. Customers can buy them for themselves or other people. A ticket owner can also return a ticket.

This ticket sale project is based on Ethereum and build with Solidity. The EventTicket.sol file can be deployed in remix, but there is also the possibility to use MetaMask with the website https://ticket.app.cloud.cbh.kth.se/ which intends to simulate a ticket purchasing website.

## Concepts

### Event Concept

The smart contract ticket system allows to create events where a limitation of people should occur and/or the attendants should pay an entrance fee. The contract allows to deploy multiple events and multiple sections for each event.

### Section Concept

Each event has one or more sections which can be seen as categories. Each section has a name, a fixed number of tickets available and a ticket price (in wei). Additionally there is a parameter which shows the number of tickets sold which is 0 at the beginning. Only the owner can create section and a section can only be created while the sale is not open. 

### Ticket Concept

Tickets are digital assets that are written into the blockchain. Each ticket has a sectionID it belongs to (the sectionID is created numerically while 0 is the oldest one created), the address of the assigned owner and a bool value that shows whether the ticket has been returned (blocked) or already used. A ticket can be returned, but only through the owner, during sale and only if it has not been returned or used. A ticket status can also be retrieved.

### Ticket Sale Concept

The tickets can be bought for themself or for other people. Requirements for a purchase are sufficient funds, an open sale, available number of tickets and a non-reached personal ticket limit. The mint happens during the purchase.

### Check In/Validator Concept

The tickets are personalised and can only be used by the owner and once the owner has checked in a person or a ticket owner has returned its ticket, the tickets cannot be used or returned anymore.

### Getting Started

1. Enter an event name and deploy the 'EventTicket' smart contract to the Ethereum blockchain.
2. Enter a section name and call the 'createSection()' as the owner function to define event sections.
3. Start the ticket sale as an owner using the 'startSale()' function.
4. Tickets can be purchased by the user using the 'buyTicket()' function or for others using the 'buyTicketForOtherPerson' function (with the address).
5. Check in attendees as the owner using the 'checkIn()' function.
6. Check the ticket status using the 'verifyTicket()' function.
7. (End the sale as an owner using the 'endSale()' function.)
8. (Tickets, if unused, can be returned by users with the 'returnTicket()' function during the sale.)

## Testing
Testing of the contract can happen using the automated tool HardHat (file EventTicket_test.js). There are 42 tests covering 100% of the statements in various ways.

## Progress tracking 
View the [checklist](grading-checklist.md).

## Related work
[AWS Managed Blockchain](https://aws.amazon.com/blogs/database/blockchain-and-the-future-of-event-ticketing/)

[GET Protocol](https://www.get-protocol.io/)


## Development stuff
Current address: 0x98C052036B69129E6007b50136b3DaA6E9A8c7a4
