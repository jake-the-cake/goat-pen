import express from 'express'

const router = express.Router()

router.post('/join', function(req, res){
  console.log(req.body)
  res.json({status: 'ok'})
})

export { router as requestsRouter }