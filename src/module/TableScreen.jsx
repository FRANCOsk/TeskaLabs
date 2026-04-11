import React from "react";
import { Container } from "reactstrap";
import { useTranslation } from "react-i18next";
import { DataTableCard2, DateTime } from "asab_webui_components";
import axios from "axios";

export function TableScreen(props) {
  const { t } = useTranslation();

  const loader = async ({ params }) => {
    const page = Number(params?.p ?? 1);
    const limit = Number(params?.i ?? 10);

    const response = await axios.get("https://devtest.teskalabs.com/data");

    const allRows = response?.data?.data ?? [];
    const totalCount = response?.data?.count ?? allRows.length;

    const start = (page - 1) * limit;
    const pagedRows = allRows.slice(start, start + limit);

    return {
      rows: pagedRows,
      count: totalCount,
    };
  };

  const goToDetail = (id) => {
    if (props.app && typeof props.app.navigate === "function") {
      props.app.navigate(`/detail/${id}`);
      return;
    }

    window.location.href = `#/detail/${id}`;
  };

  const Header = () => {
    return (
      <div className="flex-fill">
        <h3 className="mb-0">
          <i className="bi bi-table pe-2"></i>
          {t("TableScreen|Users")}
        </h3>
      </div>
    );
  };

  const columns = [
    {
      title: t("TableScreen|Username"),
      render: ({ row }) => (
        <span
          title={`ID: ${row?.id ?? ""}`}
          onClick={() => goToDetail(row?.id)}
          style={{ cursor: "pointer", color: "#0d6efd" }}
        >
          {row?.username ?? ""}
        </span>
      ),
    },

    {
      title: t("TableScreen|Address"),
      render: ({ row }) => row?.address ?? "",
    },
    {
      title: t("TableScreen|Email"),
      render: ({ row }) => row?.email ?? "",
    },
    {
      title: t("TableScreen|Created"),
      render: ({ row }) =>
        row?.created ? <DateTime value={row.created * 1000} /> : "",
    },
    {
      title: t("TableScreen|Last sign in"),
      render: ({ row }) =>
        row?.last_sign_in ? (
          <DateTime value={row.last_sign_in * 1000} />
        ) : (
          t("TableScreen|Never")
        ),
    },
  ];

  return (
    <Container className="h-100">
      <DataTableCard2 columns={columns} loader={loader} header={<Header />} />
    </Container>
  );
}
