import { useState, useEffect, useCallback, useMemo } from "react";
import "./index.css";
import type { PowerUpType } from "./RoundScreen";
import RoundScreen from "./RoundScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackspace,
  faBolt,
  faGraduationCap,
  faQuestion,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";

import logo from "./assets/logo.png";

import { supabase } from "./supabase";
import Leaderboard from "./Leaderboard";

type Status =
  | ""
  | "bg-green-600 border-green-600 text-white"
  | "bg-yellow-500 border-yellow-500 text-white"
  | "bg-gray-400 border-gray-400 text-white";

type PowerUpInventory = {
  HINT: number;
  TRIES: number;
  DEFINITION: boolean;
  MULTIPLIER: number;
  SCHOLAR: number;
};

interface Level {
  id: number;
  name: string;
  wordLength: number;
  baseRows: number;
  quirk: string;
}

const LEVELS = [
  {
    id: 1,
    name: "Freshman",
    wordLength: 5,
    baseRows: 6,
    quirk: "The classic experience. 6 tries.",
  },
  {
    id: 2,
    name: "Sophomore",
    wordLength: 5,
    baseRows: 5,
    quirk: "Tightening up: Only 5 tries.",
  },
  {
    id: 3,
    name: "Senior",
    wordLength: 6,
    baseRows: 5,
    quirk: "Longer words, fewer chances.",
  },
  {
    id: 4,
    name: "Graduate",
    wordLength: 5,
    baseRows: 4,
    quirk: "Speed round: 5 letters, 4 tries.",
  },
  {
    id: 5,
    name: "Dean",
    wordLength: 5,
    baseRows: 3,
    quirk: "The 'Triple Threat': Only 3 tries.",
  },
  {
    id: 6,
    name: "Chancellor",
    wordLength: 6,
    baseRows: 3,
    quirk: "Final Exam: 6 letters, 3 tries. Good luck.",
  },
];

const COUNTRIES = [
  { code: "AF", name: "Afghanistan" },
  { code: "AX", name: "Aland Islands" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BV", name: "Bouvet Island" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cape Verde" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CX", name: "Christmas Island" },
  { code: "CC", name: "Cocos (Keeling) Islands" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo, Democratic Republic" },
  { code: "CK", name: "Cook Islands" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Cote D'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "ET", name: "Ethiopia" },
  { code: "FK", name: "Falkland Islands" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "TF", name: "French Southern Territories" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GG", name: "Guernsey" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HM", name: "Heard Island and Mcdonald Islands" },
  { code: "VA", name: "Holy See" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IM", name: "Isle of Man" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JE", name: "Jersey" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "Korea, North" },
  { code: "KR", name: "Korea, South" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Lao" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MK", name: "Macedonia" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MS", name: "Montserrat" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NU", name: "Niue" },
  { code: "NF", name: "Norfolk Island" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestinian Territory" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PN", name: "Pitcairn" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "RE", name: "Reunion" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russian Federation" },
  { code: "RW", name: "Rwanda" },
  { code: "BL", name: "Saint Barthelemy" },
  { code: "SH", name: "Saint Helena" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "MF", name: "Saint Martin" },
  { code: "PM", name: "Saint Pierre and Miquelon" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "GS", name: "South Georgia" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SJ", name: "Svalbard and Jan Mayen" },
  { code: "SZ", name: "Swaziland" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syrian Arab Republic" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TK", name: "Tokelau" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TC", name: "Turks and Caicos Islands" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UM", name: "United States Minor Outlying Islands" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Viet Nam" },
  { code: "VG", name: "Virgin Islands, British" },
  { code: "VI", name: "Virgin Islands, U.S." },
  { code: "WF", name: "Wallis and Futuna" },
  { code: "EH", name: "Western Sahara" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

const shuffleLevels = <T,>(levels: T[]): T[] => {
  if (levels.length === 0) return [];

  const firstLevel = levels[0];

  const remainingLevels = [...levels.slice(1)];

  for (let i = remainingLevels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingLevels[i], remainingLevels[j]] = [
      remainingLevels[j],
      remainingLevels[i],
    ];
  }

  return [firstLevel, ...remainingLevels];
};

function App() {
  const [activeLevels, setActiveLevels] = useState<Level[]>(() =>
    shuffleLevels(LEVELS),
  );
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = activeLevels[levelIndex];
  const [solution, setSolution] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>(() =>
    Array(activeLevels[0].baseRows * activeLevels[0].wordLength).fill(""),
  );
  const [statuses, setStatuses] = useState<Status[]>(() =>
    Array(activeLevels[0].baseRows * activeLevels[0].wordLength).fill(""),
  );
  const [givingPoints, setGivingPoints] = useState<number[]>([]);

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [animatingRow, setAnimatingRow] = useState<number | null>(null);
  const [showFloatScore, setShowFloatScore] = useState<number | null>(null);
  const [scoreAddition, setScoreAddition] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [definition, setDefinition] = useState<string>("");
  const [totalRows, setTotalRows] = useState<number>(activeLevels[0].baseRows);
  const [inventory, setInventory] = useState<PowerUpInventory>({
    HINT: 0,
    TRIES: 0,
    DEFINITION: false,
    MULTIPLIER: 1,
    SCHOLAR: 0,
  });
  const [lastTypedIdx, setLastTypedIdx] = useState<number | null>(null);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [isCampaignFinished, setIsCampaignFinished] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("US");

  async function generateSignature(name: string, score: number) {
    const secretSalt = "YOUR_SUPER_SECRET_REALLY_LONG_KEY_2026";
    const msgUint8 = new TextEncoder().encode(name + score + secretSalt);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function hashPassword(password: string) {
    const msgUint8 = new TextEncoder().encode(password + "USER_PASSWORD_SALT");
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const saveHighScore = async () => {
    const cleanName = userName.trim().toUpperCase();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanPassword) return alert("Enter name and password!");

    setIsSaving(true);
    try {
      const signature = await generateSignature(cleanName, score);
      const pHash = await hashPassword(cleanPassword);

      const { error } = await supabase.from("highscores").upsert(
        {
          name: cleanName,
          score: score,
          signature: signature,
          password_hash: pHash,
          country: selectedCountry,
        },
        { onConflict: "name" },
      );

      if (error) {
        throw new Error(
          "Could not save. Check your password or use a different name.",
        );
      }

      alert("Success! Highscore updated.");
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getNewWord = useCallback(
    async (lIndex: number, inv: PowerUpInventory, justAdded?: PowerUpType) => {
      const level = activeLevels[lIndex];
      const pattern = "?".repeat(level.wordLength);

      // md=f adds the frequency information to the response
      const res = await fetch(
        `https://api.datamuse.com/words?sp=${pattern}&md=df&max=1000`,
      );
      const data = await res.json();

      const valid = data
        .filter((w: any) => /^[a-zA-Z]+$/.test(w.word) && w.defs)
        .map((w: any) => {
          // Extract frequency from tags (format is "f:12.345")
          const fTag = w.tags?.find((t: string) => t.startsWith("f:"));
          const frequency = fTag ? parseFloat(fTag.split(":")[1]) : 0;
          return { ...w, frequency };
        })
        // Sort by most used words first
        .sort((a: any, b: any) => b.frequency - a.frequency)
        // Only keep the top 200 most common words to choose from
        .slice(0, 200);

      if (valid.length === 0) return;

      const selected = valid[Math.floor(Math.random() * valid.length)];
      const word = selected.word.toUpperCase();

      setSolution(word);
      setDefinition(selected.defs ? selected.defs[0] : "No definition found.");

      const hintCount = inv.HINT;

      if (hintCount > 0) {
        const revealed = Math.min(hintCount, level.wordLength - 1);
        setGuesses((prev) => {
          const next = [...prev];
          for (let i = 0; i < revealed; i++) next[i] = word[i];
          return next;
        });
        setCurrentIdx(revealed);
      }

      if (justAdded === "REVEAL_GREEN") {
        setTimeout(() => {
          const minIndex = inv.HINT;
          const maxIndex = level.wordLength - 1;
          if (maxIndex >= minIndex) {
            const randomIndex =
              Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;
            setStatuses((prev) => {
              const next = [...prev];
              next[randomIndex] = "bg-green-600 border-green-600 text-white";
              return next;
            });
            setGuesses((prev) => {
              const next = [...prev];
              next[randomIndex] = word[randomIndex];
              return next;
            });
          }
        }, 100);
      }
    },
    [],
  );

  useEffect(() => {
    getNewWord(0, inventory);
  }, []);

  const keyStatuses = useMemo(() => {
    const map: Record<string, string> = {};
    guesses.forEach((char, i) => {
      if (!char || !statuses[i]) return;
      const status = statuses[i];
      if (status.includes("bg-green-600"))
        map[char] = "bg-green-600 opacity-100";
      else if (
        status.includes("bg-yellow-500") &&
        map[char] !== "bg-green-600 opacity-100"
      )
        map[char] = "bg-yellow-500 opacity-100";
      else if (status.includes("bg-gray-400") && !map[char])
        map[char] = "bg-gray-300 opacity-40 line-through";
    });
    return map;
  }, [guesses, statuses]);

  const checkGuess = useCallback(async () => {
    const len = currentLevel.wordLength;
    const currentRow = Math.floor(currentIdx / currentLevel.wordLength) - 1;
    const rowStart = currentIdx - len;
    const currentGuess = guesses.slice(rowStart, currentIdx).join("");
    const newStatuses = [...statuses];
    const solutionArray: (string | null)[] = solution.split("");
    const guessArray = currentGuess.split("");
    const rowStatuses: Status[] = Array(len).fill(
      "bg-gray-400 border-gray-400 text-white",
    );

    setAnimatingRow(currentRow);

    guessArray.forEach((char, i) => {
      if (char === solutionArray[i]) {
        rowStatuses[i] = "bg-green-600 border-green-600 text-white";
        solutionArray[i] = null;
      }
    });

    guessArray.forEach((char, i) => {
      if (
        rowStatuses[i] !== "bg-green-600 border-green-600 text-white" &&
        solutionArray.includes(char)
      ) {
        rowStatuses[i] = "bg-yellow-500 border-yellow-500 text-white";
        solutionArray[solutionArray.indexOf(char!)] = null;
      }
    });

    rowStatuses.forEach((status, i) => {
      newStatuses[rowStart + i] = status;
    });
    setStatuses(newStatuses);

    if (currentGuess === solution) {
      const currentRow = Math.floor(currentIdx / len) - 1;
      const remainingTries = totalRows - (currentRow + 1);
      const pointsPerRow = (100 + inventory.SCHOLAR) * inventory.MULTIPLIER;
      const addedPoints = remainingTries * pointsPerRow;

      // 1. Wait for the initial winning row to finish flipping
      // (wordLength * 400ms stagger + 500ms for the flip animation itself)
      await new Promise((res) => setTimeout(res, len * 400 + 500));

      // 2. Cascade through remaining rows
      for (let r = currentRow + 1; r < totalRows; r++) {
        // Highlight the row and show the score
        setGivingPoints((prev) => [...prev, r]);
        setShowFloatScore(r);

        // Play a sound effect here if you have one!

        // Briefly show the score then clear it
        setTimeout(() => setShowFloatScore(null), 2500);

        // Stagger between each point-giving row
        await new Promise((res) => setTimeout(res, 400));
      }

      setScoreAddition(addedPoints);
      setScore((prev) => prev + addedPoints);
      setIsWin(true);

      const isLastRound = levelIndex === activeLevels.length - 1;
      if (isLastRound) {
        setIsCampaignFinished(true);
      } else {
        setTimeout(() => setGameOver(true), 1200);
      }
    } else if (currentIdx === totalRows * len) {
      setIsWin(false);
      setGameOver(true);
    }

    setTimeout(
      () => {
        setAnimatingRow(null);
      },
      currentLevel.wordLength * 400 + 900,
    );
  }, [
    currentIdx,
    guesses,
    solution,
    statuses,
    totalRows,
    currentLevel,
    inventory,
  ]);

  const onKeyPress = useCallback(
    async (key: string) => {
      if (gameOver || isCampaignFinished) return;
      const normalizedKey = key.toUpperCase();
      const len = currentLevel.wordLength;

      if (normalizedKey === "ENTER") {
        const isRowFull =
          currentIdx > 0 &&
          currentIdx % len === 0 &&
          statuses[currentIdx - 1] === "";

        if (isRowFull) {
          const startIdx = currentIdx - len;
          const wordAttempt = guesses
            .slice(startIdx, currentIdx)
            .join("")
            .toLowerCase();

          try {
            const res = await fetch(
              `https://api.datamuse.com/words?sp=${wordAttempt}&max=1`,
            );
            const data = await res.json();

            // Datamuse returns an empty array [] if the word isn't found
            // We also verify the first result matches exactly to be safe
            const isValid =
              data.length > 0 && data[0].word.toLowerCase() === wordAttempt;

            if (!isValid) {
              setShakeRow(Math.floor((currentIdx - 1) / len));
              setToast("Not in word list");
              setTimeout(() => {
                setShakeRow(null);
                setToast(null);
              }, 1500);
              return;
            }

            checkGuess();
          } catch (err) {
            checkGuess(); // API fallback
          }
        }
      } else if (normalizedKey === "DEL" || normalizedKey === "BACKSPACE") {
        setLastTypedIdx(null);
        setCurrentIdx((prev) => {
          const isStartOfRow =
            prev % len === 0 && (prev === 0 || statuses[prev - 1] !== "");
          if (prev > 0 && !isStartOfRow) {
            const nextIdx = prev - 1;
            setGuesses((g) => {
              const n = [...g];
              n[nextIdx] = "";
              return n;
            });
            return nextIdx;
          }
          return prev;
        });
      } else if (/^[A-Z]$/.test(normalizedKey)) {
        const isEndOfRow =
          currentIdx > 0 &&
          currentIdx % len === 0 &&
          statuses[currentIdx - 1] === "";

        if (currentIdx < totalRows * len && !isEndOfRow) {
          // We set it to null first, then the index, to ensure React re-triggers the animation class
          setLastTypedIdx(null);
          setTimeout(() => setLastTypedIdx(currentIdx), 0);

          setGuesses((prev) => {
            const next = [...prev];
            next[currentIdx] = normalizedKey;
            return next;
          });
          setCurrentIdx((prev) => prev + 1);
        }
      }
    },
    [
      currentIdx,
      gameOver,
      statuses,
      guesses,
      checkGuess,
      totalRows,
      currentLevel,
      isCampaignFinished,
    ],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => onKeyPress(e.key);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onKeyPress]);

  const resetGame = (newPowerUp: PowerUpType) => {
    setGivingPoints([]);

    if (!isWin) {
      const initialInventory = {
        HINT: 0,
        TRIES: 0,
        DEFINITION: false,
        MULTIPLIER: 1,
        SCHOLAR: 0,
      };

      const newPath = shuffleLevels(LEVELS);
      setActiveLevels(newPath);
      const firstLevel = newPath[0];
      setLevelIndex(0);
      setInventory(initialInventory);
      setScore(0);
      setTotalRows(firstLevel.baseRows);
      setGuesses(Array(firstLevel.baseRows * firstLevel.wordLength).fill(""));
      setStatuses(Array(firstLevel.baseRows * firstLevel.wordLength).fill(""));
      setCurrentIdx(0);
      setGameOver(false);
      setIsWin(false);
      setAnimatingRow(null);
      getNewWord(0, initialInventory);
      return;
    }

    if (levelIndex === LEVELS.length - 1) {
      setIsCampaignFinished(true);
      setGameOver(false);
      return;
    }

    const nextIdx = levelIndex + 1;
    const nextLevel = activeLevels[nextIdx];
    const updatedInventory = {
      HINT: newPowerUp === "HINT" ? inventory.HINT + 1 : inventory.HINT,
      TRIES: newPowerUp === "TRIES" ? inventory.TRIES + 1 : inventory.TRIES,
      DEFINITION: newPowerUp === "DEFINITION" ? true : inventory.DEFINITION,
      MULTIPLIER:
        newPowerUp === "MULTIPLIER"
          ? inventory.MULTIPLIER * 2
          : inventory.MULTIPLIER,
      SCHOLAR:
        newPowerUp === "SCHOLAR" ? inventory.SCHOLAR + 50 : inventory.SCHOLAR,
    };

    const newRowMax = nextLevel.baseRows + updatedInventory.TRIES;
    setLevelIndex(nextIdx);
    setInventory(updatedInventory);
    setTotalRows(newRowMax);
    setGuesses(Array(newRowMax * nextLevel.wordLength).fill(""));
    setStatuses(Array(newRowMax * nextLevel.wordLength).fill(""));
    setCurrentIdx(0);
    setGameOver(false);
    setIsWin(false);
    setAnimatingRow(null);
    getNewWord(nextIdx, updatedInventory, newPowerUp);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen max-h-screen overflow-hidden bg-white dark:bg-gray-900">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-gray-800 text-white px-4 py-2 font-bold shadow-xl animate-toast">
          {toast}
        </div>
      )}

      <header className="flex flex-col items-center shrink-0 pt-2">
        <img
          src={logo}
          className="w-12 h-12 md:w-16 md:h-16 mb-1"
          style={{ imageRendering: "pixelated" }}
        />

        <div className="text-center mb-1">
          <span className="uppercase font-semibold dark:text-gray-400">
            Round {levelIndex + 1} / 6
          </span>
        </div>

        <h3 className="text-xl font-bold dark:text-white">Score: {score}</h3>

        {inventory.HINT > 0 && (
          <span>
            <FontAwesomeIcon className="text-blue-500" icon={faQuestion} />{" "}
            {inventory.HINT}
          </span>
        )}
        {inventory.TRIES > 0 && (
          <span>
            <FontAwesomeIcon className="text-green-600" icon={faTableCells} />{" "}
            {inventory.TRIES}
          </span>
        )}
        {inventory.MULTIPLIER > 1 && (
          <span>
            <FontAwesomeIcon
              className="text-yellow-500 animate-pulse"
              icon={faBolt}
            />{" "}
            {inventory.MULTIPLIER}X
          </span>
        )}
        {inventory.SCHOLAR > 0 && (
          <span>
            <FontAwesomeIcon
              className="text-indigo-500"
              icon={faGraduationCap}
            />{" "}
            +{inventory.SCHOLAR}
          </span>
        )}
      </header>

      {solution}

      {inventory.DEFINITION && !gameOver && (
        <div className="max-w-sm mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 text-sm italic dark:text-green-200 font-sans">
          <strong>Definition:</strong> {definition.replace(/^.\t/, "")}
        </div>
      )}

      <main className="flex-1 w-full flex items-center justify-center overflow-hidden min-h-0 py-2 px-4">
        <div
          className="grid gap-1 w-full mx-auto"
          style={{
            gridTemplateColumns: `repeat(${currentLevel.wordLength}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${totalRows}, minmax(0, 1fr))`,
            maxWidth: `min(100%, ${totalRows * 7}vh)`,
            /* Maintain the shape of the grid regardless of container size */
            aspectRatio: `${currentLevel.wordLength} / ${totalRows}`,
          }}
        >
          {guesses.map((char, i) => {
            const rowIdx = Math.floor(i / currentLevel.wordLength);
            const colIdx = i % currentLevel.wordLength;
            const isPop = i === lastTypedIdx;
            const isShake = rowIdx === shakeRow;
            const isRevealing = animatingRow === rowIdx;
            const isPointRow = givingPoints.includes(rowIdx);

            return (
              <div
                key={i}
                style={{
                  animationDelay: isRevealing ? `${colIdx * 400}ms` : "0ms",
                  transitionDelay: isRevealing ? `${colIdx * 400}ms` : "0ms",
                }}
                className={`relative aspect-square text-black dark:text-white border-2 flex items-center justify-center font-bold uppercase transition-all duration-500 sm:text-4xl
            ${isPop ? "animate-pop" : ""}
            ${isShake ? "animate-shake" : ""}
            ${isRevealing ? "animate-flip reveal-color" : ""}
            ${
              isPointRow
                ? "bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                : statuses[i] ||
                  (char
                    ? "border-black dark:border-white"
                    : "border-gray-300 dark:border-gray-600")
            }
          `}
              >
                {char}

                {showFloatScore === rowIdx &&
                  colIdx === Math.floor(currentLevel.wordLength / 2) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <span
                        className="text-green-500 font-black text-3xl animate-float-score drop-shadow-md"
                        style={{ WebkitTextStroke: "1px rgba(0,0,0,0.2)" }}
                      >
                        +
                        {(100 + inventory.SCHOLAR) *
                          (inventory.MULTIPLIER || 1)}
                      </span>
                    </div>
                  )}
              </div>
            );
          })}
        </div>

        {gameOver && !isCampaignFinished && (
          <RoundScreen
            isWin={isWin}
            solution={solution}
            score={score}
            scoreAddition={scoreAddition}
            onNextRound={resetGame}
          />
        )}

        {isCampaignFinished && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-500">
              <Leaderboard currentUser={userName} currentScore={score} />

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-3 border-2 border-gray-500 dark:bg-gray-700 dark:text-white"
                  value={userName}
                  onChange={(e) =>
                    setUserName(e.target.value.toUpperCase().slice(0, 10))
                  }
                />
                <input
                  type="password"
                  placeholder="Enter Password (to save or overwrite)"
                  className="w-full p-3 border-2 border-gray-500 dark:bg-gray-700 dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <select
                  className="w-full p-3 border-2 border-gray-500 dark:bg-gray-700 dark:text-white cursor-pointer"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={saveHighScore}
                  disabled={isSaving}
                  className="w-full bg-green-600 hover:bg-green-600 text-white font-bold py-4 transition-all"
                >
                  {isSaving ? "SAVING..." : "SAVE SCORE & RESTART"}
                </button>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 transition-all"
                >
                  DISCARD
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full max-w-xl shrink-0 pb-4">
        <div className="max-w-xl w-full mx-auto px-2">
          {[
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"],
          ].map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center mb-2 gap-1">
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => onKeyPress(key)}
                  className={`h-14 font-bold transition-all flex items-center justify-center text-white
                ${key.length > 1 ? "px-4 text-xs bg-gray-500" : "flex-1 max-w-[40px] text-md"}
                ${keyStatuses[key] || "bg-gray-400 hover:bg-gray-500"}`}
                >
                  {key == "DEL" ? (
                    <FontAwesomeIcon size="lg" icon={faBackspace} />
                  ) : (
                    key
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
