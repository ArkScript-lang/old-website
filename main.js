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
    'benchmarks',
    // tutorials
    'tutorials/building',
    'tutorials/language',
    'tutorials/embedding',
    'tutorials/builtins',
    'tutorials/modules',
    // guidelines
    'guidelines/naming',
    'guidelines/modules_error_handling',
    'guidelines/coding',
    // implementation
    'implementation/architecture',
    'implementation/compiler',
    'implementation/vm',
]

views.forEach((name) => {
    const html = pug.compileFile(`${viewsDir}/${name}.pug`, options)({})
    fs.writeFileSync(`${name}.html`, html)
})

module.exports = {};
