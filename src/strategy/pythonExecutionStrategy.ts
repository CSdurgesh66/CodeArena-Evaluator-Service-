import runPython from "../containers/runPythonDocker";
import { CodeExecutionStrategy } from "../types/CodeExecutionStrategy";

export class PythonExecutionStrategy implements CodeExecutionStrategy {

    async run(code: string, inputCase: string, outputCase: string){
        return runPython(code, inputCase, outputCase);
    }
}