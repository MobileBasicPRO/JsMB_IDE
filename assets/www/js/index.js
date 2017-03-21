var $IDE = {
	version: '0.1',
	projectName: 'project1',
	projectFile: 'project1.mbp',
	devCounter: 0,
	devBuild: true,
	debugFunction: function() {alert('test');},
	JsMB_version: $JsMobileBasic.version
},
	$Project = {
		name:$IDE.projectName,
		author:'MobileBasicPRO',
		version:'1.0',
		description:'Test project',
		url: 'vk.com/JsMobileBasic',
		autorun:'',
		files:{
			$list:''
		},
		JsMB_version: $IDE.JsMB_version
	};
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
		alert("ERROR: \r\n" + error); 
	}
};

//Обработчики событий
//document.addEventListener("error", logError, false);
document.addEventListener("deviceready", onFullLoad, false);

try{

function info(){
	$IDE.devCounter++;
	alert('JsMobileBasic IDE \n'+device.platform+'\nversion: '+$IDE.version+'\nby PROPHESSOR');
	if($IDE.devCounter >= 7){
		info = function(){
			window.location.hash = '#developer';
		};
	};
};

function logError(error){
	var cmd = document.getElementById('errors');
	cmd.innerHTML+='<yellow>#</yellow><red>'+error+'<br/>';
};

function soon(){
	navigator.notification.alert('К сожалению данная возможность недоступна в версии'+$IDE.version+'...\n Зайдите в группу vk.com/JsMobileBasic для проверки обновлений ;)','','Ждите в следующих версиях','Понятно');
};

function onError(e){
	alert("Error: "+e+' '+e.error);
};
function exit(){
	window.close();
};

function PhoneGapTest(){
	debugFunction();
};

function obj(text){
	alert(toJSON(text));
};

function onFullLoad(){
	$IDE.devBuild = false;
};

//Создание проекта
function newProject(){
	var filename = prompt('Введите имя проекта (только латиница)');
	if(filename || $IDE.devBuild){
		$IDE.projectFile = filename+'.mbp';
		$Project.name = filename;
		document.getElementById('pname').value = $Project.name;
		psave();
		window.location.hash = '#psettings';
	};
};

//Открытие проекта
function loadProject(){
	logError('loadProject');
	var filename = prompt('Введите имя проекта (только латиница)');
	if(filename || $IDE.devBuild){
		try{
		$IDE.projectName = filename;
		$IDE.projectFile = filename+'.mbp';
		window.location.hash = '#psettings';
		pload();
		}catch(e){logError('Открытие проекта:');}
	};
};

//Сохранение/открытие проекта
function psave(){
	var project = toJSON($Project);
	FileAPI.writeFile($IDE.projectFile,project);
	logError('</red><green>Проект успешно сохранён</green><red>');
};

function pload(){
	logError('pload '+$IDE.projectFile);
	FileAPI.readFile($IDE.projectFile);
	logError('<orange>Waiting for callback...</orange>');
};

function ploadCallback(){
	logError('<yellow>Callback!</yellow>');	
	$Project = FileAPI.output.json;
	ploadSettings();
};

//Настройки проекта

function psaveSettings(){
	var pname = document.getElementById('pname').value,
		pdesc = document.getElementById('pdesc').value,
		pauth = document.getElementById('pauth').value,
		pver = document.getElementById('pver').value,
		purl = document.getElementsByName('purl').value;
		pcode = document.getElementById('code').innerHTML;
	$Project.name = pname;
	$Project.author = pauth;
	$Project.description = pdesc;
	$Project.version = pver;
	$Project.url = purl;
	$Project.autorun = pcode;
	psave();	
	//navigator.notification.alert('Проект успешно сохранён!','','Сохранение','Ок');
	$Native.print('Проект успешно сохранён!');
}

function ploadSettings(){
	logError('ploadSettings');
	document.getElementById('pname').value = $Project.name,
	document.getElementById('pdesc').value = $Project.author,
	document.getElementById('pauth').value = $Project.description,
	document.getElementById('pver').value = $Project.version,
	document.getElementsByName('purl').value = $Project.url;
	document.getElementById('code').innerHTML = $Project.autorun;
	logError('$Project: '+toJSON($Project));
}
// Менеджер проекта
function newFile(){
  try{
	var name = prompt('Введите имя файла (только имя)');
	if(name){
		var flist = document.getElementById('flist');
	/*	var label = document.createElement('label');
		var input = document.createElement('input');*/
		var count = 1;
	/*	label.setAtribute('for','fselect-'+count);
		label.innerHTML += name+'.bas';
		input.type="radio";
		input.name = 'fselect';
		input.id = "fselect-"+count;
		flist.appendChild(label);
		flist.appendChild(input);
	*/
		flist.innerHTML += '<label for="fselect-"'+count+'>'+name+'.bas</label>';
		flist.innerHTML += '<input type="radio" name="fselect" value="on" id="fselect-'+count+'"/>';
		logError(flist.innerHTML);
		};
  }catch(e){
			logError('Ошибка при создании нового файла! Ошибка: '+e);
	};
};
function devget(){
	var input = document.getElementById('getinput').value;
	try{
	alert(toJSON(eval(input)) || eval(input));
	}catch(e){
		logError(e);
		//logError();
	}
}

function AutorunExample(){
	var code = document.getElementById('code');
	var example = '// * ==================JsMobileBasic Script================= * \\\\\n\n\
function onMouseMove(x,y){\n    //Этот код выполнится при движении мыши\n}\n\n\
function onMouseDown(x,y){\n    //Этот код выполнится при нажатии любой клавиши мыши\n}\n\n\
function onMouseUp(x,y){\n    //Этот код выполнится при отжатии любой клавиши мыши\n}\n\n\
function onClick(x,y){\n	\n}\n\n\
function onRightClick(x,y){\n    //Этот код выполнится при правом клике\n}\n\n\
function onKeyPress(code){\n    //Этот код выполнится при нажатии клавиши на клавиатуре\n}\n\n\
function Main(){\n    //Этот код выполнится единожды при запуске\n}\n\n\
function Loop(){\n    //Этот код выполняется 10 раз в секунду (будьте осторожны!)\n}';
	code.innerHTML = example;
	cm();
}

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

console.log = logError;
console.error = logError;
console.warn = logError;
}catch(e){
	logError(e);
}
