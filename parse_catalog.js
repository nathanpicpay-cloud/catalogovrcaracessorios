const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = 'c:\\Users\\Graysom\\Documents\\catalogovr\\catalogo_15-09-25_17-46-10.pdf';
const outPath = 'c:\\Users\\Graysom\\Documents\\catalogovr\\online-catalog\\src\\data\\products2.json';

async function parseCatalog() {
    let dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    const text = data.text;
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const products = [];
    let currentCategory = 'Geral';
    
    // Some logic to extract products.
    // The format seems to be:
    // Cód: <codigo>
    // <nome do produto>
    // <unidade>
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if line might be a category header (all caps, no Cód)
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
            // Split just in case there are two products on the same line (UN/1 Cód: 123)
            // But usually it's "Cód: 123"
            const parts = line.split('Cód:');
            for (let j = 1; j < parts.length; j++) {
                const codePart = parts[j].trim();
                let code = codePart;
                
                // Get next line as name
                if (i + 1 < lines.length) {
                    const name = lines[i + 1];
                    let price = 0; // Prices are not strictly defined, we can put 0 or random
                    
                    if (name && !name.startsWith('Cód:') && !name.includes('FABIO') && !name.includes('Folha:')) {
                        products.push({
                            id: `prod-${code.replace(/\s/g, '-')}`,
                            name: name,
                            price: 0,
                            description: `Código: ${code}`,
                            category: currentCategory,
                            image: "https://images.unsplash.com/photo-1591543781251-51291888bdfb?auto=format&fit=crop&q=80&w=800",
                            specs: [`Código: ${code}`]
                        });
                    }
                }
            }
        }
    }

    fs.writeFileSync(outPath, JSON.stringify(products, null, 2));
    console.log(`Extracted ${products.length} products.`);
}

parseCatalog().catch(console.error);
