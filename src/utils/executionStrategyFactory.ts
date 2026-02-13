import { JavaExecutionStrategy } from "../strategy/javaExecutionStrategy";
import { PythonExecutionStrategy } from "../strategy/pythonExecutionStrategy";
import { CppExecutionStrategy } from "../strategy/cppExecutionStrategy";
import { CodeExecutionStrategy } from "../types/CodeExecutionStrategy";

export function getExecutionStrategy(language: string): CodeExecutionStrategy {

    switch (language.toLowerCase()) {
        case "java":
            return new JavaExecutionStrategy();

        case "python":
            return new PythonExecutionStrategy();

        case "cpp":
            return new CppExecutionStrategy();

        default:
            throw new Error("Unsupported language");
    }
}
