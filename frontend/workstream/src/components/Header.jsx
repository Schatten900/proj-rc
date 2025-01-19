import { MessageCircle } from "lucide-react";
import { UserRound } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { Search } from "lucide-react";
import { Menu } from "lucide-react";

function Header(props) {
  return (
    <div
      className="
    w-[100%] h-[8%] bg-[#058f8f]
    flex flex-row justify-between items-center gap-10"
    >
      <div>
        <div className="sidebarButton">
          <Menu size={36} color="white" strokeWidth={2.5} />
        </div>
      </div>

      {/* 
        Apenas exibir esses botões (Chat, Participantes, Tarefas)
        se props.isGroupSelected for true 
      */}
      <div className="flex flex-row gap-x-2">
        {props.isGroupSelected && (
          <>
            <div
              onClick={props.switchToChatMode}
              className="flex flex-col items-center 
            text-white font-medium cursor-pointer
            transition hover:scale-110"
            >
              <MessageCircle size={30} color="white" />
              <h1>Chat</h1>
            </div>

            <div
              onClick={props.switchToParticipantsMode}
              className="flex flex-col items-center 
            text-white font-medium cursor-pointer
            transition hover:scale-110"
            >
              <UserRound size={30} color="white" />
              <h1>Participantes</h1>
            </div>

            <div
              onClick={props.switchToTaskMode}
              className="flex flex-col items-center 
            text-white font-medium cursor-pointer
            transition hover:scale-110"
            >
              <CalendarCheck size={30} color="white" />
              <h1>Tarefas</h1>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-row gap-x-2">
        <div
          className="
            flex flex-col items-center 
            text-white font-medium cursor-pointer
            transition hover:scale-110
          "
        >
          <PlusCircle size={30} color="white" onClick={props.switchCreateForm} />
          <h1>Criar</h1>
        </div>

        <div
          className="
            flex flex-col items-center 
            text-white font-medium cursor-pointer
            transition hover:scale-110
          "
        >
          <Search size={30} color="white" onClick={props.switchSearchForm} />
          <h1>Entrar</h1>
        </div>
      </div>
    </div>
  );
}

export default Header;