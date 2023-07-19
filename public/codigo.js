var micanvas=document.getElementById('caja');
var lienzo=micanvas.getContext('2d');
var micanvas2=document.getElementById('canvitas');   
var canvitas=micanvas2.getContext('2d');
var game=document.getElementById("tetris");
var dato2=document.getElementById("speed");
var dato3=document.getElementById("n_piezas");
var dato4=document.getElementById("puntos");
var over=document.getElementById("over");
var start=document.getElementById("start");
var boton_over=document.getElementById("boton_over");
var sonido1=document.getElementById("efecto1");
var sonido2=document.getElementById("efecto2");
var sonido3=document.getElementById("efecto3");
var sonido4=document.getElementById("efecto4");
var plano2=document.getElementById("segundo_plano");
var boton_over=document.getElementById("boton_over");
var boton_start=document.getElementById("boton_start");
var b_arriba=document.getElementById("b_arriba");
var b_abajo=document.getElementById("b_abajo");
var b_izquierda=document.getElementById("b_izquierda");
var b_derecha=document.getElementById("b_derecha");

var score_data=document.getElementById("score_data");
var score_user=document.getElementById("score_user");
//var score_date=document.getElementById("score_date");
var t_user=document.getElementById("t_user");
var input_nombre=document.getElementById("input_name");
var input_telefono=document.getElementById("input_number");
var puntuacion_resumen=document.getElementById("puntuacion_resumen");
var max_user_con=document.getElementById("usuarios_activos");
//document.title="TETRIS.VS"
var mapa=[{x:1,y:50}];
var figura=[{x:0,y:2,color:1},{x:1,y:1,color:1},{x:1,y:2,color:1},{x:2,y:1,color:1}];
var pieza_actual=10;
var pieza_siquiente=10;
var pieza_posicion=0;
var altura=-2;
var speed_game=1;   //velocidad establecida para el descenzo de cada bloque.
var desplazamiento=1;
var speed=speed_game;
var tiempo=1;  //contador utilizado para calcular el tiempo de refrescamiento en pantalla
    lienzo.fillStyle="#000099";
    lienzo.strokeStyle="#990000";
var puntuación=0;         //puntuacion que se optiene durante el juego
var no_piezas=0;         //cantidad de piezas que se han acomodado
var contador_nivel=0       //cada vez que llegue a 100 .se incrementa la velocidad
var record=null;
var usuario_nombre=null;   //nombre del cliente que va a jugar
var usuario_telef=null;  //telefono del cliente que va a jugar
var id_user=NaN;              // identificacion de usuario dada por el servidor

//if (localStorage.length>0){record=localStorage.getItem(record);actualizar_pizarra()};
var figura_siguiente=elegir(true,1,pieza_posicion);
window.addEventListener("keydown", (evento) => {  
    switch (evento.key)
   {
      case "ArrowLeft":
         if (!iscoll(figura,mapa,"izquierda"))
         {
             sonido4.pause();
             sonido4.play();
             --desplazamiento;             
         }    
          break;
      case "ArrowRight":
         if (!iscoll(figura,mapa,"derecha"))
           {
             sonido4.pause();
             sonido4.play();
             ++desplazamiento;             
           }  
          break;
      case "ArrowUp":
         let next_pos=pieza_posicion;
   
           ++next_pos;
           if(next_pos>3)
          {
             next_pos=0;
          }
       let figura_temp=elegir(false,pieza_actual,next_pos);        
   
       if (!iscoll(figura_temp,mapa,"rotar"))
          {
            ++pieza_posicion;
           if(pieza_posicion>3)
           {
              pieza_posicion=0;
           }
           sonido1.load();
           sonido1.play();
            figura=elegir(false,pieza_actual,pieza_posicion);
           }        
          break;         
      case "ArrowDown":
         speed=30; 
          break;  
   }
 }) 
 window.addEventListener("keyup",
  (evento) =>
       {
         if (evento.key=="ArrowDown")
         {
            speed=speed_game;
         }
       }
    ) 

 boton_over.onclick=function()
 {
      over.style.display="none";
      plano2.style.display="block";
      mapa=[{x:1,y:50}];
      nueva_pieza();
      speed_game=1;
      speed=1;
      puntuación=0;
      no_piezas=0;
      contador_nivel=0  
      actualizar_pizarra();      
      frame=setInterval(mostrar,16);
      ajax_time=setInterval(conneccion_2,1000);
 }
 boton_start.onclick=function()
 {
   console.log(input_nombre.value);
   console.log(input_telefono.value);   

      if(input_nombre.value=="" || input_telefono.value=="" || input_telefono.value<50000000 || input_telefono.value>59999999 )
      {         
         alert("Tu informacion está incompleta,o no es válida");
         return;
      }
      sonido1.play();
      sonido1.pause();
      sonido2.play();
      sonido2.pause();
      sonido3.play();
      sonido3.pause();
      sonido4.play();
      sonido4.pause();
      start.style.display="none";
      plano2.style.display="block";
      mapa=[{x:1,y:50}];
      nueva_pieza();
      speed_game=1;
      speed=1;
      puntuación=0;
      no_piezas=0;
      contador_nivel=0;
      usuario_nombre= input_nombre.value;
      usuario_telef=input_telefono.value; 
      t_user.innerHTML=usuario_telef;
      actualizar_pizarra();      
      frame=setInterval(mostrar,16);
      ajax_time=setInterval(conneccion_2,1000);
 }

b_abajo.ontouchstart=function()
{
   speed=30;           
}

b_abajo.ontouchend=function()
{
   speed=speed_game;           
}
b_arriba.onclick=function()
{
   let next_pos=pieza_posicion;
   
           ++next_pos;
           if(next_pos>3)
          {
             next_pos=0;
          }
       let figura_temp=elegir(false,pieza_actual,next_pos);        
   
       if (!iscoll(figura_temp,mapa,"rotar"))
          {
            ++pieza_posicion;
           if(pieza_posicion>3)
           {
              pieza_posicion=0;
           }
           sonido1.load();
           sonido1.play();
            figura=elegir(false,pieza_actual,pieza_posicion);
           }         
}
b_izquierda.onclick=function()
{
   if (!iscoll(figura,mapa,"derecha"))
           {
             ++desplazamiento;             
           }  
}
b_derecha.onclick=function()
{
   if (!iscoll(figura,mapa,"izquierda"))
         {
             --desplazamiento;             
         }     
}

function mostrar()
{
    lienzo.clearRect(0, 0, 200,400);
    canvitas.clearRect(0,0,40,40);
    mapa.forEach
    ( 
        cubito=>
        {     
           lienzo.strokeStyle='black';           
           lienzo.fillStyle=getColor(cubito.color);
           lienzo.fillRect((cubito.x)*20,(cubito.y)*20,20,20);           
          
           lienzo.lineTo((cubito.x * 20)+20,(cubito.y * 20));
           lienzo.lineTo((cubito.x * 20)+20,(cubito.y * 20)+20);
           lienzo.strokeRect((cubito.x*20)+1,(cubito.y*20)+1,18,18);
           
        }   
    )
    figura_siguiente.forEach
    (
      muestra=>
      {
           canvitas.lineWidth=0.2;
           canvitas.strokeStyle='black'; 
           canvitas.fillStyle=getColor(muestra.color);
           canvitas.fillRect((muestra.x)*10,(muestra.y)*10,10,10);
           canvitas.strokeRect(((muestra.x )*10)+1,((muestra.y)*10)+1,8,8);
      }
    )

    figura.forEach
    ( 
        cubito=>
        {     
           lienzo.strokeStyle='black'; 
           lienzo.fillStyle=getColor(cubito.color);
           lienzo.fillRect((cubito.x + desplazamiento)*20,(cubito.y+ altura)*20,20,20);
           lienzo.strokeRect(((cubito.x + desplazamiento)*20)+1,((cubito.y+altura)*20)+1,18,18);
          
        }   
    )
    ++tiempo;
    if(tiempo> (60/speed))
    {
        //speed=speed_game;
         tiempo=1;       
        mover()
        ++altura;
    }
}
 
function agregar()
    {
        let xrandom=parseInt(Math.random()*10);
        let yrandom=parseInt(Math.random()*20);      
        mostrar();
    }
   // agregar();
   
function mover()
   
   {
      
      if(iscoll(figura,mapa,"rotar"))
         {
      
            puntuacion_resumen.innerHTML=puntuación;
            conneccion_1()      
            clearInterval(frame);
            clearInterval(ajax_time);
            over.style.display="block";
            plano2.style.display="none";
            id_user=NaN;
            //----------------------------------
            return;
         }
      
       if(!isfloor(figura,mapa))
       {
            if(altura > 19)
            {               
               nueva_pieza();
            }            
       }
       else
       {         
         
            transferir();            
            sonido2.load();
            sonido2.play();
            chequear();
            nueva_pieza();                        
       }
   }
function elegir(aleatorio,num=10,angulo=0)
   {
       let numero=aleatorio==true?((parseInt(Math.random()*7)+1)*10):num;       
       if (aleatorio==true)
       {
          pieza_siquiente=numero;
          pieza_posicion=0;
          angulo=0;
       }
       switch(numero+angulo)
       {
                //---xx-----------------------pieza 1-------------------------------------------  
                //--xx---
            case 10:return [{x:0,y:2,color:1},{x:1,y:1,color:1},{x:1,y:2,color:1},{x:2,y:1,color:1}]
               break;//
            case 11:return [{x:1,y:1,color:1},{x:1,y:2,color:1},{x:2,y:2,color:1},{x:2,y:3,color:1}]
               break;//
            case 12:return [{x:0,y:2,color:1},{x:1,y:1,color:1},{x:1,y:2,color:1},{x:2,y:1,color:1}]
               break;//
            case 13:return [{x:1,y:1,color:1},{x:1,y:2,color:1},{x:2,y:2,color:1},{x:2,y:3,color:1}]
               break;//
             
               //-------------------------pieza 2-------------------------------------------
               //---xxxx--
            case 20:return [{x:0,y:2,color:2},{x:1,y:2,color:2},{x:2,y:2,color:2},{x:3,y:2,color:2}]               
               break;//
            case 21:return [{x:1,y:0,color:2},{x:1,y:1,color:2},{x:1,y:2,color:2},{x:1,y:3,color:2}]               
               break;//   
            case 22:return [{x:0,y:2,color:2},{x:1,y:2,color:2},{x:2,y:2,color:2},{x:3,y:2,color:2}]               
               break;//
            case 23:return [{x:1,y:0,color:2},{x:1,y:1,color:2},{x:1,y:2,color:2},{x:1,y:3,color:2}]               
               break;//      
               //---xx----------------------pieza 3-------------------------------------------
               //----xx-
            case 30:return [{x:0,y:1,color:3},{x:1,y:1,color:3},{x:1,y:2,color:3},{x:2,y:2,color:3}]               
               break;//
            case 31:return [{x:1,y:2,color:3},{x:1,y:3,color:3},{x:2,y:1,color:3},{x:2,y:2,color:3}]               
               break;//   
            case 32:return [{x:0,y:1,color:3},{x:1,y:1,color:3},{x:1,y:2,color:3},{x:2,y:2,color:3}]               
               break;//
            case 33:return [{x:1,y:2,color:3},{x:1,y:3,color:3},{x:2,y:1,color:3},{x:2,y:2,color:3}]               
               break;//  
               //---x----------------------pieza 4-------------------------------------------
               //--xxx---
            case 40:return [{x:0,y:2,color:4},{x:1,y:1,color:4},{x:1,y:2,color:4},{x:2,y:2,color:4}]               
               break;//
            case 41:return [{x:1,y:3,color:4},{x:1,y:1,color:4},{x:1,y:2,color:4},{x:2,y:2,color:4}]               
               break;// 
            case 42:return [{x:0,y:2,color:4},{x:1,y:3,color:4},{x:1,y:2,color:4},{x:2,y:2,color:4}]               
               break;// 
            case 43:return [{x:1,y:3,color:4},{x:1,y:1,color:4},{x:1,y:2,color:4},{x:0,y:2,color:4}]               
               break;//        
               //--xx-----------------------pieza 5-------------------------------------------
               //--xx---
            case 50:return [{x:1,y:1,color:5},{x:1,y:2,color:5},{x:2,y:1,color:5},{x:2,y:2,color:5}]               
               break;      
            case 51:return [{x:1,y:1,color:5},{x:1,y:2,color:5},{x:2,y:1,color:5},{x:2,y:2,color:5}]               
               break;     
            case 52:return [{x:1,y:1,color:5},{x:1,y:2,color:5},{x:2,y:1,color:5},{x:2,y:2,color:5}]               
               break; 
            case 53:return [{x:1,y:1,color:5},{x:1,y:2,color:5},{x:2,y:1,color:5},{x:2,y:2,color:5}]               
               break;                          
               //--x-----------------------pieza 6-------------------------------------------
               //--xxx
            case 60:return [{x:1,y:1,color:6},{x:1,y:2,color:6},{x:2,y:2,color:6},{x:3,y:2,color:6}]                           
               break;   
            case 61:return [{x:1,y:1,color:6},{x:1,y:2,color:6},{x:1,y:3,color:6},{x:2,y:1,color:6}]                           
               break;   
            case 62:return [{x:0,y:1,color:6},{x:1,y:1,color:6},{x:2,y:1,color:6},{x:2,y:2,color:6}]                           
               break;     
            case 63:return [{x:2,y:0,color:6},{x:2,y:1,color:6},{x:2,y:2,color:6},{x:1,y:2,color:6}]                           
               break;       
               //-----x--------------------pieza 7-------------------------------------------
               //---xxx--
            case 70:return [{x:0,y:2,color:7},{x:1,y:2,color:7},{x:2,y:2,color:7},{x:2,y:1,color:7}]               
               break;               
            case 71:return [{x:1,y:0,color:7},{x:1,y:1,color:7},{x:1,y:2,color:7},{x:2,y:2,color:7}]               
               break;                  
            case 72:return [{x:1,y:1,color:7},{x:1,y:2,color:7},{x:2,y:1,color:7},{x:3,y:1,color:7}]               
               break;
            case 73:return [{x:1,y:1,color:7},{x:2,y:1,color:7},{x:2,y:2,color:7},{x:2,y:3,color:7}]               
               break;                               

       }     
      
   }

function getColor(num)
   {
        switch(num) 
        {
            case 1:
                return "rgb(255,0,0)"
                break;
            case 2:
                return "rgb(0,255,0)"
                break;    
            case 3:
                return "rgb(251, 255, 39)"
                break;
            case 4:
                return "rgb(0,255,255)"
                break;           
            case 5:
                return "rgb(255,0,255)"
                break;         
            case 6:
                return "rgb(255, 102, 0)"
                break;                
            case 7:
                return "rgb(30, 45, 255)"
                break; 
            case 8:
                return "rgb(200,200,200)"
                break; 
        }
   }

function isfloor(array1,array2)
{
 if (array1==null || array2==null ){return false}  
 if(array1.some
    (
       elemento1=>
       {
            return array2.some
            (
              elemento2=>
              {
                return (((elemento1.y + altura)==(elemento2.y-1) && (elemento1.x+ desplazamiento==elemento2.x)) || elemento1.y + altura==19)
              }                
            )
       } 
    )
   ) 
   {
    return true;
   }  
   else
   {
    return false;
   }

 
}  
function transferir()
{
    figura.forEach
    (
        indice=>
        {
            indice.color=8;
        }
    )
    let nueva_figura=[];
    nueva_figura=figura.map
    (
       item=>
       {
          return {x:item.x+desplazamiento,y: item.y+altura,color:8}
       } 
    )
    mapa.push(...nueva_figura)       
} 
   
function nueva_pieza()
{
      
    figura=[]
    figura.push(...figura_siguiente); 
    pieza_actual=pieza_siquiente;
    figura_siguiente=elegir(true,1,pieza_posicion);  
    desplazamiento=parseInt(Math.random()*6)
    altura=-4;
    speed=speed_game; 
    ++no_piezas;
    ++contador_nivel;
    actualizar_pizarra(); 
}
function iscoll(coll_array1,coll_array2,direccion)
{
    if(coll_array1.some
        (
           elemento1=>
           {
                return coll_array2.some
                (
                  elemento2=>
                  {
                    switch (direccion)
                    {
                     case "izquierda":
                        return  elemento1.x + desplazamiento <= 0 || (elemento1.x + desplazamiento == elemento2.x +1)&&(elemento1.y + altura == elemento2.y)
                        break;
                    case "derecha":
                        return   elemento1.x + desplazamiento >= 9 || (elemento1.x + desplazamiento == elemento2.x -1)&&(elemento1.y + altura == elemento2.y)
                        break;   
                    case "rotar":
                        return   ((elemento1.y + altura)==(elemento2.y) && (elemento1.x+ desplazamiento==elemento2.x)) || elemento1.x + desplazamiento < 0 ||elemento1.x + desplazamiento > 9 || elemento1.y + altura > 19 ;
                        break;                           
                    }
                  }                
                )
           } 
        )
       ) 
       {
        return true;
       }  
       else
       {
        return false;
       } 
}
function borrar_fila(array2,fila)
{
   mapa=array2.filter
   (
      raya=>
      {
         return raya.y != fila;
      }
   )         
}
function chequear()
{
   let contador=0;
   let lineas_borradas=0
   for (let i=0 ; i<20 ;i++)
      {
         mapa.forEach
         (
            indice=>
            {
               if (indice.y==i)
               {
                  ++contador;
                  if(contador==10) 
                  {
                     borrar_fila(mapa,i)
                     reagrupar(i);
                     ++lineas_borradas
                  }
               }
            }
         )
        contador=0;    
      }
      puntuación=puntuación+(lineas_borradas*10)*speed_game;
}
function reagrupar(linea_vacia)
{
   sonido3.load();
   sonido3.play();
   mapa.forEach
   (
      indice_che=>
      {
         if (indice_che.y < linea_vacia)
         {
            indice_che.y= indice_che.y + 1;
         }
      }
   )
   if(contador_nivel>=100 && speed_game<11)
    {
      ++speed_game
      contador_nivel=0;
    }
}

function actualizar_pizarra()
{
   dato3.innerHTML=no_piezas; 
   dato2.innerHTML=speed;
   dato4.innerHTML=puntuación; 
   //score_data.innerHTML=(puntuación>record)?puntuación:record; 
}
