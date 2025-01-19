function Message(props) {
    return (
      <div className="flex flex-row justify-start items-center gap-2 w-[100%] h-[100%]">
        <img
          src={props.image}
          alt="imgIcon"
          className="w-[10%] h-[100%] rounded-full"
        />
        <div className="flex flex-col items-start">
          <h1 className="text-left font-medium text-orange-600">{props.name}</h1>
          <h1 className="text-left font-normal text-black">{props.message}</h1>
          {/* Exibição da data da mensagem */}
          <h3 className="text-left font-light text-gray-500">{props.sendDate}</h3>
        </div>
      </div>
    );
  }
  
  export default Message;  