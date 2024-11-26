const updateUrl = chrome.runtime.getManifest().update_url?.toLowerCase();
const id = chrome.runtime.id;

const storeUrl = (updateUrl && updateUrl.includes("microsoft")) ?
    `https://microsoftedge.microsoft.com/addons/detail/` + id :
    "https://chrome.google.com/webstore/detail/" + id;

let teaser = document.querySelector('.teaser');
if(teaser) {
    teaser.href = storeUrl;
}

let driveLink = document.getElementById("drive");
if(driveLink){
    driveLink.addEventListener("click", (e)=>{
        e.preventDefault();
        chrome.tabs.create({url:`${homepage()}/uploader`, active:true});
    });
}

let homeLink2 = document.getElementById("homeLink");
if(homeLink2) homeLink2.href=homepage();

let helpLink = document.getElementById("help");
if(helpLink){
    helpLink.addEventListener("click", (e)=>{
        e.preventDefault();
        chrome.tabs.create({url:`${homepage()}/tutorial`, active:true});
    });
}
