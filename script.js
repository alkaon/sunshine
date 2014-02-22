(function(window, document, undefined){
 "use strict"
 
 function $(e){return typeof e == 'string' ? document.querySelector(e) : e}
 
 function ajax(text, addr, callback, params){
  var req = (parseURL(addr).host === window.location.hostname) ? new XMLHttpRequest() : (function(XHR){return new XHR()})(window.XDomainRequest || window.XMLHttpRequest);
  var defaultParams = {method: text ? "post" : "get", json: false, async: true};
  if(!params) params = {};
	 for(var key in defaultParams) if(params[key] === undefined) params[key] = defaultParams[key];
  params.method = (params.method || (text ? "post" : "get")).toLowerCase();
  if(text !== undefined && typeof text !== "string"){
   if(params.method === "post"){
   var res = new FormData();
    for(var f in text){
     if(typeof text[f] === "object" && text[f] instanceof Array){
      for(var i = 0; i < text[f].length; ++i) res.append(f, text[f][i]);
     }else res.append(f, text[f]);
    }
    text = res;
   }else text = toQueryString(text); // get
  }
  if(params.method === "get" && text) addr += "?" + text;
  req.open(params.method, addr, params.async);
  xcrft(req, {type: params.method, url: addr});
  req.send(params.method === "get" ? null : text);
  if(params.async && callback) req.onload = function(){callback.call(null, params.json ? JSON.parse(req.responseText) : req.responseText)}
  if(!params.async && req.status === 200){return params.json ? JSON.parse(req.responseText) : req.responseText}
  return this;

  function xcrft(xhr, settings){
   function sameOrigin(url){
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/')
     || (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/')
     || !(/^(\/\/|http:|https:).*/.test(url));
   }
   function safeMethod(method){ return (/^(GET|HEAD|OPTIONS|TRACE)$/i.test(method)) }
   if(!safeMethod(settings.type) && sameOrigin(settings.url)) xhr.setRequestHeader("X-CSRFToken", cookie("csrftoken"));
  }
 }
 function cookie(name, value, props){
  if(!value && !props){
   var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
   return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  props = props ||{};
  var exp = props.expires;
  if(typeof exp == "number" && exp){
   var d = new Date();
   d.setTime(d.getTime() + exp*1000);
   exp = props.expires = d;
  }
  if(exp && exp.toUTCString){props.expires = exp.toUTCString()}
  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for(var propName in props){
   updatedCookie += "; " + propName;
   var propValue = props[propName];
   if(propValue !== true) updatedCookie += "=" + propValue;
  }
  document.cookie = updatedCookie;
  return this
 }
 function toQueryString(obj, prefix){
  var str = [];
  for(var p in obj){
   var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
   str.push(typeof v == "object" ? $.toQueryString(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
  }
  return str.join("&");
 }
 function parseURL(url){
  var a =  document.createElement('a');
  a.href = url;
  return {
   source: url,
   protocol: a.protocol.replace(':',''),
   host: a.hostname,
   port: a.port,
   query: a.search,
   params: (function(){
    var ret = {}, seg = a.search.replace(/^\?/,'').split('&'), len = seg.length, i = 0, s;
    for(;i<len;i++){
     if(!seg[i]) continue;
     s = seg[i].split('=');
     ret[s[0]] = s[1];
    }
    return ret;
   })(),
   file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
   hash: a.hash.replace('#',''),
   path: a.pathname.replace(/^([^\/])/,'/$1'),
   relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
   segments: a.pathname.replace(/^\//,'').split('/')
  };
 }
 
 window.onload = function(e){
  $('header form img').onclick = function(event){
   var inputs = document.querySelectorAll('header form input');
   var data = {};
   for(var i = 0; i < inputs.length; ++i){
    if(inputs[i].value.length > 0 && inputs[i].checkValidity()) data[inputs[i].name] = inputs[i].value; else return alert("Как минимум одно из полей не заполнено!")
   }
   ajax(data, 'server.php', function(r){
    alert(r);
   });
   return false;
  }
  
  $('#discript form img').onclick = function(event){
   var inputs = document.querySelectorAll('#discript form input');
   var data = {};
   for(var i = 0; i < inputs.length; ++i){
    if(inputs[i].value.length > 0 && inputs[i].checkValidity()) data[inputs[i].name] = inputs[i].value; else return alert("Как минимум одно из полей не заполнено!")
   }
   ajax(data, 'server.php', function(r){
    alert(r);
   });
   return false;
  }
 }
})(window, document);
