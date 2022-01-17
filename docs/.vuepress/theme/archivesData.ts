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

// const archivesData: ArchivesPage[]= []

export const archivesData = {
    data: ArchivesPage[] = []
}


export function sortPostsByDate () {
    console.log("see archivesData:"+JSON.stringify(archivesData))
    archivesData.sort((pre,next)=>{
        return next.updatedTime-pre.updatedTime
    })
    return archivesData
}



