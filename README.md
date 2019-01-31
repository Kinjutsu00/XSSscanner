# XSSscanner

A messy web application that just do his work	correctly and in just 50 seconds.

This is a free software, do everythig you want, modify it, change it, share it, BUT:

	Be conscious!	
	You can test a site only if you are the owner or if the owner formally asks you!
	I do not take any responsibility of your usage. 

This app work only with a site that has form, a site without form will stall this app.

First install nodeJS if you do not already have it, and then run:
	
	:~$ node server.js

so just type on your browser:

	localhost:5050

Now in front of you there is a very user-friendly and immediate interface, 
you will understand immediately where you have to copy the target site URI. 


This app only accept link with this form:
	
	http://example.com
	https://example.com
	www.example.com
	example.com

This form with the "/" at the end will not work: 

	This is not good:   {everything}.com/    



If you have a really slow or busy network this application may not work.


# The Payload it tests are:
-        <script>alert(\"patchThis\")</script>
-        \"></script><script>alert(\"patchThis\");\"
-        <img src=\"javascript:alert(\'patchThis\')\"></img>
-        \' onerror=\'alert(\"patchThis\")\'>
-        <img src=\"http://ineeexist.ent\" onerror=\"javascript:alert(\"patchThis\")\"/>
-        %3cscript%3ealert(\"patchThis\")%3c/script%3e
-        javascript:alert(\"patchThis\")
-        <b onmouseover=alert(\'patchThis\')>click me!</b>
-        <script type=\"text/vbscript\">alert(\'patchThis\')</script>


## Preview: 
This is the web interface:

![screenshot from 2018-05-15 18-21-57](https://user-images.githubusercontent.com/40428406/41969055-8b86c310-7a06-11e8-9a1d-953bd30a1357.png)

and then in the same page:

![screenshot from 2018-06-10 11-38-33](https://user-images.githubusercontent.com/40428406/41969038-807bed1a-7a06-11e8-9ca7-bb5d31f623be.png)

this is a result example, shown in another page:

![screenshot from 2018-06-10 14-46-31](https://user-images.githubusercontent.com/40428406/51487992-af09ae00-1da4-11e9-8398-d26f9c526c25.png)


Note: You can try XSS on this application, in fact it does not check your input typed the target form
