import dbConnect from "../../../lib/dbConnect";
import Bracket from "../../../model/Bracket";
import { TeamModel } from "../../../model/Team";
import { NextResponse } from "next/server";
import Tournament from "../../../model/Tournament";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";
import { type } from "os";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 },
      );
    }

    const brackets = await Bracket.find({ userId: session.user._id });

    return NextResponse.json(brackets, { status: 200 });
  } catch (error) {
    console.error("Error fetching brackets:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        data: [],
        message: "Error fetching brackets",
      }),
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 },
      );
    }

    const { tournament_name, format, consolationFinal, grandFinalType, teams } =
      body;

    const userId = session.user._id;

    if (
      !tournament_name ||
      !format ||
      !grandFinalType ||
      typeof consolationFinal !== "boolean" ||
      !teams ||
      teams.length < 4
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid input: Ensure all fields are filled and at least 4 teams are provided.",
        },
        { status: 400 },
      );
    }

    let matches = generateMatches(format, teams, consolationFinal);

    console.log("UserId", session.user._id);

    const newBracket = new Bracket({
      tournament_name,
      format,
      consolationFinal,
      grandFinalType,
      matches,
      teams,
      userId,
    });
    console.log(newBracket);

    await newBracket.save();

    return NextResponse.json(
      { message: "Bracket created successfully", id: newBracket._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating bracket:", error);
    return NextResponse.json(
      {
        error: "Error creating bracket",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

function generateMatches(format, teams, consolationFinal) {
  let matches = [];

  if (format === "single_elimination") {
    matches = generateSingleElimination(teams, consolationFinal);
  } else if (format === "double_elimination") {
    matches = generateDoubleElimination(teams, consolationFinal);
  } else if (format === "round_robin") {
    matches = generateRoundRobin(teams);
  }

  return matches;
}

// This function helps to generate the single elimination bracket for first round
// and for the later rounds we need to generate the matches based on the winner of the previous round
function generateSingleElimination(teams, consolationFinal) {
  let round = 1;
  let matches = [];
  let currentTeams = [...teams];

  // If the number of teams is odd, add a "BYE" team for the perfect match-up
  if (currentTeams.length % 2 !== 0) {
    currentTeams.push("BYE");
  }

  // Generate rounds until we have 1 winner
  while (currentTeams.length > 1) {
    let numMatches = currentTeams.length / 2;
    let roundMatches = [];

    for (let i = 0; i < numMatches; i++) {
      const team1 = currentTeams[i * 2];
      const team2 = currentTeams[i * 2 + 1];

      if (team1 !== "BYE" && team2 !== "BYE") {
        roundMatches.push({
          round: round,
          team1: team1,
          team2: team2,
          winner: null, // Winner will be determined later
        });
      } else if (team1 === "BYE") {
        roundMatches.push({
          round: round,
          team1: team2,
          team2: null,
          winner: team2, // Team 2 wins by default
        });
      } else if (team2 === "BYE") {
        roundMatches.push({
          round: round,
          team1: team1,
          team2: null,
          winner: team1, // Team 1 wins by default
        });
      }
    }

    matches.push(...roundMatches);
    // Update the currentTeams array with the winners of the current round
    currentTeams = roundMatches.map((match) => match.winner);

    round++;
  }
  // this is for the consolation final where we decide the 3rd place
  if (consolationFinal && matches.length >= 2) {
    const semiFinal = [
      matches[matches.length - 2].team1,
      matches[matches.length - 2].team2,
    ];

    matches.push({
      round: round,
      team1: semiFinal[0],
      team2: semiFinal[1],
    });
  }
  return matches;
}

// This function helps for the initail round of the double elimination bracket to generate the matches
// for later we need to generate the matches based on the winner and loser bracket manually
function generateDoubleElimination(teams, consolationFinal) {
  let matches = [];
  let winnerBracket = [...teams];
  let loserBracket = [];

  // reusing the single elimination to generating for the winner bracket
  let winnersMatches = generateSingleElimination(winnerBracket);
  matches.push(...winnersMatches);

  let losers = {}; // objects which stores the losers data

  winnersMatches.forEach((match) => {
    if (!losers[match.round]) losers[match.round] = [];
    if (match.winner)
      losers[match.round].push(
        match.team1 === match.winner ? match.team2 : match.team1,
      );
  });

  loserBracket = Object.values(losers).flat().filter(Boolean);

  // generate the loser bracket
  let loserMatches = generateSingleElimination(loserBracket);
  matches.push(...loserMatches);

  // generate the grand final
  let grandFinal = {
    round: Math.max(...matches.map((match) => match.round)) + 1,
    team1: null, // we need to add the winner of the winner bracket after conducting the winner bracket final
    team2: null, // we need to add the winner of the loser bracket after conducting the loser bracket final
    winner: null,
    type: "grand_final",
  };
  // find the winner of the grand final
  matches.push(grandFinal);

  if (consolationFinal) {
    // selecting the loser from the grand final for the 3rd place match
    let winnersBracketFinalLoser = +winnersMatches[winnersMatches.length - 2]
      .winner
      ? winnersMatches[winnersMatches.length - 2].winner === grandFinal.team1
        ? winnersMatches[winnersMatches.length - 2].team2
        : winnersMatches[winnersMatches.length - 2].team1
      : null;

    // selecting the looser from the loser bracket for the 3rd place match
    let loserBracektFinalLoser = +loserMatches[loserMatches.length - 1].winner
      ? loserMatches[loserMatches.length - 1].winner === grandFinal.team2
        ? loserMatches[loserMatches.length - 1].team1
        : loserMatches[loserMatches.length - 1].team2
      : null;

    matches.push({
      round: grandFinal.round + 1,
      team1: winnersBracketFinalLoser,
      team2: loserBracektFinalLoser,
      winner: null,
      type: "consolation_final",
    });
  }

  return matches;
}

function generateRoundRobin(teams) {}
