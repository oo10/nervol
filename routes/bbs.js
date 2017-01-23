/**
 * Created by Administrator on 2016/11/16.
 */
/**
 * Created by Administrator on 2016/11/15.
 */
var express = require('express');
var conn=require('../lib/conn');
var router = express.Router();

router.get('/', function(req, res, next) {
    switch(req.query.ac){
        case 'search':{
            var novelinfoid=parseInt(req.query.novelinfoid||'-1');
            var page=parseInt(req.query.page||'1');
            var rows=parseInt(req.query.rows||'10');
            conn.query('select * from novel_bbs where novelinfoid =? order by lastreplytime desc limit ?,?',
                [
                    novelinfoid,
                    (page-1)*rows,
                    rows
                ],
                function(err,results){
                    conn.query('select count(*) as total from novel_bbs where novelinfoid=?',
                        [novelinfoid],
                        function(err1,results1){
                        //将两次查询的数据组合转成json输出给客户端
                        res.json({total:results1[0].total,rows:results});
                    });
                }
            );
        }
            break;
        default :{
            res.send('没有这个请求');
        }
            break;
    }
});

router.post('/', function(req, res, next) {
    switch(req.query.ac){
        case 'saveAdd':{
            var userid=parseInt(req.cookies.userid||'-1');
            var novelinfoid=parseInt(req.query.novelinfoid||'-1');
            var title=req.body.title||'默认标题';
            var content=req.body.content||'';
            conn.query('insert into novel_bbs(title,content,novelinfoid,userid,lastreplytime,addtime,status) values(?,?,?,?,?,?,?)',
                [
                    title,
                    content,
                    novelinfoid,
                    userid,
                    new Date(),
                    new Date(),
                    0
                ],
                function(err,results){
                    if(err){
                        res.json({error:true,msg:err.message});
                    }else{
                        res.json({error:false,msg:'发起帖子成功'});
                    }

                }
            );
        }
            break;
        default :{
            res.send('没有这个请求');
        }
            break;
    }
});

module.exports = router;
