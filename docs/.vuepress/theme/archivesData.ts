export class ArchivesPage {

    title: string
    path: string
    updatedTime: number

    constructor(title: string, path: string, updatedTime: number) {
        this.title = title
        this.path = path
        this.updatedTime = updatedTime
    }
}