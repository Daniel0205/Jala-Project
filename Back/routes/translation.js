const express = require("express");
const router = express.Router();
const axios = require('axios');


const headers = {
    'Content-Type': 'application/json',
    'Authorization': process.env.NODE_ENV_AUTH,
}
 

router.post('/translate', (req, res) => {

    if(req.body.lyrics!==""){
        axios.post('https://api-b2b.backenster.com/b1/api/v3/translate',{
            from: "en_GB",
            to: "es_CO",
            data: req.body.lyrics,
            platform: "api"
        },{
            headers: headers
        })
        .then(result => {
            
            return res.json({spanishLyrics:result.data.targetTransliteration})
        })
        .catch((error) => {
            return res.json({spanishLyrics:"error"})
        })
    }
    else{
        return res.json({spanishLyrics:""})
    }
    

});

module.exports = router;
