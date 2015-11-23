
fis.hook('commonjs')
    .match('/*', {
        release: false
    })
    .match('/{pages,libs,components}/(**).js', {
        isMod: true
    })
    .match('/libs/mod.js', {
        isMod: false
    })
    .match('**.min.js', {
        isMod: false
    })
    .match('*.scss', {
        rExt: '.css',
        parser: fis.plugin('sass')
    })
    .match('_*.scss', {
        release: false
    });

fis.media('dev')
    .match('::package', {
        prepackager: [
            fis.plugin('imweb-ques')
        ],
        postpackager: [
            fis.plugin('loader', {
                resourceType: 'commonJs'
            })
        ]
    })
    .match('**', {
        deploy: fis.plugin('local-deliver', {
            to: '../dev'
        })
    });

fis.media('dist')
    .match('::package', {
        prepackager: [
            fis.plugin('imweb-ques')
        ],
        postpackager: [
            fis.plugin('loader', {
                resourceType: 'commonJs',
                allInOne: {
                    css: '${filepath}_aio.css',
                    js: '${filepath}_aio.js',
                }
            })
        ]
    })
    .match('**', {
        deploy: fis.plugin('local-deliver', {
            to: '../dist'
        })
    });

