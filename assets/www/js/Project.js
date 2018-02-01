function Project(param) {
	if(typeof param !== 'object') param = {};
	this.projectName = param.name || 'project1';
	this.author = param.author || 'MobileBasicPRO';
	this.description = param.description || 'Description';
	this.version = param.version || '1.0.0';
	this.url = param.url || 'https://vk.com/JsMobileBasic';
	this.projectPath = param.path || './';
	
	this.manifest = param.manifest || 'package.json';
	
	this.files = param.files || ['Autorun.bas'];
}

Project.prototype.save = function () {
	this.files.forEach(function (file) {
		this.saveFile(file);
	});
};

Project.prototype.load = function () {
	this.files.forEach(function (file) {
		this.loadFile(file);
	});
};

Project.prototype.generateManifest = function () {
	var manifest = {
		main: "index.html",
		author: this.author,
		name: this.projectName.toLowerCase(),
		version: this.version,
		description: this.description,
		url: this.url, // FIXME:
		jsmb:{
			version: $IDE.JsMB_version,
			ide: 'mobile',
			ide_version: $IDE.version
		}
	};
	
	return JSON.stringify(manifest, 0, 4);
};

Project.prototype.generateFile = function (file) {
	//
};

Project.prototype.addFile = function (file) {
	if(this.files.indexOf(file) === -1) this.files.push(file);
	this.generateFile(file);
};

Project.prototype.saveFile = function (file) {
	//
};

Project.prototype.loadFile = function (file) {
	//
};
