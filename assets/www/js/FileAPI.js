//alert('loading File API...');
try{
//window.FileView = window.PagedView.extend(
var FileAPI = {
	//Позже прикручу шаблон библиотеки JsMB. Мне лень =D
	
    initialize: function() {
        //FileAPI.__super__.initialize.apply(this);
        var text = "// ===== JsMobileBasic Script (JsMB IDE) ===== \\";
        this.writeFile("JsMB-IDE-Settings.preferences", text);
    },

    events: {
        "touchstart .readBtn"    : "readHandler",
        "touchstart .writeBtn"   : "writeHandler"
    },
	output: {
		text: "text",
		base64: "",
		json: {}
	},
/*
    readFile:function(fileName, selector) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) {
                fileSystem.root.getFile(fileName, {create: false, exclusive: false},
                    function(file) {
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            $(selector).html(event.target.result);
                        };
                        reader.onerror = function(event) {
                            showAlert('Error loading file');
                        };
                        reader.readAsText(file);
                    },
                    this.getFileError);
            },
            this.fsError);
    },*/
readFile: function(file,selector){
	try{
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
		logError('Файловая система');
		FileAPI.fileSystem = fileSystem;
        fileSystem.root.getFile(file, {create: false, exclusive: false}, function(fileEntry){
			logError('FileEntry');
			FileAPI.fileEntry = fileEntry;
        	fileEntry.file(function (files){
				logError('Got file');
				FileAPI.file = file;
				FileAPI.files = files;
       			//DataUrl
					logError('readDataUrl');
        			var reader = new FileReader();
        			reader.onload = function(evt) {
            			logError("Read as data URL");
            			logError(evt.target.result);
						FileAPI.output.base64 = evt.target.result;
						if(selector){
							$(selector).html(evt.target.result);
						}
        			};
        			reader.readAsDataURL(files);//
        		//readAsText			
					logError('readAsText');
        			var reader = new FileReader();
        			reader.onload = function(evt) {
            			logError("Read as text");
            			logError(evt.target.result);	
						FileAPI.output.text = evt.target.result;
						FileAPI.output.json = parseJSON(evt.target.result);
						if(selector){
							$(selector).html(evt.target.result);
						}
						ploadCallback();
        			};
        			reader.readAsText(files);
					logError('<green>Конец загрузки файла!</green>');
			}, fail);
		}, fail);
	}, fail);

    function fail(evt) {
        console.log('Ошибка доступа к файлу! Код:'+parseJSON(evt));
    }
}catch(e){
	logError('Ошибка в функции FileAPI.readFile! Ошибка: '+e);
}
},//

    writeFile: function(fileName, text, displayMessage) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) {
                fileSystem.root.getFile(fileName, {create: true, exclusive: false},
                    function(file) {
                        file.createWriter(
                            function(writer) {
                                writer.onwrite = function(event) {
                                    if (displayMessage) {
                                        navigator.notification.alert(
                                            fileName + ' успешно сохранён ;)',  // message
                                            null,
                                            'Сохранение файла',            // title
                                            'OK'                  // button label
                                        );
                                    }
                                };
                                writer.onerror = function(event) {
                                    navigator.notification.alert(
                                       'При сохранении файла возникла ошибка!',  // message
                                        null,
                                        'Ошибка сохранения',            // title
                                        'OK'                  // button label
                                    );
                                };
                                writer.write(text);
                            },
                            function() {
                                showAlert('Ошибка!', 'createWriter');
                            }
                        );
                    },
                    this.getFileError);
            },
            this.fsError);
    },
	readDirectory: function(selector,callback) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
				var dirReader = fileSystem.root.createReader();
            	dirReader.readEntries(function (entries){
					var s = '<ul class="list-group">';
            		for (var i = 0, len = entries.length; i < len; i++) {
		                if (entries[i].isDirectory) {
        	            s += '<li class="list-group-item">' + entries[i].fullPath + '</li>';
            		    };
            		};
    	        s += "</ul>";
        	    $(selector).html(s);
				if(callback){
					callback();
				}
				}, this.fsError);
			}, null);
    },
    readHandler: function(filename, div) {
        this.readFile($IDE.projectFile, $Project);
        return false;
    },

    writeHandler: function(filename, textarea) {
        this.writeFile($IDE.projectFile, $Project, true);
        return false;
    },
	
	info: {
		name: 'JsMobileBasic android file library'
	}

};
logError('</red><green>File API успешно загружен!</green><red>');
}catch(e){
//	alert(e);
	logError(e);
};

showAlert = logError;
