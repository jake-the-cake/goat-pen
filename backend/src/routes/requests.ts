import express from 'express'

const router = express.Router()

router.post('/new-feature', function(req, res){
  console.log(req.body)
  res.json({status: 'ok'})
})

export { router as requestsRouter }