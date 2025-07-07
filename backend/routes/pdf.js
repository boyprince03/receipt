const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 全域多次取代 {{key}}
function applyTemplate(template, data) {
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] ?? '');
}

router.post('/generate', async (req, res) => {
  let browser;
  try {
<<<<<<< HEAD
    const { roomNo, tenant, landlord, rentfee ,deposit, address, startDate, endDate, today,templateType, signature} = req.body;
=======
    const { roomNo, tenant, landlord, rentfee ,deposit, address, startDate, endDate, today, templateType } = req.body;
>>>>>>> 5154b9a0a540ad935fd85c042450a7dc77d50191

let templateFile;
  if (templateType === 'Guarantee') {
    templateFile = 'guaranteeTemplate.html';
  }
  if (templateType === 'Deposit') {
    templateFile = 'depositTemplate.html';
  }
  let template = fs.readFileSync(path.resolve(__dirname, `../${templateFile}`), 'utf8');

    // 全欄位自動帶入
    const filled = applyTemplate(template, {
      roomNo, tenant, landlord, deposit, address, startDate, endDate, today,rentfee,signature
    });

    // Puppeteer 產 PDF
    browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
<<<<<<< HEAD
    await page.setContent(filled, { waitUntil: 'networkidle0' });
    // await page.setContent(filled, { waitUntil: 'domcontentloaded' });
=======
    await page.setContent(filled, { waitUntil: 'domcontentloaded' });
>>>>>>> 5154b9a0a540ad935fd85c042450a7dc77d50191

    const pdfBuffer = await page.pdf({ format: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="receipt.pdf"');
    res.end(pdfBuffer); // or res.send(pdfBuffer);

  } catch (err) {
    console.error('PDF 產生失敗:', err);
    res.status(500).json({ error: 'PDF 產生失敗', detail: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

module.exports = router;
