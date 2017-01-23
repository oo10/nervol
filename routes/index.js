var express = require('express');
var conn=require('../lib/conn');
//引入mysql模块
//var mysql = require('mysql');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
//    http.get('http://www.qu.la',10000, function(err,data){
//        if(err){
//            res.send('请求超时，请刷新重试');
//        }else{
//            var $=cheerio.load(data);
//            var title=$('title').text();
//            res.send(title);
//        }
//    },'gbk','Mozilla/5.0 (Windows NT 10.0; rv:49.0) Gecko/20100101 Firefox/49.0');
  //回调函数中创建连接
//    var conn=mysql.createConnection({ //此方法为创建连接
//        host:'localhost', //服务器地址
//        user:'root', //用户名
//        password:'123456', //密码
//        database:'novel' //数据库名
//    });
//执行Sql语句
    //req Request对象
    //req.query.参数名
    //接收客户端通过get方式传递过来的参数
    //收到 {id:'11',name:'abc',time:'2014'}
//    conn.query(
//        'select * from novel_info where novelinfoid='+req.query.id,
//        function(err,results,fields){
//           if(err) throw err;
    //将文件下载而不是在浏览器打开
//    res.attachment('public/stylesheets/style.css');
//    res.sendfile('public/stylesheets/style.css');
            //res.send(JSON.stringify(results));
    //res.json({ user: 'tobi' });
    //将对象转成json字符串输出
              //从view渲染
    //var con=conn.open();
    var page=parseInt(req.query.page||1);
    var rows=4;
    var isNext=true;
    var searchTxt=req.query.searchTxt||'';
    conn.query('select count(*) as total from novel_info where novelname like ?',
        ['%'+searchTxt+'%'],
        function(err, results){
            if(results[0].total<=page*rows)
                isNext=false;
            conn.query('select * from novel_info where novelname like ? order by novelinfoid desc limit ?,?',
                [
                    '%'+searchTxt+'%',
                    (page-1)*rows,
                    rows
                ],
                function (err, results) {
                    res.render('index', {
                        page:page,
                        title: '梦想小说首页',
                        isNext:isNext,
                        rows:results
                    }); //将对应值联合ejs文件返回客户端
                }
            );
        }
    );


//    });
  //关闭连接
    //conn.close();

});

//通过Post接收参数
//req.body.参数名
//

//<form action='' method="post">
//<input name="username" value="abc" />
//</form>
router.post('/',function(req,res){

});

module.exports = router;
