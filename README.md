# Supply chain financing block chain
### Author
5910545019	Vittunyuta Maeprasart
5910545639	Kanchanok Kannee
5910546686	Pinwalun Witchawanitchanun
5910545655	Jiranan Patrathamakul

## Letter of Credit

## Steps of installing
### Create network
> $ cd fabric-samples/basic-network <br>
> $ ./start.sh

### Working as Importer
> $ cd organization/importer/configuration/cli <br>
> $ ./monitordocker.sh net_basic <br>
> $ docker-compose -f docker-compose.yml up -d cliImporter <br>

### Install Contract
> docker exec cliImporter peer chaincode install -n papercontract -v 0 -p /opt/gopath/src/github.com/contract -l node <br>

## Overall procudures and transaction states

