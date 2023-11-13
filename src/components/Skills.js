import { produce } from "immer";
import { getModifier } from "../utils/helpers";

const Skills = ({ attributes, skills, updateCharacter }) => {
    const getTotalPoints = () => {
        const intelligence = getAttribute("Intelligence");
        return 10 + 4 * getModifier(intelligence.value);
    };

    const getPointsSpent = () => {
        return skills.reduce((total, skill) => total + skill.value, 0);
    };

    const getAttribute = (attributeName) => {
        return attributes.find((attribute) => attribute.name === attributeName);
    };

    const canIncrement = () => {
        const totalPoints = getTotalPoints();
        const pointsSpent = getPointsSpent();
        if (totalPoints > pointsSpent) {
            return true;
        } else {
            alert(
                "You need more skill points! Upgrade intelligence to get more."
            );
        }
    };

    const handleClick = (name, value) => {
        const updatedSkills = produce(skills, (draftSkills) => {
            const skillIndex = draftSkills.findIndex(
                (skill) => skill.name === name
            );
            draftSkills[skillIndex].value = value;
        });
        updateCharacter({ skills: updatedSkills });
    };

    return (
        <div className="box">
            <h2>Skills</h2>
            <div style={{ marginBottom: 14 }}>
                Total skill points available: {getTotalPoints()}
            </div>
            <div style={{ marginBottom: 14 }}>
                Total skill points spent: {getPointsSpent()}
            </div>
            {skills.map(({ name, attributeModifier, value }) => {
                const attribute = getAttribute(attributeModifier);
                const modifier = getModifier(attribute.value);
                return (
                    <div key={name}>
                        <span>{name}</span>
                        <span style={{ marginRight: 10 }}>: {value}</span>
                        <span>(Modifier: {attributeModifier})</span>
                        <span style={{ marginRight: 10 }}>: {modifier}</span>
                        <button
                            onClick={() => handleClick(name, value - 1)}
                            style={{ marginRight: 2 }}
                        >
                            -
                        </button>
                        <button
                            onClick={() =>
                                canIncrement() && handleClick(name, value + 1)
                            }
                            style={{ marginRight: 10 }}
                        >
                            +
                        </button>
                        <span>Total: {modifier + value}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default Skills;
