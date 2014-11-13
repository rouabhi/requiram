# requiram #
A node.js package to concatenate and uglify all files of require.js project and serve them as a unique file + a requiram.js tiny library to make them run.

If you are using require.js library front end and node.js back end and you want to make it live but you dont want to get a server request for each and every module loading. This may become very time consuming when you scale up your application.
You should then concatenate and compress your modules and make them work on the front end.
**requiram** permits to solve this problem very quickly, with almost no change in your code.

## How does it work ? ##
First you should create a ```.json``` file with the list of your modules to be included and the module to be launch on initialization.

Let's say you want to generate the file `app.js`. You should then create a file named `app.json` and put it in the source directory with all your modules:
```javascript
{
        "modules":["module1","module2","module3"],
        "startup":"main"
}
```
If you give a startup module, like here *main.js*, the module is launched when the file is loaded.

In the ```node.js``` part, you have to use Requiram **middleware**.
```javascript
app.use( '/requiram', requiram.static({
                        src:__dirname+'/sourceDirectory',
                        dest:__dirname+'/destinationDirectory'
                    }) );
```

The middleware is now mounted to the path ```/requiram```. In your HTML file you should include these 2 lines:
```html
<script type="text/javascript" src="/requiram/lib.js"></script>
<script type="text/javascript" src="/requiram/app.js"></script>
```
The **lib.js** should be added once, in the top of the list, to permit to your modules to work.

## What if my modules are modified?##
The final file (here app.js) is created on the first time it is invoqued. Modification date is not checked. So to rebuild it, you should just just relaunch **node.js**.