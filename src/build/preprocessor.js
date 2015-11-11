/**
 * Created by danbunea on 03/03/15.
 */

//var ReactTools = require('react-tools');
//module.exports = {
//  process: function(src) {
//    return ReactTools.transform(src);
//  }
//};

var ReactTools = require('react-tools');
module.exports = {
    process: function(src, file) {
        // We really only care about JSX and React test files
        //if (/\.jsx$/.test(file) || /react-test.js$/.test(file)) return ReactTools.transform(src);
        if (/\.jsx$/.test(file)
            || /todomvc_controller.js$/.test(file)
        ) return ReactTools.transform(src,
            {
                harmony:true
            });

        return src;
    }
};


