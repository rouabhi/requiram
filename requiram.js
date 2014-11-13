(function (){

 var modules={}, nextModule= null;

 window.define=function(dependencies , body){
  if (typeof dependencies === "function") {body=dependencies; dependencies=[];}
  if (typeof dependencies === "string") {nextModule= dependencies; return;}
  modules[ nextModule ] = {dependencies:dependencies, body:body,initialized:false};  
 }

 window.require=function( name ){
 	if (!modules[ name ]) return undefined;
 	if (!modules[ name ].initialized) {
 		 	var arg = [];
 		 	for(var i in modules[ name ].dependencies) {arg.push( require( modules[ name ].dependencies[i]));}
 		 	modules[ name ] ={body:modules[ name ].body.apply( null , arg), initialized:true}; 
 	}	 
	return modules[ name ].body;
 }
})();