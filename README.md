# twitch_dccon_extension

트위치 채팅창에서 스트리머가 지정한 '디시콘'을 보기 위한 크롬 익스텐션입니다.

<img src="https://sfsepark.github.io/images/DCCON_SCREEN1.png" width="90%"></img>
<img src="https://sfsepark.github.io/images/DCCON_SCREEN3.png" width="90%"></img>

# 사용법 

각 방송에서 사용하는 디시콘 문법 그대로, 채팅창에서 사용할 수 있습니다!

정확한 문법은 다음과 같습니다.
- 원하는 채팅 사이에 ~XXX 로 디시콘을 표시

# 다운로드

크롬 웹스토어 : https://chrome.google.com/webstore/detail/twitch-dccon-extension/nljojmgmnidbehhocgkbeejchcmkpgki?hl=ko

파이어폭스 애드온 : https://addons.mozilla.org/ko/firefox/addon/twitch-dccon-extension/



# 소스코드 구조

트위치 디시콘 익스텐션은 트위치 채팅창을 찾는 로직 대부분을 공유하는 다른 프로젝트와의 호환을 위해

https://github.com/sfsepark/TwitchChatFramework 트위치 챗 프레임워크(tcf) 위에서 구동되고 있습니다.

디시콘 익스텐션은 트위치 채팅창의 위치를 자동으로 분석해주는 프레임워크 위에서 돌아가도록 하기위해,

특정 트위치 채팅방에 접속했을 경우 그 스트리머가 디시콘을 사용하는지 ( funzinnu_dccon_picker ) 를 담는 모듈과

디시콘 선택기(funzinnu_dccon_picker.js) , 채팅인식후 디시콘으로 변환 하는 작업( dccon_observe.js ) 이  있는 모듈을

main.js 에서 tcf에 등록시킨후, tcf를 작동시킵니다.
