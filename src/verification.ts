// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from 'buffer'
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js'
import { MEMO_PROGRAM_ID, createMemoInstruction } from '@solana/spl-memo'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { zValidatorHook } from './utils'

export const SignCreateReqSchema = z.object({
  nonce: z.string({ message: 'nonce cannot be empty' }).min(1, { message: 'nonce cannot be empty' }),
  publicKeyStr: z.string().refine((arg) => {
    try {
      const _ = new PublicKey(arg)
      return true
    }
    catch {
      return false
    }
  }, 'Invalid public key'),
})

export const ValidateReqSchema = z.object({
  nonce: z.string({ message: 'nonce cannot be empty' }).min(1, { message: 'nonce cannot be empty' }),
  signedTx: z.string({ message: 'Invalid signed tx' }).min(1, { message: 'Invalid signed tx' }),
})

const app = new Hono()

app.post('validate', zValidator('json', ValidateReqSchema, zValidatorHook), async (c) => {
  const { signedTx, nonce } = c.req.valid('json')
  const tx = Transaction.from(Buffer.from(signedTx, 'base64'))

  const inx = tx.instructions.find(ins => ins.programId.equals(MEMO_PROGRAM_ID))
  if (!inx)
    throw new Error('No valid instruction found')
  if (inx.data.toString('utf8') !== nonce)
    throw new Error('Invalid nonce')
  if (!tx.verifySignatures())
    throw new Error('Invalid signature')
  return c.json({
    user: tx.signatures.at(0)?.publicKey.toBase58(),
  })
})

app.get('/create', zValidator(
  'query',
  SignCreateReqSchema,
  zValidatorHook,
), async (c) => {
  const {
    publicKeyStr,
    nonce,
  } = c.req.valid('query')
  const conn = new Connection(env<{ SOLANA_RPC_URL: string }>(c).SOLANA_RPC_URL || clusterApiUrl('mainnet-beta'))
  const publicKey = new PublicKey(publicKeyStr)
  const tx = new Transaction()

  tx.add(createMemoInstruction(nonce))
  const blockHash = await conn.getLatestBlockhash('finalized')
  tx.feePayer = publicKey
  tx.recentBlockhash = blockHash.blockhash
  tx.lastValidBlockHeight = blockHash.lastValidBlockHeight

  const serializedTx = tx.serialize({
    requireAllSignatures: false,
    verifySignatures: true,
  })

  const txBase64 = serializedTx.toString('base64')

  return c.json({
    tx: txBase64,
  })
})

export default app
