import Docker from "dockerode";
import pullImage from "./pullImage";

async function createContainer(imagename: string, cmdExecutable: string[]) {
    const docker = new Docker();
    try {

        console.log(`creating a container with ${imagename}`);

        await pullImage(imagename);

        console.log("pulled the image");
        
        const container = await docker.createContainer({
            Image: imagename,
            Cmd: cmdExecutable,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: false,
            HostConfig: {
                Memory: 2 * 1024 * 1024 * 1024, //  2GB
            },
            OpenStdin: true,
            StdinOnce: true,
        });


        console.log("successfully created a container");

        return container;


    } catch (error: any) {
        console.error("[Docker Error] Failed to create container.");
        console.log(error.message);
        throw error;
    }
}

export default createContainer;