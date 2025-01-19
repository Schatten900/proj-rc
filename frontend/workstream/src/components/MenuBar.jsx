import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultGroupImg from "../img/defaultGroupImg.png";
import anonimoImg from "../img/default_user.svg"
import "../styles/MenuBar.css";
import Group from "./Group"; 

function MenuBar({ username, groups, level, progress, switchToChatMode, bar, showSidebar, popup, setParticipantsList, setGroupID }) {
    const baseURL = `${window.location.protocol}//${window.location.hostname}:5000`;
    const navigate = useNavigate();
    const [selectedGroup, setSelectedGroup] = useState(null);

    const handleGroupClick = async (group) => {
        setSelectedGroup(group);
        switchToChatMode();
        
        window.groupIdentificator = group.groupId;

        // Buscar participantes do grupo selecionado
        try {
            const response = await fetch(`${baseURL}/groups/get-participants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ groupId: group.groupId }),
            });
            const data = await response.json();
    
            if (response.ok) {
                setParticipantsList(data.groupUsers); // Atualiza a lista de participantes
                setGroupID(group.groupId);            // Vincula ID do grupo 
            } else {
                console.error("Erro ao buscar participantes:", data.error);
            }
        } catch (error) {
            console.error("Erro ao buscar participantes:", error);
        }
    };

    const logoutUser = async () => {
        try {
            await fetch(`${baseURL}/users/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            navigate('/users'); // Voltar para tela de login quando sair
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="sidebar">
            {popup ? (
                <div className="sidebarButtonInactive">
                    <Menu size={36} strokeWidth={2.5} />
                </div>
            ) : (
                <div className="sidebarButton">
                    <Menu size={36} strokeWidth={2.5} onClick={showSidebar} />
                </div>
            )}

            <div className={bar ? "menu active" : "menu"}>
                <div className="closeContainer">
                    <div className="leaveButton">
                        <LogOut size={36} strokeWidth={2} onClick={logoutUser} />
                    </div>
                    <div className="xButton">
                        <X size={36} strokeWidth={2} onClick={showSidebar} />
                    </div>
                </div>
                <div className="profileContainer">
                    <img src={anonimoImg} alt="Profile" className="profilePicture" />
                    <div className="profileContents">
                        <p className="username">{username}</p>
                        <p className="level">Level: {level}</p>
                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
                <div className="division"></div>
                <div className="groupsContainer">
                    <ul className="groupList">
                        {groups.length > 0 ? (
                            groups.map((group) => (
                                <li
                                    key={group.groupId}
                                    className={`groupItem ${selectedGroup === group ? 'selected' : ''}`}
                                    onClick={() => handleGroupClick(group)}
                                >
                                    <Group
                                        image={group.image || defaultGroupImg}
                                        name={group.name}
                                        description={group.description}
                                    />
                                </li>
                            ))
                        ) : (
                            <p>No groups available</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default MenuBar;