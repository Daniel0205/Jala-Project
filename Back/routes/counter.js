const express = require("express");
const router = express.Router();


router.get('/', (req, res) => {
    res.send("Server is up and runing!")
});


router.post('/count', (req, res) => {

    if(req.body.lyrics===""){
        return res.json({words:0,lines:0})
    }
    else{
        var lines =  req.body.lyrics
        lines = lines.split(/\r\n|\r|\n/).length
    
        var words =  req.body.lyrics
        words  = words.split(' ').length;
        
        return res.json({words:words,lines:lines})
    }
    
});

module.exports = router;
