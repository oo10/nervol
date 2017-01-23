var express = require('express');
var conn=require('../lib/conn');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    switch(req.query.ac){
        case "login":{
            conn.query('select * from novel_user where loginid=? and loginpass=?',
                [
                    req.body.loginid,
                    req.body.loginpass
                ],function(err,results){
                    if(err){
                        res.json({error:true,msg:err.message});
                    }else{
                        if(results.length>0){
                            res.cookie("userid", results[0].userid, {maxAge: 90000000000});
                            res.json({error:false,msg:'登录成功'});
                        }else
                        {
                            res.json({error:true,msg:'用户名密码错误'});
                        }

                    }

                }
            );
        }
            break;
        default :{
            res.send(req.query.ac+req.body.loginid+req.body.loginpass);
        }
            break;
    }
});

router.get('/', function(req, res, next) {
    switch(req.query.ac){

        default :{
            res.send('没有这个请求');
        }
            break;
    }
});

module.exports = router;
