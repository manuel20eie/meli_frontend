// Images
import notFoundPC from "../assets/images/notFoundPC.svg";

export default function NotFound() {
  return (
    <div className="NotFound__container--centered">
      <div className="NotFound__header">
        <a className="NotFound__logo" href="https://www.mercadolibre.com/">
          Mercado Libre - Donde comprar y vender de todo
        </a>
      </div>
      <div className="NotFound__container">
        <img src={notFoundPC} alt="Page not found."></img>
        <h4>Parece que esta página no existe</h4>
        <p
          className="clickable"
          onClick={() => (window.location = "https://www.mercadolibre.com/")}
        >
          Ir a la página principal
        </p>
      </div>
    </div>
  );
}
