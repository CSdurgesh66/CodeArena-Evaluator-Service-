// strategy/JavaExecutionStrategy.ts


import runCpp from "../containers/runCppDocker";
import { CodeExecutionStrategy } from "../types/CodeExecutionStrategy";
import DockerStreamOutput from "../types/dockerStreamOutput";

export class CppExecutionStrategy implements CodeExecutionStrategy{

    async run(code: string, inputCase: string): Promise<DockerStreamOutput> {
        return runCpp(code, inputCase);
    }

}
