import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CircleUser, Mail } from 'lucide-react';
import "../styles/Login.css";
import Input from "../components/Input";
import signUpImg from '../img/signup.svg';
import signInImg from '../img/signin.svg';
import workstreamIcon from '../img/workstreamico.png';
import { useEffect } from "react";

// Função para exibir notificações personalizadas
function showToast(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    if (toastContainer.childElementCount === 0) {
      toastContainer.remove();
    }
  }, 3000);
}

function Login() {

  useEffect(() => {
    document.title = "WorkStream - Acesso"; 
    
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = workstreamIcon;
    }
  }, []);

  const baseURL = `${window.location.protocol}//${window.location.hostname}:5000`;
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setForm] = useState({ username: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento

  const handleSignUpClick = () => setIsSignUp(!isSignUp);

  const readInputData = (e) => {
    const { name, value } = e.target;
    setForm((oldData) => ({ ...oldData, [name]: value }));
  };

  // ------------ Função de login ------------ //
  const loginUser = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showToast("E-mail e senha são obrigatórios.", "warn");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/users/check-email`, {
        method: 'POST',
        credentials: 'include', // Enviar sessão junto ao pedido
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.exists) {
        showToast("E-mail não encontrado.", "error");
        return;
      }
      if (!data.validPassword) {
        showToast("E-mail ou senha incorretos.", "error");
        return;
      }

      // Exibir tela de carregamento
      setIsLoading(true);

      // Garantir que a tela de carregamento fique visível por pelo menos 2 segundos
      setTimeout(() => {
        setIsLoading(false);
        navigate("/"); // Redirecionar para a página principal
      }, 2000);
    } catch (error) {
      console.error("Erro ao comunicar com o backend:", error);
      showToast("Erro ao tentar fazer login. Tente novamente.", "error");
    }
  };

  // ------------ Função de registro ------------ //
  const registerUser = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      showToast("Todos os campos são obrigatórios.", "warn");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/users/register`, {
        method: 'POST',
        credentials: 'include', // Enviar sessão junto ao pedido
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 201) {
        showToast("Usuário registrado com sucesso.", "success");
        setIsSignUp(false); // Volta para o formulário de login
      } else if (response.status === 409) {
        showToast("E-mail já cadastrado.", "warn");
      } else {
        showToast(data.error || "Erro ao registrar usuário.", "error");
      }
    } catch (error) {
      console.error("Erro ao comunicar com o backend:", error);
      showToast("Erro ao tentar registrar. Tente novamente.", "error");
    }
  };

  return (
    <div className={`container ${isSignUp ? "sign-up-mode" : ""}`}>
      {isLoading ? (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="forms-container">
          <div className="signin-signup">
            {/* Formulário de Login */}
            <form action="#" className="sign-in-form loginForm" onSubmit={loginUser}>
              <h2 className="title">Login</h2>
              <div className="input-field">
                <Mail />
                <Input
                  placeholder="E-mail"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={readInputData}
                />
              </div>
              <div className="input-field">
                <Lock />
                <Input
                  placeholder="Senha"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={readInputData}
                />
              </div>
              <button type="submit" className="btn">Login</button>
            </form>

            {/* Formulário de Registro */}
            <form action="#" className="sign-up-form loginForm" onSubmit={registerUser}>
              <h2 className="title">Registre-se</h2>
              <div className="input-field">
                <CircleUser />
                <Input
                  placeholder="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={readInputData}
                />
              </div>
              <div className="input-field">
                <Mail />
                <Input
                  placeholder="E-mail"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={readInputData}
                />
              </div>
              <div className="input-field">
                <Lock />
                <Input
                  placeholder="Senha"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={readInputData}
                />
              </div>
              <button type="submit" className="btn">Registrar</button>
            </form>
          </div>
        </div>
      )}

      {/* Painéis de navegação */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3 className="loginh3">Novo no WorkStream?</h3>
            <p className="loginp">Caso seja novo no WorkStream, registre-se para conseguir gerenciar de forma eficiente as suas tarefas ou as de sua equipe!</p>
            <button className="btn transparent" onClick={handleSignUpClick}>
              Registre-se
            </button>
          </div>
          <img src={signUpImg} className="image" alt="img1" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3 className="loginh3">Já é um de nós?</h3>
            <p className="loginp">Caso você já possua uma conta no WorkStream, faça o acesso para continuar gerenciando seu trabalho de forma eficiente!</p>
            <button className="btn transparent" onClick={handleSignUpClick}>
              Login
            </button>
          </div>
          <img src={signInImg} className="image" alt="img2" />
        </div>
      </div>
    </div>
  );
}

export default Login;