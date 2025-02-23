"use client";

import React from "react";
import { useAppSelector } from "@/app/app/(components)/redux";
import Header from "@/app/app/(components)/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/app/app/lib/utils";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 200 },
  { field: "productOwnerUsername", headerName: "Product Owner", width: 200 },
  { field: "projectManagerUsername", headerName: "Project Manager", width: 200 },
];

// Données statiques pour les équipes
const staticTeams = [
  {
    id: 1,
    teamName: "Équipe A",
    productOwnerUsername: "ownerA",
    projectManagerUsername: "managerA",
  },
  {
    id: 2,
    teamName: "Équipe B",
    productOwnerUsername: "ownerB",
    projectManagerUsername: "managerB",
  },
  {
    id: 3,
    teamName: "Équipe C",
    productOwnerUsername: "ownerC",
    projectManagerUsername: "managerC",
  },
  // Ajoutez d'autres équipes si nécessaire
];

const Teams = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={staticTeams}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};

export default Teams;
