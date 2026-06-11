const https = require('https');
https.get('https://catalogovrcaracessorios.vercel.app', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("HTML length:", data.length);
    const match = data.match(/href="(\/assets\/index-[^"]+\.css)"/);
    if(match) {
      console.log("Found CSS file:", match[1]);
      https.get('https://catalogovrcaracessorios.vercel.app' + match[1], cssRes => {
        let cssData = '';
        cssRes.on('data', chunk => cssData += chunk);
        cssRes.on('end', () => {
          console.log("Has cart-overlay.open .cart-modal:", cssData.includes('.cart-overlay.open .cart-modal'));
          console.log("Has .close-btn:", cssData.includes('.close-btn'));
          console.log("Has grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))", cssData.includes('140px'));
        });
      });
    } else {
      console.log('Could not find CSS link. HTML excerpt:');
      console.log(data.substring(0, 500));
    }
  });
});
