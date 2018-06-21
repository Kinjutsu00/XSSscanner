# XSSscanner

A messy and not optimized web application that just do his work	correctly and in just 50 seconds.

You can test a site only if you are the owner or if the owner asks you!

This app work only with a site that has form, a site without form will stall this app

First install nodeJS if you do not have it, and then:
	$node server.js
so just type in the browser:
	localhost:5050
and now you can copy the target link and get the result

This app only accept link with this form:
	
	http://example.com
	https://example.com
	www.example.com
	example.com

This form with the "/" at the end will not work: 
	{everything}.com/

If you have a really slow or busy network this may not work.
