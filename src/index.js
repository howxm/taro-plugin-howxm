const fs = require('fs-extra')
const path = require('path')

function findTsxFiles(dir, callback) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(`[howxm-widget]Error while reading directory ${dir}:`, err)
            return
        }

        files.forEach(file => {
            const filePath = path.join(dir, file)
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`[howxm-widget]Error while getting file stats for ${filePath}:`, err)
                    return
                }

                if (stats.isDirectory()) {
                    findTsxFiles(filePath, callback)
                } else if (stats.isFile() && path.extname(filePath) === '.tsx') {
                    callback(filePath)
                }
            })
        })
    })
}


export default (ctx, options) => {

    ctx.onBuildFinish(() => {
        console.log('[howxm-widget]编译结束，开始处理howxm-widget引入')

        const srcPath = path.resolve(__dirname, '../src/pages')
        const outputPath = path.resolve(__dirname, '../dist/pages')

        findTsxFiles(srcPath, (file) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error while reading file ${file}:`, err)
                    return
                }

                if (data.includes('howxm-widget')) {
                    // 计算文件所在目录的相对路径
                    const relativeDir = path.relative(srcPath, path.dirname(file))
                    console.log(`[howxm-widget]Found 'howxm-widget' in file: ${file}, relative directory: ${relativeDir}`)

                    // 构造 outputPath 下的相应 *.wxml 文件路径
                    const wxmlFile = path.join(outputPath, relativeDir, path.basename(file, '.tsx') + '.wxml')

                    // 读取原 *.wxml 文件内容
                    fs.readFile(wxmlFile, 'utf8', (err, wxmlData) => {
                        if (err) {
                            console.error(`[howxm-widget]Error while reading file ${wxmlFile}:`, err)
                            return
                        }

                        // 在原文件内容末尾添加 <howxm-widget />
                        const updatedWxmlData = wxmlData + '\n<howxm-widget />'

                        // 将更新后的内容写回 *.wxml 文件
                        fs.writeFile(wxmlFile, updatedWxmlData, (err) => {
                            if (err) {
                                console.error(`[howxm-widget]Error while writing to file ${wxmlFile}:`, err)
                                return
                            }
                            console.log(`[howxm-widget]Successfully wrote <howxm-widget /> to file: ${wxmlFile}`)
                        })
                    })
                }
            })
        })
    })
}
