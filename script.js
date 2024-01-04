function conn() {
    let ip = prompt('Enter IP address:');
    let mdp = prompt('Enter password:');

    return { ip, mdp };
}

if (!localStorage.getItem('ip')) {
    var { ip, mdp } = conn();
} else {
    var ip = localStorage.getItem('ip');
    var mdp = localStorage.getItem('mdp');
    console.log('IP from localStorage:', ip);
    console.log('Password from localStorage:', mdp);
}

console.log('script loaded')

const obs = new OBSWebSocket();

async function main() {
    try {
        const {
            obsWebSocketVersion,
            negotiatedRpcVersion
        } = await obs.connect('ws://' + ip + ':4455', mdp, {
            rpcVersion: 1
        });
        console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
        console.log('login registered');
        localStorage.setItem('ip', ip);
        localStorage.setItem('mdp', mdp);

        ChangeScene();

    } catch (error) {
        console.error('Failed to connect', error.code, error.message);
        if (error.code === 1006) {
            console.log('OBS IS CLOSED OR WRONG IP & PASSWORD, ACTUAL : '+ip, mdp);
            conn();
        }
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

    bits_subs.addEventListener('click', async () => {
        let media = await obs.call('GetSceneItemEnabled', { sceneName: 'jeu', sceneItemId: 3 });

        if (!media.sceneItemEnabled) {
            await obs.call('SetSceneItemEnabled', { sceneName: 'jeu', sceneItemId: 3, sceneItemEnabled: true });
        } else {
            await obs.call('SetSceneItemEnabled', { sceneName: 'jeu', sceneItemId: 3, sceneItemEnabled: false });
        }
    })

}

main();