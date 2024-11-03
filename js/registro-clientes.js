document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro-cliente-form');
  
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
  
        const clienteData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            mascota: {
                nombre: document.getElementById('mascota').value,
                especie: document.getElementById('especie').value
            }
        };
  
        try {
            const response = await fetch('http://localhost:5000/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clienteData),
            });
  
            if (response.ok) {
                alert('Cliente registrado con éxito');
                form.reset();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar el cliente');
        }
    });
  });
  