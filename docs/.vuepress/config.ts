// import * as shiki from 'shiki'

import path from "path";

// const t = shiki.loadTheme('./my-theme.json')

module.exports = {
  // permalink: "/:year/:month/:day/:slug",
  head: [
    [
      'link', // 设置 favicon.ico，注意图片放在 public 文件夹下
      {
        rel: 'icon',
        href: '/img/logo.png'
      }
    ],
    ['link', {
      rel: 'manifest',
      href: '/manifest.json'
    }],
    ['script', {
      src: "https://www.googletagmanager.com/gtag/js?id=UA-286583-7",
      async: true
    }],
    ['script', {},
      " window.dataLayer = window.dataLayer || [];\
                function gtag(){dataLayer.push(arguments);}\
                gtag('js', new Date());\
                gtag('config', 'UA-286583-7');"
    ],

  ],
  title: 'stormbuf\'s blog',
  description: 'stormbuf 的博客',
  themeConfig: {
    logo: '',
    sidebar: 'auto',
    contributors: false,
    // 导航栏配置
    navbar: [{
      text: "home",
      link: "/"
    },
    {
      text: "program",
      children: [{
        text: "java",
        link: "/program/java/"
      },
      {
        text: "golang",
        link: "/program/golang/"
      },
      {
        text: "分布式",
        link: "/program/distributed/"
      }
      ]
    },
    {
      text: "database",
      link: "/db/"
    },
    {
      text: "timeline",
      link: "/archivesPage/"
    },
    {
      text: "friends",
      link: "/friends/"
    },
    {
      text: 'RSS',
      link: 'https://stormbuf.top/rss.xml',
      target: '_self',
      rel: '',
      icon: 'reco-rss'
    }
    ]
  },
  plugins: [
    ['@vuepress/back-to-top'], // 返回顶部
    ['@vuepress/nprogress'], // 加载进度条
    ['@vuepress/medium-zoom', true], // 图片缩放
    [
      '@vuepress/plugin-google-analytics',
      {
        id: 'G-Z9H790F79H',
      },
    ],
    [
      '@vuepress/plugin-search',
      {
        hotKeys: [],
        maxSuggestions: 10
      },
    ],
    [
      '@vuepress/plugin-shiki',
      {
        theme: 'github-dark'
      }
    ],
    [
      '@vuepress/register-components',
      {
        componentsDir: path.resolve(__dirname, './components'),
      },
    ],
    // ['@vssue/vuepress-plugin-vssue',
    //   {
    //     // 设置 `platform` 而不是 `api`
    //     platform: 'github',
    //     locale: 'zh',
    //     owner: "stormbuf", //对应 仓库 的拥有者帐号或者团队
    //     repo: "blog", // 用来存储评论的 仓库
    //     clientId: process.env.CLIENTID, // OAuth App 的 client id
    //     clientSecret: process.env.CLIENTSECRET, // OAuth App 的 client secret 
    //     autoCreateIssue: true //自动创建评论
    //   }
    // ],
    // [
    //   '@vuepress/last-updated',
    //   {
    //     dateOptions: {
    //       hour12: false
    //     },
    //     transformer: (timestamp, lang) => {
    //       // 不要忘了安装 moment
    //       const moment = require('moment')
    //       moment.locale(lang)
    //       return moment(timestamp).utcOffset(8).format('YYYY-MM-DD HH:mm')
    //     }
    //   }
    // ],
    ['@stormbuf/vuepress-plugin-rss',
      {
        websiteDomain: 'https://stormbuf.top',
        count: 60,
        content: false
      }
    ],
  ],
  repo: 'stormbuf/blog'
}