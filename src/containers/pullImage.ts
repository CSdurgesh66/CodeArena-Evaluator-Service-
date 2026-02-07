import Docker from "dockerode";
import {Readable} from "stream"


export default function pullImage(imagename: string): Promise<void> {
    const docker = new Docker();
    console.log("pulling the image");
    return new Promise((resolve, reject) => {
        docker.pull(imagename, (err:Error | null, stream:Readable ) => {
            if (err) return reject(err);

            docker.modem.followProgress(stream, (err:Error | null) => {
                if (err) reject(err);
                else resolve();
            })
        });
    })

}