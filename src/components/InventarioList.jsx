// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../components/Styles/InventarioList.css'; // Asegúrate de tener este archivo de estilos

// const InventarioList = () => {
//   const [inventario, setInventario] = useState([]);

//   useEffect(() => {
//     const fetchInventario = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:8080/api/inventario/detalles', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setInventario(response.data);
//       } catch (error) {
//         console.error('Error al obtener el inventario', error);
//       }
//     };
//     fetchInventario();
//   }, []);

//   return (
//     <div className="inventario-container">
//       <h2>Inventario de Productos</h2>
//       <div className="inventario-grid">
//         {inventario.map((item, index) => (
//           <div key={index} className="inventario-card">
//             <img src={item.imagenUrlProducto} alt={item.nombreProducto} className="inventario-imagen" />
//             <div className="inventario-info">
//               <h3>{item.nombreProducto}</h3>
//               <p>Descripción: {item.descripcionProducto}</p>
//               <p>Precio: ${item.precioProducto}</p>
//               <div className="color-info">
//                 <span>Color:</span>
//                 <div
//                   className="color-cuadro"
//                   style={{
//                     backgroundColor: item.codigoHexColor,
//                     width: '20px',
//                     height: '20px',
//                     display: 'inline-block',
//                     margin: '0 10px'
//                   }}
//                 ></div>
//                 <span>{item.nombreColor}</span>
//               </div>
//               <p>Cantidad disponible: {item.cantidad}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default InventarioList;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../components/Styles/InventarioList.css'; // Asegúrate de tener este archivo de estilos

// const InventarioList = () => {
//   const [inventario, setInventario] = useState([]);

//   useEffect(() => {
//     const fetchInventario = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get('https://backedn-nuevo.onrender.com/api/inventario/detalles', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setInventario(response.data);
//       } catch (error) {
//         console.error('Error al obtener el inventario', error);
//       }
//     };
//     fetchInventario();
//   }, []);

//   return (
//     <div className="inventario-container">
//       <h2 className="titulo-inventario">Inventario de Productos</h2>
//       <table className="inventario-tabla">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Nombre del Producto</th>
//             <th>Descripción</th>
//             <th>Precio</th>
//             <th>Color</th>
//             <th>Cantidad Disponible</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inventario.map((item, index) => (
//             <tr key={index}>
//               <td>{item.id}</td>
//               <td>{item.nombreProducto}</td>
//               <td>{item.descripcionProducto}</td>
//               <td>${item.precioProducto}</td>
//               <td>
//                 <div
//                   className="color-cuadro"
//                   style={{
//                     backgroundColor: item.codigoHexColor,
//                   }}
//                 ></div>
//                 <span style={{ marginLeft: '10px' }}>{item.nombreColor}</span>
//               </td>
//               <td>{item.cantidad}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default InventarioList;







import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../components/Styles/InventarioList.css'; // Asegúrate de tener este archivo de estilos

const InventarioList = () => {
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/inventario/detalles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInventario(response.data);
      } catch (error) {
        console.error('Error al obtener el inventario', error);
      }
    };
    fetchInventario();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Inventario de Productos', 14, 22);

    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Nombre del Producto', dataKey: 'nombreProducto' },
      { header: 'Descripción', dataKey: 'descripcionProducto' },
      { header: 'Precio', dataKey: 'precioProducto' },
      { header: 'Color', dataKey: 'nombreColor' },
      { header: 'Cantidad Disponible', dataKey: 'cantidad' }
    ];

    const rows = inventario.map((item) => ({
      id: item.id,
      nombreProducto: item.nombreProducto,
      descripcionProducto: item.descripcionProducto,
      precioProducto: `$${item.precioProducto}`,
      nombreColor: item.nombreColor,
      cantidad: item.cantidad,
    }));

    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 30,
    });

    doc.save('inventario_productos.pdf');
  };

  return (
    <div className="inventario-container">
      <h2 className="titulo-inventario">Inventario de Productos</h2>
      <table className="inventario-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Producto</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Color</th>
            <th>Cantidad Disponible</th>
          </tr>
        </thead>
        <tbody>
          {inventario.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.nombreProducto}</td>
              <td>{item.descripcionProducto}</td>
              <td>${item.precioProducto}</td>
              <td>
                <div
                  className="color-cuadro"
                  style={{
                    backgroundColor: item.codigoHexColor,
                  }}
                ></div>
                <span style={{ marginLeft: '10px' }}>{item.nombreColor}</span>
              </td>
              <td>{item.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Botón de descarga colocado debajo de la tabla */}
      <div className="button-container">
        <button onClick={exportPDF} className="export-button">Descargar PDF</button>
      </div>
    </div>
  );
};

export default InventarioList;
