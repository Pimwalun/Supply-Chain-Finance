/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate commercial paper state values
const cpState = {
    PURCHASE: 1,
    INVOICE: 2,
    REQUEST: 3,
    STATEMENT: 4,
    CONFIRM: 5,
    FUNDING: 6,
    STATUS: 7,
    COLLECT: 8,
    PAYMENT: 9
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class CommercialPaper extends State {

    constructor(obj) {
        super(CommercialPaper.getClass(), [obj.issuer, obj.paperNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
     */
    getIssuer() {
        return this.issuer;
    }

    setIssuer(newIssuer) {
        this.issuer = newIssuer;
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    /**
     * Useful methods to encapsulate commercial paper states
     */
    setPurchase() {
        this.currentState = cpState.PURCHASE;
    }
    setInvoice() {
        this.currentState = cpState.INVOICE;
    }
    setRequest() {
        this.currentState = cpState.REQUEST;
    }
    setStatement() {
        this.currentState = cpState.STATEMENT;
    }
    setConfirm() {
        this.currentState = cpState.CONFIRM;
    }
    setFunding() {
        this.currentState = cpState.FUNDING;
    }
    setStatus() {
        this.currentState = cpState.STATUS;
    }
    setCollect() {
        this.currentState = cpState.COLLECT;
    }
    setPayment() {
        this.currentState = cpState.PAYMENT;
    }

    //Check either state match or not
    isPurchase() {
        return this.currentState === cpState.PURCHASE;
    }
    isInvoice() {
        return this.currentState === cpState.INVOICE;
    }
    isRequest() {
        return this.currentState === cpState.REQUEST;
    }
    isStatement() {
        return this.currentState === cpState.STATEMENT;
    }
    isConfirm() {
        return this.currentState === cpState.CONFIRM;
    }
    isFunding() {
        return this.currentState === cpState.FUNDING;
    }
    isStatus() {
        return this.currentState === cpState.STATUS;
    }
    isCollect() {
        return this.currentState === cpState.COLLECT;
    }
    isPayment() {
        return this.currentState === cpState.PAYMENT;
    }

    static fromBuffer(buffer) {
        return CommercialPaper.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, CommercialPaper);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(issuer, paperNumber, issueDateTime, quantity) {
        return new CommercialPaper({
            issuer,
            paperNumber,
            issueDateTime,
            quantity
        });
    }

    static getClass() {
        return 'org.papernet.commercialpaper';
    }
}

module.exports = CommercialPaper;
