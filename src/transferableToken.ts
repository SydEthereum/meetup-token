import * as Web3 from 'web3';
import * as VError from 'verror';
import * as _ from "underscore";
import * as logger from 'config-logger';

export default class TransferableToken
{
    readonly web3: any;
    readonly jsonInterface = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"fromAddress","type":"address"},{"name":"toAddress","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"toAddress","type":"address"},{"name":"amount","type":"uint256"},{"name":"externalId","type":"string"},{"name":"reason","type":"string"}],"name":"issue","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"holderAddress","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"toAddress","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"redeem","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"ownerAddress","type":"address"},{"name":"spenderAddress","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"tokenSymbol","type":"string"},{"name":"toeknName","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"toAddress","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"externalId","type":"string"},{"indexed":false,"name":"reason","type":"string"}],"name":"Issue","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"fromAddress","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];
    readonly binary = '0x60606040526003805460ff1916905560068054600160a060020a03191633600160a060020a0316179055341561003457600080fd5b604051610aa6380380610aa68339810160405280805182019190602001805190910190505b600182805161006c929160200190610089565b506002818051610080929160200190610089565b505b5050610129565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100ca57805160ff19168380011785556100f7565b828001600101855582156100f7579182015b828111156100f75782518255916020019190600101906100dc565b5b50610104929150610108565b5090565b61012691905b80821115610104576000815560010161010e565b5090565b90565b61096e806101386000396000f300606060405236156100ac5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100b1578063095ea7b31461013c57806318160ddd1461016057806323b872dd14610185578063313ce567146101af57806364f018d8146101d857806370a082311461028157806395d89b41146102b2578063a9059cbb1461033d578063db006a7514610361578063dd62ed3e14610379575b600080fd5b34156100bc57600080fd5b6100c46103b0565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156101015780820151818401525b6020016100e8565b50505050905090810190601f16801561012e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561014757600080fd5b61015e600160a060020a0360043516602435610459565b005b341561016b57600080fd5b6101736104be565b60405190815260200160405180910390f35b341561019057600080fd5b61015e600160a060020a03600435811690602435166044356104c5565b005b34156101ba57600080fd5b6101c2610536565b60405160ff909116815260200160405180910390f35b34156101e357600080fd5b61015e60048035600160a060020a03169060248035919060649060443590810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052818152929190602084018383808284375094965061053f95505050505050565b005b341561028c57600080fd5b610173600160a060020a03600435166106d6565b60405190815260200160405180910390f35b34156102bd57600080fd5b6100c46106f5565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156101015780820151818401525b6020016100e8565b50505050905090810190601f16801561012e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561034857600080fd5b61015e600160a060020a036004351660243561079e565b005b341561036c57600080fd5b61015e6004356107ae565b005b341561038457600080fd5b610173600160a060020a0360043581169060243516610873565b60405190815260200160405180910390f35b6103b8610930565b60028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561044e5780601f106104235761010080835404028352916020019161044e565b820191906000526020600020905b81548152906001019060200180831161043157829003601f168201915b505050505090505b90565b600160a060020a03338116600081815260056020908152604080832094871680845294909152908190208490557f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259084905190815260200160405180910390a35b5050565b6000545b90565b600160a060020a03808416600090815260056020908152604080832033909416835292905220548111156104f857600080fd5b600160a060020a03808416600090815260056020908152604080832033909416835292905220805482900390556105308383836108a0565b5b505050565b60035460ff1681565b60065433600160a060020a0390811691161461055a57600080fd5b6000805484018155600160a060020a0385168082526004602052604091829020805486019055907ff852d0a3cf181ff3367de4646a22f9c0ea924ae0b367c74e07079a897f313c3c9085908590859051808481526020018060200180602001838103835285818151815260200191508051906020019080838360005b838110156105ef5780820151818401525b6020016105d6565b50505050905090810190601f16801561061c5780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156106535780820151818401525b60200161063a565b50505050905090810190601f1680156106805780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a283600160a060020a031660007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8560405190815260200160405180910390a35b50505050565b600160a060020a0381166000908152600460205260409020545b919050565b6106fd610930565b60018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561044e5780601f106104235761010080835404028352916020019161044e565b820191906000526020600020905b81548152906001019060200180831161043157829003601f168201915b505050505090505b90565b6104ba3383836108a0565b5b5050565b600160a060020a033316600090815260046020526040902054819010156107d457600080fd5b600080548290038155600160a060020a033316808252600460205260409182902080548490039055907f222838db2794d11532d940e8dec38ae307ed0b63cd97c233322e221f998767a69083905190815260200160405180910390a2600033600160a060020a03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405190815260200160405180910390a35b50565b600160a060020a038083166000908152600560209081526040808320938516835292905220545b92915050565b600160a060020a0383166000908152600460205260409020548111156108c557600080fd5b600160a060020a038084166000818152600460205260408082208054869003905592851680825290839020805485019055917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9084905190815260200160405180910390a35b505050565b602060405190810160405260008152905600a165627a7a7230582093fb9b0b386ac7c1a86afc71387842cc487c274af21cd559730fea90a372db9c0029';
    contract: any;
    contractAddress: string;
    contractOwner: string;
    accountPassword: string;

    defaultGas = 100000;
    defaultGasPrice = 4000000000;

    transactions: { [transactionHash: string] : number; } = {};

    constructor(readonly wsURL: string, contractOwner: string, contractAddress?: string, accountPassword: string = "")
    {
        this.contractAddress = contractAddress;
        this.contractOwner = contractOwner;
        this.accountPassword = accountPassword;

        const description = `connect to Ethereum node using websocket url ${wsURL}`;

        logger.debug(`About to ${description}`);

        this.web3 = new Web3(wsURL);

        // TODO need a way to validate that web3 connected to a node. The following will not work as web3 1.0 no longer supports web3.isCOnnected()
        // https://github.com/ethereum/web3.js/issues/440
        // if (!this.web3.isConnected())
        // {
        //     const error = new VError(`Failed to ${description}.`);
        //     logger.error(error.stack);
        //     throw(error);
        // }

        if (contractAddress)
        {
            this.contract = new this.web3.eth.Contract(this.jsonInterface, contractAddress, {
                from: contractOwner
            });
        }
        else
        {
            this.contract = new this.web3.eth.Contract(this.jsonInterface, {
                from: contractOwner
            });
        }
    }

    // deploy a new contract
    deployContract(contractOwner: string, symbol = "SET", tokenName = "Transferable Meetup token", gas = 900000, gasPrice = 6000000000): Promise<string>
    {
        const self = this;
        this.contractOwner = contractOwner;

        const description = `deploy transferable meetup token with token symbol ${symbol}, token name "${tokenName}" from sender address ${self.contractOwner}, gas ${gas} and gasPrice ${gasPrice}`;

        return new Promise<string>((resolve, reject) =>
        {
            logger.debug(`About to ${description}`);

            try
            {
                self.contract.deploy({
                    data: self.binary,
                    arguments: [symbol, tokenName]
                })
                    .send({
                        from: contractOwner,
                        gas: gas,
                        gasPrice: gasPrice
                    })
                    .on('transactionHash', (hash: string) => {
                        logger.debug(`Got transaction hash ${hash} from ${description}`);

                        self.transactions[hash] = 0;
                    })
                    .on('receipt', (receipt: object) => {
                        logger.debug(`Created contract with address ${receipt.contractAddress} using ${receipt.gasUsed} gas for ${description}`);

                        self.contractAddress = receipt.contractAddress;
                        self.contract.options.address = receipt.contractAddress;
                        resolve(receipt.contractAddress);
                    })
                    .on('confirmation', (confirmationNumber: number, receipt: object) =>
                    {
                        logger.trace(`${confirmationNumber} confirmations for ${description} with transaction hash ${receipt.transactionHash}`);

                        self.transactions[receipt.transactionHash] = confirmationNumber;
                    })
                    .on('error', (err: Error) => {
                        const error = new VError(err, `Failed to ${description}.`);
                        logger.error(error.stack);
                        reject(error);
                    });
            }
            catch (err)
            {
                const error = new VError(err, `Failed to ${description}.`);
                logger.error(error.stack);
                reject(error);
            }
        });
    }

    // issue an amount of tokens to an address
    issueTokens(toAddress: string, amount: number, externalId: string, reason: string, _gas?: number, _gasPrice?: number): Promise<string>
    {
        const self = this;

        const description = `issue ${amount} tokens to address ${toAddress}, from sender address ${self.contractOwner}, contract ${this.contract._address}, external id ${externalId} and reason ${reason}`;

        const gas = _gas || self.defaultGas;
        const gasPrice = _gasPrice || self.defaultGasPrice;

        return new Promise<string>((resolve, reject) =>
        {
            self.contract.methods.issue(toAddress, amount, externalId, reason)
            .send({
                from: self.contractOwner,
                gas: gas,
                gasPrice: gasPrice
            })
            .on('transactionHash', (hash: string) =>
            {
                logger.debug(`transaction hash ${hash} returned for ${description}`);
                self.transactions[hash] = 0;
            })
            .on('receipt', (receipt: object) =>
            {
                if (receipt.gasUsed == gas)
                {
                    const error = new VError(`Used all ${gas} gas so transaction probably threw for ${description}`);
                    logger.error(error.stack);
                    return reject(error);
                }

                logger.debug(`${receipt.gasUsed} gas used of a ${gas} gas limit for ${description}`);
                resolve(receipt.transactionHash);
            })
            .on('confirmation', (confirmationNumber: number, receipt: object) =>
            {
                logger.trace(`${confirmationNumber} confirmations for ${description} with transaction hash ${receipt.transactionHash}`);

                self.transactions[receipt.transactionHash] = confirmationNumber;
            })
            .on('error', (err: Error) =>
            {
                const error = new VError(err, `Could not ${description}`);
                logger.error(error.stack);
                reject(error);
            });
        });
    }


    // redeem tokens
    redeemTokens(amount: number, _gas?: number, _gasPrice?: number): Promise<string>
    {
        const self = this;

        const gas = _gas || self.defaultGas;
        const gasPrice = _gasPrice || self.defaultGasPrice;

        const description = `redeem tokens from contract ${this.contract._address} from sender address ${self.contractOwner} and amount ${amount}`;

        return new Promise<string>((resolve, reject) =>
        {
            self.contract.methods.redeem(amount).send({
                from: self.contractOwner
            })
            .on('transactionHash', (hash: string) =>
            {
                logger.info(`${description} returned transaction hash ${hash}`);
                self.transactions[hash] = 0;
            })
            .on('receipt', (receipt: object) =>
            {
                if (receipt.gasUsed == gas)
                {
                    const error = new VError(`Used all ${gas} gas so transaction probably threw for ${description}`);
                    logger.error(error.stack);
                    return reject(error);
                }

                logger.debug(`${receipt.gasUsed} gas used of a ${gas} gas limit for ${description}`);
                resolve(receipt.transactionHash);
            })
            .on('confirmation', (confirmationNumber: number, receipt: object) =>
            {
                logger.trace(`${confirmationNumber} confirmations for ${description} with transaction hash ${receipt.transactionHash}`);
                self.transactions[receipt.transactionHash] = confirmationNumber;
            })
            .on('error', (err: Error) =>
            {
                const error = new VError(err, `Could not ${description}`);
                logger.error(error.stack);
                reject(error);
            });
        });
    }

    async getSymbol(): Promise<string>
    {
        const description = `symbol of contract at address ${this.contract._address}`;

        try
        {
            const symbol = await this.contract.methods.symbol().call();

            logger.info(`Got ${symbol} ${description}`);
            return symbol;
        }
        catch (err)
        {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }

    async getName(): Promise<string>
    {
        const description = `name of contract at address ${this.contract._address}`;

        try
        {
            const name = await this.contract.methods.name().call();

            logger.info(`Got ${name} ${description}`);
            return name;
        }
        catch (err)
        {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }

    async getTotalSupply(): Promise<number>
    {
        const description = `total supply of contract at address ${this.contract._address}`;

        try
        {
            const totalSupply = await this.contract.methods.totalSupply().call();

            logger.info(`Got ${totalSupply} ${description}`);
            return totalSupply;
        }
        catch (err)
        {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }

    async getBalanceOf(address: string): Promise<number>
    {
        const description = `balance of address ${address} in contract at address ${this.contract._address}`;

        try
        {
            const balance = await this.contract.methods.balanceOf(address).call();

            logger.info(`Got ${balance} ${description}`);
            return balance;
        }
        catch (err)
        {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }

    async getIssueEvents(reason?: string): Promise<string[]>
    {
        const description = `get unique list of external ids from past Issue events with reason ${reason} from contract at address ${this.contract._address}`;

        const options = {
            fromBlock: 0
        };

        try
        {
            logger.debug(`About to ${description}`);

            const events = await this.contract.getPastEvents('Issue', options);

            logger.debug(`Got ${events.length} past Issue events`);

            const externalIds: string[] = _.chain(events)
                .filter((event) =>
                {
                    if (reason) {
                        return event.returnValues.reason == reason;
                    }
                    return true;
                })
                .map(event => {return event.returnValues.externalId;})
                .uniq()
                .value();

            logger.info(`${externalIds.length} unique external ids successfully returned from ${description}`);

            return externalIds;
        }
        catch (err)
        {
            const error = new VError(err, `Could not ${description}`);
            console.log(error.stack);
            throw error;
        }
    }

    async unlockAccount(address: string)
    {
        const description = `unlock account with address ${address}`;
        try
        {
            logger.debug(`About to ${description}`);

            await this.web3.eth.personal.unlockAccount(address, this.accountPassword, 0);

            logger.info(`Successfully ${description}`);
        }
        catch (err)
        {
            const error = new VError(err, `Could not ${description}`);
            console.log(error.stack);
            throw error;
        }
    }
}
