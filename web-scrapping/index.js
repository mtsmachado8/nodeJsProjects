const puppeteer = require('puppeteer');
const _p = require('./infra/puppeteer-utils');
const fs = require('fs');

let page;
let browser;
let total_vendas;
let total_itens_vendidos;
let page_number;

async function forAllPublished(action){
	let next_disabled;

	do{
		await page.waitForSelector('#searchResults');

		await action();

		let next = await page.$('.andes-pagination__button--next', {timeout: 1000});

		try{
			next_disabled = await page.waitForSelector('.andes-pagination__button.andes-pagination__button--next.andes-pagination__button--disabled', {timeout: 500});
		}catch(e){
			next_disabled = false;
		}

		if(!next_disabled){
			console.log(next);
			await Promise.all([
				next.click(),
				page.waitForNavigation({waitUntil:'networkidle2'})
			]);
		}
	}while(!next_disabled);
}

async function getAllImages(){
	browser = await puppeteer.launch({headless: true});
	page = await browser.newPage();
	await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36');

	let counter = 0;
	page.on('response', async (response) => {
		const matches = /.*\.(webp)$/.exec(response.url());

		if (matches && (matches.length === 2)) {

			const extension = 'webp';
			const buffer = await response.buffer();
			fs.writeFileSync(`images/image-${counter}.${extension}`, buffer, 'base64');
			counter += 1;
		}
	});

	await page.goto('https://eshops.mercadolivre.com.br/ESPACO+M');
	// await page.waitFor(10000);
}

async function sellReport(){
	total_vendas = 0;
	total_itens_vendidos = 0;
	page_number = 1;

	try{
		browser = await puppeteer.launch({headless: true});
		page = await _p.loadDesiredPage(browser, 'https://eshops.mercadolivre.com.br/ESPACO+M');

		await forAllPublished(async () => {
			const itens = await page.$$('.results-item');
			let vendas = 0;
			let itens_vendidos = 0;

			for(const item of itens){
				const title = await item.$eval('.main-title', v => v.innerText);
				const price = await item.$eval('.price__fraction', v => v.innerText.match(/\d/g).join(""));
				const sold = await item.$eval('.item__condition', v => v.innerText.match(/\d/g) ? v.innerText.match(/\d/g).join("") : 0);

				console.log(`Produto: ${title}\nPreço: ${price}, Vendidos: ${sold}, Valor em Vendas: ${price*sold}`);
				vendas += price*sold;
				itens_vendidos += Number(sold);
			}
			console.log(` ------- Pagina:${page_number} Vendeu: ${vendas} Total Itens: ${itens_vendidos} ------- `);
			total_vendas += vendas;
			total_itens_vendidos += itens_vendidos;
			page_number++;
		});

		console.log(`>>> Total de Vendas: ${total_vendas} Quantidade de Itens Vendidos: ${total_itens_vendidos} <<<`);

		await browser.close();

	}catch(e){
		console.log('Error ocurred: ', e);
	}
}

async function registerProduct(){
	try{
		browser = await puppeteer.launch({
			headless: false,
			userDataDir: 'C:/my-profile'
		});
		page = await _p.login(browser, 'ESPAÇO M');
		await _p.publishItem(page, 'Testing Publish');

	}catch(e){
		console.log('Error ocurred: ', e);
	}
}

(async () => {
	await registerProduct();
})();