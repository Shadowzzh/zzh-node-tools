import path from 'path'
import yargs from 'yargs'
import moveFiles from './moveFiles'

const sourcePath = path.resolve('../../目标目录')
const targetPath = path.resolve('../../测试')

const commandMap = {
    moveFiles: {
        options: (yargs: any) => {
            yargs
                .option('s', {
                    alias: 'sourceDir',
                    demandOption: true,
                    describe: '源文件夹',
                    type: 'string'
                })
                .option('o', {
                    alias: 'outPath',
                    demandOption: true,
                    describe: '输出的文件路径',
                    type: 'string'
                })
                .option('su', {
                    alias: 'suffixList',
                    demandOption: true,
                    describe: '需要【移动文件】的后缀',
                    type: 'array'
                })

            return yargs
        },
        handle: (argv: any) => {
            console.log(yargs.argv)
            const { commandName, sourceDir, suffixList, outPath } = argv
            console.log(commandName, sourceDir, suffixList, outPath)
        }
    }
}

yargs
    .command<{ name: keyof typeof commandMap }>(
        'nodeTools [commandName]',
        `使用工具，name：工具名。\n
        moveFiles`,
        async (yargs) => {
            const [_, commandName] = (await yargs.argv)._ as any
            commandMap[commandName as keyof typeof commandMap].options(yargs)
        },
        (argv) => {
            commandMap[argv.commandName as keyof typeof commandMap].handle(argv)
        }
    )
    .help().argv

// moveFiles(sourcePath, targetPath, ['jpg', 'arw'])
