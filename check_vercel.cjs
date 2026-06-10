const https = require('https');
https.get('https://catalogovrcaracessorios.vercel.app', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/href="(\/assets\/index-[^"]+\.css)"/);
    if(match) {
      https.get('https://catalogovrcaracessorios.vercel.app' + match[1], cssRes => {
        let cssData = '';
        cssRes.on('data', chunk => cssData += chunk);
        cssRes.on('end', () => console.log(cssData.includes('.cart-overlay.open .cart-modal') ? 'YES: CSS is updated' : 'NO: Old CSS'));
      });
    } else {
      console.log('Could not find CSS link');
    }
  });
});
