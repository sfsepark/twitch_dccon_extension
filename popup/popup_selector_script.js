let dccon_picker = (function(){

  const DCCON_CONTENT_FRAME_CLASS = 'dccon_content_frame';
  const DCCON_CONTROL_FRAME_CLASS = 'dccon_control_frame';

  const EMOTICON_FRAME_CLASSNAME = 'dccon-emoticon';

  let contentFrame = null;
  let controlFrame = null;

  let searchInput = null;

  let dcconPickerButtons = null;

  let dccondata = {dccon : []};

  // 디시콘 불러오기 초기화 함수
  function initChatInject() {
    httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = LoadDCCon;
    httpRequest.open('GET', "http://funzinnu.cafe24.com/stream/dccon.php");
    httpRequest.send();
  }

  let LoadDCCon = function(){

    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {

        let dcconimage = JSON.parse(httpRequest.responseText);

        dccondata.dccon = parseDcconData('funzinnu', dcconimage);

        try {
          let contentFrame = document;
          
            dcconPickerButtons = new DcconPickerButtons(dccondata, dcconPickerOnClick,false);
            let emoticon_frame = contentFrame.getElementsByClassName(EMOTICON_FRAME_CLASSNAME)[0];
            emoticon_frame.appendChild(dcconPickerButtons.frame);

            searchInput = document.getElementsByClassName('dcconsearch')[0];
            searchInput.addEventListener('input', (e) => {
                if(dcconPickerButtons != null){
                    dcconPickerButtons.search(e.target.value);
                    document.getElementsByTagName('body')[0].scrollTop = 0;
                }
            });
        
            document.getElementsByClassName('btn btn-default')[0].onclick = resetSearch;
            new Clipboard('.btn');
        } catch (e) {
            alert("Unknown error occured while parsing DCCon JSON.");
            console.log(e);
        }

      } else {
        alert("Unknown error occured while downloading DCCon JSON.");
      }
    }

  }

  let dcconPickerOnClick = function(name){
    let dcconresult = document.getElementById('dcconresult');
    dcconresult.value = name;

    chrome.tabs.query({"windowId":chrome.windows.WINDOW_ID_CURRENT,"active":true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {'action' : "DCCON", 'name': name});
    });
  }

  let resetSearch = function() {
    searchInput.value = '';
    document.getElementsByTagName('body')[0].scrollTop = 0;
  }



  return {
    init : function(){
      contentFrame = null;
      controlFrame = null;

      searchInput = null;
      dcconPickerButtons = null;

      initChatInject();

    } 
  }
})();


window.onload = function() {
  dccon_picker.init();
}