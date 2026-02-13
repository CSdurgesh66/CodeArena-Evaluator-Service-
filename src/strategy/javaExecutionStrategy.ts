// strategy/JavaExecutionStrategy.ts


import runJava from "../containers/runJavaDocker";
import { CodeExecutionStrategy } from "../types/CodeExecutionStrategy";
import DockerStreamOutput from "../types/dockerStreamOutput";

export class JavaExecutionStrategy implements CodeExecutionStrategy{

    async run(code: string, inputCase: string): Promise<DockerStreamOutput> {
        return runJava(code, inputCase);
    }

}
