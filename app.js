const express = require('express');

const app = express();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const ipfsClient = require('ipfs-http-client');
 const fs = require('fs');

app.use(bodyParser.urlencoded({extended:false}))
var ipfs = ipfsClient('localhost', '5001', { protocol: 'http' }) 
 
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(fileUpload())
app.post('/upload',(req,res,next)=>{


	 const file = req.files.file;
     const fileName  =file.name;
   const filePath = 'file/'+fileName;

     file.mv(filePath,async(err)=>{

               const hash =  await addFile(filePath);

               fs.unlink(filePath,(err)=>{
                       
                 return res.send(`<p>The link to your decentralized file</p></br><a href="https://ipfs.io/ipfs/${hash}">link</a>`)
               })
     	
       

     })

	})


  async function addFile(filePath){
           
     const filedata = fs.readFileSync(filePath);
    const result = await ipfs.add(filedata);
    return result[0].hash;  
  }

app.get('/',(req,res,next)=>{


	res.render('index');
})

app.listen(8000,()=>{

	console.log("8000.....");
})
