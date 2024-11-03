document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('programar-cita-form');
    const clienteSelect = document.getElementById('cliente');
    const mascotaSelect = document.getElementById('mascota');
    const citasTbody = document.getElementById('citas-tbody');

    const urlBase = 'http://localhost:5000/api'; // Define la URL base para el backend

    // Cargar clientes
    fetch(`${urlBase}/clientes`)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar clientes');
            return response.json();
        })
        .then(clientes => {
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente._id;
                option.textContent = cliente.nombre;
                clienteSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar clientes:', error));

    // Cargar mascotas cuando se selecciona un cliente
    clienteSelect.addEventListener('change', function() {
        const clienteId = this.value;
        fetch(`${urlBase}/clientes/${clienteId}/mascotas`)
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar mascotas');
                return response.json();
            })
            .then(mascotas => {
                mascotaSelect.innerHTML = '<option value="">Seleccione una mascota</option>';
                mascotas.forEach(mascota => {
                    const option = document.createElement('option');
                    option.value = mascota._id;
                    option.textContent = mascota.nombre;
                    mascotaSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error al cargar mascotas:', error));
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const citaData = {
            cliente: clienteSelect.value,
            mascota: mascotaSelect.value,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value,
            motivo: document.getElementById('motivo').value
        };

        try {
            const response = await fetch(`${urlBase}/citas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(citaData),
            });

            if (response.ok) {
                alert('Cita programada con éxito');
                form.reset();
                cargarCitas(); // Recargar citas después de programar una nueva
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al programar la cita:', error);
            alert('Error al programar la cita');
        }
    });

    // Función para cargar citas dinámicamente en la tabla
    async function cargarCitas() {
        citasTbody.innerHTML = ''; // Limpiar citas previas

        try {
            const response = await fetch(`${urlBase}/citas`);
            if (!response.ok) throw new Error('Error al cargar las citas');
            const citas = await response.json();

            citas.forEach(cita => {
                const row = document.createElement('tr');

                // Columna Cliente
                const clienteCell = document.createElement('td');
                clienteCell.textContent = cita.cliente ? cita.cliente.nombre : 'Desconocido';
                row.appendChild(clienteCell);

                // Columna Mascota
                const mascotaCell = document.createElement('td');
                mascotaCell.textContent = cita.mascota ? cita.mascota.nombre : 'Desconocida';
                row.appendChild(mascotaCell);

                // Columna Fecha
                const fechaCell = document.createElement('td');
                fechaCell.textContent = new Date(cita.fecha).toLocaleDateString();
                row.appendChild(fechaCell);

                // Columna Hora
                const horaCell = document.createElement('td');
                horaCell.textContent = cita.hora;
                row.appendChild(horaCell);

                // Columna Motivo
                const motivoCell = document.createElement('td');
                motivoCell.textContent = cita.motivo;
                row.appendChild(motivoCell);

                // Columna Estado
                const estadoCell = document.createElement('td');
                estadoCell.textContent = cita.estado || 'Pendiente';
                row.appendChild(estadoCell);

                // Columna Acciones
                const accionesCell = document.createElement('td');

                // Botón Modificar (Cambiar estado)
                const modificarBtn = document.createElement('button');
                modificarBtn.textContent = 'Modificar';
                modificarBtn.classList.add('modificar-btn'); // Aplica la clase de estilo
                modificarBtn.addEventListener('click', () => cambiarEstado(cita._id));
                accionesCell.appendChild(modificarBtn);

                // Botón Eliminar
                const eliminarBtn = document.createElement('button');
                eliminarBtn.textContent = 'Eliminar';
                eliminarBtn.classList.add('eliminar-btn'); // Aplica la clase de estilo
                eliminarBtn.addEventListener('click', () => eliminarCita(cita._id));
                accionesCell.appendChild(eliminarBtn);

                row.appendChild(accionesCell);

                citasTbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar citas:', error);
        }
    }

    // Función para cambiar el estado de la cita
    async function cambiarEstado(citaId) {
        const nuevoEstado = prompt("Ingrese el nuevo estado (pendiente, completada, cancelada):");
        if (!['pendiente', 'completada', 'cancelada'].includes(nuevoEstado)) {
            alert("Estado no válido. Por favor ingrese 'pendiente', 'completada' o 'cancelada'.");
            return;
        }
        
        try {
            const response = await fetch(`${urlBase}/citas/${citaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            
            if (response.ok) {
                alert('Estado de la cita actualizado');
                cargarCitas(); // Recargar citas después de actualizar
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al cambiar estado:', error);
        }
    }

    // Función para eliminar la cita
    async function eliminarCita(citaId) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;

        try {
            const response = await fetch(`${urlBase}/citas/${citaId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Cita eliminada');
                cargarCitas(); // Recargar citas después de eliminar
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al eliminar cita:', error);
        }
    }

    // Cargar citas al cargar la página
    cargarCitas();
});
