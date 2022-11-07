import fs from 'fs'

/**
 * 移动文件
 * 1.获取目录下所有后缀为[suffix]的文件路径，得到[allFilePath]
 * 2.遍历[allFilePath],把[outPath]+[filePath]拼出输出路径。
 *  2.1.使用[fs.rename]方法，把旧的路径[filePath]替换成新的[outFillPath]路径
 *
 * @param {string} sourceDir 源文件夹
 * @param {string} outPath 输出的文件路径
 * @param {string[]} suffixList 需要【移动文件】的后缀
 */
const moveFiles = async (sourceDir: string, outPath: string, suffixList: string[]) => {
    /**
     *获取文件后缀
     * @param file 文件名
     * @returns 文件后缀
     */
    const getFileSuffix = (fileName: string) => fileName.split('.').pop()?.toLowerCase() || ''

    /**
     * 获取路径中的文件名
     * @param  filePath 路径
     * @returns  文件名
     */
    const getFileNameByPath = (filePath: string) =>
        filePath.substring(filePath.lastIndexOf('/') + 1)

    /**
     *获取目录下的所有文件
     * @param {string} dir 文件目录地址
     * @param {string[]} _suffixList 文件的后缀
     * @param {string[]} _storage 缓存
     * @return {string[]} 缓存
     */
    const getAllFilePath = (dir: string, _suffixList: string[], _storage: string[] = []) => {
        const files: string[] = fs.readdirSync(dir)

        files.forEach((file) => {
            const _filePath = `${dir}/${file}`
            const _fileStat = fs.statSync(_filePath)

            // 遍历到目录继续递归。
            if (_fileStat.isDirectory()) {
                getAllFilePath(_filePath, _suffixList, _storage)
            }

            // 遍历到文件，判断是否需要push。
            if (_fileStat.isFile()) {
                const isTargetFile = _suffixList.some(
                    (_suffix) => _suffix === getFileSuffix(_filePath)
                )
                isTargetFile && _storage.push(_filePath)
            }
        })

        return _storage
    }

    /** main */

    // 所有的文件路径
    const allFilePath = getAllFilePath(sourceDir, suffixList)
    console.log(allFilePath)

    allFilePath.forEach((filePath) => {
        const fileName = getFileNameByPath(filePath)
        const outFillPath = `${outPath}/${fileName}`

        fs.rename(filePath, outFillPath, (err) => {
            if (err) throw err
            fs.stat(outPath, function (err, stats) {
                if (err) throw err
                console.log('stats: ' + JSON.stringify(stats))
            })
        })
    })
}

export default moveFiles
