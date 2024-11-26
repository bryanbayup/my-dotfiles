const homepage = function () {return chrome.runtime.getManifest().homepage_url};
const appUrl = function () {return chrome.runtime.getURL("/")};

const chromeStorageLocalGet = (key) => {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(key, (obj) => resolve(obj));
      } catch (err) {
        reject(`lost context apparently... ${err}`);
      }
    });
  };
  
const chromeStorageLocalSet = (obj) => {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set(obj, () => resolve());
      } catch (err) {
        reject(`lost context apparently... ${err}`);
      }
    });
};

function checkMinute(min){
  if(min<=9){
    min = "0" + min;
  }
  return min;
}
  
function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec}; 
  if (sec < 0) {sec = "59"};
  return sec;
}

function getRandomIntBetween(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}    