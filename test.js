import { LexoRank } from "lexorank";
const arr = [];

const lexoRank = LexoRank.middle();
const lexorRankStr = lexoRank.toString();

const parsedLexoRank = LexoRank.parse(lexorRankStr);
arr.push(parsedLexoRank.toString());

const any2LexoRank = parsedLexoRank.genPrev();
arr.push(any2LexoRank.toString());

const betweenLexoRank = any2LexoRank.between(parsedLexoRank);
arr.push(betweenLexoRank.toString());

console.log(arr);
console.log(arr.sort());
