document.addEventListener('DOMContentLoaded', function() {
    const inventarioBody = document.getElementById('inventario-body');
    const buscarProductoInput = document.getElementById('buscar-producto');
    const productoForm = document.getElementById('producto-form');
    const modal = new bootstrap.Modal(document.getElementById('agregarProductoModal'));

    let productos = [];

    // Base URL de la API
    const API_URL = 'http://localhost:5000/api/productos';

    async function cargarProductos() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al cargar productos');
            productos = await response.json();
            renderizarProductos();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar productos');
        }
    }

    function renderizarProductos(productosAmostrar = productos) {
        inventarioBody.innerHTML = '';
        productosAmostrar.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-primary editar-producto" data-id="${producto._id}">Editar</button>
                    <button class="btn btn-sm btn-danger eliminar-producto" data-id="${producto._id}">Eliminar</button>
                </td>
            `;
            inventarioBody.appendChild(row);
        });
    }

    buscarProductoInput.addEventListener('input', function() {
        const busqueda = this.value.toLowerCase();
        const productosFiltrados = productos.filter(producto => 
            producto.nombre.toLowerCase().includes(busqueda)
        );
        renderizarProductos(productosFiltrados);
    });

    productoForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const productoData = {
            nombre: document.getElementById('nombre-producto').value,
            descripcion: document.getElementById('descripcion-producto').value,
            cantidad: parseInt(document.getElementById('cantidad-producto').value),
            precio: parseFloat(document.getElementById('precio-producto').value)
        };

        const method = productoForm.dataset.method || 'POST';
        const url = method === 'PUT' ? `${API_URL}/${productoForm.dataset.id}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productoData),
            });

            if (response.ok) {
                alert(method === 'PUT' ? 'Producto actualizado con éxito' : 'Producto agregado con éxito');
                modal.hide();
                productoForm.reset();
                cargarProductos();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.mensaje || 'Ocurrió un error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al procesar el producto');
        }
    });

    inventarioBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('editar-producto')) {
            const productoId = e.target.dataset.id;
            const producto = productos.find(p => p._id === productoId);
            if (producto) {
                document.getElementById('nombre-producto').value = producto.nombre;
                document.getElementById('descripcion-producto').value = producto.descripcion;
                document.getElementById('cantidad-producto').value = producto.cantidad;
                document.getElementById('precio-producto').value = producto.precio;
                productoForm.dataset.method = 'PUT';
                productoForm.dataset.id = productoId;
                document.getElementById('modalTitle').textContent = 'Editar Producto';
                modal.show();
            }
        } else if (e.target.classList.contains('eliminar-producto')) {
            const productoId = e.target.dataset.id;
            if (confirm('¿Está seguro de que desea eliminar este producto?')) {
                eliminarProducto(productoId);
            }
        }
    });

    async function eliminarProducto(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Producto eliminado con éxito');
                cargarProductos();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.mensaje || 'Ocurrió un error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el producto');
        }
    }

    // Cargar productos al inicio
    cargarProductos();
});
