/*******************************************************
 * DmSyntax 1.0 - Подсветка синтаксиса
 *                (JavaScript версия)
 *
 * Copyright (c) 2008, Dema (Dema.ru)
 * Лицензия LGPL для любого использования
 *
 *******************************************************/
(function($)
{
	/*
	 * $(...).DmSyntax - Набор функций для подветки синтаксиса содержимого элементов
	 * Для работы использует объект $.DmSyntax
	 *-------------------------------------------------------------------------------
	 * $(...).DmSyntaxJS   - Для JavaScript файлов
	 * $(...).DmSyntaxCS   - Для C# файлов
	 * $(...).DmSyntaxCSS  - Для CSS файлов
	 * $(...).DmSyntaxXML  - Для XML файлов
	 * $(...).DmSyntaxHTML - Для HTML файлов (объединение JS, CSS и XML)
	 * $(...).DmSyntax     - Определяет синтаксис по атрибуту class
	 *-------------------------------------------------------------------------------
	 * Использование:
	 * $('pre.js').DmSyntaxJS();
	 * Автоопределение синтаксиса:
	 * $('pre').DmSyntax();
	 *    будут обработаны все PRE теги, синтаксис будет подсвечен только если атрибут
	 *    class имеет одно из значений: js, cs, css, xml, html, регистр неважен.
	 * ВНИМАНИЕ! Если у вас jQuery версии ниже 1.6, то вам нужно строку 42
	 *         s		= i.attr('class');
	 * изменить так:
	 *         s		= i.attr('className');
	 */
	$.fn.extend({
		DmSyntaxJS:		function(d)	{ return extend_run(this, $.DmSyntax, 'JS', d);   },
		DmSyntaxCS:		function(d)	{ return extend_run(this, $.DmSyntax, 'CS', d);   },
		DmSyntaxCSS:	function(d)	{ return extend_run(this, $.DmSyntax, 'CSS', d);  },
		DmSyntaxXML:	function(d)	{ return extend_run(this, $.DmSyntax, 'XML', d);  },
		DmSyntaxHTML:	function(d)	{ return extend_run(this, $.DmSyntax, 'HTML', d); },
		DmSyntax:		function(decorators)
		{
			var i, s, f, o		= $.DmSyntax;
			return this.each(function()
					{
						i		= $(this);
						s		= i.attr('class');
						if(s==null) return ;
						s		= cssre.exec(s);
						if(s==null) return ;
						f		= o[s[0].toUpperCase()];
						if(f!=null)
						{
							i.html(f.call(o, i.html().replace(/&(lt|gt|amp|quot);/g, getHTMLEn), decorators?decorators[s]:null));
						}
					});
		}
	});

	/*
	 * $.DmSyntax - Набор функций для подветки синтаксиса
	 *----------------------------------------------------
	 * $.DmSyntax.JS   - Для JavaScript файлов
	 * $.DmSyntax.CS   - Для C# файлов
	 * $.DmSyntax.CSS  - Для CSS файлов
	 * $.DmSyntax.XML  - Для XML файлов
	 * $.DmSyntax.HTML - Для HTML файлов (объединение JS, CSS и XML)
	 *----------------------------------------------------
	 * Использование:
	 * var html = $.DmSyntax.JS('alert("Hello!");');
	 */
	$.DmSyntax					= {
		JS: function(code, decorator)
		{
			return this._JSlikeSyntax(code, 'function|case|if|return|new|switch|var|this|typeof|for|in|while|break|do|continue|null|true|false', decorators.JS, decorator);
		},
		CS: function(code, decorator)
		{
			return this._JSlikeSyntax(code, 'public|private|protected|internal|virtual|override|class|using|namespace|void|is|as|string|'+
											'int|float|double|decimal|foreach|object|enum|interface|static|base|null|case|if|return|new|'+
											'switch|var|this|typeof|for|in|while|break|do|continue|get|set|true|false|value', decorators.CS, decorator);
		},
		_JSlikeSyntax: function(code, keywords, decorator1, decorator2)
		{
			var decorator		= $.extend({}, decorator1, decorator2);	// Строим объект декоратора
			var all				= [];									// Тут собираем все каменты, строки, RegExp

			// Маскируем HTML
			code				= makeSafe(TrueTabs(correctRN(code)))
				// Убираем многострочные каменты
				.replace(/\/\*([\s\S]*?)\*\//g, function(m)
					{ return "\0B"+push(all, multiline_comments(m, decorator.rem))+'\0'; })
				// Убираем однострочные каменты
				.replace(/([^\\]|^)(\/\/[^\n]*)(\n|$)/g, function(m, f, t, e)
					{ return f+"\0B"+push(all, decorator.rem(t))+'\0'+e; })
				// Убираем regexp и строки
				.replace(/(\/(\\\/|[^\/\n])*\/[gim]{0,3})|(([^\\])((?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*")))/g, function(m, r, d1, d2, f, s)
					{
						if (r!=null && r!='')
						{
							s	= decorator.re(r);
							m	= "\0B";
						} else
						{
							s	= decorator.str(s);
							m	= f+"\0B";
						}
						return m+push(all, s)+'\0';
					})
				// Выделяем ключевые слова
				.replace(new RegExp('\\b('+keywords+')\\b', 'gi'),
					decorator.kw('$1'))
				// Выделяем скобки
				.replace(/(\{|\}|\]|\[|\|)/gi,
					decorator.gly('$1'))
				// Выделяем имена функций
				.replace(/([a-z\_\$][a-z0-9_]*)\(/gi,
					decorator.func('$1')+'(')
				// Возвращаем на место каменты, строки, RegExp
				.replace(/\0B(\d+)\0/g, function(m, i)
					{ return all[i]; });
			// Обрабатываем строки
			code				= decorator.lines(code.split('\n'));
			// Финальный аккорд
			return decorator.block(code);
		},
		XML: function(xml, decorator)
		{
			decorator			= $.extend({}, decorators.XML, decorator);	// Строим объект декоратора
			var all				= [];	// Тут собираем все каменты и cdata

			return decorator.block(
			// Обрабатываем строки
				decorator.lines(
			// Подготовка текста
					TrueTabs(correctRN(xml))
			// Убираем камменты
					.replace(/<!--([\s\S]*?)-->/g, function(m, t)
						{ return "\0B"+push(all, multiline_comments('&lt;!--' + makeSafe(t) + '--&gt;', decorator.rem))+'\0'; })
			// Убираем CDATA
					.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, function(m, d)
						{ return "\0B"+push(all, decorator.cdatao()+multiline_comments(makeSafe(d), decorator.cdata)+decorator.cdatac())+'\0'; })
			// Раскрашиваем тэги
					.replace(/<(((\?)?([a-z][a-z0-9:_-]*)([^>]*)\3)|(\/([a-z][a-z0-9:_-]*)[\s\n]*))>/g, function(m, a, o, d, no, p, c, nc)
						{
							if(d=='?')
								// Нашли определение
								return decorator.def(no, SyntaxXML_param(p, decorator));
							if(nc!=null && nc!='')
								// Закрываем тэг
								return decorator.tagc(nc);
							if(p==null || p=='')
								// Открываем тэг без параметров
								return decorator.tago(no, '', false);
							if(p.substring(p.length-1)=='/')
								// Открываем и закрываем тэг без содержимого
								return decorator.tago(no, SyntaxXML_param(p.substring(0, p.length-1), decorator), true);
							// Открываем тэг
							return decorator.tago(no, SyntaxXML_param(p, decorator), false);
						})
			// Возвращаем на место каменты, CDATA
					.replace(/\0B(\d+)\0/g, function(m, i)
						{ return all[i]; })	
			// Нарезаем строки
					.split('\n')
				)
			);
		},
		CSS: function(css, decorator)
		{
			decorator			= $.extend({}, decorators.CSS, decorator);	// Строим объект декоратора
			var comments		= [];	// Тут собираем все каменты

			return decorator.block(
			// Обрабатываем строки
				decorator.lines(
			// Подготовка текста
					makeSafe(TrueTabs(correctRN(css)))
			// Убираем камменты
					.replace(/\/\*([\s\S]*?)\*\//g, function(m, t)
						{ return "\0C"+push(comments, multiline_comments(m, decorator.rem))+'\0'; })
			// Раскрашиваем селекторы
					.replace(/([\.#:]{0,1}[a-z0-9_]+[^\{~\0]*)(\{)([^}]*)(\})/gi, function(m, sel, o, p, c)
						{
							return  multiline_comments(sel, decorator.sel)+o+SyntaxCSS_param(p, decorator)+c;
						})
			// Возвращаем на место каменты
					.replace(/\0C(\d+)\0/g, function(m, i)
						{ return comments[i]; })	
			// Нарезаем строки
					.split('\n')
				)
			);
		},
		HTML: function(html, decorator)
		{
			decorator			= $.extend({}, decorators.HTML, decorator);	// Строим объект декоратора
			var eq				= { script: 'JS', style: 'CSS' };
			var all				= [];	// Тут собираем все скрипты и стили
			var _this			= this;
			
			return this.XML(
					correctRN(html)
					// Для начала мы сохраним все блоки < script>...</ script> и < style>...</ style>, предварительно их подсветив
					// и результат обработаем через XML подсветку
					.replace(/<(script|style)([^>]*?)>(?:\s*\n)?([\s\S]*?)([\n]?\s*<\/\1>)/ig, function (m, s, p, t, e)
					{
						trace(eq[s]);
						return '<'+s+p+">\0X"+push(all, _this[eq[s]](t, decorator[eq[s]]))+'\0'+e;
					}),
					decorator.XML
				// В конце вернем все исходники JS и CSS
				).replace(/\0X(\d+)\0/g, function(m, i)
				{
					return all[i];
				});
		}
	};
	
	// Декораторы по-умолчанию.
	var decorators				= {
		JS:		{
			rem:    function(txt)	{ return '<span class="rem">'.concat(txt, '</span>');  },
			str:    function(txt)	{ return '<span class="str">'.concat(txt, '</span>');  },
			re:     function(txt)	{ return '<span class="re">'.concat(txt, '</span>');   },
			kw:     function(txt)	{ return '<span class="kw">'.concat(txt, '</span>');   },
			gly:    function(txt)	{ return '<span class="gly">'.concat(txt, '</span>');  },
			func:   function(txt)	{ return '<span class="func">'.concat(txt, '</span>'); },
			lines:  function(lines)	{ return lines.join('<br/>'); },
			block:  function(txt)	{ return '<div class="js">'.concat(txt.replace(/  /g, '&nbsp;&nbsp;'), '</div>'); }
		},
		XML:	{
			rem:    function(txt)	{ return '<span class="rem">'.concat(txt, '</span>'); },
			cdatao: function()		{ return '<span class="cdatao">&lt;![CDATA[</span>'; },
			cdata:	function(txt)	{ return '<span class="cdata">'.concat(txt, '</span>'); },
			cdatac: function()		{ return '<span class="cdatac">]]&gt;</span>'; },
			def:    function(n, p)	{ return '<span class="tag">&lt;?<span class="name">'.concat(n, '</span></span>', p, '<span class="tag">?&gt;</span>'); },
			tago:	function(n, p, e)
			{
				return '<span class="tag">&lt;<span class="name">'.concat(
						n, 
						'</span></span>', 
						p, 
						e?'<span class="tag">/&gt;</span>':'<span class="tag">&gt;</span>');
			},
			tagc:	function(n)		{ return '<span class="tag">&lt;/<span class="name">'.concat(n, '</span>&gt;</span>'); },
			param:  function(n, v)	{ return '<span class="attr"><span class="name">'.concat(n, '</span>=<span class="value">"', v, '"</span></span>'); },
			lines:  function(lines)	{ return lines.join('<br/>'); },
			block:  function(txt)	{ return '<div class="xml">'.concat(txt.replace(/  /g, '&nbsp;&nbsp;'), '</div>'); }
		},
		CSS:	{
			rem:    function(txt)	{ return '<span class="rem">'.concat(txt, '</span>'); },
			sel:    function(txt)	{ return '<span class="sel">'.concat(txt, '</span>'); },
			param:	function(n, v)	{ return '<span class="name">'.concat(n, '</span>:<span class="value">', v, '</span>'); },
			lines:  function(lines)	{ return lines.join('<br/>'); },
			block:  function(txt)	{ return '<div class="css">'.concat(txt.replace(/  /g, '&nbsp;&nbsp;'), '</div>'); }
		}
	};
	decorators.CS				= $.extend({}, decorators.JS, {
			block:  function(txt)	{ return '<div class="cs">'.concat(txt.replace(/  /g, '&nbsp;&nbsp;'), '</div>'); }
	});
	decorators.HTML				= {
			XML:	decorators.XML,
			CSS:	decorators.CSS,
			JS:		decorators.JS
	};

	// PRIVATE часть
	//===============
	var cssre					= /\bJS|CSS|XML|HTML|CS\b/i;
	// Список символов для маскирования
	var safe					= { '<': '&lt;', '>': '&gt;', '&': '&amp;' };
	var htmlen					= { '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"' };
	// Функция замены символов
	function getSafe(c)
	{
		return safe[c];
	}
	function getHTMLEn(m)
	{
		return htmlen[m];
	}
	// Маскировать HTML в строке
	function makeSafe(txt)
	{
		return txt.replace(/[<>&]/g, getSafe);
	}
	// В IE из блоков pre вместо \n приходит \r... в других браузерах иногда приходит пара \r\n - все нужно фиксить :(
	function correctRN(txt)
	{
		return txt.replace(/(\r\n|\r)/g, '\n');
	}
	// Обрабатываем многострочный камент как несколько однострочных
	function multiline_comments(txt, decorator)
	{
		txt						= txt.split('\n');
		for(var i=0; i<txt.length; i++)
			txt[i]				= decorator(txt[i]);
		return txt.join('\n');
	}
	// Добавляем элемент и возвращаем его индекс
	function push(arr, e)
	{
		arr.push(e);
		return arr.length-1;
	}
	// HTML для праметров тегов XML
	function SyntaxXML_param(txt, decorator)
	{
		return txt.replace(/([a-z][a-z0-9_-]*)[\s\n]*=[\s\n]*"([^"]*)"/g, function(m, n, v)
			{ return decorator.param(n, makeSafe(v)); });
	}
	// HTML для праметров CSS
	function SyntaxCSS_param(txt, decorator)
	{
		return txt.replace(/([^:\n]+):([^;]*)(;)?/g, function(m, n, v, e)
			{ return decorator.param(n, v).concat(e==null?'':e); });
	}
	// чем заполняем табы
	var truetabsstr				= '                                                        ';
	// поиск табов
	var truetabsre2				= /^([^\t\n]*)(\t+)/gm;
	// Получаем наполнитель табов нужной длинны
	function GetTrueTabs(len)
	{
		while(len>truetabsstr.length) truetabsstr += truetabsstr;
		return truetabsstr.substring(0, len);
	}
	// Поиск и замена табов
	function TrueTabs(txt)
	{
		var mached				= true;
		// Пока находим табы - крутимся в цикле
		while(mached)
		{
			mached				= false;
			txt					= txt.replace(truetabsre2, function(m, text, tabs)
									{
										mached	= true;
										// Внимание! Секретная формула вычисления длинны наполнителя :)
										return text + GetTrueTabs(tabs.length * 4 - text.length % 4);
									});
		}
		return txt;
	}
	// Функция призвана избавить от  copy - paste кода
	function extend_run(arr, obj, syntax, decorator)
	{
		var i;
		syntax					= obj[syntax];
		return arr.each(function()
					{
						i		= $(this);
						i.html(syntax.call(obj, i.text(), decorator));
					});
	}
})(jQuery);

/*
$Date: 2012-10-04 22:57:08 +0400 (Thu, 04 Oct 2012) $
$Revision: 432 $
$Author: Dema $
$HeadURL: https://localhost/svn/Personal/trunk/Dema.ru/wwwroot/_static/script/jquery.dmsyntax-1.0.js $
*/
