import Klasses from "./Klasses";
import Skills from "./Skills";
import Attributes from "./Attributes";

const Character = ({ attributes, updateCharacter, skills, index }) => {
    return (
        <div>
            <h1 style={{ marginTop: 40 }}>Character #{index}</h1>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Attributes
                    attributes={attributes}
                    updateCharacter={updateCharacter}
                />
                <Klasses characterAttributes={attributes} />
                <Skills
                    attributes={attributes}
                    skills={skills}
                    updateCharacter={updateCharacter}
                />
            </div>
        </div>
    );
};

export default Character;
