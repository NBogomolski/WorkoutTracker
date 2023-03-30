import React, { useState } from "react";

function DropdownList(props) {
    const [selectedOption, setSelectedOption] = useState(props.options[0]);

    function handleOptionChange(event) {
        setSelectedOption(event.target.value);
    }

    return (
        <div>
            <label htmlFor={props.id}>{props.label}</label>
            <select
                id={props.id}
                value={selectedOption}
                onChange={handleOptionChange}
            >
                {props.options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default DropdownList;
