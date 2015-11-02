// begin from here
var _ = require('./utils/components');
var Tag = require('./lib/tag');
var Page = require('./lib/page');

module.exports = function(ret, conf, settings, opt) {
    // console.log('prepackager-ques begin');
    // console.log('ret', Object.keys(ret) /*, conf, settings, opt*/ );
    // console.log('ret', Object.keys(ret.src) /*, conf, settings, opt*/ );
    // console.log('ret', Object.keys(ret.ids) /*, conf, settings, opt*/ );
    // console.log('ret', Object.keys(ret.pkg) /*, conf, settings, opt*/ );
    // console.log('ret', Object.keys(ret.map) /*, conf, settings, opt*/ );

    fis.util.map(ret.src, function(subpath, file) {
        var page;

        // if (file.isQHtml) {
        //     console.log('find QHtml:', file.id, file.subpath, file.Qtpl);
        // }
        if (file.isHtmlLike && !file.isQHtml) {
            page = new Page(file.getContent(), file, ret, settings);
            file.setContent(page.html());
        }
    });

    //    console.log('prepackager', conf, settings, opt);

    //     fis.util.map(ret.src, function (subpath, file) {
    //         if (file.isHtmlLike) {
    // //            console.log('vue com:', file.getId()/*, conf*/);
    // //            console.log(root, fis.util.isDir(root+'/modules/index'))

    //             var match;
    //             //exclude
    //             if (!(match = file.getId().match(pageReg))) return content;
    // //            console.log('>>>', file.getId());
    //             var page = match[1], content = file.getContent();

    //             content = content.replace(comReg, function(m, $1, $2, $3) {
    //                 var id, dynamic;
    //                 $2.replace(attrReg, function(mm, $$1, $$2) {
    //                     if ('id' == $$1) {
    //                         id = $$2.slice(1, $$2.length-1);
    //                     } else if ('dynamic' == $$1) {
    //                         dynamic = !!(parseInt($$2.slice(1, $$2.length-1)));
    //                     }
    //                     return mm;
    //                 });
    //                 if (id) return processCom(ret, opt, m, page, $1, id, dynamic, $3);
    //                 return m;
    //             });

    //             file.setContent(content);
    //         }
    //     });
};
