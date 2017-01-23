/**
 * Created by Administrator on 2016/11/3.
 */
var express = require('express');
var conn=require('../lib/conn');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var novelinfoid=parseInt(req.query.novelinfoid||0);
    conn.query('select * from novel_info where novelinfoid=?',
        [novelinfoid],
        function(err,novel){
            conn.query('select sectionid,sectionname from novel_section where novelinfoid=?',
                [novelinfoid],
                function(err,rows){
                    var data=novel[0];
                    data.title=novel[0].novelname;
                    data.sections=rows;
                    res.render('viewnovel',data);
                }
            );
        }
    );
});

module.exports = router;
