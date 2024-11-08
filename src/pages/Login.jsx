import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const handlerLogin = (e) => {
    e.preventDefault();
    login();
    navigate("/dashboard");
  };
  return (
    <div className="main-login" id="login-content">
      <div className="login-container">
        <div className="wrap-content">
          <span>Ingrese sus credenciales para ingresar al portal</span>

          <form className="login-user">
            <div className="inputWrap inputUser">
              <label htmlFor="username">Usuario:</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="(dni afiliado/profesional)"
              />
            </div>

            <div className="inputWrap inputPassword">
              <label htmlFor="password">Contraseña:</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="******"
              />
            </div>
            <div className="btn-container">
              <Link to="/contacto" className="fgt-pass">
                Olvide mi contraseña
              </Link>
              <button
                type="submit"
                className="btnBase"
                id="submitLogin"
                onClick={handlerLogin}
              >
                Ingresar
              </button>
            </div>
            <a href="https://google.com" className="mobile-app" target="_blank">
              <h2>Proximamente</h2>
              <img src="images/app-btn-google.png" alt="" />
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
