function categories(page = 1) {    
    document.getElementById('cardHeader').innerHTML = '<h5>Listado de categorías</h5>';
    const limit = 10;
    const offset = (page - 1) * limit;
    const PLATZI_ENDPOINT = `https://api.escuelajs.co/api/v1/categories?limit=${limit}&offset=${offset}`;

    fetch(PLATZI_ENDPOINT, {
      method: 'GET', 
      headers: {
        'Content-type': 'application/json'
      } 
    })
    .then((response) => {
        return response.json().then(
            data => {
                return {
                    status: response.status,
                    info: { data: data }
                }
            }
        )
    })
    .then((result) => {
        console.log('resultado', result);
        if(result.status === 200) {
            let listCategory = `
            <button type="button" class="btn btn-outline-success" onclick="createCategory()">Agregar Categoría</button>
            <table class="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Categoría</th>
                <th scope="col">Acción</th>
            </tr>
            </thead>
            <tbody>
            `;
            
            result.info.data.forEach(element => {
                listCategory += `
                <tr>
                    <td>${element.id}</td>
                    <td>${element.name}</td>
                    <td><button type="button" class="btn btn-outline-info" onclick="getCategory('${element.id}')">Ver</button></td>
                </tr>
                `;
            });
            
            listCategory += `
              </tbody>
            </table>
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item ${page == 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" aria-label="Previous" onclick="categories('${Math.max(1, page-1)}')">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item ${page == 1 ? 'active' : ''}"><a class="page-link" href="#" onclick="categories('1')">1</a></li>
                    <li class="page-item ${page == 2 ? 'active' : ''}"><a class="page-link" href="#" onclick="categories('2')">2</a></li>
                    <li class="page-item ${page == 3 ? 'active' : ''}"><a class="page-link" href="#" onclick="categories('3')">3</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Next" onclick="categories('${parseInt(page)+1}')">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
            `;
            
            document.getElementById('info').innerHTML = listCategory;
        } else {
            document.getElementById('info').innerHTML = 'No existen categorías en la Base de Datos';
        }
    })
    .catch(error => {
        console.error('Error al cargar categorías:', error);
        document.getElementById('info').innerHTML = 'Error al cargar las categorías';
    });
}

function createCategory() {
    const modalCategory = `
        <div class="modal fade" id="modalCategory" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Crear Categoría</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formCreateCategory">
                            <div class="mb-3">
                                <label for="name" class="form-label">Nombre de la Categoría</label>
                                <input type="text" class="form-control" id="name" required>
                            </div>
                            <button type="button" class="btn btn-success" onclick="saveCategory()">Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalCategory);
    const modalElement = document.getElementById('modalCategory');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function saveCategory() {
    const form = document.getElementById('formCreateCategory');
    if (form.checkValidity()) {
        const name = document.getElementById('name').value;

        const category = {
            name
        };

        const PLATZI_API_ENDPOINT = "https://api.escuelajs.co/api/v1/categories/";

        fetch(PLATZI_API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(category)
        })
        .then((result) => {
            return result.json().then(
                data => {
                    return {
                        status: result.status,
                        body: data
                    };
                }
            );
        })
        .then((response) => {
            if (response.status === 201) {
                document.getElementById('info').innerHTML = '<div class="alert alert-success">Categoría creada correctamente</div>';
                categories(1); // Refresh the category list
            } else {
                document.getElementById('info').innerHTML = '<div class="alert alert-danger">Error al crear la categoría</div>';
            }
            const modalId = document.getElementById('modalCategory');
            const modal = bootstrap.Modal.getInstance(modalId);
            modal.hide();
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('info').innerHTML = '<div class="alert alert-danger">Error al conectar con el servidor</div>';
            const modalId = document.getElementById('modalCategory');
            const modal = bootstrap.Modal.getInstance(modalId);
            modal.hide();
        });
    } else {
        form.reportValidity();
    }
}

function getCategory(categoryId) {
    const PLATZI_ENDPOINT = `https://api.escuelajs.co/api/v1/categories/${categoryId}`;
    
    fetch(PLATZI_ENDPOINT, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        },
    })
    .then((result) => {
        return result.json().then(
            data => {
                return {
                    status: result.status,
                    body: data
                };
            }
        );
    })
    .then((response) => {
        console.log("Detalles de la categoría:", response.body);
        
        if(response.status === 200) {
            const category = response.body;
            
            const modalCategory = `
            <div class="modal fade" id="modalCategory" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Ver Categoría</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <h5 class="card-title">Información de la Categoría</h5>
                            <p class="card-text"><strong>Nombre:</strong> ${category.name}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            
            const existingModal = document.getElementById('modalCategory');
            if (existingModal) {
                existingModal.remove();
            }
            
            document.body.insertAdjacentHTML('beforeend', modalCategory);
            const modalElement = document.getElementById('modalCategory');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        else {
            document.getElementById('info').innerHTML = 
            '<h3>No se encontró la categoría en la API</h3>';
        }
    })
    .catch(error => {
        console.error("Error al cargar la categoría:", error);
        document.getElementById('info').innerHTML = 
        `<h3>Error al cargar la categoría: ${error.message}</h3>`;
    });
}
