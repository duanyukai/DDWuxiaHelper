const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Adjustments particular to this page to ensure we hit desktop breakpoint.
  page.setViewport({width: 1000, height: 600, deviceScaleFactor: 1});

  // await page.goto('http://localhost:63342/DDWuxiaHelper/playground/data/小师妹游历数据/html_output/1031.html?_ijt=nml66mcl22ki2c0gsl86ef8dbb', {});

  /**
   * Takes a screenshot of a DOM element on the page, with optional padding.
   *
   * @param {!{path:string, selector:string, padding:(number|undefined)}=} opts
   * @return {!Promise<!Buffer>}
   */
  async function screenshotDOMElement(opts = {}) {
    const padding = 'padding' in opts ? opts.padding : 0;
    const path = 'path' in opts ? opts.path : null;
    const selector = opts.selector;

    if (!selector)
      throw Error('Please provide a selector.');

    const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      if (!element)
        return null;
      const {x, y, width, height} = element.getBoundingClientRect();
      return {left: x, top: y, width, height, id: element.id};
    }, selector);

    if (!rect)
      throw Error(`Could not find element that matches selector: ${selector}.`);

    return await page.screenshot({
      path,
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      }
    });
  }


  let actionList = [
    1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019,
    1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1901, 1902, 2001,
    2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
    2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2901, 2902, 3001, 3002, 3003, 3004, 3005, 3006,
    3007, 3008, 3009, 3010, 3011, 3012, 3013, 3014, 3015, 3016, 3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024, 3025,
    3026, 3027, 3028, 3029, 3030, 3031, 3901, 3902, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010, 4011,
    4012, 4013, 4014, 4015, 4016, 4017, 4018, 4019, 4020, 4021, 4022, 4023, 4024, 4025, 4026, 4027, 4028, 4029, 4030,
    4031, 4032, 4901, 4902, 5001, 5002, 5003, 5004, 5005, 5006, 6001, 6002, 6003, 6004, 6005, 6006, 7001, 7002, 7003,
    7004, 7005, 7006, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 8010, 8011, 8012, 8013, 8014, 8015, 8016,
    8017, 8018, 8019, 8020, 8021, 8022, 8023, 8024, 8025
  ];
  for(let i = 0; i < actionList.length; i++) {
    await page.goto(`http://127.0.0.1:8080/html_output/${actionList[i]}.html`, {});
    await screenshotDOMElement({
      path: `./output/${actionList[i]}.png`,
      selector: 'body > div',
      padding: 0
    });
  }
  browser.close();
})();