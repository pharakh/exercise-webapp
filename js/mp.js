var started_exercise = false;
var calculate_debug_data = false;
var finished_course = false;

exer_ob = [
    {
        name: 'پروانه',
        type: 'time',
        gif_name: 'jumping_jack.gif',
        reps: 20,
        rest: 5,
        finished: false,
        initiated: false,
        score: undefined
    },

    {
        name: 'اسکوات',
        type: 'number',
        gif_name: 'squat.gif',
        reps: 5,
        rest: 20,
        finished: false,
        initiated: false,
        score: undefined
    },

    {
        name: 'خم شدن به جلو',
        type: 'number',
        gif_name: 'forward_bend.gif',
        reps: 5,
        rest: 0,
        finished: false,
        initiated: false,
        score: undefined
    },
];

var fill_color = '#00FF00';


const POSE_LANDMARKS = {
    NOSE: 0,
    LEFT_EYE_INNER: 1,
    LEFT_EYE: 2,
    LEFT_EYE_OUTER: 3,
    RIGHT_EYE_INNER: 4,
    RIGHT_EYE: 5,
    RIGHT_EYE_OUTER: 6,
    LEFT_EAR: 7,
    RIGHT_EAR: 8,
    LEFT_RIGHT: 9,
    RIGHT_LEFT: 10,
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,
    LEFT_PINKY: 17,
    RIGHT_PINKY: 18,
    LEFT_INDEX: 19,
    RIGHT_INDEX: 20,
    LEFT_THUMB: 21,
    RIGHT_THUMB: 22,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
    LEFT_KNEE: 25,
    RIGHT_KNEE: 26,
    LEFT_ANKLE: 27,
    RIGHT_ANKLE: 28,
    LEFT_HEEL: 29,
    RIGHT_HEEL: 30,
    LEFT_FOOT_INDEX: 31,
    RIGHT_FOOT_INDEX: 32
};
const POSE_LANDMARKS_LEFT = {
    LEFT_EYE_INNER: 1,
    LEFT_EYE: 2,
    LEFT_EYE_OUTER: 3,
    LEFT_EAR: 7,
    LEFT_RIGHT: 9,
    LEFT_SHOULDER: 11,
    LEFT_ELBOW: 13,
    LEFT_WRIST: 15,
    LEFT_PINKY: 17,
    LEFT_INDEX: 19,
    LEFT_THUMB: 21,
    LEFT_HIP: 23,
    LEFT_KNEE: 25,
    LEFT_ANKLE: 27,
    LEFT_HEEL: 29,
    LEFT_FOOT_INDEX: 31
};
const POSE_LANDMARKS_RIGHT = {
    RIGHT_EYE_INNER: 4,
    RIGHT_EYE: 5,
    RIGHT_EYE_OUTER: 6,
    RIGHT_EAR: 8,
    RIGHT_LEFT: 10,
    RIGHT_SHOULDER: 12,
    RIGHT_ELBOW: 14,
    RIGHT_WRIST: 16,
    RIGHT_PINKY: 18,
    RIGHT_INDEX: 20,
    RIGHT_THUMB: 22,
    RIGHT_HIP: 24,
    RIGHT_KNEE: 26,
    RIGHT_ANKLE: 28,
    RIGHT_HEEL: 30,
    RIGHT_FOOT_INDEX: 32
};
const POSE_LANDMARKS_NEUTRAL = {
    NOSE: 0
};

const videoElement = document.querySelector('video.input_video');
const canvasElement = document.querySelector('canvas.output_canvas');
const canvasCtx = canvasElement.getContext('2d');

document.querySelector('div.visible').style.cssText = `
            display: block;
            left: ${window.innerWidth / 2}px;
            top: ${window.innerHeight / 2}px;
        `;

var timer = 0;
var timer_started = false;
var timer_paused = false;
setInterval(() => {if (!timer_paused) timer++}, 100);

function timer_state(setstate) {
    if (setstate === 'start' && !timer_started) {timer = 0; timer_started = true};
    if (setstate === 'pause') {timer_paused = true;}
    if (setstate === 'unpause') {timer_paused = false;}
    if (setstate === 'stop') {timer = 0; timer_started = false;}
}

var all_landmarks;
var degrees = {
    lagan_chap: {
        angle: [undefined, undefined, undefined],
        points: {
            1: "LEFT_SHOULDER",
            2: "LEFT_HIP",
            3: "LEFT_KNEE"
        }
    },
    lagan_rast: {
        angle: [undefined, undefined, undefined],
        points: {
            1: "RIGHT_SHOULDER",
            2: "RIGHT_HIP",
            3: "RIGHT_KNEE"
        }
    },
    ketf_chap: {
        angle: [undefined, undefined, undefined],
        points: {
            1: "LEFT_HIP",
            2: "LEFT_SHOULDER",
            3: "LEFT_ELBOW"
        }
    },
    ketf_rast: {
        angle: [undefined, undefined, undefined],
        points: {
            1: "RIGHT_ELBOW",
            2: "RIGHT_SHOULDER",
            3: "RIGHT_HIP"
        }
    },
    arenj_chap: {
        angle: [undefined, undefined, undefined],
        points: {
            1: "LEFT_SHOULDER",
            2: "LEFT_ELBOW",
            3: "LEFT_WRIST"
        }
    },
    arenj_rast: {
        angle: [undefined, undefined, undefined],
        points: {
            1: "RIGHT_SHOULDER",
            2: "RIGHT_ELBOW",
            3: "RIGHT_WRIST"
        }
    },
    zanoo_chap: {
        angle: [undefined, undefined, undefined],
        points: {
            1: "LEFT_ANKLE",
            2: "LEFT_KNEE",
            3: "LEFT_HIP"
        }
    },
    zanoo_rast: {
        angle: [undefined, undefined, undefined],
        points: {
            1: "RIGHT_ANKLE",
            2: "RIGHT_KNEE",
            3: "RIGHT_HIP"
        }
    },
    beyn_pa: {
        angle: [undefined, undefined, undefined],
        points: {
            1: "LEFT_ANKLE",
            2: "NOSE",
            3: "RIGHT_ANKLE"
        }
    },
    beyn_dast: {
        angle: [undefined, undefined, undefined],
        points: {
            1: "RIGHT_WRIST",
            2: "NOSE",
            3: "LEFT_WRIST"
        }
    }
}
var history_landmarks = {
    0: undefined,
    1: undefined,
    2: undefined
}


// all things that needs to be done in each frame after getting the results from pose
function onResults(results) {

    // a function that will be called on each frame! => checks for active excercises and does the things

    if (!finished_course)
    {
    
        if (!results.poseLandmarks) {
            document.querySelector('div.visible').style.cssText = `
                display: block;
                left: ${window.innerWidth / 2}px;
                top: ${window.innerHeight / 2}px;
            `;
            canvasElement.style.display = 'none';
            helper_elements.style.display = 'none';
            timer_state('pause');
            return;
        }

        document.querySelector('div.visible').style.display = 'none';
        canvasElement.style.display = 'block';

        all_landmarks = results.poseLandmarks;

        update_history();

        start_till_finish_UI();

        if (started_exercise) {
            timer_state('unpause');
            assign_exercise();
            if (!exer_ob[active_excercise['index']]['initiated']) {
                exercise_ui.style.display = 'none';
                canvasElement.style.display = 'none';
                initiate_exercise();
            } else {
                exercise_ui.style.display = 'block';
                canvas_pic(results);
                detection();
                update_ui();
            }
        }

        // update_angles(["arenj_chap", "ketf_chap", "lagan_chap", "zanoo_chap"]); 

        if (calculate_debug_data) debug_data();
    } else {
        canvasElement.style.display = 'none';
        helper_elements.style.display = 'none';
        exercise_ui.style.display = 'none';

        let results_rows = '';

        for (var k in exer_ob)
        {
            let cur_score = parseInt(exer_ob[k]['score']);
            if (cur_score < 40) results_rows += `<tr class="bg-danger"><td>${exer_ob[k]['name']}</td><td>${cur_score}</td></tr>`
            else if (cur_score > 40 && cur_score < 60) results_rows += `<tr class="bg-info"><td>${exer_ob[k]['name']}</td><td>${cur_score}</td></tr>`
            else if (cur_score > 60) results_rows += `<tr class="bg-success"><td>${exer_ob[k]['name']}</td><td>${cur_score}</td></tr>`
        }

        document.querySelector('div.results').innerHTML = `
        <table class="table table-sark">
            <tr class="table-dark"><th>نام ورزش</th><th>امتیاز از صد</th></tr>
            ${results_rows}
        </table>
        `;
    }
}


// The part in which the pose results stuff is done (or initiated. IDK)
const pose = new Pose({locateFile: (file) => {
    console.log(file);
    // if you want your files from server
    // return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    // if you want to use the files locally
    return `/pose/${file}`;
}});
pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
pose.onResults(onResults);

// in each frame camera sends the frame to pose and pose does the stuff it needs to do
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({image: videoElement});
    },
    width: 1280,
    height: 720
});
camera.start();


function canvas_pic(results) {
    canvasCtx.save();
    // sets the pixels in a rectangular area to transparent black [clearRect(x, y, width, height)]
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.segmentationMask, 0, 0,
                        canvasElement.width, canvasElement.height);

    // Only overwrite existing pixels. 
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    // The new shape is drawn only where both the new shape and the destination canvas overlap. Everything else is made transparent.
    canvasCtx.globalCompositeOperation = 'source-in';
    canvasCtx.fillStyle = fill_color;
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite missing pixels.
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    // The existing canvas is only kept where it overlaps the new shape. The new shape is drawn behind the canvas content.
    canvasCtx.globalCompositeOperation = 'destination-atop';
    // provides different ways to draw an image onto the canvas.
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    // [drawImage(image, dx, dy, dWidth, dHeight)]
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // This is the default setting and draws new shapes on top of the existing canvas content.
    canvasCtx.globalCompositeOperation = 'source-over';
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                    {color: '#0000FF', lineWidth: 4});
    drawLandmarks(canvasCtx, results.poseLandmarks,
                    {color: '#FF0000', lineWidth: 2});
    canvasCtx.restore();
}

function debug_data() {
    for (const landmark in POSE_LANDMARKS_LEFT) {
        const landx = document.querySelector(`div.debug div.left tr[id="${landmark}"] td[class="x"]`);
        const landy = document.querySelector(`div.debug div.left tr[id="${landmark}"] td[class="y"]`);
        const landz = document.querySelector(`div.debug div.left tr[id="${landmark}"] td[class="z"]`);
        const landv = document.querySelector(`div.debug div.left tr[id="${landmark}"] td[class="v"]`);
        const values = all_landmarks[POSE_LANDMARKS_LEFT[landmark]];
        landx.innerHTML = values['x'].toFixed(2);
        landy.innerHTML = values['y'].toFixed(2);
        landz.innerHTML = values['z'].toFixed(2);
        landv.innerHTML = values['visibility'].toFixed(2);
    }
        
    for (const landmark in POSE_LANDMARKS_RIGHT) {
        const landx = document.querySelector(`div.debug div.right tr[id="${landmark}"] td[class="x"]`);
        const landy = document.querySelector(`div.debug div.right tr[id="${landmark}"] td[class="y"]`);
        const landz = document.querySelector(`div.debug div.right tr[id="${landmark}"] td[class="z"]`);
        const landv = document.querySelector(`div.debug div.right tr[id="${landmark}"] td[class="v"]`);
        const values = all_landmarks[POSE_LANDMARKS_RIGHT[landmark]];
        landx.innerHTML = values['x'].toFixed(2);
        landy.innerHTML = values['y'].toFixed(2);
        landz.innerHTML = values['z'].toFixed(2);
        landv.innerHTML = values['visibility'].toFixed(2);
    }

    const landx = document.querySelector(`div.debug div.center tr[id="NOSE"] td[class="x"]`);
    const landy = document.querySelector(`div.debug div.center tr[id="NOSE"] td[class="y"]`);
    const landz = document.querySelector(`div.debug div.center tr[id="NOSE"] td[class="z"]`);
    const landv = document.querySelector(`div.debug div.center tr[id="NOSE"] td[class="v"]`);
    const values = all_landmarks[POSE_LANDMARKS_NEUTRAL["NOSE"]];
    landx.innerHTML = values['x'].toFixed(2);
    landy.innerHTML = values['y'].toFixed(2);
    landz.innerHTML = values['z'].toFixed(2);
    landv.innerHTML = values['visibility'].toFixed(2);

    document.querySelector(`div.debug div.degrees tr[id="lagan_chap"] td[class="a"]`).innerHTML = mean_calc(['lagan_chap', 'lagan_rast'], 0, 'angle');
    document.querySelector(`div.debug div.degrees tr[id="ketf_chap"] td[class="a"]`).innerHTML = degrees['ketf_chap']['angle'][0];
    document.querySelector(`div.debug div.degrees tr[id="arenj_chap"] td[class="a"]`).innerHTML = degrees['arenj_chap']['angle'][0];
    document.querySelector(`div.debug div.degrees tr[id="zanoo_chap"] td[class="a"]`).innerHTML = mean_calc(['zanoo_chap', 'zanoo_rast'], 0, 'angle');
    document.querySelector(`div.debug div.degrees tr[id="beyn_pa"] td[class="a"]`).innerHTML = degrees['beyn_pa']['angle'][0];

}

function angle_calc(first, middle, last, type) {

    if (type === "3D") {
        const xyz = {x: 0, y: 0, z: 0};

        const vec1 = {x: 0, y: 0, z: 0};
        const vec2 = {x: 0, y: 0, z: 0};

        let dot = 0; let mag_vec1 = 0; let mag_vec2 = 0;

        for (const point in xyz) {
            vec1[point] = first[point] - middle[point];
            vec2[point] = last[point] - middle[point];
        }

        for (const point in xyz) {
            dot += vec1[point] * vec2[point];
        }

        for (const point in xyz) {
            mag_vec1 += vec1[point] ** 2;
            mag_vec2 += vec2[point] ** 2;
        }

        mag_vec1 = mag_vec1 ** 0.5;
        mag_vec2 = mag_vec2 ** 0.5;

        angle = Math.acos(dot/(mag_vec1*mag_vec2));

        angle = angle * (180/Math.PI);

    } else if (type === "2DSIDE") {
        angle = Math.atan2((last['y'] - middle['y']), (last['x'] - middle['x'])) - Math.atan2((first['y'] - middle['y']), (first['x'] - middle['x']))
        angle = angle * (180/Math.PI);
        if (angle < 0) {
            angle += 360;
        }
    } else if (type === "2DFRONT") {
        angle = Math.atan2((last['y'] - middle['y']), (last['z'] - middle['z'])) - Math.atan2((first['y'] - middle['y']), (first['z'] - middle['z']))
        angle = angle * (180/Math.PI);
    }

    return angle;
}

function mean_calc(points, history, type) {

    if (type === 'xyz')
    {
        let average = {
            x: 0,
            y: 0,
            z: 0
        };
        points.forEach(point => {
            ['x', 'y', 'z'].forEach(p => average[p] += history_landmarks[history][POSE_LANDMARKS[point]][p]);
        });
        let length = points.length;
        ['x', 'y', 'z'].forEach(p => {
            average[p] /= length;
            average[p] = parseFloat(average[p].toFixed(2));
        });

        return average;
    }

    if (type === 'angle') {
        let average = 0;
        points.forEach(point => {
            average += parseFloat(degrees[point]['angle'][history]);
        });
        average /= points.length;

        return parseFloat(average.toFixed(2));
    }

    if (type === 'diff-angle') {
        let average = [0, 0, 0];
        let length = points.length;
        // each "point" should be an array of 3 elements
        for (let i = 0; i < 3; i++) points.forEach(point => average[i] += parseFloat(point[i]));
        // console.log(average)
        for (let i = 0; i < 3; i++) average[i] /= length;
        
        diff_avg = Math.abs(((average[2] - average[1]) + (average[1] - average[0])) / 2);

        return diff_avg;
    }

    if (type === 'normal') {
        let average = 0;
        // points here are numbers
        points.forEach(p => average += p);
        average /= points.length

        return Math.abs(average);
    }
}

function update_angles(joints, method) {

    // you give the list of joints that you want the angles of; it updates those angles for you :D

    if (method === undefined) method = '2DSIDE';

    joints.forEach(joint => {
        degrees[joint]['angle'][2] = degrees[joint]['angle'][1];
        degrees[joint]['angle'][1] = degrees[joint]['angle'][0];
        degrees[joint]['angle'][0] = angle_calc(
            all_landmarks[POSE_LANDMARKS[degrees[joint]['points']['1']]],
            all_landmarks[POSE_LANDMARKS[degrees[joint]['points']['2']]],
            all_landmarks[POSE_LANDMARKS[degrees[joint]['points']['3']]],
            method
        ).toFixed(2);
    });

}

function update_ui() {
    const name = document.querySelector('div.UIElements div.CurrentExercise p');
    const prog = document.querySelector('div.UIElements div.Progress p');
    const feedbk = document.querySelector('div.Feedback div.progress div.progress-bar');

    name.innerHTML = active_excercise['name'];
    prog.innerHTML = `${active_excercise['done']}/${active_excercise['reps']}`;
    feedbk.style.width = active_excercise['feedback'];
    feedbk.style.backgroundColor = active_excercise['feedback_color'];
}

function update_history() {
    history_landmarks["2"] = history_landmarks["1"];
    history_landmarks["1"] = history_landmarks["0"];
    history_landmarks["0"] = all_landmarks;
}

// All excesices function will be written here
var p_best_averg = 0;
var history_averg = [0,0,0,0,0,0];
var num_score = 0.01;
var total_score = 0.01;

function Squat() {

    update_angles(["lagan_chap", "lagan_rast", "zanoo_chap", "zanoo_rast"]);
    let hip_ang1 = mean_calc(['lagan_chap', 'lagan_rast'], 0, 'angle');
    let knee_ang1 = mean_calc(['zanoo_chap', 'zanoo_rast'], 0, 'angle');

    let averg = (hip_ang1 + knee_ang1) / 2;
    let best_averg = 50;
    let worst_averg = 85;

    if (active_excercise['waswhere'] === 'squatted') {
        console.log("hi");
        // means user have squatted (na hatman stood!)
        if (averg > 160 && averg < 190) {
            // it means the person has stood
            active_excercise['waswhere'] = 'stood';
            active_excercise['done']++;
            let score = ((worst_averg - p_best_averg) / (worst_averg - best_averg)) * 100;
            total_score += score;
            num_score++;
            active_excercise['feedback'] = `${score}%`;
            p_best_averg = 0;
            return;
        } else {
            // the user not yet stood (maybe still going down)
            // calculate lowest averg!
            if (averg < p_best_averg) p_best_averg = averg;
            return;
        }
    } else if (active_excercise['waswhere'] === 'stood') {
        console.log("hello");
        // mean the user have just started or stood
        if (averg > 20 && averg < worst_averg) {
            // it means the user is squatting
            active_excercise['waswhere'] = 'squatted';
            p_best_averg = averg;
            return;
        } else {
            // the user not yet squatted
            return;
        }
    }
}

function JumpingJack() {

    update_angles(['beyn_pa', 'beyn_dast']);

    let beyn_pa = degrees['beyn_pa']['angle'];
    let beyn_dast = degrees['beyn_dast']['angle'];

    // first check if all history of angles is populated if not, return
    if (beyn_pa[2] === undefined || beyn_dast[2] === undefined) return;

    timer_state('start');

    let best_averg = 50;
    let worst_averg = 0;
    let inter_averg = best_averg - worst_averg;
    let total_time = active_excercise['reps'] * 10;

    active_excercise['done'] = Math.round(timer / 10);

    // if difference between angles is higher than 5 degrees, then perhaps...
    // the person is moving (doing jumping jack). [lowest degree beyn_pa is ~3, highest ~20]

    // let diff_avg = ((beyn_dast[2] - beyn_dast[1]) + (beyn_dast[1] - beyn_dast[0])) / 2;
    // diff_avg = Math.abs(diff_avg);

    let diff_avg = mean_calc([beyn_dast, beyn_pa], undefined, 'diff-angle');

    if (diff_avg > best_averg) diff_avg = best_averg;

    history_averg[0] = diff_avg;

    for (var j = (history_averg.length - 1); j > 0; j--) history_averg[j] = history_averg[j - 1];

    let mean_his = mean_calc(history_averg, undefined, 'normal');
    
    diff_avg = mean_his;

    let color_ = Math.abs(((diff_avg - worst_averg) / inter_averg) * 255) + 20;

    active_excercise['feedback_color'] = `rgb(
                                            ${255 - color_}, 
                                            ${color_},
                                            0)`;

    let score = ((diff_avg - worst_averg) / inter_averg) * 100;
    total_score += score;
    num_score++;

    active_excercise['feedback'] = `${(timer / total_time) * 100}%`;
}

function ForwardBend() {
    update_angles(["lagan_chap", "lagan_rast"]);


    let averg = mean_calc(['lagan_chap', 'lagan_rast'], 0, 'angle');
    let best_averg = 40;
    let worst_averg = 100;

    if (active_excercise['waswhere'] === 'bent') {
        // means user have bent (na hatman stood!)
        if (averg > 170 && averg < 190) {
            // it means the person has stood
            active_excercise['waswhere'] = 'stood';
            active_excercise['done']++;
            if (p_best_averg < best_averg) p_best_averg = best_averg;
            let score = ((worst_averg - p_best_averg) / (worst_averg - best_averg)) * 100;
            total_score += score;
            num_score++;
            active_excercise['feedback'] = `${score}%`;
            p_best_averg = 0;
            return;
        } else {
            // the user not yet stood (maybe still going down)
            // calculate lowest averg!
            if (averg < p_best_averg) p_best_averg = averg;
            return;
        }
    } else if (active_excercise['waswhere'] === 'stood') {
        // mean the user have just started or stood
        if (averg > best_averg && averg < worst_averg) {
            // it means the user is bending
            active_excercise['waswhere'] = 'bent';
            p_best_averg = averg;
            return;
        } else {
            // the user not yet bent
            return;
        }
    }
}
// All excesices function will be written here

var active_excercise = {
    index: undefined,
    name: undefined,
    type: undefined,
    reps: undefined,
    done: 0,
    // in each rep, we look at (some) features if user did all those rules then their score (feedback) will be 100%
    // for excercises with type 'time'; feedback is changed in each iteration (if they were good the bar is blue if not red)
    feedback: '0%',
    feedback_color: '',
    // waswhere helps us to know in which position the person was
    waswhere: 'stood'
}

var active_rest = {
    isactive: false,
    rest: 20
}

function detection() {
    // start detecting only if all history is populated and none is undefined
    if (undefined === history_landmarks['0'] ||
        undefined === history_landmarks['1'] ||
        undefined === history_landmarks['2']) return;
        
    if (active_excercise['name'] === 'اسکوات') Squat();
    if (active_excercise['name'] === 'پروانه') JumpingJack();
    if (active_excercise['name'] === 'خم شدن به جلو') ForwardBend();

    if (active_excercise['done'] === active_excercise['reps']) 
    {
        p_best_averg = 0;
        timer_state('stop');
        let index = active_excercise['index'];
        exer_ob[index]['finished'] = true;
        exer_ob[index]['score'] = (total_score / num_score);
        active_excercise['feedback_color'] = '';
    }
}

var helper_elements = document.querySelector('div.helper');
var exercise_ui = document.querySelector('div.exercise_data');
var wait_ui = document.querySelector('div.wait p');
var start_help = document.querySelector('div.helper div.start');
var start_degree = document.querySelector('div.helper div.start div.progress_ div#middle-circle');
var start_timer = document.querySelector('div.helper div.start div.progress_ div#progress-spinner');

function start_till_finish_UI() {
    helper_elements.style.display = 'block';

    if (!started_exercise)
    {
        start_help.style.display = 'block';

        update_angles(['ketf_rast', 'ketf_chap'], '3D');

        let ang_dast = mean_calc(['ketf_rast', 'ketf_chap'], 0, 'angle');
    
        start_degree.innerHTML = parseInt(ang_dast);
    
        let start_wait = 10;
    
        if (ang_dast > 35 && ang_dast < 50)
        {
            timer_state('start');
            let percentage = ((timer / 10) / start_wait) * 100;
            start_timer.style.background = `conic-gradient(rgb(3, 133, 255) ${percentage}%, rgb(242, 242, 242) ${percentage}%)`;
        } else {
            timer = 0;
            start_timer.style.background = ``;
        }

        if ((timer / 10) > start_wait) {
            started_exercise = true;
            start_help.style.display = 'none';
            timer_state('stop');
        }
    } else {
        start_help.style.display = 'none';
        exercise_ui.style.display = 'block';
    }
}

function assign_exercise() {
    for (var i in exer_ob)
    {
        if (!exer_ob[i]['finished']) 
        {
            if (!exer_ob[i]['initiated'])
            {
                active_excercise['name'] = exer_ob[i]['name'];
                active_excercise['type'] = exer_ob[i]['type'];
                active_excercise['reps'] = exer_ob[i]['reps'];
                active_excercise['waswhere'] = 'stood';
                active_excercise['done'] = 0;
                active_excercise['index'] = i;
            }
            return;
        }
    }

    // if we are here then all exercises must have been finished
    finished_course = true;
}

function initiate_exercise() {
    var wait_time = 10;

    wait_ui.style.display = 'block';

    if (exer_ob[active_excercise['index']]['gif_name'] !== 'inserted') 
    {
        document.querySelector('div.pictures').innerHTML = `<img src="gifs/${exer_ob[active_excercise['index']]['gif_name']}">`;
        exer_ob[active_excercise['index']]['gif_name'] = 'inserted';
        document.querySelector('div.pictures img').style.minWidth = '400px';
    }
    timer_state('start');

    wait_ui.innerHTML = `حرکت بعدی ${active_excercise['name']} می‌باشد... ${parseInt(wait_time - (timer / 10))} ثانیه باقی`;

    if ((timer / 10) > wait_time) {

        total_score = 0.01; num_score = 0.01;

        exer_ob[active_excercise['index']]['initiated'] = true;
        timer_state('stop');
        wait_ui.style.display = 'none';

        document.querySelector('div.pictures img').style.maxWidth = '100px';
        document.querySelector('div.pictures img').style.minWidth = '';
    }
}

const debug_show = document.querySelector('div.debug');

document.onkeydown = function (e) {
    if (e.code == 'Backquote') 
    {
        if (!calculate_debug_data) {debug_show.style.display = 'block'; calculate_debug_data = true;}
        else if (calculate_debug_data) {debug_show.style.display = 'none'; calculate_debug_data = false;}
    }
};

// also I should use threejs here to make the rigdoll (maybe not)