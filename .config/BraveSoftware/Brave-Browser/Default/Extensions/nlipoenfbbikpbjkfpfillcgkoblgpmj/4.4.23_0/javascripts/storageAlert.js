function resume(){chrome.runtime.sendMessage({action:"record/resume"},(()=>{window.close()}))}function openGuidePage(){chrome.runtime.sendMessage({action:"openNewTab",data:"https://support.awesomescreenshot.com/hc/en-us/articles/25177478768793-What-should-I-do-when-I-see-Your-disk-storage-is-almost-full-Please-free-up-some-space-to-continue-recording-"},(()=>{window.close()}))}document.querySelector("#btn").addEventListener("click",(()=>{resume()}),!1),document.querySelector("#guide").addEventListener("click",(()=>{openGuidePage()}),!1);