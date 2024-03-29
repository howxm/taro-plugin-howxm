const fs = require('fs-extra')
const path = require('path')

import { logPrefix } from './constant'

export default function writeHowxm(file, srcPath, outputPath, options) {
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
			const wxmlFile = path.join(outputPath, relativeDir, path.basename(file, path.extname(file)) + '.wxml')
			
			// 使用正则表达式匹配并提取信息
			const regex = /<howxm-widget\s+path="([^"]*)"\s*\/>/g
			let matches
			let result = ''
			
			while ((matches = regex.exec(data)) !== null) {
				const pathValue = matches[1]
				let widgetTag = `\n<howxm-widget path="${pathValue}"`
				
				if (pathValue && options.appId) {
					widgetTag += ` appId="${options.appId}"`;
				}
				
				widgetTag += ' />\n'
				result += widgetTag
			}
			
			// 读取原 *.wxml 文件内容
			fs.readFile(wxmlFile, 'utf8', (err, wxmlData) => {
				if (err) {
					console.error(`${logPrefix}Error while reading file ${wxmlFile}:`, err)
					return
				}
				
				// 在原文件内容末尾添加 <howxm-widget />
				const updatedWxmlData = wxmlData + result
				
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
}
