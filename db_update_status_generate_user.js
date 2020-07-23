var {createPool} = require('mysql')
var chalk = require('chalk')

var pool = createPool({
     connectionLimit : 10,
    host : "192.168.1.9",
    port : '3306',
    user : "root",
    password : "root",
    database : "slotth_stbackend",
})

const updateStatus = function (register_status, player_agent_id){
    pool.query('UPDATE player_agent SET register_status = '+register_status+' WHERE player_agent_id = '+player_agent_id,(err,result,fields)=>{

        if(err){
            console.log(chalk.white.bgRed.bold(err))
            // TODO: ถ้าอัพเดท status ไม่สำเร็จ เซิฟเวอร์มีปัญหา แต่เราทำการ gen แล้ว >>> ให้แอด {'player_agent_id':'xx','register_status':'0-9'} เก็บไว้
            return err
        }
        console.log(result)
        return result
    })
}
module.exports = {
    updateStatus : updateStatus
}