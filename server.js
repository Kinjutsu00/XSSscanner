//server.js
var canc=0;
var path = require('path');
var bodyParser = require('body-parser');
var request = require("request");
var rp = require('request-promise');
var express = require('express');
var app = express();
var targetSiteUrl;


app.use(bodyParser());

 app.use('/images', express.static(__dirname + '/images'));
 app.use('/assets', express.static(__dirname + '/assets'));
 app.use('/sendthis.txt', express.static(__dirname + '/sendthis.txt'));

  app.get('/', function(request, response){
        response.sendFile('index.html', {root: path.join(__dirname, './')});
        var fs = require('fs');
        var child_process = require('child_process');

        function runCmd(cmd)
        {
            var resp = child_process.execSync(cmd);
            var result = resp.toString('UTF8');
            return result;
        }


              if (fs.existsSync("sendthis.txt")) {
                    var cmdTwo = "rm sendthis.txt";
                    var operationTwo = runCmd(cmdTwo);
                    console.log(cmdTwo);
              }
              else{console.log("free");}

              if (fs.existsSync("indexx.html")) {
                    var cmdOne = "rm indexx.html";
                    var operationOne = runCmd(cmdOne);
                    console.log(cmdOne);
              }
              else{console.log("free");}

              canc=0;
  });

app.post('/result', function(request, response){
      response.sendFile('result.html', {root: path.join(__dirname, './')});
      var fs = require('fs');
      function finalrequest(gag ,array, metodo, action, targetSite, formName){
          var request = require("request");
          var parametri;
          if(metodo=='GET' || metodo=='GET'){
                for(var y=0; y<array.length; y++){
                  if(y==0){
                    parametri="?"+array[y] + "=";
                  }
                  else{
                    if(y%2==0){
                        parametri=parametri+"&"+array[y]+"=";
                    }
                    else{
                        parametri=parametri+array[y];
                    }
                  }
                }
                if(action=="" || action==" "){
                        request("http://" + targetSite + parametri , function(error, response, body) {
                      if(error){
                        console.log("ERRORE " + error);
                      }
                      else{
                        console.log(metodo+"    http://" + targetSite + parametri);
                        setTimeout(function(){
                        trova(gag, metodo, action ,targetSite, parametri, body, formName);
                        },5000);
                      }
                        });
                }
                else{
                        request("http://" + targetSite + action + parametri , function(error, response, body) {
                        if(error){
                          console.log("ERRORE " + error);
                        }
                        else{
                          console.log(metodo+"    http://" + targetSite + action + parametri);

                          setTimeout(function(){
                          trova(gag, metodo, action ,targetSite, parametri, body, formName);
                          },7000);
                        }
                        });
                }
          }
          else{
                  if(metodo=='POST' || metodo=='post'){
                                  parametri = array[0]+"=";
                                  for(var y=1; y<array.length; y++){
                                      if(y%2==0){
                                          parametri=parametri+"&"+array[y]+"=";
                                      }
                                      else{
                                          parametri=parametri+array[y];
                                      }
                                  }

                                  if(action=="" || action==" "){
                                        var k= array[0];
                                        var querystring = require('querystring');
                                        var http = require('http');
                                        var body=0;
                                        var data = querystring.stringify({
                                                      k: parametri,
                                                    });
                                        var options = {
                                            host: "http://"+ targetSite,
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'Content-Length': Buffer.byteLength(data)
                                            }
                                        };
                                        var req = http.request(options, function(res) {
                                            res.setEncoding('utf8');
                                            res.on('data', function (chunk) {
                                              setTimeout(function(){
                                                  body = chunk;
                                              },5000);
                                              console.log("body: " + chunk);
                                            });
                                        });
                                        req.write(data);
                                        req.end();
                                        console.log(metodo+"    http://" + targetSite + action + "  PARAMETRI: " + parametri);
                                        setTimeout(function(){
                                        trova(gag, metodo, action ,targetSite, parametri, body, formName);
                                        },7000);
                                    }
                                    else{
                                        var k= array[0];
                                        var querystring = require('querystring');
                                        var http = require('http');
                                        var body=0;
                                        var data = querystring.stringify({
                                              k: parametri,
                                            });
                                        var options = {
                                            host: "http://"+ targetSite,
                                            path: action,
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'Content-Length': Buffer.byteLength(data)
                                            }
                                        };
                                        var req = http.request(options, function(res) {
                                            res.setEncoding('utf8');
                                            res.on('data', function (chunk) {
                                              setTimeout(function(){
                                                  body = chunk;
                                              },5000);
                                              console.log("body: " + chunk);
                                            });
                                        });
                                        req.write(data);
                                        req.end();
                                        console.log(metodo+"    http://" + targetSite + action + "  PARAMETRI: " + parametri);
                                        setTimeout(function(){
                                          trova(gag, metodo, action ,targetSite, parametri, body, formName);
                                        },7000);
                                    }
                  } // IF(POST)
                  else{
                      console.log("ERRORE: METODO NON TROVATO");
                  }
          }
     } //finalrequest() end

  function trova(gag, metodo, action, targetSite, parametri, body, formName){
    var what=0;
    try {
    if(body.indexOf("<script>alert(\"patchThis\")</script>")>=0){
        what="<script>alert(\"patchThis\")</script>";
    }
    else{
      if(body.indexOf("\"></script><script>alert(\"patchThis\");\"")>=0){
          what="\"></script><script>alert(\"patchThis\");\"";
      }
      else{
        if(body.indexOf("<img src=\"javascript:alert(\'patchThis\')\"></img>")>=0){
            what="<img src=\"javascript:alert(\'patchThis\')\"></img>"
        }
        else{
          if(body.indexOf("\' onerror=\'alert(\"patchThis\")\'>")>=0){
              what="\' onerror=\'alert(\"patchThis\")\'>";
          }
          else{
            if(body.indexOf("<img src=\"http://ineeexist.ent\" onerror=\"javascript:alert(\"patchThis\")\"/>")>=0){
                what="<img src=\"http://ineeexist.ent\" onerror=\"javascript:alert(\"patchThis\")\"/>";
            }
            else{
              if(body.indexOf("%3cscript%3ealert(\"patchThis\")%3c/script%3e")>=0){
                  what="%3cscript%3ealert(\"patchThis\")%3c/script%3e";
              }
              else{
                if(body.indexOf("javascript:alert(\"patchThis\")")>=0){
                    what="javascript:alert(\"patchThis\")";
                }
                else {
                  if(body.indexOf("<b onmouseover=alert(\'patchThis\')>click me!</b>")>=0){
                      what="<b onmouseover=alert(\'patchThis\')>click me!</b>";
                  }
                  else{
                    if(body.indexOf("<script type=\"text/vbscript\">alert(\'patchThis\')</script>")>=0){
                        what="<script type=\"text/vbscript\">alert(\'patchThis\')</script>";
                    }

                      else{
                        console.log("TARGET NON VULNERABILE");
                        if (fs.existsSync("sendthis.txt")) {
                            }
                            else{
                              setTimeout(function(){
                                  scriviNiente(targetSite); },5000);
                            }

                          function scriviNiente(targetSite){
                            if (fs.existsSync("sendthis.txt")&&canc==0) {
                            }
                            else{
                              var finee="Fortunatly your target <b style=\"color:#FFA500\">"+ targetSite + "</b> is not vulnerable at cross-site scripting";
                              fs.writeFile('sendthis.txt', finee, function(err) {
                                     if (err) {
                                        return console.error(err);
                                     }
                                     console.log("Data written successfully! NO VULNERABL");
                              });
                            }
                          }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }//try
    catch(err) {
          console.log("risposta del server non fornita");
    }
    if(what != 0 && what != -1){
      console.log("TARGET VULNERABILE A XSS, L'INJECTION DI " + what + " E' ANDATA A BUON FINE");
      var testo="";
      console.log("Going to open file!");
      fs.open('sendthis.txt', 'a+', function(err, fd) {
        if (err) {
            return console.error(err);
        }
        console.log("File opened successfully!");
        var controllo = 0;
        for(var t=0; t<parametri.length; t=t+1){
          parametri=parametri.replace("<","&lt");
          parametri=parametri.replace(">","&gt");
        }
        /////////////////////////////////////////////////////
        if (metodo=='GET' || metodo=='get') {

              testo= testo +" <b><center>"+ gag + "</center></b> <br> The target site <b style=\"color:#FFA500\">"+ targetSite + "</b> is vulnerable. <br> <br> The vulnerable form's name is: <b>"+formName+"</b><br>Here is the PAYLOAD: <b style=\"color:#FFFF00;\">" + parametri + "</b><br><br>Here is the full URL: <b style=\"color:#FFA500\">" + targetSite +"</b>" + "<b style=\"color:#FFFF00;\">"+parametri+"</b>";
              testo= testo +"<br>Metodo richiesta: <b>" + metodo+ "</b>";
              if(action!='' && action!=' '){
                testo= testo+ "<br>Action: <b>" + action + "</b>";
              }
              testo=testo+ "<br>Patch this vulnerabiity now! <a href=\"https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet#XSS_Prevention_Rules\" target=\"_blank\"><u><b>Learn More</b></u></a>";
        }
        else{
              testo= testo +" <b><center>#"+ gag + "</center></b> The target site <b style=\"color:#FFA500\">"+ targetSite + "</b> is vulnerable. <br> <br> <br>The vulnerable form's name is: <b>"+formName+"</b><br>Here is the PAYLOAD: <b style=\"color:#FFFF00;\">" + parametri ;
              testo= testo +"<br>Metodo richiesta: <b>" + metodo+"</b>";
              if(action!='' && action!=' '){
                testo= testo+ "<br>Action: <b>" + action + "</b>";
              }
              testo=testo+ "<br>Patch this vulnerabiity now! <a href=\"https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet#XSS_Prevention_Rules\" target=\"_blank\"><u><b>Learn More</b><u></a>";
        }
              var testoo=testo;
              const fs = require('fs');
              fs.readFile('sendthis.txt', {encoding: 'utf8'}, function(err,data){
                  if(err){console.log("error " + err);}
                  else{
                      controllo=data.search(gag);
                      if(controllo == -1){
                          fs.appendFile('sendthis.txt', testoo, function (err) {
                            if (err) throw err;
                            console.log('Saved!');
                          });
                      }
                  }
              }); //fs.reading
              fs.closeSync(fd);
      });//opening
    }//if on what
  } //trova() end

  function prima(callback){
        var child_process = require('child_process');
        function runCmd(cmd){
          var resp = child_process.execSync(cmd);
          var result = resp.toString('UTF8');
          return result;
        }
        targetSiteUrl=request.body.site;
        if(targetSiteUrl[0]=="h" && targetSiteUrl[1]=="t" && targetSiteUrl[2]=="t" && targetSiteUrl[3]=="p" && targetSiteUrl[4]==":" && targetSiteUrl[5]=="/" && targetSiteUrl[6]=="/"){
                var lunghezza=targetSiteUrl.length;
                var nuovo="";
                for(var p=0; p<lunghezza-7; p++){
                  nuovo=nuovo+targetSiteUrl[7+p];
                }
                targetSiteUrl=nuovo;
                console.log("URL corretto, tolto http");
        }
        else{
          if(targetSiteUrl[0]=="h" && targetSiteUrl[1]=="t" && targetSiteUrl[2]=="t" && targetSiteUrl[3]=="p" && targetSiteUrl[4]=="s" && targetSiteUrl[5]==":" && targetSiteUrl[6]=="/" && targetSiteUrl[7]=="/"){
                  var lunghezza=targetSiteUrl.length;
                  var nuovo="";
                  for(var p=0; p<lunghezza-8; p++){
                    nuovo=nuovo+targetSiteUrl[8+p];
                  }
                  targetSiteUrl=nuovo;
                  console.log("URL corretto, tolto https");
          }
        }
        var reques = require("request");
        reques("http://"+targetSiteUrl, function(err, res, body) {
            if(err){
                console.log("ERRORE "+ err);
                var errore="Unfortunately We have just found an error in your request! <br> <b style=\"color:#FFA500\">"+ err + "</b>";
                fs.writeFile('sendthis.txt', errore, function(err) {
                   if (err) {
                      return console.error(err);
                   }
                   console.log("Data written successfully! ERROR");
                });
            }
            else{
                var download = "wget -O indexx.html " + targetSiteUrl;
                var operationdownload = runCmd(download);
                console.log(operationdownload);
                setTimeout(function(){
                callback(targetSiteUrl); },10000);
            }
        });
  }//prima() end

  function seconda(targetSite){
      var child_process = require('child_process');
      function runCmd(cmd){
          var resp = child_process.execSync(cmd);
          var result = resp.toString('UTF8');
          return result;
      }
      var cmdd = "perl formparserjson.pl < ./indexx.html";
      var result = runCmd(cmdd);
      console.log(cmdd);
      console.log(result);
      var resultObj;
      try {
        resultObj = JSON.parse(result);
      } catch (_error) {}
      resultObj || (resultObj = {
        message: 'Server error, please retry'
      });
      var xss=["<script> alert(\"patchThis\") </script>"];
      xss.pop();
      xss.push("<script>alert(\"patchThis\")</script>");
      xss.push("\"></script><script>alert(\"patchThis\");\"");
      xss.push("<img src=\"javascript:alert(\'patchThis\')\"></img>");
      xss.push("\' onerror=\'alert(\"patchThis\")\'>");
      xss.push("<IMG SRC=j&#X41vascript:alert(\'patchThis\')>");
      xss.push("<b onmouseover=alert(\'patchThis\')>click me!</b>");
      xss.push("<script type=\"text/vbscript\">alert(\'patchThis\')</script>");
      xss.push("%3cscript%3ealert(\"patchThis\")%3c/script%3e");
      var array=['array'];
      array.pop();
      for (var x in resultObj) {
          console.log('SIAMO NEL ' + x + ' ||| metodo: ' + resultObj[x]._metodo + ' ||| action: ' + resultObj[x]._action );
          for (var y in resultObj[x]) {
              if(resultObj[x][y].hasOwnProperty('valore') && resultObj[x][y].name_field!=""){
                  console.log(' |||  tipo campo: ' + resultObj[x][y].tipo_campo + ' ||| ' + y + '-> ' + " ||| nome: " + resultObj[x][y].name_field + " |||  valore: " + resultObj[x][y].valore);
                  array.push(resultObj[x][y].name_field);
                  array.push(resultObj[x][y].valore);
                }
          }
          if(array.length>0){
              var formName=0;
              var save;
              var gag=1;
              for( var odd=1; odd<array.length; gag++, odd=odd+2){
                  var save; gag=odd;
                  save=array[odd];
                  formName=array[odd-1];
                  for(var ind=0; ind<xss.length; ind++){
                      gag=odd;
                      array[odd]=xss[ind];
                      if(resultObj[x]._action=="" || resultObj[x]._action==" "){
                      }
                      else{
                          if(resultObj[x]._action[0]=="/"){
                            console.log("action forma normale");
                          }
                          else{
                            resultObj[x]._action = "/" + resultObj[x]._action;
                            console.log("action corretta");
                          }
                      }
                      if(xss[ind]=="<script> alert(\"patchThis\") </script>"){
                          gag=gag+"#";
                          finalrequest(gag, array, resultObj[x]._metodo, resultObj[x]._action, targetSite, formName);
                          setTimeout(function(){
                          },100);
                      }
                      else{gag="#"+gag+"#";
                          finalrequest(gag, array, resultObj[x]._metodo, resultObj[x]._action, targetSite, formName);
                      }
                  }
                  array[odd]=save;
              }
          }
          for(var ii=0; ii<array.length; ii++){
              array.pop();
          }
      }
  } //seconda() end

  prima(seconda);

  setTimeout(function(){
    controlloDoppioni(); },55000);

  function controlloDoppioni(){
    console.log("CONTROLLO DOPPIONI");
    var doppione=-10;
    var uno="";
    var due="";
    var data1;
    var data2;
    var data3;
    var gag;
    var data;
    var saved;
    for(var indice=1; indice<10; indice++){
        console.log("gag: "+gag);
        gag="#"+indice+"#";
        for(var contasec=0; contasec<7; contasec++){
             doppione=-10;
             uno="";
             due="";
             data=fs.readFileSync('sendthis.txt');
             doppione=data.indexOf(gag);
             uno="";
             due="";
             if(doppione!=-1){
               console.log("trovato primo, "+ gag);
               uno=doppione;
               due=data.indexOf("Learn More");
               due=due+22;//per skippare i tag
               doppione=data.indexOf(gag, due-1);
               if(doppione!=-1){
                 console.log("trovato secondo, "+ gag);
                 uno=doppione;
                 due=data.indexOf("Learn More", uno);
                 data1=data.slice(0, doppione);
                 data2=data.slice(due+22, data.length);
                 data3=data1+data2;
                 saved=fs.writeFileSync("sendthis.txt",data3, 'utf8');
                 console.log("doppioni rimossi "+ saved);
                }
              }
              else{
                 console.log("non trovato alcun gag: "+gag);
              }
        }//for
    }//for
  }// controllo doppioni end

}); //app.post

app.listen(5050, function(){
    console.log('listening on port ****');
});
