import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "../../../bank-server/src";

export type bankType = inferProcedureOutput<AppRouter['bank']['getBanks']>;