///**
// * Created by Administrator on 2016/11/1.
// */
//var conn=require('../lib/conn');
//var http=require('../lib/httpHelper');
//var cheerio = require('cheerio');
//
//var pachong={
//  getNovel:function(novelinfoid,callback){
//      //打开连接
//      //var con=conn.open();
//      //查询小说源地址
//      var id=parseInt(novelinfoid);
//      conn.query('select sourceurl from novel_info where novelinfoid=?',
//          [id],
//          function(err,results){
//              if(err){
//                  callback(err);
//              }else{
//                  console.log('开始爬取小说');
//                  //从对方服务器爬取数据
//                  http.get(results[0].sourceurl,20000,function(err,data){
//                      console.log('小说爬取完毕');
//                      if(err)
//                          callback(err);
//                      else
//                      {
//                          //分析数据
//                          var $=cheerio.load(data);
//                          var novel={};
//                          novel.novelname=$('div#info h1').text();
//                          novel.author=$('div#info p').first().text().replace('作    者：','');
//                          novel.description=$('div#intro p').text();
//                          novel.imgurl=$('div#fmimg img').attr('src');
//                          var _a=$('div.con_top').text().split('>');
//                          if(_a.length>2)
//                              novel.categoryname=_a[1].trim();
//                          var sections=$('div#list a');
//                          novel.lastsectionname=sections.last().text();
//                          //写入数据库
//                          console.log('开始写入数据库');
//                          conn.query('update novel_info set novelname=?,author=?,description=?,imgurl=?,lastsectionname=?,categoryname=?,lastupdatetime=?,status=10 where novelinfoid=?',
//                          [
//                              novel.novelname,
//                              novel.author,
//                              novel.description,
//                              novel.imgurl,
//                              novel.lastsectionname,
//                              novel.categoryname,
//                              new Date(),
//                              id
//                          ],
//                          function(err,results){
//                              if(err)
//                                  callback(err);
//                              else//回调显示抓取小说成功
//                                  callback(false);
//                          });
//
//                          //异步循环写入小说章节信息
//                          sections.each(function(){
//                              //分析章节信息
//                              var section={};
//                              section.sourceurl=results[0].sourceurl+$(this).attr('href');
//                              section.sectionname=$(this).text();
//                              //判断章节是否存在
//                              conn.query('select count(*) as total from novel_section where sourceurl="'+section.sourceurl+'"',
//                              function(err,results2){
//                                  console.log('正在写入章节信息'+section.sourceurl);
//                                  if(!err&&results2[0].total<=0){
//                                      //写入章节信息到数据库
//                                      conn.query('insert into novel_section(sectionname,sourceurl,novelinfoid) values(?,?,?)',
//                                          [
//                                              section.sectionname,
//                                              section.sourceurl,
//                                              id
//                                          ],function(err,results){
//
//                                          });
//                                  }
//                              });
//
//                              //console.log($(this).attr('href'));
//
//                              //con.query()
//                          });
//                      }
//                  },'gbk','Mozilla/5.0 (Windows NT 10.0; rv:49.0) Gecko/20100101 Firefox/49.0')
//              }
//          }
//      );
//  },
//  getSection:function(sectionid,callback){
//      //var con=conn.open();
//      //查询小说源地址
//      var id=parseInt(sectionid);
//      conn.query('select sourceurl from novel_section where sectionid=?',
//          [id],
//          function(err,results){
//              if(err){
//                  callback(err);
//              }else{
//                  console.log('开始爬取小说章节内容');
//                  //从对方服务器爬取数据
//                  http.get(results[0].sourceurl,20000,function(err,data){
//                      console.log('小说章节内容爬取完毕');
//                      if(err)
//                          callback(err);
//                      else
//                      {
//                          //分析数据
//                          var $=cheerio.load(data,{decodeEntities: false});
//                          var section={};
//							
//                          section.sectioncontent=$('#content').html();
//							if(section.sectioncontent!=null)
//								section.sectioncontent=section.sectioncontent.replace('<script>readx();</script>','');
//                          //写入数据库
//                          //console.log(section.sectioncontent);
//                          console.log('开始将章节内容写入数据库');
//                          conn.query('update novel_section set sectioncontent=?,status=10 where sectionid=?',
//                              [
//                                  section.sectioncontent,
//                                  id
//                              ],
//                              function(err,results){
//                                  if(err)
//                                      callback(err);
//                                  else//回调显示抓取小说成功
//                                      callback(section.sectioncontent);
//                              }
//                          );
//                      }
//                  },'gbk','Mozilla/5.0 (Windows NT 10.0; rv:49.0) Gecko/20100101 Firefox/49.0')
//              }
//          }
//      );
//  }
//};
//
//module.exports = pachong;

/**
 * Created by lx on 2016/11/1.
 */
var con = require('../lib/conn');
var http = require('../lib/httpHelper');
var cheerio = require('cheerio');

var pachong={
    getNovel:function(novelinfoid,callback){
        var conn=con.open();
        conn.query('select sourceurl from novel_info where novelinfoid=?',
        [parseInt(novelinfoid)],function(err,result){
                if (err){
                    callback(err);
                }else{
                    http.get(result[0].sourceurl,50000,function(err,data){
                        if(err){
                            callback(err);
                        }else{
                            var $=cheerio.load(data);
                            var novel={};
                            novel.novelname=$('div#info h1').text();
                            novel.author=$('div#info p').first().text().split('：')[1];
                            novel.description=$('div#intro p').text();
                            novel.imgurl=$('div#fmimg img').attr('src');
                            novel.categoryname=$('div.con_top').text().split('>')[1].trim();
                            var sections=$('div#list a');
                            novel.lastsectionname=sections.last().text();
                            conn.query('update novel_info set novelname=? ,author=?,description=?,imgurl=?,lastsectionname=?,categoryname=?,lastupdatetime=?,status=10 where novelinfoid=?',
                            [
                                novel.novelname,
                                novel.author,
                                novel.description,
                                novel.imgurl,
                                novel.lastsectionname,
                                novel.categoryname,
                                new Date(),
                                parseInt(novelinfoid)
                            ],function(err,result){
                                    if (err){
                                        callback(err);
                                    }else{
                                        callback(false);
                                    }
                                });
                            sections.each(function() {
                                var section = {};
                                section.sourceurl = result[0].sourceurl + $(this).attr('href');
                                section.sectionname = $(this).text();
                                conn.query('select count(*) as total from novel_section where sourceurl="' + section.sourceurl + '"',
                                    function (err, results2) {
                                        console.log('正在加载章节' + section.sourceurl);
                                        if (results2[0].total <= 0) {
                                            conn.query('insert into novel_section(sectionname,sourceurl,novelinfoid) values(?,?,?)',
                                                [
                                                    section.sectionname,
                                                    section.sourceurl,
                                                    parseInt(novelinfoid)
                                                ], function (err, results) {

                                                });
                                        }
                                    });
                            });
                        }
                    },'gbk','Mozilla/5.0 (Windows NT 10.0; rv:49.0) Gecko/20100101 Firefox/49.0')
                }
            });
        //var err=true;
        //callback(err);
    },
    getSection:function(sectionid,callback){
        var conn=con.open();
        conn.query('select sourceurl from novel_section where sectionid=?',
            [parseInt(sectionid)],function(err,result){
                if (err){
                    callback(err);
                }else{
                    http.get(result[0].sourceurl,50000,function(err,data){
                        if(err){
                            callback(err);
                        }else{
                            var $=cheerio.load(data,{decodeEntities:false});
                            var sections1={};
                            sections1.content=$('div#content').html().replace('<script>readx();</script>','');
                            conn.query('update novel_section set status=10 , sectioncontent=? where sectionid=?',
                                [
                                    sections1.content,
                                    parseInt(sectionid)
                                ],function(err,result){
                                    if (err){
                                        callback(err);
                                    }else{
                                        callback(result.sectioncontent);
                                    }
                                });
                        }
                    },'gbk','Mozilla/5.0 (Windows NT 10.0; rv:49.0) Gecko/20100101 Firefox/49.0')
                }
            });
    }
};


module.exports=pachong;