/**
 * Created by Administrator on 2016/11/1.
 */
var mysql=require('mysql');
var conn={
    open:function(){
        var c=mysql.createConnection({ //此方法为创建连接
            host:'localhost', //服务器地址
            user:'root', //用户名
            password:'', //密码
            database:'novel' //数据库名
        });
        return c;
    },
    query:function(sql,values,callback){
        var con=this.open();
        con.connect();
        con.query(sql,values,callback);
        con.end();
    }
};

module.exports=conn;