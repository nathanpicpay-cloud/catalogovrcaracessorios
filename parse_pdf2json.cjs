const fs = require('fs');
const PDFParser = require("pdf2json");

const pdfPath = 'c:\\Users\\Graysom\\Documents\\catalogovr\\catalogo_15-09-25_17-46-10.pdf';
const productsPath = 'c:\\Users\\Graysom\\Documents\\catalogovr\\online-catalog\\src\\data\\products.json';

let pdfParser = new PDFParser(this, 1); // 1 = raw text content

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    const rawText = pdfParser.getRawTextContent();
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    
    const newProducts = [];
    let currentCategory = 'Diversos';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line === 'ANEL CENTRALIZADOR') currentCategory = 'Anel Centralizador';
        if (line === 'BORRACHARIA') currentCategory = 'Borracharia';
        if (line === 'CALOTA') currentCategory = 'Calota';
        if (line === 'CONTRAPESO') currentCategory = 'Contrapeso';
        if (line === 'PARAFUSO') currentCategory = 'Parafuso';
        if (line === 'PORÇA' || line === 'PORCA') currentCategory = 'Porca';
        if (line === 'VALVULA') currentCategory = 'Valvula';
        if (line === 'DIVERSOS') currentCategory = 'Diversos';
        if (line === 'EMBLEMA') currentCategory = 'Emblema';

        if (line.includes('Cód:')) {
            // It might be like "Cód: 123" or "UN/1 Cód: 123"
            const parts = line.split('Cód:');
            for (let j = 1; j < parts.length; j++) {
                const code = parts[j].trim().split(' ')[0]; // Take only the code part
                
                if (i + 1 < lines.length) {
                    const name = lines[i + 1].replace(/-+Page.*/, '').trim();
                    if (name && !name.includes('Cód:') && !name.includes('FABIO') && !name.includes('Folha:')) {
                        const randomPrice = Math.floor(Math.random() * 45) + 5; 
                        
                        newProducts.push({
                            id: `prod-${code.replace(/\s/g, '-')}`,
                            name: name,
                            price: randomPrice,
                            description: `Código do Produto: ${code}. Categoria: ${currentCategory}.`,
                            category: currentCategory,
                            image: "https://images.unsplash.com/photo-1591543781251-51291888bdfb?auto=format&fit=crop&q=80&w=800",
                            specs: [`Código: ${code}`, `Categoria: ${currentCategory}`]
                        });
                    }
                }
            }
        }
    }

    let existingProducts = [];
    if (fs.existsSync(productsPath)) {
        existingProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    }
    
    const combined = [...existingProducts];
    const existingIds = new Set(existingProducts.map(p => p.id));
    
    newProducts.forEach(p => {
        if (!existingIds.has(p.id)) {
            combined.push(p);
            existingIds.add(p.id);
        }
    });

    fs.writeFileSync(productsPath, JSON.stringify(combined, null, 2));
    console.log(`Extracted ${newProducts.length} items. Total catalog size: ${combined.length} items.`);
});

pdfParser.loadPDF(pdfPath);
