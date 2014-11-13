function  requiram(){

}

 requiram.static=function(options){
 	var src=options.src,dest=options.dest, buitPackages=[];

 	src  += src.slice(-1)=="/"?"":"/";
 	dest += dest.slice(-1)=="/"?"":"/";
 	return middleware;

 	function doUglify( package ){
 		var result = [], uglifyJS = require("uglify-js");
 		for(var i in package.modules) {
 			result +="define(\""+package.modules[i]+"\");\n"+ uglifyJS.minify( src+package.modules[i]+".js").code+"\n";
 		}
		if (package.startup) result += "require(\""+package.startup+"\");";
		require("fs").writeFile(dest+package.name+".js", result, function(err){
			if(!err){
				buitPackages.push(package.name);
			}
		});
 		return result;
 	}

	function middleware(req, res, next){
		var packageName = req.url.match(/^\/[\w\.]+\.js$/);

		if (!packageName) {
			res.status(500);
			return;
		}
		packageName = packageName[0].slice(1,-3);
		if (packageName=="lib") {
			res.sendFile(__dirname+"/requiram.js");
			return;
		}
		if (buitPackages.indexOf( packageName )>=0) {
			res.sendFile(dest+packageName+".js");
			return;
		}

		var package     = require(src+packageName+".json");
		package.name = packageName;
		if (package.startup && package.modules.indexOf(package.startup)<0) package.modules.push( package.startup );
		res.status(200).type('.js').send(doUglify( package ));
	}
}

module.exports = requiram;