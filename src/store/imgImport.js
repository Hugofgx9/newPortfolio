import images from '../../audio/voice/*.mp3';
import vtt from '../../audio/voice/*.vtt';

const voice = {
/*	intro: {
		audio: mp3['1.introduction'],
		vtt: vtt['1.introduction'],
	},*/
};

for (let file in mp3) {
	let obj = {};
	obj.mp3 = mp3[file];

	if (vtt[file]) obj.vtt = vtt[file];

	//fill voice
	voice[file] = obj;
}

export default voice;
