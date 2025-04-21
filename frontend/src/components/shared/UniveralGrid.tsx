import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRowParams, GridPaginationModel } from '@mui/x-data-grid';
import { Box } from '@mui/material';

interface UniversalGridProps {
  rows: any[];
  columns: GridColDef[];
  initialPageSize?: number;
  onRowClick?: (id: any) => void;
  rowsPerPageOptions?: number[];  // Allow customization of page size options
  paginationModel?: GridPaginationModel;
  onPaginationModelChange?: (model: GridPaginationModel) => void;
  getRowId?: (row: any) => any; // New prop to provide a custom id for each row
}

const UniversalGrid: React.FC<UniversalGridProps> = ({
  rows,
  columns,
  initialPageSize = 5,
  onRowClick,
  rowsPerPageOptions = [5, 10, 20],
  paginationModel: externalPaginationModel,
  onPaginationModelChange,
  getRowId,
}) => {
  // Use internal state if external pagination model is not provided
  const [internalPaginationModel, setInternalPaginationModel] = useState<GridPaginationModel>({
    pageSize: initialPageSize,
    page: 0,
  });
  const paginationModel = externalPaginationModel || internalPaginationModel;

  const handleRowClick = (params: GridRowParams) => {
    if (onRowClick) onRowClick(params.id);
  };

  const handlePaginationChange = (model: GridPaginationModel) => {
    if (onPaginationModelChange) {
      onPaginationModelChange(model);
    }
    if (!externalPaginationModel) {
      setInternalPaginationModel(model);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',  // Fill the viewport height
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '10px',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}  
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          pageSizeOptions={rowsPerPageOptions}
          checkboxSelection={false}
          onRowClick={handleRowClick}
          sx={{
            height: 'calc(100% - 55px)', 
            '& .MuiDataGrid-footerContainer': {
              position: 'relative', 
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default UniversalGrid;