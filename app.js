const express=require("express");
const server=express();
const puerto=process.env.port||80;
const postgres=require('pg');
const body_parser=require("body-parser");
var registro_usuario=[];
var site_control=
    {
        concurso_on:"",
        pro_flayer:"/img/flayer.jpg",
        date_start:new Date(),
        date_end:new Date(),
        cantidad:0
    }
const multer  = require('multer');
const storage= multer.memoryStorage()
/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,__dirname+ '/public/img/flayers/')
    },
    filename: function (req, file, cb) {      
      cb(null, file.originalname)
    }
  })*/
const newupload = multer({ storage: storage })


var cors = require('cors');
server.use(body_parser.urlencoded({extended:true}))
server.use(body_parser.json())

//server.use(cors({optionsSuccessStatus: 200,credentials:true,origin:true}));
/*const connectionString ="postgres://eetxhnwv:ybCfRTTwlwxY9iP8ujCQHnAiOTs4HCxn@motty.db.elephantsql.com/eetxhnwv"
const cliente = new postgres.Pool({
    connectionString:'postgres://eetxhnwv:ybCfRTTwlwxY9iP8ujCQHnAiOTs4HCxn@motty.db.elephantsql.com/eetxhnwv',
  })*/
/*const conString = "postgres://eetxhnwv:ybCfRTTwlwxY9iP8ujCQHnAiOTs4HCxn@motty.db.elephantsql.com/eetxhnwv"
const cliente=new postgres.Client(conString);
cliente.connect(function(err)
  {
        if(err){return console.log("No se puede conectar a postgres")}
        cliente.query('SELECT NOW() AS "theTime"',function(err,result)
        {
            if(err){return console.log('error corriendo solicitud',err)}
            console.log(result.rows[0].theTime);
            
        }
       
        )

  }
)*/

const cliente = new postgres.Pool(
    {
        host:'localhost',
        port:5432,
        database:'registro',
        user:'postgres',
        password:'Admin'                       
    }  
)


server.use(express.static(__dirname+"/public"));
server.post('/set', newupload.single("image"),async (solicitud, respuesta, next)=>
  {
    console.log("Sección post/set")
    console.log(solicitud.body)
    console.log(solicitud.file)

    const d1=new Date(solicitud.body.date_start);
    const d2=new Date(solicitud.body.date_end);    
    if(solicitud.body.date_start!==""){site_control.date_start=d1}
    if(solicitud.body.date_end){site_control.date_end=d2}
    if(solicitud.body.concurso_on==='Si')
        {site_control.concurso_on=true;console.log('trueeeee')}
    else
        {site_control.concurso_on=false;console.log('Falseeee')}

    if(solicitud.file!=undefined)
    {               
        site_control.pro_flayer=solicitud.file ;   
       
    }   
    await configurar(); 
    await reestablecer();        
    respuesta.sendFile(__dirname+"/private/panel.html");    
  }
  )
server.post("/data",
    async(solicitud,respuesta)=>
    {
        
        let info;
        let resultado;
        const max_con =registro_usuario.length;
        let usuario_id=solicitud.body.id_user;        
        if (usuario_id===null)
        {           
           let new_number;
           new_number=parseInt((Math.random())*100000);           
         
            while(id_exist(new_number))
            {
                new_number=parseInt((Math.random())*100000);
                console.log("de nuevo...")
            }   
            usuario_id=new_number;
        }
        else
        {            
            add(usuario_id);
        }      
        
       
        console.log("Usuario"+">"+solicitud.body.id_user); 
        const rem_ip=solicitud.ip;
        const datos=consultar(3);   
        resultado=await datos;        
        respuesta.send({resultado:resultado,id_user:usuario_id,max_con:max_con});
    }
)
server.post("/com",
async (solicitud,respuesta)=>
  {
        
    switch (solicitud.body.orden)
    {
      case 1:         
         comentar(solicitud.body.texto,solicitud.body.es_publico,solicitud.body.sitio);       
         const mis_com1=await sacar_comentarios(solicitud.body.sitio);          
         respuesta.send(mis_com1.rows);
        break;
      case 2:                
         const mis_com2=await sacar_comentarios(solicitud.body.sitio);         
         respuesta.send(mis_com2.rows);
        break;  
    }   
    respuesta.send();
  }
)

async function consultar(orden)
{  
    let datos; 
    switch (orden)
    {
    case 1:       
        break;
    case 2:
        datos=await cliente.query(`SELECT count(*) FROM records`);         
        return datos.rows[0];
        break;
    case 3:
        datos=await cliente.query(`SELECT sitio,pun_max,usuario,telefono,date_time AT TIME ZONE '+0' FROM records where (pun_max=(select max(pun_max) from records) and date_time>='${kill_hzone(site_control.date_start)}' and date_time<='${kill_hzone(site_control.date_end)}')`);        
        if (datos.rows.length==0)
        {
            console.log("array vacio");
            datos.rows.push({stio:"tetris",pun_max:0,usuario:"Alguien",telefono:50000000,timezone:"2023-07-17T00:00"})
        }              
        return datos.rows[0];
        break;
    }
}
async function registrar(dato1 ,dato2,dato3,dato4)    //dato1=nombre del sitio,dato2=ip del visitante,dato3=fecha de la solicitud,dato4=hora de la solicitud
{   
     await cliente.query(`insert into visita (nombre,ip_cliente,fecha_load,hora_load) values ('${dato1}','${dato2}','${giveTime()}','${dato4}')`);
     //let temp1=consultar(2);
}
async function ins_score(isdato1 ,isdato2,isdato3,isdato4,isdato5) 
{   
     await cliente.query(`insert into records (sitio,pun_max,date_time,usuario,telefono) values ('${isdato1}','${isdato2}','${isdato3}','${isdato4}',${isdato5})`);
     //let temp1=consultar(2);
}
async function comentar(texto,public,sitio)
{
    const date_op=giveTime();     
   await cliente.query(`insert into comentarios (texto,publico,fecha,sitio) values ('${texto}','${public}','${date_op}','${sitio}')`);        
}
async function sacar_comentarios(sitio)
{
    const db_comentarios= await cliente.query(`select texto, publico, fecha AT TIME ZONE '+0', sitio from comentarios WHERE sitio='${sitio}'and publico=true`)
    return db_comentarios;
}
async function configurar()
{
    const tamaño=await cliente.query(`select * from setup`);
    if (tamaño.rowCount>0)
    {
             
        let query = {
            text: 'UPDATE setup SET date_start=$1,date_end=$2,concurso_on=$3,image=$4',
            values: [site_control.date_start,site_control.date_end,site_control.concurso_on,JSON.stringify(site_control.pro_flayer)]            
          };
          const res = await cliente.query(query);  
    }
    else
    {        
        let query = {
            text: 'INSERT INTO setup (date_start,date_end,concurso_on,image) VALUES ($1,$2,$3,$4)',
            values: [site_control.date_start,site_control.date_end,site_control.concurso_on,JSON.stringify(site_control.pro_flayer)]            
          };
        const res = await cliente.query(query);  
    }
}   
 async function reestablecer()
 {
    const resultado = await cliente.query(`select * from setup`);
    if (resultado.rowCount>0)
    {
    
    site_control.date_start=new Date(resultado.rows[0].date_start);
    site_control.date_end= new Date(resultado.rows[0].date_end);
    site_control.concurso_on=resultado.rows[0].concurso_on;
    site_control.pro_flayer=resultado.rows[0].image;
    }
    else
    {
        console.log("No hay datos de configuración en base de datos!")
        console.log("Haga una configuracion inicial antes de poner en produccion el sitio.")
    }
 }   

server.post
(
    "/registrar",
    (solicitud,respuesta)=>
    {
        const sitio=solicitud.body.site;
        let ip_remoto=solicitud.ip;
        if (ip_remoto==="::1"){ip_remoto="127.0.0.1"}              
       switch (solicitud.body.op)
           {
                case 1:
                    if (id_exist(solicitud.body.id_user))
                    {
                        ins_score(sitio,solicitud.body.record,giveTime(),solicitud.body.usuario,solicitud.body.telefono)
                        //ins_score(sitio,solicitud.body.record,date_input,solicitud.body.usuario)
                    }
                break;
            }

                     
        respuesta.send();
    }
)
server.get("/login",(solicitud,respuesta)=>
    {
        console.log("Doing GET")
        respuesta.sendFile(__dirname+'/private/login.html');                
    }
)
server.get
(
    "/get",
    async(solicitud,respuesta)=>
    {
        site_control.cantidad =await consultar(2)
        await reestablecer()
        console.log("Seccion get /get")
        console.log(site_control)                
        respuesta.send({setup:site_control});
        respuesta.end();      
    }
)

server.post
(
    "/panel/inside",(solicitud,respuesta)=>
    {
        
        if(solicitud.body.usuario=="Jefe" && solicitud.body.clave=="Js")
        {
            respuesta.sendFile(__dirname+"/private/panel.html");
        }   
        else
        {
            respuesta.send("Dato incorrecto!");
        }
    }
)
server.post
(
    "/clear_score",
    async(solicitud,respuesta)=>
        {
            console.log("delete")
            const resultado = await cliente.query(`delete from records`);  
            respuesta.status(200).end()
        }
       

)
server.get
(
    "*",
    (solicitud,respuesta)=>
    {
        respuesta.send("Error 404!")
    }
)


server.listen
(
    puerto,
    ()=>
    {
        console.log("server a la escucha en el puerto "+puerto);
        realtime(new Date());        
        kill_hzone(new Date())
        try 
            {reestablecer();}
           
        catch(e)    
        {
            console.log("No hay datos de configuración en base de datos.Error:"+e)
        }
    }   
)
const timer1=setInterval(doing,1000);
//------------------------------------ FUNCIONES----------------------------------
const add= function(dato)
{
    let full_id={id:dato,time:3}
    if (id_exist(dato))
    {        
        registro_usuario[registro_usuario.findIndex(elem=>elem.id==dato)].time=3;
    }
    else
    {
         registro_usuario.push(full_id);
    }    
}
function id_exist(numero)
{    
    if (registro_usuario.some(elemento=>{return numero===elemento.id}))
    {
        return true;
    }  
    else
    {
        return false;
    }
}
function doing()
{
       registro_usuario.forEach(element =>
         {
            element.time=element.time-1;
         }    
    );
    let temp_array=registro_usuario.filter
    (
        element2=>
        {
            return element2.time>0;
        }
    )    
    registro_usuario=temp_array;
}
function giveTime()
{
    const date_input=Date();
    console.log(date_input);
    const clock=date_input.split(" ");
    const temptime=clock[0]+" "+clock[1]+" "+clock[2]+" "+clock[3]+" "+clock[4];
    console.log(temptime);
    return temptime;
}
function realtime(mitiempo)
{   
    
    let dia=mitiempo.getUTCDate();
    let mes;
    switch (mitiempo.getUTCMonth())
    {
        case 0:
            mes="Enero";
            break;
        case 1:
            mes="Febrero";
            break;    
        case 2:
            mes="Marzo";
            break;    
        case 3:
            mes="Abril";
            break; 
        case 4:
            mes="Mayo";
            break;            
        case 5:
            mes="Junio";
            break;            
        case 6:
            mes="Julio";
            break;            
        case 7:
            mes="Agosto";
            break;            
        case 8:
            mes="Septimebre";
            break;            
        case 9:
            mes="Octubre";
            break;            
        case 10:
             mes="Noviembre";
             break;            
        case 11:
             mes="Diciembre";
             break;   
    }
    let año=mitiempo.getUTCFullYear();
    let horas=mitiempo.getUTCHours();
    let minutos=mitiempo.getUTCMinutes();
    const meridiano= horas<12?'am':'pm';    
    console.log(dia+" de "+mes+" del "+año+", "+horas+":"+minutos.toString().padStart(2,'0')+"."+meridiano);
}
function kill_hzone(fecha)
{
    console.log(fecha);
    let trans=fecha.toISOString()
    let piece1=trans.split(".");
    console.log(piece1);
    let piece2=piece1[0].split("T")
    console.log(piece2);
    return(piece2.join(" "));
}