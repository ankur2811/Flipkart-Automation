let puppeteer = require("puppeteer");
let fs =require("fs");
let loginFile=process.argv[2];

(async function () {
// starts browser
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo:100,
        args: ["--start-maximized","--disable-notifications"]
    });
    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
    // goto page
        await tab.goto("https://www.mygov.in/covid-19");
        await tab.waitFor(10000);
        await tab.screenshot({   
   path:"stats.png",
clip:{x:0,y:0,width:1500,height:500},
   });

await tab.waitForSelector(".plus_icon")
await tab.click(".plus_icon");
await tab.waitFor(10000);
await tab.waitForSelector("#btn-load-more");
await tab.click("#btn-load-more");
await tab.waitFor(10000);
await tab.evaluate(_ => {
    window.scrollBy(0, 800);
  });

  let element1= await tab.$(".odd");
  let list1 = await tab.evaluate(element1 => element1.textContent, element1);
  console.log(list1);

  let list= await tab.$$(".odd")

  var linkrate = await tab.$$eval(".list[0] td ",
  elements=> elements.map(item=>item.textContent))
 // prints a array of text
 await console.log(linkrate)






  
await tab.waitForSelector(".hotspot-list");
await tab.click(".hotspot-list");
await tab.waitForSelector(`cr-icon-button[title="Download"]`);
await tab.click(`cr-icon-button[title="Download"]`);












  /* await tab.waitForSelector("#state-covid-data.display.dataTable.no-footer");
   let data=await tab.$("#state-covid-data.display.dataTable.no-footer");
let  text = await tab.evaluate((data) => data.innerText, data);





   //let newTab = await browser.newPage();
   //await newTab.setContent(text);
   
 // fs.writeFileSync("./stats.html", text);

//await tab.evaluate(()=>{
  //  let stats=document.querySelector("#state-covid-data_wrapper").style.display="table";

//});



//await tab.waitFor(".lang-switcher-block");
//await tab.click(".lang-switcher-block");
//console.log("Language Has Changed")
 /*let tab1=await browser.newPage();
 await tab1.goto("https://twitter.com/mygovindia");
 await tab1.waitForSelector('a[href="/login"]');
await tab1.click('a[href="/login"]');
let data = await fs.promises.readFile(loginFile, "utf-8");
    let credentials = JSON.parse(data);
    email = credentials.email;
    pwd = credentials.pwd;
await   tab1.waitForSelector("input[name='session[username_or_email]']");
 await tab1.type("input[name='session[username_or_email]']",email);
 await tab1.waitForSelector("input[name='session[password]']");
await tab1.type("input[name='session[password]']",pwd);
await tab1.waitForSelector(" div[role='button']")
await tab1.click("div[role='button']");
let followBtn=await tab1.$$(".css-1dbjc4n r-15d164r");
await Promise.all([
    followBtn[0].click(),
    tab.waitForNavigation({ waitUntil: "networkidle2",setTimeout:30000 }),]);

await tab1.waitFor(10000)*/
let tab2=await browser.newPage();
 await tab2.goto('https://www.youtube.com/mygovindia');
 let video = await tab2.$$(".style-scope.ytd-channel-video-player-renderer");
 await Promise.all([
   video[0].click()]);
  await tab2.waitFor(45000)
 await Promise.all([
   video[0].click(),{delay:45000}]);

})()