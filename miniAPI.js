// 엔코딩키 = 엔코드의 인증키
const EncodingKEY = `	
aabdjVtDyODuXtGkvJfA7GEEAE%2B7oKgHMt3Vs2z1iZZy%2Fh0S9KF7iOxPZFyyqKg28lO9bKPRcx3WzJxQtZnlXg%3D%3D`
// 디코딩키 = 디코드의 인증키
const DecodingKEY = `aabdjVtDyODuXtGkvJfA7GEEAE+7oKgHMt3Vs2z1iZZy/h0S9KF7iOxPZFyyqKg28lO9bKPRcx3WzJxQtZnlXg==`
// 아이템의 주소
const ItemURL = `http://apis.data.go.kr/6300000/animalDaejeonService/animalDaejeonItem`
// 리스트의 주소
const ListURL = `http://apis.data.go.kr/6300000/animalDaejeonService/animalDaejeonList`
// 키와 주소를 합쳐주는 쿼리파람스
const queryParams = '?' + encodeURIComponent('serviceKey') + '=' + EncodingKEY;
// root라는 id를 가진 div태그
const root = document.getElementById("root")

const xhr = new XMLHttpRequest();

xhr.onload = function(){
  xhr.responseXML.documentElement.nodeName
}
xhr.open("GET", ItemURL + queryParams)
xhr.responseType = "document"
xhr.send();