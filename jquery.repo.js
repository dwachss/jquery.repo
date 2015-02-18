// Copyright (c) 2015 Daniel Wachsstock
// MIT license:
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

(function($){

$.fn.repo = function (user, time){
	var repo = 'https://cdn.rawgit.com/'+user+'/',
		deferred = $.Deferred(),
		localName = '$.repo.'+user,
		sha = localStorage[localName];
	if (arguments.length == 1) time = 1000*60*60; // one hour

	if (sha && +localStorage[localName'.time'] + time > +new Date){
		deferred.resolve(sha);
	}else{
		$.get('https://api.github.com/repos/'+user+'/git/refs/heads/master').then(function(data){
			localStorage[localName] = data.object.sha;
			localStorage[localName+'.time'] = +new Date;
			deferred.resolve(data.object.sha);
		});
	};
	return deferred;
}

})(jQuery);
