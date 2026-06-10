const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const pdfPath = 'c:\\Users\\Graysom\\Documents\\catalogovr\\catalogo_15-09-25_17-46-10.pdf';
const productsPath = 'c:\\Users\\Graysom\\Documents\\catalogovr\\online-catalog\\src\\data\\products.json';

async function parseCatalog() {
    let dataBuffer = fs.readFileSync(pdfPath);
    const parse = typeof pdf === 'function' ? pdf : pdf.default;
    const data = await parse(dataBuffer);
    
    const text = data.text;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const newProducts = [];
    let currentCategory = 'Diversos';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line === 'ANEL CENTRALIZADOR') currentCategory = 'Anel Centralizador';
        if (line === 'BORRACHARIA') currentCategory = 'Borracharia';
        if (line === 'CALOTA') currentCategory = 'Calota';
        if (line === 'CONTRAPESO') currentCategory = 'Contrapeso';
        if (line === 'PARAFUSO') currentCategory = 'Parafuso';
        if (line === 'PORÇA') currentCategory = 'Porca';
        if (line === 'VALVULA') currentCategory = 'Valvula';
        if (line === 'DIVERSOS') currentCategory = 'Diversos';
        if (line === 'EMBLEMA') currentCategory = 'Emblema';

        if (line.startsWith('Cód:')) {
            const parts = line.split('Cód:');
            for (let j = 1; j < parts.length; j++) {
                const codePart = parts[j].trim();
                let code = codePart;
                
                if (i + 1 < lines.length) {
                    const name = lines[i + 1];
                    if (name && !name.startsWith('Cód:') && !name.includes('FABIO') && !name.includes('Folha:')) {
                        // random placeholder price between 5 and 50 just for demo purposes if not machines
                        const randomPrice = Math.floor(Math.random() * 45) + 5; 
                        
                        newProducts.push({
                            id: `prod-${code.replace(/\s/g, '-')}`,
                            name: name,
                            price: randomPrice,
                            description: `Código do Produto: ${code}. Produto pertencente à categoria ${currentCategory}.`,
                            category: currentCategory,
                            image: "https://images.unsplash.com/photo-1591543781251-51291888bdfb?auto=format&fit=crop&q=80&w=800",
                            specs: [`Código: ${code}`, `Categoria: ${currentCategory}`]
                        });
                    }
                }
            }
        }
    }

    // Load existing products
    let existingProducts = [];
    if (fs.existsSync(productsPath)) {
        existingProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    }
    
    // Merge without duplicates by ID
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
}

parseCatalog().catch(console.error);
