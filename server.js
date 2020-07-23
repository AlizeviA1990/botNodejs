const express = require('express')
const path = require('path')
const delay = require('delay')
const chalk = require('chalk')
const uGenUserDB = require('./db_update_status_generate_user')
const queueStore = require('./queue_manage')
var Queue = require('better-queue')

const app = express();

require('chromedriver');
const {Builder, By, Key, until} = require('selenium-webdriver');


const { createWorker } = require('tesseract.js');
const { url } = require('inspector');

const worker = createWorker();

const fs = require('fs');
const sharp = require('sharp');
const { ALPN_ENABLED } = require('constants');
const { qGen } = require('./queue_manage')

var logincount = 0


var agent = {
  agentURL : 'https://ag.ufabet.com',
  prefix : 'ufss6tt',
  username : 'ufss6s',
  password : 'Dv!8ZA8D_tH8O{e',
  clientURL : 'https://ufabet.com'
      // var agentPrefix = agent.prefix//'ufss6tt';
    // var agentUsername = agent.username//'ufss6s';//'ufss6ttice001';
    // var agentPassword = agent.password//'Dv!8ZA8D_tH8O{e';//'Aa112233++';
}
var user = {
  username : "",
  password : "",
  credits : 0,
  contactInfo : "",
  status : 1,
  block : 0,
  normal_login : true,
  devices_login : false
}
var bot_session = {
  homepageURL : '',
  logged : false
}

var qGenObj = {
    agentID:"",
    username:"",
    password:"",
    contactinfo:""
}

var q = new Queue(async function (input, cb) {
  console.log('.................................'+input.agenID)
  var msg = await check_qGentask(input.agenID,input.username,input.password,input.contactinfo)
      //resetPassword(input.username,input.password)
  cb(msg)
  }
)


var qGenList = queueStore.qGen

_login().then(()=>check_Login().then(
  (login_result)=>{
      console.log(chalk.white.bgGreen.bold('login result : ',login_result))
      if(login_result==true){
        bot_session.logged = true
        for(var i=0 ; i<qGenList.qGen.length ; i++){
        q.push({agenID:qGenList.qGen[i].agenID,
          username:qGenList.qGen[i].username,
          password:qGenList.qGen[i].password,
          contactinfo:qGenList.qGen[i].contactinfo
        },(result)=>{
          console.log(chalk.black.bold.bgYellow(result))
        });
        }
      }}
  )
)

//resetPassword('ufss6stest000010','123asE4567')

async function resetPassword(_username,_password){
  driver = await new Builder().forBrowser('chrome').build();
  // var newtabURL = 'window.open("'+agent.clientURL+'");'
  // driver.executeScript(newtabURL);
  await driver.get(agent.clientURL)
  await delay(1000)
  await driver.findElement(By.id('txtUserName')).sendKeys(_username)//ufss6stest000006
  await driver.findElement(By.id('password')).sendKeys('abcd1234')//123asE456
  await driver.findElement(By.id('btnLogin')).click();
  await driver.findElement(By.id('txtOldPassword')).sendKeys('abcd1234')//ufss6stest000006
  await driver.findElement(By.id('txtNewPassword')).sendKeys(_password)//123asE456
  await driver.findElement(By.id('txtConfirmPassword')).sendKeys(_password)//123asE456
  await driver.findElement(By.id('btnSave')).click()
  await driver.findElement(By.id('btnAgree')).click()
  var checkURL = await driver.getCurrentUrl()
  console.log(chalk.black.bold.bgMagentaBright(checkURL))
  console.log(chalk.black.bold.bgMagentaBright(checkURL))
  console.log(chalk.black.bold.bgMagentaBright(checkURL))
  console.log(chalk.black.bold.bgMagentaBright(checkURL))
}

async function check_qGentask(_agenID,_username,_password,_contactinfo){
  
  await driver.get(bot_session.homepageURL)
  if(bot_session.logged==true){
    var msgCheck;
      generate_user(_username,_password,_contactinfo).then(()=>{
        msgCheck = driver.findElement(By.id('lblStatus')).getText()
        msgCheck.then(async function(generate_status){
          if(generate_status == 'อัพเดตข้อมูลเรียบร้อย'){
            console.log(chalk.white.bgGreen.bold(generate_status))
            // gen user สำเร็จแล้ว ให้ update status ไปที่ db 
            // TODO : เช็คว่า update สำเร็จไหมด้วย
            uGenUserDB.updateStatus('1',q.agenID)//.then((result)=>console.log(result))
            return generate_status
          }else{
            console.log(chalk.white.bgRed.bold(generate_status))
            //TODO: gen user ไม่สำเร็จแล้ว update status ไปที่ db และ  clear ออกจาก List queue
            switch(generate_status) {
              case 'Password must be contain 8-15 characters with a combination of alphabetic characters and numbers and must not contain your login name.':
                uGenUserDB.updateStatus('2',req.params.agenID)
                return generate_status
                break;
              case 'รหัสผู้ใช้มีผู้ใช้แล้ว.':
                uGenUserDB.updateStatus('3',req.params.agenID)
                return generate_status
                break;
              case 'รหัสผู้ใช้ต้องไม่เกิน 16 ตัวอักษร!':
                uGenUserDB.updateStatus('4',req.params.agenID)
                return generate_status
                break;
              default:
                uGenUserDB.updateStatus('9',req.params.agenID)
                return generate_status
                break;
            }
          }
        })
      })
  }else{
    console.log(chalk.white.bold.bgRed("Session not log-in, gonna re-login in 3 s"))
    await delay(30000)
    check_Login()
  }
}
async function check_Login() {
  await delay(1000)
  var mainUrl = await driver.getCurrentUrl()
  if(mainUrl.includes("Main.aspx")){
    console.log(chalk.white.bold.bgGreen("Logged!"))
    bot_session.homepageURL = mainUrl
    logincount = 0
    return true
  }else{
    logincount ++
    console.log(chalk.white.bold.bgRed("Login Fail! gonna re-login agian after 3s"))
    await delay(3000)
    if(logincount < 3){
      driver.close()
      _login().then(()=>check_Login())
    }else {
      console.log(chalk.white.bold.bgRed("Login Fail! please contact watcharee"))
      return false
    }
  }
}
async function _login() {

  driver = await new Builder().forBrowser('chrome').build();
  // Navigate to Url
  await driver.get(agent.agentURL)
  
  var element = driver.findElement(By.id("divImgCode"));
  var screenShot = 'screen.png'
  var outputImg = 'captcha.png'
  
  await driver.takeScreenshot().then(async function(data) {
    await delay(1000)
    fs.writeFileSync(screenShot, data, 'base64');
  })

  await element.getRect().then( res => {
    sharp(screenShot).extract({ width: res.width, height: res.height, left: parseInt(res.x), top: parseInt(res.y) }).toFile(outputImg)
    .then(function() {
        console.log(chalk.green("Image cropped and saved"))
    })
    .catch(function(err) {
        console.log(chalk.red(err))
    })
  })
  
  await driver.findElement(By.id('txtUserName')).sendKeys(agent.username)
  await driver.findElement(By.id('txtPassword')).sendKeys(agent.password)
  
  await tesseractGet('captcha.png').then((result) => {
     driver.findElement(By.id('txtCode')).sendKeys(result)
  }).catch(function(err){
      console.log(chalk.red(err));
  })

  return driver
}
async function tesseractGet(imagePath) {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: '0123456789',
  });
  const { data: { text } } = await worker.recognize(imagePath);
  await worker.terminate();
  return text;
}
// selenium search balance
async function search_balance() {
    await delay(1000)
    currentUrl = await driver.getCurrentUrl()
    console.log(chalk.blueBright('CurrentUrl IS : ',currentUrl))
    var indexURL = currentUrl.lastIndexOf("/")
    var subURL = currentUrl.substring(0, indexURL+1)
    console.log(chalk.inverse.yellow('subURL IS : ',subURL))
    var resultURL = (subURL+'AccBal.aspx?role=ag&userName='+agent.prefix+'&searchKey='+searchForUserID+'&pageIndex=1')
    console.log(chalk.inverse.green('resultUrl IS : ',resultURL))

    //............................... await driver.get(resultURL)
}
async function generate_user(gUsername,gPassword,gContactDetail){
  var _currentUrl = await driver.getCurrentUrl()
  var subURL = _currentUrl.substring(0, _currentUrl.lastIndexOf("/"))
  var link_add_member = subURL+'1/MemberSet.aspx?cName=ufss6s00000&set=1'
  await driver.get(link_add_member)
  await driver.findElement(By.id('txtUserName')).sendKeys(gUsername);
  await driver.findElement(By.id('txtPassword')).sendKeys('abcd1234');
  await driver.findElement(By.id('txtTotalLimit')).sendKeys('0');
  await driver.findElement(By.id('txtContact')).sendKeys(gContactDetail);
  await driver.findElement(By.id('btnUsaYes')).click();
  await driver.findElement(By.id('btnSuspendNo')).click();
  await driver.findElement(By.id('btnSave')).click();
};
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  
app.get('/', (req, res) => {
  res.send('OK')
})

function save_qGen(_qGenList){
  var saveQL = JSON.stringify(_qGenList) 
  fs.writeFileSync('files/generate-queue-list.json',saveQL)
}
app.get('/add_queue_generate_user/:agenID/:username/:password/:contactinfo', (req, res) => {
  q.push({agenID:req.params.agenID, 
          username:req.params.username,
          password:req.params.password,
          contactinfo:req.params.contactinfo})
  res.send('adding queue...'+'new queue '+q.length)
})

// TODO : ถ้า gen user เสร็จแล้ว ลบ แล้ว ให้เช็คดูว่า queueList ยังมี lenght ไหม ถ้ามีก็ให้ gen อีก
app.get('/generate_user/:agenID/:username/:password/:contactinfo', (req, res) => {
  
  generate_user(req.params.username,req.params.password,req.params.contactinfo)
  res.send('generating user...')
})



// app.get('/agent', function (req, res) {
//   fs.readFile(__dirname+"/json_object/agent.json",'utf8',function(err,data){
//     // var dataBuffer = data.toString()
//     // var dataParse = JSON.parse(dataBuffer)
//     res.send(data)
//   })
// })

// app.get('/agent_username', function (req, res) {
//   fs.readFile(__dirname+"/json_object/agent.json",'utf8',function(err,data){
//     var dataBuffer = data.toString()
//     var dataParse = JSON.parse(data)
//     console.log(dataParse["agent"]["username"])
//     res.send(dataParse["agent"]["username"])
//   })
// })

// app.post('/registerUFA/:username/:password/:contactInfo', function (req, res) {
//   console.log(req.params)
//   res.send(req.params)
// })

// app.delete('/delUser/:index', function (req, res){
//   fs.readFile(__dirname+"/json_object/agent.json",'utf8',function(err,data){
//     datas = JSON.parse(data)
//     delete datas["user"+req.params.index]
//     res.send(JSON.stringify(datas))
//   })
// })


app.listen(3000, () => {
  console.log(chalk.yellow('Start server at port 3000.'))
})


