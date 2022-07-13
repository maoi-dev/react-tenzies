import React from "react";
import Die from "./components/Die";
import { nanoid } from 'nanoid';
import { useStopwatch } from 'react-timer-hook';
import Confetti from 'react-confetti';

export default function App() {
    const [tenzies, setTenzies] = React.useState(false);
    const [dice, setDice] = React.useState(allNewDice());
    const [rolls, setRolls] = React.useState(0);
    const [time, setTime] = React.useState(0);
    const [start, setStart] = React.useState(false);
    
    React.useEffect(() => {
        let interval = null; 
        if(start) { 
            interval = setInterval(() => { 
                setTime(prevTime => prevTime + 10) 
            }, 10) 
        } else { 
            clearInterval(interval); 
        } 

        return () => clearInterval(interval) 
    }, [start]) 
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld);
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if(allSameValue && allHeld) {
            setTenzies(true);
            setStart(false);
        } else {
            setTenzies(false);
        }
    }, [dice]);

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        };
    };

    function allNewDice() {
        const newDice = [];
        for (let i = 0; i < 10; i++) {
            newDice.push({
                value: Math.ceil(Math.random() * 6), 
                isHeld: false,
                id: nanoid()
            });
        };
        return newDice;
    };

    function rollDice() {
        if(!tenzies){
            setStart(true);
            setRolls(prevRolls => prevRolls + 1);
            setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
            }));
        } else {
            setRolls(0);
            setTime(0);
            setDice(allNewDice());
        }
    };

    function holdDice(id) {
        setStart(true);
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die;
        }));
    }

    const diceElements = dice?.map(die => <Die key={die.id} id={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />);

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="game-title">Tenzies</h1>
            <p className="game-description">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="stats-container">
                <div className="stats-line">Rolls :<span className="stats rolls">{rolls}</span></div>
                <div className="stats-line">Time : 
                    <div className="stats time"> 
                        <div>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}</div> 
                        <span>:</span>
                        <div>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</div> 
                        <span>:</span>
                        <div>{("0" + (time / 10) % 1000).slice(-2)}</div> 
                    </div>
                </div>
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className="roll-button" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        </main>
    );
};