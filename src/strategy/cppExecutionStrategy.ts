import runCpp from "../containers/runCppDocker";
import { CodeExecutionStrategy } from "../types/CodeExecutionStrategy";

export class CppExecutionStrategy implements CodeExecutionStrategy {
    async run(code: string, inputCase: string, outputCase: string){
        return runCpp(code, inputCase, outputCase);
    }
}
