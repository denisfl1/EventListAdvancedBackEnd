const express = require ("express")
const router = express.Router()
const bodyparser = require('body-parser')
const linkcontroller = require ('./linkcontroller')
const bodyParser = require("body-parser")
const authvalidation = require("./authvalidation")




router.get('/allList',authvalidation.auth,linkcontroller.allList)
router.get('/editId/:id',authvalidation.auth,linkcontroller.getEditId)
router.get('/getnamesandfills/:id',authvalidation.auth,linkcontroller.getNamesandFills)
router.get('/getnamesandfillstoedit/:id/:position',authvalidation.auth,linkcontroller.getNamesandFillstoEdit)
router.get('/getuser',authvalidation.auth,linkcontroller.addUser)
router.get('/getusertoedit/:id',authvalidation.adminverify,linkcontroller.getUser)
router.get('/getusertoedit',authvalidation.auth,linkcontroller.getUser1)
router.get('/getusers',authvalidation.adminverify,linkcontroller.getusers)
router.post('/register', bodyparser.json({extended:true}),linkcontroller.register)
router.post('/login', bodyparser.json({extended:true}),linkcontroller.login)
router.post('/newevent',authvalidation.adminverify,bodyparser.json({extended:true}),linkcontroller.event)
router.post('/addnameandfill',authvalidation.auth,bodyparser.json({extended:true}),linkcontroller.addNameandFill)
router.put('/editlist',authvalidation.adminverify,bodyParser.json({extended:true}),linkcontroller.editlist)
router.put('/editlockbutton',authvalidation.adminverify,bodyParser.json({extended:true}),linkcontroller.editlockbutton)
router.put('/delnamesandfills/:id',authvalidation.auth,bodyParser.json({extended:true}),linkcontroller.delNamesAndFills)
router.put('/updatenamesandfills',authvalidation.auth,bodyParser.json({extended:true}),linkcontroller.updateNamesAndFills)
router.put('/edituser',authvalidation.adminverify,bodyParser.json({extended:true}),linkcontroller.editUser)
router.put('/edituser1',authvalidation.auth,bodyParser.json({extended:true}),linkcontroller.editUser1)

router.delete('/delete/:id',authvalidation.adminverify,linkcontroller.deleteList)
router.delete('/delUsers/:array',authvalidation.adminverify,linkcontroller.delUsers)
router.get('/tokengen',authvalidation.adminverify,linkcontroller.generatetoken)





module.exports = router