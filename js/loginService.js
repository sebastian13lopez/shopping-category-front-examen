document.getElementById('loginForm').addEventListener('submit',function(e){ 
    e.preventDefault();
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value;
    login(email, password)
}) 

function login(email, password){
    localStorage.removeItem('token')
    let message = ''
    let alertType = ''
    const PLATZI_ENDPOINT = 'https://api.escuelajs.co/api/v1/auth/login'
    fetch(PLATZI_ENDPOINT,{
        method:'POST',
        headers:{ 
            'Content-type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })

    .then((response) => {
        if(response.status === 201){
        alertType = 'success'
        message = 'Inicio de sesion exitoso'
        alertBuilder(alertType, message)
        response.json().then((data) => {
        localStorage.setItem('token', data.access_token);
        });
        
        setTimeout(() => {
            location.href = 'admin/dashboard.html'
            
        }, 2000) //2000 es = 2 segundos
        
    }
        else{
            alertType = 'danger'
            message = 'Correo o contraseña invalida'  
            alertBuilder(alertType, message)      
        }        
        console.log('respuesta del servicio', response)
        
    })

    .catch((error) => {
        alertType = 'danger'
        message = 'Correo o contraseña invalida'
        console.log('respuesta del servicio', error)
        alertBuilder(alertType, message)
    })
}

function alertBuilder(alertType, message){
    const alert = 
         `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
         ${message}  
         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`
  document.getElementById('mensaje').innerHTML = alert;
}