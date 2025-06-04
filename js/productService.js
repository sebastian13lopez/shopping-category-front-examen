function products(page = 1) {    
    document.getElementById('cardHeader').innerHTML = '<h5>Listado de productos</h5>';
    const limit = 10;
    const offset = (page - 1) * limit;
    const PLATZI_ENDPOINT = `https://api.escuelajs.co/api/v1/products?limit=${limit}&offset=${offset}`;

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
            let listProduct = `
            <button type="button" class="btn btn-outline-success" onclick="createProduct()">Agregar Producto</button>
            <table class="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Producto</th>
                <th scope="col">Precio</th>
                <th scope="col">Categoría</th>
                <th scope="col">Imagen</th>
                <th scope="col">Acción</th>
            </tr>
            </thead>
            <tbody>
            `;
            
            result.info.data.forEach(element => {
                const imageUrl = element.images && element.images.length > 0 && element.images[0].startsWith('http')
                    ? element.images[0]
                    : 'https://via.placeholder.com/50';
                
                const categoryName = element.category ? element.category.name : 'Sin categoría';
                
                listProduct += `
                <tr>
                    <td>${element.id}</td>
                    <td>${element.title}</td>
                    <td>$${element.price}</td>
                    <td>${categoryName}</td>
                    <td><img src="${imageUrl}" alt="${element.title}" class="img-thumbnail" style="max-width: 50px; max-height: 50px;"></td>
                    <td><button type="button" class="btn btn-outline-info" onclick="getProduct(${element.id})">Ver</button></td>
                </tr>
                `;
            });
            
            listProduct += `
              </tbody>
            </table>
            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item ${page == 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" aria-label="Previous" onclick="products('${Math.max(1, page-1)}')">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li class="page-item ${page == 1 ? 'active' : ''}"><a class="page-link" href="#" onclick="products('1')">1</a></li>
                    <li class="page-item ${page == 2 ? 'active' : ''}"><a class="page-link" href="#" onclick="products('2')">2</a></li>
                    <li class="page-item ${page == 3 ? 'active' : ''}"><a class="page-link" href="#" onclick="products('3')">3</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#" aria-label="Next" onclick="products('${parseInt(page)+1}')">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>
            `;
            
            document.getElementById('info').innerHTML = listProduct;
        } else {
            document.getElementById('info').innerHTML = 'No existen productos en la Base de Datos';
        }
    })
    .catch(error => {
        console.error('Error al cargar productos:', error);
        document.getElementById('info').innerHTML = 'Error al cargar los productos';
    });
}

function createProduct() {
    const modalProduct = `
        <div class="modal fade" id="modalProduct" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Crear Producto</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formCreateProduct">
                            <div class="mb-3">
                                <label for="title" class="form-label">Nombre del Producto</label>
                                <input type="text" class="form-control" id="title" required>
                            </div>
                            <div class="mb-3">
                                <label for="price" class="form-label">Precio</label>
                                <input type="number" class="form-control" id="price" required>
                            </div>
                            <div class="mb-3">
                                <label for="categoryId" class="form-label">ID de Categoría</label>
                                <input type="number" class="form-control" id="categoryId" required>
                            </div>
                            <div class="mb-3">
                                <label for="image" class="form-label">URL de Imagen</label>
                                <input type="text" class="form-control" id="image" required>
                            </div>
                            <div class="mb-3">
                                <label for="description" class="form-label">Descripción</label>
                                <textarea class="form-control" id="description" rows="3" required></textarea>
                            </div>
                            <button type="button" class="btn btn-success" onclick="saveProduct()">Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalProduct);
    const modalElement = document.getElementById('modalProduct');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function saveProduct() {
    const form = document.getElementById('formCreateProduct');
    if (form.checkValidity()) {
        const title = document.getElementById('title').value;
        const price = document.getElementById('price').value;
        const categoryId = document.getElementById('categoryId').value;
        const image = document.getElementById('image').value;
        const description = document.getElementById('description').value;

        const product = {
            title,
            price,
            categoryId,
            images: [image],
            description
        };

        const PLATZI_API_ENDPOINT = "https://api.escuelajs.co/api/v1/products/";

        fetch(PLATZI_API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(product)
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
                document.getElementById('info').innerHTML = '<div class="alert alert-success">Producto creado correctamente</div>';
                products(1);
            } else {
                document.getElementById('info').innerHTML = '<div class="alert alert-danger">Error al crear el producto</div>';
            }
            const modalId = document.getElementById('modalProduct');
            const modal = bootstrap.Modal.getInstance(modalId);
            modal.hide();
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('info').innerHTML = '<div class="alert alert-danger">Error al conectar con el servidor</div>';
            const modalId = document.getElementById('modalProduct');
            const modal = bootstrap.Modal.getInstance(modalId);
            modal.hide();
        });
    } else {
        form.reportValidity();
    }
}

function getProduct(productId) {
    const PLATZI_ENDPOINT = `https://api.escuelajs.co/api/v1/products/${productId}`;
    
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
        console.log("Detalles del producto:", response.body);
        
        if(response.status === 200) {
            const product = response.body;
            
            const imageUrl = product.images && product.images.length > 0 && product.images[0].startsWith('http')
                ? product.images[0]
                : 'https://via.placeholder.com/300';
            
            const categoryName = product.category ? product.category.name : 'Sin categoría';
            
            const modalProduct = `
            <div class="modal fade" id="modalProduct" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Ver Producto</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="card">
                                <img src="${imageUrl}" class="card-img-top" alt="${product.title}" style="max-height: 300px; object-fit: contain;">
                                <div class="card-body">
                                    <h5 class="card-title">Información del Producto</h5>
                                    <p class="card-text"><strong>Nombre:</strong> ${product.title}</p>
                                    <p class="card-text"><strong>Precio:</strong> $${product.price}</p>
                                    <p class="card-text"><strong>Categoría:</strong> ${categoryName}</p>
                                    <p class="card-text"><strong>Descripción:</strong> ${product.description}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            
            const existingModal = document.getElementById('modalProduct');
            if (existingModal) {
                existingModal.remove();
            }
            
            document.body.insertAdjacentHTML('beforeend', modalProduct);
            const modalElement = document.getElementById('modalProduct');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
        else {
            document.getElementById('info').innerHTML = 
            '<h3>No se encontró el producto en la API</h3>';
        }
    })
    .catch(error => {
        console.error("Error al cargar el producto:", error);
        document.getElementById('info').innerHTML = 
        `<h3>Error al cargar el producto: ${error.message}</h3>`;
    });
}
