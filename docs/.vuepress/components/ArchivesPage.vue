<template>
  <div class="custom-page">
    <div>
      <ul>
        <template v-for="(item, index) in postsList" :key="index">
          <li
            class="year"
            v-if="(year = getYear(index)) !== getYear(index - 1)"
            :key="index + archives.sortPostsByDate().length"
          >
            <h2>{{ year }}</h2>
          </li>
          <li>
            <router-link :to="item.path">
              <span>{{ getDate(item) }}</span>
              {{ item.title }}
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import debounce from 'lodash.debounce'
import * as archives from '../theme/archivesData'

export default defineComponent({
  data () {
    return {
      postsList: [],
      
      perPage: 80, // 每页长
      currentPage: 1// 当前页
    }
  },
  created () {
    console.log("created: "+JSON.stringify(this.$site))
    this.getPageData()
  },
  mounted () {

    window.addEventListener('scroll', debounce(() => {
      if (this.postsList.length < archives.sortPostsByDate().length) {
        const docEl = document.documentElement
        const docBody = document.body
        const scrollTop = docEl.scrollTop || docBody.scrollTop;
        const clientHeight = docEl.clientHeight || docBody.clientHeight;
        const scrollHeight = docEl.scrollHeight || docBody.scrollHeight;

        if (scrollHeight > clientHeight && scrollTop + clientHeight >= scrollHeight - 250) {
          this.loadmore()
        }
      }

    }, 200))
  },
  methods: {
    getPageData () {
      // const currentPage = this.currentPage
      // const perPage = this.perPage
      this.postsList = this.postsList.concat(archives.sortPostsByDate())
      console.log("see postsList: "+JSON.stringify(this.postsList))
    },
    loadmore () {
      this.currentPage = this.currentPage + 1
      this.getPageData()
    },
    getYear (index) {
      const item = this.postsList[index]
      if (!item) {
        return
      }
      const { updatedTime } = item
      let date = new Date(updatedTime)
      return date.getUTCFullYear()
    },
    getDate (item) {
      const { updatedTime } = item
      let date = new Date(updatedTime)
      return (date.getMonth() +1)+'-'+(date.getDate())
    }
  }
})
</script>

<style lang='stylus'>
@require '../styles/wrapper.styl'

.archives-page
  .theme-vdoing-wrapper
    @extend $vdoing-wrapper
    position relative
    @media (min-width $contentWidth + 80)
      margin-top 1.5rem !important
    ul, li
      margin 0
      padding 0
    li
      list-style none
      &.year
        position sticky
        top $navbarHeight
        background var(--mainBg)
        z-index 1
      &.year:not(:first-child)
        margin-top 3.5rem
      h2
        margin-bottom 0.8rem
        font-weight 400
        padding 0.5rem 0
      a
        display block
        color var(--textColor)
        transition padding 0.3s
        padding 0.5rem 2rem
        line-height 1.2rem
        &:hover
          padding-left 2.5rem
          color $accentColor
          background #f9f9f9
        @media (max-width $contentWidth + 80)
          padding 0.5rem 1rem
          font-weight normal
          &:hover
            padding-left 1.5rem
        span
          opacity 0.6
          font-size 0.85rem
          font-weight 400
          margin-right 0.3rem
    .loadmore
      text-align center
      margin-top 1rem
      opacity 0.5
.theme-mode-dark .archives-page .theme-vdoing-wrapper li a:hover, .theme-mode-read .archives-page .theme-vdoing-wrapper li a:hover
  background var(--customBlockBg)
.hide-navbar
  .archives-page
    .theme-vdoing-wrapper
      li.year
        top 0
</style>
