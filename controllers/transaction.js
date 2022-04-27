function create(data, public_key, private_key) {
    const API_PATH = 'http://localhost:9984/api/v1/'
    const conn = new driver.Connection(API_PATH)
    
    const metadata = null

    const tx = driver.Transaction.makeCreateTransaction(
        data,
        metadata,

        // A transaction needs an output
        [driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(public_key))],
        public_key
    )

    const txSigned = driver.Transaction.signTransaction(tx, private_key)

    conn.postTransactionCommit(txSigned)
        .then(retrievedTx => console.log('Transaction', retrievedTx.id, 'successfully posted.'))
}

module.exports = {
    create
}