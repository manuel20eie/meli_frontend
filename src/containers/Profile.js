// React
import React, { useState, useEffect } from "react";
import { useAppContext } from "../libs/contextLib";
import { encodeQuery } from "../libs/auth";
import Header from "../components/header";
import PurchasesCard from "../components/purchasesCard";
import { GET_USER, GET_LEVEL_INFO, GET_USER_PURCHASES } from "../secrets";

export default function Profile() {
  const { userData, setUserData } = useAppContext();

  const limit = 3;
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([1]);
  const [currentPurchases, setCurrentPurchases] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);

  useEffect(() => {
    const pageInit = async () => {
      if (userData === null) {
        let userData_ = await encodeQuery(GET_USER);
        setUserData(userData_.data);

        let level_info_ = await encodeQuery(GET_LEVEL_INFO, {
          levelId: userData_.data.nivel,
        });
        setUserData({ ...userData_.data, level_info: level_info_.data });

        let purchases_ = await encodeQuery(GET_USER_PURCHASES, {
          userId: userData_.data.id_usuario,
          offset: 0,
          limit: limit,
        });
        setUserData({
          ...userData_.data,
          level_info: level_info_.data,
          purchases: purchases_.data,
        });
        setCurrentPurchases(purchases_.data.data);
        // Set pages
        let max_page = Math.ceil(purchases_.data.total / limit);
        setPages(Array.from({ length: max_page }, (_, i) => i + 1));
      }
    };
    pageInit();
  }, []);

  const updatePage = async () => {
    if (
      page * limit > userData.purchases.data.length &&
      page * limit <= userData.purchases.total
    ) {
      let purchases_ = await encodeQuery(GET_USER_PURCHASES, {
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
      setCurrentPurchases(purchases.slice((page - 1) * limit, page * limit));
    } else {
      setCurrentPurchases(
        userData.purchases.data.slice((page - 1) * limit, page * limit)
      );
    }
  };

  useEffect(() => {
    if (userData?.purchases) {
      updatePage();
    }
  }, [page]);

  const renderPurchasesList = () => {
    const showPurchaseDetails = (el) => {
      setCurrentPurchase(el);
      setShowDetails(true);
    };
    return (
      <div className="Profile__purchases-container">
        {currentPurchases.map(function (el) {
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
        </div>
      </div>
    );
  };

  const renderPurchasesDetails = () => {
    return (
      <div className="Profile__purchases-container">
        <div
        className="Profile__purchases-container-back"
          onClick={() => {
            setShowDetails(false);
            setCurrentPurchase(null);
          }}
        >
          <span className="clickable">Atrás</span>
        </div>
        <PurchasesCard
          key={currentPurchase.id_compra}
          props={currentPurchase}
        />
      </div>
    );
  };

  return (
    <div className="Profile__container">
      <Header />
      {userData !== null && (
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
          </div>
          {userData.purchases && (
            <>
              {!showDetails ? renderPurchasesList() : renderPurchasesDetails()}
            </>
          )}
        </>
      )}
    </div>
  );
}
