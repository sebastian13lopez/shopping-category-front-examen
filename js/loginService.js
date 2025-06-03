document.getElementById('loginForm').addEventListener('submit', function(e){ 
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
}); 

function login(email, password){
    localStorage.removeItem('token');
    let message = '';
    let alertType = '';
    const PLATZI_ENDPOINT = 'https://api.escuelajs.co/api/v1/auth/login';
    
    fetch(PLATZI_ENDPOINT, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then((response) => {
        if(response.status === 201 || response.status === 200){
            alertType = 'success';
            message = 'Inicio de sesión exitoso';
            alertBuilder(alertType, message);
            
            return response.json();
        } else {
            throw new Error('Credenciales inválidas');
        }
    })
    .then((data) => {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        setTimeout(() => {
            location.href = 'admin/dashboard.html';
        }, 2000); // 2000 ms = 2 segundos
    })
    .catch((error) => {
        alertType = 'danger';
        message = 'Correo o contraseña inválida';
        console.log('Error del servicio:', error);
        alertBuilder(alertType, message);
    });
}

function alertBuilder(alertType, message){
    const alert = 
         `<div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
         ${message}  
         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
  document.getElementById('mensaje').innerHTML = alert;
}

function getUserProfile() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('No hay token disponible');
        return;
    }
    
    fetch('https://api.escuelajs.co/api/v1/auth/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Perfil del usuario:', data);
    })
    .catch(error => {
        console.log('Error al obtener el perfil:', error);
    });
}

function refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
        console.log('No hay refresh token disponible');
        return;
    }
    
    fetch('https://api.escuelajs.co/api/v1/auth/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refreshToken: refreshToken
        })
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        console.log('Token refrescado exitosamente');
    })
    .catch(error => {
        console.log('Error al refrescar el token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        location.href = 'login.html';
    });
}