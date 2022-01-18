<template>
  <div class="custom-page">
    <div>
      <ul>
        <template v-for="(item, index) in postsList" :key="index">
          <li
            class="year"
            v-if="(year = getYear(index)) !== getYear(index - 1)"
            :key="index + postsLength"
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
import {sortPostsByDate} from '../util/archivesUtils'
import {archivesPageData} from '@temp/storeData'

export default defineComponent({
  data () {
    return {
      postsList: [],
      postsLength: 0,
      perPage: 80, // 每页长
      currentPage: 1// 当前页
    }
  },
  created () {
    this.getPageData()
  },
  mounted () {

    window.addEventListener('scroll', debounce(() => {
      if (this.postsList.length < sortPostsByDate(archivesPageData).length) {
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
      this.postsList = this.postsList.concat(sortPostsByDate(archivesPageData))
      this.postsLength = this.postsList.length
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