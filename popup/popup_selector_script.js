  var dcconimage = {};
    var data = {
      dccon: []
    };
    // 디시콘 불러오기 초기화 함수
    function initChatInject() {
      // httpRequest 초기화
      if (window.XMLHttpRequest) { // 파폭, 사파리, 크롬 등등 웹표준 준수 브라우저
        httpRequest = new XMLHttpRequest();
      } else if (window.ActiveXObject) { // 쓰레기 IE
        try {
          httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          try {
            httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e) {}
        }
      }
      if (!httpRequest) {
        alert('ERROR : Cannot init XMLHTTPRequest');
        return false;
      }
      httpRequest.onreadystatechange = LoadDCCon;
      httpRequest.open('GET', "http://funzinnu.cafe24.com/stream/dccon.php");
      httpRequest.send();
    }
    // 디시콘 불러오기 완료 함수
    function LoadDCCon() {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          try {
            dcconimage = JSON.parse(httpRequest.responseText);
            $.each(dcconimage, function(index, value) {
              data.dccon.push({
                name: index,
                src: value
              });
            });
            var source = $("#dccon-template").html();
            var template = Handlebars.compile(source);
            var html = template(data);
            $('#emoticon').html(html);
            var qs = $('input#dcconsearch').quicksearch('div#emoticon div.img', {
              'delay': 100,
              'selector': 'div.desc',
              'onAfter': function () {
                $('body').scroll();
              }
            });
            $("img.lazy").lazyload();
            var imgs = document.getElementsByClassName('img');

            for(var i = 0 ; i < imgs.length ; i ++)
            {
              imgs[i].addEventListener('click',function(){ 
                var name = "~" + this.getElementsByClassName('desc')[0].innerText;
                inputDCCon(name);
              });
            }

            new Clipboard('.btn');
          } catch (e) {
            alert("Unknown error occured while parsing DCCon JSON.");
          }
        } else {
          alert("Unknown error occured while downloading DCCon JSON.");
        }
      }
    }
    function inputDCCon(name) {
      $('#dcconresult').val(name);
      chrome.tabs.query({"windowId":chrome.windows.WINDOW_ID_CURRENT,"active":true}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id, {'action' : "DCCON", 'name': name});
      });
    }
    function resetSearch() {
      $('#dcconsearch').val('');
      $('#dcconsearch').trigger("keyup");
    }
    
    window.onload = function () {
      initChatInject();
      document.getElementsByClassName('headerBox')[0].getElementsByClassName('btn btn-default')[0].onclick = resetSearch;
    }

  