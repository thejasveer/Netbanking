import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../server/src";

export type bankType = inferProcedureOutput<AppRouter['bank']['getBanks']>;