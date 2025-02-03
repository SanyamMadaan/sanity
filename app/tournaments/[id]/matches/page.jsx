"use client";

import React, { useEffect, useState } from "react";

export default function TournamentMatches({ params }) {
  const [matches, setMatches] = useState([
    {
      id: 1,
      matchNumber: 1,
      roundNumber: 2,
      stageName: "Sanity",
      opponent1Name: "TBD",
      opponent2Name: "TBD",
      status: 1,
      groupId: 1,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unwrappedId = React.use(params);

  const fetchMatches = async () => {
    try {
      const response = await fetch(
        `/api/tournaments/${unwrappedId.id}/matches`,
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setMatches(data.matches);
    } catch (err) {
      setError(err.message);
      console.log("error while fetching matches " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchMatches();
    setLoading(false);
  }, [unwrappedId.id, fetchMatches]);

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "In Progress";
      case 2:
        return "Pending";
      case 3:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  if (loading) return <div className="text-white ml-1">Loading matches...</div>;
  if (error) return <div className="text-white ml-1">{error}</div>;
  if (matches.length == 0)
    return <div className="text-white">No new Matches</div>;

  return (
    <div className=" container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">
        Tournament Matches
      </h1>

      <div className="grid gap-4 mt-1">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-gray-700 border rounded-lg p-4 w-3/4 pb-6  md:w-1/3  shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-sm text-white">
                  Match {match.matchNumber} | Round {match.roundNumber} |{" "}
                  {match.stageName}
                </p>
                <div className="mt-2 space-y-2">
                  <p className="font-semibold text-white">
                    {match.opponent1Name}
                  </p>
                  <p className="text-white">vs</p>
                  <p className="font-semibold text-white">
                    {match.opponent2Name}
                  </p>
                </div>
              </div>

              <div
                className={`text-sm font-semibold ${
                  match.status === 3
                    ? "text-green-600"
                    : match.status === 1
                      ? "text-blue-600"
                      : "text-gray-600"
                }`}
              >
                {getStatusText(match.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// "use client"

// export default function TournamentMatches({ params }) {
//   return(<div className="bg-red-400">
//   kidda
//   </div>)
// }
