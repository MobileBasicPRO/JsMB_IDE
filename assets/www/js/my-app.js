var $IDE = {
	version: '1.1',
	projectName: 'project1',
	projectFile: 'project1.mbp',
	devCounter: 0,
	devBuild: true,
	debugFunction: function() {alert('test');},
//	JsMB_version: $JsMobileBasic.version
	project:{
		bar:1,
		open:false,
		current_file:"Autorun.bas"
	}
},
	$Project = {
		name:$IDE.projectName,
		author:'MobileBasicPRO',
		version:'1.0',
		description:'Test project',
		url: 'vk.com/JsMobileBasic',
		files:{
			"Autorun.bas":"// * ==================JsMobileBasic Script================= * \\\\ \n\nfunction Main() {\n//Этот код выполнится единожды при запуске\nprintln($JsMobileBasic.name);\nprintln($JsMobileBasic.version);\n}\n\n\nfunction Loop() {\n\n//Этот код выполняется 10 раз в секунду (будьте осторожны!)\n}"
			/*"file":"data"*/
		},
//		JsMB_version: $IDE.JsMB_version
	};
// Initialize your app
var $$$ = new Framework7({
	modalTitle: 'JsMobileBasic-IDE',
    // Enable Material theme
    material: true,
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = $$$.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

$$$.onPageInit('project', function (page) {
	$IDE.project.open = true;
	$$('#return-project').show();
    $$('.open-oper-picker').on('click', function () {
        $$$.pickerModal('.oper-picker');
    });

	 var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
		autoCloseBrackets: true,
		styleActiveLine: true,
    	matchBrackets: true,
        mode: "text/javascript"
      });
	  editor.setOption("theme", "3024-night");
	  
	  $$('#title').html($Project.name);
	  $$('#pname').val($Project.name);
	  $$('#pver').val($Project.version);
	  $$('#pauth').val($Project.author);
	  $$('#pdesc').val($Project.description);
	  $$('#purl').val($Project.url);
	  loadFiles();
	  $IDE.project.current_file = "Autorun.bas";
});
//API
function alert(text){
	$$$.alert(text);
}

function log(text){
	$$('#console')[0].innerHTML+="# "+text+'<br/>';
}

function info(text){
	$$$.addNotification({
            message: '<blue>'+text+'</blue>',
            button: {
                text: 'Закрыть',
//                color: 'yellow'
            }
        });
}

function error(text){
	$$$.addNotification({
            message: '<red>Ошибка: '+text+'</red>',
            button: {
                text: 'Закрыть',
//                color: 'yellow'
            }
        });
}

function warn(text){
	$$$.addNotification({
            message: '<yellow>Предуприждение: '+text+'</yellow>',
            button: {
                text: 'Закрыть',
//                color: 'yellow'
            }
        });
}

function soon(){
	alert('К сожалению данная возможность недоступна в версии'+$IDE.version+'...<br/> Зайдите в группу vk.com/JsMobileBasic для проверки обновлений ;)');
};

function toJSON(object){
	try{
		var tmp = JSON.stringify(object,'',4);
		return tmp;
	}catch(e){
		log('<red>'+e+'</red>');
		return false;
	}
}

function parseJSON(json){
	try{
		var tmp = JSON.parse(json);
		return tmp;
	}catch(e){
		log('<red>'+e+'</red>');
		return false;
	}
}

console.log = log;
console.error = log;
window.onerror = log;
logError = log;

var $Native = {
	print: function (msg)
	{ 
		cordova.exec(this.onSuccess, this.onFail, "Toast", "nativeAction", [msg]);
    },
	onSuccess:function  (result)
	{ 
	} ,
	onFail: function  (error)
	{ 
		error(error); 
	}
};

function toggleBar(){
	if($IDE.project.bar == 1){
		$IDE.project.bar = 0;
		$$('#project-float-img')[0].className = "icon icon-plus";
		$$('.hides').hide();
	}else{
		$IDE.project.bar = 1;
		$$('#project-float-img')[0].className = "icon icon-minus";
		$$('.hides').show();	
	}
}

function about(){
	alert('JsMobileBasic IDE <br/>'+/*/device.platform+/*/'<br/>version: '+$IDE.version+'<br/>by PROPHESSOR');
};

//Создание проекта
function newProject(){
	$$$.prompt('Введите имя проекта (только латиница)',function(filename){
	if(filename !== ''){
		$IDE.project = filename;
		$IDE.projectFile = filename+'.mbp';
		$Project.name = filename;
		mainView.loadPage('project.html');
		$$('#title').html($Project.name);
		$$('#pname').val($Project.name);
		psave();
		return true;
	}else{
		return false;
	}
	});
}

//Открытие проекта
function loadProject(){
	$$$.prompt('Введите имя проекта (только латиница)',function(filename){
	if(filename !== ''){
		$IDE.project = filename;
		$IDE.projectFile = filename+'.mbp';
		pload();
		mainView.loadPage('project.html');
		$$('#title').html($Project.name);
		$$('#pname').val($Project.name);
		return true;
	}else{
		return false;
	}
	});

};

function package_json(){
	var tmp = {
		author:$Project.author
	};
	var json = toJSON(tmp);
	FileAPI.writeFile("package.json",json);
}

//Project#1

function AutorunExample(){
	var example = '// * ==================JsMobileBasic Script================= * \\\\\n\n\
function Main(){\n    //Этот код выполнится единожды при запуске\n}\n\n\
function Loop(){\n    //Этот код выполняется в цикле\n}';
	$$('#code').html(example);
}

//Project#3
function newFile(file){
	if(typeof file === "undefined"){
	$$$.prompt('Введите имя файла (только имя)',function(e){
		if(e != ''){
			$$('#filelist')[0].innerHTML+='<li><a href="#" class="item-link" onclick="checkFile(this)"><div class="item-content"><div class="item-media"><i class="icon icon-file"></i></div><div class="item-inner"> <div class="item-title">'+e+'.bas</div></div></div></a></li>';
			$Project.files[e+'.bas']="// * ==================JsMobileBasic Script================= * \\";
		}
	});
	}else{
		$$('#filelist')[0].innerHTML+='<li><a href="#" class="item-link" onclick="checkFile(this)"><div class="item-content"><div class="item-media"><i class="icon icon-file"></i></div><div class="item-inner"> <div class="item-title">'+file+'.bas</div></div></div></a></li>';
		
	}
};

function openFile(){
	$$('#code').val($Project.files[$IDE.project.current_file]);
};

function saveFile(){
	$Project.files[$IDE.project.current_file] = $$('#code').val();
	psave();
}

function checkFile(el){
	var file = el.getElementsByClassName('item-title')[0];
	$IDE.project.current_file = file.innerHTML;
	var li = el.parentNode.parentNode.getElementsByClassName('item-title');
	log(li.innerHTML);
	for(i in li){
		$$(li[i]).removeClass('checked');
	}
	$$(file).addClass('checked');
	openFile();
}

function loadFiles(){
	
}

function exit(){
	$$$.confirm('Подтвердите выход',function(){
		window.close();
	});
};

//Сохранение/открытие проекта
function psave(){
	var project = toJSON($Project);
	FileAPI.writeFile($IDE.projectFile,project);
	info('Проект успешно сохранён!');
};

function pload(){
	logError('pload '+$IDE.projectFile);
	FileAPI.readFile($IDE.projectFile);
	log('<orange>Waiting for callback...</orange>');
};

function ploadCallback(){
	log('<yellow>Callback!</yellow>');	
	$Project = FileAPI.output.json;
	ploadSettings();
};

//Настройки проекта

function psaveSettings(){
	var pname = $$('#pname').val(),
		pdesc = $$('#pdesc').val(),
		pauth = $$('#pauth').val(),
		pver = $$('#pver').val(),
		purl = $$('#purl').val(),
		pcode = $$('#code').val();
	$Project.name = pname;
	$Project.author = pauth;
	$Project.description = pdesc;
	$Project.version = pver;
	$Project.url = purl;
	$Project.autorun = pcode;
	psave();
	info('Проект успешно сохранён!');
}

function ploadSettings(){
	log('ploadSettings');
	$$('#pname').val($Project.name),
	$$('#pdesc').val($Project.author),
	$$('#pauth').val($Project.description),
	$$('#pver').val($Project.version),
	$$('#purl').val($Project.url);
	$$('#code').val($Project.autorun);
	log('$Project: '+toJSON($Project));
}
/*
// Менеджер проекта


function doc(){
	iab = window.open('http://vk.com/JsMobileBasic', '_blank ', 'location = yes ');
    //iab.addEventListener('loadstart', loadStart);
    //iab.addEventListener('loadstop', loadStop);
    iab.addEventListener('loaderror', function(){
		logError('Ошибка сети! <yellow>Принимаю меры безопасности против вылета IDE!</yellow>');
		alert('Возникла ошибка сети при загрузке документации!\nПроверте ваше сетевое подключение.','','Ошибка сети','Назад');
		window.location.hash = '#main';
	});
    iab.addEventListener('exit', function (){
		window.location.hash = '#main';
	});
}

function showSplash(mode){
	mode ? navigator.splashscreen.show() : navigator.splashscreen.hide();
}
*/


/*
Идеи по поводу автодополнения:

Functions function [] {} () ; 

*/
