import { ArchivesPage } from "../theme/archivesData"


export function sortPostsByDate(archivesData: ArchivesPage[]) {
    archivesData.sort((pre, next) => {
        return next.updatedTime - pre.updatedTime
    })
    return archivesData
}