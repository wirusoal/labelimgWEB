'use strict';
let allModels = {};
function createModel(Model, ...args) {
  let model = new Model(...args);
  model._id = Math.random().toString(36).slice(2);
  allModels[model._id] = model;
  return model;
}

  // feature {
  //   key: "image/object/bbox/xmin"
  //   value {
  //     float_list {
  //       value: 0.203125
  //     }
  //   }
  // }

let dataset_util = createModel(class Dataset_util {
  int64_feature(key, value) {
    return '  feature {\n'+
           '    key: "'+ key+'"\n'+
           '    value {\n'+
           '      int64_list {\n'+
           '         value: '+value+'\n'+
           '      }\n'+
           '    }\n'+
           '  }\n'
  }

  int64_list_feature(key, value) {
    var f = '  feature {\n'+
           '    key: "'+ key+'"\n'+
           '    value {\n'+
           '      int64_list {\n';
    for(let i=0;i<value.length;i++){
      f += '         value: '+value[i]+'\n'
    }
    f +=   '      }\n'+
           '    }\n'+
           '  }\n'
    return f;
  }

  bytes_feature(key, value) {
    return '  feature {\n'+
           '    key: "'+ key+'"\n'+
           '    value {\n'+
           '      bytes_list {\n'+
           '         value: "'+value+'"\n'+
           '      }\n'+
           '    }\n'+
           '  }\n'
  }

  bytes_list_feature(key, value) {
    var f = '  feature {\n'+
           '    key: "'+ key+'"\n'+
           '    value {\n'+
           '      bytes_list {\n';
    for(let i=0;i<value.length;i++){
      f += '         value: "'+value[i]+'"\n'
    }
    f +=   '      }\n'+
           '    }\n'+
           '  }\n'
    return f;
  }

  float_feature(key, value) {
    return '  feature {\n'+
           '    key: "'+ key+'"\n'+
           '    value {\n'+
           '      float_list {\n'+
           '         value: '+value+'\n'+
           '      }\n'+
           '    }\n'+
           '  }\n'
  }

  float_list_feature(key, value) {
    var f = '  feature {\n'+
           '    key: "'+ key+'"\n'+
           '    value {\n'+
           '      float_list {\n';
    for(let i=0;i<value.length;i++){
      f += '         value: '+value[i]+'\n'
    }
    f +=   '      }\n'+
           '    }\n'+
           '  }\n'
    return f;
  }

  features(value){
    var f = 'features {\n';
    for(let i=0;i<value.length;i++){
      f += value[i];
    }
    f += '}'
    return f;
  }
});