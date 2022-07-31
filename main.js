const pug = require('pug')
const fs = require('fs')

const viewsDir = `${__dirname}/views`
const options = {
    basedir: viewsDir,
    compileDebug: false,
}
const views = [
    'bytecode',
    'contributing',
    'documentation',
    'index',
    'projects',
//    'blog',
    'tutorials/building',
    'tutorials/language',
]

views.forEach((name) => {
    const html = pug.compileFile(`${viewsDir}/${name}.pug`, options)({})
    fs.writeFileSync(`${name}.html`, html)
})
