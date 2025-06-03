function users(page) {
    document.getElementById('cardHeader').innerHTML = '<h5>Listado de usuarios</h5>'
    const limit = 10;
    const offset = (page - 1) * limit;
    const PLATZI_ENDPOINT = `https://api.escuelajs.co/api/v1/users?limit=${limit}&offset=${offset}`;
    
    fetch(PLATZI_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-type": "application/json"
      },
    })
      .then((response) => {
        return response.json().then(
          data => {
          return {
            status: response.status,
            info: { data: data } 
          };
        });
      })
      .then((result) => {
        console.log("resultado ", result);
        if (result.info.data.length > 0) {
          console.log("Sample user:", result.info.data[0]);
          console.log("Avatar URL:", result.info.data[0].avatar);
        }
        
        if (result.status === 200) {
          let listusers = `
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
          result.info.data.forEach(element => {
             const nameParts = element.name ? element.name.split(' ') : ['', ''];
             const firstName = nameParts[0] || '';
             const lastName = nameParts.slice(1).join(' ') || '';
             
             const avatarUrl = element.avatar && element.avatar.startsWith('http') 
                ? element.avatar 
                : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
             
             listusers = listusers + `   
            <tr>
                  <td>${element.id}</td>
                  <td>${firstName}</td>
                  <td>${lastName || element.email}</td>
                  <td><img src="${avatarUrl}" class="img-thumbnail" alt="Avatar del usuario" style="max-width: 50px; max-height: 50px;"></td>
                  <td><button type="button" class="btn btn-outline-info" onclick="getUser('${element.id}')">Ver</button></td>
            </tr>
            `
          });
          listusers = listusers + `
              </tbody>
          </table>    
          <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item">
                    <a class="page-link" href="#" aria-label="Previous" onclick="users('${Math.max(1, page-1)}')">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item"><a class="page-link" href="#" onclick="users('1')">1</a></li>
                <li class="page-item"><a class="page-link" href="#" onclick="users('2')">2</a></li>
                <li class="page-item">
                <a class="page-link" href="#" aria-label="Next" onclick="users('${parseInt(page)+1}')">
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
  
  function getUser(idUser){
    const PLATZI_ENDPOINT = "https://api.escuelajs.co/api/v1/users/"+idUser;
    fetch(PLATZI_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-type": "application/json"
      },
    })
    .then((result) =>{
        return result.json().then(
            data =>{
                return {
                    status: result.status,
                    body: { data: data } 
                }
            }
        )
    })
    .then((response) =>{
        console.log("User details:", response.body.data);
        
        if(response.status === 200){
            const user = response.body.data;
            const nameParts = user.name ? user.name.split(' ') : ['', ''];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            const avatarUrl = user.avatar && user.avatar.startsWith('http') 
                ? user.avatar 
                : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
            
            const modalUser = `
            <div class="modal fade" id="modalUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Ver Usuario</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                  <div class="card">
                    <img src="${avatarUrl}" class="card-img-top" alt="Avatar del usuario" style="max-height: 300px; object-fit: contain;">
                    <div class="card-body">
                      <h5 class="card-title">Informacion del Usuario</h5>
                      <p class="card-text">Nombre: ${firstName}</p>
                      <p class="card-text">Apellido: ${lastName || user.email}</p>
                      <p class="card-text">Email: ${user.email}</p>
                      <p class="card-text">Rol: ${user.role || 'Usuario'}</p>
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
            const existingModal = document.getElementById('modalUser');
            if (existingModal) {
                existingModal.remove();
            }
            
            document.body.insertAdjacentHTML('beforeend', modalUser);
            const modalElement = document.getElementById('modalUser');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        else{
            document.getElementById('info').innerHTML = 
            '<h3>No se encontro el usuario en la Api</h3>'
        }
    })
  }

  