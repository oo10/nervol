/**
 * Created by Administrator on 2016/10/29.
 */
/**
 * Created by Administrator on 2016/10/27.
 */
var express = require('express');
var conn=require('../lib/conn');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    switch(req.query.ac){
        case 'search':
        {
            conn.query( //从数据库分页查找小说
                'select sectionid,sectionname from novel_section where novelinfoid=? order by sectionid desc limit ?,?',
                [
                    parseInt(req.query.novelinfoid),
                    (parseInt(req.query.page)-1)*parseInt(req.query.rows),
                    parseInt(req.query.rows)
                ], //根据page,rows计算分页参数
                function(err,results,fields){
                    //查询总数，方便前端datagrid组件进行分页
                    conn.query('select count(*) as total from novel_section where novelinfoid=?',
                        [
                            parseInt(req.query.novelinfoid)
                        ],
                        function(err1,results1){
                        //将两次查询的数据组合转成json输出给客户端
                        res.json({total:results1[0].total,rows:results});
                    });
                }
            );
        }
            break;
        case 'getSection':{
            //第一种情况，书架没有这本书

            //第二种情况，书架有，但是从没读过

            //第三种情况，书架有，并且读过了
        }
            break;
        case 'delete':{
            conn.query( //从数据库删除小说章节
                'delete from novel_section where sectionid=?',
                [parseInt(req.query.sectionid)],
                function(err,results,fields){
                    if(err){
                        res.json({error:true,msg:err.message});
                    }else{
                        res.json({error:false,msg:'删除小说章节成功'});
                    }
                }
            );
        }
            break;
        case 'get':{
            conn.query( //从数据库获取单个小说章节
                'select * from novel_section where sectionid=?',
                [parseInt(req.query.sectionid)],
                function(err,results,fields){
                    if(err){
                        res.json({error:true,msg:err.message});
                    }else{
                        res.json({error:false,rows:results});
                    }
                }
            );
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
        case 'saveadd':{
            try{
                conn.query('insert into novel_section(sectionname,sectioncontent,novelinfoid) values(?,?,?)',
                    [
                        req.body.sectionname,
                        req.body.sectioncontent,
                        parseInt(req.body.novelinfoid)
                    ],
                    function(err,results){
                        //更新小说表的最新章节以及最后更新时间
                        conn.query('update novel_info set lastsectionname=?,lastupdatetime=? where novelinfoid=?',
                            [
                                req.body.sectionname,
                                new Date(),
                                parseInt(req.body.novelinfoid)
                            ])
                        if(err){
                            res.json({error:true,msg:err.message});
                        }else{
                            res.json({error:false,msg:'添加小说章节成功'});
                        }
                    }
                )
            }catch(ex){
                res.json({error:true,msg:ex.message});
            }
        }
            break;
        case 'saveedit':
        {
            conn.query('update novel_section set sectionname=?,sectioncontent=? where sectionid=?',
                [
                    req.body.sectionname,
                    req.body.sectioncontent,
                    parseInt(req.body.sectionid)
                ],
                function(err,results){
                    if(err){
                        res.json({error:true,msg:err.message});
                    }else{
                        res.json({error:false,msg:'修改小说章节成功'});
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
