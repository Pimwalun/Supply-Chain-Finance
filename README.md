# Supply chain financing block chain

Implementing paper net from hyperledger fabric example into supply chain financing process, by allowing funder, supplier, and buyer have their own ledger.

## Available function in smart contact

Including

Purchase , Invoice , Request , Statement , Confirm , Funding , Status , Collect , Payment -> according to the flow of the transaction

## Usage

Setting up the fabric by

``
cd ./basic-network
``

``
./start.sh
``

Start Command line interface for supplier, buyer, and funder

``
cd ./supply-chain-financing/organization/{funder/buyer/supplier}/configuration/cli/
``

``
docker-compose -f docker-compose.yml up -d {cliBuyer/cliFunder/cliSupplier}
``

Install paper contact to chain code (you need to install it to every cli)

``
cd ./supply-chain-financing/organization/{funder/buyer/supplier}/contract/lib/
``

``
docker exec {cliBuyer/cliFunder/cliSupplier} peer chaincode install -n papercontract -v 0 -p /opt/gopath/src/github.com/contract -l node
``

``
docker exec {cliBuyer/cliFunder/cliSupplier} peer chaincode instantiate -n papercontract -v 0 -l node -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' -C mychannel -P "AND ('Org1MSP.member')"
``

Open the application directory (3 folder)

``
cd ./supply-chain-financing/organization/{funder/buyer/supplier}/application/
``

``
npm install
``

``
node <function>.js
``

## Member

Tharit Pongsaneh

Archawin Trirugsapun

Patcharapol Nirunpornphutta

Sirasath Piyapootinun
