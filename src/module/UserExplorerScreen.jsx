import React, { useEffect, useState } from "react";
import { Container, Card, CardBody, Row, Col, Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Spinner } from "asab_webui_components";

export function UserExplorerScreen(props) {
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
        },
      );

      const place = geoResponse?.data?.[0];

      if (place?.lat && place?.lon) {
        setSelectedMapUrl(
          `https://maps.google.com/maps?output=embed&q=${place.lat},${place.lon}&z=10`,
        );
      } else {
        setSelectedMapUrl(
          `https://maps.google.com/maps?output=embed&q=${encodeURIComponent(
            `${u.location?.city}, ${u.location?.country}`,
          )}&z=10`,
        );
      }
    } catch (e) {
      console.error("Geocoding failed:", e);

      setSelectedMapUrl(
        `https://maps.google.com/maps?output=embed&q=${encodeURIComponent(
          `${u.location?.city}, ${u.location?.country}`,
        )}&z=10`,
      );
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Container className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">
          <i className="bi bi-people pe-2"></i>
          {t("UserExplorer|Title")}
        </h3>

        <Button color="primary" onClick={loadUsers}>
          <i className="bi bi-arrow-repeat pe-2"></i>
          {t("UserExplorer|Reload")}
        </Button>
      </div>

      {loading && (
        <div className="mb-3">
          <Spinner />
        </div>
      )}

      {error && <div className="text-danger mb-3">{error}</div>}

      <Row className="mt-3">
        {users.map((u, idx) => (
          <Col md={4} key={idx} className="mb-3">
            <Card
              className={`h-100 shadow-sm ${
                selectedUser?.login?.uuid === u?.login?.uuid
                  ? "border border-primary"
                  : ""
              }`}
              onClick={() => handleSelectUser(u)}
              style={{ cursor: "pointer" }}
            >
              <CardBody className="text-center">
                <img
                  src={u.picture?.medium}
                  alt={`${u.name?.first ?? ""} ${u.name?.last ?? ""}`}
                  className="rounded-circle mb-2"
                />

                <div>
                  <strong>
                    {u.name?.first} {u.name?.last}
                  </strong>
                </div>

                <div className="text-muted">{u.email}</div>

                <div>
                  {u.location?.street?.name} {u.location?.street?.number}
                </div>

                <div>
                  {u.location?.city}, {u.location?.state}
                </div>

                <div className="text-muted small">
                  {u.location?.country}, {u.location?.postcode}
                </div>

                <div className="small text-muted mt-1">{u.phone}</div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedUser && selectedMapUrl && (
        <Card className="mt-4">
          <CardBody>
            <h5 className="mb-3">
              <i className="bi bi-geo-alt pe-2"></i>
              {selectedUser.name?.first} {selectedUser.name?.last} –{" "}
              {selectedUser.location?.city}, {selectedUser.location?.country}
            </h5>

            <iframe
              title="user-location-map"
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: "8px" }}
              loading="lazy"
              src={selectedMapUrl}
            />

            <div className="mt-2 text-muted small">
              {selectedUser.location?.street?.name}{" "}
              {selectedUser.location?.street?.number},{" "}
              {selectedUser.location?.city}, {selectedUser.location?.state},{" "}
              {selectedUser.location?.country}
            </div>
          </CardBody>
        </Card>
      )}
    </Container>
  );
}
