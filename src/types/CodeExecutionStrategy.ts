import DockerStreamOutput from "../types/dockerStreamOutput";

export interface CodeExecutionStrategy {
  run(code: string, inputCase: string): Promise<DockerStreamOutput>;
}