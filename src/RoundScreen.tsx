import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faMagnifyingGlass,
  faPlus,
  faBolt,
  faLightbulb,
  faGraduationCap,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

import hintImg from "./assets/hint_letter_sprite.png";
import triesImg from "./assets/more_tries_sprite.png";
// import defImg from "./assets/definition_icon.png";
import multImg from "./assets/two_times_sprite.png";
// import yellowImg from "./assets/flashback_icon.png";
// import scholarImg from "./assets/scholar_icon.png";

export type PowerUpType =
  | "HINT"
  | "TRIES"
  | "DEFINITION"
  | "MULTIPLIER"
  | "REVEAL_YELLOW"
  | "SCHOLAR"
  | null;

interface RoundScreenProps {
  isWin: boolean;
  solution: string;
  score: number;
  scoreAddition: number;
  onNextRound: (powerUp: PowerUpType) => void;
}

const RoundScreen: React.FC<RoundScreenProps> = ({
  isWin,
  solution,
  score,
  scoreAddition,
  onNextRound,
}) => {
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUpType>(null);

  const ALL_POWERUPS = [
    {
      id: "HINT" as const,
      label: "Hint Letter",
      desc: "Reveal a correct letter at start",
      icon: hintImg,
      color: "text-blue-500",
    },
    {
      id: "TRIES" as const,
      label: "More Tries",
      desc: "+1 extra row next round",
      icon: triesImg,
      color: "text-green-500",
    },
    {
      id: "DEFINITION" as const,
      label: "Definition",
      desc: "Show word definition",
      icon: hintImg,
      color: "text-purple-500",
    },
    {
      id: "MULTIPLIER" as const,
      label: "Double Time",
      desc: "2x points for remaining rounds",
      icon: multImg,
      color: "text-yellow-500",
    },
    {
      id: "REVEAL_YELLOW" as const,
      label: "Flashback",
      desc: "Instantly reveal 1 yellow letter",
      icon: hintImg,
      color: "text-orange-500",
    },
    {
      id: "SCHOLAR" as const,
      label: "Scholar",
      desc: "Permanent +50 points per win",
      icon: hintImg,
      color: "text-indigo-500",
    },
  ];

  // Randomize powerups only on a win
  const displayedPowerUps = useMemo(() => {
    if (!isWin) return [];
    return [...ALL_POWERUPS].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [isWin]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div
        className={`bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 border-2 ${isWin ? "border-green-500/50" : "border-red-500/50"}`}
      >
        <div className="text-center">
          <h2
            className={`text-3xl font-black mb-2 ${isWin ? "text-green-500" : "text-red-500"}`}
          >
            {isWin ? "ROUND CLEARED" : "ROUND FAILED"}
          </h2>

          <p className="dark:text-gray-300 text-sm mb-4">
            The correct word was:{" "}
            <span className="font-bold text-black dark:text-white uppercase tracking-widest">
              {solution}
            </span>
          </p>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6">
            <p className="text-4xl font-black text-green-500">
              +{isWin ? scoreAddition : 0} <span className="text-sm">PTS</span>
            </p>
            <p className="text-sm font-semibold dark:text-gray-400">
              Current Total: {score}
            </p>
          </div>

          {isWin && (
            <div className="text-left mb-6">
              <p className="text-xs font-bold text-gray-500 text-center uppercase mb-3 tracking-widest">
                Choose your Advantage
              </p>
              <div className="grid gap-3">
                {displayedPowerUps.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPowerUp(p.id)}
                    className={`flex items-center p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedPowerUp === p.id
                        ? "border-green-500 bg-green-50 dark:bg-green-900/30 scale-[1.02]"
                        : "border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-900/20"
                    }`}
                  >
                    <div
                      className={`text-2xl mr-4 w-10 h-10 flex items-center justify-center rounded-lg ${p.color} bg-white dark:bg-gray-800 shadow-sm`}
                    >
                      <img src={p.icon} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold dark:text-white text-sm">
                        {p.label}
                      </p>
                      <p className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">
                        {p.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => onNextRound(selectedPowerUp)}
            disabled={isWin && !selectedPowerUp}
            className={`w-full font-bold py-4 rounded-xl text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
              !isWin
                ? "bg-red-600 hover:bg-red-700 text-white"
                : selectedPowerUp
                  ? "bg-green-600 hover:bg-green-700 text-white translate-y-0"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed translate-y-1 shadow-none"
            }`}
          >
            {!isWin ? (
              <>
                <FontAwesomeIcon icon={faRotateLeft} />
                RESTART FROM ROUND 1
              </>
            ) : selectedPowerUp ? (
              "COLLECT & START NEXT ROUND"
            ) : (
              "SELECT A POWER-UP"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoundScreen;
