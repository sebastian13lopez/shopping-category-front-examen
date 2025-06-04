function users(page) {
    document.getElementById('cardHeader').innerHTML = '<h5>Listado de usuarios</h5>'
    const PLATZI_API_ENDPOINT = "https://api.escuelajs.co/api/v1/users?offset=" + ((page-1)*10) + "&limit=10";
    
    fetch(PLATZI_API_ENDPOINT, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    })
    .then((response) => {
        return response.json().then(
            data => {
                return {
                    status: response.status,
                    info: data,
                };
            });
    })
    .then((result) => {
        console.log("resultado ", result);
        if (result.status === 200) {
            let listusers = `
            <button type="button" class="btn btn-outline-success" onclick="createUser()">Crear</button>
                <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nombre</th>
          <th scope="col">Email</th>
          <th scope="col">Avatar</th>
          <th scope="col">Acción</th>
        </tr>
      </thead>
      <tbody>`;
            
            result.info.forEach(element => {
                listusers = listusers + `   
                <tr>
                    <td>${element.id}</td>
                    <td>${element.name}</td>
                    <td>${element.email}</td>
                    <td> <img src="${element.avatar}" class="img-thumbnail" alt="Avatar del usuario" width="50"></td>
                    <td>
                        <button type="button" class="btn btn-outline-info" onclick="getUser('${element.id}')">Ver</button>
                    </td>
                </tr>
                `
            });
            
            listusers = listusers + `
                </tbody>
            </table>    
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item"><a class="page-link" href="#" onclick="users('1')">1</a></li>
                    <li class="page-item"><a class="page-link" href="#" onclick="users('2')">2</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
            `
            document.getElementById("info").innerHTML = listusers;
        } 
        else {
            document.getElementById("info").innerHTML =
                "No existe usuarios en la Base de Datos";
        }
    });
}

function getUser(idUser) {
    const PLATZI_API_ENDPOINT = "https://api.escuelajs.co/api/v1/users/" + idUser;
    
    fetch(PLATZI_API_ENDPOINT, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    })
    .then((result) => {
        return result.json().then(
            data => {
                return {
                    status: result.status,
                    body: data
                }
            }
        )
    })
    .then((response) => {
        if (response.status === 200) {
            const user = response.body
            const modalUser = `
            <div class="modal fade" id="modalUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Ver Usuario</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="card";">
                                <img src="${user.avatar}" class="card-img-top" alt="Avatar del usuario">
                                <div class="card-body">
                                    <h5 class="card-title">Informacion del Usuario</h5>
                                    <p class="card-text">Nombre: ${user.name}</p>
                                    <p class="card-text">Email: ${user.email}</p>
                                    <p class="card-text">Rol: ${user.role}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            `
            document.body.insertAdjacentHTML('beforeend', modalUser);
            const modalElement = document.getElementById('modalUser');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        else {
            document.getElementById('info').innerHTML = 
                '<h3>No se encontro el usuario en la Api</h3>'
        }
    })
}

function createUser() {
    const modalUser = `
        <div class="modal fade" id="modalUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Crear Usuario</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="card";">
                            <div class="card-body">
                                <form id="formCreateUser">
                                    <div class="row">
                                        <div class="col">
                                            <input type="text" class="form-control" id="name" placeholder="Nombre completo" aria-label="Name" required>
                                        </div>
                                    </div>
                                    <div class="row mt-3">
                                        <div class="col">
                                            <input type="email" class="form-control" id="email" placeholder="Email" aria-label="Email" required>
                                        </div>
                                    </div>  
                                    <div class="row mt-3">
                                        <div class="col">
                                            <input type="password" class="form-control" id="password" placeholder="Password" aria-label="Password" required>
                                        </div>
                                    </div>
                                    <div class="row mt-3">
                                        <div class="col">
                                            <input type="text" class="form-control" id="avatar" placeholder="URL del avatar" aria-label="Avatar">
                                        </div>
                                    </div>
                                    <div class="row mt-3 justify-content-center">
                                        <div class="col-auto">
                                            <button type="button" class="btn btn-success" onclick="saveUser()">Guardar</button>
                                        </div>
                                    </div>                            
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `
    document.body.insertAdjacentHTML('beforeend', modalUser);
    const modalElement = document.getElementById('modalUser');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function saveUser() {
    const form = document.getElementById('formCreateUser')
    if (form.checkValidity()) {
        const name = document.getElementById('name').value 
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        const avatar = document.getElementById('avatar').value || "https://api.lorem.space/image/face?w=150&h=150"
        
        const user = {
            name,
            email,
            password,
            avatar,
            role: "customer" 
        }
        
        const PLATZI_API_ENDPOINT = "https://api.escuelajs.co/api/v1/users/"
        
        fetch(PLATZI_API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(user)
        })
        .then((result) => {
            return result.json().then(
                data => {
                    return {
                        status: result.status,
                        body: data
                    }
                }
            )
        })
        .then((response) => {
            if (response.status === 201) {
                document.getElementById('info').innerHTML = '<div class="alert alert-success">Se guardó el usuario correctamente</div>'
                users(1) 
                 
            }
            else {
                document.getElementById('info').innerHTML = '<div class="alert alert-danger">Error al guardar el usuario</div>'
            }
            const modalId = document.getElementById('modalUser')
            const modal = bootstrap.Modal.getInstance(modalId)  
            modal.hide()
        })
        .catch(error => {
            console.error('Error:', error)
            document.getElementById('info').innerHTML = '<div class="alert alert-danger">Error al conectar con el servidor</div>'
            const modalId = document.getElementById('modalUser')
            const modal = bootstrap.Modal.getInstance(modalId)  
            modal.hide()
        })
    }
    else {
        form.reportValidity()
    }
}