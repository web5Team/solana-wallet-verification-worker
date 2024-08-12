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
  // it('should validate tx', async () => {
  //   const request = new Request(`http://localhost/create?publicKeyStr=${keypair.publicKey.toBase58()}&nonce=${nonce}`)
  //   const result = await app.request(request, {}, process.env)
  //   const json = await result.json()
  //   expect(json).toHaveProperty('tx')
  //   const { tx } = json

  //   const transaction = Transaction.from(Buffer.from(tx, 'base64'))
  //   transaction.sign(keypair)
  //   const signedBase64 = transaction.serialize().toString('base64')
  //   const request2 = new Request(`http://localhost/validate`, {
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       signedTx: signedBase64,
  //       nonce
  //     }),
  //   })
  //   const result2 = await app.request(request2)
  //   const json2 = await result2.json()
  //   expect(json2).toHaveProperty('user')
  //   expect(json2.user).toMatch(keypair.publicKey.toBase58())
  // })

  it('test', async ( )=> {
    const transaction = Transaction.from(Buffer.from('AWaAsXz1logNGGfXiejq0aBJgzetNkAow1fJfKoWVYMk31R8/5Z2Hqki/S+u0nU+vzVHpnRHwgvzZvUXvkL91gYBAAIDOC9bTPjuQz/QHEQQruGzEaqRBLflKdhX4On4dvyzsM4DBkZv5SEXMv/srbpyw5vnvIzlu8X3EmssQ5s6QAAAAAVKU1qZKSEGTSTocWDaOHx8NbXdvJK7geQfqEBBBUSN0AqJBaEzdOh94a3X3M2Xz27SZ5P0z541Zu98ZdS//gkDAQAJA6CGAQAAAAAAAQAFAkANAwACAA02NjFhMTg5ZjViMzE2', 'base64'))
    console.info(transaction.instructions)
  })
})
