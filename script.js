console.log('script loaded')

const obs = new OBSWebSocket();

async function main() {
    try {
        const {
            obsWebSocketVersion,
            negotiatedRpcVersion
        } = await obs.connect('ws://10.152.2.11:4455', 'env6rrwj4W1yKFj7', {
            rpcVersion: 1
        });
        console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)

        ChangeScene();

    } catch (error) {
        console.error('Failed to connect', error.code, error.message);
    }
}

function ChangeScene() {
    const start = document.getElementById('start');
    const pause = document.getElementById('pause');
    const end = document.getElementById('end');
    const cam = document.getElementById('cam');
    const jeu = document.getElementById('jeu');
    const donation = document.getElementById('donation');
    const bits_subs = document.getElementById('bits-subs');

    start.addEventListener('click', async () => {
        await obs.call('StartRecord');
        console.log('record started')
    })

    pause.addEventListener('click', async () => {
        await obs.call('SetCurrentProgramScene', { sceneName: 'cam' });
        console.log('Scene changed to : pause');
    })

    end.addEventListener('click', async () => {
        await obs.call('StopRecord');
        console.log('record stopped')
    })

    cam.addEventListener('click', async () => {
        await obs.call('SetCurrentProgramScene', { sceneName: 'cam' });
        console.log('Scene changed to : cam');
    })

    jeu.addEventListener('click', async () => {
        await obs.call('SetCurrentProgramScene', { sceneName: 'jeu' });
        console.log('Scene changed to : jeu');
    })

}

main();