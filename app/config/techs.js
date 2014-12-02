var byIndent = '\n\t\t\t';

module.exports = {
    enb: {
        'bemjson.js': '[enbBemTechs.bemjsonToBemdecl]',

        less: [
            '// css',
            '[require(\'enb/techs/css-less\')]'
        ].join(byIndent),

        'less+autoprefixer': [
            '// css',
            '[require(\'enb/techs/css-less\'), { target: \'?.noprefix.css\' }]'
        ].join(byIndent),

        stylus: [
            '// css',
            '[require(\'enb-stylus/techs/css-stylus\')]'
        ].join(byIndent),

        'stylus+autoprefixer': [
            '// css',
            '[require(\'enb-stylus/techs/css-stylus\'), { target: \'?.noprefix.css\' }]'
        ].join(byIndent),

        css: [
            '// css',
            '[require(\'enb/techs/css\')]'
        ].join(byIndent),

        'css+autoprefixer': [
            '// css',
            '[require(\'enb/techs/css\'), { target: \'?.noprefix.css\' }]'
        ].join(byIndent),

        'ie.css': [
            '// ie.css',
            '[require(\'enb/techs/css\'), {',
            '    target: \'?.ie.css\',',
            '    sourceSuffixes: [\'css\', \'ie.css\']',
            '}]'
        ].join(byIndent),

        'ie8.css': [
            '// ie8.css',
            '[require(\'enb/techs/css\'), { ',
            '    target: \'?.ie8.css\',',
            '    sourceSuffixes: [\'css\', \'ie8.css\']',
            '}]'
        ].join(byIndent),

        'ie9.css': [
            '// ie9.css',
            '[require(\'enb/techs/css\'), { ',
            '    target: \'?.ie9.css\',',
            '    sourceSuffixes: [\'css\', \'ie9.css\']',
            '}]'
        ].join(byIndent),

        bemtree: [
            '// bemtree',
            '[require(\'enb-bemxjst/techs/bemtree-old\'), { devMode: process.env.BEMTREE_ENV === \'development\' }]'
        ].join(byIndent),

        bemhtml: [
            '// bemhtml',
            '[require(\'enb-bemxjst/techs/bemhtml-old\'), { devMode: process.env.BEMHTML_ENV === \'development\' }]'
        ].join(byIndent),

        'bemhtml-client': [
            '// client bemhtml',
            [
                '[enbBemTechs.depsByTechToBemdecl, {',
                '    target: \'?.bemhtml.bemdecl.js\',',
                '    sourceTech: \'js\',',
                '    destTech: \'bemhtml\'',
                '}],'
            ].join(byIndent),
            [
                '[enbBemTechs.deps, {',
                '    target: \'?.bemhtml.deps.js\',',
                '    bemdeclFile: \'?.bemhtml.bemdecl.js\'',
                '}],'
            ].join(byIndent),
            [
                '[enbBemTechs.files, {',
                '    depsFile: \'?.bemhtml.deps.js\',',
                '    filesTarget: \'?.bemhtml.files\',',
                '    dirsTarget: \'?.bemhtml.dirs\'',
                '}],'
            ].join(byIndent),
            [
                '[require(\'enb-bemxjst/techs/bemhtml-old\'), {',
                '    target: \'?.browser.bemhtml.js\',',
                '    filesTarget: \'?.bemhtml.files\',',
                '    devMode: process.env.BEMHTML_ENV === \'development\'',
                '}]'
            ].join(byIndent)
        ].join(byIndent),

        bh: [
            '// bh',
            '[require(\'enb-bh/techs/bh-server\'), {',
            '    jsAttrName: \'data-bem\',',
            '    jsAttrScheme: \'json\'',
            '}]'
        ].join(byIndent),

        'bh-client': [
            '// client bh',
            [
                '[enbBemTechs.depsByTechToBemdecl, {',
                '    target: \'?.bh.bemdecl.js\',',
                '    sourceTech: \'js\',',
                '    destTech: \'bemhtml\'',
                '}],'
            ].join(byIndent),
            [
                '[enbBemTechs.deps, {',
                '    target: \'?.bh.deps.js\',',
                '    bemdeclFile: \'?.bh.bemdecl.js\'',
                '}],'
            ].join(byIndent),
            [
                '[enbBemTechs.files, {',
                '    depsFile: \'?.bh.deps.js\',',
                '    filesTarget: \'?.bh.files\',',
                '    dirsTarget: \'?.bh.dirs\'',
                '}],'
            ].join(byIndent),
            [
                '[require(\'enb-bh/techs/bh-client-module\'), {',
                '    target: \'?.browser.bh.js\',',
                '    filesTarget: \'?.bh.files\',',
                '    jsAttrName: \'data-bem\',',
                '    jsAttrScheme: \'json\',',
                '    mimic: \'BEMHTML\'',
                '}]'
            ].join(byIndent)
        ].join(byIndent),

        'node.js': [
            '// node.js',
            '[require(\'enb-diverse-js/techs/node-js\'), { target: \'?.pre.node.js\' }],',
            [
                '[require(\'enb-modules/techs/prepend-modules\'), {',
                '    source: \'?.pre.node.js\',',
                '    target: \'?.node.js\'',
                '}]'
            ].join(byIndent)
        ].join(byIndent),

        'browser.js': [
            '// browser.js',
            '[require(\'enb-diverse-js/techs/browser-js\'), { target: \'?.browser.js\' }],',
            [
                '[require(\'enb-modules/techs/prepend-modules\'), {',
                '    source: \'?.browser.js\',',
                '    target: \'?.js\'',
                '}]'
            ].join(byIndent)
        ].join(byIndent),

        'browser.js+template': [
            '// browser.js',
            '[require(\'enb-diverse-js/techs/browser-js\'), { target: \'?.browser.js\' }],',
            [
                '[require(\'enb/techs/file-merge\'), {',
                '    target: \'?.pre.js\',',
                '    sources: [\'?.browser.template.js\', \'?.browser.js\']',
                '}],'
            ].join(byIndent),
            [
                '[require(\'enb-modules/techs/prepend-modules\'), {',
                '    source: \'?.pre.js\',',
                '    target: \'?.js\'',
                '}]'
            ].join(byIndent)
        ].join(byIndent),

        'html-from-bemhtml': [
            '// html',
            '[require(\'enb-bemxjst/techs/html-from-bemjson\')]'
        ].join(byIndent),

        'html-from-bh': [
            '// html',
            '[require(\'enb-bh/techs/html-from-bemjson\')]'
        ].join(byIndent)
    },
    'bem-tools': {
        'bemdecl.js': 'v2/bemdecl.js',
        'deps.js': 'v2/deps.js',
        stylus: 'v2/styl',
        less: 'v2/less',
        css: 'v2/css',
        'ie.css': 'v2/ie.css',
        'ie8.css': 'v2/ie8.css',
        'ie9.css': 'v2/ie9.css',
        js: 'v2/js-i'
    }
};
