$(document).ready(function(){
  var labelSelect = [];
  if(typeof(openDatabase) !== 'undefined'){
    labelimg.init.open();
    labelimg.init.createTable();
  }

  fabric.Canvas.prototype.getItemByName = function(name) {
    var object = null, objects = this.getObjects();
    for (i = 0, len = this.size(); i < len; i++) {
      if (objects[i].name && objects[i].name === name) {
        object = objects[i];
        break;
      }
    }
    return object;
  };

  var canvas = this.__can4vas = new fabric.Canvas('c');

  var RandId = () => Math.random().toString(36).substring(7);

    function createList(file,data){
      base64 = data.target.result;
      var imagess = new Image();
      imagess.src = base64;
      imagess.onload = async () => {
        console.info(imagess.width, imagess.height, file.name)
        $(".imagesAll").append("<div class=\"preview\" index=\""+($(".preview").length+1)+"\" width=\""+imagess.width+"\" height=\""+imagess.height+"\" filename=\""+file.name+"\" style=\"background-image: url('"+imagess.src+"')\"></div>");
        $(".preview").draggable({ revert: "invalid" });
        $(".count_all").text($(".preview").length);
        $('.imagesAll').css('margin-top',$('#menu').height())
      }
    }

    function handleFileSelect(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var files = evt.dataTransfer.files;
      for (var countFile = 0; countFile < files.length; countFile++) {
      	f = files[countFile];
        var reader = new FileReader();
        reader.onload = (function (file){
        	return function(data) {
            createList(file, data)
            labelimg.init.addImages(file.name, data.target.result)
          };
        })(f);
        reader.readAsDataURL(f);
      }
    }
    document.addEventListener('dragover', function(evt) {
    	evt.stopPropagation();
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'copy';
    }, false);
    document.addEventListener('drop', handleFileSelect, false);
    
    function rectAdd(name, left, top, width, height){
    	var rect = new fabric.Rect({
        hasRotatingPoint : false,
        left: left,
        top: top,
        fill: 'green',
        width: width,
        height: height,
        opacity: 0.4
      });
      rect.name = name;
      canvas.add(rect)
      canvas.renderAll();
      return rect;
    }

    let close = _ => {
      if($('.transparent').css("display") == 'none' && $('#videoElement').css("display") == 'block'){
        $("#videoElement")[0].pause();
        $('#videoElement').hide();
        $('.transparent').show();
        $(".buttonScreen").hide();
        $(".divTable").show();
        window.postMessage({ type: 'SS_UI_CANCEL', text: 'start' }, '*');
      }
    }

    //image to .transparent
    $('body').on('click', '.preview', function (e) {
      close();
    	canvas.clear();
      var filename = $(this).attr("filename");
      canvas.fileName = filename;
      canvas.setHeight($(this).attr('height'));
      canvas.setWidth($(this).attr('width'));
      fabric.Image.fromURL($(this).css("background-image").replace(/url\(\"/,'').replace(/\"\)/,''), function(img) {
      	img.set('selectable', false);
      	canvas.bringForward(img);
      	canvas.add(img);
      	info = $("tr[filename='"+filename+"']")
        if(info.length > 0){
      	  info.each(function(index){
      	  	// 0 - filename, 1-class, 2-width, 3-height, 4-x1, 5-y1, 6-x2, 7-y2
      	  	name = $(this).attr("name")
      		  temp = $(this).find("td")
      		  r = rectAdd(name, parseInt(temp[4].innerText), parseInt(temp[5].innerText), parseInt(temp[6].innerText-temp[4].innerText), parseInt(temp[7].innerText-temp[5].innerText))
      		  r.on('mouseover', mouseInRect).on('mouseout', mouseOutRect);
      	  })
        }
      	})
      let index_preview = $(this).attr('index');
      $(".count_select").text(index_preview);
      canvas.index_preview = index_preview;
      $('.preview').css('box-shadow','')
      $('.preview[index="'+index_preview+'"]').css('box-shadow',' 0px 0px 9px 3px rgba(0, 140, 0, 0.9)')
    })
      
    //drag transparent
    $('body').on('mousedown', '.transparent', function (e) {
    	var x=e.offsetX, y = e.offsetY;
    	move = function(event) {
        if(event.which == 0){
          $('body').off('mousemove', '.transparent',move)
      	  $('body').off('mouseup', '.transparent',mouseupRemove)
        }else if(event.which == 3){
          $(".transparent").scrollLeft($(".transparent").scrollLeft()+x-event.offsetX).scrollTop($(".transparent").scrollTop()+y-event.offsetY)
        }
      }
      $('body').on('mousemove', '.transparent',move)
      mouseupRemove = function(e) {
        $('body').off('mousemove', '.transparent',move)
      	$('body').off('mouseup', '.transparent',mouseupRemove)
      };
      $('body').on('mouseup', '.transparent',mouseupRemove)
    })

    $(".transparent").contextmenu(function() {
     return false;
    });
 
    function red(t){
    	canvas.getItemByName(t.attr('name')).set('fill', 'red');
    	canvas.renderAll();
    }

    function green(t){
      canvas.getItemByName(t.attr('name')).set('fill', 'green');
      canvas.renderAll();
    }

    function mouseInTr(){
    	if (canvas.fileName == $(this).attr('filename')){
    		$(this).css('background-color','#ec616163');
    	  red($(this));
      }
    }

    function mouseOutTr(){
    	if (canvas.fileName == $(this).attr('filename')){
    		$(this).css('background-color','');
        green($(this));
      }
    }

    function mouseInRect(e){
      $("tr[name='"+e.target.name+"']").css('background-color','#ec616163');
      red($(this));
    }

    function mouseOutRect(e){
    	if(e.target != undefined){
        $("tr[name='"+e.target.name+"']").css('background-color','');
        green($(this));
      }
    }
    
    function clickPreview(e){
    	name = $(this)[0].innerText;
    	if(canvas.fileName != name){
        $(".preview[filename='"+name+"']").click();
      }
    }

    function resizeTable(){
      $('.divTable').height($("#card").height() - $(".divTable").position().top)
      $('.imagesAll').css('margin-top',$('#menu').height())
    }
    
    function appendTr(canvas,rect,class_s='None'){
      template = '<tr filename="'+canvas.fileName+'" name="'+rect.name+'"><td>'+canvas.fileName+'</td><td>'+canvas.getWidth()+'</td><td>'+canvas.getHeight()+'</td><td>'+class_s+'</td><td>'+rect.left+'</td><td>'+rect.top+'</td><td>'+(rect.left+rect.width)+'</td><td>'+(rect.top+rect.height)+'</td></tr>';
      $("#tableHeader").after(template)
      $("tr[name='"+rect.name+"']").mouseover(mouseInTr).mouseout(mouseOutTr);
      $("tr[name='"+rect.name+"'] > td:eq(0)").click(clickPreview);
    }

    function appendRect(e){
    	if(canvas.fileName != undefined){
    		mouse = e.e
        rect = rectAdd("rect_"+RandId(), mouse.offsetX-50, mouse.offsetY-50, 100, 100)
        appendTr(canvas,rect)
        labelimg.init.addLabel(canvas.fileName, rect.name, canvas.getWidth(), canvas.getHeight(), 'None', rect.left, rect.top,(rect.left+rect.width), (rect.top+rect.height))
        rect.on('mouseover', mouseInRect).on('mouseout', mouseOutRect);
        resizeTable();
      }
    }

    function draw(options){
    	p = options.target
    	// 0 - filename, 1-class, 2-width, 3-height, 4-x1, 5-y1, 6-x2, 7-y2
    	temp = $("tr[name='"+p.name+"']").find("td");
    	temp[4].innerText = Math.round(p.left);
    	temp[5].innerText = Math.round(p.top);
    	temp[6].innerText = Math.round(p.left+p.width*p.scaleX);
    	temp[7].innerText = Math.round(p.top+p.height*p.scaleY);
      labelimg.init.updateLabelPosition(p.name, Math.round(p.left), Math.round(p.top), Math.round(p.left+p.width*p.scaleX), Math.round(p.top+p.height*p.scaleY));
    }
    canvas.on("object:moving", draw)
    canvas.on("object:scaling", draw)
    
    
    $("#saveSelect").click(function(){
      $("#selector").hide();
    });

    function createLabelMenu(top,left,name){
      var name = name
      $("#selector").css({
        "top": top+"px",
        "left": left+"px",
        "height": "43px"
      }).show();
      $('#selector').on('input', ':text', function() { 
        let t = $(this).val().replace(/\s+/g, '');
        $("tr[name='"+name+"'] > td:eq(3)")[0].innerHTML = t;
        if( labelSelect.indexOf != -1 ){
          labelSelect.push(t)
        }
        labelimg.init.updateLabelClass(name, t);
      });
      $('#selector > input').focus();
    }

    $("#selector").on('keyup', ':text', (e) => {
      if ($("#selector > input:focus") && e.keyCode == 13) {
        $("#selector").hide();
        $("#selector > input").val("");
        $("#selector").off('input',"**");
      }
    });

    fabric.util.addListener(fabric.document, 'keydown', function(e){
      if(e.keyCode == 46){
        if(canvas.getActiveObject()){
          let obj = canvas.getActiveObject()
          $("table > tbody > tr[name='"+obj.name+"']").remove()
          canvas.remove(obj)
          labelimg.init.deleteLabel(obj.name)
        }
      }
    });
    
    canvas.on("mouse:dblclick", function(e){
      let top = e.target.top+e.target.canvas._offset.top+e.target.height/2;
      let left = e.target.left+e.target.canvas._offset.left+e.target.width/2-50;
      createLabelMenu(top,left,e.target.name);
      $('#selector > input').val($("tr[name='"+e.target.name+"'] > td:eq(3)")[0].innerHTML.replace(/\s+/g, ''));
    })
    
    var mouseMove = false;
    var rect = null;
    var mouseStartX = 0, mouseStartY = 0, mouseEndX = 0, mouseEndY = 0;
    canvas.on("mouse:down", function(e){
      if(canvas.fileName != undefined){
    	  if(e.target.name == undefined){
    	    mouseMove = true;
    	    mouseStartX = e.e.offsetX;
    	    mouseStartY = e.e.offsetY;
    	  }
      }
    })

    canvas.on("mouse:up", function(e){
      $("#selector").hide();
      $("#selector > input").val("");
      $("#selector").off('input',"**");
      if(mouseMove == true){
    	  rect = rectAdd("rect_"+RandId(), mouseStartX, mouseStartY, mouseEndX-mouseStartX, mouseEndY-mouseStartY)
    	  rect.selectable = true;
    	  appendTr(canvas,rect);
        //filename, name, width, height, left, top, lwidth, theight
        labelimg.init.addLabel(canvas.fileName, rect.name, canvas.getWidth(), canvas.getHeight(), 'None', rect.left, rect.top,(rect.left+rect.width), (rect.top+rect.height))
        rect.on('mouseover', mouseInRect).on('mouseout', mouseOutRect);
        canvas.renderAll();
        createLabelMenu(e.e.pageY-rect.height/2,e.e.pageX-50-rect.width/2, rect.name);
    	  mouseMove = false;
        resizeTable();
      }
    })

    canvas.on("mouse:move", function(e){
    	if( mouseMove == true){
    		mouseEndX = e.e.offsetX;
    		mouseEndY = e.e.offsetY;
    	}
    })

    canvas.on('mouse:wheel', function(opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom = zoom + delta/1000;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.setZoom(zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    })

  $("#openCamera").click(() => {
    var video = document.querySelector("#videoElement");
    $(".transparent").hide();
    video.style.display = 'block';
    $(".buttonScreen").show();
    $(".divTable").hide();
    if (navigator.mediaDevices.getUserMedia) {       
        navigator.mediaDevices.getUserMedia({video: true})
      .then(function(stream) {
        video.srcObject = stream;
      })
      .catch(function(err0r) {
        console.log(err0r);
        $(".transparent").show();
        $(".divTable").show()
        $(".buttonScreen").hide();
        video.style.display = 'hide';
      });
    }
  })

  $("#saveimage").click(() => {
    var video = document.querySelector("#videoElement");
    let canvas = document.querySelector('#t');
    let context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0,0, video.videoWidth, video.videoWidth)
    let data = canvas.toDataURL('image/png');
    $(".imagesAll").append("<div class=\"preview\" index=\""+($(".preview").length+1)+"\" width=\""+video.videoWidth+"\" height=\""+video.videoHeight+"\" filename=\""+Date.now()+".png\" style=\"background-image: url('"+data+"')\"></div>");
  })

  function exportTableToCSV(filename) {
    var csv = '';
    var rows = $("#table > tbody > tr[filename='"+filename+"']");
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerHTML.replace(/\s+/g, ''));
        csv += row.join(",")+'\n';        
    }
    return csv;
  }

  function generatepbtxt() {
    var pbtxt = '';
    var parsetd = $("#table > tbody > tr:gt(0)").map(function(par){ return $(this).find("td")[3].innerHTML;});
    parsetd = parsetd.filter(function(i, item){ return $.inArray(item,parsetd) == i;});
    for(let i=0;i<parsetd.length;i++){
      pbtxt += "item {\n"+
                "  id: "+(i+1)+"\n"+
                "  name: '"+parsetd[i]+"'\n"+
                "}\n";
    }
    return pbtxt;
  }
  var d = 0;
  $("#generate").click(() => {
    d = $(".preview").length;
    $("#modal_background").show();
  })

  $("#modal_background").click((e) => {
    if(e.target.id == 'modal_background'){
      $("#modal_background").hide();
    }
  })
  var train = 0, train_mix = 0;
  var test = 0, test_mix = 0;

  function cals(){
    var relation = $('#relation').val()/100;
    train = Math.ceil(d*relation);
    test = Math.ceil(d-train);
    
    var mixing = $('#mixing').val()/100;
    train_mix = Math.ceil((d-train)*mixing);
    test_mix = Math.ceil((d-test)*mixing);

    $("#count_train")[0].innerText = train + train_mix;
    $("#count_test")[0].innerText = test + test_mix;
  }

  $("input[type='checkbox']").click(function(e){
    let train_checked = $('#check_train').prop('checked');
    let test_checked = $('#check_test').prop('checked');
    if(train_checked && test_checked){
      $("#relation").removeAttr('disabled');
      $("#mixing").removeAttr('disabled');
      cals();
    } else if(train_checked == false || test_checked == false){
      $("#relation").attr('disabled','disabled');
      $("#mixing").attr('disabled','disabled');
    }
  })

  $('body').on('input', 'input[type="range"]', function() {
    cals();
  });

  function generate(train=0,test=0,train_mix=0,test_mix=0){
    console.info(train, test, train_mix, test_mix)
    var train_array = [], test_array = [];
    var train_csv = 'filename,width,height,class,xmin,ymin,xmax,ymax\n', test_csv = 'filename,width,height,class,xmin,ymin,xmax,ymax\n';
    if(train > 0){
      for (let i = 0;i<train;i++) {
        train_array.push($(".preview:eq("+i+")").attr('filename'))
      }
    }
    if(test > 0){
      for (let i = train;i<(test+train);i++) {
        test_array.push($(".preview:eq("+i+")").attr('filename'))
      }
    }
    if(train_mix > 0){
      for (let i = train;i<(train_mix+train);i++) {
       train_array.push($(".preview:eq("+i+")").attr('filename'))
      }
    }
    if(test_mix > 0){
      for (let i = 0;i<test_mix;i++) {
        test_array.push($(".preview:eq("+i+")").attr('filename'))
      }
    }
    console.info(train_array, test_array);
    train_array.forEach(function(item, i, arr) {
      train_csv += exportTableToCSV(item);
    })
    test_array.forEach(function(item, i, arr) {
      test_csv += exportTableToCSV(item);
    })
    $.get('file/tfrecord.txt', (data) => {
      var zip = new JSZip();
      zip.file("tfrecord.py", data);
      if(train_array.length > 0){
        zip.file("train.csv", train_csv);
      }
      if(test_array.length > 0){
        zip.file("test.csv", test_csv);
      }
      zip.file("labelmap.pbtxt", generatepbtxt());
      var img = zip.folder("images");
      for(let i=0;i<$(".preview").length;i++){
        let generate = $(".preview:eq("+i+")");
        bg = generate.css('background-image').replace('url(','').replace(')','').replace(/\"/gi, "").replace(/data:image\/*.+;base64,/,'');
        img.file(generate.attr("filename"), bg, {base64: true});
      }
      zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, "labelimg.zip");
      });
    })
  }

  $("#generate_data").click(() => {
    let train_checked = $('#check_train').prop('checked');
    let test_checked = $('#check_test').prop('checked');
    if(train_checked && test_checked){
      generate(train,test,train_mix,test_mix)
    } else if(train_checked && !test_checked){
      generate($(".preview").length)
    } else if(!train_checked && test_checked){
      generate(0,$(".preview").length)
    }
  })

  $(".trash").droppable({
    classes: {
      "ui-droppable-active": "trash_active",
      "ui-droppable-hover": "trash_hover"
    },
    drop: function( event, ui ) {
      let filename = ui.draggable.attr('filename')
      $("table > tbody > tr[filename='"+filename+"']").remove()
      labelimg.init.deleteAll(filename)
      ui.draggable.remove()
    }
  });

  $('table').on('click', 'tr[filename]', function (e) {
    var name = $(this).attr('filename');
    if(e.target.cellIndex == 0 && canvas.fileName != name){
      $('.imagesAll > .preview[filename="'+name+'"]').click()
    }
  })

  $(window).resize(function() {
    resizeTable();
  })

  $('#control').on('click', '#next', function (e) {
    var n = parseInt(canvas.index_preview);
    if(isNaN(n)){ n = 0; };
    $(".preview[index='"+(n+1)+"']").click()
  })

  $('#control').on('click', '#previous', function (e) {
    var n = parseInt(canvas.index_preview);
    if(isNaN(n)){ n = 2; };
    $(".preview[index='"+(n-1)+"']").click()
  })

  $(this).on('paste', function(e) {
    if (!e.originalEvent.clipboardData.types) {
      return false;
    }

    var pasteData = e.originalEvent.clipboardData.items
    for(let i = 0; i< pasteData.length; i++){
      if (pasteData[i].type.indexOf("image") == -1) continue;
      var blob = pasteData[i].getAsFile();
      var URLObj = window.URL || window.webkitURL;
      createList({'name':blob.name}, {'target':{'result':URLObj.createObjectURL(blob)}})
    }
  });

  if(typeof(openDatabase) !== 'undefined'){
    labelimg.init.getImagesLen().then(function(defs){
      if (defs > 0 && confirm("Load last checkpoint?")){
        labelimg.init.getImages(function(filename, data){
          createList({'name':filename}, {'target':{'result':data}})
        })

        labelimg.init.getLabel(function(e){
          let canvas = {}
          canvas.fileName = e.filename;
          canvas.getWidth = () => e.width;
          canvas.getHeight = () => e.height;
          
          let rect = {}
          rect.left = e.left;
          rect.top = e.top;
          rect.width = e.lwidth - e.left;
          rect.height = e.theight - e.top
          rect.name = e.name
          appendTr(canvas,rect,e.class)
        })
      }
    });
  }
})