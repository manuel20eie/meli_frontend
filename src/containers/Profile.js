// React
import React, { useState, useEffect } from "react";
import { useAppContext } from "../libs/contextLib";
// Components
import Header from "../components/header";
import PurchasesCard from "../components/purchasesCard";
import { TailSpin } from "react-loader-spinner";
// Routes
import {
  GET_USER,
  GET_USER_RESTRICTIONS,
  GET_USER_PURCHASES,
  GET_LEVEL_INFO,
  GET_SHIPMENT_DETAILS,
  GET_PAYMENT_DETAILS,
} from "../secrets";
// Functions
import { getFormatDate } from "../libs/functions";
import { executeQuery } from "../libs/api_functions";
// Icons
import { BiErrorCircle, BiError } from "react-icons/bi";
import { GrCompliance } from "react-icons/gr";

export default function Profile() {
  const { userData, setUserData } = useAppContext();
  const limit = 3;
  const icons = {
    warning: <BiError />,
    error: <BiErrorCircle />,
    success: <GrCompliance />,
  };
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([1]);
  const [purchasesList, setPurchasesList] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  useEffect(() => {
    const pageInit = async () => {
      if (userData === null) {
        let userData_ = await executeQuery(GET_USER);
        setUserData(userData_.data);

        let level_info_ = await executeQuery(GET_LEVEL_INFO, {
          levelId: userData_.data.nivel,
        });
        setUserData({ ...userData_.data, level_info: level_info_.data });

        let purchases_ = await executeQuery(GET_USER_PURCHASES, {
          userId: userData_.data.id_usuario,
          offset: 0,
          limit: limit,
        });
        setUserData({
          ...userData_.data,
          level_info: level_info_.data,
          purchases: purchases_.data,
        });
        setPurchasesList(purchases_.data.data);
        // Set pages
        let max_page = Math.ceil(purchases_.data.total / limit);
        setPages(Array.from({ length: max_page }, (_, i) => i + 1));

        let restrictions_ = await executeQuery(GET_USER_RESTRICTIONS, {
          userId: userData_.data.id_usuario,
        });
        setUserData({
          ...userData_.data,
          level_info: level_info_.data,
          purchases: purchases_.data,
          restrictions: restrictions_.data,
        });
      }
    };
    pageInit();
  }, [userData, setUserData]);

  useEffect(() => {
    const updatePage = async () => {
      if (
        page * limit > userData.purchases.data.length &&
        page * limit <= userData.purchases.total
      ) {
        setLoadingPurchases(true);
        let purchases_ = await executeQuery(GET_USER_PURCHASES, {
          userId: userData.id_usuario,
          limit: limit,
          offset: userData.purchases.offset + limit,
        });
        let current_purchases = { ...userData.purchases };
        let purchases = [...current_purchases.data];
        purchases = purchases.concat(purchases_.data.data);
        current_purchases.data = purchases;
        current_purchases.total = purchases_.data.total;
        current_purchases.offset = purchases_.data.offset + limit;
        setUserData({ ...userData, purchases: current_purchases });
        setPurchasesList(purchases.slice((page - 1) * limit, page * limit));
        setLoadingPurchases(false);
      } else {
        setPurchasesList(
          userData.purchases.data.slice((page - 1) * limit, page * limit)
        );
      }
    };
    if (userData?.purchases) {
      updatePage();
    }
  }, [page, userData, setUserData]);

  const getPurchaseDetails = async (currentPurchase) => {
    if (!currentPurchase.shipment_info || !currentPurchase.payment_info) {
      let shipment_info_ = await executeQuery(GET_SHIPMENT_DETAILS, {
        shipmentId: currentPurchase.id_envio,
      });
      let payment_info_ = await executeQuery(GET_PAYMENT_DETAILS, {
        paymentId: currentPurchase.id_transaccion,
      });
      setCurrentPurchase({
        ...currentPurchase,
        shipment_info: shipment_info_.data,
        payment_info: payment_info_.data,
      });
      let index = purchasesList
        .map((el) => el.id_compra)
        .indexOf(currentPurchase.id_compra);
      let purchasesList_ = [...purchasesList];
      currentPurchase.shipment_info = shipment_info_.data;
      currentPurchase.payment_info = payment_info_.data;
      purchasesList_[index] = currentPurchase;
      setPurchasesList(purchasesList_);
    }
  };

  const renderPurchasesList = () => {
    const showPurchaseDetails = (el) => {
      setCurrentPurchase(el);
      getPurchaseDetails(el);
      setShowDetails(true);
    };
    return (
      <div className="Profile__purchases-container">
        {purchasesList.map(function (el) {
          return (
            <PurchasesCard
              key={el.id_compra}
              props={el}
              showPurchaseDetails={showPurchaseDetails}
            />
          );
        })}
        <div className="Profile__purchases-paginator">
          {page !== 1 && (
            <span className="clickable" onClick={() => setPage(page - 1)}>
              Anterior
            </span>
          )}
          {pages.slice(0, page + 1).map(function (el) {
            return (
              <div
                className={
                  el !== page
                    ? "Profile__purchases-page clickable"
                    : "Profile__purchases-page Profile__purchases-page--active clickable"
                }
                key={"page" + el}
                onClick={() => setPage(el)}
              >
                {el}
              </div>
            );
          })}
          {pages.includes(page + 1) && (
            <span className="clickable" onClick={() => setPage(page + 1)}>
              Siguiente
            </span>
          )}
          {loadingPurchases && (
            <TailSpin type="TailSpin" color="#3483fa" height={30} width={30} />
          )}
        </div>
      </div>
    );
  };

  const renderPurchasesDetails = () => {
    return (
      <div className="Profile__purchases-container">
        <div className="Profile__purchases-container-back">
          <p>
            <span
              className="clickable"
              onClick={() => {
                setShowDetails(false);
                setCurrentPurchase(null);
              }}
            >
              Compras
            </span>{" "}
            {">"} Estado de la compra
          </p>
        </div>
        <div className="Profile__purchases-details-card Profile__purchases-details-card--grey col">
          {currentPurchase.shipment_info ? (
            <div className="row">
              <h3
                className={
                  currentPurchase.shipment_info.estado === "entregado"
                    ? "alert--green"
                    : "alert--red"
                }
              >
                {currentPurchase.shipment_info.estado.charAt(0).toUpperCase() +
                  currentPurchase.shipment_info.estado.slice(1)}
              </h3>{" "}
              Envío #{currentPurchase.shipment_info.id_envio}
            </div>
          ) : (
            <div className="row">
              <TailSpin
                type="TailSpin"
                color="#3483fa"
                height={30}
                width={30}
              />
            </div>
          )}
          <div className="row">
            <div>
              <h2>{currentPurchase.titulo}</h2>
              <span>
                {currentPurchase.cantidad}{" "}
                {currentPurchase.cantidad > 1 ? "unidades" : "unidad"}
              </span>
            </div>
            <div>
              <img src={currentPurchase.imagen} alt="Product"></img>
            </div>
          </div>
        </div>
        <div className="Profile__purchases-details-card col">
          <p>
            <strong>Detalle de la compra</strong>
          </p>
          <span>
            {getFormatDate(currentPurchase.fecha)} | #
            {currentPurchase.id_compra}
          </span>
          <div className="horizontal_line"></div>
          <div className="row">
            <span>{"Productos(" + currentPurchase.cantidad + ")"}</span>
            <span>
              {currentPurchase.precio.total +
                " " +
                currentPurchase.precio.moneda}
            </span>
          </div>
          <div className="row">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <div className="horizontal_line"></div>
          <div className="row">
            <span>Total</span>
            <span>
              {currentPurchase.precio.total +
                " " +
                currentPurchase.precio.moneda}
            </span>
          </div>
          {currentPurchase.payment_info ? (
            <div className="row">
              <h3
                className={
                  currentPurchase.payment_info.estado === "realizada"
                    ? "alert--green"
                    : "alert--red"
                }
              >
                Pago{" "}
                {currentPurchase.payment_info.estado.charAt(0).toUpperCase() +
                  currentPurchase.payment_info.estado.slice(1, -1) +
                  "o"}
              </h3>{" "}
              Transacción #{currentPurchase.payment_info.id_transaccion}
            </div>
          ) : (
            <div className="row" style={{ marginTop: "2vh" }}>
              <TailSpin
                type="TailSpin"
                color="#3483fa"
                height={30}
                width={30}
              />
            </div>
          )}
        </div>
        <div className="Profile__purchases-details-card Profile__purchases-details-card--last col">
          <p>
            <strong>Vendedor</strong>
          </p>
          <div className="horizontal_line"></div>
          <div className="row">
            <span>{currentPurchase.vendedor.nickname}</span>
            <span>#{currentPurchase.vendedor.id}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="Profile__container">
      <Header />
      {userData !== null ? (
        <>
          <div className="Profile__card">
            <div className="Profile__card-content">
              <div className="Profile__image-container">
                <img
                  decoding="async"
                  src={userData.imagen}
                  alt="user profile"
                ></img>
              </div>
              <div className="Profile__titles">
                <h1>
                  {userData.nombre} {userData.apellido}
                </h1>
                {userData.level_info && (
                  <p>{userData.level_info.descripción}</p>
                )}
              </div>
            </div>
            {userData.restrictions && (
              <div>
                {userData.restrictions.map(function (el, index) {
                  return (
                    <div
                      className="Profile__card-restrictions row"
                      key={index + "-restrictions"}
                    >
                      {icons[el.tipo]}
                      <p>{el.mensaje}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {userData.purchases ? (
            <>
              {!showDetails ? renderPurchasesList() : renderPurchasesDetails()}
            </>
          ) : (
            <div className="Profile__purchases-loading">
              <TailSpin
                type="TailSpin"
                color="#3483fa"
                height={80}
                width={80}
              />
            </div>
          )}
        </>
      ) : (
        <div className="Profile__purchases-loading">
          <TailSpin type="TailSpin" color="#3483fa" height={80} width={80} />
        </div>
      )}
    </div>
  );
}
