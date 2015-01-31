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
            '\ttarget: \'?.ie.css\',',
            '\tsourceSuffixes: [\'css\', \'ie.css\']',
            '}]'
        ].join(byIndent),

        'ie8.css': [
            '// ie8.css',
            '[require(\'enb/techs/css\'), { ',
            '\ttarget: \'?.ie8.css\',',
            '\tsourceSuffixes: [\'css\', \'ie8.css\']',
            '}]'
        ].join(byIndent),

        'ie9.css': [
            '// ie9.css',
            '[require(\'enb/techs/css\'), { ',
            '\ttarget: \'?.ie9.css\',',
            '\tsourceSuffixes: [\'css\', \'ie9.css\']',
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
                '\ttarget: \'?.bemhtml.bemdecl.js\',',
                '\tsourceTech: \'js\',',
                '\tdestTech: \'bemhtml\'',
                '}],'
            ].join(byIndent),
            [
                '[enbBemTechs.deps, {',
                '\ttarget: \'?.bemhtml.deps.js\',',
                '\tbemdeclFile: \'?.bemhtml.bemdecl.js\'',
                '}],'
            ].join(byIndent),
            [
                '[enbBemTechs.files, {',
                '\tdepsFile: \'?.bemhtml.deps.js\',',
                '\tfilesTarget: \'?.bemhtml.files\',',
                '\tdirsTarget: \'?.bemhtml.dirs\'',
                '}],'
            ].join(byIndent),
            [
                '[require(\'enb-bemxjst/techs/bemhtml-old\'), {',
                '\ttarget: \'?.browser.bemhtml.js\',',
                '\tfilesTarget: \'?.bemhtml.files\',',
                '\tdevMode: process.env.BEMHTML_ENV === \'development\'',
                '}]'
            ].join(byIndent)
        ].join(byIndent),

        bh: [
            '// bh',
            '[require(\'enb-bh/techs/bh-server\'), {',
            '\tjsAttrName: \'data-bem\',',
            '\tjsAttrScheme: \'json\'',
            '}]'
        ].join(byIndent),

        'bh-client': [
            '// client bh',
            [
                '[enbBemTechs.depsByTechToBemdecl, {',
                '\ttarget: \'?.bh.bemdecl.js\',',
                '\tsourceTech: \'js\',',
                '\tdestTech: \'bemhtml\'',
                '}],'
            ].join(byIndent),
            [
                '[enbBemTechs.deps, {',
                '\ttarget: \'?.bh.deps.js\',',
                '\tbemdeclFile: \'?.bh.bemdecl.js\'',
                '}],'
            ].join(byIndent),
            [
                '[enbBemTechs.files, {',
                '\tdepsFile: \'?.bh.deps.js\',',
                '\tfilesTarget: \'?.bh.files\',',
                '\tdirsTarget: \'?.bh.dirs\'',
                '}],'
            ].join(byIndent),
            [
                '[require(\'enb-bh/techs/bh-client-module\'), {',
                '\ttarget: \'?.browser.bh.js\',',
                '\tfilesTarget: \'?.bh.files\',',
                '\tjsAttrName: \'data-bem\',',
                '\tjsAttrScheme: \'json\',',
                '\tmimic: \'BEMHTML\'',
                '}]'
            ].join(byIndent)
        ].join(byIndent),

        'node.js': [
            '// node.js',
            '[require(\'enb-diverse-js/techs/node-js\'), { target: \'?.pre.node.js\' }],',
            [
                '[require(\'enb-modules/techs/prepend-modules\'), {',
                '\tsource: \'?.pre.node.js\',',
                '\ttarget: \'?.node.js\'',
                '}]'
            ].join(byIndent)
        ].join(byIndent),

        'browser.js': [
            '// browser.js',
            '[require(\'enb-diverse-js/techs/browser-js\'), { target: \'?.browser.js\' }],',
            [
                '[require(\'enb-modules/techs/prepend-modules\'), {',
                '\tsource: \'?.browser.js\',',
                '\ttarget: \'?.js\'',
                '}]'
            ].join(byIndent)
        ].join(byIndent),

        'browser.js+template': [
            '// browser.js',
            '[require(\'enb-diverse-js/techs/browser-js\'), { target: \'?.browser.js\' }],',
            [
                '[require(\'enb/techs/file-merge\'), {',
                '\ttarget: \'?.pre.js\',',
                '\tsources: [\'?.browser.template.js\', \'?.browser.js\']',
                '}],'
            ].join(byIndent),
            [
                '[require(\'enb-modules/techs/prepend-modules\'), {',
                '\tsource: \'?.pre.js\',',
                '\ttarget: \'?.js\'',
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
