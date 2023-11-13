import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

import "./App.css";
import Character from "./components/Character";
import { API_URL, ATTRIBUTE_LIST, SKILL_LIST } from "./consts";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Select, { SelectChangeEvent } from '@mui/material/Select';
function App() {
    const [characters, updateCharacters] = useImmer([]);
    const [rankingDic, updateRankingDic] = useState({});
    const [selectedSkill, setSelectedSkill] = useState();
    const [rolledStatus, setRolledStatus] = useState({});

    const [dc, setDc] = useState();
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

    useEffect(() => {
        if (characters.length !== 0) {
            for (let i = 0; i < characters.length; i++) {
                const skills =  characters[i].skills
                for (let skill of skills) {
                    const skillName = skill.name
                    const skillVal = skill.value
                    if (skillName in rankingDic) {
                        const storedVal = rankingDic[skillName]["skillVal"]
                        if (skillVal > storedVal) {
                            rankingDic[skillName] = {
                                characterNum: i,
                                skillVal
                            }
                        }
                    } else {
                        rankingDic[skillName] = {
                            characterNum: i,
                            skillVal
                        }
                    }
                }
            }
        }
        updateRankingDic(rankingDic)
    }, [characters]);


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

    const handleSelectedSkillChange = (event) => {
        const newSelectedSkill = event.target.value;
        setSelectedSkill(newSelectedSkill)
    };

    const roll = () => {
        const randomNumber = Math.floor(Math.random() * 20) + 1;
        const dic = rankingDic[selectedSkill]
        const character = dic["characterNum"]
        const skillVal = dic["skillVal"]
        const isSuccess = skillVal + randomNumber >= dc
        setRolledStatus({
            isSuccess,
            character,
            selectedSkill,
            skillVal,
            randomNumber,
            dc
        })
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>React Coding Exercise</h1>
            </header>
            <section className="App-section">
                <section className="checkList">
                    {
                        Object.keys(rolledStatus).length !== 0
                            ?
                            <Stack direction = "column">
                                <h1 style={{ marginTop: 40 }}>Chosen Character For This Skill: Character Num {rolledStatus.character}</h1>
                                <h10>Skill: {rolledStatus.selectedSkill} : {rolledStatus.skillVal}</h10>
                                <h10>You rolled: {rolledStatus.randomNumber} </h10>
                                <h10>The DC was: {rolledStatus.dc} </h10>
                                <h10 style={{ marginBottom: 40 }}>Result: {rolledStatus.isSuccess ? "Success" : "Failure"} </h10>
                            </Stack>
                            :
                            null
                    }
                    <Stack direction="row" spacing={2}  sx={{ justifyContent: 'center', marginTop:"20px" }}>
                        <FormControl sx={{ width: '300px' }}>
                            <InputLabel id="demo-simple-select-label" style={{ color: 'white' }}>Selected Skill</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedSkill}
                                label="Skill"
                                onChange={handleSelectedSkillChange}
                                style={{ color: 'white' }}
                            >
                                {Object.keys(rankingDic).map((key) => (
                                    <MenuItem key={key} value={key} >
                                        {key}
                                    </MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { width: '25ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                id="outlined-controlled"
                                label="DC Value (Input numbers only)"
                                value={dc}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const newValue = event.target.value.replace(/\D/g, '');
                                    setDc(newValue);
                                }}
                                InputLabelProps={{
                                    sx: {
                                        color: 'white',
                                    },
                                }}
                                InputProps={{
                                    sx: {
                                        color: 'white',
                                    },
                                }}
                            />

                        </Box>
                        <Button
                            variant="contained"
                            href="#contained-buttons"
                            onClick={() => {
                                // Call your function here
                                roll();
                            }}>
                            Roll
                        </Button>
                    </Stack>

                </section>
                <></>
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
