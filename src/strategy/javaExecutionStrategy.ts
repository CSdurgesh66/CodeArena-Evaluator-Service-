import runJava from "../containers/runJavaDocker";
import { CodeExecutionStrategy } from "../types/CodeExecutionStrategy";

export class JavaExecutionStrategy implements CodeExecutionStrategy{

    async run(code: string, inputCase: string,outputCase:string){
        return runJava(code, inputCase,outputCase);
    }

}
