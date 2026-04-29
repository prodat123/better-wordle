import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

import hintImg from "./assets/hint_letter_sprite.png";
import triesImg from "./assets/more_tries_sprite.png";
import defImg from "./assets/definition_sprite.png";
import multImg from "./assets/two_times_sprite.png";
import flashbackImg from "./assets/flashback_sprite.png";
import scholarImg from "./assets/scholar_sprite.png";

export type PowerUpType =
  | "HINT"
  | "TRIES"
  | "DEFINITION"
  | "MULTIPLIER"
  | "REVEAL_GREEN"
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
      icon: defImg,
      color: "text-purple-500",
    },
    {
      id: "MULTIPLIER" as const,
      label: "Double Points",
      desc: "2x points for remaining rounds",
      icon: multImg,
      color: "text-yellow-500",
    },
    {
      id: "REVEAL_GREEN" as const,
      label: "Flashback",
      desc: "Instantly reveal 1 green letter",
      icon: flashbackImg,
      color: "text-orange-500",
    },
    {
      id: "SCHOLAR" as const,
      label: "Scholar",
      desc: "Permanent +50 points per win",
      icon: scholarImg,
      color: "text-indigo-500",
    },
  ];

  // Randomize powerups only on a win
  const displayedPowerUps = useMemo(() => {
    if (!isWin) return [];
    return [...ALL_POWERUPS].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, [isWin]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        /* Pop animation: Starts small and slightly below, then springs up */
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            damping: 15,
            stiffness: 300,
          },
        }}
        className={`bg-white dark:bg-gray-800 w-full max-w-md shadow-2xl p-6 border-2 
        ${isWin ? "border-green-500/50" : "border-red-500/50"}`}
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

          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 mb-6">
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
                {displayedPowerUps.map((p, idx) => (
                  <motion.button
                    key={p.id}
                    /* Stagger the entrance of each power-up button */
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: 0.2 + idx * 0.1 },
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPowerUp(p.id)}
                    className={`cursor-pointer flex items-center p-3 border-2 transition-colors duration-200 ${
                      selectedPowerUp === p.id
                        ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                        : "border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20"
                    }`}
                  >
                    <div
                      className={`text-2xl mr-4 w-10 h-10 flex items-center justify-center ${p.color} bg-white dark:bg-gray-800 shadow-sm`}
                    >
                      <img
                        src={p.icon}
                        style={{ imageRendering: "pixelated" }}
                        alt=""
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-bold dark:text-white text-sm">
                        {p.label}
                      </p>
                      <p className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">
                        {p.desc}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <motion.button
            whileHover={selectedPowerUp || !isWin ? { scale: 1.02 } : {}}
            whileTap={selectedPowerUp || !isWin ? { scale: 0.95 } : {}}
            onClick={() => onNextRound(selectedPowerUp)}
            disabled={isWin && !selectedPowerUp}
            className={`w-full font-bold py-4 text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
              !isWin
                ? "bg-red-600 hover:bg-red-700 text-white"
                : selectedPowerUp
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {!isWin ? (
              <>
                <FontAwesomeIcon icon={faRotateLeft} /> RESTART FROM ROUND 1
              </>
            ) : selectedPowerUp ? (
              "COLLECT & START NEXT ROUND"
            ) : (
              "SELECT A POWER-UP"
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RoundScreen;
