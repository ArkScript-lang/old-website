Rainbow.extend('kafe', [
    {name: 'keyword', pattern: /cls|fun|dyn|if|elif|then|end|ret|while|break|do|import/g},
    {name: 'string', pattern: /('|").*(\1)/gm},
    {name: 'constant.boolean', pattern: /true|false/g},
    {name: 'name.attribute', pattern: /self/g},
    {name: 'comment', pattern: /#[\s\S ]*?$/gm},
    {name: 'constant.numeric', pattern: /\b(\d+(\.\d+)?(e(\+|\-)?\d+)?(f|d)?|0x[\da-f]+)\b/gi},
    {name: 'keyword.operator', pattern: /\+|\!|\-&(gt|lt|amp);|\||\*|\=|\./g},
    {name: 'keyword.new', pattern: /new/g},
    {name: 'support.magic', pattern: /__.+__/g}
]);