require('chromedriver');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();


//driver.get('https://ag.ufabet.com');
driver.get('http://ocean.isme99.com/Public/Default11.aspx?lang=EN-GB');
driver.getTitle().then(function(title){
    console.log(title);
    driver.findElement(By.id("txtUserName")).sendKeys("ufss6ttice001");
    driver.findElement(By.id("txtPassword")).sendKeys("Aa112233++");
    //var imgObj = driver.findElements(By.tagName("img")).then((result) => {console.log(result[1].getAttribute('src').then(url => console.log(url)))});
    driver.findElement(By.id('btnSignIn')).click();
    driver.findElement(By.id('transfer')).click();
})

// ตัดสตริง
// http://ocean.isme99.com/_Age_Sub/Main.aspx?lang=EN-GB
// เข้าผ่านลิงค์
// http://ocean.isme99.com/_Age_Sub/AccBal.aspx?role=ag&userName=ufss6tt&searchKey=ufss6tt0000&pageIndex=1