var concurso_fecha=document.getElementById("concurso_fecha")
function conneccion_1()
{
   //Registrar tu record
   console.log("enviando solicitud");
   let solicitud1=new XMLHttpRequest(); 
   solicitud1.onreadystatechange=function()
   {
      //console.log("AJAX "+this.response+"/state:"+this.readyState+ " /status"+this.status);
      if(this.readyState==4)
      {
         let resultado=JSON.parse(this.response);         
         console.log("AJAX "+this.response+"/state:"+this.readyState+" /status:"+this.status);
      }
   }  
   solicitud1.open("POST",document.location.origin+"/registrar",true)
   solicitud1.setRequestHeader("Content-Type", "application/json");
   solicitud1.send(JSON.stringify({id_user:id_user,op:1,site:"tetris",record:puntuación,usuario:usuario_nombre,telefono:usuario_telef}));   
   // En los datos enviados op significa la "operacion" a realizar en el servidor.En este caso 1 = registrar en base de datos
}
function conneccion_2()
{
   //Obtener el record maximo para tetris
  
   let solicitud2=new XMLHttpRequest(); 
   solicitud2.onreadystatechange=function()
   {
      //console.log("AJAX "+this.response+"/state:"+this.readyState+ " /status"+this.status);
      if(this.readyState==4)
      {
         if (this.status===200)
         {
            let resultado=JSON.parse(this.response);
           
            score_data.innerHTML=`<i>${resultado.resultado.pun_max}</i>`;         
            score_data.title="Supera este marcador para establecer un nuevo record!"
            score_user.innerHTML=`<i>${resultado.resultado.usuario}</i>`;            
            score_user.title=null;
            id_user=resultado.id_user;
            max_user_con.innerHTML=resultado.max_con;

            
         }
         else 
         {  
            score_data.innerHTML=`<i>N/D</i>`
            score_data.title="No hay connección con el servidor.La puntuación no será registrada."
            score_user.innerHTML=`<i>N/D</i>`
            score_user.title="No hay connección con el servidor.La puntuación no será registrada."
            score_date.innerHTML=`<i>N/D</i>`
            score_date.title="No hay connección con el servidor.La puntuación no será registrada."
         }
      }
      
   }  
   solicitud2.open("POST",document.location.origin+"/data",true)
   solicitud2.setRequestHeader("Content-Type", "application/json");   
   solicitud2.send(JSON.stringify({id_user:id_user}));      
}
function coneccion3()
{
    fetch(document.location.origin+"/cookie",{method:"POST"})
    .then(response => 
        {   
            return response.json();
        }        
    ).then
    (
      data=>{console.log(data)}
    )    
    .catch 
    (
        error=>
        {
            console.error('Error:',error)
        }
    );
}
window.onload=function()
{
     fetch('/get',{method:"GET"})
     .then((resp)=>{      
      return resp.json();
   })
     
     .then(data=>{
        console.log(data);
       //let temp=JSON.parse(data.setup.pro_flayer)


      //flayer.src=document.location.origin+data.setup.pro_flayer;
      //flayer.src=`data:${element.galeria[0].buffer.mimetype};base64,${a_base64(element.galeria[0].buffer.buffer.data)}`
      flayer.src=`data:${(data.setup.pro_flayer.buffer.mimetype)};base64,${a_base64(data.setup.pro_flayer.buffer.data)}` 
      concurso_fecha.innerHTML="Válido desde el "+ realtime(new Date(data.setup.date_start),3)+" hasta el "+ realtime(new Date(data.setup.date_end),3)
      if(data.setup.concurso_on==="true")
      {
        concurso_fecha.style.display="block";
        
      }
      else
      {
        concurso_fecha.style.display="none";
       
      }
      
   }) 
     .catch((error)=>
         {
            console.error('Error:',error)
         }
      )
}

//---------------------------------------------------------------------------------------------------------
function realtime(mitiempo,valor)
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
    //console.log(dia+" de "+mes+" del "+año+", "+horas+":"+minutos.toString().padStart(2,'0')+"."+meridiano);
    switch(valor)
        {
            case 1:
                return dia+" de "+mes+" del "+año+", "+horas+":"+minutos.toString().padStart(2,'0')+"."+meridiano;
                break;
            case 2:
                return dia+" de "+mes+" del "+año;
                break;
            case 3:
                return dia+" de "+mes;
                break;    

        }
    
}
function a_base64(arrayM)
{
    let numero=4;
    numero.valueOf
    let buffer = new Uint8Array(arrayM)
    let base64="";
    buffer.forEach(elemento=>
        {
            base64= base64+(String.fromCharCode(elemento));
        }
    )
    console.log(base64);
    let t=btoa(base64);
    console.log("Nuevo: "+t)   
    return t;
}