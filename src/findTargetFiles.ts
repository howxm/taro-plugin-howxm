const path = require('path')
const fs = require('fs-extra')

import { logPrefix } from './constant'

export default function findTargetFiles(dir, options, callback) {
	
	fs.readdir(dir, (err, files) => {
		if (err) {
			console.error(`${logPrefix}Error while reading directory ${dir}:`, err)
			return
		}
		
		files.forEach(file => {
			const filePath = path.join(dir, file)
			fs.stat(filePath, (err, stats) => {
				if (err) {
					console.error(`${logPrefix}Error while getting file stats for ${filePath}:`, err)
					return
				}
				
				const fileExtensions = options?.fileExtensions ? options.fileExtensions : ['.tsx', '.jsx']
				
				if (stats.isDirectory()) {
					findTargetFiles(filePath, options, callback)
				} else if (stats.isFile() && fileExtensions.includes(path.extname(filePath))) {
					callback(filePath)
				}
			})
		})
	})
}
