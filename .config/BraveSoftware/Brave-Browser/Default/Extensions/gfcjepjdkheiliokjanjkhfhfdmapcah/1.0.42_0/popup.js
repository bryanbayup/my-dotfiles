document.addEventListener("DOMContentLoaded",(function(){let e=document.querySelectorAll(".rewrite");async function t(){this.disabled=!0;document.getElementsByTagName("textarea")[0].value;data="";let e="";document.getElementsByTagName("textarea")[1].value="Wait...";for(let t=0;t<20;t++){const t=await fetch("https://neuralwriter.com");if(e=await t.text(),""!=e)break;await new Promise((e=>setTimeout(e,1e3)))}document.getElementsByTagName("textarea")[1].value=e,this.disabled=!1}for(let a=0;a<e.length;a++)e[a].addEventListener("click",t)}));