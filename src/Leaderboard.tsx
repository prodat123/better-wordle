import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type Entry = {
  name: string;
  score: number;
  country: string;
  created_at: string;
};

// Add props to receive the current player's data
interface Props {
  currentUser?: string;
  currentScore?: number;
}

export default function Leaderboard({ currentUser, currentScore }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  //   const [filter, setFilter] = useState({
  //     country: "ALL",
  //     sortBy: "score",
  //   });

  useEffect(() => {
    fetchLeaderboard();
    if (currentScore !== undefined) {
      fetchUserRank();
    }
  }, [currentScore]);

  const fetchLeaderboard = async () => {
    let query = supabase
      .from("highscores")
      .select("name, score, country, created_at")
      .limit(10);

    // if (filter.country !== "ALL") query = query.eq("country", filter.country);

    query = query.order("score", {
      ascending: false,
    });

    const { data } = await query;
    if (data) setEntries(data);
  };

  const fetchUserRank = async () => {
    // Call the RPC function we created in SQL
    const { data, error } = await supabase.rpc("get_user_rank", {
      p_score: currentScore,
      p_country: "ALL", // Default to all countries
    });

    if (!error) setUserRank(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-black mb-6 text-center text-yellow-500 italic">
        GLOBAL RANKINGS
      </h2>

      {/* USER STATS BOX (Sticky/Highlighted) */}
      {currentUser && (
        <div className="mb-6 p-4 bg-yellow-500 rounded-lg text-white flex justify-between items-center shadow-md">
          <div>
            <p className="text-xs font-bold uppercase opacity-80">
              Your Current Rank
            </p>
            <h3 className="text-2xl font-black">
              {userRank ? `#${userRank}` : "Unranked"}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase opacity-80">
              {currentUser}
            </p>
            <p className="text-xl font-mono">
              {currentScore?.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="space-y-2">
        {entries.map((player, idx) => {
          const isMe = player.name === currentUser?.toUpperCase();
          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-lg transition-transform hover:scale-[1.02] ${
                isMe
                  ? "bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`font-mono font-bold ${idx < 3 ? "text-yellow-600" : "text-gray-400"}`}
                >
                  #{idx + 1}
                </span>
                <span className="text-2xl">{getFlag(player.country)}</span>
                <span
                  className={`font-bold uppercase ${isMe ? "text-yellow-600" : "dark:text-white"}`}
                >
                  {player.name} {isMe && "(YOU)"}
                </span>
              </div>
              <span className="text-xl font-black text-green-500">
                {player.score.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getFlag(code: string) {
  if (code === "UN") return "🏳️";

  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
}
