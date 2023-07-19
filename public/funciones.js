
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
   solicitud1.open("POST","http://10.40.18.23:80/registrar",true)
   solicitud1.setRequestHeader("Content-Type", "application/json");
   solicitud1.send(JSON.stringify({op:1,site:"tetris",record:puntuación,usuario:usuario_nombre,telefono:usuario_telef}));   
   // En los datos enviados op significa la "operacion" a realizar en el servidor.En este caso 1 = registrar en base de datos
}
function conneccion_2()
{
   //Obtener el record maximo para tetris
   console.log("enviando solicitud 2");
   let solicitud2=new XMLHttpRequest(); 
   solicitud2.onreadystatechange=function()
   {
      //console.log("AJAX "+this.response+"/state:"+this.readyState+ " /status"+this.status);
      if(this.readyState==4)
      {
         if (this.status===200)
         {
            let resultado=JSON.parse(this.response);
            console.log(resultado);
            score_data.innerHTML=resultado.resultado.pun_max;         
            score_data.title="Supera este marcador para establecer un nuevo record!"
            score_user.innerHTML=resultado.resultado.usuario;
            //score_date.innerHTML=resultado.resultado.timezone;
            score_user.title=null;
            id_user=resultado.id_user;
            max_user_con.innerHTML=resultado.max_con;

            
         }
         else 
         {  
            score_data.innerHTML="N/D"
            score_data.title="No hay connección con el servidor.La puntuación no será registrada."
            score_user.innerHTML="N/D"
            score_user.title="No hay connección con el servidor.La puntuación no será registrada."
            score_date.innerHTML="N/D"
            score_date.title="No hay connección con el servidor.La puntuación no será registrada."
         }
      }
      
   }  
   solicitud2.open("POST","http://10.40.18.23:80/data",true)
   solicitud2.setRequestHeader("Content-Type", "application/json");   
   solicitud2.send(JSON.stringify({id_user:id_user}));      
}
function coneccion3()
{
    fetch("http://localhost:80/cookie",{method:"POST"})
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

