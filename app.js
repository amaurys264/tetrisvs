const express=require("express");
const server=express();
const puerto=process.env.port||3000;
const postgres=require('pg');
const body_parser=require("body-parser");
var registro_usuario=[];
    module.export=registro_usuario;
const table_user=require('./extra-code');



var cors = require('cors');
const { name } = require("ejs");
//const { Console } = require("node:console");
//const { parse } = require("node:path");
//const { isNull } = require("node:util");
server.use(body_parser.urlencoded({extended:false}))
server.use(body_parser.json())

server.use(cors({optionsSuccessStatus: 200,credentials:true,origin:true}));
const cliente=new postgres.Pool
(
    {
        host:'localhost',
        port:5432,
        database:'Registro',
        user:'postgres',
        password:'Admin'               
    }  
)
server.use(express.static(__dirname+"/public"));
server.use((req,resul, next)=>
{
  next();
}
)
server.post
(
    "/cookie",
    (solicitud,respuesta)=>
    {
        console.log(solicitud.cookies);        
    }
)
server.post
(
    "/data",
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
        
        console.log(registro_usuario);
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
         console.log(solicitud.body); 
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
        datos= await cliente.query(`SELECT * FROM public.visita`);
        //console.log(datos.rows);  
        let n22=await consultar(2);       
        let n23 = n22;        
        Object.assign(datos.rows,n23);
        return datos.rows;
        break;
    case 2:
        datos= await cliente.query('SELECT * FROM public.visita');        
        return datos.rows;
        break;
    case 3:
        datos=await cliente.query(`SELECT sitio,pun_max,usuario,telefono,date_time AT TIME ZONE '+0' FROM records where (pun_max=(select max(pun_max) from records) and date_time>='2023-07-23 00:00:01' and date_time<='2023-08-24 00:00:01')`);        
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
    console.log(public);
   await cliente.query(`insert into comentarios (texto,publico,fecha,sitio) values ('${texto}','${public}','${date_op}','${sitio}')`);        
}
async function sacar_comentarios(sitio)
{
    
    const db_comentarios= await cliente.query(`select texto, publico, fecha AT TIME ZONE '+0', sitio from comentarios WHERE sitio='${sitio}'and publico=true`)
    return db_comentarios;
}
server.get
(
    "*",
    (solicitud,respuesta)=>
    {
        respuesta.send("Error 404!")
    }
)

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
                    ins_score(sitio,solicitud.body.record,giveTime(),solicitud.body.usuario,solicitud.body.telefono)
                    //ins_score(sitio,solicitud.body.record,date_input,solicitud.body.usuario)
                break;
            }

        console.log("registrando");                
        respuesta.send();
    }
)
server.post
(
    "/",
    (solicitud,respuesta)=>
    {
        console.log(solicitud.ip);
        respuesta.send();
        let encabezado=solicitud
        console.log(solicitud.body);
        console.log(solicitud.cookies);
        console.log(solicitud.signedCookies);
    }
)

server.listen
(
    puerto,
    ()=>
    {
        console.log("server a la escucha en el puerto "+puerto);
        realtime(new Date());
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