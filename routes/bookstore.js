/**
 * Created by Administrator on 2016/11/15.
 */
var express = require('express');
var conn=require('../lib/conn');
var router = express.Router();

router.get('/', function(req, res, next) {
    switch(req.query.ac){
        case 'search':{
            var userid=req.cookies.userid||'-1';
            conn.query('select novel_info.* from novel_bookstore left join novel_info on novel_bookstore.novelinfoid=novel_info.novelinfoid where novel_bookstore.userid=? order by novel_bookstore.lastreadtime desc',
                [parseInt(userid)],
                function(err,results){
                    res.json(results);
                }
            );
        }
            break;
        case 'add':{
            var userid=parseInt(req.cookies.userid||'-1');
            var novelinfoid=parseInt(req.query.novelinfoid||'-1');
            if(userid>0&&novelinfoid>0){
                conn.query('select * from novel_bookstore where userid=? and novelinfoid=?',
                    [
                        userid,
                        novelinfoid
                    ],
                    function(err,results){
                        if(results.length>0){
                            res.json({error:true,msg:'该书已经加入书架'});
                        }else{
                            conn.query('insert into novel_bookstore(userid,novelinfoid) values(?,?)',
                                [
                                    userid,
                                    novelinfoid
                                ],
                                function(err,results){
                                    res.json({error:false,msg:'加入书架成功'});
                                }
                            );
                        }
                    }
                );
            }else
            {
                res.json({error:true,msg:'非法数据'});
            }

        }
            break;
        case 'delete':{
            var userid=parseInt(req.cookies.userid||'-1');
            var novelinfoid=parseInt(req.query.novelinfoid||'-1');
            if(userid>0&&novelinfoid>0){
                conn.query('delete from novel_bookstore where userid=? and novelinfoid=?',
                    [
                        userid,
                        novelinfoid
                    ],
                    function(err,results){
                        res.json({error:false,msg:'移除书架成功'});
                    }
                );
            }else
            {
                res.json({error:true,msg:'非法数据'});
            }

        }
            break;
        default :{
            res.send('没有这个请求');
        }
            break;
    }
});

module.exports = router;
