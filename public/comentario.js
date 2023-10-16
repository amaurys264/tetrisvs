var section_js=document.getElementById("seccion");
var enviar_js=document.getElementById("enviar");    
var texto_js=document.getElementById("texto_comentario");
var publico_js=document.getElementById("check1");
var refrescando=setInterval(refrescar,5000);

enviar_js.onclick=function()
{
    
    const cuerpo=
   {
      texto:texto_js.value,
      es_publico:publico_js.checked,
      orden:1,
      sitio:"tetris"
   } 

   fetch(document.location.origin+'/com',
   {
    method:'POST',
    headers:{
        'Content-Type':'application/json'
    },
    
    body: JSON.stringify(cuerpo)
   }) 
   .then(response=>response.json())
   .then(datos=>
      {
         
         section_js.innerHTML=value; 
         datos.forEach(element =>{

         section_js.value+=`<div class="capsula">                
            <p class="s-fecha">${realtime(new Date(element.timezone))}</p> <br/>                 
            <p class="registro" >
                ${element.texto}
            </p>                           
        </div>`
            
         });
         texto_js.value=null;
      })
   .catch(error=>{console.log(error);texto_js.value=null;});
}


window.onload=function()
{
   console.log("load");
   //enviar_js.disabled=true;
   refrescar();
  
}
function refrescar()
{
    const cuerpo=
    {
       orden:2,
       sitio:"tetris"
    } 
 
    fetch(document.location.origin+'/com',
    {
     method:'POST',
     headers:{
         'Content-Type':'application/json'
     },
     
     body: JSON.stringify(cuerpo)
    }) 
    .then(response=>response.json())
    .then(datos=>
       {
          let c=0   
          section_js.innerHTML=null; 
          datos.forEach(element =>{                   
          section_js.innerHTML+=`
          <div class="capsula">  
          <p class="s-fecha">${realtime(new Date(element.timezone))}</p> <br/>
                                                        
             <p class="registro" >
                 ${element.texto}
             </p>           
         </div>`
             
          });
       })
    .catch(error=>{console.log(error)});
    section_js.scrollTop

}
enviar_js.oninput=function()
{
   if (enviar_js.value==="")
   {
      enviar_js.disabled=true;
   }
   else
   {
      enviar_js.disabled=false;
   }
}
function giveTime()
{
    const date_input=Date();    
    const clock=date_input.split(" ");
    const temptime=clock[0]+" "+clock[1]+" "+clock[2]+" "+clock[3]+" "+clock[4]+"-0";    
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
    if (meridiano=='pm')   
    {
      horas=horas-12;      
    }
    if (horas==0){horas=12}

    return dia+" de "+mes+" del "+año+", "+horas+":"+minutos.toString().padStart(2,'0')+"."+meridiano;
}