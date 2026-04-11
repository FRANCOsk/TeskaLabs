import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { DateTime } from "asab_webui_components";
import { useTheme } from "@mui/material/styles";

import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";

export function DetailScreen(props) {
  const { t } = useTranslation();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  const getIdFromHash = () => {
    const hash = window.location.hash || "";
    const parts = hash.split("/");
    return parts[parts.length - 1];
  };

  const id = getIdFromHash();

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://devtest.teskalabs.com/detail/${id}`
        );

        setDetail(response?.data ?? null);
      } catch (e) {
        console.error("Detail load error:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDetail();
    }
  }, [id]);

  const goBack = () => {
    window.history.back();
  };

  
  const renderRow = (label, value) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} md={3}>
        <Typography fontWeight="bold">{label}:</Typography>
      </Grid>
      <Grid item xs={12} md={9}>
        <Typography>{value}</Typography>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2}>
              <CircularProgress size={24} />
              <Typography>{t("DetailScreen|Loading detail...")}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (error || !detail) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Card>
          <CardContent>
            <Alert severity="error" sx={{ mb: 3 }}>
              {t("DetailScreen|Failed to load detail")}
            </Alert>

            <Button
              variant="contained"
              color="primary"
              onClick={goBack}
              startIcon={<ArrowBackIcon />}
            >
              {t("DetailScreen|Back")}
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
   <Box
    sx={{
      minHeight: "100vh",
      width: "100vw",
      backgroundColor: theme.palette.grey[100],
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 1300,
      py: 4,
    }}
  >
    <Container maxWidth="md">
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: "#fafafa",
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
            flexWrap="wrap"
            gap={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <PersonIcon />
              <Typography variant="h5">
                {t("DetailScreen|User detail")}
              </Typography>
            </Box>

            
          </Box>

          {renderRow(t("DetailScreen|ID"), detail.id ?? "")}
          {renderRow(t("DetailScreen|Username"), detail.username ?? "")}
          {renderRow(t("DetailScreen|Email"), detail.email ?? "")}
          {renderRow(t("DetailScreen|Address"), detail.address ?? "")}
          {renderRow(t("DetailScreen|Phone number"), detail.phone_number ?? "")}
          {renderRow(t("DetailScreen|IP address"), detail.ip_address ?? "")}
          {renderRow(t("DetailScreen|MAC address"), detail.mac_address ?? "")}
          {renderRow(
            t("DetailScreen|Created"),
            detail.created ? <DateTime value={detail.created * 1000} /> : ""
          )}
          {renderRow(
            t("DetailScreen|Last sign in"),
            detail.last_sign_in ? (
              <DateTime value={detail.last_sign_in * 1000} />
            ) : (
              t("DetailScreen|Never")
            )
          )}

        <Box mt="auto" display="flex" gap={2}>
  <Button
    variant="contained"
    color="primary"
    onClick={goBack}
    startIcon={<ArrowBackIcon />}
  >
    {t("DetailScreen|Back")}
  </Button>

  
</Box>
        </CardContent>
      </Card>
    </Container>
    </Box>
  );
}