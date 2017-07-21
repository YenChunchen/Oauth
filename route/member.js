var express = require('express');
var router = express.Router();

var FBMember=require('../controller/facebook_member.js');  //初版暫無,由前端提供資訊
router.get('/facebook/authandlogin',FBMember.fbAuth);  //scope設定存取權限範圍,初版暫無,由前端提供資訊
router.get('/auth/facebook/callback',FBMember.fbAuthCallback); //初版暫無,由前端提供資訊
router.get('/',FBMember.fbSuccessDirection); //初版暫無,由前端提供資訊
router.get('/loginFail',FBMember.fbFailureDirection);  //初版暫無,由前端提供資訊


module.exports = router;
