let puppeteer = require("puppeteer");
let fs = require("fs");
let https = require('https');
let docx = require("docx");
let credentialsFile = process.argv[2];
let product = process.argv[3];
let pincode=process.argv[4];
let url1,email,pass;
let rows=[];
(async function (){
    let data = await fs.promises.readFile(credentialsFile, "utf-8");
    let credentials = JSON.parse(data);
    url1 = credentials.url1;
    email=credentials.email;
    pass=credentials.pass;
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--disable-notifications"],
        slowMo: 400
    });
    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
    
    // goto page
    // 1. 
    await tab.goto(url1, {
        waitUntil: "networkidle2"
    });
    await tab.waitForSelector("._2AkmmA._29YdH8" );
    //console.log("abc");
    await tab.click("._2AkmmA._29YdH8");
    
    await tab.waitForSelector(".LM6RPg");
    await tab.type(".LM6RPg", product, { delay: 200 });
    await tab.waitForSelector("._2BhAHa")
    await tab.click("._2BhAHa");
    await tab.waitForSelector("._1vC4OE")
  
    let list1= await tab.$$("._1Nyybr._30XEf0");
   // console.log(list1.length);
  //  await list[0].click();
  var linkprice = await tab.$$eval("._1vC4OE ",
 elements=> elements.map(item=>item.textContent))
 var linkrate = await tab.$$eval(".hGSR34 ",
 elements=> elements.map(item=>item.textContent))
// prints a array of text
// await console.log(linkTexts)
  for(let i=0;i<4;i++){
  let name = await tab.evaluate(function (q) {
        return q.getAttribute("alt");
    }, list1[i]);
    //console.log(name);
    //console.log(linkprice[i]);
    //console.log(linkrate[i]);

    let pObj={
      Product:name,
      Price:linkprice[i],
      UserRating:linkrate[i]
      
  }
  
  rows.push(pObj);

    
  }
 let tb= console.table(rows);
 
  
  
    let list= await tab.$$("a[rel='noopener noreferrer']");
    //console.log(list.length);
  //  await list[0].click();
  let href = await tab.evaluate(function (q) {
        return q.getAttribute("href");
    }, list[0]);
    let chref="https://www.flipkart.com"+href;
    let newTab = await browser.newPage();
    const response= await newTab.goto(chref, { waitUntil: "networkidle0" });
     let ur=newTab.url();
  //  console.log(ur);

  await newTab.waitForSelector("._35KyD6");
  let element3= await newTab.$("._35KyD6");
   const name = await newTab.evaluate(element3 => element3.textContent, element3);
   //console.log(name);


    await newTab.waitForSelector("._1vC4OE");
   let element= await newTab.$("._1vC4OE");
    const price = await newTab.evaluate(element => element.textContent, element);
    //console.log(price);
   
    await newTab.waitForSelector("._3X4tVa" );
    await newTab.type("._3X4tVa", pincode, { delay: 200 });
    await newTab.click("._2aK_gu");
    var del="out of stock"
 try{
    await newTab.waitForSelector("._3nCwDW");
    let element1= await newTab.$("._3nCwDW");
     del = await newTab.evaluate(element1 => element1.textContent, element1);
    // console.log(del);
 }
 catch{
   console.log("out of stock");
 }
var rat=0;
try{
     await newTab.waitForSelector(".hGSR34")
     let element2= await newTab.$(".hGSR34");
      rat = await newTab.evaluate(element2 => element2.textContent, element2);
    // console.log(rat);
}
catch{
console.log("no rating yet")
}

var linkTexts = await newTab.$$eval("._2-n-Lg.col",
 elements=> elements.map(item=>item.textContent))
// prints a array of text
for(let i=0;i<linkTexts.length;i++){
    //await console.log(linkTexts[i])
}
    await newTab.waitForSelector("._2-riNZ");
    var linkTexts1 = await newTab.$$eval("._2-riNZ",
 elements=> elements.map(item=>item.textContent))
// prints a array of text
for(let i=0;i<linkTexts1.length;i++){
   // await console.log(linkTexts1[i])
}
    
    
     const download = (url, destination) => new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destination);
    
      https.get(url, response => {
        response.pipe(file);
    
        file.on('finish', () => {
          file.close(resolve(true));
        });
      }).on('error', error => {
        fs.unlink(destination);
    
        reject(error.message);
      });
    });
    
    
     const images = await newTab.evaluate(() => Array.from(document.images, e => e.src));

     //for (let i = 0; i < images.leng13h; i++) {
       result = await download(images[2], `image-${1}.png`);
   
       if (result === true) {
         console.log('Success:', images[2], 'has been downloaded successfully.');
       } else {
         console.log('Error:', images[2], 'was not downloaded.');
         console.error(result);
       }

     
       const doc = new docx.Document();

       doc.addSection({
        properties: {},
        children: [
            new docx.Paragraph({
                children: [
                    new docx.TextRun("Product:"),
                    new docx.TextRun({
                        text: name,
                        bold: true,
                        size:50
    
                    }),
                    docx.Media.addImage(doc, fs.readFileSync("image-1.png") , 300, 400,{
                      floating: {
                          horizontalPosition: {
                              offset: 1014400,
                          
                          },
                          verticalPosition: {
                              offset: 1014400,
                              
                          },
                          margins: {
                            top: 2014400,
                            bottom: 201440,
                        },
                      },
                  }),

               ],
            }),
        ],
    });

 var a=   new docx.TextRun({
      text: "Price:",
      bold: true,
      size:50

  });
  doc.addSection({
    children: [a],
  });
 var b= new docx.TextRun(price);
 doc.addSection({
  children: [b],
});

    
var c=new docx.TextRun({
  text: "User Rating",
  bold: true,
  size:50

});
doc.addSection({
  children: [c],
});
var d=new docx.TextRun(rat);
doc.addSection({
  children: [d],
});

var e=new docx.TextRun({
text: "Delivery Status:",
bold: true,
size:50

});
doc.addSection({
  children: [e],
});
var f=new docx.TextRun(del);
doc.addSection({
  children: [f],
});






  var offers=  new docx.TextRun({
      text: "Available Offers:",
      bold: true,
      size:50

  });
  doc.addSection({
    children: [offers],
  });

  for(let j=0;j<linkTexts.length;j++){
 var ch= new docx.TextRun(linkTexts[j]);
 doc.addSection({
  children: [ch],
});}
  
var high=  new docx.TextRun({
  text: "Highlights:",
  bold: true,
  size:50

});
doc.addSection({
children: [high],
});

for(let j=0;j<linkTexts1.length;j++){
var ch1= new docx.TextRun(linkTexts1[j]);
doc.addSection({
children: [ch1],
});}

//table*********************************









/*const table = new docx.Table({
  rows: [new docx.TableRow({
    children: [
        new docx.TableCell({
            children: [new docx.Paragraph("Product")],
            width: { size: 50, type: docx.WidthType.PERCENTAGE },
            
        }),
        new docx.TableCell({
          children: [new docx.Paragraph("Price")],
          width: { size: 25, type: docx.WidthType.PERCENTAGE },
          
      }),
      new docx.TableCell({
        children: [new docx.Paragraph("User Rating")],
        width: { size: 25, type: docx.WidthType.PERCENTAGE },
        
    }),
    ],
    height:{value:20 }
  }),
  new docx.TableRow({
    children: [
        new docx.TableCell({
            children: [new docx.Paragraph(rows[0].Product)],
            width: { size: 50, type: docx.WidthType.PERCENTAGE },
            
            
           
        }),
        new docx.TableCell({
          children: [new docx.Paragraph(rows[0].Price)],
          width: { size: 25, type: docx.WidthType.PERCENTAGE },
            
          
          
      }),
      new docx.TableCell({
        children: [new docx.Paragraph(rows[0].UserRating)],
        width: { size: 25, type: docx.WidthType.PERCENTAGE },
            
       
    }),
    ],
    height:{value:20 ,rule:PERCENTAGE}
  }),
  new docx.TableRow({
    children: [
        new docx.TableCell({
            children: [new docx.Paragraph(rows[1].Product)],
            width: { size: 50, type: docx.WidthType.PERCENTAGE },
            
        }),
        new docx.TableCell({
          children: [new docx.Paragraph(rows[1].Price)],
          width: { size: 25, type: docx.WidthType.PERCENTAGE },
            
          
      }),
      new docx.TableCell({
        children: [new docx.Paragraph(rows[1].UserRating)],
        width: { size: 25, type: docx.WidthType.PERCENTAGE },
            
       
    }),
    ],
    height:{value:20 ,rule:PERCENTAGE}
  }),
  new docx.TableRow({
    children: [
        new docx.TableCell({
            children: [new docx.Paragraph(rows[2].Product)],
            width: { size: 50, type: docx.WidthType.PERCENTAGE },
            
           
        }),
        new docx.TableCell({
          children: [new docx.Paragraph(rows[2].Price)],
          width: { size: 25, type: docx.WidthType.PERCENTAGE },
            
      }),
      new docx.TableCell({
        children: [new docx.Paragraph(rows[2].UserRating)],
        width: { size: 25, type: docx.WidthType.PERCENTAGE },
            
       
    }),
    ],
    height:{value:20 ,rule:PERCENTAGE}
  }),
  new docx.TableRow({
    children: [
        new docx.TableCell({
            children: [new docx.Paragraph(rows[3].Product)],
            width: { size: 50, type: docx.WidthType.PERCENTAGE },
            
        }),
        new docx.TableCell({
          children: [new docx.Paragraph(rows[3].Price)],
          width: { size: 25, type: docx.WidthType.PERCENTAGE },
            
          
      }),
      new docx.TableCell({
        children: [new docx.Paragraph(rows[3].UserRating)],
        width: { size: 25, type: docx.WidthType.PERCENTAGE },
            
       
    }),
    ],
    height:{value:20 ,rule:PERCENTAGE}
  }),

  ],
  
 
  
});*/
//table.setWidth(docx.WidthType.PERCENTAGE, '98%');

//const tableRow = ;
//table.addSection({
  //children: [tableRow],
//});
//console.log("pqr");



  

//doc.addSection({
  //children: [table],
//});





    // Used to export the file into a .docx file
    docx.Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("My Document.docx", buffer);
    });
    



    


    // fs.writeFileSync('flip.json', highlights);
  
     await newTab.click("._1hqsXY");
     await newTab.waitForSelector("._1iOi5v");
     let share= await newTab.$$("._1iOi5v");
     await share[1].click();
     const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));  // declare promise
     const page2 = await newPagePromise;                   // declare new tab, now you can work with it
     await page2.bringToFront();     
    // console.log(page2.url());
  await page2.waitForSelector(".r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-1inuy60.r-utggzx.r-vmopo1.r-1w50u8q.r-1lrr6ok.r-1dz5y72.r-1ttztb7.r-13qz1uu")
  let details= await page2.$$(".r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-1inuy60.r-utggzx.r-vmopo1.r-1w50u8q.r-1lrr6ok.r-1dz5y72.r-1ttztb7.r-13qz1uu");
  await details[0].type( email, { delay: 200 });
  await details[1].type( pass, { delay: 200 });
let login=await page2.$$(".css-901oao.r-1awozwy.r-jwli3a.r-6koalj.r-18u37iz.r-16y2uox.r-1qd0xha.r-a023e6.r-vw2c0b.r-1777fci.r-eljoum.r-dnmrzs.r-bcqeeo.r-q4m81j.r-qvutc0")
await login[0].click();
console.log("Shared on twitter ");
//await page2.waitForSelector(".css-901oao.css-16my406.r-1qd0xha.r-ad9z0x.r-bcqeeo.r-qvutc0");
//await page2.click(".css-901oao.css-16my406.r-1qd0xha.r-ad9z0x.r-bcqeeo.r-qvutc0")

})()