import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import CompositionRoot from './CompositionRoot'
import cookieParser from 'cookie-parser'


dotenv.config()
CompositionRoot.configure()

const PORT =3001

const app = express()
app.use('/public',express.static(path.join(__dirname, '../public')));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/auth', CompositionRoot.authRouter())
app.use('/user', CompositionRoot.userRouter())
app.use('/category',CompositionRoot.categoryRouter())


app.listen(PORT, () => console.log(`listening on port ${PORT}`))