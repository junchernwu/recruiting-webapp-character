import { useEffect } from "react";
import { useImmer } from "use-immer";

import "./App.css";
import Character from "./components/Character";
import { API_URL, ATTRIBUTE_LIST, SKILL_LIST } from "./consts";

function App() {
    const [characters, updateCharacters] = useImmer([]);

    useEffect(() => {
        if (characters.length === 0) {
            fetch(API_URL)
                .then((response) => response.json())
                .then((response) => {
                    const fetchedCharacters = response.body;
                    updateCharacters((draft) => (draft = fetchedCharacters));
                })
                .catch(() => {
                    alert("Something went wrong!");
                });
        }
    }, []);

    const handleAddCharacter = () => {
        const newCharacter = {
            attributes: ATTRIBUTE_LIST.map((name) => ({
                name,
                value: 0,
            })),
            skills: SKILL_LIST.map((skill) => ({ ...skill, value: 0 })),
        };
        updateCharacters((draft) => {
            draft.push(newCharacter);
        });
    };

    const updateCharacter = (characterIndex, newCharacter) => {
        updateCharacters((draft) => {
            draft[characterIndex] = {
                ...draft[characterIndex],
                ...newCharacter,
            };
        });
    };

    const saveAllCharacters = () => {
        fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(characters),
        })
            .then(() => {
                alert("Successfully saved the Characters");
            })
            .catch(() => {
                alert("An error occured while saving the Characters");
            });
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>React Coding Exercise</h1>
            </header>
            <section className="App-section">
                {characters.map((character, index) => (
                    <Character
                        key={index}
                        index={index + 1}
                        attributes={character.attributes}
                        updateCharacter={(character) =>
                            updateCharacter(index, character)
                        }
                        skills={character.skills}
                    />
                ))}
                <div style={{ margin: "20px 0px 100px 0px" }}>
                    <button
                        onClick={handleAddCharacter}
                        style={{ marginRight: 20 }}
                    >
                        Add New Character
                    </button>
                    <button onClick={saveAllCharacters}>
                        Save all Characters
                    </button>
                </div>
            </section>
        </div>
    );
}

export default App;
