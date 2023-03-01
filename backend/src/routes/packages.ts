import { Router } from "express";
const router = Router()

router.get('/', function(req, res){
	console.log('package route hit')
	res.json({this: 'this'})
})

export { router as packagesRouter }