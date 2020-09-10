// version v0.0.1
// create by ruicky
// detail url: https://github.com/ruicky/jd_sign_bot

const exec = require('child_process').execSync
const fs = require('fs')
const rp = require('request-promise')
const download = require('download')

// 公共变量
const cookie = process.env.TXNEWS_COOKIE
//const signurl = process.env.TXNEWS_SIGN
//const videourl = process.env.TXNEWS_VIDEO
const serverJ = process.env.PUSH_KEY


async function downFile () {
    const url = 'https://raw.githubusercontent.com/Sunert/Scripts/master/Task/txnews.js'
    await download(url, './')
}

async function changeFiele () {
   let content = await fs.readFileSync('./txnews.js', 'utf8')
   content = content.replace(/var cookieVal = ''/, `var cookieVal = '${cookie}'`)
   //content = content.replace(/var signurlVal = ''/, `var signurlVal = '${signurl}'`)
   //content = content.replace(/var videoVal = ''/, `var videoVal = '${videourl}'`)
   await fs.writeFileSync( './txnews.js', content, 'utf8')
}

async function sendNotify (text,desp) {
  const options ={
    uri:  `https://sc.ftqq.com/${serverJ}.send`,
    form: { text, desp },
    json: true,
    method: 'POST'
  }
  await rp.post(options).then(res=>{
    console.log(res)
  }).catch((err)=>{
    console.log(err)
  })
}

async function start() {
  if (!cookieVal) {
    console.log('请填写 key 后在继续')
    return
  }
  // 下载最新代码
  await downFile();
  console.log('下载代码完毕')
  // 替换变量
  await changeFiele();
  console.log('替换变量完毕')
  // 执行
  await exec("node txnews.js >> result.txt");
  console.log('执行完毕')
  if (serverJ) {
    const path = "./result.txt";
    let content = "";
    if (fs.existsSync(path)) {
      content = fs.readFileSync(path, "utf8");
    }
    await sendNotify("腾讯新闻-" + new Date().toLocaleDateString(), content);
    console.log('发送结果完毕')
  }
}

start()
