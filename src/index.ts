const path = require('path')

import { logPrefix, defaultPageFolders } from './constant'
import findTargetFiles from './findTargetFiles'
import writeHowxm from "./writeHowxm";

export default (ctx, options) => {
    
    ctx.onBuildFinish(() => {
        console.log(`${logPrefix}编译结束，开始处理howxm-widget引入! the options is ${JSON.stringify(options)}`)
        const pagesFolders = options?.pageFolders ?? defaultPageFolders
        
        pagesFolders.forEach(pageFolder => {
            const srcPath = path.resolve(__dirname, `${ctx.paths.sourcePath}/${pageFolder}`)
            const outputPath = path.resolve(__dirname, `${ctx.paths.outputPath}/${pageFolder}`)
            
            findTargetFiles(srcPath, options, (file) => {
                writeHowxm(file, srcPath, outputPath, options)
            })
        })
    })
}
