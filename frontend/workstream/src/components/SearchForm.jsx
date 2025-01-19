import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import "../styles/PopUp.css";

// (1) Copiamos (ou extraímos) a função de toast para este arquivo
function showToast(message, type = "success") {
  let toastContainer = document.querySelector(".toast-container");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
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

function SearchForm(props) {
  const [formData, setFormData] = useState({
    groupName: "",
    groupPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.groupName || !formData.groupPassword) {
      // (2) Mostra toast de aviso em vez de alert
      showToast("Por favor, preencha todos os campos.", "warn");
      return;
    }

    try {
      const baseURL = `${window.location.protocol}//${window.location.hostname}:5000`;
      const response = await fetch(`${baseURL}/groups/enter-group`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // (3) Substitui alert por toast de sucesso
        showToast("Entrou no grupo com sucesso!", "success");
        props.closePopUp();
        props.takeGroups(); 
      } else {
        // (4) Substitui alert por toast de erro
        showToast(data.error || "Erro ao tentar entrar no grupo.", "error");
      }
    } catch (error) {
      console.error("Erro ao comunicar com o backend:", error);
      // (5) Toast de erro genérico
      showToast("Erro ao tentar entrar no grupo. Tente novamente.", "error");
    }
  };

  return (
    <div className="fixed-center">
      <div className="flex flex-col items-center gap-y-4">
        <Input
          placeholder="Nome do grupo"
          type="text"
          name="groupName"
          value={formData.groupName}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Senha do grupo"
          type="password"
          name="groupPassword"
          value={formData.groupPassword}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex flex-col w-[100%] gap-y-2 mt-4">
        <Button onClick={handleSubmit}>Entrar</Button>
        <Button onClick={props.closePopUp}>Sair</Button>
      </div>
    </div>
  );
}

export default SearchForm;