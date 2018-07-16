const express = require('express');
const app = express();
app.set('port', process.env.PORT || 3000);//port initialization
var jwt = require('jsonwebtoken');



app.get('/', (req, res) => {
    res.json({ message: "get clicked" });
})

app.post('/',verifyTocken,authToken, (req, res) => {
    res.json({ message: "post clicked",authData:req.authData });
})

app.post('/login', (req, res) => {
    user = {
        id:'1',
        email: "admin@gmail.com",
        password: "123456"
    }
    jwt.sign({ user: user }, "secretkey",{expiresIn:'30s'}, function (err, token) {  //expiration time
        res.json({ token: token });
    });
})


//verify Tocken
function verifyTocken(req,res,next){
   const bearerHeader = req.headers["authorization"];// authorization = Bearer+<tocken>
    if(typeof bearerHeader != 'undefined'){
        const token=bearerHeader.split(' ')[1];
        req.token=token;
        next();
    }else{
        res.sendStatus(403);
    }
}

//authorization token data
function authToken(req,res,next){
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if (err) {
            res.sendStatus(403);
        }else{
            req.authData=authData;
            next();
        }
    })
}
app.listen(app.get('port'));
