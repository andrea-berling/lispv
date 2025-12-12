// @ts-ignore
import { main as main_environment } from "./environment"
import { main as main_interpreter } from "./interpreter"
import { main as main_application } from "./application"
import { main as main_assembly } from "./assembly"

import "../src/lang/grammar";

main_assembly();
