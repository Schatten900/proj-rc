function Button(props){
    return (
        <div>
            <button className="w-[100%] h-[100%] 
            rounded-md shadow cursor-pointer
             bg-[#78a1e9] text-white font-mono font-semibold
             transition duration-300 hover:scale-105"
            onClick={props.onClick}>
                {props.children}
            </button>   
        </div>
    )
}

export default Button;