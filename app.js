import fetch from 'node-fetch'
import jsdom from "jsdom";
import fs from 'fs'

const { JSDOM } = jsdom;

const file = JSON.parse(fs.readFileSync('./instruments.json','utf-8'))

fetch('https://musicopolix.com/cat/guitarras/electricas/54082-squier-bullet-stratocaster-ht-blk-guit-electrica.html')
    .then(function(response) {
        // When the page is loaded convert it to text
        return response.text()
    })
    .then(function(html) {
       
        const dom = new JSDOM(html)
        const instrument = {}
        // You can now even select part of that html as you would in the regular DOM 
        // Example:
        // var docArticle = doc.querySelector('article').innerHTML;

        instrument.name = dom.window.document.querySelector('.product-description_short').textContent
        instrument.description = dom.window.document.querySelector('.product-description p span').textContent
        instrument.price = dom.window.document.querySelector('.current-price span').content;
        instrument.specs = Array.from(dom.window.document.querySelectorAll('.product-description ul li')).map(li => li.textContent)
        

        file.push(instrument)
        const fileString = JSON.stringify(file, null, '    ');
        fs.writeFileSync('./instruments.json', fileString)
    })

    .catch(function(err) {  
        console.log('Failed to fetch page: ', err);  
    });