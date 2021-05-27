const express=require('express')
const app=express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
//var jquery=require("jquery")
var db;
var s;

MongoClient.connect('mongodb://localhost:27017/FootWear',(err,database)=>{
    if(err) return console.log(err)
    db=database.db('FootWear')
    app.listen(5000,()=>{
        console.log("listening at port 5000")
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Home Page
app.get('/',(req,res)=>{
    db.collection('ladies').find().toArray((err,result)=>{
        if(err) return console.log(err);
        res.render('homepage.ejs',{data: result})
    })
})
//for rendering creating page
app.get('/create',(req,res)=>{
	res.render('add.ejs');
})


//for rendering update page
app.get('/updatestock',(req,res)=>{
	res.render('update.ejs');
})

//for rendering delete page
app.get('/deleteproduct',(req,res)=>{
	res.render('delete.ejs');
})

//for adding data to collection
app.post('/AddData',(req,res)=>{
	db.collection('ladies').save(req.body,(err,result)=>{
		if(err) return console.log(err)
		console.log('product added successfully')
		res.redirect('/')
	})
})

//for updating the stock
app.post('/update',(req,res)=>{
	db.collection('ladies').find().toArray((err, result)=> {
        	if(err) return console.log(err)
        for(var i=0; i<result.length; i++)
        {
            if(result[i].Product_Id==req.body.Product_Id)
            {
                s=result[i].Stock
                break;
            }
        }
        db.collection('ladies').findOneAndUpdate({Product_Id: req.body.Product_Id}, {
            $set: {Stock: parseInt(s) + parseInt(req.body.Stock)}} ,{sort: {Product_Id:-1}},(err, result)=> {
                if(err)
                    return res.send(err)
                console.log(req.body.Product_Id+' stock updated')
                res.redirect('/')
            })
        })
})

//for deleting the product
app.post('/delete',(req,res)=>{
	db.collection('ladies').findOneAndDelete({Product_Id:req.body.Product_Id},(err,result)=>{
		if(err) return console.log(err)
		res.redirect('/')
	})
})