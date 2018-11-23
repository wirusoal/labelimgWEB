var labelimg = {}
labelimg.init = {}
labelimg.init.db = {}

labelimg.init.open = function(){
  labelimg.init.db = openDatabase("labelimg","1.0","",1024*1024*20);
}

labelimg.init.createTable = function(){
  var database = labelimg.init.db;
  database.transaction(function(tx){
  tx.executeSql("CREATE TABLE IF NOT EXISTS images (filename VARCHAR, data VARCHAR)", []);
  tx.executeSql("CREATE TABLE IF NOT EXISTS tablelabel (filename VARCHAR, name VARCHAR, width INTEGER, height INTEGER, class VARCHAR, left INTEGER, top INTEGER, lwidth INTEGER, theight INTEGER)", []);
  });
}

labelimg.init.addImages = function(filename, data){
  var database = labelimg.init.db;
  database.transaction(function(tx) {
    tx.executeSql("INSERT INTO images (filename,data) VALUES (?,?)", [filename,data]);
  })
}

labelimg.init.getImagesLen = function(){
	return new Promise( function( resolve, reject ) {
    let database = labelimg.init.db;
    database.transaction((tx) => {
      tx.executeSql("SELECT * FROM images", [], (tx,result) => {
        resolve(result.rows.length);
      });
    });
  })
}

 
labelimg.init.getImages = function(callback){
  var database = labelimg.init.db;
  database.transaction(function(tx){
    tx.executeSql("SELECT * FROM images", [], function(tx,result){
      for (var i=0; i < result.rows.length; i++) {
        filename = result.rows.item(i).filename;
        data = result.rows.item(i).data;
        callback(filename, data);
      }
    });
  });
}

labelimg.init.addLabel = function(filename, name, width, height, class_label, left, top, lwidth, theight){
  var database = labelimg.init.db;
  database.transaction(function(tx) {
    tx.executeSql("INSERT INTO tablelabel (filename, name, width, height, class, left, top, lwidth, theight) VALUES (?,?,?,?,?,?,?,?,?)", [filename, name, width, height, class_label, left, top, lwidth, theight]);
  })
}

labelimg.init.updateLabelPosition = function(name, left, top, lwidth, theight){
  var database = labelimg.init.db;
  database.transaction(function(tx) {
    tx.executeSql('UPDATE tablelabel SET left = ?, top = ?, lwidth = ?, theight = ? WHERE name = ?', [left, top, lwidth, theight, name]);
  })
}

labelimg.init.updateLabelClass = function(name, class_label){
  var database = labelimg.init.db;
  database.transaction(function(tx) {
   tx.executeSql('UPDATE tablelabel SET class = ? WHERE name = ?', [class_label, name]);
  })
}

labelimg.init.getLabel = function(callback){
  var database = labelimg.init.db;
  database.transaction(function(tx){
    tx.executeSql("SELECT * FROM tablelabel", [], function(tx,result){
      for (var i=0; i < result.rows.length; i++) {
        callback(result.rows.item(i));
      }
    });
  });
}

labelimg.init.deleteLabel = function(name){
    var database = labelimg.init.db;
    database.transaction(function(tx){
        tx.executeSql("DELETE FROM tablelabel WHERE name=?",[name]);
     });
}

labelimg.init.deleteAll = function(filename){
    var database = labelimg.init.db;
    database.transaction(function(tx){
        tx.executeSql("DELETE FROM tablelabel WHERE filename=?",[filename]);
        tx.executeSql("DELETE FROM images WHERE filename=?",[filename]);
     });
}