function Task(props){
    return (
        <div 
        className={`flex flex-col justify-start 
        w-[100%] h-[100%] ${props.concluded ? "bg-[#c0e8ef]" : "bg-slate-50"}
        transition hover:scale-105 shadow-lg rounded-xl
        text-pretty px-4 py-1 cursor-pointer`}
        onClick={()=>{
            console.log("clicado");
            props.onClick();
            }}>
            <h1 className="text-orange-600 font-mono font-extrabold text-xl text-center break-words">Tarefa</h1>
            <h1 className="text-black font-medium text-center break-words">{props.description}</h1>
            <h1 className="text-black font-light text-center break-words">Recompensa: {props.reward}</h1>
        </div>
    )
}

export default Task;