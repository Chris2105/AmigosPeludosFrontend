document.addEventListener('DOMContentLoaded', function() {
    // Mensaje de carga
    console.log('La página se ha cargado completamente');

    // Ejemplo: Agregar un evento de clic a los botones de acceso
    const accessButtons = document.querySelectorAll('.btn-primary');
    accessButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Funcionalidad en desarrollo. Próximamente podrás acceder a esta sección.');
        });
    });

    // Funcionalidad para el registro de clientes
    const clienteForm = document.getElementById('cliente-form'); // Asegúrate de que este ID sea correcto

    if (clienteForm) {
        clienteForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevenir el envío del formulario por defecto

            const clienteData = {
                nombre: document.getElementById('nombre-cliente').value,
                email: document.getElementById('email-cliente').value,
                telefono: document.getElementById('telefono-cliente').value
            };

            try {
                const response = await fetch('/api/clientes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(clienteData),
                });

                if (response.ok) {
                    alert('Cliente registrado con éxito');
                    clienteForm.reset(); // Limpiar el formulario después de un registro exitoso
                } else {
                    const errorData = await response.json();
                    alert(`Error al registrar el cliente: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al registrar el cliente');
            }
        });
    }
});
