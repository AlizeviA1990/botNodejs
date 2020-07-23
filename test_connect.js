var {createPool} = require('mysql')
var chalk = require('chalk')

var pool = createPool({
     connectionLimit : 10,
    // connectTimeout  : 60 * 60 * 1000,
    // acquireTimeout  : 60 * 60 * 1000,
    // timeout         : 60 * 60 * 1000,
    host : "192.168.1.35",
    port : '3306',
    user : "root",
    password : "root",
    database : "slotth_stbackend",
})

pool.query('UPDATE player_agent SET register_status = 2 WHERE player_agent_id = 12',(err,result,fields)=>{

    if(err){
        return console.log(chalk.white.bgRed.bold(err))
    }
    return console.log(result)
})