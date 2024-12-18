import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  rangosHorarios,
  listadoSalas,
  // listadoReservas,
} from "../data/Database";
import useAnimationContent from "../hooks/useAnimationContent";
import { useNavigate } from "react-router-dom";
import CustomToast from "../hooks/customToast";
import ValidarDisponibilidadEspacio from "../helpers/ValidarDisponibilidadEspacio";
import Spinner from "../components/Spinner";
import BotonVolver from "../components/BotonVolver";
import ReservarEspacio from "../helpers/ReservarEspacio";
import { ObtenerUsuario } from "../helpers/ObtenerUsuario";

// manejar reserva
function handleReserva(
  e,
  fecha,
  hora,
  navigate,
  setMessage,
  setToastStyle,
  setToastType,
  salaElegida,
  setIsLoading,
  idUsuario
) {
  e.preventDefault();

  // spinner
  setIsLoading(true);

  setTimeout(() => {
    // Lógica de reserva
    if (ValidarDisponibilidadEspacio(salaElegida, fecha, hora)) {
      setMessage("El espacio no está disponible en esa fecha y hora.");
      setToastType("error");
      setToastStyle({
        backgroundColor: "#8f3939",
        color: "white",
        borderRadius: "10px",
        fontSize: "16px",
        padding: "10px",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    if (hora === "" || fecha === "") {
      setMessage(
        "Debes completar la fecha y hora para poder reservar el espacio."
      );
      setToastType("error");
      setToastStyle({
        backgroundColor: "#8f3939",
        color: "white",
        borderRadius: "10px",
        fontSize: "16px",
        padding: "10px",
        duration: 3000,
      });
      setIsLoading(false);
    } else {
      setMessage(
        `La reserva para el dia ${fecha} a las ${hora} con el id ${salaElegida} ha sido realizada con éxito.`
      );
      setToastType("success");
      setToastStyle({
        backgroundColor: "#1b791f",
        color: "white",
        borderRadius: "10px",
        fontSize: "16px",
        padding: "10px",
        duration: 3000,
      });

      ReservarEspacio(salaElegida, fecha, hora, idUsuario);

      setTimeout(() => {
        navigate("/dashboard");
      }, 3200);
      setIsLoading(false);
    }
  }, 1000);
}

export default function EspacioDetail() {
  useAnimationContent();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [toastStyle, setToastStyle] = useState({});
  const [toastType, setToastType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const usuarioActual = ObtenerUsuario();
  const idUsuario = usuarioActual.id;

  const { id } = useParams();
  const space = listadoSalas.find((space) => space.id === parseInt(id));

  if (!space) {
    return <p>Espacio no encontrado</p>;
  }

  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split("T")[0];

  const salaElegida = space.id;

  return (
    <>
      {isLoading && <Spinner />}

      <div className="reservar-sala subContainer">
        <div className="card-salas" key={space.id}>
          {space.destacado && <span className="tag-destacado">Destacada</span>}
          <div className="imagen-space">
            <img
              src={space.imagen_space}
              alt={space.name}
              className="imagen-space"
            />
          </div>
          <div className="card-content">
            <h4>{space.name}</h4>
            <div className="bottom-data">
              <span>Capacidad: {space.capacidad}</span>
              <span>
                Apta para proyector: {space.apta_proyector ? "Sí" : "No"}
              </span>
            </div>
          </div>
        </div>

        <h1>Elegi los datos de tu reserva</h1>

        <div className="formulario-reserva">
          <form className="formulario">
            <div className="inputWrap reserva-date">
              <label htmlFor="fecha" id="fecha">
                Selecciona la fecha de tu reserva
              </label>
              <input
                type="date"
                min={minDate}
                name="fecha"
                id="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>

            <div className="inputWrap reserva-hora">
              <label htmlFor="hora" id="hora">
                Selecciona la hora de tu reserva
              </label>
              <select
                name="hora"
                id="hora"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              >
                {rangosHorarios.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="btn-container">
              <button
                className="btnBase"
                onClick={(e) =>
                  handleReserva(
                    e,
                    fecha,
                    hora,
                    navigate,
                    setMessage,
                    setToastStyle,
                    setToastType,
                    salaElegida,
                    setIsLoading,
                    idUsuario
                  )
                }
              >
                Reservar
              </button>

              <BotonVolver ruta={"espacios"} />
            </div>
          </form>
          <CustomToast
            message={message}
            toastStyle={toastStyle}
            type={toastType}
          />
        </div>
      </div>
    </>
  );
}
