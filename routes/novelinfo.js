/**
 * Created by Administrator on 2016/10/27.
 */
var express = require('express');
var conn=require('../lib/conn');
var pachong=require('../lib/pachong');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    switch(req.query.ac){
        case 'search':
        {
            conn.query( //从数据库分页查找小说
                'select * from novel_info where novelname like ? order by novelinfoid desc limit ?,?',
                [
                    '%'+(req.query.novelname||'')+'%',
                    (parseInt(req.query.page)-1)*parseInt(req.query.rows),
                    parseInt(req.query.rows)
                ], //根据page,rows计算分页参数
                function(err,results,fields){
                    //查询总数，方便前端datagrid组件进行分页
                    conn.query('select count(*) as total from novel_info',function(err1,results1){
                        //将两次查询的数据组合转成json输出给客户端
                        res.json({total:results1[0].total,rows:results});
                    });
                }
            );
        }
            break;
        case 'delete':{
            conn.query( //从数据库删除小说
                'delete from novel_info where novelinfoid=?',
                [parseInt(req.query.novelinfoid)], //根据page,rows计算分页参数
                function(err,results,fields){
                    if(err){
                        res.json({error:true,msg:err.message});
                    }else{
                        res.json({error:false,msg:'删除小说成功'});
                    }
                }
            );
        }
            break;
        case "paNovel":{
            console.log(req.query.novelinfoid);
            pachong.getNovel(req.query.novelinfoid,function(err){
                if(err)
                    res.json({error:true,msg:err.message});
                else
                    res.json({error:false,msg:'爬取小说成功'});
            });
        }
            break;
        default :
        {
            res.json({error:true,msg:'服务器没有这个请求'})
        }
            break;
    };
});

router.post('/', function(req, res, next){
    switch(req.query.ac){
        case 'saveadd':
        {
//            if(!(req.cookies.isLogin||false)){
//                res.json({error:true,msg:'您的登录已经超时，请重新登录！'});
//                break;
//            }
            conn.query('insert into novel_info(novelname,description,imgurl,author,lastsectionname,lastupdatetime,sourceurl,categoryname) values(?,?,?,?,?,?,?,?)',
                [
                    req.body.novelname,
                    req.body.description,
                    req.body.imgurl,
                    req.body.author,
                    req.body.lastsectionname,
                    new Date(),
                    req.body.sourceurl,
                    req.body.categoryname
                ],
                function(err,results){
                    if(err){
                        res.json({error:true,msg:err.message});
                    }else{
                        res.json({error:false,msg:'保存小说添加成功'});
                    }
                }
            )
        }
            break;
        case 'saveedit':
        {
            conn.query('update novel_info set novelname=?,description=?,imgurl=?,author=?,lastsectionname=?,lastupdatetime=?,sourceurl=?,categoryname=? where novelinfoid=?',
                [
                    req.body.novelname,
                    req.body.description,
                    req.body.imgurl,
                    req.body.author,
                    req.body.lastsectionname,
                    new Date(),
                    req.body.sourceurl,
                    req.body.categoryname,
                    parseInt(req.body.novelinfoid)
                ],
                function(err,results){
                    if(err){
                        res.json({error:true,msg:err.message});
                    }else{
                        res.json({error:false,msg:'保存小说修改成功'});
                    }
                }
            )
        }
            break;
        default :
        {
            res.json({error:true,msg:'服务器没有这个请求'})
        }
            break;
    }
});

module.exports = router;
