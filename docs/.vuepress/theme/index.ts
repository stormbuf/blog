import type { ThemeObject, Page, App } from '@vuepress/core'
import { ArchivesPage } from './archivesData'
import { GitPluginPageData } from './types'

const archivesPageData: ArchivesPage[] = []

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
        archivesPageData.push(data)
    },
    onPrepared: (app: App) => {
        app.writeTemp('storeData.ts', `export const archivesPageData: any = ${JSON.stringify(archivesPageData)}`)
    }
}

export default localTheme