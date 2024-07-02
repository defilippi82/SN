import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Form, Table, Button, FloatingLabel, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const RegistrarSocio = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [manzana, setManzana] = useState('');
  const [lote, setLote] = useState('');
  const [isla, setIsla] = useState('');
  const roles = new Map([
    ['propietario', { valor: 'propietario', administrador: false, propietario: true, inquilino: false, guardia: false }],
    ['inquilino', { valor: 'inquilino', administrador: false, propietario: false, inquilino: true, guardia: false }],
  ]);
  const [rol, setRol] = useState(roles.get('propietario')); // Valor inicial del rol
  const [tel, setTel] = useState('');
  const [codPais, setCodPais] = useState('');
  const [numerotelefono, setNumeroTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setNumeroTelefono(`${codPais}${tel}`);
  }, [codPais, tel]);

  const crearSocio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que la contraseña tenga al menos 6 caracteres
    if (contrasena.length < 6) {
      setShowError(true);
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (contrasena !== repetirContrasena) {
      setShowError(true);
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      // Crear usuario en Firebase Authentication
      const { user } = await createUserWithEmailAndPassword(auth, email, contrasena);

      // Agregar datos del usuario a la colección 'usuarios' en Firestore
      await addDoc(collection(db, 'usuarios'), {
        nombre,
        apellido,
        email,
        manzana,
        lote,
        isla,
        rol: rol.valor,
        numerotelefono,
        contrasena,
      });

      // Mostrar alerta de éxito
      alert('El socio ha sido registrado correctamente');
      navigate('/');

      // Resetear los campos del formulario
      setNombre('');
      setApellido('');
      setEmail('');
      setContrasena('');
    } catch (error) {
      // Mostrar alerta de error
      setShowError(true);
      setErrorMessage(error.message);
    }
  };

  const handleRolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoRol = roles.get(e.target.value);
    setRol(nuevoRol);
  };

  return (
    <div className="container">
      <div className="card text-bg-primary mb-3 shadow-lg" style={{ maxWidth: '18rem' }}>
        <h1 className="card-header">Registrar Nuevo Socio</h1>
      </div>
      <form onSubmit={crearSocio} className="card card-body shadow-lg">
        <Row className="align-items-center">
          <Col xs="auto">
            <div className="elem-group">
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="text"
                  id="nombre"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
                <label htmlFor="nombre">Nombre</label>
              </div>
            </div>

            <div className="elem-group">
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="text"
                  id="apellido"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
                <label htmlFor="apellido">Apellido</label>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col xs="auto">
            <div className="elem-group">
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  placeholder="ejemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email">Correo electrónico</label>
              </div>
            </div>
            <div className="elem-group">
              <div className="form-floating mb-3">
                <input
                  type="number"
                  id="manzana"
                  value={manzana}
                  onChange={(e) => setManzana(e.target.value)}
                  name="manzana"
                  maxLength={2}
                  className="form-control"
                  required
                />
                <label htmlFor="manzana">Manzana</label>
              </div>
            </div>
            <div className="elem-group">
              <div className="form-floating mb-3">
                <input
                  type="number"
                  id="lote"
                  value={lote}
                  onChange={(e) => setLote(e.target.value)}
                  name="lote"
                  maxLength={3}
                  className="form-control"
                  required
                />
                <label htmlFor="lote">Lote</label>
              </div>
            </div>
            <div className="elem-group">
              <div className="form-floating mb-3">
                <input
                  type="number"
                  id="isla"
                  value={isla}
                  onChange={(e) => setIsla(e.target.value)}
                  name="isla"
                  maxLength={3}
                  className="form-control"
                  required
                />
                <label htmlFor="isla">Isla</label>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col xs="auto">
            <div className="elem-group">
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="codPais"
                  name="codPais"
                  value={codPais}
                  onChange={(e) => setCodPais(e.target.value)}
                  required
                >
                  <option value="">Código de País</option>
                  <option value="+54">Argentina (+54)</option>
                  <option value="+598">Uruguay (+598)</option>
                  <option value="+55">Brasil (+55)</option>
                  <option value="+56">Chile (+56)</option>
                  <option value="+57">Colombia (+57)</option>
                  <option value="+1">EE. UU. (+1)</option>
                  <option value="+1">Canadá (+1)</option>
                  <option value="+52">México (+52)</option>
                  <option value="+34">España (+34)</option>
                  <option value="+44">Reino Unido (+44)</option>
                  <option value="+49">Alemania (+49)</option>
                  <option value="+33">Francia (+33)</option>
                  <option value="+39">Italia (+39)</option>
                  <option value="+41">Suiza (+41)</option>
                </select>
                <label htmlFor="codPais">Código de País</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  name="tel"
                  placeholder="11-XXXX-XXXX"
                  className="form-select"
                  required
                />
                <label htmlFor="tel">Teléfono</label>
              </div>
            </div>

            <div className="elem-group form-floating mb-3">
              <RolSelect />
            </div>

            <div className="elem-group form-floating mb-3">
              <input
                className="form-control"
                type="password"
                id="contrasena"
                placeholder="XXXXXXXX"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                minLength={6}
                required
              />
              <label htmlFor="contrasena">Contraseña</label>
            </div>
            <div className="elem-group form-floating mb-3">
              <input
                className="form-control"
                type="password"
                id="repetirContrasena"
                placeholder="XXXXXXXX"
                value={repetirContrasena}
                onChange={(e) => setRepetirContrasena(e.target.value)}
                required
              />
              <label htmlFor="repetirContrasena">Repetir Contraseña</label>
            </div>
          </Col>
        </Row>

        {showError && (
          <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
            <Alert.Heading>Error</Alert.Heading>
            <p>{errorMessage}</p>
          </Alert>
        )}

        <button type="submit" className="btn btn-primary">
          Registrar
        </button>
      </form>
    </div>
  );
};

const RolSelect = () => {
  const [rol, setRol] = useState(roles.get('propietario'));

  const handleRolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoRol = roles.get(e.target.value);
    setRol(nuevoRol);
  };

  return (
    <div className="container fluid elem-group form-floating mb-3">
      <select
        name="rol"
        id="rol"
        value={rol.valor}
        onChange={handleRolChange}
        className="form-select"
      >
        {Array.from(roles.keys()).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <label htmlFor="rol">Rol</label>
    </div>
  );
};

