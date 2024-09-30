import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../components/Styles/ProductosList.css';

const ProductosPorCategoria = () => {
  const [productos, setProductos] = useState([]); // Asegurarse de que el estado inicial sea un array vacío
  const [error, setError] = useState('');
  const [cantidades, setCantidades] = useState({}); // Estado para manejar las cantidades por producto
  const [categoria, setCategoria] = useState(''); // Estado para manejar la categoría ingresada

  const fetchProductosPorCategoria = async (categoriaSeleccionada) => {
    const token = localStorage.getItem('token');
    if (!categoriaSeleccionada) {
      setError('Por favor, ingrese una categoría.');
      return;
    }

    try {
      const response = await axios.get(`https://backedn-nuevo.onrender.com/api/productos/categoria/${categoriaSeleccionada}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setProductos(response.data);
        setError(''); // Limpiar error si la solicitud es exitosa
      } else {
        setError('La respuesta del servidor no es válida.');
        console.error('Respuesta del servidor:', response.data);
      }
    } catch (err) {
      setError('No se pudo obtener la lista de productos.');
      console.error('Error al obtener la lista de productos:', err);
    }
  };

  // Manejador para actualizar la categoría según el input
  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value);
  };

  // Manejador para buscar productos según la categoría seleccionada
  const handleBuscarProductos = () => {
    fetchProductosPorCategoria(categoria); // Llamar a la función con la categoría seleccionada
  };

  const handleCantidadChange = (productoId, nuevaCantidad) => {
    setCantidades((prevCantidades) => ({
      ...prevCantidades,
      [productoId]: nuevaCantidad, // Actualizar la cantidad solo para el producto seleccionado
    }));
  };

  const agregarAlCarrito = async (productoId) => {
    const token = localStorage.getItem('token');
    const cantidad = cantidades[productoId] || 1; // Usar la cantidad seleccionada, por defecto 1 si no se ha seleccionado
    try {
      await axios.post(
        'https://backedn-nuevo.onrender.com/api/carrito/agregar',
        {
          producto: { id: productoId },
          cantidad: cantidad,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: 'Producto agregado',
        text: 'El producto ha sido agregado al carrito correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  };

  // Si hay un error, mostrar el mensaje
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="productos-list-container">
      <h2>Catálogo de Productos por Categoría</h2>

      {/* Formulario para ingresar la categoría */}
      <div
        className="categoria-form"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '30px', // Separación adicional entre el formulario y las tarjetas de productos
        }}
      >
        <label
          htmlFor="categoria-input"
          style={{
            marginBottom: '10px',
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#333', // Color del texto
          }}
        >
          Ingrese la Categoría:
        </label>
        <input
          type="text"
          id="categoria-input"
          value={categoria}
          onChange={handleCategoriaChange}
          placeholder="Femenino, Masculino, Niños..."
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '15px', // Separación entre el input y el botón
            width: '250px',
            fontSize: '16px',
            textAlign: 'center', // Centrar texto dentro del input
          }}
        />
        <button
          onClick={handleBuscarProductos}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '10px', // Margen superior adicional para separación
            transition: 'background-color 0.3s ease, transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#45a049')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Buscar Productos
        </button>
      </div>

      {/* Mostrar productos según la categoría seleccionada */}
      <div className="productos-grid">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div key={producto.id} className="producto-card">
              <img
                src={`https://backedn-nuevo.onrender.com/api/productos/imagen/${producto.imagenUrl.split('/').pop()}`}
                alt={producto.nombre}
                className="producto-imagen"
              />
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p>
                <strong>Precio:</strong> ${producto.precio}
              </p>

              {/* Mostrar colores del producto gráficamente */}
              <div className="colores-disponibles">
                {producto.colores &&
                  producto.colores.map((color) => (
                    <span
                      key={color.id}
                      className="color-cuadro"
                      style={{
                        backgroundColor: color.codigoHex,
                      }}
                    ></span>
                  ))}
              </div>

              <div className="cantidad-container">
                <label htmlFor={`cantidad-${producto.id}`}>Cantidad:</label>
                <input
                  id={`cantidad-${producto.id}`}
                  type="number"
                  value={cantidades[producto.id] || 1} // Mostrar la cantidad seleccionada o 1 por defecto
                  min="1"
                  onChange={(e) => handleCantidadChange(producto.id, e.target.value)} // Actualiza la cantidad solo para este producto
                  className="cantidad-input"
                />
              </div>

              <button onClick={() => agregarAlCarrito(producto.id)} className="agregar-carrito-button">
                Agregar al carrito
              </button>
            </div>
          ))
        ) : (
          <p>No hay productos en la categoría seleccionada.</p>
        )}
      </div>
    </div>
  );
};

export default ProductosPorCategoria;
