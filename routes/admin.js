/**
 * Created by Administrator on 2016/10/26.
 */
var express = require('express');
var conn=require('../lib/conn');
var router = express.Router();

router.get('/', function (req, res) {
   res.send('好了');
});

router.post('/',function(req,res){
    switch(req.query.ac){
        case 'login':
        {
            conn.query(                              //loginid="admin" and loginpass="admin888";
                 'select * from novel_admin where loginid=? and loginpass=?',[req.body.username,req.body.password],
                 function(err,results,fields){
                     if(err) throw err;
                     if(results.length>0){
                         //登录成功
                         conn.query('update novel_admin set logintimes=logintimes+1,lastloginip=? where adminid=?',[req.ip,results[0].adminid],function(err,results){

                         });
                         res.cookie("isLogin", true, {maxAge: 600000});
                         res.json({error:false,msg:'登录成功'});
                     }else{
                         res.json({error:true,msg:'用户名密码错误'});
                     }
                 }
            );
        }
            break;
    }
    //conn.end();
    //res.json({error:true,msg:'服务器已经成功接收信息，但是还没有处理'});
});

module.exports = router;