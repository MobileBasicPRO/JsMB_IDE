function Project(param) {
	this.projectName = param.name || 'project1';
	this.author = param.author || 'MobileBasicPRO';
	this.description = param.description || 'Description';
	this.version = param.version || '1.0.0';
	this.url = param.url || 'https://vk.com/JsMobileBasic';
	
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

Project.prototype.generateManifest = function () {};

Project.prototype.generateFile = function (file) {
	//
};

Project.prltotype.addFile = function (file) {
	if(this.files.indexOf(file) === -1) this.files.push(file);
	this.generateFile(file);
};

Project.prototype.saveFile = function (file) {
	//
};

Project.prototype.loadFile = function (file) {
	//
};
