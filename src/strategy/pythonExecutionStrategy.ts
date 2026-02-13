import runPython from "../containers/runPythonDocker";
import { CodeExecutionStrategy } from "../types/CodeExecutionStrategy";
import DockerStreamOutput from "../types/dockerStreamOutput";

export class PythonExecutionStrategy implements CodeExecutionStrategy{

    async run(code:string,inputCase:string): Promise<DockerStreamOutput> {
        return runPython(code,inputCase);
    }
}