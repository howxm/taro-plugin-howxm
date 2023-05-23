const fs = require('fs-extra')
const path = require('path')

import { defaultOptions, logPrefix, pagesFolder } from './constant'
import findTargetFiles from './findTargetFiles'

export default (ctx, options = defaultOptions) => {

    ctx.onBuildFinish(() => {
        console.log(`${logPrefix}编译结束，开始处理howxm-widget引入! the options is ${JSON.stringify(options)}`)
        
        const srcPath = path.resolve(__dirname, `${ctx.paths.sourcePath}/${pagesFolder}`)
        const outputPath = path.resolve(__dirname, `${ctx.paths.outputPath}/${pagesFolder}`)

        findTargetFiles(srcPath, options, (file) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    console.error(`${logPrefix}Error while reading file ${file}:`, err)
                    return
                }

                if (data.includes('howxm-widget')) {
                    // 计算文件所在目录的相对路径
                    const relativeDir = path.relative(srcPath, path.dirname(file))
                    console.log(`${logPrefix}Found 'howxm-widget' in file: ${file}, relative directory: ${relativeDir}`)

                    // 构造 outputPath 下的相应 *.wxml 文件路径
                    const wxmlFile = path.join(outputPath, relativeDir, path.basename(file, `.${options.fileExtension}`) + '.wxml')

                    // 读取原 *.wxml 文件内容
                    fs.readFile(wxmlFile, 'utf8', (err, wxmlData) => {
                        if (err) {
                            console.error(`${logPrefix}Error while reading file ${wxmlFile}:`, err)
                            return
                        }

                        // 在原文件内容末尾添加 <howxm-widget />
                        const updatedWxmlData = wxmlData + '\n<howxm-widget />'

                        // 将更新后的内容写回 *.wxml 文件
                        fs.writeFile(wxmlFile, updatedWxmlData, (err) => {
                            if (err) {
                                console.error(`${logPrefix}Error while writing to file ${wxmlFile}:`, err)
                                return
                            }
                            console.log(`${logPrefix}Successfully wrote <howxm-widget /> to file: ${wxmlFile}`)
                        })
                    })
                }
            })
        })
    })
}
