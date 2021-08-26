module.exports = {
    head: [
        [
            'link', // 设置 favicon.ico，注意图片放在 public 文件夹下
            { rel: 'icon', href: '/img/logo.png' }
        ],
        ['link', { rel: 'manifest', href: '/manifest.json' }]
    ],
    title: 'stormbuf\'s blog',
    description: 'stormbuf 的博客',
    themeConfig: {
      logo: '',
      sidebar: 'auto',
      // 导航栏配置
      nav: [{text: "主页", link: "/"      },
      { text: "java", link: "/java/" },
      { text: "数据库", link: "/db/"   }
      ], 
    },
    plugins: [
        ['@vuepress/back-to-top'], // 返回顶部
        ['@vuepress/nprogress'], // 加载进度条
        ['@vuepress/medium-zoom'],// 图片缩放
        ['@vuepress/blog',
          {
            sitemap: {
              hostname: 'http://stormbuf.top'
            },
          },
        ],
        ['@vssue/vuepress-plugin-vssue',
          {
            // 设置 `platform` 而不是 `api`
            platform: 'github',
            locale: 'zh',
            owner: "stormbuf",//对应 仓库 的拥有者帐号或者团队
            repo: "blog", // 用来存储评论的 仓库
            clientId: process.env.CLIENTID,  // OAuth App 的 client id
            clientSecret: process.env.CLIENTSECRET,  // OAuth App 的 client secret 
            autoCreateIssue: true//自动创建评论
          }
        ],
        [
          '@vuepress/pwa',
          {
            serviceWorker: true,
            updatePopup: true,
          },
        ],
        [
          '@vuepress/last-updated',
          {
            dateOptions:{
              hour12: false
            }
          }
        ]
      ],
      feed: {
        canonical_base: 'http://stormbuf.top/',
      },
      repo: 'stormbuf/blog'
  }
