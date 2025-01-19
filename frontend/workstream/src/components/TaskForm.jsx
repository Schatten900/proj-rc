import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import "../styles/PopUp.css";

function showToast(message, type = "success") {
  // ... (código de toast)
}

function TaskForm({ closePopUp, groupID, refreshTasks }) {
  const [taskInfo, setTaskInfo] = useState({
    description: "",
    reward: "",
  });

  const createTask = async (e) => {
    e.preventDefault();
    const baseURL = `${window.location.protocol}//${window.location.hostname}:5000`;

    if (!taskInfo.description || !taskInfo.reward) {
      showToast("Todos os campos são obrigatórios.", "warn");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/tasks/create-task`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: taskInfo.description,
          reward: taskInfo.reward,
          groupID: groupID,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data.error);
        showToast(data.error || "Erro ao criar task.", "error");
        return;
      }

      // Se deu tudo certo:
      setTaskInfo({ description: "", reward: "" });
      showToast(data.message, "success");

      // CHAMAR A FUNÇÃO PARA RECARREGAR A LISTA DE TAREFAS
      refreshTasks();

      closePopUp();
    } catch (error) {
      console.log(error);
      showToast("Erro ao criar task.", "error");
    }
  };

  const readInput = (e) => {
    const { name, value } = e.target;
    setTaskInfo((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  };

  return (
    <div className="fixed-center">
      <div className="flex flex-col items-center gap-y-4">
        {/* Inputs */}
        <Input
          placeholder="Descrição da task"
          type="text"
          name="description"
          value={taskInfo.description}
          onChange={readInput}
        />
        <Input
          placeholder="Recompensa da task"
          type="text"
          name="reward"
          value={taskInfo.reward}
          onChange={readInput}
        />
      </div>

      <div className="flex flex-col w-[100%] gap-y-2">
        <Button onClick={createTask}>Criar</Button>
        <Button onClick={closePopUp}>Sair</Button>
      </div>
    </div>
  );
}

export default TaskForm;