# jquery.repo
##jQuery plugin to allow using cdn.rawgit.com to get the latest commit of a github repo 

github won't let you hotlink to their site directly; raw.githubusercontent.com sends its content with a `X-Content-Type-Options:nosniff` header, so modern browsers won't accept it as javascript.

http://rawgit.com gets around that by pulling the raw file and re-serving it with more lenient headers, but the rate is throttled so you can't use it on public sites. http://cdn.rawgit.com isn't throttled but is cached, permanently. Once a given URL is fetched, it stays in the cache and if the file is updated on github, it won't be on cdn.rawgit.com . So having a script tag `<script src="http://cdn.rawgit.com/user/repo/master/file.js">` lets you get the script from github, but even when the master branch is updated, the script retrieved will remain the same.

The answer is to use a specific tag or commit in the script tag: `<script src="http://cdn.rawgit.com/user/repo/abc1234/file.js">` and change that when the underlying repo is updated. But that is terribly inconvenient.

For stable libraries, that's not a problem, since they should be tagged with version numbers: `http://cdn.rawgit.com/user/repo/v1.0/file.js` and that's probably what you want. However, if you always want the latest version, that won't work.

`$.repo` uses the github API to get the SHA for the latest commit to the master, and returns a $.Deferred that resolved to the appropriate URL (with no trailing slash):
````javascript
$.repo('user/repo').then(function (repo){
	$.getScript(repo+'/file.js');
});
````

The github api is also rate-limited (to 60 requests an hour from a given IP address), so the repo address is cached for fixed period of time (default 1 hour), with the value saved in localStorage.

````javascript
$.repo('user/repo', time); // if the cached value is more than time msec old, get a new one
$.repo('user/repo', 0); // force a refresh from github's server
````

##`$.getScripts`
`$.getScript` is useful, but it is asynchronous, which means that you can't load scripts that depend on one another with:
````javascript
$.getScript('first.js');
$.getScript('second.js');
$.getScript('third.js');
````
You have to do:
````javascript
$.getScript('first.js').then(function(){
	return $.getScript('second.js');
}).then(function(){
	return $.getScript('third.js');
}).then(function(){
	// use the scripts
});
````

`$.getScripts(Array)` abstracts this out, so you can do:
````javascript
$.getScripts(['first.js', 'second.js', 'third.js']).then(function(){
	// use the scripts
});
````
It's basically a very simple script loader.
