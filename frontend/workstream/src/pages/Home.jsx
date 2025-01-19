import Header from "../components/Header";
import Chat from "../components/Chat";
import MenuBar from "../components/MenuBar";
import { useState, useEffect } from "react";
import Task from "../components/Task";
import "../styles/TasksAnimation.css";
import CreateGroupForm from "../components/CreateGroupForm";
import SearchForm from "../components/SearchForm";
import Group from "../components/Group";
import anonimoIcon from "../img/anonimo.png";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/PopUp.css";
import TaskForm from "../components/TaskForm";
import rightpanelfixed from "../img/rightpanelfixed.png";
import leftpanelfixed from "../img/leftpanelfixed.png";

function Home() {
  const baseURL = `${window.location.protocol}//${window.location.hostname}:5000`;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  //----------------------------------------- Data -------------------------------
  const [username, setUsername] = useState("USER");
  const [useremail, setUserEmail] = useState("EMAIL");
  const [groups, setGroup] = useState([]); // Estado dos grupos
  const [level, setLevel] = useState("");
  const [progress, setProgress] = useState("");
  const [groupID, setGroupID] = useState("");

  //---------------------------------- Session -------------------------------
  useEffect(() => {
    document.title = "WorkStream - Home";

    const checkSession = async () => {
      try {
        const response = await fetch(`${baseURL}/users/check-session`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (data.loggedIn) {
          setIsLoggedIn(true);
          const userResponse = await fetch(`${baseURL}/users/get-username`, {
            method: "GET",
            credentials: "include",
          });
          const userData = await userResponse.json();
          window.useremaillogado = userData.useremail;

          if (userData.username) {
            console.log(userData);
            setUsername(userData.username);
            setProgress(userData.experience);
            setLevel(userData.level);
          } else {
            console.error("Username not found");
          }
        } else {
          navigate("/users");
        }
      } catch (error) {
        console.error("Error checking session:", error);
        navigate("/users");
      }
    };

    checkSession();
    takeGroups();
  }, [navigate]);

  //------------------- Recarregar elementos da barra lateral ----------------
  const refreshUserData = async () => {
    try {
      const userResponse = await fetch(`${baseURL}/users/get-username`, {
        method: "GET",
        credentials: "include",
      });
      const userData = await userResponse.json();

      // Se a requisição for bem-sucedida
      if (userResponse.ok && userData.username) {
        setUsername(userData.username);
        setProgress(userData.experience);
        setLevel(userData.level);
      } else {
        console.error("Não foi possível atualizar os dados do usuário");
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
    }
  };

  //--------------------------------------- Participants -----------------------
  const [participantsList, setParticipantsList] = useState([]);

  // 1) FUNÇÃO PARA CARREGAR PARTICIPANTES DO GRUPO ATUAL
  const takeParticipants = async () => {
    if (!groupID) return; // Se não houver groupID selecionado, não faz nada
    try {
      const response = await fetch(`${baseURL}/groups/get-participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: groupID }),
      });
      const data = await response.json();

      if (response.ok) {
        setParticipantsList(data.groupUsers);
      } else {
        console.error("Erro ao buscar participantes:", data.error);
      }
    } catch (error) {
      console.error("Erro ao buscar participantes:", error);
    }
  };

  //--------------------------------------- Groups -----------------------
  const takeGroups = async () => {
    try {
      const response = await fetch(`${baseURL}/groups/get-groups`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setGroup(data.groups); // Atualiza o estado com os grupos recebidos
      } else {
        console.error("Erro ao buscar grupos:", data.error);
      }
    } catch (error) {
      console.error("Erro ao buscar grupos:", error);
    }
  };

  //-------------------------- Chat, Task and Participants ----------------------------
  const [chatMode, setChatMode] = useState(false);
  const [taskMode, setTaskMode] = useState(false);
  const [isCreateTaskForm, setCreateTaskForm] = useState(false);
  const [participantsMode, setParticipantsMode] = useState(false);
  const [activeSidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!activeSidebar);

  const switchToChatMode = () => {
    setChatMode(true);
    setTaskMode(false);
    setParticipantsMode(false);
  };
  const switchToTaskMode = () => {
    setChatMode(false);
    setTaskMode(true);
    setParticipantsMode(false);
  };

  // 2) SEMPRE QUE CLICAR NO BOTÃO DE PARTICIPANTES, CARREGAR A LISTA
  const switchToParticipantsMode = () => {
    setChatMode(false);
    setTaskMode(false);
    setParticipantsMode(true);

    // CHAMA A FUNÇÃO QUE ATUALIZA OS PARTICIPANTES
    takeParticipants();
  };

  //--------------------------------- Create and Search -------------------------------
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const switchCreateForm = () => {
    setCreateOpen(true);
    setSearchOpen(false);
    setCreateTaskForm(false);
  };

  const switchSearchForm = () => {
    setSearchOpen(true);
    setCreateOpen(false);
    setPasswordForm(false);
    setCreateTaskForm(false);
  };

  const closePopUp = () => {
    setCreateOpen(false);
    setSearchOpen(false);
    setPasswordForm(false);
    setSidebar(false);
    setCreateTaskForm(false);
  };

  const switchCreateTaskForm = () => {
    setCreateTaskForm(true);
    setSearchOpen(false);
    setCreateOpen(false);
    setPasswordForm(false);
  };

  //--------------------------------------- PasswordForm ------------------
  const [passwordOpen, setPasswordForm] = useState(false);

  const openPasswordConfirm = () => {
    setSearchOpen(false);
    setPasswordForm(!passwordOpen);
  };

  //--------------------------------------- Tasks -----------------------
  const [isAdm, setIsAdm] = useState(false);
  const [taskList, setTaskList] = useState([]);

  const checkIfUserIsAdm = async () => {
    try {
      const response = await fetch(`${baseURL}/tasks/check-adm?groupID=${groupID}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data.error);
      }
      console.log(data.position);
      if (data.position !== "Participante") {
        setIsAdm(true);
      }
      console.log("Verificado com sucesso");
    } catch (error) {
      console.log(error);
    }
  };

  const takeTasks = async () => {
    try {
      const response = await fetch(`${baseURL}/tasks/get-tasks?groupID=${groupID}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data.error);
      }
      console.log(data.tasks);
      setTaskList(data.tasks || []);
    } catch (error) {
      console.log("Erro ao buscar tarefas: ", error);
      setTaskList([]);
    }
  };

  const concludedTask = async (taskId, reward) => {
    try {
      const response = await fetch(`${baseURL}/tasks/task-concluded`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskID: taskId, reward }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(data.error);
        return;
      }
      console.log("Tarefa concluída com sucesso");
      refreshUserData()

      // RECARREGAR TAREFAS
      takeTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // checar o adm e carregar as tarefas quando o groupID mudar
  useEffect(() => {
    if (groupID) {
      checkIfUserIsAdm();
      takeTasks();
    }
  }, [groupID]);

  return (
    <div className="w-[100%] h-[100vh] flex flex-col relative">
      <Header
      switchToChatMode={switchToChatMode}
      switchToTaskMode={switchToTaskMode}
      switchSearchForm={switchSearchForm}
      switchCreateForm={switchCreateForm}
      switchToParticipantsMode={switchToParticipantsMode}
      isGroupSelected={!!groupID}
    />

      <div className="flex flex-1 flex-row overflow-hidden">
        {chatMode ? (
          <Chat />
        ) : taskMode ? (
          <div className="flex flex-col items-center w-[100%] h-[100%] overflow-y-auto py-4">
            {isAdm && <Button onClick={switchCreateTaskForm}>Criar Task</Button>}
            {taskList.map((task, index) => (
              <div key={index} className="gap-y-4 py-4 w-[80%] fade-animation">
                <Task
                  description={task.description}
                  reward={task.reward}
                  onClick={() => concludedTask(task.taskId, task.reward)}
                  concluded={task.concluded}
                />
              </div>
            ))}
          </div>
        ) : participantsMode ? (
          <div className="flex flex-col items-center w-[100%] h-[100%] overflow-y-auto p-4">
            {participantsList.map((participant, index) => (
              <div key={index} className="gap-y-4 w-[60%] fade-animation">
                <Group
                  image={participant.profilePicture || anonimoIcon}
                  name={participant.username}
                  description={`Level: ${participant.level}`}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-row w-[100%] h-[100%] overflow-y-hidden justify-center items-center">
              <img className="w-[30%] h-auto" src={leftpanelfixed} alt="..." />
          </div>
        )}
      </div>

      {(createOpen || searchOpen || passwordOpen || activeSidebar || isCreateTaskForm) && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-all duration-300 ease-in-out"
          onClick={closePopUp}
        ></div>
      )}

      <div>
        {createOpen && (
          <CreateGroupForm 
            closePopUp={closePopUp} 
            takeGroups={takeGroups}
          />
        )}
        {searchOpen && (
          <SearchForm
            closePopUp={closePopUp}
            takeGroups={takeGroups}
            openPasswordConfirm={openPasswordConfirm}
          />
        )}
        {passwordOpen && <ConfirmPasswordForm closePopUp={closePopUp} />}
        {isCreateTaskForm && (
          <TaskForm
            closePopUp={closePopUp}
            groupID={groupID}
            refreshTasks={takeTasks}
          />
        )}
      </div>

      <MenuBar
        username={username}
        groups={groups}
        progress={progress}
        level={level}
        switchToChatMode={switchToChatMode}
        bar={activeSidebar}
        showSidebar={showSidebar}
        popup={createOpen || searchOpen || passwordOpen || activeSidebar}
        setParticipantsList={setParticipantsList}
        setGroupID={setGroupID}
      />
    </div>
  );
}

export default Home;