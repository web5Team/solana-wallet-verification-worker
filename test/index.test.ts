import { Buffer } from 'buffer'
import { describe, expect, it } from 'vitest'
import * as bip39 from 'bip39'
import { Keypair, Transaction } from '@solana/web3.js'
import app from '../src'

const mnemonic = bip39.generateMnemonic()
const seed = bip39.mnemonicToSeedSync(mnemonic, '')
const keypair = Keypair.fromSeed(seed.subarray(0, 32))
const nonce = 'test'
describe('tx', () => {
  it('should validate tx', async () => {
    const request = new Request(`http://localhost/create?publicKeyStr=${keypair.publicKey.toBase58()}&nonce=${nonce}`)
    const result = await app.request(request, {}, process.env)
    const json = await result.json()
    expect(json).toHaveProperty('tx')
    const { tx } = json

    const transaction = Transaction.from(Buffer.from(tx, 'base64'))
    transaction.sign(keypair)
    const signedBase64 = transaction.serialize().toString('base64')
    const request2 = new Request(`http://localhost/validate`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signedTx: signedBase64,
        nonce
      }),
    })
    const result2 = await app.request(request2)
    const json2 = await result2.json()
    expect(json2).toHaveProperty('user')
    expect(json2.user).toMatch(keypair.publicKey.toBase58())
  })
})
