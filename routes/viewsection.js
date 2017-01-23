/**
 * Created by Administrator on 2016/11/2.
 */
var express = require('express');
var conn=require('../lib/conn');
var pachong=require('../lib/pachong');
var router = express.Router();


var data={
    sectionid:0, //小说ID
    novelinfoid:0,
    status:0,
    title:'小说章节名称',
    sectioncontent:'小说章节内容',
    preSectionId:0, //上一章ID
    nextSectionId:0 //下一章ID
};
//var con=conn.open();
//判断是否有novelinfoid，如果有，则查询该章内容，如果没有，则跳转
var checkPage=function(req,res){
    var novelinfoid=parseInt(req.query.novelinfoid||'-1');
    var userid=parseInt(req.cookies.userid||'-1');
    if(novelinfoid>0){ //如果小说ID在，说明是要读第一章，那么自动从数据库获取第一章的ID，跳转
        var toFirstSection=true; //是否需要从第一章开看起
        conn.query('select * from novel_bookstore where userid=? and novelinfoid=?',
            [userid,novelinfoid],
            function(err,results){
                if(results.length>0){ //如果书架有这本书，则从书架读取数据
                    if(results[0].lastreadsectionid>0){//如果之前看过了这本书，根据记录从上次看过的章节开始读
                        res.json({sectionId:results[0].lastreadsectionid});
                        //res.redirect('/viewsection?sectionid='+results[0].lastreadsectionid);
                        toFirstSection=false;
                    }
                }
                if(toFirstSection){
                    conn.query('select * from novel_section where novelinfoid=? order by sectionid asc limit 0,1',
                        [novelinfoid],
                        function(err,results){
                            res.json({sectionId:results[0].sectionid});
                            //res.redirect('/viewsection?sectionid='+results[0].sectionid);
                        }
                    );
                }
            }
        );


    }else{
        queryNovel(req,res);
    }
};

//则查询该章内容
var queryNovel=function(req,res){
    var sectionid=parseInt(req.query.sectionid);
    var userid=parseInt(req.cookies.userid||'-1');

    conn.query('select * from novel_section where sectionid=?',
        [sectionid],
        function(err,results){
            if(results.length>0){
                console.log('1');
                data=results[0];
                data.preSectionId=0;
                data.nextSectionId=0;
                data.title=results[0].sectionname;
                queryPre(req,res);
                updateBookStore(userid,results[0].novelinfoid,sectionid);
            }else{
                res.send('该章节不存在');
            }
        }
    );
};


var updateBookStore=function(userid,novelinfoid,sectionid){
    conn.query('update novel_bookstore set lastreadtime=?,lastreadsectionid=? where userid=? and novelinfoid=?',
        [
            new Date(),
            sectionid,
            userid,
            novelinfoid
        ]
    );
}
//查上一章
var queryPre=function(req,res){
    conn.query('select sectionid from novel_section where novelinfoid=? and sectionid<? order by sectionid desc limit 0,1',
        [
            data.novelinfoid,
            data.sectionid
        ],
        function(err,results){
            console.log('2');
            if(results.length>0)
                data.preSectionId=results[0].sectionid;
            queryNext(req,res);
        }
    );
}

//查询下一章ID
var queryNext=function(req,res){
    conn.query('select sectionid,status from novel_section where novelinfoid=? and sectionid>? order by sectionid asc limit 0,1',
        [
            data.novelinfoid,
            data.sectionid
        ],
        function(err,results){
            console.log('3');
            if(results.length>0){
                data.nextSectionId=results[0].sectionid;
                data.nextSectionStatus=results[0].status;
                //如果下一章状态是0，直接后台静默爬内容
                if(data.nextSectionStatus==0)
                    paNext();
            }
            //判断小说是否爬过，继续处理
            isPa(req,res);
        }
    );
};

//判断是否爬过
var isPa=function(req,res){
    console.log('4');
    if(data.status==0){
        pa(req,res);
    }else{
        res.json(data);
        //res.render('viewsection', data);
    }
};

//爬
var pa=function(req,res){
    pachong.getSection(data.sectionid,function(err){
        console.log(5);
        if(typeof err!='string'){
            res.send('超时，请刷新页面。');
        }else{
            data.sectioncontent=err;
            res.json(data);
            //res.render('viewsection',data);
        }
    });
};

//自动爬下一章
var paNext=function(){
    pachong.getSection(data.nextSectionId,function(err){
        console.log(6);
    });
};


/* GET users listing. */
router.get('/', function(req, res, next){
    checkPage(req,res);
});

module.exports = router;