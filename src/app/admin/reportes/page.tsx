'use client'

import { useEffect, useState, useCallback } from "react";
import { Tabs, Tab, Box, Button } from "@mui/material";
import MyContainer from "@/components/MyContainer";
import apiClient from "@/utils/apiClient";
import MainTitle from "@/components/MainTitle";
import TabPanel from "./TabPanel";
import { DataGrid } from "@mui/x-data-grid";
import { colsDef } from './columns'
import LoadingAnimation from "@/components/LoadingAnimatino";

export default function Reportes() {
  const [report, setReport] = useState({ title: "", data: [] });

  const [tab, setTab] = useState("ordenes");
  const [loading, setLoading] = useState(false);

  const fetchReportes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/reportes/${tab}`);
      setReport({ title: `Reporte de ${tab}`, data: res.data });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  const fetchReportesDownload = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/reportes/${tab}/download`, {
        responseType: 'blob'
      });

      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.xlsx';
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReportes();
  }, [fetchReportes]);

  return (
    <MyContainer className="reportes-container">
      <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
        <MainTitle title="Reportes" />
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Ordenes" value="ordenes" />
        <Tab label="Productos" value="productos" />
        <Tab label="Suscripciones" value="suscripciones" />
        <Tab label="Asistencias" value="asistencias" />
      </Tabs>

      {/* ordenes  */}
      {loading && <LoadingAnimation />}

      {!loading && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={fetchReportesDownload}>Descargar</Button>
        </Box>
      )}

      {report.data.length > 0
        ? <DataGrid
          rows={report.data}
          columns={colsDef[tab as keyof typeof colsDef]}
        />
        : <p>No hay datos</p>
      }
    </MyContainer>
  );
}