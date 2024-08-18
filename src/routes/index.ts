import express from 'express'
import AuthRouter from '../modules/auth/auth.router'
import AccountRouter from '../modules/accounts/accounts.router'
import TransactionRouter from '../modules/transactions/transactions.router'

const router = express.Router()

router.use('/auth', AuthRouter)
router.use('/accounts', AccountRouter)
router.use('/transactions', TransactionRouter)

export default router
