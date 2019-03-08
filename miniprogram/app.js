//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
    wx.showLoading({
      title: '登录中',
    })
  },

 cloudLogin:function(cb){
   var that = this;
   // 调用云函数
   wx.cloud.callFunction({
     name: 'login',
     data: {},
     success: res => {
       console.log('[云函数] [login] user openid: ', res.result.openid)
       that.globalData._openid = res.result.openid
       //wx.navigateTo({
       //  url: '../userConsole/userConsole',
       //})
       wx.hideLoading()
       cb(true);
     },
     fail: err => {
       console.error('[云函数] [login] 调用失败', err)
       //wx.navigateTo({
       //  url: '../deployFunctions/deployFunctions',
       //})
       wx.hideLoading()
       cb(false);
     }
   })
 },

 login:function( cb){
   console.log('login');
   if(this.globalData.islogged){
     cb();
     return;
   }
   var that = this;
   this.cloudLogin((res)=>{
     if(res){
       const db = wx.cloud.database();
       db.collection('user').where({
         _openid: that.globalData._openid
       }).get({
         success: res=>{
           if (res.data.length > 0) {
             
             that.globalData.userInfo = res.data[0].userInfo;
             that.islogged = true;
             console.log(that.globalData.userInfo);
             cb();
           }
           else {
             wx.getUserInfo({
               success:res=>{
                 that.globalData.userInfo = res.userInfo;
                 console.log(that.globalData);
                 db.collection('user').add({
                   data: {
                     _openid: that.globalData.openid,
                     userInfo: that.globalData.userInfo
                   },
                   success: res => {
                     that.islogged = true;
                     cb();
                     //wx.showToast({
                     //  title: '新增记录成功',
                     //})
                   },
                   fail: err => {
                     wx.showToast({
                       icon: 'none',
                       title: '新增记录失败'
                     })
                     console.log('[数据库] [新增记录] 失败：', err)
                   }
                 })
                 
               }
             })
             
             //
           }
         },
         fail: err=>{
           console.log('[数据库] [查询记录] 成功: meiyou shuju ', res)
         },

       });

     }

   });
  
 },

 globalData:{
   islogged:false,


 }
})
