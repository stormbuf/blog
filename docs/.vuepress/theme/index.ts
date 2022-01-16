import type { ThemeObject, Page } from '@vuepress/core'
import { json } from 'stream/consumers';
import { archivesData, ArchivesPage } from './archivesData'
import { GitPluginPageData } from './types';
// import { path } from '@vuepress/utils'

var flag: boolean = true;

const localTheme: ThemeObject = {
    name: 'vuepress-theme-local',
    extends: '@vuepress/theme-default',

    extendsPage: (page: Page) => {
        var { git } = page.data as unknown as GitPluginPageData
        if (page == null || page == undefined) {
            return
        }
        if (page.path == "/404.html" || !page.path.match("/.*\.(html|htm)$")) {
            return
        }
        var data: ArchivesPage = new ArchivesPage(page.title, page.path, git.updatedTime)
        archivesData.push(data)
    },
    onPrepared: () => {
        console.log("see data: " + JSON.stringify(archivesData))

    }
}

export default localTheme