function  requiram(){

}

 requiram.static=function(options){
 	var src=options.src,
 		dest=options.dest,
 		json=options.json,
 		minify = (typeof options.minify === "undefined") ? true:options.minify,
 		builtPackages=[],
 		fs = require("fs");

 	src  += src.slice(-1)=="/"?"":"/";
 	dest += dest.slice(-1)=="/"?"":"/";
 	json += json ? (json.slice(-1)=="/"?"":"/"):src;
 	return middleware;

 	function doUglify( package ){
 		var result = [],
 			uglifyJS = require("uglify-js"),
 			filename;

 		for(var i in package.modules) {
 			filename = src+package.modules[i]+".js";
 			result += "define(\""+package.modules[i]+"\");"+
 					 (minify ? (uglifyJS.minify( filename ).code+"\n"):("\n"+fs.readFileSync( filename )+"\n"));
 		}
		if (package.startup) result += "require(\""+package.startup+"\");";
		fs.writeFile(dest+package.name+".js", result, function(err){
			if(!err){
				builtPackages.push(package.name);
			}
		});
 		return result;
 	}

	function middleware(req, res, next){
		var packageName = req.url.match(/\/[\w\.\-]+\.js$/);

		if (!packageName) {
			res.status(500);
			return;
		}
		packageName = packageName[0].slice(1,-3);
		if (packageName=="lib") {
			res.sendFile(__dirname+"/requiram.min.js");
			return;
		}
		if (builtPackages.indexOf( packageName )>=0) {
			res.sendFile(dest+packageName+".js");
			return;
		}

		var package     = require(json+packageName+".json");
		package.name = packageName;
		if (package.startup && package.modules.indexOf(package.startup)<0) package.modules.push( package.startup );
		res.status(200).type('.js').send(doUglify( package ));
	}
}

module.exports = requiram;