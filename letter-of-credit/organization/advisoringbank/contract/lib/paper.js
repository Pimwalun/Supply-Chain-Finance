/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate commercial paper state values
const cpState = {
    ISSUED: 1,
    APPROVED: 2,
    CONFIRMED: 3,
    ADD_SHIPPING: 4,
    COMFIRMED_SHIPPING: 5,
    PAID_TO_ADVISING: 6,
    PAID_TO_ISSUING: 7
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
    setIssued() {
        this.currentState = cpState.ISSUED;
    }
    setApproved() {
        this.currentState = cpState.APPROVED;
    }
    setConfirmed() {
        this.currentState = cpState.CONFIRMED;
    }
    setAddShipping() {
        this.currentState = cpState.ADD_SHIPPING;
    }
    setConfirmedShipping() {
        this.currentState = cpState.COMFIRMED_SHIPPING;
    }
    setPaidToAdvising() {
        this.currentState = cpState.PAID_TO_ADVISING;
    }
    setPaidToIssuing() {
        this.currentState = cpState.PAID_TO_ISSUING;
    }

    //Check either state match or not
    isIssued() {
        return this.currentState === cpState.ISSUED;
    }
    isApproved() {
        return this.currentState === cpState.APPROVED;
    }
    isConfirmed() {
        return this.currentState === cpState.CONFIRMED;
    }
    isAddShipping() {
        return this.currentState === cpState.ADD_SHIPPING;
    }
    isComfirmedShipping() {
        return this.currentState === cpState.COMFIRMED_SHIPPING;
    }
    isPaidToAdvising() {
        return this.currentState === cpState.PAID_TO_ADVISING;
    }
    isPaidToIssuing() {
        return this.currentState === cpState.PAID_TO_ISSUING;
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
    static createInstance(issuer, paperNumber, issueDateTime, value) {
        return new CommercialPaper({
            issuer,
            paperNumber,
            issueDateTime,
            value
        });
    }

    static getClass() {
        return 'org.papernet.commercialpaper';
    }
}

module.exports = CommercialPaper;
