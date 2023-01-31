// Functions
import { getFormatDate } from "../libs/functions";

export default function purchasesCard({ props, showPurchaseDetails }) {
  return (
    <div className="PurchasesCard__container">
      <div className="PurchasesCard__date">
        <span>{getFormatDate(props.fecha)}</span>
      </div>
      <div className="PurchasesCard__content">
        <div style={{ display: "flex" }}>
          <div className="PurchasesCard__image-container">
            <img src={props.imagen} alt="User profile"></img>
          </div>
          <div className="PurchasesCard__info">
            <span>{props.id_compra}</span>
            <h2>{props.titulo}</h2>
            <span>
              {props.precio?.total} {props.precio?.moneda}
            </span>
            <span>
              {props.cantidad} {props.cantidad > 1 ? "unidades" : "unidad"}
            </span>
          </div>
        </div>
        <div className="PurchasesCard__button-container">
          <button
            className="clickable"
            onClick={() => showPurchaseDetails(props)}
          >
            Ver compra
          </button>
        </div>
      </div>
    </div>
  );
}
