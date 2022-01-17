import * as fs from 'fs/promises'
import json from './archivesPageData.json'

export class ArchivesPage {

    title: string
    path: string
    updatedTime: number

    constructor(title: string,path: string,updatedTime: number){
        this.title = title
        this.path = path
        this.updatedTime = updatedTime
    }
}

export function sortPostsByDate () {
    let archivesData: ArchivesPage[] = JSON.parse(json)
    console.log('see archivesPageData:'+ archivesData)
    archivesData.sort((pre,next)=>{
        return next.updatedTime-pre.updatedTime
    })
    return archivesData
}



