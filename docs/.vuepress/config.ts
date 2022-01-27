import path from "path";
import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  theme: path.resolve(__dirname, './theme'),
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
    ['script', {async: true},
      "var _hmt=_hmt||[];(function(){var hm=document.createElement(\"script\");hm.src=\"https://hm.baidu.com/hm.js?36884888f7a05e80a42de77a45873e51\";var s=document.getElementsByTagName(\"script\")[0];s.parentNode.insertBefore(hm,s)})();"
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
      },
      {
        text: "front-end",
        link: "/program/frontEnd/"
      },
      {
        text: "database",
        link: "/db/"
      }
      ]
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
      rel: ''
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
    ['@stormbuf/vuepress-plugin-rss',
      {
        websiteDomain: 'https://stormbuf.top',
        count: 60,
        content: false,
        generatePath: ['.*(html|htm)'],
        ignorePath: ['/404.html', '/404.htm','/HelloWorld.html']
      }
    ],
  ],
})