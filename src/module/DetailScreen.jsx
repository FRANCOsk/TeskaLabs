import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Button,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { DateTime } from "asab_webui_components";
import axios from "axios";

export function DetailScreen(props) {
  const { t } = useTranslation();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          `https://devtest.teskalabs.com/detail/${id}`,
        );
        //console.log(response.data);
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

  if (loading) {
    return (
      <Container className="py-3">
        <Card>
          <CardBody>{t("DetailScreen|Loading detail...")}</CardBody>
        </Card>
      </Container>
    );
  }

  if (error || !detail) {
    return (
      <Container className="py-3">
        <Card>
          <CardBody>
            <div className="mb-3 text-danger">
              {t("DetailScreen|Failed to load detail")}
            </div>
            <Button color="secondary" onClick={goBack}>
              <i className="bi bi-arrow-left pe-2"></i>
              {t("DetailScreen|Back")}
            </Button>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-3">
      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-0">
              <i className="bi bi-person-badge pe-2"></i>
              {t("DetailScreen|User detail")}
            </h3>
          </div>
          <Button color="secondary" onClick={goBack}>
            <i className="bi bi-arrow-left pe-2"></i>
            {t("DetailScreen|Back")}
          </Button>
        </CardHeader>

        <CardBody>
          <Row className="mb-3">
            <Col md={3}>
              <strong>{t("DetailScreen|ID")}:</strong>
            </Col>
            <Col md={9}>{detail.id ?? ""}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <strong>{t("DetailScreen|Username")}:</strong>
            </Col>
            <Col md={9}>{detail.username ?? ""}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <strong>{t("DetailScreen|Email")}:</strong>
            </Col>
            <Col md={9}>{detail.email ?? ""}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <strong>{t("DetailScreen|Address")}:</strong>
            </Col>
            <Col md={9}>{detail.address ?? ""}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <strong>{t("DetailScreen|Phone number")}:</strong>
            </Col>
            <Col md={9}>{detail.phone_number ?? ""}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <strong>{t("DetailScreen|IP address")}:</strong>
            </Col>
            <Col md={9}>{detail.ip_address ?? ""}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <strong>{t("DetailScreen|MAC address")}:</strong>
            </Col>
            <Col md={9}>{detail.mac_address ?? ""}</Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <strong>{t("DetailScreen|Created")}:</strong>
            </Col>
            <Col md={9}>
              {detail.created ? <DateTime value={detail.created * 1000} /> : ""}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <strong>{t("DetailScreen|Last sign in")}:</strong>
            </Col>
            <Col md={9}>
              {detail.last_sign_in ? (
                <DateTime value={detail.last_sign_in * 1000} />
              ) : (
                t("DetailScreen|Never")
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
}
