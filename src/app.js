import express from 'express'
import cors from 'cors'
import treatmentListRouter from "./routes/treatmentList.routes.js"
import { getTreatmentLists } from './controllers/treatmentList.controller.js'

const app = express() 

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({origin:"*"}))

// main route
app.get('/',(req,res)=>{
    return res.status(200).send("<h2>Server is running....!</h2>")
})

// treatment list routes
app.use('/api/v1/treatments',treatmentListRouter)
app.use('/', getTreatmentLists)

export default app