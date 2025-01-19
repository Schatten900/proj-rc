import { useState, useEffect, useRef } from "react";
import Input from "../components/Input";
import Message from "./Message";
import anonimoImagem from "../img/default_user.svg";
import "../styles/Chat.css";
import { SendHorizontal } from 'lucide-react';

function Chat() {
  const [userMessage, setUserMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  // Ref para "forçar" a limpeza do <input>
  const inputRef = useRef(null);

  const handleEnterButton = (e) =>{
    if (e.key === "Enter"){sendMessage();}
  }

  // Busca todas as mensagens do grupo
  const getGroupMessages = async () => {
    try {
      const baseURL = `${window.location.protocol}//${window.location.hostname}:5000`;
      const response = await fetch(`${baseURL}/groups/get-messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: window.groupIdentificator }),
      });

      if (response.ok) {
        const data = await response.json();
        const newMessages = data.groupUsers.map((row, index) => ({
          id: index,
          image: anonimoImagem,
          name: row.username,
          message: row.content,
          sendDate: row.sendDate,
        }));
        setMessageList(newMessages);
      } else {
        const errorData = await response.json();
        console.error("Erro ao buscar mensagens:", errorData.error);
      }
    } catch (error) {
      console.error("Erro ao buscar mensagens do grupo:", error);
    }
  };

  // Envia a mensagem para o servidor
  const sendMessage = async () => {
    if (userMessage.trim() === "") return;

    const newMessage = {
      content: userMessage,
      originGroupId: window.groupIdentificator,
      userSenderEmail: window.useremaillogado,
    };

    setUserMessage("");

    try {
      const baseURL = `${window.location.protocol}//${window.location.hostname}:5000`;
      const response = await fetch(`${baseURL}/groups/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        // Recarrega todas as mensagens
        await getGroupMessages();
      } else {
        const errorData = await response.json();
        console.error("Erro ao enviar mensagem:", errorData.error);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  // Ao montar, carrega as mensagens e inicia o polling (2s)
  useEffect(() => {
    getGroupMessages();
    const intervalId = setInterval(getGroupMessages, 2000);

    // limpa o interval ao desmontar
    return () => clearInterval(intervalId);
  }, []);

  // Rolagem automática para o final da lista ao atualizar mensagens
  useEffect(() => {
    const container = document.getElementById("messagesContainer");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messageList]);

  return (
    <div className="h-screen w-full flex flex-col items-center py-6">
      {/* Contêiner de mensagens */}
      <div
        id="messagesContainer"
        className="flex flex-col w-[80%] h-[100%] overflow-y-auto"
      >
        {messageList.map((message) => (
          <div key={message.id} className="gap-y-4 fade-animation">
            <Message
              message={message.message}
              name={message.name}
              image={message.image}
              sendDate={message.sendDate}
            />
          </div>
        ))}
      </div>

      {/* Input + Botão de envio */}
      <div className="w-full flex flex-row justify-center items-center pb-20 pt-10">
        <Input
          ref={inputRef} // passa a ref pro input
          type="text"
          name="userMessage"
          value={userMessage}
          onKeyDown={handleEnterButton}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <SendHorizontal 
        size={35}
        color="gray"
        cursor="pointer"
        onClick={sendMessage}
        />
      </div>
    </div>
  );
}

export default Chat;