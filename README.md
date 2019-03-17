# Supply chain financing block chain
### Author
- 5910545019	Vittunyuta Maeprasart
- 5910545639	Kanchanok Kannee
- 5910546686	Pinwalun Witchawanitchanun
- 5910545655	Jiranan Patrathamakul

## Letter of Credit
A Letter of Credit is a method of payment and an important part of international trade. Both the buyer and seller rely on the security of banks to ensure that payment is received and goods are provided. In a Letter of Credit transaction, the goods are consigned to the order of the issuing bank, meaning that the bank will not release control of the goods until the buyer has either paid or undertaken to pay the bank for the documents.
![letter of credit](https://github.com/Pimwalun/Supply-Chain-Finance/blob/master/Letter_of_Credit.png)

## Procudures and transaction states

![Blockchain States](https://github.com/Pimwalun/Supply-Chain-Finance/blob/master/Blockchain_States.png)

**states**
1. ISSUED: After Importer request IssuingBank to open letter of credit, IssuingBank issue a L/C paper to the blockchain. {Owner: IssuingBank} 
2. APPROVED: AdvisoringBank approve the L/C paper. {Owner: IssuingBank} 
3. CONFIRMED: Exporter confirm the L/C paper. {Owner: IssuingBank} 
4. ADD_SHIPPING: Exporter ships goods and add a shipping documents to the L/C paper. {Owner: Exporter} 
5. CONFIRMED_SHIPPING: AdvisoringBank review the shipping document and confirm it. {Owner: AdvisoringBank} 
6. PAID_TO_ADVISORING: After the shipping document is confirmed and entire transaction is reviewed, IssuingBank pay to AdvisoringBank for shipping document. {Owner: IssuingBank} 
7. PAID_TO_ISSUING: Importer pay to IssuingBank for shipping document and use it to get the goods. {Owner: Importer} 

## Steps of clearing docker
> $ docker stop logspout peer0.org1.example.com orderer.example.com couchdb ca.example.com cliImporter dev-peer0.org1.example.com-papercontract-0 <br>
> $ docker rm $(docker ps -a -q) <br>
> $ docker rmi $(docker images -q) <br>

## Steps of installing
#### Create network
> $ cd Supply-Chain-Finance/basic-network <br>
> $ ./start.sh

#### Working as Importer
> $ cd ../letter-of-credit/organization/importer/configuration/cli <br>
> $ ./monitordocker.sh net_basic <br>
> $ docker-compose -f docker-compose.yml up -d cliImporter <br>

#### Install Contract
> $ docker exec cliImporter peer chaincode install -n papercontract -v 0 -p /opt/gopath/src/github.com/contract -l node <br>

#### Instantiate contract
> $ docker exec cliImporter peer chaincode instantiate -n papercontract -v 0 -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"

## Application
> $ cd ../../application <br>
> $ npm install <br>

**add identity information to wallet**
> $ node addToWallet.js <br>

**application list**
1. issue a L/C paper: .../issuingbank/application/**issue.js**
2. approve the L/C paper: .../advisoringbank/application/**approve.js**
3. confirm the L/C paper: .../exporter/aplication/**confirm.js**
4. add shipping document to the paper: .../exporter/application/**addShipping.js**
5. confirm shipping document: .../advisoringbank/application/**confirmShipping.js**
6. pay to AdvisoringBank for shipping document: .../issuingbank/application/**paid.js**
7. pay to IssuingBank for shipping document: .../importer/application/**paid.js**

There are 4 organizations (with their actions)
1. Importer -> paid(toIssuingBank)
2. IssuingBank -> issue, and paid(toAdvisoringBank)
3. AdvisoringBank -> approved, and comfirmedShipping(document)
4. Exporter -> confirmed, and addShipping(document)

command to invoke application
> $ node 'filename'.js <br>
  
for example, use issue.js to submit a L/C paper
> $ node issue.js <br>
