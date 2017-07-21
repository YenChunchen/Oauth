var connectdb=require('../connectdb');
var crypto = require('crypto');   //加解密module
var getToken=require('./get_token');

exports.fbMemberUpdateOrCreate=function(accessToken,fbUser){
  // console.log('fbUser:',fbUser);
  return new Promise(function(resolve,reject){
    console.log('====',accessToken,fbUser);
    var selectStr='select * from member where account=?';
    connectdb.query(selectStr,[fbUser.id],function(err,rows){//判斷是否為會員(首次登入)
      if(err){
        reject(err);
        return;
      }
      // console.log(rows.length);
      if(rows.length===0){
        //新建會員  > 給token
        var insertStr='insert into member set ?';
        var newMember={
          account:(fbUser.id).toString(),
          pwd:(fbUser.id).toString(),
          nickName:fbUser.name,
          photo:fbUser.picture.data.url
        };
        connectdb.query(insertStr,[newMember],function(err,rows){  //新建會員
          if(err){
            reject(err);
            return;
          }else{  //給jwt token
            var temp={
              id:rows.insertId
            };
            var token=getToken.getToken(temp);
            console.log('token(初次登入)：',token.token);
            resolve(token);
          }
        });
      }else{
        //更新會員  > 給token
        var updateStr='update member set ? where id=?';
        var updateMember={
          account:(fbUser.id).toString(),
          pwd:(fbUser.id).toString(),
          nickName:fbUser.name,
          photo:fbUser.picture.data.url
        };
        var updateInfo=[updateMember,rows[0].id];
        connectdb.query(updateStr,updateInfo,function(err){  //更新會員
          if(err){
            reject(err);
            return;
          }else{  //給jwt token
            var temp={
              id:rows[0].id
            };
            var token=getToken.getToken(temp);
            console.log('token(已為會員):',token.token);
            resolve(token);
          }
        });
      }
    });
  });
};
