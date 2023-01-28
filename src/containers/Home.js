import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="Home__container--centered">
      <div className="Home__header">
        <a className="Home__logo" href="https://www.mercadolibre.com/">
          Mercado Libre - Donde comprar y vender de todo
        </a>
      </div>
      <div className="Home__container">
        <h4>Challenge by Manuel Uzcátegui</h4>
        <p className="clickable" onClick={() => navigate("/profile")}>
          Ir a la ruta /profile
        </p>
      </div>
    </div>
  );
}
