import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { Edit } from "lucide-react";
import "../styles/PopUp.css";
import anonimoImagem from "../img/default_user.svg";

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

function CreateGroupForm(props) {
  const baseURL = `${window.location.protocol}//${window.location.hostname}:5000`;

  const createGroup = async (e) => {
    e.preventDefault();

    if (!groupInfo.name || !groupInfo.password || !groupInfo.description) {
      showToast("Todos os campos são obrigatórios.", "warn");
      return;
    }

    try {
      console.log("Aaaaa");
      const response = await fetch(`${baseURL}/groups/create-group`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...groupInfo,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        showToast("Grupo criado com sucesso.", "success");
        
        // CHAMAMOS A FUNÇÃO PARA RECARREGAR A LISTA DE GRUPOS
        props.takeGroups(); 

        props.closePopUp(); // Fecha o pop-up após sucesso
      } else {
        showToast(data.error || "Erro ao criar grupo.", "error");
      }
    } catch (error) {
      console.error("Erro ao comunicar com o backend:", error);
      showToast("Erro ao tentar criar grupo. Tente novamente.", "error");
    }
  };

  const [groupInfo, setGroupInfo] = useState({
    image: "",
    name: "",
    password: "",
    description: "",
  });

  const [editImage, setEditImage] = useState(anonimoImagem);

  const changeGroupImage = () => {
    // Lógica para abrir os arquivos e salvar a imagem nova
  };

  const readInput = (e) => {
    const { name, value } = e.target;
    setGroupInfo((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  return (
    <div className="fixed-center">
      <div className="flex flex-col items-center gap-y-4">
        <div className="relative group w-[10%] h-[10%]">
          <img
            src={editImage}
            alt="imgGrupo"
            className="w-full h-full rounded-full cursor-pointer"
          />
          <span
            className="absolute inset-0 flex items-center justify-center 
              bg-black bg-opacity-50 rounded-full text-white opacity-0 
              group-hover:opacity-100 transition-opacity duration-300"
          >
            <Edit
              size={20}
              color="white"
              cursor="pointer"
              onClick={changeGroupImage}
            />
          </span>
        </div>
        <Input
          placeholder="Nome do grupo"
          type="Text"
          name="name"
          value={groupInfo.name}
          onChange={readInput}
        />
        <Input
          placeholder="Senha do grupo"
          type="password"
          name="password"
          value={groupInfo.password}
          onChange={readInput}
        />
        <Input
          placeholder="Descrição do grupo"
          type="text"
          name="description"
          value={groupInfo.description}
          onChange={readInput}
        />
      </div>

      <div className="flex flex-col w-[100%] gap-y-2">
        <Button onClick={createGroup}>Criar</Button>
        <Button onClick={props.closePopUp}>Sair</Button>
      </div>
    </div>
  );
}

export default CreateGroupForm;