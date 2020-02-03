/* A simple permaweb library for vouching for identities. */

const Arweave = require('arweave/node')

function init() {
    const arweave = Arweave.init({
        host: arweave_host,
        port: arweave_port,
        protocol: arweave_protocol
    })
}

async function vouch (wallet, addr) {
    let tx = await arweave.createTransaction({ to: addr }, wallet)
    tx.addTag("app-name", "vouch")
    tx.addTag("event", "verified")
    await arweave.transactions.sign(tx, wallet)
    const response = await arweave.transactions.post(tx)
}

async function vouches(address) {
    let query =
        {
            op: 'and',
            expr1:
                {
                    op: 'equals',
                    expr1: 'to',
                    expr2: address
                },
            expr2:
                {
                    op: 'and',
                    expr1:
                        {
                            op: 'equals',
                            expr1: 'App-Name',
                            expr2: 'vouch'
                        },
                    expr2:
                        {
                            op: 'equals',
                            expr1: 'event',
                            expr2: 'verified'
                        }
                }
        }

    const res = await this.arweave.api.post(`arql`, query)

    var vouchers = []
    if (res.data == '') {
        vouchers = []
    } else {
        vouchers =
            await Promise.all(res.data.map(async function (id, i) {
                tx = await this.arweave.transactions.get(id)
                return await arweave.wallets.ownerToAddress(tx.owner)
            }))
    }

    return vouchers
}