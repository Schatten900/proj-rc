function Group(props) {
    const truncateText = (text, maxLength) => {
      return text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };
  
    return (
      <div
        className="w-[100%] h-[100%] rounded-2xl cursor-pointer gap-4 flex flex-row justify-start items-center transition duration-100 hover:bg-slate-200"
      >
        <img src={props.image} alt="imgIcon" className="w-[10%] h-[100%] rounded-full" />
        <div className="flex flex-col">
          <h1 className="font-bold text-pretty text-orange-600 text-left">
            {truncateText(props.name, 16)}
          </h1>
          <h2 className="font-medium text-pretty text-gray-800 text-left">
            {truncateText(props.description, 16)}
          </h2>
        </div>
      </div>
    );
  }
  
  export default Group;  