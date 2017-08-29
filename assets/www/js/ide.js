var $IDE = {
		version: '1.1',
		projectName: 'project1', //Дефолтное имя проекта
		projectFile: 'project1.mbp', //Дефолтное имя файла проекта
		devCounter: 0, //Счётчик нажатий "куда надо"
		devBuild: true, //Показать консоль отладки
		debugFunction: function () {
			alert('test');
		},
		JsMB_version: "Alpha 10.1" //$JsMobileBasic.version //Версия билда JsMB
	},
	//Объектное представление файла проекта
	$Project = {
		name: $IDE.projectName,
		author: 'MobileBasicPRO',
		version: '1.0',
		description: 'Test project',
		url: 'vk.com/JsMobileBasic',
		files: {
			"Autorun.bas": "// * ==================JsMobileBasic Script================= * \\" //Главный файл
			/* Формат: "${file}":"${data}"*/
		},
		JsMB_version: $IDE.JsMB_version //Версия JsMB при создании проекта
	};


var $$$ = new Framework7({
	modalTitle: 'JsMobileBasic-IDE',
	material: true,
});
var $$ = Dom7;
var mainView = $$$.addView('.view-main', {
	dynamicNavbar: true
});


//Рендер страницы проекта
$$$.onPageInit('project', function (page) {
	Project._opened = true;
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
	Project.Files.loadList();
	Project._current_file = "Autorun.bas";
});

//Функции для замены и удобства
{
	window.alert = $$$.alert;

	function log(text) {
		$$('#console').append("# " + text + '<br/>');
		return text;
	}

	function info(text) {
		$$$.addNotification({
			message: '<blue>' + text + '</blue>',
			button: {
				text: 'Закрыть',
				//                color: 'yellow'
			}
		});
	}

	function error(text) {
		$$$.addNotification({
			message: '<red>Ошибка: ' + text + '</red>',
			button: {
				text: 'Закрыть',
				//                color: 'yellow'
			}
		});
	}

	function warn(text) {
		$$$.addNotification({
			message: '<yellow>Предуприждение: ' + text + '</yellow>',
			button: {
				text: 'Закрыть',
				//                color: 'yellow'
			}
		});
	}

	function soon() {
		alert('К сожалению данная возможность недоступна в версии' + $IDE.version + '...<br/> Зайдите в группу vk.com/JsMobileBasic для проверки обновлений ;)');
	};

	function toJSON(object) {
		try {
			var tmp = JSON.stringify(object, '', 4);
			return tmp;
		} catch (e) {
			log('<red>' + e + '</red>');
			return false;
		}
	}

	function parseJSON(json) {
		try {
			var tmp = JSON.parse(json);
			return tmp;
		} catch (e) {
			log('<red>' + e + '</red>');
			return false;
		}
	}

	function gotoURL(url) {
		//TODO: Write me!
		log("gotoURL " + url);
	}

	// console.log = log;
	// console.error = log;
	// window.onerror = log;
	//log = console.log;
	var logError = log;
}

//Для нативных функций, пока не иммет смысла

/*var $Native = {
	print: function (msg) {
		cordova.exec(this.onSuccess, this.onFail, "Toast", "nativeAction", [msg]);
	},
	onSuccess: function (result) {
	},
	onFail: function (error) {
		error(error);
	}
};*/

var App = {
	about: function () {
		alert('JsMobileBasic IDE <br/>' + /*/device.platform+/*/ '<br/>version: ' + $IDE.version + '<br/>by PROPHESSOR');
	},
	exit: function () {
		$$$.confirm('Подтвердите выход', function () {
			window.close();
		});
	},
	toggleBar: function () {
		if (Project._bar == 1) {
			Project._bar = 0;
			$$('#project-float-img')[0].className = "icon icon-plus";
			$$('.hides').hide();
		} else {
			Project._bar = 1;
			$$('#project-float-img')[0].className = "icon icon-minus";
			$$('.hides').show();
		}
	}
};

var Keyboard = {
	_state: false,

	toggle: function () {
		log("Keyboard=>Toggle");
		this._state = !this._state;
		$$$.pickerModal('.keyboard-modal');
	},

	key: function (key) {
		//TODO: Распознавания нажатия клавиш
	}
};

//Работа с проектом
var Project = {
	_bar: 1,
	_opened: false,
	_current_file: "Autorun.bas",

	New: function () { //Создание из меню
		$$$.prompt('Введите имя проекта (только латиница)', function (filename) {
			if (filename !== '') {
				$IDE.project = filename;
				$IDE.projectFile = filename + '.mbp';
				$Project.name = filename;
				mainView.loadPage('project.html');
				$$('#title').html($Project.name);
				$$('#pname').val($Project.name);
				Project.save();
				return true;
			} else {
				return false;
			}
		});
	},
	load: function () { //Открытие из меню
		$$$.prompt('Введите имя проекта (только латиница)', function (filename) {
			if (filename !== '') {
				$IDE.project = filename;
				$IDE.projectFile = filename + '.mbp';
				Project.open();
				mainView.loadPage('project.html');
				$$('#title').html($Project.name);
				$$('#pname').val($Project.name);
				return true;
			} else {
				return false;
			}
		});

	},
	open: function () { //Открытие файла проекта
		function callback() {
			log('<yellow>Callback!</yellow>');
			$Project = FileAPI.output.json;
			Project.Settings.load();
		}
		logError('pload ' + $IDE.projectFile);
		FileAPI.readFile($IDE.projectFile);
		log('<orange>Waiting for callback...</orange>');
	},
	save: function () { //Сохранение файла проекта
		var project = toJSON($Project);
		FileAPI.writeFile($IDE.projectFile, project);
		info('Проект успешно сохранён!');
	},
	Settings: {
		save: function () {
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
			Project.save();
			info('Проект успешно сохранён!');
		},
		load: function () {
			log('ploadSettings');
			$$('#pname').val($Project.name),
				$$('#pdesc').val($Project.author),
				$$('#pauth').val($Project.description),
				$$('#pver').val($Project.version),
				$$('#purl').val($Project.url);
			$$('#code').val($Project.autorun);
			log('$Project: ' + toJSON($Project));
		}
	},
	Files: { // 3 Вкладка управления проектом
		New: function (file) {
			if (typeof file === "undefined") {
				$$$.prompt('Введите имя файла (только имя)', function (e) {
					if (e != '') {
						$$('#filelist')[0].innerHTML += '<li><a href="#" class="item-link" onclick="Project.Files.check(this)"><div class="item-content"><div class="item-media"><i class="icon icon-file"></i></div><div class="item-inner"> <div class="item-title">' + e + '.bas</div></div></div></a></li>';
						$Project.files[e + '.bas'] = "// * ==================JsMobileBasic Script================= * \\";
					}
				});
			} else {
				$$('#filelist')[0].innerHTML += '<li><a href="#" class="item-link" onclick="checkFile(this)"><div class="item-content"><div class="item-media"><i class="icon icon-file"></i></div><div class="item-inner"> <div class="item-title">' + file + '.bas</div></div></div></a></li>';

			}
		},
		open: function () {
			$$('#code').val($Project.files[Project._current_file]);
		},
		save: function () {
			$Project.files[Project._current_file] = $$('#code').val();
			Project.save();
		},
		check: function (el) {
			var file = el.getElementsByClassName('item-title')[0];
			Project._current_file = file.innerHTML;
			var li = el.parentNode.parentNode.getElementsByClassName('item-title');
			log(li.innerHTML);
			for (i in li) {
				$$(li[i]).removeClass('checked');
			}
			$$(file).addClass('checked');
			this.open();
		},
		loadList: function () {
			//TODO: Написать загрузку списка файлов из {$Project.files}
		}
	}
};

//Работа с кодом (1 вкладка работы с проектом)
var Code = {
	example: function () {
		var example = '// * ==================JsMobileBasic Script================= * \\\\\n\n\
function Main(){\n    //Этот код выполнится единожды при запуске\n}\n\n\
function Loop(){\n    //Этот код выполняется в цикле\n}';
		$$('#code').html(example);
	},
	beautify: function () {
		//TODO: Здесь должен быть код для оформления кода
	}
};

//Не помню зачем, но это, наверно, надо =)

/*function package_json() {
	var tmp = {
		author: $Project.author
	};
	var json = toJSON(tmp);
	FileAPI.writeFile("package.json", json);
}*/

/*
// Менеджер проекта

*/
function doc() {
	iab = window.open('http://vk.com/JsMobileBasic', '_blank ', 'location = yes,zoom=no');
	//iab.addEventListener('loadstart', loadStart);
	//iab.addEventListener('loadstop', loadStop);
	iab.addEventListener('loaderror', function () {
		logError('Ошибка сети! <yellow>Принимаю меры безопасности против вылета IDE!</yellow>');
		alert('Возникла ошибка сети при загрузке документации!\nПроверте ваше сетевое подключение.', '', 'Ошибка сети', 'Назад');
		window.location.hash = '#main';
	});
	iab.addEventListener('exit', function () {
		window.location.hash = '#main';
	});
}
/*

function showSplash(mode){
	mode ? navigator.splashscreen.show() : navigator.splashscreen.hide();
}
*/


/*
Идеи по поводу автодополнения:

Functions function [] {} () ; 

*/