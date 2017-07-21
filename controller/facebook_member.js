var facebook_client_id='[fb oauth app clientId]';
var facebook_secret_id='[fb oauth app password]';
// var facebook_oauth_url='https://127.0.0.1:8000/';
var facebookback_url="http://127.0.0.1:8000/member/auth/facebook/callback";
// var facebook_console_id='3194e46efasa90ecc4eb390e825a93176';
var express=require('express');
var passport=require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var router=express.Router();
var fbMemberUpdateOrCreate=require('../model/member/fb_member_identify');

passport.use(new FacebookStrategy({
    clientID: facebook_client_id,
    clientSecret: facebook_secret_id,
    callbackURL: facebookback_url,//facebook_oauth_url,
    profileFields: ['id', 'displayName', 'photos', 'link','email']  //設定欲取得欄位
  },
  //4.FB認證,認證成功取得accesstoken及FB用戶資訊
/*讀取DB資料和profile比對
  判斷是否已為會員(初次登入),是：檢查是否需更新資料(是：更新,回覆jwt token;否：回覆jwt token)
                         否：新建會員,並回覆jwt token   */
  function(accessToken, refreshToken, profile, cb) {
    //user find or create
    console.log(profile._json);
    fbMemberUpdateOrCreate.fbMemberUpdateOrCreate(accessToken,profile._json).then(function(result){
      return cb(null,result);
    }).catch(function(err){
      return cb(null,err);
    });
  }
));

passport.serializeUser(function(user, cb) {
//將資料存入Session(放入req.session.passport.user，express.session()中間件會處理session存放)
  cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
//存Session取出資料並放入req.user中
  cb(null, obj);
});


//1.導向FB,進行FB認證,設定scope(權限)(才能使用FacebookStrategy.profileFields欄位)
exports.fbAuth=passport.authenticate('facebook',{ authType: 'rerequest', scope: ['user_friends','email'] });

//2.FB認證,判斷認證成功,認證失敗,導向對應位置
exports.fbAuthCallback=passport.authenticate('facebook',{    successRedirect:'/member/',
failureRedirect: '/member/loginFail'
});

//3.FB認證,認證成功執行(導向表演列回jwt token)
exports.fbSuccessDirection=function(req,res,err){
  res.header({"x-access-token": req.session.passport.user.token});  //回header
  res.json({message:'登入(註冊)成功'});
};

//3.FB認證,認證失敗執行
exports.fbFailureDirection=function(req,res){
  res.status(400).json({message:'請登入facebook'});
};
