# jquery.repo
##jQuery plugin to allow using cdn.rawgit.com to get the latest commit of a github repo 

github won't let you hotlink to their site directly; raw.githubusercontent.com sends its content with a `X-Content-Type-Options:nosniff` header, so modern browsers won't accept it as javascript.

http://rawgit.com gets around that by pulling the raw file and re-serving it with more lenient headers, but the rate is throttled so you can't use it on public sites. http://cdn.rawgit.com isn't throttled but is cached, permanently. Once a given URL is fetched, it stays in the cache and if the file is updated on github, it won't be on cdn.rawgit.com . So having a script tag `<script src="http://cdn.rawgit.com/user/repo/master/file.js">` lets you get the script from github, but even when the master branch is updated, the script retrieved will remain the same.

The answer is to use a specific tag or commit in the script tag: `<script src="http://cdn.rawgit.com/user/repo/abc1234/file.js">` and change that when the underlying repo is updated. But that is terribly inconvenient.

`$.repo` uses the github API to get the SHA for the latest commit to the master, and returns the appropriate URL:
````javascript
var repo = $.repo('user/repo');
$.getScript(repo+'/file.js');
````

The github api is also rate-limited (to 60 requests an hour from a given IP address), so the repo address is cached for fixed period of time (default 1 hour), with the value saved in localStorage.

````javascript
var repo = $.repo('user/repo', time); // if the cached value is more than time msec old, get a new one
repo = $.repo('user/repo', 0); // force a refresh from github's server

