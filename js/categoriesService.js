function categories(page) {
    document.getElementById('cardHeader').innerHTML = '<h5>Listado de categorías</h5>';
    const PLATZI_API_ENDPOINT = `https://api.escuelajs.co/api/v1/categories?offset=${(page - 1) * 10}&limit=10`;

    fetch(PLATZI_API_ENDPOINT)
        .then(response => response.json().then(data => ({ status: response.status, info: data })))
        .then(result => {
            if (result.status === 200 && result.info.length > 0) {
                const listCategories = `
                    <button type="button" class="btn btn-outline-success mb-3" onclick="createCategory()">Crear Categoría</button>
                    <table class="table table-striped">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Imagen</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${result.info.map(category => `
                                <tr>
                                    <td>${category.id}</td>
                                    <td>${category.name}</td>
                                    <td><img src="${category.image}" class="img-thumbnail" alt="Imagen de categoría" width="100"></td>
                                    <td>
                                        <button type="button" class="btn btn-outline-info btn-sm me-2" onclick="viewCategory(${category.id})">Ver</button>
                                        <button type="button" class="btn btn-outline-warning btn-sm me-2" onclick="editCategory(${category.id})">Editar</button>
                                        <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteCategory(${category.id})">Eliminar</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <nav aria-label="Page navigation">
                        <ul class="pagination justify-content-center">
                            <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                <a class="page-link" href="#" onclick="categories(${page - 1})" aria-label="Previous">&laquo;</a>
                            </li>
                            ${[1, 2, 3].map(p => `
                                <li class="page-item ${page === p ? 'active' : ''}">
                                    <a class="page-link" href="#" onclick="categories(${p})">${p}</a>
                                </li>
                            `).join('')}
                            <li class="page-item ${page === 3 ? 'disabled' : ''}">
                                <a class="page-link" href="#" onclick="categories(${page + 1})" aria-label="Next">&raquo;</a>
                            </li>
                        </ul>
                    </nav>
                `;
                document.getElementById("info").innerHTML = listCategories;
            } else {
                document.getElementById("info").innerHTML = `
                    <div class="alert alert-warning">No existen categorías en la Base de Datos</div>
                    <button type="button" class="btn btn-outline-success" onclick="createCategory()">Crear primera categoría</button>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("info").innerHTML = `
                <div class="alert alert-danger">Error al cargar las categorías</div>
            `;
        });
}

categories(1);
