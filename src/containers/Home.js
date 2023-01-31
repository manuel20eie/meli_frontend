import { useNavigate } from "react-router-dom";
// Components
import Header from "../components/header";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="Home__container--centered">
      <Header />
      <div className="Home__container">
        <h4>Challenge by Manuel Uzcátegui</h4>
        <p className="clickable" onClick={() => navigate("/profile")}>
          Ir a la ruta /profile
        </p>
      </div>
    </div>
  );
}
