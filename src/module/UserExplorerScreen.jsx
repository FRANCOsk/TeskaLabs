import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Paper,
  
  Divider,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import PublicIcon from "@mui/icons-material/Public";
import axios from "axios";
import { useTranslation } from "react-i18next";

export function UserExplorerScreen() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMapUrl, setSelectedMapUrl] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("https://randomuser.me/api/", {
        params: { results: 6 },
      });

      const loadedUsers = response?.data?.results ?? [];
      setUsers(loadedUsers);

      if (loadedUsers.length > 0) {
        await handleSelectUser(loadedUsers[0]);
      }
    } catch (e) {
      console.error(e);
      setError(t("UserExplorer|Failed to load users"));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (u) => {
    setSelectedUser(u);
    setSelectedMapUrl(null);

    try {
      const query = [
        u.location?.street?.name,
        u.location?.street?.number,
        u.location?.city,
        u.location?.state,
        u.location?.country,
        u.location?.postcode,
      ]
        .filter(Boolean)
        .join(", ");

      const geoResponse = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: query,
            format: "jsonv2",
            limit: 1,
          },
        }
      );

      const place = geoResponse?.data?.[0];

      if (place?.lat && place?.lon) {
        setSelectedMapUrl(
          `https://maps.google.com/maps?output=embed&q=${place.lat},${place.lon}&z=10`
        );
      } else {
        setSelectedMapUrl(
          `https://maps.google.com/maps?output=embed&q=${encodeURIComponent(
            `${u.location?.city}, ${u.location?.country}`
          )}&z=10`
        );
      }
    } catch (e) {
      console.error("Geocoding failed:", e);

      setSelectedMapUrl(
        `https://maps.google.com/maps?output=embed&q=${encodeURIComponent(
          `${u.location?.city}, ${u.location?.country}`
        )}&z=10`
      );
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #f8fbff 0%, #eef5ff 100%)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
              <PeopleIcon color="primary" />
              <Typography variant="h4" fontWeight={700}>
                {t("UserExplorer|Title")}
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Browse random users, inspect their contact details, and view their
              approximate location on the map.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={loadUsers}
            disabled={loading}
            sx={{ borderRadius: 3, px: 2.5, py: 1.2, textTransform: "none" }}
          >
            {t("UserExplorer|Reload")}
          </Button>
        </Stack>
      </Paper>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {users.map((u, idx) => {
          const isSelected = selectedUser?.login?.uuid === u?.login?.uuid;

          return (
            <Grid item xs={12} sm={6} lg={4} key={idx}>
              <Card
                onClick={() => handleSelectUser(u)}
                elevation={isSelected ? 8 : 2}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  borderRadius: 4,
                  transition: "all 0.25s ease",
                  border: "2px solid",
                  borderColor: isSelected ? "primary.main" : "transparent",
                  transform: isSelected ? "translateY(-2px)" : "none",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <Avatar
                      src={u.picture?.large}
                      alt={`${u.name?.first ?? ""} ${u.name?.last ?? ""}`}
                      sx={{
                        width: 88,
                        height: 88,
                        boxShadow: 3,
                      }}
                    />

                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {u.name?.first} {u.name?.last}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {u.location?.city}, {u.location?.country}
                      </Typography>
                    </Box>

                    {isSelected && (
                      <Chip
                        label="Selected"
                        color="primary"
                        size="small"
                        sx={{ borderRadius: 2 }}
                      />
                    )}

                    <Divider flexItem />

                    <Stack spacing={1.2} width="100%">
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {u.email}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {u.phone}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                        justifyContent="center"
                      >
                        <HomeIcon
                          fontSize="small"
                          color="action"
                          sx={{ mt: "2px" }}
                        />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {u.location?.street?.name}{" "}
                            {u.location?.street?.number}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {u.location?.city}, {u.location?.state}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {u.location?.country}, {u.location?.postcode}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {selectedUser && selectedMapUrl && (
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                  <LocationOnIcon color="primary" />
                  <Typography variant="h5" fontWeight={700}>
                    {selectedUser.name?.first} {selectedUser.name?.last}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <PublicIcon fontSize="small" color="action" />
                  <Typography variant="body1" color="text.secondary">
                    {selectedUser.location?.city}, {selectedUser.location?.state}
                    , {selectedUser.location?.country}
                  </Typography>
                </Stack>
              </Box>

              <Chip
                label="Location Preview"
                color="secondary"
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
            </Stack>

            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <iframe
                title="user-location-map"
                width="100%"
                height="380"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                src={selectedMapUrl}
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              {selectedUser.location?.street?.name}{" "}
              {selectedUser.location?.street?.number},{" "}
              {selectedUser.location?.city}, {selectedUser.location?.state},{" "}
              {selectedUser.location?.country}
            </Typography>
          </Stack>
        </Paper>
      )}
    </Container>
  );
}