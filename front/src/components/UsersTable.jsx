import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';

const UsersTable = ({ users }) => {
  // Definir columnas
  const columns = [
    { field: 'pk_user', headerName: 'ID', width: 150 },
    { field: 'name', headerName: 'Nombre', width: 150 },
    { field: 'firstName', headerName: 'Primer Apellido', width: 150 },
    { field: 'lastName', headerName: 'Segundo Apellido', width: 150 },
    { field: 'phone', headerName: 'Teléfono', width: 130 },
    { field: 'gender', headerName: 'Género', width: 100 },
    { field: 'birthday', headerName: 'Fecha Nacimiento', width: 150 },
    {
      field: 'update_at',
      headerName: 'Última Actualización',
      width: 200,
      // Formatear fecha para que sea legible
      valueFormatter: (params) =>
        params.value ? format(new Date(params.value), 'dd/MM/yyyy HH:mm:ss') : '',
    },
  ];

  // Cada fila necesita un id único
  const rows = users.map((user) => ({
    id: user.pk_user, // DataGrid necesita `id`
    ...user,
  }));

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
      />
    </div>
  );
};

export default UsersTable;
