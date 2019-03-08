//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: '/images/icon/user-unlogin.png',
    userInfo: {},

    histroys:[],

    content : ""
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    getApp().login(()=>{
      console.log("登录成功")
      this.setData({
        logged: true,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        userInfo: app.globalData.userInfo
      })

      this.getHistroy();
    });
  },

  getHistroy : function(){
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('content').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          histroys : res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })

  },

  inputTodo: function (e) {
    this.setData({ content: e.detail.value });
  },

  addTodo: function (e) {
    if (!this.data.content || !this.data.content.trim()) return;
    var histroys = this.data.histroys;
    var that = this;

    var histroy = { content: that.data.content, imageURL: "/images/icon/user-unlogin.png", timestamp: new Date() }
    //数据库插入
    const db = wx.cloud.database()
    db.collection('content').add({
      data: {
        histroy : histroy
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id

        var temp = {histroy: histroy};
        histroys.push(temp);
        that.setData({
          content: '',
          histroys: histroys,

        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })


    

    /*getApp().request({
      url: '/todos',
      method: 'POST',
      data: {
        content: this.data.todo
      },
      success: function (res) {

        if (res.statusCode !== 200) {
          wx.showToast({
            icon: 'none',
            title: '请求出错'
          });
          return;
        }

        var todo = { id: res.data.id, content: that.data.todo, finished: false };
        todos.push(todo);
        that.setData({
          todo: '',
          todos: todos,
          leftCount: that.data.leftCount + 1
        });
        getApp().writeHistory(todo, 'create', +new Date());
      }
    });*/

  },


  /*onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },*/

})
