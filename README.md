# Supply chain financing block chain
### Author
- 5910545019	Vittunyuta Maeprasart
- 5910545639	Kanchanok Kannee
- 5910546686	Pinwalun Witchawanitchanun
- 5910545655	Jiranan Patrathamakul

## Letter of Credit

## Procudures and transaction states

<mai picture>

**states**
1. ISSUED: After Importer request IssuingBank to open letter of credit, IssuingBank issue a L/C paper to the blockchain.
2. APPROVED: AdvisoringBank approve the L/C paper.
3. CONFIRMED: Exporter confirm the L/C paper.
4. ADD_SHIPPING: Exporter ships goods and add a shipping documents to the L/C paper.
5. SHIPPING_CONFIRMED: AdvisoringBank review the shipping document and confirm it.
6. PAID_TO_ADVISORING: After the shipping document is confirmed and entire transaction is reviewed, IssuingBank pay to AdvisoringBank for shipping document.
7. PAID_TO_ISSUING: Importer pay to IssuingBank for shipping document and use it to get the goods.

## Steps of installing
#### Create network
> $ cd fabric-samples/basic-network <br>
> $ ./start.sh

#### Working as Importer
> $ cd organization/importer/configuration/cli <br>
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

command to invode application
> $ node <filename>.js <br>
  
for example, use issue.js to submit a L/C paper
> $ node issue.js <br>
